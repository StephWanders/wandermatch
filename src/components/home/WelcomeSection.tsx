import { Heart, MessageCircle, Bell } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session }: WelcomeSectionProps) => {
  const { recentMatches, unreadMessages, firstUnreadChat } = useWelcomeData(session?.user?.id);

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in">
        <StatsCard
          icon={Heart}
          title="Recent Travel Buddies"
          stat={`${recentMatches?.length || 0} recent matches`}
          to="/matches"
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          icon={MessageCircle}
          title="Messages"
          stat={`${unreadMessages?.length || 0} unread messages`}
          to={firstUnreadChat ? `/chat/${firstUnreadChat}` : '/matches'}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          icon={Bell}
          title="Find Matches"
          stat="Discover new travel buddies"
          to="/matches"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>
    </div>
  );
};

export default WelcomeSection;