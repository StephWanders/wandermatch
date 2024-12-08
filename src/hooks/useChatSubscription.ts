import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

export const useChatSubscription = (
  matchId: string | undefined,
  userId: string | undefined,
  otherProfileId: string | undefined,
  queryClient: QueryClient
) => {
  useEffect(() => {
    if (!userId || !matchId || !otherProfileId) return;

    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Message change received:', payload);
          if (payload.eventType === 'INSERT') {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', matchId] });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId, userId, otherProfileId, queryClient]);
};