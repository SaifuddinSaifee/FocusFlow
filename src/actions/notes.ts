"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createNote(data: {
  title?: string;
  project_id?: string | null;
  task_id?: string | null;
  chapter_id?: string | null;
}): Promise<{ error: string | null; noteId?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: note, error } = await (supabase as any)
    .from("notes")
    .insert({
      user_id: user.id,
      title: data.title ?? "Untitled Note",
      body: "",
      project_id: data.project_id ?? null,
      task_id: data.task_id ?? null,
      chapter_id: data.chapter_id ?? null,
    })
    .select()
    .single();

  if (error) return { error: (error as { message: string }).message };

  revalidatePath("/notes");
  if (data.project_id) revalidatePath(`/projects/${data.project_id}`);

  return { error: null, noteId: note.id };
}

export async function createNoteAndRedirect(data: {
  title?: string;
  project_id?: string | null;
}) {
  const result = await createNote(data);
  if (!result.error && result.noteId) {
    redirect(`/notes/${result.noteId}`);
  }
  return result;
}

export async function updateNote(
  noteId: string,
  data: { title?: string; body?: string }
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("notes")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", noteId);
}

export async function deleteNote(
  noteId: string,
  projectId?: string | null
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("notes").delete().eq("id", noteId).eq("user_id", user.id);

  revalidatePath("/notes");
  if (projectId) revalidatePath(`/projects/${projectId}`);
}
