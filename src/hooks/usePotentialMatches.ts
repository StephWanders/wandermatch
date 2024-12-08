import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateMatchScore } from "@/utils/matching";
import { toast } from "sonner";

export const usePotentialMatches = (userId: string | undefined, userProfile: any) => {
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const fetchPotentialMatches = async (userId: string) => {
    try {
      // Get existing swipes
      const { data: existingSwipes } = await supabase
        .from('potential_matches')
        .select('target_id')
        .eq('user_id', userId);

      // Get existing matches
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('profile1_id, profile2_id')
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);

      // Collect all IDs to exclude
      const swipedIds = existingSwipes?.map(swipe => swipe.target_id) || [];
      const matchedIds = existingMatches?.flatMap(match => [
        match.profile1_id,
        match.profile2_id
      ]).filter(id => id !== userId) || [];
      const excludeIds = [...new Set([...swipedIds, ...matchedIds, userId])];

      // Only query if we have IDs to exclude
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(50); // Limit the number of profiles to process

      if (profiles && userProfile) {
        // Sort profiles by match score
        const scoredProfiles = profiles
          .map(p => ({
            ...p,
            matchScore: calculateMatchScore(userProfile, p)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .filter(p => p.matchScore > 0);

        setPotentialMatches(scoredProfiles);
      }
    } catch (error) {
      console.error("Error fetching potential matches:", error);
      toast.error("Failed to load potential matches");
    }
  };

  const handleSwipe = () => {
    setCurrentMatchIndex(prev => prev + 1);
    // Refresh potential matches if we're running low
    if (currentMatchIndex >= potentialMatches.length - 3) {
      fetchPotentialMatches(userId);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPotentialMatches(userId);
    }
  }, [userId]);

  return {
    potentialMatches,
    currentMatchIndex,
    handleSwipe,
    currentProfile: potentialMatches[currentMatchIndex],
    refreshMatches: () => fetchPotentialMatches(userId)
  };
};