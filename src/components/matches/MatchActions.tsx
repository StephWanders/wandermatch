import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface MatchActionsProps {
  onChatClick: () => void;
  onRateClick: () => void;
}

const MatchActions = ({ onChatClick, onRateClick }: MatchActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onRateClick}
      >
        Rate User
      </Button>
      <Button 
        onClick={onChatClick}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </Button>
    </div>
  );
};

export default MatchActions;