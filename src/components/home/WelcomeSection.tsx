import { Heart, MessageCircle, Globe, RefreshCw } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pendingMatches, unreadMessages, firstUnreadChat } = useWelcomeData(session?.user?.id);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['welcomeData'] });
    queryClient.invalidateQueries({ queryKey: ['matches'] });
    queryClient.invalidateQueries({ queryKey: ['messages'] });
  };

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
    <div className="relative max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-display text-accent-800">Your Dashboard</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          className="text-accent-600 hover:text-accent-900 hover:bg-primary-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <StatsCard
          icon={Heart}
          title="Pending Matches"
          stat={`${pendingMatches?.length || 0} pending matches`}
          to="/matches?tab=pending"
          bgColor="bg-primary-50"
          iconColor="text-primary-600"
        />

        <StatsCard
          icon={Globe}
          title="Discover"
          stat="Find new travel buddies"
          to="/matches?tab=discover"
          bgColor="bg-secondary-50"
          iconColor="text-secondary-600"
        />

        <StatsCard
          icon={MessageCircle}
          title="Messages"
          stat={`${unreadMessages?.length || 0} unread messages`}
          to={firstUnreadChat ? `/chat/${firstUnreadChat}` : '/matches'}
          bgColor="bg-accent-50"
          iconColor="text-accent-600"
          onClick={handleChatClick}
        />
      </div>

      {formattedLocation && formattedLocation !== 'Unknown Location' && (
        <LocalEventsSection location={formattedLocation} />
      )}

      <InspirationSection />
      
      <SeasonalSection />
    </div>
  );
};

export default WelcomeSection;