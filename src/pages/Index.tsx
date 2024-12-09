import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import Hero from "@/components/home/Hero";
import LandingPage from "@/components/home/landing/LandingPage";
import { Button } from "@/components/ui/button";
import { createTestUsers } from "@/utils/createTestUsers";
import BottomNav from "@/components/navigation/BottomNav";
import LoadingSpinner from "@/components/ui/loading-spinner";
import TopNav from "@/components/navigation/TopNav";

const Index = () => {
  const { session, profile, loading } = useAuthState();

  console.log('Index page render:', { session, profile, loading });

  // Show loading spinner while authentication state is being determined
  if (loading) {
    console.log('Showing loading spinner');
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!session) {
    console.log("No session, showing landing page");
    return <LandingPage />;
  }

  // If authenticated but no profile, show loading spinner
  if (!profile) {
    console.log("Session exists but no profile, showing loading spinner");
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log("Session and profile exist, showing authenticated view");
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
        
        {/* Temporary button for creating test users - remove in production */}
        <div className="fixed bottom-20 right-4">
          <Button 
            onClick={handleCreateTestUsers}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            Create Test Users
          </Button>
        </div>

        <BottomNav session={session} profile={profile} />
      </div>
    </div>
  );
};

const handleCreateTestUsers = async () => {
  try {
    await createTestUsers();
    toast.success("Test users created successfully!");
  } catch (error: any) {
    console.error("Error creating test users:", error);
    toast.error(error.message || "Failed to create test users");
  }
};

export default Index;