import { Heart, MessageCircle, Globe, RefreshCw } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

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
      // Navigate to the chat with the first unread message
      navigate(`/chat/${firstUnreadChat}`, { 
        state: { from: '/' }
      });
    } else {
      // If no unread messages, go to matches
      navigate('/matches');
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Dashboard</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        <Link to="/matches?tab=pending" className="no-underline">
          <StatsCard
            icon={Heart}
            title="Pending Matches"
            stat={`${pendingMatches?.length || 0} pending matches`}
            to="/matches?tab=pending"
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </Link>

        <Link to="/matches?tab=discover" className="no-underline">
          <StatsCard
            icon={Globe}
            title="Discover"
            stat="Find new travel buddies"
            to="/matches?tab=discover"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </Link>

        <div onClick={handleChatClick} className="cursor-pointer">
          <StatsCard
            icon={MessageCircle}
            title="Messages"
            stat={`${unreadMessages?.length || 0} unread messages`}
            to={firstUnreadChat ? `/chat/${firstUnreadChat}` : '/matches'}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
        </div>
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