import MatchList from "../MatchList";
import { useAuthState } from "@/hooks/useAuthState";

interface MatchesTabProps {
  confirmedMatches: any[];
}

const MatchesTab = ({ confirmedMatches }: MatchesTabProps) => {
  const { session } = useAuthState();
  const currentUserId = session?.user?.id;

  console.log('All confirmed matches before filtering:', confirmedMatches);

  // Filter to only show active matches where the current user is involved
  const activeMatches = confirmedMatches.filter(match => {
    const isActive = match.status === 'active';
    const isUserInvolved = match.profile1_id === currentUserId || match.profile2_id === currentUserId;
    
    console.log('Match filtering details:', {
      matchId: match.id,
      status: match.status,
      profile1_id: match.profile1_id,
      profile2_id: match.profile2_id,
      currentUserId,
      isActive,
      isUserInvolved
    });

    return isActive && isUserInvolved;
  });
  
  console.log('Filtered active matches:', activeMatches);

  return (
    <MatchList
      matches={activeMatches || []}
    />
  );
};

export default MatchesTab;