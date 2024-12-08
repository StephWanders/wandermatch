import { Heart, MessageCircle, Globe } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";
import { useNavigate } from "react-router-dom";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  const navigate = useNavigate();
  const { pendingMatches, unreadMessages, firstUnreadChat } = useWelcomeData(session?.user?.id);

  const handleChatClick = () => {
    if (firstUnreadChat) {
      navigate(`/chat/${firstUnreadChat}`);
    } else {
      navigate('/matches');
    }
  };

  // Format location to handle both city-only and city,country formats
  const formattedLocation = profile?.location ? profile.location.split(',')[0].trim() : 'Unknown Location';

  return (
    <div className="relative">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold font-display text-accent-800 mb-6">Your Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <StatsCard
            icon={Heart}
            title={<span className="font-display">Pending Matches</span>}
            stat={`${pendingMatches?.length || 0} pending matches`}
            to="/matches?tab=pending"
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
            to={firstUnreadChat ? `/chat/${firstUnreadChat}` : '/matches'}
            bgColor="bg-accent-100"
            iconColor="text-accent-600"
            className="border-none"
            onClick={handleChatClick}
          />
        </div>

        {formattedLocation && formattedLocation !== 'Unknown Location' && (
          <LocalEventsSection location={formattedLocation} />
        )}

        <InspirationSection />
        
        <SeasonalSection />
      </div>
    </div>
  );
};

export default WelcomeSection;