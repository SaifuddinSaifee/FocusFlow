"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { recalcProjectStatus } from "@/lib/supabase/queries/projects";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  deadline: z.string().optional().nullable(),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["ToDo", "InProgress", "Done"]).default("ToDo"),
  project_id: z.string().uuid().optional().nullable(),
  chapter_id: z.string().uuid().optional().nullable(),
});

export type TaskFormState = { error: string | null; taskId?: string };

export async function createTask(
  _prev: TaskFormState,
  formData: FormData
): Promise<TaskFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title") as string,
    deadline: (formData.get("deadline") as string) || null,
    priority: formData.get("priority") as string,
    status: (formData.get("status") as string) || "ToDo",
    project_id: (formData.get("project_id") as string) || null,
    chapter_id: (formData.get("chapter_id") as string) || null,
  };

  const parsed = taskSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: task, error } = await (supabase as any)
    .from("tasks")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) return { error: (error as { message: string }).message };

  revalidatePath("/tasks");
  if (parsed.data.project_id) {
    revalidatePath(`/projects/${parsed.data.project_id}`);
    revalidatePath("/projects");
  }
  revalidatePath("/dashboard");

  return { error: null, taskId: task.id };
}

export async function updateTaskStatus(
  taskId: string,
  status: "ToDo" | "InProgress" | "Done",
  projectId?: string | null
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("tasks").update({ status }).eq("id", taskId);

  if (projectId) {
    await recalcProjectStatus(supabase, projectId);
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    deadline?: string | null;
    priority?: "High" | "Medium" | "Low";
    status?: "ToDo" | "InProgress" | "Done";
  },
  projectId?: string | null
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("tasks").update(data).eq("id", taskId);

  if (projectId && data.status) {
    await recalcProjectStatus(supabase, projectId);
    revalidatePath(`/projects/${projectId}`);
  }

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(
  taskId: string,
  projectId?: string | null
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("tasks").delete().eq("id", taskId).eq("user_id", user.id);

  revalidatePath("/tasks");
  if (projectId) revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}
