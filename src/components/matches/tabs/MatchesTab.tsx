import MatchList from "../MatchList";

interface MatchesTabProps {
  confirmedMatches: any[];
}

const MatchesTab = ({ confirmedMatches }: MatchesTabProps) => {
  // Filter to only show active matches
  const activeMatches = confirmedMatches.filter(match => match.status === 'active');

  return (
    <MatchList
      matches={activeMatches || []}
    />
  );
};

export default MatchesTab;