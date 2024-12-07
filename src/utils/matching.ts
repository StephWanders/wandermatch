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
}

export const calculateMatchScore = (profile1: Profile, profile2: Profile): number => {
  let score = 0;
  const maxScore = 100;

  // Check gender preferences match
  if (!profile1.preferred_gender.includes(profile2.gender) || 
      !profile2.preferred_gender.includes(profile1.gender)) {
    return 0;
  }

  // Age difference (max 20 points)
  const ageDiff = Math.abs(profile1.age - profile2.age);
  score += Math.max(0, 20 - (ageDiff * 2));

  // Travel style match (20 points)
  if (profile1.travel_style === profile2.travel_style) {
    score += 20;
  }

  // Common interests (20 points)
  const commonInterests = profile1.interests.filter(interest => 
    profile2.interests.includes(interest)
  );
  score += (commonInterests.length / Math.max(profile1.interests.length, profile2.interests.length)) * 20;

  // Common languages (20 points)
  const commonLanguages = profile1.languages.filter(lang => 
    profile2.languages.includes(lang)
  );
  score += (commonLanguages.length / Math.max(profile1.languages.length, profile2.languages.length)) * 20;

  // Common preferred destinations (20 points)
  const commonDestinations = profile1.preferred_destinations.filter(dest => 
    profile2.preferred_destinations.includes(dest)
  );
  score += (commonDestinations.length / Math.max(profile1.preferred_destinations.length, profile2.preferred_destinations.length)) * 20;

  return Math.min(Math.round(score), maxScore);
};

export const findPotentialMatches = async (userId: string) => {
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!currentProfile) return [];

  const { data: potentialMatches } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', userId);

  if (!potentialMatches) return [];

  return potentialMatches
    .map(profile => ({
      profile,
      score: calculateMatchScore(currentProfile, profile)
    }))
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
};