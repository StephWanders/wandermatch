export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      matches: {
        Row: {
          id: string
          matched_at: string
          profile1_id: string
          profile2_id: string
          status: string
        }
        Insert: {
          id?: string
          matched_at?: string
          profile1_id: string
          profile2_id: string
          status: string
        }
        Update: {
          id?: string
          matched_at?: string
          profile1_id?: string
          profile2_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_profile1_id_fkey"
            columns: ["profile1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_profile2_id_fkey"
            columns: ["profile2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "matchstatus"
            referencedColumns: ["status"]
          },
        ]
      }
      matchstatus: {
        Row: {
          id: number
          status: string | null
        }
        Insert: {
          id?: number
          status?: string | null
        }
        Update: {
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      potential_matches: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          target_id: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          target_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          target_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "potential_matches_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potential_matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_chats: string[] | null
          age: number | null
          bio: string | null
          budget_range: string | null
          created_at: string | null
          email_verified: boolean | null
          full_name: string | null
          gender: string | null
          id: string
          interests: string[] | null
          languages: string[] | null
          location: string | null
          matches: string[] | null
          preferred_destinations: string[] | null
          preferred_gender: string[] | null
          profile_image_url: string | null
          travel_experience_level: string | null
          travel_style: string | null
          updated_at: string | null
        }
        Insert: {
          active_chats?: string[] | null
          age?: number | null
          bio?: string | null
          budget_range?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          gender?: string | null
          id: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          matches?: string[] | null
          preferred_destinations?: string[] | null
          preferred_gender?: string[] | null
          profile_image_url?: string | null
          travel_experience_level?: string | null
          travel_style?: string | null
          updated_at?: string | null
        }
        Update: {
          active_chats?: string[] | null
          age?: number | null
          bio?: string | null
          budget_range?: string | null
          created_at?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          matches?: string[] | null
          preferred_destinations?: string[] | null
          preferred_gender?: string[] | null
          profile_image_url?: string | null
          travel_experience_level?: string | null
          travel_style?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trip_ratings: {
        Row: {
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          match_id: string
          rated_user_id: string
          rater_id: string
          rating: number
          review_text: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          match_id: string
          rated_user_id: string
          rater_id: string
          rating: number
          review_text?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          match_id?: string
          rated_user_id?: string
          rater_id?: string
          rating?: number
          review_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_ratings_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_ratings_rated_user_id_fkey"
            columns: ["rated_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_ratings: {
        Args: {
          user_id: string
        }
        Returns: {
          category: Database["public"]["Enums"]["rating_category"]
          average_rating: number
          total_ratings: number
        }[]
      }
      insert_test_profile: {
        Args: {
          user_id: string
          user_full_name: string
          user_age: number
          user_location: string
          user_bio: string
          user_travel_style: string
          user_languages: string[]
          user_interests: string[]
          user_preferred_destinations: string[]
          user_gender: string
          user_preferred_gender: string[]
        }
        Returns: undefined
      }
      mark_messages_as_read: {
        Args: {
          p_message_ids: string[]
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      rating_category:
        | "punctuality"
        | "communication"
        | "respectfulness"
        | "responsibility"
        | "trustworthiness"
        | "conflict_management"
        | "preparedness"
        | "overall_safety"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
