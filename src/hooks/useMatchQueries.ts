import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMatchQueries = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: confirmedMatches = [] } = useQuery({
    queryKey: ['confirmed-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching confirmed matches for user:', userId);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profile1:profiles!matches_profile1_id_fkey(*),
          profile2:profiles!matches_profile2_id_fkey(*)
        `)
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching confirmed matches:', error);
        toast.error("Failed to load matches");
        return [];
      }

      console.log('Confirmed matches data:', data);
      return data || [];
    },
    enabled: !!userId,
    retry: 2,
  });

  const { data: pendingMatches = [] } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching pending matches for user:', userId);
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profile1:profiles!matches_profile1_id_fkey(*),
          profile2:profiles!matches_profile2_id_fkey(*)
        `)
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
        .or('status.eq.pending_first,status.eq.pending_second');

      if (error) {
        console.error('Error fetching pending matches:', error);
        toast.error("Failed to load pending matches");
        return [];
      }

      console.log('Pending matches data:', data);
      return data || [];
    },
    enabled: !!userId,
    retry: 2,
  });

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      console.log(`Handling match response - Match ID: ${matchId}, Accept: ${accept}`);
      
      if (!accept) {
        const { error: updateError } = await supabase
          .from('matches')
          .update({ status: 'rejected' })
          .eq('id', matchId);

        if (updateError) throw updateError;
        toast.success("Match declined");
      } else {
        // Get the current match details
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', matchId)
          .single();

        if (matchError) throw matchError;

        // Determine the new status based on current status
        let newStatus = 'active';
        if (match.status === 'pending_first') {
          newStatus = 'pending_second';
        }

        const { error: updateError } = await supabase
          .from('matches')
          .update({ 
            status: newStatus,
            matched_at: newStatus === 'active' ? new Date().toISOString() : match.matched_at
          })
          .eq('id', matchId);

        if (updateError) throw updateError;
        
        toast.success(newStatus === 'active' ? 
          "It's a match! You can now start chatting." : 
          "Match accepted! Waiting for the other person to accept."
        );
      }

      // Invalidate queries to refresh the data
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: ['confirmed-matches', userId]
        }),
        queryClient.invalidateQueries({ 
          queryKey: ['pending-matches', userId]
        })
      ]);
      
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