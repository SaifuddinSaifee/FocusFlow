"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  userId: string,
  data: { display_name?: string; avatar_url?: string }
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) return { error: "Not authorized" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update(data)
    .eq("id", userId);

  if (error) return { error: (error as { message: string }).message };

  revalidatePath("/settings/profile");
  revalidatePath("/dashboard");
  return { error: null };
}
