import { useAuthState } from "@/hooks/useAuthState";
import Hero from "@/components/home/Hero";
import LandingPage from "@/components/home/landing/LandingPage";
import BottomNav from "@/components/navigation/BottomNav";
import LoadingSpinner from "@/components/ui/loading-spinner";
import TopNav from "@/components/navigation/TopNav";

const Index = () => {
  const { session, profile, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
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
        <Hero session={session} profile={profile} />
        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

export default Index;