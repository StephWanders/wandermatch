import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Match, Message } from "@/types/match";

export const useWelcomeData = (userId: string | undefined) => {
  const { data: recentMatches = [] } = useQuery<Match[]>({
    queryKey: ['recent-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('matches')
        .select('*, profiles!matches_profile2_id_fkey(*)')
        .eq('profile1_id', userId)
        .eq('status', 'accepted')
        .order('matched_at', { ascending: false })
        .limit(5);
      return (data as Match[]) || [];
    },
    enabled: !!userId,
  });

  const { data: unreadMessages = [] } = useQuery<Message[]>({
    queryKey: ['unread-messages', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          match:matches!inner (
            *,
            profiles!matches_profile2_id_fkey (*)
          )
        `)
        .eq('receiver_id', userId)
        .is('read_at', null)
        .order('created_at', { ascending: false })
        .single();
      
      // If no unread messages, return empty array
      if (!data) return [];
      
      // Convert to array if single result
      const messages = Array.isArray(data) ? data : [data];
      return messages as Message[];
    },
    enabled: !!userId,
  });

  const firstUnreadChat = unreadMessages[0]?.match?.id;

  return {
    recentMatches,
    unreadMessages,
    firstUnreadChat,
  };
};