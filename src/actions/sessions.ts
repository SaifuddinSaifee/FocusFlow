"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { calculateStreak } from "@/lib/streak/calculate";

export async function logFocusSession(data: {
  durationMinutes: number;
  projectId?: string | null;
  taskId?: string | null;
}): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("focus_sessions").insert({
    user_id: user.id,
    duration_minutes: data.durationMinutes,
    project_id: data.projectId ?? null,
    task_id: data.taskId ?? null,
  });

  // Update streak
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("current_streak, longest_streak, last_active_date")
    .eq("id", user.id)
    .single();

  if (profile) {
    const streakResult = calculateStreak(
      profile.last_active_date,
      profile.current_streak,
      profile.longest_streak
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("profiles").update({
      current_streak: streakResult.currentStreak,
      longest_streak: streakResult.longestStreak,
      last_active_date: streakResult.lastActiveDate,
    }).eq("id", user.id);
  }

  revalidatePath("/dashboard");
  if (data.projectId) revalidatePath(`/projects/${data.projectId}`);
}
