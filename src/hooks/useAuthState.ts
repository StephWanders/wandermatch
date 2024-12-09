import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        
        if (mounted) {
          console.log('Profile loaded:', data);
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile");
      }
    };

    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user?.id) {
            await fetchProfile(currentSession.user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error("Authentication error");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (mounted) {
          setSession(newSession);
          
          if (newSession?.user?.id) {
            await fetchProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
          
          setLoading(false);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading };
};