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

export const calculateMatchScore = (profile1: Profile, profile2: Profile): number => {
  let score = 0;
  const maxScore = 100;

  // Check gender preferences match (mandatory)
  if (!profile1.preferred_gender.includes(profile2.gender) || 
      !profile2.preferred_gender.includes(profile1.gender)) {
    return 0;
  }

  // Age compatibility (15 points)
  const ageDiff = Math.abs(profile1.age - profile2.age);
  const ageScore = Math.max(0, 15 - (ageDiff * 1.5));
  score += ageScore;

  // Travel style compatibility (20 points)
  if (profile1.travel_style === profile2.travel_style) {
    score += 20;
  } else {
    // Partial match based on related categories
    const style1Categories = travelStyleCategories[profile1.travel_style as keyof typeof travelStyleCategories] || [];
    const style2Categories = travelStyleCategories[profile2.travel_style as keyof typeof travelStyleCategories] || [];
    const styleSimilarity = calculateArraySimilarity(style1Categories, style2Categories);
    score += styleSimilarity * 10; // Up to 10 points for related styles
  }

  // Common interests (25 points)
  const interestsSimilarity = calculateArraySimilarity(profile1.interests, profile2.interests);
  score += interestsSimilarity * 25;

  // Common languages (15 points)
  const languagesSimilarity = calculateArraySimilarity(profile1.languages, profile2.languages);
  score += languagesSimilarity * 15;

  // Preferred destinations (15 points)
  const destinationsSimilarity = calculateArraySimilarity(
    profile1.preferred_destinations, 
    profile2.preferred_destinations
  );
  score += destinationsSimilarity * 15;

  // Bio text analysis (10 points)
  if (profile1.bio && profile2.bio) {
    const bioSimilarity = calculateTextSimilarity(profile1.bio, profile2.bio);
    score += bioSimilarity * 10;
  }

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
    const scoredMatches = potentialMatches
      .map(profile => {
        const matchScore = calculateMatchScore(currentProfile, profile);
        const matchCategory = profile.travel_style;
        
        return {
          profile,
          score: matchScore,
          category: matchCategory,
          commonInterests: profile.interests?.filter(
            interest => currentProfile.interests?.includes(interest)
          ) || [],
          commonDestinations: profile.preferred_destinations?.filter(
            dest => currentProfile.preferred_destinations?.includes(dest)
          ) || []
        };
      })
      .filter(match => match.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log(`Found ${scoredMatches.length} potential matches`);
    return scoredMatches;
  } catch (error) {
    console.error('Error finding potential matches:', error);
    return [];
  }
};