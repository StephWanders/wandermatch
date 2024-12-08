import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchActionsProps {
  matchId: string;
  onRateClick: () => void;
}

const MatchActions = ({ matchId, onRateClick }: MatchActionsProps) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    console.log('Navigating to chat with match:', matchId);
    navigate(`/chat/${matchId}`, { 
      state: { from: location.pathname, showLatest: true },
      replace: true // This ensures we replace the current history entry
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onRateClick}
        className="font-display"
      >
        Rate User
      </Button>
      <Button 
        onClick={handleChatClick}
        className="flex items-center gap-2 font-display"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </Button>
    </div>
  );
};

export default MatchActions;