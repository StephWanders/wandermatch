import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authListener: any = null;

    const fetchProfile = async (userId: string) => {
      if (!mounted) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        
        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile");
      }
    };

    // Initial auth check - only runs once
    if (!initialized) {
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (!mounted) return;

        console.log('Initial session check:', currentSession ? 'Found session' : 'No session');
        setSession(currentSession);
        
        if (currentSession?.user?.id) {
          fetchProfile(currentSession.user.id);
        }
        
        setLoading(false);
        setInitialized(true);
      });
    }

    // Set up auth listener only once
    if (!authListener) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, 'Session:', newSession ? 'exists' : 'null');
        
        // Only update if the session actually changed
        if (JSON.stringify(session) !== JSON.stringify(newSession)) {
          setSession(newSession);
          
          if (newSession?.user?.id) {
            await fetchProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        }
      });
      
      authListener = subscription;
    }

    return () => {
      console.log('Cleaning up auth state hook');
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [initialized, session]); // Only re-run if initialized or session changes

  return { session, profile, loading };
};