import SwipeCard from "./SwipeCard";
import { usePotentialMatches } from "@/hooks/usePotentialMatches";

interface DiscoverTabProps {
  userId: string | undefined;
  userProfile: any;
}

const DiscoverTab = ({ userId, userProfile }: DiscoverTabProps) => {
  const { 
    currentProfile,
    handleSwipe,
  } = usePotentialMatches(userId, userProfile);

  return currentProfile ? (
    <SwipeCard
      profile={currentProfile}
      onSwipe={handleSwipe}
      currentUserId={userId}
    />
  ) : (
    <div className="text-center text-gray-500 py-8">
      No more profiles to show at the moment.
    </div>
  );
};

export default DiscoverTab;