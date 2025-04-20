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
      adoption: {
        Row: {
          adoption_status: Database["public"]["Enums"]["adoption_status"]
          created_at: string | null
          id: string
          image_url: string
          pet_age: number
          pet_age_unit: Database["public"]["Enums"]["pet_age-Unit"] | null
          pet_description: string
          pet_name: string
          pet_type: string
          user_id: string
        }
        Insert: {
          adoption_status?: Database["public"]["Enums"]["adoption_status"]
          created_at?: string | null
          id?: string
          image_url: string
          pet_age: number
          pet_age_unit?: Database["public"]["Enums"]["pet_age-Unit"] | null
          pet_description: string
          pet_name: string
          pet_type: string
          user_id: string
        }
        Update: {
          adoption_status?: Database["public"]["Enums"]["adoption_status"]
          created_at?: string | null
          id?: string
          image_url?: string
          pet_age?: number
          pet_age_unit?: Database["public"]["Enums"]["pet_age-Unit"] | null
          pet_description?: string
          pet_name?: string
          pet_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          donor_id: string
          id: string
          post_id: string
          recipient_id: string
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          donor_id: string
          id?: string
          post_id: string
          recipient_id: string
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          donor_id?: string
          id?: string
          post_id?: string
          recipient_id?: string
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          created_at: string
          description: string
          email: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          opening_hours: string | null
          phone: string | null
          services: string[]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          opening_hours?: string | null
          phone?: string | null
          services: string[]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: string | null
          phone?: string | null
          services?: string[]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace: {
        Row: {
          average_rating: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"]
          id: string
          image_url: string
          item_description: string
          item_name: string
          item_price: number
          item_quantity: number
          item_type: string
          reviews_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"]
          id?: string
          image_url: string
          item_description: string
          item_name: string
          item_price: number
          item_quantity: number
          item_type: string
          reviews_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"]
          id?: string
          image_url?: string
          item_description?: string
          item_name?: string
          item_price?: number
          item_quantity?: number
          item_type?: string
          reviews_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
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
      notifications: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          read: boolean
          recipient_id: string
          sender_id: string
          sender_name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          read?: boolean
          recipient_id: string
          sender_id: string
          sender_name: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          read?: boolean
          recipient_id?: string
          sender_id?: string
          sender_name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          id: string
          item_id: string
          order_date: string
          quantity: number
          total_price: number
          user_id: string
          vendor_id: string
        }
        Insert: {
          id?: string
          item_id: string
          order_date?: string
          quantity?: number
          total_price: number
          user_id: string
          vendor_id: string
        }
        Update: {
          id?: string
          item_id?: string
          order_date?: string
          quantity?: number
          total_price?: number
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          type: Database["public"]["Enums"]["post_type"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          type?: Database["public"]["Enums"]["post_type"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          type?: Database["public"]["Enums"]["post_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          instagram: string | null
          role: Database["public"]["Enums"]["user_role"]
          twitter: string | null
          user_name: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          instagram?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          twitter?: string | null
          user_name?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          instagram?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          twitter?: string | null
          user_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          id: string
          item_id: string
          order_id: string | null
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          item_id: string
          order_id?: string | null
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          item_id?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
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
      calculate_item_average_rating: {
        Args: { item_id_param: string }
        Returns: number
      }
      decrement_quantity: {
        Args: { product_id: string; decrement_value: number }
        Returns: undefined
      }
      generate_order_summary: {
        Args: { order_id_param: string }
        Returns: Json
      }
      get_item_rating_distribution: {
        Args: { item_id_param: string }
        Returns: {
          rating_value: number
          count: number
          percentage: number
        }[]
      }
      get_item_reviews_count: {
        Args: { item_id_param: string }
        Returns: number
      }
      get_monthly_orders_growth: {
        Args: { vendor_id?: string }
        Returns: {
          month: string
          total_orders: number
          previous_total: number
          growth_rate: number
          growth_status: string
        }[]
      }
      get_popular_items: {
        Args: { limit_param?: number }
        Returns: {
          item_id: string
          item_name: string
          item_price: number
          image_url: string
          average_rating: number
          reviews_count: number
          orders_count: number
          popularity_score: number
        }[]
      }
      get_related_items: {
        Args: { item_id_param: string; limit_param?: number }
        Returns: {
          item_id: string
          item_name: string
          item_price: number
          image_url: string
          relevance_score: number
        }[]
      }
      get_seller_statistics: {
        Args: { seller_id_param: string }
        Returns: {
          total_sales: number
          total_orders: number
          average_order_value: number
          total_items_sold: number
          average_rating: number
        }[]
      }
      get_unread_count: {
        Args: { group_id: string; user_id: string }
        Returns: number
      }
      get_user_order_history: {
        Args: { user_id_param: string }
        Returns: {
          order_id: string
          order_status: string
          order_date: string
          total_amount: number
          item_count: number
          items: Json
        }[]
      }
      has_user_purchased_item: {
        Args: { user_id_param: string; item_id_param: string }
        Returns: boolean
      }
      increment: {
        Args: { x: number }
        Returns: number
      }
      search_items: {
        Args: { search_query: string; limit_param?: number }
        Returns: {
          item_id: string
          item_name: string
          item_type: string
          item_price: number
          item_description: string
          image_url: string
          relevance: number
        }[]
      }
      update_review_feedback_counts: {
        Args: {
          review_id_param: string
          old_is_helpful: boolean
          new_is_helpful: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      adoption_status: "ADOPTED" | "AVAILABLE"
      currency: "USD" | "NPR" | "EUR" | "JPY" | "GBP"
      "pet_age-Unit": "months" | "years" | "month" | "year"
      post_type: "NORMAL" | "HELP" | "ADOPTION"
      user_role: "BASIC" | "PREMIUM" | "ORGANIZATION"
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
    Enums: {
      adoption_status: ["ADOPTED", "AVAILABLE"],
      currency: ["USD", "NPR", "EUR", "JPY", "GBP"],
      "pet_age-Unit": ["months", "years", "month", "year"],
      post_type: ["NORMAL", "HELP", "ADOPTION"],
      user_role: ["BASIC", "PREMIUM", "ORGANIZATION"],
    },
  },
} as const
