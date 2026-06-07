"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markChapterWatched(
  chapterId: string,
  projectId: string
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("chapters")
    .update({ is_watched: true, watched_at: new Date().toISOString() })
    .eq("id", chapterId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function toggleChapterWatched(
  chapterId: string,
  isWatched: boolean,
  projectId: string
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("chapters")
    .update({
      is_watched: isWatched,
      watched_at: isWatched ? new Date().toISOString() : null,
    })
    .eq("id", chapterId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function createChapter(
  projectId: string,
  title: string,
  durationMinutes?: number
): Promise<void> {
  const supabase = await createClient();

  // Get current chapters count to set position
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: chapters } = await (supabase as any)
    .from("chapters")
    .select("position")
    .eq("project_id", projectId);

  const position = chapters ? chapters.length : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("chapters")
    .insert({
      project_id: projectId,
      youtube_video_id: "external",
      title,
      duration_seconds: durationMinutes ? durationMinutes * 60 : null,
      position,
      is_watched: false
    });

  // Also update total_chapters in projects table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("projects")
    .update({
      total_chapters: position + 1,
    })
    .eq("id", projectId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function deleteChapter(
  chapterId: string,
  projectId: string
): Promise<void> {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("chapters")
    .delete()
    .eq("id", chapterId);

  // Get new count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: chapters } = await (supabase as any)
    .from("chapters")
    .select("id")
    .eq("project_id", projectId);

  const total = chapters ? chapters.length : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("projects")
    .update({
      total_chapters: total,
    })
    .eq("id", projectId);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

