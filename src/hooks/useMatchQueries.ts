import { useConfirmedMatches } from "./matches/useConfirmedMatches";
import { usePendingMatches } from "./matches/usePendingMatches";
import { useMatchActions } from "./matches/useMatchActions";

export const useMatchQueries = (userId: string | undefined) => {
  const { data: confirmedMatches = [] } = useConfirmedMatches(userId);
  const { data: pendingMatches = [] } = usePendingMatches(userId);
  const { handleMatchResponse } = useMatchActions(userId);

  return {
    confirmedMatches,
    pendingMatches,
    handleMatchResponse
  };
};