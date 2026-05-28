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
