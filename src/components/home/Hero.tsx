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
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-[url('/lovable-uploads/91bcf6ae-8755-4ca9-9a87-b9d1f6ce5f95.png')] 
        bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/30 to-teal-900/30 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {session && profile ? (
          <div className="animate-fade-in">
            <div className="absolute top-4 right-4 flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-lg p-3">
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
        ) : (
          <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-white font-display mb-4">
                Find Your Perfect
                <br />
                Travel Companion
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-body">
                Connect with like-minded travelers who share your passion for exploration and adventure.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-full"
                onClick={() => navigate("/?view=sign_up")}
              >
                Join Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full"
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