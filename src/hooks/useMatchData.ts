import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMatchData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['chat-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      try {
        console.log('Fetching matches for chat, user ID:', userId);
        const { data: profile1Matches, error: error1 } = await supabase
          .from('matches')
          .select(`
            id,
            status,
            profile1_id,
            profile2_id,
            profiles:profiles!matches_profile2_id_fkey(*)
          `)
          .eq('status', 'active')
          .eq('profile1_id', userId);

        if (error1) throw error1;

        const { data: profile2Matches, error: error2 } = await supabase
          .from('matches')
          .select(`
            id,
            status,
            profile1_id,
            profile2_id,
            profiles:profiles!matches_profile1_id_fkey(*)
          `)
          .eq('status', 'active')
          .eq('profile2_id', userId);

        if (error2) throw error2;
        
        const allMatches = [...(profile1Matches || []), ...(profile2Matches || [])];
        console.log('All matches data:', allMatches);
        return allMatches || [];
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast.error("Failed to load matches");
        throw error;
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
  });
};