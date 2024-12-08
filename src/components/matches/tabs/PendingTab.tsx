import MatchList from "../MatchList";

interface PendingTabProps {
  pendingMatches: any[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

const PendingTab = ({ pendingMatches, onAccept, onDecline }: PendingTabProps) => {
  return (
    <MatchList
      matches={pendingMatches || []}
      isPending
      onAccept={onAccept}
      onDecline={onDecline}
    />
  );
};

export default PendingTab;