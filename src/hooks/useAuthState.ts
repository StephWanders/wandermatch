import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  useEffect(() => {
    console.log('Initializing auth state...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got session:', session?.user?.id);
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id);
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId, 'Attempt:', retryCount + 1);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      console.log('Profile data:', data);
      setProfile(data);
      setRetryCount(0); // Reset retry count on success
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchProfile(userId);
        }, RETRY_DELAY);
      } else {
        console.error("Max retries reached. Failed to load profile.");
        toast.error("Failed to load profile. Please refresh the page.");
        setLoading(false);
      }
    }
  };

  return { session, profile, loading };
};