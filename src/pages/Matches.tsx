import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/navigation/BottomNav";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchList from "@/components/matches/MatchList";
import SwipeCard from "@/components/matches/SwipeCard";
import { usePotentialMatches } from "@/hooks/usePotentialMatches";

const Matches = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  // Query for confirmed matches
  const { data: confirmedMatches } = useQuery({
    queryKey: ['confirmed-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      console.log('Fetching confirmed matches');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile2_id_fkey(*)
        `)
        .eq('status', 'accepted')
        .or(`profile1_id.eq.${session.user.id},profile2_id.eq.${session.user.id}`);
      
      if (error) {
        console.error('Error fetching confirmed matches:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Query for pending matches
  const { data: pendingMatches } = useQuery({
    queryKey: ['pending-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      console.log('Fetching pending matches');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile1_id_fkey(*)
        `)
        .eq('profile2_id', session.user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending matches:', error);
        return [];
      }
      
      console.log('Pending matches:', data);
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      console.log('Updating match:', matchId, 'with status:', accept ? 'accepted' : 'rejected');
      
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: accept ? 'accepted' : 'rejected' 
        })
        .eq('id', matchId);

      if (error) throw error;
      
      // Invalidate both queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['confirmed-matches'] });
      queryClient.invalidateQueries({ queryKey: ['pending-matches'] });
      
      toast.success(accept ? "Match accepted!" : "Match declined");
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match status");
    }
  };

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  const { 
    currentProfile,
    handleSwipe
  } = usePotentialMatches(session?.user?.id, profile);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
        
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList>
            <TabsTrigger value="matches">
              Matches ({confirmedMatches?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingMatches?.length || 0})
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
            {currentProfile ? (
              <SwipeCard
                profile={currentProfile}
                onSwipe={handleSwipe}
                currentUserId={session?.user?.id}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No more profiles to show at the moment.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Matches;