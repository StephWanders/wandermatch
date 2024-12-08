import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useEffect } from "react";

interface ChatContainerProps {
  matchId: string;
  otherProfile: any;
  session: any;
  messages: any[];
}

const ChatContainer = ({ matchId, otherProfile, session, messages }: ChatContainerProps) => {
  const queryClient = useQueryClient();

  // Mark messages as read when the chat is opened
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!session?.user?.id || !otherProfile?.id || !messages?.length) return;

      console.log('Checking messages to mark as read for:', otherProfile.id);
      
      const unreadMessageIds = messages
        .filter(msg => 
          msg.sender_id === otherProfile.id && 
          msg.receiver_id === session.user.id && 
          !msg.read_at
        )
        .map(msg => msg.id);

      if (unreadMessageIds.length === 0) {
        console.log('No unread messages to mark');
        return;
      }

      console.log('Marking messages as read:', unreadMessageIds);

      try {
        const { error } = await supabase.rpc('mark_messages_as_read', {
          p_message_ids: unreadMessageIds,
          p_user_id: session.user.id
        });

        if (error) throw error;

        // Invalidate queries to update UI
        queryClient.invalidateQueries({ queryKey: ['chat-messages', matchId] });
        queryClient.invalidateQueries({ queryKey: ['unread-counts'] });
        queryClient.invalidateQueries({ queryKey: ['latest-messages'] });
        queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        
        console.log('Successfully marked messages as read');
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();
  }, [matchId, messages, otherProfile?.id, session?.user?.id, queryClient]);

  const sendMessage = async (content: string) => {
    if (!session?.user?.id || !otherProfile?.id) {
      console.error('Missing user or recipient information');
      return;
    }

    try {
      console.log('Sending message to:', otherProfile.id);
      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: session.user.id,
        receiver_id: otherProfile.id,
      });

      if (error) throw error;
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['chat-messages', matchId] });
      queryClient.invalidateQueries({ queryKey: ['latest-messages'] });
      queryClient.invalidateQueries({ queryKey: ['confirmed-matches'] });
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-sm">
      <ChatHeader profile={otherProfile} />
      <ChatMessages messages={messages} currentUserId={session?.user?.id} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatContainer;