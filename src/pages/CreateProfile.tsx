import { useEffect, useState } from "react";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/integrations/supabase/client";

const CreateProfile = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="p-6 md:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <ProfileHeader />
          <ProfileImageUpload />
          <ProfileForm 
            session={session} 
            profile={profile} 
            onProfileUpdate={() => fetchProfile(session?.user?.id)}
          />
        </div>
      </div>
      <BottomNav session={session} profile={profile} />
    </div>
  );
};

export default CreateProfile;