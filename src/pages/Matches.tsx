import BottomNav from "@/components/navigation/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchesTab from "@/components/matches/tabs/MatchesTab";
import PendingTab from "@/components/matches/tabs/PendingTab";
import DiscoverTab from "@/components/matches/DiscoverTab";
import { useMatchQueries } from "@/hooks/useMatchQueries";
import { useMatchState } from "@/hooks/useMatchState";
import { useSearchParams } from "react-router-dom";

const Matches = () => {
  const [searchParams] = useSearchParams();
  const { session, profile } = useMatchState();
  const { confirmedMatches, pendingMatches, handleMatchResponse } = useMatchQueries(session?.user?.id);

  // Get the initial tab from URL or default to "matches"
  const initialTab = searchParams.get("tab") || "matches";

  // Calculate actual counts from the data
  const confirmedCount = confirmedMatches?.length || 0;
  const pendingCount = pendingMatches?.length || 0;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
        
        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="matches">
              Matches ({confirmedCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="discover">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <MatchesTab confirmedMatches={confirmedMatches} />
          </TabsContent>

          <TabsContent value="pending">
            <PendingTab 
              pendingMatches={pendingMatches}
              onAccept={(id) => handleMatchResponse(id, true)}
              onDecline={(id) => handleMatchResponse(id, false)}
            />
          </TabsContent>

          <TabsContent value="discover">
            <DiscoverTab 
              userId={session?.user?.id}
              userProfile={profile}
            />
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Matches;