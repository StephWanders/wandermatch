import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import MatchList from "@/components/matches/MatchList";
import DiscoverTab from "@/components/matches/DiscoverTab";
import BottomNav from "@/components/navigation/BottomNav";
import TopNav from "@/components/navigation/TopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMatchQueries } from "@/hooks/useMatchQueries";
import PendingTab from "@/components/matches/tabs/PendingTab";

const Matches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, profile, loading } = useAuthState();
  const { confirmedMatches, pendingMatches, handleMatchResponse } = useMatchQueries(session?.user?.id);

  // Get the tab from URL parameters, default to "discover"
  const currentTab = searchParams.get("tab") || "discover";

  useEffect(() => {
    if (!loading && !session) {
      navigate("/");
    }
  }, [session, navigate, loading]);

  const handleTabChange = (value: string) => {
    navigate(`/matches?tab=${value}`);
  };

  const handleAccept = (id: string) => {
    handleMatchResponse(id, true);
  };

  const handleDecline = (id: string) => {
    handleMatchResponse(id, false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  // Filter to only show active matches
  const activeMatches = confirmedMatches?.filter(match => match.status === 'active') || [];

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/90 backdrop-blur-[1px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <TopNav session={session} profile={profile} />
        
        <div className="container mx-auto px-4 pt-20">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingMatches?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingMatches.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="matches" className="relative">
                My Matches
                {activeMatches.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeMatches.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="discover">
              <DiscoverTab 
                userId={session?.user?.id}
                userProfile={profile}
              />
            </TabsContent>
            <TabsContent value="pending">
              <PendingTab 
                pendingMatches={pendingMatches}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            </TabsContent>
            <TabsContent value="matches">
              <MatchList 
                matches={activeMatches}
              />
            </TabsContent>
          </Tabs>
        </div>

        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

export default Matches;