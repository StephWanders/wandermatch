import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  session: any;
  profile: any;
}

const TopNav = ({ session, profile }: TopNavProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/c240c260-ea6d-4ad3-adea-d318a98900de.png" 
                alt="WanderMatch Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-primary">WanderMatch</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{profile?.full_name}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-12 rounded-full transition-all duration-200 hover:ring-2 hover:ring-primary hover:ring-offset-2 group p-0"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <ProfileAvatar 
                      imageUrl={profile?.profile_image_url} 
                      name={profile?.full_name} 
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center">
                      <ChevronDown className="h-5 w-5 text-primary drop-shadow-sm bg-white/80 rounded-full p-0.5 backdrop-blur-sm border border-primary/10 group-hover:text-primary-600 transition-colors duration-200" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/create-profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account-settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;