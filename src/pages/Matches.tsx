import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import BottomNav from "@/components/navigation/BottomNav";
import { MessageCircle, Heart, X, Check } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Fetch confirmed matches
  const { data: confirmedMatches } = useQuery({
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

  // Fetch pending matches (where current user is profile2)
  const { data: pendingMatches, refetch: refetchPending } = useQuery({
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
      
      toast.success(accept ? "Match accepted!" : "Match declined");
      refetchPending();
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match status");
    }
  };

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  const renderMatchCard = (match: any, isPending: boolean = false) => {
    const matchedProfile = isPending ? match.profiles : match.profiles;
    return (
      <Card 
        key={match.id}
        className="hover:shadow-lg transition-shadow"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ProfileAvatar
                imageUrl={matchedProfile.profile_image_url}
                name={matchedProfile.full_name}
              />
              <div>
                <h3 className="font-semibold">{matchedProfile.full_name}</h3>
                <p className="text-sm text-gray-500">{matchedProfile.location}</p>
              </div>
            </div>
            {isPending && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMatchResponse(match.id, false)}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMatchResponse(match.id, true)}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">{matchedProfile.bio?.substring(0, 100)}...</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {matchedProfile.interests?.slice(0, 3).map((interest: string) => (
                <span
                  key={interest}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          {!isPending && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> Travel Style: {matchedProfile.travel_style}
                </span>
              </div>
              <Button 
                onClick={() => handleChatClick(match.id)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

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
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            {confirmedMatches?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No matches yet. Keep exploring!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedMatches?.map((match) => renderMatchCard(match))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingMatches?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No pending matches at the moment.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingMatches?.map((match) => renderMatchCard(match, true))}
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