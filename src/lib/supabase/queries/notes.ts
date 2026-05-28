import type { TablesInsert, TablesUpdate } from "@/types/database.types";
import type { Note } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getNotes(supabase: DB, userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNote(supabase: DB, id: string): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getNotesByProject(supabase: DB, projectId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNoteByTask(supabase: DB, taskId: string): Promise<Note | null> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("task_id", taskId)
    .single();
  return data ?? null;
}

export async function getNoteByChapter(supabase: DB, chapterId: string): Promise<Note | null> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("chapter_id", chapterId)
    .single();
  return data ?? null;
}

export async function searchNotes(supabase: DB, userId: string, query: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .textSearch("fts", query)
    .order("updated_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function createNote(supabase: DB, data: TablesInsert<"notes">): Promise<Note> {
  const { data: note, error } = await supabase
    .from("notes")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return note;
}

export async function updateNote(supabase: DB, id: string, data: TablesUpdate<"notes">): Promise<Note> {
  const { data: note, error } = await supabase
    .from("notes")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return note;
}

export async function deleteNote(supabase: DB, id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
