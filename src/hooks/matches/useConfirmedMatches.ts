import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fetchMatchesForUser = async (userId: string, profileField: 'profile1_id' | 'profile2_id') => {
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
    .eq('status', 'active');

  if (error) throw error;
  console.log(`Fetched matches for ${profileField}:`, data);
  return data || [];
};

export const useConfirmedMatches = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['confirmed-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching confirmed matches for user:', userId);
      
      try {
        // Get matches where user is either profile1 or profile2
        const [profile1Matches, profile2Matches] = await Promise.all([
          fetchMatchesForUser(userId, 'profile1_id'),
          fetchMatchesForUser(userId, 'profile2_id')
        ]);

        console.log('Raw matches before deduplication:', {
          profile1Matches,
          profile2Matches,
          totalBeforeDedup: profile1Matches.length + profile2Matches.length
        });

        // Combine matches and deduplicate by the other user's profile ID
        const matchMap = new Map();
        [...profile1Matches, ...profile2Matches].forEach(match => {
          const otherProfileId = match.profile1_id === userId ? match.profile2_id : match.profile1_id;
          // Keep only the most recent match with each user
          if (!matchMap.has(otherProfileId) || 
              new Date(match.matched_at) > new Date(matchMap.get(otherProfileId).matched_at)) {
            matchMap.set(otherProfileId, match);
          }
        });

        const allConfirmedMatches = Array.from(matchMap.values());
        console.log('Deduplicated matches:', {
          totalAfterDedup: allConfirmedMatches.length,
          matches: allConfirmedMatches
        });
        
        return allConfirmedMatches;
      } catch (error) {
        console.error('Error fetching confirmed matches:', error);
        toast.error("Failed to load matches");
        return [];
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};
