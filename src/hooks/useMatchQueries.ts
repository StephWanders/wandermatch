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
      
      // First get matches where user is profile1
      const { data: matches1, error: error1 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profile2:profiles!matches_profile2_id_fkey(*),
          profile1:profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile1_id', userId);

      if (error1) {
        console.error('Error fetching matches as profile1:', error1);
        return [];
      }

     
  const { data: pendingMatches } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching pending matches');
      
      // Get matches where user is profile2 and status is pending_first
      const { data: pendingFirst, error: error1 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profile2:profiles!matches_profile2_id_fkey(*),
          profile1:profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'pending_first')
        .eq('profile2_id', userId);

      if (error1) {
        console.error('Error fetching pending_first matches:', error1);
        return [];
      }

      // Get matches where user is profile1 and status is pending_second
      const { data: pendingSecond, error: error2 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profile2:profiles!matches_profile2_id_fkey(*),
          profile1:profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'pending_second')
        .eq('profile1_id', userId);

      if (error2) {
        console.error('Error fetching pending_second matches:', error2);
        return [];
      }

      const allPendingMatches = [
        ...(pendingFirst || []),
        ...(pendingSecond || [])
      ];

      console.log('Pending matches data:', allPendingMatches);
      return allPendingMatches;
    },
    enabled: !!userId,
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

        // Determine the new status based on current status and user's role
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

      // Invalidate both queries to refresh the data
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
