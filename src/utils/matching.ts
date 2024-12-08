import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  age: number;
  gender: string;
  preferred_gender: string[];
  travel_style: string;
  interests: string[];
  languages: string[];
  preferred_destinations: string[];
  bio: string;
  profile_image_url?: string | null;
}

// Helper function to calculate text similarity using Jaccard similarity
const calculateTextSimilarity = (text1: string, text2: string): number => {
  const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(Boolean));
  const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(Boolean));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Helper function to calculate array similarity
const calculateArraySimilarity = (arr1: string[], arr2: string[]): number => {
  const set1 = new Set(arr1.map(item => item.toLowerCase()));
  const set2 = new Set(arr2.map(item => item.toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Categories mapping for travel styles
const travelStyleCategories = {
  'adventure': ['hiking', 'mountains', 'sports', 'outdoor', 'extreme'],
  'cultural': ['museums', 'history', 'art', 'local', 'food'],
  'luxury': ['resorts', 'spa', 'fine dining', 'comfort'],
  'backpacker': ['budget', 'hostels', 'local transport', 'authentic'],
  'relaxation': ['beach', 'wellness', 'peaceful', 'nature']
};

// New function to get user's safety rating
const getUserSafetyRating = async (userId: string): Promise<number> => {
  try {
    const { data: ratings } = await supabase
      .rpc('get_user_ratings', { user_id: userId });
    
    if (!ratings?.length) return 0;
    
    const overallSafety = ratings.find(r => r.category === 'overall_safety');
    return overallSafety ? overallSafety.average_rating : 0;
  } catch (error) {
    console.error('Error fetching user safety rating:', error);
    return 0;
  }
};

// New function to get profile picture count
const getProfilePictureCount = async (userId: string): Promise<number> => {
  try {
    const { data: pictures, error } = await supabase
      .from('profile_pictures')
      .select('id')
      .eq('profile_id', userId);
    
    if (error) throw error;
    return pictures?.length || 0;
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    return 0;
  }
};

export const calculateMatchScore = async (profile1: Profile, profile2: Profile): Promise<number> => {
  let score = 0;
  const maxScore = 100;

  // Check gender preferences match (mandatory)
  if (!profile1.preferred_gender.includes(profile2.gender) || 
      !profile2.preferred_gender.includes(profile1.gender)) {
    return 0;
  }

  // Age compatibility (10 points)
  const ageDiff = Math.abs(profile1.age - profile2.age);
  const ageScore = Math.max(0, 10 - (ageDiff * 1.5));
  score += ageScore;

  // Enhanced Profile Picture Score (15 points)
  const profile1PicCount = await getProfilePictureCount(profile1.id);
  const profile2PicCount = await getProfilePictureCount(profile2.id);
  const profilePictureScore = () => {
    const maxPicsBonus = 5; // Bonus points for having multiple pictures
    const picScore = Math.min(profile2PicCount * 2, 10); // Up to 10 points based on number of pics
    const bonusScore = Math.min(profile2PicCount, maxPicsBonus); // Up to 5 bonus points
    return picScore + bonusScore;
  };
  score += profilePictureScore();

  // Safety Rating Score (10 points)
  const safetyRating = await getUserSafetyRating(profile2.id);
  const safetyScore = (safetyRating / 5) * 10; // Convert 5-star rating to 10-point scale
  score += safetyScore;

  // Travel style compatibility (20 points)
  if (profile1.travel_style === profile2.travel_style) {
    score += 20;
  } else {
    const style1Categories = travelStyleCategories[profile1.travel_style as keyof typeof travelStyleCategories] || [];
    const style2Categories = travelStyleCategories[profile2.travel_style as keyof typeof travelStyleCategories] || [];
    const styleSimilarity = calculateArraySimilarity(style1Categories, style2Categories);
    score += styleSimilarity * 10;
  }

  // Common interests (20 points - reduced from 25)
  const interestsSimilarity = calculateArraySimilarity(profile1.interests, profile2.interests);
  score += interestsSimilarity * 20;

  // Common languages (15 points)
  const languagesSimilarity = calculateArraySimilarity(profile1.languages, profile2.languages);
  score += languagesSimilarity * 15;

  // Preferred destinations (10 points - reduced from 15)
  const destinationsSimilarity = calculateArraySimilarity(
    profile1.preferred_destinations, 
    profile2.preferred_destinations
  );
  score += destinationsSimilarity * 10;

  // Ensure the final score is between 0 and 100
  return Math.min(Math.round(score), maxScore);
};

export const findPotentialMatches = async (userId: string) => {
  try {
    console.log('Finding potential matches for user:', userId);
    
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!currentProfile) {
      console.log('Current profile not found');
      return [];
    }

    const { data: potentialMatches } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', userId);

    if (!potentialMatches) {
      console.log('No potential matches found');
      return [];
    }

    // Calculate match scores and categorize profiles
    const scoredMatches = await Promise.all(
      potentialMatches.map(async (profile) => {
        const matchScore = await calculateMatchScore(currentProfile, profile);
        const matchCategory = profile.travel_style;
        const pictureCount = await getProfilePictureCount(profile.id);
        const safetyRating = await getUserSafetyRating(profile.id);
        
        return {
          profile,
          score: matchScore,
          category: matchCategory,
          pictureCount,
          safetyRating,
          commonInterests: profile.interests?.filter(
            interest => currentProfile.interests?.includes(interest)
          ) || [],
          commonDestinations: profile.preferred_destinations?.filter(
            dest => currentProfile.preferred_destinations?.includes(dest)
          ) || []
        };
      })
    );

    const filteredAndSorted = scoredMatches
      .filter(match => match.score > 0)
      .sort((a, b) => {
        // Prioritize profiles with pictures and good safety ratings
        const aQualityScore = (a.pictureCount > 0 ? 20 : 0) + (a.safetyRating * 4);
        const bQualityScore = (b.pictureCount > 0 ? 20 : 0) + (b.safetyRating * 4);
        
        // Combine quality score with match score for final sorting
        return (b.score + bQualityScore) - (a.score + aQualityScore);
      });

    console.log(`Found ${filteredAndSorted.length} potential matches`);
    return filteredAndSorted;
  } catch (error) {
    console.error('Error finding potential matches:', error);
    return [];
  }
};