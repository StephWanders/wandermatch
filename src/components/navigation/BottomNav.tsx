import { Home, Heart, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";

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
  const currentPath = location.pathname;

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
          to="/matches" 
          active={currentPath.startsWith('/chat')} 
        />
      )}
      {session && (
        <Link 
          to="/create-profile" 
          className="flex flex-col items-center space-y-1"
        >
          <ProfileAvatar 
            imageUrl={profile?.profile_image_url} 
            name={profile?.full_name} 
          />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      )}
    </nav>
  );
};

export default BottomNav;