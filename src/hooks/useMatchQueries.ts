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
          *,
          profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'accepted')
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);
      
      if (error) {
        console.error('Error fetching confirmed matches:', error);
        return [];
      }
      
      return data.map(match => ({
        ...match,
        profiles: match.profile1_id === userId ? 
          match.profiles : 
          match.profiles
      }));
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
          *,
          profiles!matches_profile1_id_fkey(*)
        `)
        .eq('profile2_id', userId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending matches:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!userId,
  });

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      console.log(`Handling match response - Match ID: ${matchId}, Accept: ${accept}`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('matches')
        .update({ 
          status: accept ? 'accepted' : 'rejected',
          matched_at: accept ? new Date().toISOString() : null
        })
        .eq('id', matchId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating match:', updateError);
        toast.error("Failed to update match status");
        return;
      }

      console.log('Match update successful:', updateData);
      
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