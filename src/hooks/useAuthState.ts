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
        console.log('Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        
        if (mounted) {
          console.log('Profile data:', data);
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial auth check:', initialSession ? 'Found session' : 'No session');
        
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user?.id) {
            await fetchProfile(initialSession.user.id);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        setSession(newSession);
        if (newSession?.user?.id) {
          await fetchProfile(newSession.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
      }
    });

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      console.log('Cleaning up auth state hook');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading };
};