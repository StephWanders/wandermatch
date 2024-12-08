import MatchList from "../MatchList";

interface MatchesTabProps {
  confirmedMatches: any[];
}

const MatchesTab = ({ confirmedMatches }: MatchesTabProps) => {
  // Filter to only show active matches and exclude unmatched
  const activeMatches = confirmedMatches.filter(match => match.status === 'active');
  console.log('Active matches:', activeMatches);

  return (
    <MatchList
      matches={activeMatches || []}
    />
  );
};

export default MatchesTab;