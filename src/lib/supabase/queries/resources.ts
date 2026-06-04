// Query to retrieve resources stored in the special hidden notes table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export interface ProjectResource {
  title: string;
  url: string;
}

export async function getProjectResources(
  supabase: DB,
  projectId: string
): Promise<ProjectResource[]> {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("body")
      .eq("project_id", projectId)
      .eq("title", "PROJECT_RESOURCES")
      .maybeSingle();

    if (error || !data) return [];
    
    const parsed = JSON.parse(data.body);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
