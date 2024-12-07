import MatchCard from "./MatchCard";
import EmptyState from "./EmptyState";

interface MatchListProps {
  matches: any[];
  isPending?: boolean;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  onChatClick?: (matchId: string) => void;
}

const MatchList = ({ matches, isPending, onAccept, onDecline, onChatClick }: MatchListProps) => {
  if (!matches?.length) {
    return (
      <EmptyState 
        message={isPending ? "No pending matches at the moment." : "No matches yet. Keep exploring!"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          isPending={isPending}
          onAccept={onAccept}
          onDecline={onDecline}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
};

export default MatchList;