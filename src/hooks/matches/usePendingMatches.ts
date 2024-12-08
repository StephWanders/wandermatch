import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fetchPendingMatchesForUser = async (userId: string, profileField: 'profile1_id' | 'profile2_id') => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id,
      status,
      matched_at,
      profile1_id,
      profile2_id,
      profiles:profiles!matches_${profileField === 'profile1_id' ? 'profile2' : 'profile1'}_id_fkey(
        id,
        full_name,
        age,
        location,
        profile_image_url,
        travel_style,
        bio,
        interests,
        preferred_destinations
      )
    `)
    .eq(profileField, userId)
    .or('status.eq.pending_first,status.eq.pending_second');

  if (error) throw error;
  console.log(`Fetched pending matches for ${profileField}:`, data);
  return data || [];
};

export const usePendingMatches = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching pending matches for user:', userId);
      
      try {
        // Get matches where user is either profile1 or profile2
        const [profile1Matches, profile2Matches] = await Promise.all([
          fetchPendingMatchesForUser(userId, 'profile1_id'),
          fetchPendingMatchesForUser(userId, 'profile2_id')
        ]);

        console.log('Raw pending matches before deduplication:', {
          profile1Matches,
          profile2Matches,
          totalBeforeDedup: profile1Matches.length + profile2Matches.length
        });

        // Combine matches and deduplicate by match ID
        const matchMap = new Map();
        [...profile1Matches, ...profile2Matches].forEach(match => {
          if (!matchMap.has(match.id)) {
            matchMap.set(match.id, match);
          }
        });

        const allPendingMatches = Array.from(matchMap.values());
        console.log('Deduplicated pending matches:', {
          totalAfterDedup: allPendingMatches.length,
          matches: allPendingMatches
        });
        
        return allPendingMatches;
      } catch (error) {
        console.error('Error fetching pending matches:', error);
        toast.error("Failed to load pending matches");
        return [];
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};