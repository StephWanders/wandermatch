import { Home, Heart, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import { Badge } from "@/components/ui/badge";

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
}

const NavButton = ({ icon: Icon, label, to, onClick, active, badge }: NavButtonProps) => {
  if (to) {
    return (
      <Link 
        to={to} 
        className="flex flex-col items-center space-y-1 transition-colors duration-200"
      >
        <div className={`flex flex-col items-center space-y-1 ${
          active ? "text-primary-600" : "text-accent-500 hover:text-accent-700"
        }`}>
          <div className="relative">
            <Icon className="w-6 h-6" />
            {badge !== undefined && badge > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 bg-primary-500 text-white px-1.5 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-xs rounded-full"
              >
                {badge}
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium font-display tracking-wide">{label}</span>
        </div>
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center space-y-1 transition-colors duration-200"
    >
      <div className={`flex flex-col items-center space-y-1 ${
        active ? "text-primary-600" : "text-accent-500 hover:text-accent-700"
      }`}>
        <div className="relative">
          <Icon className="w-6 h-6" />
          {badge !== undefined && badge > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 bg-primary-500 text-white px-1.5 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center text-xs rounded-full"
            >
              {badge}
            </Badge>
          )}
        </div>
        <span className="text-xs font-medium font-display tracking-wide">{label}</span>
      </div>
    </button>
  );
};

interface BottomNavProps {
  session: any;
  profile: any;
}

const BottomNav = ({ session }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Get unread messages count and pending matches
  const { unreadMessages, pendingMatches } = useWelcomeData(session?.user?.id);
  const unreadCount = unreadMessages?.length || 0;

  const handleChatClick = () => {
    if (session) {
      navigate('/chat');
    }
  };

  const handleMatchesClick = () => {
    if (session) {
      // If coming from pending matches notification, go to pending tab
      if (pendingMatches?.length > 0) {
        navigate('/matches?tab=pending');
      } else {
        navigate('/matches');
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-primary-100 px-4 py-3 flex justify-around items-center z-50 shadow-lg">
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
          onClick={handleMatchesClick}
          active={currentPath === '/matches'} 
          badge={pendingMatches?.length}
        />
      )}
      {session && (
        <NavButton 
          icon={MessageCircle} 
          label="Chat" 
          onClick={handleChatClick}
          active={currentPath.startsWith('/chat')} 
          badge={unreadCount}
        />
      )}
    </nav>
  );
};

export default BottomNav;