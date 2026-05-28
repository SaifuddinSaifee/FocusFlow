import type { TablesInsert, TablesUpdate } from "@/types/database.types";
import type { Project } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getProjects(supabase: DB, userId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

export async function getProject(supabase: DB, id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Project;
}

export async function getProjectsWithStats(supabase: DB, userId: string) {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", { ascending: true });
  if (error) throw error;
  if (!projects?.length) return [];

  const projectIds = (projects as Project[]).map((p) => p.id);

  const [{ data: taskCounts }, { data: sessionCounts }, { data: chapterCounts }] =
    await Promise.all([
      supabase.from("tasks").select("project_id, status").in("project_id", projectIds),
      supabase.from("focus_sessions").select("project_id").in("project_id", projectIds),
      supabase.from("chapters").select("project_id, is_watched").in("project_id", projectIds),
    ]);

  return (projects as Project[]).map((project) => {
    const tasks = (taskCounts ?? []).filter((t: { project_id: string; status: string }) => t.project_id === project.id);
    const sessions = (sessionCounts ?? []).filter((s: { project_id: string }) => s.project_id === project.id);
    const chapters = (chapterCounts ?? []).filter((c: { project_id: string; is_watched: boolean }) => c.project_id === project.id);
    return {
      ...project,
      task_count: tasks.length,
      done_task_count: tasks.filter((t: { status: string }) => t.status === "Done").length,
      session_count: sessions.length,
      watched_chapters: chapters.filter((c: { is_watched: boolean }) => c.is_watched).length,
    };
  });
}

export async function createProject(supabase: DB, data: TablesInsert<"projects">) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return project as Project;
}

export async function updateProject(supabase: DB, id: string, data: TablesUpdate<"projects">) {
  const { data: project, error } = await supabase
    .from("projects")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return project as Project;
}

export async function deleteProject(supabase: DB, id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function recalcProjectStatus(supabase: DB, projectId: string) {
  const { data: tasks } = await supabase
    .from("tasks")
    .select("status")
    .eq("project_id", projectId);
  if (!tasks?.length) return;

  const allDone = tasks.every((t: { status: string }) => t.status === "Done");
  const anyInProgress = tasks.some((t: { status: string }) => t.status === "InProgress");
  const anyDone = tasks.some((t: { status: string }) => t.status === "Done");

  let newStatus: Project["status"];
  if (allDone) {
    newStatus = "Done";
  } else if (anyInProgress || anyDone) {
    newStatus = "InProgress";
  } else {
    return;
  }

  await supabase.from("projects").update({ status: newStatus }).eq("id", projectId);
}
