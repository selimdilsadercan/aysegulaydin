export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Settings = Database["public"]["Tables"]["setttings"]["Row"];
export type Nodes = Database["public"]["Tables"]["nodes"]["Row"];
export type Types = Database["public"]["Enums"]["type"];

export type Database = {
  public: {
    Tables: {
      nodes: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_video: boolean | null;
          name: string | null;
          type: Database["public"]["Enums"]["type"] | null;
          visible_date: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_video?: boolean | null;
          name?: string | null;
          type?: Database["public"]["Enums"]["type"] | null;
          visible_date?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_video?: boolean | null;
          name?: string | null;
          type?: Database["public"]["Enums"]["type"] | null;
          visible_date?: string | null;
        };
        Relationships: [];
      };
      nodes_extras: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_video: boolean | null;
          node_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_video?: boolean | null;
          node_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_video?: boolean | null;
          node_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "photos_extras_photo_id_fkey";
            columns: ["node_id"];
            isOneToOne: false;
            referencedRelation: "nodes";
            referencedColumns: ["id"];
          }
        ];
      };
      setttings: {
        Row: {
          contact_facebook: string | null;
          contact_instagram: string | null;
          contact_mail: string | null;
          id: number;
          statement_description: string | null;
          statement_image_url: string | null;
          statement_title: string | null;
        };
        Insert: {
          contact_facebook?: string | null;
          contact_instagram?: string | null;
          contact_mail?: string | null;
          id?: number;
          statement_description?: string | null;
          statement_image_url?: string | null;
          statement_title?: string | null;
        };
        Update: {
          contact_facebook?: string | null;
          contact_instagram?: string | null;
          contact_mail?: string | null;
          id?: number;
          statement_description?: string | null;
          statement_image_url?: string | null;
          statement_title?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      type: "recent" | "photo" | "video" | "installation" | "painting";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"] : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"] : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
