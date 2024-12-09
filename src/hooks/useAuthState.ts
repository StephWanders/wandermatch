import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        console.log('🔍 [useAuthState] Fetching profile for user:', userId);
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error('❌ [useAuthState] Profile error:', profileError);
          throw profileError;
        }

        if (mounted) {
          console.log('✅ [useAuthState] Profile loaded:', data);
          setProfile(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('💥 [useAuthState] Error:', error);
        if (mounted) {
          setError(error);
          setLoading(false);
          toast.error("Failed to load profile");
        }
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user?.id) {
            await fetchProfile(initialSession.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('💥 [useAuthState] Init error:', error);
        if (mounted) {
          setError(error);
          setLoading(false);
          toast.error("Authentication error");
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('🔄 [useAuthState] Auth state changed:', event, newSession?.user?.id);
      
      if (!mounted) return;
      
      setSession(newSession);
      
      if (newSession?.user?.id) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading, error };
};