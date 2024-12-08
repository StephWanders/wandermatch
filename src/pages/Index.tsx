import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createTestUsers } from "@/utils/createTestUsers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AuthSection from "@/components/home/AuthSection";
import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import WelcomeSection from "@/components/home/WelcomeSection";
import BottomNav from "@/components/navigation/BottomNav";

const Index = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        toast.success("Welcome back!");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!profile?.full_name) {
          navigate("/create-profile");
          toast.info("Please complete your profile to get started!");
        } else {
          fetchProfile(session.user.id);
          toast.success("Successfully logged in!");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleCreateTestUsers = async () => {
    console.log("Creating test users...");
    try {
      await createTestUsers();
      console.log("Test users created!");
      toast.success("Test users created successfully!");
    } catch (error) {
      console.error("Error creating test users:", error);
      toast.error("Failed to create test users. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Hero session={session} profile={profile} />
      {!session && (
        <>
          <Features />
          <WelcomeSection session={session} profile={profile} />
          <AuthSection />
          <CallToAction />
        </>
      )}
      
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
      
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default Index;