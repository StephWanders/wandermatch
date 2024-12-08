import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
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
      <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 backdrop-blur-sm" />
      
      {session && profile && (
        <div className="relative">
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
          
          <WelcomeSection session={session} profile={profile} />
        </div>
      )}

      {!session && (
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

          <AuthSection />
        </div>
      )}
    </section>
  );
};

export default Hero;