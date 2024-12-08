import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface MatchActionsProps {
  matchId: string;
  onRateClick: () => void;
}

const MatchActions = ({ matchId, onRateClick }: MatchActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChatClick = () => {
    console.log('Navigating to chat with match:', matchId);
    // Navigate to chat with this specific match
    navigate(`/chat/${matchId}`, { 
      state: { showLatest: false }, // Don't show latest, show this specific chat
      replace: true
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