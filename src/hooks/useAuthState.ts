import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('Initializing auth state...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.id);
        
        if (!mounted) return;
        
        if (session?.user?.id) {
          setSession(session);
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!mounted) return;

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setError(profileError);
            setLoading(false);
            return;
          }

          console.log('Profile loaded:', profileData);
          setProfile(profileData);
          setLoading(false);
        } else {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError(error);
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
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!mounted) return;

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError(profileError);
          setLoading(false);
          return;
        }

        setProfile(profileData);
        setLoading(false);
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

  return { session, profile, loading, error };
};