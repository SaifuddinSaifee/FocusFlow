import type { Profile } from "@/types/app.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export async function getProfile(supabase: DB, userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: DB,
  userId: string,
  data: { display_name?: string; avatar_url?: string }
) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return profile as Profile;
}

export async function updateStreak(
  supabase: DB,
  userId: string,
  data: {
    current_streak: number;
    longest_streak: number;
    last_active_date: string;
  }
) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userId);
  if (error) throw error;
}
