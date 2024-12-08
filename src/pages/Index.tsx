import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";
import Hero from "@/components/home/Hero";
import LandingPage from "@/components/home/landing/LandingPage";
import { Button } from "@/components/ui/button";
import { createTestUsers } from "@/utils/createTestUsers";
import BottomNav from "@/components/navigation/BottomNav";
import LoadingSpinner from "@/components/ui/loading-spinner";

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
            backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b')",
          }}
        >
          <div className="absolute inset-0 bg-white/90" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Hero session={session} profile={profile} />
        
        {/* Temporary button for creating test users - remove in production */}
        <div className="fixed bottom-20 right-4">
          <Button 
            onClick={handleCreateTestUsers}
            variant="outline"
            className="bg-white"
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