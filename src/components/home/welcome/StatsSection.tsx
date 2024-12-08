import { Heart, MessageCircle, Globe } from "lucide-react";
import StatsCard from "./StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";

interface StatsSectionProps {
  userId: string;
}

const StatsSection = ({ userId }: StatsSectionProps) => {
  const { pendingMatches, unreadMessages } = useWelcomeData(userId);
  const { goToChat, goToPendingMatches } = useAppNavigation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <StatsCard
        icon={Heart}
        title={<span className="font-display">Pending Matches</span>}
        stat={`${pendingMatches?.length || 0} pending matches`}
        onClick={goToPendingMatches}
        bgColor="bg-primary-100"
        iconColor="text-primary-600"
        className="border-none"
      />

      <StatsCard
        icon={Globe}
        title={<span className="font-display">Discover</span>}
        stat="Find new travel buddies"
        to="/matches?tab=discover"
        bgColor="bg-secondary-100"
        iconColor="text-secondary-600"
        className="border-none"
      />

      <StatsCard
        icon={MessageCircle}
        title={<span className="font-display">Messages</span>}
        stat={`${unreadMessages?.length || 0} unread messages`}
        onClick={goToChat}
        bgColor="bg-accent-100"
        iconColor="text-accent-600"
        className="border-none"
      />
    </div>
  );
};

export default StatsSection;