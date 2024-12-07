import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface HeroProps {
  session: any;
  profile: any;
}

const Hero = ({ session, profile }: HeroProps) => {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-green-900/70 backdrop-blur-sm" />
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
            {!profile?.full_name ? (
              <Button
                size="lg"
                className="animate-bounce bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                asChild
              >
                <Link to="/create-profile">Complete Your Profile</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300"
                asChild
              >
                <Link to="/matches">Find Matches</Link>
              </Button>
            )}
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
  );
};

export default Hero;