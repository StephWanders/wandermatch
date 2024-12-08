import { Database } from "@/integrations/supabase/types";

export type Match = {
  id: string;
  status: string;
  profile1_id: string;
  profile2_id: string;
  matched_at?: string | null;
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender?: Database['public']['Tables']['profiles']['Row'];
  match?: {
    id: string;
    matched_at: string | null;
    profile1_id: string | null;
    profile2_id: string | null;
    status: string;
    profiles: Database['public']['Tables']['profiles']['Row'];
  };
};