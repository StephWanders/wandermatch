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
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-purple-500/10 to-pink-500/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        {session && profile ? (
          <div className="animate-fade-in">
            <div className="absolute top-4 right-4 flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-lg p-3">
              <div className="text-right">
                <h3 className="text-lg font-semibold text-gray-800">
                  Welcome, {profile.full_name}!
                </h3>
                <p className="text-gray-600 text-sm">Ready to explore?</p>
              </div>
              <ProfileAvatar imageUrl={profile.profile_image_url} name={profile.full_name} />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-700 hover:text-gray-900"
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
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 font-display mb-4">
                Find Your Perfect
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500">
                  Travel Companion
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
                Connect with like-minded travelers who share your passion for exploration and adventure.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/?view=sign_up")}
              >
                Join Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/?view=sign_in")}
              >
                Sign In
              </Button>
            </div>

            <AuthSection />
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-teal-500/20 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl" />
    </section>
  );
};

export default Hero;