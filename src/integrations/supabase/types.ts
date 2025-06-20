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
      apartment_content: {
        Row: {
          created_at: string | null
          features: Json
          id: number
          images: Json
          paragraph1: string
          paragraph2: string
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          id?: number
          images?: Json
          paragraph1: string
          paragraph2: string
          subtitle: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          id?: number
          images?: Json
          paragraph1?: string
          paragraph2?: string
          subtitle?: string
          title?: string
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
          page_url: string
          referrer: string | null
          user_agent: string | null
          visited_at: string
          visitor_ip: string | null
        }
        Insert: {
          country?: string | null
          id?: string
          page_url: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
          visitor_ip?: string | null
        }
        Update: {
          country?: string | null
          id?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
