import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-t p-4 flex items-center space-x-2"
    >
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default ChatInput;