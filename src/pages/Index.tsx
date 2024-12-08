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

  const handleCreateTestUsers = async () => {
    try {
      await createTestUsers();
      toast.success("Test users created successfully!");
    } catch (error: any) {
      console.error("Error creating test users:", error);
      toast.error(error.message || "Failed to create test users");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
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
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-[2px]" />
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

export default Index;