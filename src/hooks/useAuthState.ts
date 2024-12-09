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
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Failed to load profile");
      }
    };

    // Initial auth check
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;

      setSession(currentSession);
      if (currentSession?.user?.id) {
        await fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);
      setSession(newSession);

      if (newSession?.user?.id) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading };
};