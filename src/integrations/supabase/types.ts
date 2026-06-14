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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_type: string
          channel: string
          check_in: string
          check_out: string
          created_at: string
          guest_id: string | null
          guest_name: string | null
          guests_count: number | null
          id: string
          notes: string | null
          property_id: string
          status: string
          total_price: number | null
        }
        Insert: {
          booking_type?: string
          channel?: string
          check_in: string
          check_out: string
          created_at?: string
          guest_id?: string | null
          guest_name?: string | null
          guests_count?: number | null
          id?: string
          notes?: string | null
          property_id: string
          status?: string
          total_price?: number | null
        }
        Update: {
          booking_type?: string
          channel?: string
          check_in?: string
          check_out?: string
          created_at?: string
          guest_id?: string | null
          guest_name?: string | null
          guests_count?: number | null
          id?: string
          notes?: string | null
          property_id?: string
          status?: string
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_sync: {
        Row: {
          channel: string
          created_at: string
          enabled: boolean
          error_message: string | null
          external_listing_id: string | null
          id: string
          last_synced_at: string | null
          property_id: string
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          enabled?: boolean
          error_message?: string | null
          external_listing_id?: string | null
          id?: string
          last_synced_at?: string | null
          property_id: string
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string
          enabled?: boolean
          error_message?: string | null
          external_listing_id?: string | null
          id?: string
          last_synced_at?: string | null
          property_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_sync_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_tasks: {
        Row: {
          booking_id: string | null
          cleaner_id: string | null
          cleaner_name: string | null
          cleaner_phone: string | null
          created_at: string
          id: string
          notes: string | null
          notified_at: string | null
          property_id: string
          scheduled_for: string
          status: string
        }
        Insert: {
          booking_id?: string | null
          cleaner_id?: string | null
          cleaner_name?: string | null
          cleaner_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          property_id: string
          scheduled_for: string
          status?: string
        }
        Update: {
          booking_id?: string | null
          cleaner_id?: string | null
          cleaner_name?: string | null
          cleaner_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          notified_at?: string | null
          property_id?: string
          scheduled_for?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_tasks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_tasks_cleaner_id_fkey"
            columns: ["cleaner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cleaning_tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          amenities: string[] | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          created_at: string
          description: string | null
          host_id: string | null
          id: string
          image_url: string | null
          listing_type: string
          price_per_month: number | null
          price_per_night: number | null
          title: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          host_id?: string | null
          id?: string
          image_url?: string | null
          listing_type?: string
          price_per_month?: number | null
          price_per_night?: number | null
          title: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          host_id?: string | null
          id?: string
          image_url?: string | null
          listing_type?: string
          price_per_month?: number | null
          price_per_night?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          budget: number
          city: string | null
          cleanliness: number
          created_at: string
          id: string
          income_source: string | null
          languages: string[] | null
          name: string | null
          parties: boolean
          pets: boolean
          quiet: boolean
          salary_bracket: string | null
          sleep: string
          smoking: boolean
          university: string | null
          user_id: string | null
          verified: boolean
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          budget?: number
          city?: string | null
          cleanliness?: number
          created_at?: string
          id?: string
          income_source?: string | null
          languages?: string[] | null
          name?: string | null
          parties?: boolean
          pets?: boolean
          quiet?: boolean
          salary_bracket?: string | null
          sleep?: string
          smoking?: boolean
          university?: string | null
          user_id?: string | null
          verified?: boolean
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          budget?: number
          city?: string | null
          cleanliness?: number
          created_at?: string
          id?: string
          income_source?: string | null
          languages?: string[] | null
          name?: string | null
          parties?: boolean
          pets?: boolean
          quiet?: boolean
          salary_bracket?: string | null
          sleep?: string
          smoking?: boolean
          university?: string | null
          user_id?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language: string
          phone: string | null
          plan: string
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          plan?: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          plan?: string
          role?: string
        }
        Relationships: []
      }
      agent_events: {
        Row: {
          created_at: string
          detail_en: string
          detail_ka: string
          id: string
          kind: string
          source: string
          title_en: string
          title_ka: string
        }
        Insert: {
          created_at?: string
          detail_en: string
          detail_ka: string
          id?: string
          kind: string
          source?: string
          title_en: string
          title_ka: string
        }
        Update: {
          created_at?: string
          detail_en?: string
          detail_ka?: string
          id?: string
          kind?: string
          source?: string
          title_en?: string
          title_ka?: string
        }
        Relationships: []
      }
      applicant_screenings: {
        Row: {
          created_at: string
          id: string
          risk_analysis: string | null
          score: number | null
          student_profile_id: string | null
          verdict: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          risk_analysis?: string | null
          score?: number | null
          student_profile_id?: string | null
          verdict?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          risk_analysis?: string | null
          score?: number | null
          student_profile_id?: string | null
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applicant_screenings_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_property_host: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
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
