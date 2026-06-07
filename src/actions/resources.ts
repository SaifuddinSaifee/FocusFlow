"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addProjectResource(
  projectId: string,
  title: string,
  url: string
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Get existing resource note
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: note } = await (supabase as any)
    .from("notes")
    .select("id, body")
    .eq("project_id", projectId)
    .eq("title", "PROJECT_RESOURCES")
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resources: any[] = [];
  if (note) {
    try {
      resources = JSON.parse(note.body) || [];
      if (!Array.isArray(resources)) resources = [];
    } catch {
      resources = [];
    }
  }

  // 2. Add the new resource if it doesn't already exist with same URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!resources.some((r: any) => r.url === url)) {
    resources.push({ title, url });
  }

  // 3. Save back to the hidden note
  if (note) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("notes")
      .update({ body: JSON.stringify(resources), updated_at: new Date().toISOString() })
      .eq("id", note.id);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("notes")
      .insert({
        user_id: user.id,
        project_id: projectId,
        title: "PROJECT_RESOURCES",
        body: JSON.stringify(resources),
      });
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteProjectResource(
  projectId: string,
  url: string
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: note } = await (supabase as any)
    .from("notes")
    .select("id, body")
    .eq("project_id", projectId)
    .eq("title", "PROJECT_RESOURCES")
    .maybeSingle();

  if (!note) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resources: any[] = [];
  try {
    resources = JSON.parse(note.body) || [];
    if (!Array.isArray(resources)) resources = [];
  } catch {
    resources = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources = resources.filter((r: any) => r.url !== url);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from("notes")
    .update({ body: JSON.stringify(resources), updated_at: new Date().toISOString() })
    .eq("id", note.id);

  revalidatePath(`/projects/${projectId}`);
}
