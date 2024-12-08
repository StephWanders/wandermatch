import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { format, isToday, isYesterday } from "date-fns";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when they are displayed
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!currentUserId || !messages?.length) {
        console.log('No messages to mark as read or no current user');
        return;
      }

      // Filter unread messages where the current user is the receiver
      const unreadMessages = messages.filter(
        msg => msg.sender_id !== currentUserId && !msg.read_at
      );

      console.log('Found unread messages:', unreadMessages.length);
      
      if (unreadMessages.length > 0) {
        try {
          const messageIds = unreadMessages.map(m => m.id);
          console.log('Attempting to mark messages as read:', messageIds);
          
          const { error } = await supabase.rpc('mark_messages_as_read', {
            p_message_ids: messageIds,
            p_user_id: currentUserId
          });

          if (error) {
            console.error('Error marking messages as read:', error);
            return;
          }

          console.log('Successfully marked messages as read');
          
          // Invalidate queries immediately after successful update
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['unread-messages'] }),
            queryClient.invalidateQueries({ queryKey: ['welcomeData'] }),
            queryClient.invalidateQueries({ queryKey: ['chat-messages'] }),
            queryClient.invalidateQueries({ queryKey: ['latest-messages'] }),
            queryClient.invalidateQueries({ queryKey: ['unread-counts'] }),
            queryClient.invalidateQueries({ queryKey: ['confirmed-matches'] })
          ]);
        } catch (error) {
          console.error('Failed to mark messages as read:', error);
        }
      }
    };

    markMessagesAsRead();
  }, [messages, currentUserId, queryClient]);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, 'MMMM d, yyyy');
  };

  const messagesByDate = messages.reduce((acc: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at);
    const dateKey = format(date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(message);
    return acc;
  }, {});

  return (
    <div className="flex-1 bg-white/30 backdrop-blur-sm">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {Object.entries(messagesByDate).map(([dateKey, dateMessages]) => (
            <div key={dateKey} className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-white/80 px-3 py-1 rounded-full text-xs text-gray-600">
                  {formatDateSeparator(dateKey)}
                </div>
              </div>
              <div className="space-y-2">
                {dateMessages.map((message) => {
                  const isSentByMe = message.sender_id === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 shadow ${
                          isSentByMe
                            ? "bg-primary-100/90 mr-2"
                            : "bg-white/90 ml-2"
                        }`}
                      >
                        <p className="text-gray-800">{message.content}</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;