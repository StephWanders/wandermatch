import { Button } from "@/components/ui/button";
import { createTestUsers } from "@/utils/createTestUsers";
import AuthSection from "@/components/home/AuthSection";
import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import WelcomeSection from "@/components/home/WelcomeSection";

const Index = () => {
  const handleCreateTestUsers = async () => {
    console.log("Creating test users...");
    await createTestUsers();
    console.log("Test users created!");
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <WelcomeSection />
      <AuthSection />
      <CallToAction />
      
      {/* Temporary button for creating test users - remove after testing */}
      <div className="fixed bottom-4 right-4">
        <Button 
          onClick={handleCreateTestUsers}
          variant="outline"
          className="bg-white"
        >
          Create Test Users
        </Button>
      </div>
    </div>
  );
};

export default Index;