import MatchList from "../MatchList";
import { useAuthState } from "@/hooks/useAuthState";

interface MatchesTabProps {
  confirmedMatches: any[];
}

const MatchesTab = ({ confirmedMatches }: MatchesTabProps) => {
  const { session } = useAuthState();
  const currentUserId = session?.user?.id;

  // Filter to only show active matches where the current user is involved
  const activeMatches = confirmedMatches.filter(match => 
    match.status === 'active' && 
    (match.profile1_id === currentUserId || match.profile2_id === currentUserId)
  );
  
  console.log('Active matches:', activeMatches);

  return (
    <MatchList
      matches={activeMatches || []}
    />
  );
};

export default MatchesTab;