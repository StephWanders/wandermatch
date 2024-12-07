import { Database } from "@/integrations/supabase/types";

export type Match = Database['public']['Tables']['matches']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export type Message = Database['public']['Tables']['messages']['Row'] & {
  match?: {
    id: string;
    matched_at: string | null;
    profile1_id: string | null;
    profile2_id: string | null;
    status: string;
    profiles: Database['public']['Tables']['profiles']['Row'];
  };
};