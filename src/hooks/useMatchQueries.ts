import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMatchQueries = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: confirmedMatches } = useQuery({
    queryKey: ['confirmed-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching confirmed matches');
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile1_id', userId);

      if (error) {
        console.error('Error fetching confirmed matches:', error);
        return [];
      }

      console.log('Confirmed matches data:', data);
      
      return data?.map(match => ({
        ...match,
        profiles: match.profiles
      })) || [];
    },
    enabled: !!userId,
  });

  const { data: pendingMatches } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching pending matches');
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'pending')
        .eq('profile2_id', userId);

      if (error) {
        console.error('Error fetching pending matches:', error);
        return [];
      }

      console.log('Pending matches data:', data);
      
      return data || [];
    },
    enabled: !!userId,
  });

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      console.log(`Handling match response - Match ID: ${matchId}, Accept: ${accept}`);
      
      const { error: updateError } = await supabase
        .from('matches')
        .update({ 
          status: accept ? 'active' : 'rejected',
          matched_at: accept ? new Date().toISOString() : null
        })
        .eq('id', matchId);

      if (updateError) {
        console.error('Error updating match:', updateError);
        toast.error("Failed to update match status");
        return;
      }

      // Invalidate both queries to refresh the data
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: ['confirmed-matches', userId]
        }),
        queryClient.invalidateQueries({ 
          queryKey: ['pending-matches', userId]
        })
      ]);
      
      toast.success(accept ? "Match accepted!" : "Match declined");
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match status");
    }
  };

  return {
    confirmedMatches,
    pendingMatches,
    handleMatchResponse
  };
};