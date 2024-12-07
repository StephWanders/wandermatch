import { Home, Heart, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  to?: string;
}

const NavButton = ({ icon: Icon, label, active, onClick, to }: NavButtonProps) => {
  const ButtonContent = () => (
    <div className={`flex flex-col items-center space-y-1 ${active ? "text-blue-600" : "text-gray-600"}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="flex flex-col items-center space-y-1">
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center space-y-1">
      <ButtonContent />
    </button>
  );
};

interface BottomNavProps {
  session: any;
  profile: any;
}

const BottomNav = ({ session, profile }: BottomNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex justify-around items-center z-50">
      <NavButton icon={Home} label="Home" active to="/" />
      {session && <NavButton icon={Heart} label="Matches" to="/matches" />}
      {session && <NavButton icon={MessageCircle} label="Chat" to="/chat" />}
      {session ? (
        <button
          onClick={() => navigate("/create-profile")}
          className="flex flex-col items-center space-y-1"
        >
          <ProfileAvatar imageUrl={profile?.profile_image_url} name={profile?.full_name} />
          <span className="text-xs font-medium">Profile</span>
        </button>
      ) : (
        <NavButton
          icon={ProfileAvatar}
          label="Sign In"
          onClick={() => navigate("/")}
        />
      )}
    </nav>
  );
};

export default BottomNav;