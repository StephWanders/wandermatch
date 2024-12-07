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
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;