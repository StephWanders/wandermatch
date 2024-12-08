import { Home, Heart, MessageCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useWelcomeData } from "@/hooks/useWelcomeData";

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
      <Link 
        to={to} 
        className="flex flex-col items-center space-y-1 transition-colors duration-200"
      >
        <div className={`flex flex-col items-center space-y-1 ${
          active ? "text-primary-600" : "text-accent-500 hover:text-accent-700"
        }`}>
          <Icon className="w-6 h-6" />
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
        <Icon className="w-6 h-6" />
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

  // Query to get active matches and their latest messages
  const { activeMatches } = useWelcomeData(session?.user?.id);

  const handleChatClick = () => {
    console.log('Handling chat click, active matches:', activeMatches);
    
    if (activeMatches && activeMatches.length > 0) {
      const mostRecentMatch = activeMatches[0];
      console.log('Navigating to most recent match:', mostRecentMatch.id);
      
      navigate(`/chat/${mostRecentMatch.id}`, { 
        state: { from: location.pathname, showLatest: true }
      });
    } else {
      console.log('No active matches found, navigating to matches page');
      navigate('/matches');
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
    </nav>
  );
};

export default BottomNav;