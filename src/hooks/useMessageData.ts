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