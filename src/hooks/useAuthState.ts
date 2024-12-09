import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Initializing auth state...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got session:', session?.user?.id);
      setSession(session);
      if (session?.user?.id) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setSession(session);
      
      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // First, try to get the existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        toast.error("Failed to load profile");
        throw fetchError;
      }

      if (existingProfile) {
        console.log('Profile found:', existingProfile);
        setProfile(existingProfile);
        setLoading(false);
        return;
      }

      console.log('No profile found, creating new profile');
      
      // If no profile exists, create one with upsert to handle potential race conditions
      const { data: newProfile, error: upsertError } = await supabase
        .from("profiles")
        .upsert([{ id: userId }], { 
          onConflict: 'id',
          ignoreDuplicates: true 
        })
        .select()
        .single();

      if (upsertError) {
        console.error("Error creating profile:", upsertError);
        toast.error("Failed to create profile");
        throw upsertError;
      }

      console.log('Profile created:', newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return { session, profile, loading };
};