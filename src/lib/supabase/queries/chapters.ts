import type { TablesInsert } from "@/types/database.types";
import type { Chapter } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getChaptersByProject(supabase: DB, projectId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function insertChapters(supabase: DB, chapters: TablesInsert<"chapters">[]): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .insert(chapters)
    .select();
  if (error) throw error;
  return data ?? [];
}

export async function markChapterWatched(supabase: DB, chapterId: string): Promise<Chapter> {
  const { data, error } = await supabase
    .from("chapters")
    .update({ is_watched: true, watched_at: new Date().toISOString() })
    .eq("id", chapterId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getWatchedCount(supabase: DB, projectId: string) {
  const { data, error } = await supabase
    .from("chapters")
    .select("is_watched")
    .eq("project_id", projectId);
  if (error) throw error;
  const chapters = (data ?? []) as { is_watched: boolean }[];
  return {
    total: chapters.length,
    watched: chapters.filter((c) => c.is_watched).length,
  };
}
