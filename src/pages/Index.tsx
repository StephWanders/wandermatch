import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Shield, MessageSquare, Calendar, MapPin, Home, Heart, MessageCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        toast.success("Welcome back!");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        toast.success("Successfully logged in!");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Hero Section with Travel Background */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')] 
          bg-cover bg-center bg-fixed"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-green-900/70 backdrop-blur-sm"
        />
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white/90 font-display">
              WanderMatch
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-display">
              Find Your Perfect Travel Companion
            </h1>
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-body">
            Connect with like-minded travelers who share your passion for exploration and adventure.
          </p>
          {!session ? (
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
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="animate-bounce bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300" 
                asChild
              >
                <Link to="/create-profile">Complete Your Profile</Link>
              </Button>
              <div>
                <Button 
                  variant="outline" 
                  className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Features with Mountain Background */}
      <section className="py-24 px-4 relative">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb')] 
          bg-cover bg-center opacity-10"
        />
        <div className="relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-display">
            Why Choose WanderMatch?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={Users}
              title="Smart Matching"
              description="Find companions based on travel style, interests, and destination preferences"
            />
            <FeatureCard
              icon={Calendar}
              title="Travel Groups & Events"
              description="Join group trips or connect with fellow travelers at local events"
            />
            <FeatureCard
              icon={Shield}
              title="Safe & Secure"
              description="Verified profiles and safety features for peace of mind"
            />
            <FeatureCard
              icon={MessageSquare}
              title="Easy Communication"
              description="Chat and video call to plan your perfect trip together"
            />
            <FeatureCard
              icon={MapPin}
              title="Local Insights"
              description="Get insider tips and recommendations from locals and travelers"
            />
            <FeatureCard
              icon={Globe}
              title="Custom Itineraries"
              description="Plan and share travel experiences with your matched companions"
            />
          </div>
        </div>
      </section>

      {/* CTA Section with Beach Background */}
      <section className="py-24 px-4 relative">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504893524553-b855bce32c67')] 
          bg-cover bg-center opacity-10"
        />
        <Card className="max-w-2xl mx-auto border-none bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-display">
              Ready to Start Your Journey?
            </CardTitle>
            <CardDescription className="text-center text-lg font-body">
              Join thousands of travelers finding their perfect travel companions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300" 
              asChild
            >
              <Link to="/create-profile">Sign Up Now</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Learn More
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex justify-around items-center z-50">
        <NavButton icon={Home} label="Home" active />
        <NavButton icon={Heart} label="Matches" />
        <NavButton icon={MessageCircle} label="Chat" />
        {session ? (
          <NavButton icon={User} label="Profile" onClick={() => navigate('/create-profile')} />
        ) : (
          <NavButton icon={User} label="Sign In" />
        )}
      </nav>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-600 group-hover:text-green-600 transition-colors" />
        </div>
        <CardTitle className="text-xl text-center group-hover:text-blue-600 transition-colors font-display">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground font-body">{description}</p>
      </CardContent>
    </Card>
  );
};

const NavButton = ({ 
  icon: Icon, 
  label, 
  active,
  onClick 
}: { 
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button 
      className={`flex flex-col items-center space-y-1 ${active ? 'text-blue-600' : 'text-gray-600'}`}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default Index;
