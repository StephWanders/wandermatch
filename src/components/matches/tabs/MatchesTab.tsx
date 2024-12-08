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

  // Filter to only show active matches
  const activeMatches = confirmedMatches.filter(match => match.status === 'active');

  return (
    <MatchList
      matches={activeMatches || []}
      onChatClick={handleChatClick}
    />
  );
};

export default MatchesTab;