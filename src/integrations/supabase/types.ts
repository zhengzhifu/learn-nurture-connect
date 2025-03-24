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
      bookings: {
        Row: {
          booked_time: Json | null
          calendar_event_id: string | null
          created_at: string
          id: string
          parent_id: string | null
          request_id: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          tutor_id: string | null
          updated_at: string
        }
        Insert: {
          booked_time?: Json | null
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          request_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          tutor_id?: string | null
          updated_at?: string
        }
        Update: {
          booked_time?: Json | null
          calendar_event_id?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          request_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          tutor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "parent_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "tutor_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          parent_id: string | null
          signed_by_parent: boolean | null
          signed_by_tutor: boolean | null
          terms: string
          tutor_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          signed_by_parent?: boolean | null
          signed_by_tutor?: boolean | null
          terms: string
          tutor_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          signed_by_parent?: boolean | null
          signed_by_tutor?: boolean | null
          terms?: string
          tutor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_requests: {
        Row: {
          created_at: string
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          parent_id: string | null
          requested_time: Json | null
          service_type: Database["public"]["Enums"]["service_type"]
          tutoring_subjects: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          parent_id?: string | null
          requested_time?: Json | null
          service_type: Database["public"]["Enums"]["service_type"]
          tutoring_subjects?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          parent_id?: string | null
          requested_time?: Json | null
          service_type?: Database["public"]["Enums"]["service_type"]
          tutoring_subjects?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_requests_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approval_status: string
          avatar_url: string | null
          child_school_id: string | null
          created_at: string
          email: string
          full_name: string
          home_address: string | null
          id: string
          other_school_name: string | null
          phone: string | null
          school_id: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          verified: boolean | null
        }
        Insert: {
          approval_status?: string
          avatar_url?: string | null
          child_school_id?: string | null
          created_at?: string
          email: string
          full_name: string
          home_address?: string | null
          id: string
          other_school_name?: string | null
          phone?: string | null
          school_id?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verified?: boolean | null
        }
        Update: {
          approval_status?: string
          avatar_url?: string | null
          child_school_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          home_address?: string | null
          id?: string
          other_school_name?: string | null
          phone?: string | null
          school_id?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_child_school_id_fkey"
            columns: ["child_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["school_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
        }
        Relationships: []
      }
      tutor_services: {
        Row: {
          availability: Json | null
          created_at: string
          hourly_rate: number | null
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          tutor_id: string | null
          tutoring_subjects: string[] | null
          updated_at: string
        }
        Insert: {
          availability?: Json | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          tutor_id?: string | null
          tutoring_subjects?: string[] | null
          updated_at?: string
        }
        Update: {
          availability?: Json | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          tutor_id?: string | null
          tutoring_subjects?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_services_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_availability: {
        Row: {
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_specialties: {
        Row: {
          created_at: string
          id: string
          specialty_name: string
          specialty_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          specialty_name: string
          specialty_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          specialty_name?: string
          specialty_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_auth_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
          approval_status: string
          avatar_url: string | null
          child_school_id: string | null
          created_at: string
          email: string
          full_name: string
          home_address: string | null
          id: string
          other_school_name: string | null
          phone: string | null
          school_id: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          verified: boolean | null
        }[]
      }
      get_user_role: {
        Args: {
          _user_id: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "parent" | "tutor" | "admin"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      notification_type:
        | "booking_request"
        | "booking_confirmation"
        | "reminder"
        | "review_prompt"
      school_status: "pending" | "approved" | "rejected"
      service_type:
        | "babysitting"
        | "tutoring_paid"
        | "tutoring_voluntary"
        | "both"
      user_type: "parent" | "tutor" | "admin"
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
