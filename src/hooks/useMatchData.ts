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
          .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);
        
        if (error) throw error;
        
        // Process matches sequentially to handle async profile fetching
        const transformedData = [];
        for (const match of data || []) {
          const otherProfileId = match.profile1_id === userId ? match.profile2_id : match.profile1_id;
          const profileData = match.profile1_id === userId ? 
            match.profiles : 
            await getProfile(otherProfileId);
          
          transformedData.push({
            ...match,
            profiles: profileData
          });
        }
        
        console.log('Matches data:', transformedData);
        return transformedData;
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

const getProfile = async (profileId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();
  
  if (error) throw error;
  return data;
};