import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { session, profile, loading } = useAuthState();
  const { confirmedMatches, pendingMatches, handleMatchResponse } = useMatchQueries(session?.user?.id);

  useEffect(() => {
    if (!loading && !session) {
      navigate("/");
    }
  }, [session, navigate, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

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
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="matches">My Matches</TabsTrigger>
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
                onAccept={handleMatchResponse}
                onDecline={handleMatchResponse}
              />
            </TabsContent>
            <TabsContent value="matches">
              <MatchList 
                matches={confirmedMatches || []}
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