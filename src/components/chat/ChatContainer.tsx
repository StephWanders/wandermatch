import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatContainerProps {
  matchId: string;
  otherProfile: any;
  session: any;
  messages: any[];
}

const ChatContainer = ({ matchId, otherProfile, session, messages }: ChatContainerProps) => {
  const queryClient = useQueryClient();

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
    <div className="flex-1 flex flex-col">
      <ChatHeader profile={otherProfile} />
      <ChatMessages messages={messages} currentUserId={session?.user?.id} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatContainer;