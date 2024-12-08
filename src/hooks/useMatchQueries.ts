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
          profiles:profiles!matches_profile2_id_fkey(
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
        .eq('profile1_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching confirmed matches:', error);
        toast.error("Failed to load matches");
        return [];
      }

      return data.map(match => ({
        ...match,
        profiles: match.profiles
      }));
    },
    enabled: !!userId,
    retry: 2,
  });

  const { data: pendingMatches = [] } = useQuery({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      console.log('Fetching pending matches for user:', userId);
      
      // First, get matches where user is profile1
      const { data: profile1Matches, error: error1 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profiles:profiles!matches_profile2_id_fkey(
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
        .eq('profile1_id', userId)
        .or('status.eq.pending_first,status.eq.pending_second');

      // Then, get matches where user is profile2
      const { data: profile2Matches, error: error2 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profiles:profiles!matches_profile1_id_fkey(
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
        .eq('profile2_id', userId)
        .or('status.eq.pending_first,status.eq.pending_second');

      if (error1 || error2) {
        console.error('Error fetching pending matches:', error1 || error2);
        toast.error("Failed to load pending matches");
        return [];
      }

      // Combine and format both sets of matches
      const allPendingMatches = [
        ...(profile1Matches || []).map(match => ({
          ...match,
          profiles: match.profiles
        })),
        ...(profile2Matches || []).map(match => ({
          ...match,
          profiles: match.profiles
        }))
      ];

      console.log('All pending matches:', allPendingMatches);
      return allPendingMatches;
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