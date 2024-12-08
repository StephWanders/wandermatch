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

        // Combine matches and deduplicate by match ID
        const matchMap = new Map();
        [...profile1Matches, ...profile2Matches].forEach(match => {
          if (!matchMap.has(match.id)) {
            matchMap.set(match.id, {
              ...match,
              profiles: match.profiles
            });
          }
        });

        const allConfirmedMatches = Array.from(matchMap.values());
        console.log('All confirmed matches:', allConfirmedMatches);
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