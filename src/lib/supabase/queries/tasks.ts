import type { TablesInsert, TablesUpdate } from "@/types/database.types";
import type { Task } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getTasksByProject(supabase: DB, projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getStandaloneTasks(supabase: DB, userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .is("project_id", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTodayTasks(supabase: DB, userId: string): Promise<Task[]> {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .lte("deadline", today)
    .neq("status", "Done")
    .order("deadline", { ascending: true })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

export async function createTask(supabase: DB, data: TablesInsert<"tasks">): Promise<Task> {
  const { data: task, error } = await supabase
    .from("tasks")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return task;
}

export async function updateTask(supabase: DB, id: string, data: TablesUpdate<"tasks">): Promise<Task> {
  const { data: task, error } = await supabase
    .from("tasks")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return task;
}

export async function deleteTask(supabase: DB, id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function getPrioritySummary(supabase: DB, userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("priority")
    .eq("user_id", userId)
    .neq("status", "Done");
  if (error) throw error;
  const tasks = (data ?? []) as { priority: string }[];
  return {
    high: tasks.filter((t) => t.priority === "High").length,
    medium: tasks.filter((t) => t.priority === "Medium").length,
    low: tasks.filter((t) => t.priority === "Low").length,
  };
}
