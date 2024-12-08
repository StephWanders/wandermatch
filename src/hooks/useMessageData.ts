import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMessageData = (
  userId: string | undefined,
  matchId: string | undefined,
  otherProfileId: string | undefined
) => {
  return useQuery({
    queryKey: ['chat-messages', matchId, otherProfileId],
    queryFn: async () => {
      if (!userId || !matchId || !otherProfileId) return [];
      
      try {
        console.log('Fetching messages for match:', matchId);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${otherProfileId}),` +
            `and(sender_id.eq.${otherProfileId},receiver_id.eq.${userId})`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        console.log('Messages fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        throw error;
      }
    },
    enabled: !!userId && !!matchId && !!otherProfileId,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useLatestMessages = (userId: string | undefined, matches: any[]) => {
  return useQuery({
    queryKey: ['latest-messages', matches?.map(m => m.id)],
    queryFn: async () => {
      if (!matches?.length || !userId) return {};
      
      const messagesPromises = matches.map(async (match) => {
        const otherProfileId = match.profile1_id === userId ? match.profile2_id : match.profile1_id;
        
        const { data } = await supabase
          .from('messages')
          .select('created_at, content')
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${otherProfileId}),` +
            `and(sender_id.eq.${otherProfileId},receiver_id.eq.${userId})`
          )
          .order('created_at', { ascending: false })
          .limit(1);
        
        return {
          matchId: match.id,
          latestMessageTime: data?.[0]?.created_at || match.matched_at,
          latestMessage: data?.[0]?.content || "No messages yet"
        };
      });

      const results = await Promise.all(messagesPromises);
      return results.reduce((acc, curr) => ({
        ...acc,
        [curr.matchId]: {
          time: curr.latestMessageTime,
          message: curr.latestMessage
        }
      }), {});
    },
    enabled: !!matches?.length && !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
};