"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { parseYouTubeUrl } from "@/lib/youtube/parseUrl";
import { fetchPlaylist, fetchVideo } from "@/lib/youtube/api";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  deadline: z.string().min(1, "Deadline is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["ToDo", "InProgress", "Done"]).default("ToDo"),
  is_course: z.boolean().default(false),
  youtube_link: z.string().optional().nullable(),
});

export type ProjectFormState = { error: string | null; projectId?: string };

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    deadline: formData.get("deadline") as string,
    priority: formData.get("priority") as string,
    status: "ToDo" as const,
    is_course: formData.get("is_course") === "true",
    youtube_link: (formData.get("youtube_link") as string) || null,
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const data = parsed.data;
  let playlistId: string | null = null;
  let videoId: string | null = null;

  if (data.is_course && data.youtube_link) {
    try {
      new URL(data.youtube_link.trim());
    } catch {
      return { error: "Please enter a valid URL (e.g. https://www.udemy.com/... or a YouTube link)" };
    }
    const ytParsed = parseYouTubeUrl(data.youtube_link);
    if (ytParsed.type !== "invalid") {
      playlistId = ytParsed.playlistId ?? null;
      videoId = ytParsed.videoId ?? null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: project, error } = await (supabase as any)
    .from("projects")
    .insert({
      user_id: user.id,
      name: data.name,
      description: data.description,
      deadline: data.deadline,
      priority: data.priority,
      status: data.status,
      is_course: data.is_course,
      youtube_link: data.youtube_link,
      playlist_id: playlistId,
      video_id: videoId,
    })
    .select()
    .single();

  if (error) return { error: (error as { message: string }).message };

  if (data.is_course && (playlistId || videoId)) {
    try {
      if (playlistId) {
        const ytData = await fetchPlaylist(playlistId);
        if (ytData.videos.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("chapters").insert(
            ytData.videos.map((v) => ({
              project_id: project.id,
              youtube_video_id: v.videoId,
              title: v.title,
              thumbnail: v.thumbnail,
              duration_seconds: v.durationSeconds,
              position: v.position,
            }))
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("projects").update({
            total_chapters: ytData.videos.length,
            thumbnail_url: ytData.thumbnail,
          }).eq("id", project.id);
        }
      } else if (videoId) {
        const ytData = await fetchVideo(videoId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("chapters").insert({
          project_id: project.id,
          youtube_video_id: videoId,
          title: ytData.title,
          thumbnail: ytData.thumbnail,
          duration_seconds: ytData.durationSeconds,
          position: 0,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("projects").update({
          total_chapters: 1,
          thumbnail_url: ytData.thumbnail,
        }).eq("id", project.id);
      }
    } catch {
      // Non-fatal: chapter import failure
    }
  }

  revalidatePath("/projects");
  return { error: null, projectId: project.id };
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    deadline: formData.get("deadline") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    is_course: formData.get("is_course") === "true",
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("projects")
    .update({
      name: parsed.data.name,
      description: parsed.data.description,
      deadline: parsed.data.deadline,
      priority: parsed.data.priority,
      status: parsed.data.status,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: (error as { message: string }).message };

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { error: null };
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("projects").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
}

export async function updateProjectStatus(
  id: string,
  status: "ToDo" | "InProgress" | "Done"
): Promise<void> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("projects").update({ status }).eq("id", id);
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
}
