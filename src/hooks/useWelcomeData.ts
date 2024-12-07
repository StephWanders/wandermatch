import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Match = Database['public']['Tables']['matches']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

export const useWelcomeData = (userId: string | undefined) => {
  const { data: recentMatches = [] } = useQuery({
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
      return data || [];
    },
    enabled: !!userId,
  });

  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['unread-messages', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('messages')
        .select('*, matches(*)')
        .eq('receiver_id', userId)
        .is('read_at', null)
        .order('created_at', { ascending: false });
      return (data as (Message & { matches: Match[] })[]) || [];
    },
    enabled: !!userId,
  });

  const firstUnreadChat = unreadMessages[0]?.matches?.[0]?.id;

  return {
    recentMatches,
    unreadMessages,
    firstUnreadChat,
  };
};