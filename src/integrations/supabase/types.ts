export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      onboarding_data: {
        Row: {
          active_backlogs: string | null
          aptitude_comfort: number | null
          certification_files: string[] | null
          certification_status: string | null
          cgpa_range: string | null
          created_at: string
          degree_branch: string | null
          education_stream: string | null
          govt_internship_interest: string | null
          has_hackathon_experience: boolean | null
          has_opensource_experience: boolean | null
          has_previous_internships: boolean | null
          id: string
          internship_details: Json | null
          internship_type_preference: string | null
          interview_comfort: number | null
          learning_style: string | null
          preferred_duration: string | null
          primary_goal: string | null
          primary_technical_strength: string | null
          project_experience_level: string | null
          relocation_readiness: string | null
          secondary_skills: string[] | null
          target_companies: string[] | null
          target_industries: string[] | null
          university_name: string | null
          updated_at: string
          user_id: string
          wants_peer_comparison: boolean | null
          wants_senior_guidance: boolean | null
          weekly_commitment_hours: number | null
          year_of_study: string | null
        }
        Insert: {
          active_backlogs?: string | null
          aptitude_comfort?: number | null
          certification_files?: string[] | null
          certification_status?: string | null
          cgpa_range?: string | null
          created_at?: string
          degree_branch?: string | null
          education_stream?: string | null
          govt_internship_interest?: string | null
          has_hackathon_experience?: boolean | null
          has_opensource_experience?: boolean | null
          has_previous_internships?: boolean | null
          id?: string
          internship_details?: Json | null
          internship_type_preference?: string | null
          interview_comfort?: number | null
          learning_style?: string | null
          preferred_duration?: string | null
          primary_goal?: string | null
          primary_technical_strength?: string | null
          project_experience_level?: string | null
          relocation_readiness?: string | null
          secondary_skills?: string[] | null
          target_companies?: string[] | null
          target_industries?: string[] | null
          university_name?: string | null
          updated_at?: string
          user_id: string
          wants_peer_comparison?: boolean | null
          wants_senior_guidance?: boolean | null
          weekly_commitment_hours?: number | null
          year_of_study?: string | null
        }
        Update: {
          active_backlogs?: string | null
          aptitude_comfort?: number | null
          certification_files?: string[] | null
          certification_status?: string | null
          cgpa_range?: string | null
          created_at?: string
          degree_branch?: string | null
          education_stream?: string | null
          govt_internship_interest?: string | null
          has_hackathon_experience?: boolean | null
          has_opensource_experience?: boolean | null
          has_previous_internships?: boolean | null
          id?: string
          internship_details?: Json | null
          internship_type_preference?: string | null
          interview_comfort?: number | null
          learning_style?: string | null
          preferred_duration?: string | null
          primary_goal?: string | null
          primary_technical_strength?: string | null
          project_experience_level?: string | null
          relocation_readiness?: string | null
          secondary_skills?: string[] | null
          target_companies?: string[] | null
          target_industries?: string[] | null
          university_name?: string | null
          updated_at?: string
          user_id?: string
          wants_peer_comparison?: boolean | null
          wants_senior_guidance?: boolean | null
          weekly_commitment_hours?: number | null
          year_of_study?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
