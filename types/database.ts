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
      nodes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
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
        Args: {
          type_string: string
          index1: number
          direction: string
        }
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
