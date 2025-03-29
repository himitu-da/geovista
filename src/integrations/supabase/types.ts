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
      categories: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_time: string | null
          icon: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          icon?: string
          id?: number
          name: string
          slug?: string
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          icon?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      lesson_categories: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          lesson_id: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          lesson_id?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          lesson_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_categories_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string | null
          difficulty: number
          id: number
          is_recommended: boolean | null
          title: string
          translation: string
        }
        Insert: {
          content: string
          created_at?: string | null
          difficulty: number
          id?: number
          is_recommended?: boolean | null
          title: string
          translation: string
        }
        Update: {
          content?: string
          created_at?: string | null
          difficulty?: number
          id?: number
          is_recommended?: boolean | null
          title?: string
          translation?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          correct_answer: number
          created_at: string | null
          id: number
          lesson_id: number | null
          options: Json
          question: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          id?: number
          lesson_id?: number | null
          options: Json
          question: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          id?: number
          lesson_id?: number | null
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          id: number
          last_accessed: string | null
          lesson_id: number | null
          progress: number | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          id?: number
          last_accessed?: string | null
          lesson_id?: number | null
          progress?: number | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          id?: number
          last_accessed?: string | null
          lesson_id?: number | null
          progress?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          created_at: string | null
          example: string | null
          id: number
          lesson_id: number | null
          meaning: string
          word: string
        }
        Insert: {
          created_at?: string | null
          example?: string | null
          id?: number
          lesson_id?: number | null
          meaning: string
          word: string
        }
        Update: {
          created_at?: string | null
          example?: string | null
          id?: number
          lesson_id?: number | null
          meaning?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
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
