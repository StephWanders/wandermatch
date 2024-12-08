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
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-[2px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
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