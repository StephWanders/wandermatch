import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages = ({ messages, currentUserId }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when they are displayed
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const unreadMessages = messages.filter(
        msg => msg.sender_id !== currentUserId && !msg.read_at
      );

      if (unreadMessages.length > 0) {
        console.log('Marking messages as read:', unreadMessages.map(m => m.id));
        
        const { error } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadMessages.map(m => m.id));

        if (error) {
          console.error('Error marking messages as read:', error);
          return;
        }

        // Invalidate queries to refresh unread count
        queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
        queryClient.invalidateQueries({ queryKey: ['welcomeData'] });
        queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      }
    };

    markMessagesAsRead();
  }, [messages, currentUserId, queryClient]);

  return (
    <div className="flex-1 overflow-hidden bg-[#e5ded8]" ref={scrollRef}>
      <ScrollArea className="h-full p-4">
        <div className="space-y-2">
          {messages.map((message) => {
            const isSentByMe = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 shadow ${
                    isSentByMe
                      ? "bg-[#dcf8c6] mr-2"
                      : "bg-white ml-2"
                  }`}
                >
                  <p className="text-gray-800">{message.content}</p>
                  <span className="text-xs text-gray-500 block text-right mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;