import { Heart, MessageCircle, Globe } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Local Events</h2>
          <Link to="/" className="block hover:opacity-90 transition-opacity">
            <Card>
              <CardContent className="p-6">
                <LocalEventsSection location={profile.location} />
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Travel Inspiration</h2>
        <Link to="/" className="block hover:opacity-90 transition-opacity">
          <Card>
            <CardContent className="p-6">
              <InspirationSection />
            </CardContent>
          </Card>
        </Link>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Seasonal Highlights</h2>
        <Link to="/" className="block hover:opacity-90 transition-opacity">
          <Card>
            <CardContent className="p-6">
              <SeasonalSection />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeSection;