import { Database } from "@/integrations/supabase/types";

export type Match = Database['public']['Tables']['matches']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export type Message = Database['public']['Tables']['messages']['Row'] & {
  match?: Match;
};