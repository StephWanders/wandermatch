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
import { useQuery } from "@tanstack/react-query";

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  onClick?: () => void;
  active?: boolean;
}

const NavButton = ({ icon: Icon, label, to, onClick, active }: NavButtonProps) => {
  if (to) {
    return (
      <Link to={to} className="flex flex-col items-center space-y-1">
        <div className={`flex flex-col items-center space-y-1 ${active ? "text-blue-600" : "text-gray-600"}`}>
          <Icon className="w-6 h-6" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center space-y-1">
      <div className={`flex flex-col items-center space-y-1 ${active ? "text-blue-600" : "text-gray-600"}`}>
        <Icon className="w-6 h-6" />
        <span className="text-xs font-medium">{label}</span>
      </div>
    </button>
  );
};

interface BottomNavProps {
  session: any;
  profile: any;
}

const BottomNav = ({ session, profile }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Query to get active matches and their latest messages
  const { data: activeMatches } = useQuery({
    queryKey: ['active-matches-with-messages', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // First get all active matches
      const { data: matches } = await supabase
        .from('matches')
        .select('*, profiles!matches_profile2_id_fkey(*)')
        .eq('status', 'active')
        .or(`profile1_id.eq.${session.user.id},profile2_id.eq.${session.user.id}`)
        .order('matched_at', { ascending: false });

      if (!matches?.length) return [];

      // For each match, get the latest message
      const matchesWithMessages = await Promise.all(matches.map(async (match) => {
        const otherProfileId = match.profile1_id === session.user.id ? match.profile2_id : match.profile1_id;
        
        const { data: messages } = await supabase
          .from('messages')
          .select('created_at')
          .or(
            `and(sender_id.eq.${session.user.id},receiver_id.eq.${otherProfileId}),` +
            `and(sender_id.eq.${otherProfileId},receiver_id.eq.${session.user.id})`
          )
          .order('created_at', { ascending: false })
          .limit(1);

        return {
          ...match,
          latestActivity: messages?.[0]?.created_at || match.matched_at
        };
      }));

      // Sort by latest activity
      return matchesWithMessages.sort((a, b) => 
        new Date(b.latestActivity).getTime() - new Date(a.latestActivity).getTime()
      );
    },
    enabled: !!session?.user?.id
  });

  const handleChatClick = () => {
    console.log('Handling chat click, active matches:', activeMatches);
    
    if (activeMatches && activeMatches.length > 0) {
      const mostRecentMatch = activeMatches[0];
      console.log('Navigating to most recent match:', mostRecentMatch.id);
      
      navigate(`/chat/${mostRecentMatch.id}`, { 
        state: { from: location.pathname }
      });
    } else {
      console.log('No active matches found, navigating to matches page');
      navigate('/matches');
    }
  };

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
          onClick={handleChatClick}
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