import { Heart, MessageCircle, Globe } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  const { pendingMatches, unreadMessages, latestChat } = useWelcomeData(session?.user?.id);

  const chatPath = latestChat ? `/chat/${latestChat}` : '/matches';

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <StatsCard
          icon={Heart}
          title="Pending Matches"
          stat={`${pendingMatches?.length || 0} pending matches`}
          to="/matches?tab=pending"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatsCard
          icon={Globe}
          title="Discover"
          stat="Find new travel buddies"
          to="/matches?tab=discover"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          icon={MessageCircle}
          title="Messages"
          stat={`${unreadMessages?.length || 0} unread messages`}
          to={chatPath}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {profile?.location && (
        <LocalEventsSection location={profile.location} />
      )}

      <InspirationSection />
      
      <SeasonalSection />
    </div>
  );
};

export default WelcomeSection;