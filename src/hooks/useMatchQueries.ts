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
          profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile1_id', userId);

      if (error1) {
        console.error('Error fetching matches as profile1:', error1);
        return [];
      }

      // Then get matches where user is profile2
      const { data: matches2, error: error2 } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile2_id', userId);

      if (error2) {
        console.error('Error fetching matches as profile2:', error2);
        return [];
      }

      const allMatches = [
        ...(matches1?.map(match => ({
          ...match,
          profiles: match.profiles
        })) || []),
        ...(matches2?.map(match => ({
          ...match,
          profiles: match.profiles
        })) || [])
      ];

      console.log('Confirmed matches data:', allMatches);
      return allMatches;
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
          profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'pending')
        .eq('profile2_id', userId);

      if (error) {
        console.error('Error fetching pending matches:', error);
        return [];
      }

      console.log('Pending matches data:', data);
      
      return data?.map(match => ({
        ...match,
        profiles: match.profiles
      })) || [];
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
