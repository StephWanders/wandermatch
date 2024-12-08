import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculateMatchScore } from "@/utils/matching";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const usePotentialMatches = (userId: string | undefined, userProfile: any) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Use React Query for better caching and retry logic
  const { data: potentialMatches = [], refetch } = useQuery({
    queryKey: ['potential-matches', userId],
    queryFn: async () => {
      try {
        if (!userId || !userProfile) {
          console.log('Missing userId or userProfile, skipping fetch');
          return [];
        }

        console.log('Fetching potential matches for user:', userId);

        // Get existing swipes with error handling
        const { data: existingSwipes, error: swipesError } = await supabase
          .from('potential_matches')
          .select('target_id')
          .eq('user_id', userId);

        if (swipesError) {
          console.error('Error fetching existing swipes:', swipesError);
          throw swipesError;
        }

        // Get existing matches with error handling
        const { data: existingMatches, error: matchesError } = await supabase
          .from('matches')
          .select('profile1_id, profile2_id')
          .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);

        if (matchesError) {
          console.error('Error fetching existing matches:', matchesError);
          throw matchesError;
        }

        // Collect all IDs to exclude
        const swipedIds = existingSwipes?.map(swipe => swipe.target_id) || [];
        const matchedIds = existingMatches?.flatMap(match => [
          match.profile1_id,
          match.profile2_id
        ]).filter(id => id !== userId) || [];
        const excludeIds = [...new Set([...swipedIds, ...matchedIds, userId])];

        console.log('Fetching profiles excluding IDs:', excludeIds);

        // Only query if we have IDs to exclude
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .not('id', 'in', `(${excludeIds.join(',')})`)
          .limit(50);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        if (!profiles) {
          console.log('No potential matches found');
          return [];
        }

        // Calculate match scores for all profiles
        const scoredProfiles = await Promise.all(
          profiles.map(async (profile) => {
            const matchScore = await calculateMatchScore(userProfile, profile);
            return {
              ...profile,
              matchScore
            };
          })
        );

        // Sort and filter profiles
        const filteredProfiles = scoredProfiles
          .sort((a, b) => b.matchScore - a.matchScore)
          .filter(p => p.matchScore > 0);

        console.log(`Found ${filteredProfiles.length} potential matches`);
        return filteredProfiles;
      } catch (error) {
        console.error('Error in potential matches query:', error);
        toast.error("Failed to load potential matches. Please try again.");
        return [];
      }
    },
    enabled: !!userId && !!userProfile,
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const handleSwipe = async () => {
    setCurrentMatchIndex(prev => prev + 1);
    // Refresh potential matches if we're running low
    if (currentMatchIndex >= (potentialMatches?.length || 0) - 3) {
      console.log('Running low on potential matches, refreshing...');
      await refetch();
    }
  };

  return {
    potentialMatches,
    currentMatchIndex,
    handleSwipe,
    currentProfile: potentialMatches[currentMatchIndex],
    refreshMatches: refetch
  };
};