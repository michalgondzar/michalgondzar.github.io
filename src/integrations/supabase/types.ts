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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      apartment_content: {
        Row: {
          created_at: string | null
          features: Json
          features_pl: Json | null
          features_sk: Json | null
          id: number
          images: Json
          paragraph1: string
          paragraph1_pl: string | null
          paragraph1_sk: string | null
          paragraph2: string
          paragraph2_pl: string | null
          paragraph2_sk: string | null
          subtitle: string
          subtitle_pl: string | null
          subtitle_sk: string | null
          title: string
          title_pl: string | null
          title_sk: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          features_pl?: Json | null
          features_sk?: Json | null
          id?: number
          images?: Json
          paragraph1: string
          paragraph1_pl?: string | null
          paragraph1_sk?: string | null
          paragraph2: string
          paragraph2_pl?: string | null
          paragraph2_sk?: string | null
          subtitle: string
          subtitle_pl?: string | null
          subtitle_sk?: string | null
          title: string
          title_pl?: string | null
          title_sk?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          features_pl?: Json | null
          features_sk?: Json | null
          id?: number
          images?: Json
          paragraph1?: string
          paragraph1_pl?: string | null
          paragraph1_sk?: string | null
          paragraph2?: string
          paragraph2_pl?: string | null
          paragraph2_sk?: string | null
          subtitle?: string
          subtitle_pl?: string | null
          subtitle_sk?: string | null
          title?: string
          title_pl?: string | null
          title_sk?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      availability_calendar: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          coupon: string | null
          created_at: string
          date_from: string
          date_to: string
          email: string
          guests: number
          id: string
          name: string
          status: string
          stay_type: string | null
          updated_at: string
        }
        Insert: {
          coupon?: string | null
          created_at?: string
          date_from: string
          date_to: string
          email: string
          guests?: number
          id?: string
          name: string
          status?: string
          stay_type?: string | null
          updated_at?: string
        }
        Update: {
          coupon?: string | null
          created_at?: string
          date_from?: string
          date_to?: string
          email?: string
          guests?: number
          id?: string
          name?: string
          status?: string
          stay_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string
          checkin_time: string
          checkout_time: string
          created_at: string | null
          email: string
          id: number
          phone: string
          postal_code: string
          updated_at: string | null
        }
        Insert: {
          address: string
          checkin_time: string
          checkout_time: string
          created_at?: string | null
          email: string
          id?: number
          phone: string
          postal_code: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          checkin_time?: string
          checkout_time?: string
          created_at?: string | null
          email?: string
          id?: number
          phone?: string
          postal_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          min_stay_nights: number | null
          name: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          valid_from: string
          valid_to: string
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          min_stay_nights?: number | null
          name: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from: string
          valid_to: string
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          min_stay_nights?: number | null
          name?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string
          valid_to?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          booking_id: string | null
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          status: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          status?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          created_at: string | null
          id: number
          images: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          images?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          images?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      marital_stays_content: {
        Row: {
          created_at: string | null
          description: string
          external_link: string
          id: number
          images: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          external_link: string
          id?: number
          images?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          external_link?: string
          id?: number
          images?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          country: string | null
          id: string
          is_admin: boolean | null
          page_url: string
          referrer: string | null
          user_agent: string | null
          visited_at: string
          visitor_ip: string | null
        }
        Insert: {
          country?: string | null
          id?: string
          is_admin?: boolean | null
          page_url: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Update: {
          country?: string | null
          id?: string
          is_admin?: boolean | null
          page_url?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Relationships: []
      }
      pricing: {
        Row: {
          cleaning_fee: string
          created_at: string
          high_season_weekday: string
          high_season_weekend: string
          id: number
          low_season_weekday: string
          low_season_weekend: string
          tourist_tax: string
          updated_at: string
        }
        Insert: {
          cleaning_fee?: string
          created_at?: string
          high_season_weekday?: string
          high_season_weekend?: string
          id?: number
          low_season_weekday?: string
          low_season_weekend?: string
          tourist_tax?: string
          updated_at?: string
        }
        Update: {
          cleaning_fee?: string
          created_at?: string
          high_season_weekday?: string
          high_season_weekend?: string
          id?: number
          low_season_weekday?: string
          low_season_weekend?: string
          tourist_tax?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          canonical_url: string
          created_at: string | null
          id: number
          meta_description: string
          meta_keywords: string
          og_description: string
          og_image: string
          og_title: string
          page_title: string
          structured_data: string
          twitter_description: string
          twitter_title: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string
          created_at?: string | null
          id?: number
          meta_description?: string
          meta_keywords?: string
          og_description?: string
          og_image?: string
          og_title?: string
          page_title?: string
          structured_data?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string
          created_at?: string | null
          id?: number
          meta_description?: string
          meta_keywords?: string
          og_description?: string
          og_image?: string
          og_title?: string
          page_title?: string
          structured_data?: string
          twitter_description?: string
          twitter_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      thematic_stays: {
        Row: {
          created_at: string
          description: string
          features: Json
          icon: string
          id: string
          image: string
          stay_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: Json
          icon: string
          id?: string
          image: string
          stay_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: Json
          icon?: string
          id?: string
          image?: string
          stay_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      visit_counters: {
        Row: {
          id: number
          total_visits: number
          updated_at: string
        }
        Insert: {
          id?: number
          total_visits?: number
          updated_at?: string
        }
        Update: {
          id?: number
          total_visits?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_visit_counter: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
