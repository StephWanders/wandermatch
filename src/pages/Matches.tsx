import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchList from "@/components/matches/MatchList";
import DiscoverTab from "@/components/matches/DiscoverTab";
import { useMatchQueries } from "@/hooks/useMatchQueries";

const Matches = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const { confirmedMatches, pendingMatches, handleMatchResponse } = useMatchQueries(session?.user?.id);

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  // Calculate actual counts from the data
  const confirmedCount = confirmedMatches?.length || 0;
  const pendingCount = pendingMatches?.length || 0;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
        
        <Tabs defaultValue="matches" className="space-y-6">
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
            <MatchList
              matches={confirmedMatches || []}
              onChatClick={handleChatClick}
            />
          </TabsContent>

          <TabsContent value="pending">
            <MatchList
              matches={pendingMatches || []}
              isPending
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