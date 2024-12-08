import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMatchActions = (userId: string | undefined) => {
  const queryClient = useQueryClient();

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

  return { handleMatchResponse };
};