import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BottomNav from "@/components/navigation/BottomNav";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchList from "@/components/matches/MatchList";
import SwipeCard from "@/components/matches/SwipeCard";
import { calculateMatchScore } from "@/utils/matching";

const Matches = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchPotentialMatches(session.user.id);
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

  const fetchPotentialMatches = async (userId: string) => {
    try {
      // Get all profiles that:
      // 1. Are not the current user
      // 2. Haven't been swiped on
      // 3. Haven't matched with the user
      const { data: existingSwipes } = await supabase
        .from('potential_matches')
        .select('target_id')
        .eq('user_id', userId);

      const { data: existingMatches } = await supabase
        .from('matches')
        .select('profile1_id, profile2_id')
        .or(`profile1_id.eq.${userId},profile2_id.eq.${userId}`);

      // Collect all IDs to exclude
      const swipedIds = existingSwipes?.map(swipe => swipe.target_id) || [];
      const matchedIds = existingMatches?.flatMap(match => [
        match.profile1_id,
        match.profile2_id
      ]).filter(id => id !== userId) || [];
      const excludeIds = [...new Set([...swipedIds, ...matchedIds, userId])];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .gt('id', '0'); // Ensure we have valid profiles

      if (profiles && profile) {
        // Sort profiles by match score
        const scoredProfiles = profiles
          .map(p => ({
            ...p,
            matchScore: calculateMatchScore(profile, p)
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .filter(p => p.matchScore > 0);

        setPotentialMatches(scoredProfiles);
      }
    } catch (error) {
      console.error("Error fetching potential matches:", error);
      toast.error("Failed to load potential matches");
    }
  };

  const { data: confirmedMatches, isLoading: isLoadingConfirmed } = useQuery({
    queryKey: ['confirmed-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile2_id_fkey(*)
        `)
        .or(`profile1_id.eq.${session.user.id},profile2_id.eq.${session.user.id}`)
        .eq('status', 'accepted');
      
      return matchesData || [];
    },
    enabled: !!session?.user?.id,
  });

  const { 
    data: pendingMatches, 
    isLoading: isLoadingPending,
  } = useQuery({
    queryKey: ['pending-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_profile1_id_fkey(*)
        `)
        .eq('profile2_id', session.user.id)
        .eq('status', 'pending');
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ 
          status: accept ? 'accepted' : 'rejected',
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

  const handleSwipe = () => {
    setCurrentMatchIndex(prev => prev + 1);
    // Refresh potential matches if we're running low
    if (currentMatchIndex >= potentialMatches.length - 3) {
      fetchPotentialMatches(session.user.id);
    }
  };

  const currentProfile = potentialMatches[currentMatchIndex];

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