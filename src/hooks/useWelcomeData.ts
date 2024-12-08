import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Match, Message } from "@/types/match";

export const useWelcomeData = (userId: string | undefined) => {
  const { data: pendingMatches = [] } = useQuery<Match[]>({
    queryKey: ['pending-matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase
        .from('matches')
        .select('*, profiles!matches_profile2_id_fkey(*)')
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`)
        .or('status.eq.pending_first,status.eq.pending_second')
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
      console.log('Fetching unread messages for user:', userId);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(*)')
        .eq('receiver_id', userId)
        .is('read_at', null)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching unread messages:', error);
        return [];
      }
      
      console.log('Unread messages data:', data);
      return data as Message[];
    },
    enabled: !!userId,
  });

  // Get the latest chat (whether read or unread)
  const { data: latestChat } = useQuery({
    queryKey: ['latest-chat', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data) return null;
      
      // Return the ID of the other user in the chat
      return data.sender_id === userId ? data.receiver_id : data.sender_id;
    },
    enabled: !!userId,
  });

  return {
    pendingMatches,
    unreadMessages,
    firstUnreadChat: unreadMessages[0]?.sender?.id,
    latestChat,
  };
};