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
      nodes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          image_url_new: string | null
          index: number | null
          is_recent: boolean | null
          is_video: boolean | null
          name: string | null
          recent_work_date: string | null
          technical: string | null
          type: Database["public"]["Enums"]["type"] | null
          visible_date: string | null
          youtube_link: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_url_new?: string | null
          index?: number | null
          is_recent?: boolean | null
          is_video?: boolean | null
          name?: string | null
          recent_work_date?: string | null
          technical?: string | null
          type?: Database["public"]["Enums"]["type"] | null
          visible_date?: string | null
          youtube_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_url_new?: string | null
          index?: number | null
          is_recent?: boolean | null
          is_video?: boolean | null
          name?: string | null
          recent_work_date?: string | null
          technical?: string | null
          type?: Database["public"]["Enums"]["type"] | null
          visible_date?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      nodes_extras: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          index: number | null
          is_video: boolean | null
          node_id: string | null
          technical: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          index?: number | null
          is_video?: boolean | null
          node_id?: string | null
          technical?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          index?: number | null
          is_video?: boolean | null
          node_id?: string | null
          technical?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_extras_photo_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_extras_photo_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "view_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      setttings: {
        Row: {
          contact_facebook: string | null
          contact_instagram: string | null
          contact_mail: string | null
          id: number
          main_page_image_url: string | null
          signature: string | null
          statement_description: string | null
          statement_image_url: string | null
          statement_title: string | null
        }
        Insert: {
          contact_facebook?: string | null
          contact_instagram?: string | null
          contact_mail?: string | null
          id?: number
          main_page_image_url?: string | null
          signature?: string | null
          statement_description?: string | null
          statement_image_url?: string | null
          statement_title?: string | null
        }
        Update: {
          contact_facebook?: string | null
          contact_instagram?: string | null
          contact_mail?: string | null
          id?: number
          main_page_image_url?: string | null
          signature?: string | null
          statement_description?: string | null
          statement_image_url?: string | null
          statement_title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      view_nodes: {
        Row: {
          created_at: string | null
          description: string | null
          extras: Json | null
          id: string | null
          image_url: string | null
          is_video: boolean | null
          name: string | null
          type: Database["public"]["Enums"]["type"] | null
          visible_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      swap_node_extra_items: {
        Args: {
          current_index: number
          direction: string
          input_node_id: string
        }
        Returns: undefined
      }
      swap_node_items: {
        Args: { direction: string; index1: number; type_string: string }
        Returns: undefined
      }
    }
    Enums: {
      type:
        | "recent"
        | "photo"
        | "video"
        | "audio"
        | "performance"
        | "installation"
        | "oil"
        | "drawing"
        | "abstract"
        | "digital"
        | "sculpture"
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
    Enums: {
      type: [
        "recent",
        "photo",
        "video",
        "audio",
        "performance",
        "installation",
        "oil",
        "drawing",
        "abstract",
        "digital",
        "sculpture",
      ],
    },
  },
} as const
