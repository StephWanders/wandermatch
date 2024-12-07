import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bell, LogOut } from "lucide-react";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface HeroProps {
  session: any;
  profile: any;
}

const Hero = ({ session, profile }: HeroProps) => {
  const navigate = useNavigate();
  
  const { data: newMatches } = useQuery({
    queryKey: ['new-matches', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('matches')
        .select('*, profiles!matches_profile2_id_fkey(*)')
        .eq('profile1_id', session.user.id)
        .eq('status', 'pending')
        .order('matched_at', { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from('messages')
        .select('*, profiles!messages_sender_id_fkey(*)')
        .eq('receiver_id', session.user.id)
        .is('read_at', null)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
      console.error("Error signing out:", error);
      return;
    }
    toast.success("Successfully signed out");
    navigate("/");
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-green-900/70 backdrop-blur-sm" />
      
      {session && profile && (
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -top-20 right-4 flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-lg p-3">
            <div className="text-right">
              <h3 className="text-lg font-semibold text-white">
                Welcome, {profile.full_name}!
              </h3>
              <p className="text-white/80 text-sm">Ready to explore?</p>
            </div>
            <ProfileAvatar imageUrl={profile.profile_image_url} name={profile.full_name} />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-white hover:text-white/80"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in">
            <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
              <Link to="/matches">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">New Matches</h3>
                    <p className="text-sm text-gray-600">
                      {newMatches?.length || 0} new potential matches
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
              <Link to="/chat">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Recent Messages</h3>
                    <p className="text-sm text-gray-600">
                      {recentMessages?.length || 0} unread messages
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
              <Link to="/notifications">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Activity</h3>
                    <p className="text-sm text-gray-600">
                      Check your travel updates
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      )}

      {!session && (
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white/90 font-display">WanderMatch</h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-display">
              Find Your Perfect Travel Companion
            </h1>
          </div>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-body">
            Connect with like-minded travelers who share your passion for exploration and adventure.
          </p>

          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Join WanderMatch</CardTitle>
              <CardDescription>Sign in or create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#2563eb',
                        brandAccent: '#1d4ed8',
                      },
                    },
                  },
                }}
                providers={[]}
                onError={(error) => {
                  console.error("Auth error:", error);
                  toast.error(error.message);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default Hero;