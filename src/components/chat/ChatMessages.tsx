import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages = ({ messages, currentUserId }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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