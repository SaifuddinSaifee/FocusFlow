import type { TablesInsert } from "@/types/database.types";
import type { FocusSession, ActivityDay } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getSessionsByProject(supabase: DB, projectId: string): Promise<FocusSession[]> {
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("project_id", projectId)
    .order("completed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSession(supabase: DB, data: TablesInsert<"focus_sessions">): Promise<FocusSession> {
  const { data: session, error } = await supabase
    .from("focus_sessions")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return session;
}

export async function getActivityGraph(supabase: DB, userId: string, days: number): Promise<ActivityDay[]> {
  const { data, error } = await supabase.rpc("get_activity_graph", {
    p_user_id: userId,
    p_days: days,
  });
  if (error) throw error;
  return data ?? [];
}

export async function getSessionCountByProject(supabase: DB, projectId: string): Promise<number> {
  const { count, error } = await supabase
    .from("focus_sessions")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);
  if (error) throw error;
  return count ?? 0;
}
