import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import ProfileForm from "@/components/profile/ProfileForm";
import LoadingSpinner from "@/components/ui/loading-spinner";
import TopNav from "@/components/navigation/TopNav";
import BottomNav from "@/components/navigation/BottomNav";

const CreateProfile = () => {
  const navigate = useNavigate();
  const { session, profile, loading } = useAuthState();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/");
    }
  }, [session, loading, navigate]);

  const handleProfileUpdate = () => {
    navigate("/matches?tab=discover");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-white/90 backdrop-blur-[1px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <TopNav session={session} profile={profile} />
        
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-3xl font-bold text-center mb-8">
            {profile ? 'Edit Your Profile' : 'Create Your Profile'}
          </h1>
          <ProfileForm
            session={session}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>

        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

export default CreateProfile;