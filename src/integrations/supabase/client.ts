import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkvhkkgpqblclwgrzkwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrdmhra2dwcWJsY2x3Z3J6a3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1ODUyODMsImV4cCI6MjA0OTE2MTI4M30.XTzxunlejpMRVtAh2IY1By4xVt59KnWsERD_EpZIeS0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});