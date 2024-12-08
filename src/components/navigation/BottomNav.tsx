import { Home, Heart, MessageCircle, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}

const NavButton = ({ icon: Icon, label, to, active }: NavButtonProps) => (
  <Link to={to} className="flex flex-col items-center space-y-1">
    <div className={`flex flex-col items-center space-y-1 ${active ? "text-blue-600" : "text-gray-600"}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  </Link>
);

interface BottomNavProps {
  session: any;
  profile: any;
}

const BottomNav = ({ session, profile }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { latestChat } = useWelcomeData(session?.user?.id);

  const chatPath = latestChat ? `/chat/${latestChat}` : '/matches';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex justify-around items-center z-50">
      <NavButton 
        icon={Home} 
        label="Home" 
        to="/" 
        active={currentPath === '/'} 
      />
      {session && (
        <NavButton 
          icon={Heart} 
          label="Matches" 
          to="/matches" 
          active={currentPath === '/matches'} 
        />
      )}
      {session && (
        <NavButton 
          icon={MessageCircle} 
          label="Chat" 
          to={chatPath}
          active={currentPath.startsWith('/chat')} 
        />
      )}
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center space-y-1">
            <ProfileAvatar 
              imageUrl={profile?.profile_image_url} 
              name={profile?.full_name} 
            />
            <span className="text-xs font-medium">Profile</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/create-profile" className="cursor-pointer">
                Edit Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default BottomNav;