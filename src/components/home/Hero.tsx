import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthSection from "./AuthSection";
import WelcomeSection from "./WelcomeSection";

interface HeroProps {
  session: any;
  profile: any;
}

const Hero = ({ session, profile }: HeroProps) => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Sign out successful');
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <section className="relative min-h-screen font-body">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-20">
        {session && profile ? (
          <div className="animate-fade-in">
            <div className="flex justify-end mb-6">
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
            <WelcomeSection session={session} profile={profile} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-accent-800 font-display mb-6">
                Find Your Perfect
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500">
                  Travel Companion
                </span>
              </h1>
              <p className="text-xl text-accent-600 max-w-2xl mx-auto leading-relaxed">
                Connect with like-minded travelers who share your passion for exploration and adventure.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/?view=sign_up")}
              >
                Join Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/?view=sign_in")}
              >
                Sign In
              </Button>
            </div>

            <AuthSection />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;