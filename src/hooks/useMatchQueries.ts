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
      
      // First, get all matches where the user is either profile1 or profile2
      const { data: matchData, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          matched_profile:profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile1_id', userId);

      if (error) {
        console.error('Error fetching confirmed matches:', error);
        return [];
      }

      // Get matches where user is profile2
      const { data: reverseMatchData, error: reverseError } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          matched_at,
          profile1_id,
          profile2_id,
          matched_profile:profiles!matches_profile1_id_fkey(*)
        `)
        .eq('status', 'active')
        .eq('profile2_id', userId);

      if (reverseError) {
        console.error('Error fetching reverse matches:', reverseError);
        return [];
      }

      // Combine and process all matches
      const allMatches = [...(matchData || []), ...(reverseMatchData || [])];
      
      // Create a Map to store unique matches by ID
      const uniqueMatches = new Map();
      
      allMatches.forEach(match => {
        if (!uniqueMatches.has(match.id)) {
          uniqueMatches.set(match.id, {
            ...match,
            profiles: match.matched_profile
          });
        }
      });
      
      return Array.from(uniqueMatches.values());
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
        .eq('profile2_id', userId)
        .eq('status', 'pending')
        .order('matched_at', { ascending: false });

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
          status: accept ? 'active' : 'rejected',
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