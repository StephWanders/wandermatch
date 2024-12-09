import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

const TopNav = () => {
  const navigate = useNavigate();
  const { session } = useAuthState();

  const handleSignIn = () => {
    if (session) {
      navigate('/matches');
    } else {
      // Show sign in form
      navigate('/?view=sign_in');
    }
  };

  const handleSignUp = () => {
    if (session) {
      navigate('/matches');
    } else {
      // Show sign up form
      navigate('/?view=sign_up');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span 
              onClick={() => navigate('/')} 
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-primary transition-colors"
            >
              WanderMatch
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;