import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import BottomNav from "@/components/navigation/BottomNav";

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

  const { data: matches } = useQuery({
    queryKey: ['matches', session?.user?.id],
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

  const handleChatClick = (matchId: string) => {
    navigate(`/chat/${matchId}`);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches?.map((match) => {
            const matchedProfile = match.profiles;
            return (
              <Card 
                key={match.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleChatClick(match.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <ProfileAvatar
                      imageUrl={matchedProfile.profile_image_url}
                      name={matchedProfile.full_name}
                    />
                    <div>
                      <h3 className="font-semibold">{matchedProfile.full_name}</h3>
                      <p className="text-sm text-gray-500">{matchedProfile.travel_style}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="text-gray-600">{matchedProfile.bio?.substring(0, 100)}...</p>
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
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChatClick(match.id);
                    }}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Matches;