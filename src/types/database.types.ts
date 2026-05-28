// Hand-written types matching the Supabase schema.
// Regenerate with: npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          deadline: string;
          priority: "High" | "Medium" | "Low";
          status: "ToDo" | "InProgress" | "Done";
          is_course: boolean;
          youtube_link: string | null;
          playlist_id: string | null;
          video_id: string | null;
          thumbnail_url: string | null;
          total_chapters: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          deadline: string;
          priority?: "High" | "Medium" | "Low";
          status?: "ToDo" | "InProgress" | "Done";
          is_course?: boolean;
          youtube_link?: string | null;
          playlist_id?: string | null;
          video_id?: string | null;
          thumbnail_url?: string | null;
          total_chapters?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          deadline?: string;
          priority?: "High" | "Medium" | "Low";
          status?: "ToDo" | "InProgress" | "Done";
          is_course?: boolean;
          youtube_link?: string | null;
          playlist_id?: string | null;
          video_id?: string | null;
          thumbnail_url?: string | null;
          total_chapters?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      chapters: {
        Row: {
          id: string;
          project_id: string;
          youtube_video_id: string;
          title: string;
          thumbnail: string | null;
          duration_seconds: number | null;
          position: number;
          is_watched: boolean;
          watched_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          youtube_video_id: string;
          title: string;
          thumbnail?: string | null;
          duration_seconds?: number | null;
          position?: number;
          is_watched?: boolean;
          watched_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          thumbnail?: string | null;
          duration_seconds?: number | null;
          position?: number;
          is_watched?: boolean;
          watched_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          chapter_id: string | null;
          title: string;
          deadline: string | null;
          priority: "High" | "Medium" | "Low";
          status: "ToDo" | "InProgress" | "Done";
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          chapter_id?: string | null;
          title: string;
          deadline?: string | null;
          priority?: "High" | "Medium" | "Low";
          status?: "ToDo" | "InProgress" | "Done";
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          deadline?: string | null;
          priority?: "High" | "Medium" | "Low";
          status?: "ToDo" | "InProgress" | "Done";
          position?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          project_id: string | null;
          task_id: string | null;
          chapter_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          body?: string;
          project_id?: string | null;
          task_id?: string | null;
          chapter_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          project_id?: string | null;
          task_id?: string | null;
          chapter_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          task_id: string | null;
          duration_minutes: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          task_id?: string | null;
          duration_minutes: number;
          completed_at?: string;
        };
        Update: {
          project_id?: string | null;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "focus_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_activity_graph: {
        Args: { p_user_id: string; p_days: number };
        Returns: { day: string; tasks_completed: number; focus_minutes: number }[];
      };
    };
    Enums: {
      priority_level: "High" | "Medium" | "Low";
      project_status: "ToDo" | "InProgress" | "Done";
      task_status: "ToDo" | "InProgress" | "Done";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
