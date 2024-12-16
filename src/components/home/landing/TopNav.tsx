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
      navigate('/?view=sign_in');
    }
  };

  const handleSignUp = () => {
    if (session) {
      navigate('/matches');
    } else {
      navigate('/?view=sign_up');
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
              <span className="text-xl font-bold" style={{ color: '#2fcab7' }}>WanderMatch</span>
            </a>
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
              className="bg-primary hover:bg-primary-600 text-white"
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