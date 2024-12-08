import MatchList from "../MatchList";
import { useNavigate } from "react-router-dom";

interface MatchesTabProps {
  confirmedMatches: any[];
}

const MatchesTab = ({ confirmedMatches }: MatchesTabProps) => {
  const navigate = useNavigate();

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  return (
    <MatchList
      matches={confirmedMatches || []}
      onChatClick={handleChatClick}
    />
  );
};

export default MatchesTab;