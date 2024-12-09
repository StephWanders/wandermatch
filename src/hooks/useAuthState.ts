import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    console.log('🔄 [useAuthState] Starting effect, initializing auth state...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('📥 [useAuthState] Getting initial session...');
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ [useAuthState] Session error:', sessionError);
          throw sessionError;
        }
        
        console.log('✨ [useAuthState] Initial session result:', initialSession?.user?.id);
        
        if (!mounted) {
          console.log('❌ [useAuthState] Component unmounted during initialization');
          return;
        }

        setSession(initialSession);
        
        if (initialSession?.user?.id) {
          console.log('🔍 [useAuthState] Fetching profile for user:', initialSession.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", initialSession.user.id)
            .single();

          if (!mounted) {
            console.log('❌ [useAuthState] Component unmounted during profile fetch');
            return;
          }

          if (profileError) {
            console.error('🚫 [useAuthState] Error fetching profile:', profileError);
            setError(profileError);
            setLoading(false);
            return;
          }

          console.log('✅ [useAuthState] Profile loaded successfully:', profileData);
          setProfile(profileData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('💥 [useAuthState] Error during initialization:', error);
        if (mounted) {
          setError(error);
          setLoading(false);
          toast.error("Failed to initialize authentication state");
        }
      }
    };

    initializeAuth();

    console.log('👂 [useAuthState] Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('🔄 [useAuthState] Auth state changed:', event, newSession?.user?.id);
      if (!mounted) {
        console.log('❌ [useAuthState] Component unmounted during auth state change');
        return;
      }
      
      setSession(newSession);
      
      if (newSession?.user?.id) {
        console.log('🔍 [useAuthState] Fetching profile after auth state change');
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", newSession.user.id)
          .single();

        if (!mounted) {
          console.log('❌ [useAuthState] Component unmounted during profile fetch');
          return;
        }

        if (profileError) {
          console.error('🚫 [useAuthState] Error fetching profile:', profileError);
          setError(profileError);
          setLoading(false);
          toast.error("Failed to load user profile");
          return;
        }

        console.log('✅ [useAuthState] Profile loaded after auth state change:', profileData);
        setProfile(profileData);
      } else {
        console.log('👻 [useAuthState] No session after auth state change, clearing profile');
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('🧹 [useAuthState] Cleaning up effect');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading, error };
};