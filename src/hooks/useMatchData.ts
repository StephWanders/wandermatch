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
        const { data, error } = await supabase
          .from('matches')
          .select(`
            id,
            status,
            profile1_id,
            profile2_id,
            profile1:profiles!matches_profile1_id_fkey(*),
            profile2:profiles!matches_profile2_id_fkey(*)
          `)
          .eq('status', 'active')
          .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);
        
        if (error) throw error;
        
        // Transform data to show the other user's profile
        const transformedData = data?.map(match => ({
          ...match,
          profiles: match.profile1_id === userId ? match.profile2 : match.profile1
        }));
        
        console.log('Matches data:', transformedData);
        return transformedData || [];
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