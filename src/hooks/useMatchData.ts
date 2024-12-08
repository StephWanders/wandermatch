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
            profiles:profiles!matches_profile2_id_fkey(*)
          `)
          .eq('status', 'active')
          .eq('profile1_id', userId);

        if (error) throw error;
        
        console.log('Matches data:', data);
        return data || [];
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