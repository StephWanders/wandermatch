import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing auth state...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        if (session?.user?.id) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      if (!mounted) return;
      
      setSession(session);
      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        if (fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          console.log('No profile found, creating new profile');
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: userId }])
            .select()
            .single();

          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast.error("Failed to create profile");
            setLoading(false);
            return;
          }

          console.log('New profile created:', newProfile);
          setProfile(newProfile);
        } else {
          toast.error("Failed to load profile");
        }
        setLoading(false);
        return;
      }

      console.log('Profile found:', existingProfile);
      setProfile(existingProfile);
      setLoading(false);

    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  return { session, profile, loading };
};