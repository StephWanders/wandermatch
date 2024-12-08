import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import BottomNav from "@/components/navigation/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchList from "@/components/matches/MatchList";
import DiscoverTab from "@/components/matches/DiscoverTab";
import { useMatchQueries } from "@/hooks/useMatchQueries";
import { toast } from "sonner";

const Matches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

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
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId);

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        throw error;
      }

      // Handle the case where data is an array
      const profileData = data?.[0] || null;
      console.log('Profile data:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    }
  };

  const { confirmedMatches, pendingMatches, handleMatchResponse } = useMatchQueries(session?.user?.id);

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

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