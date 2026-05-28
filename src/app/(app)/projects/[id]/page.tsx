import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProject } from "@/lib/supabase/queries/projects";
import { getTasksByProject } from "@/lib/supabase/queries/tasks";
import { getChaptersByProject } from "@/lib/supabase/queries/chapters";
import { getNotesByProject } from "@/lib/supabase/queries/notes";
import { getSessionsByProject } from "@/lib/supabase/queries/sessions";
import { ProjectDetailTabs } from "@/components/projects/ProjectDetailTabs";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const project = await getProject(supabase, id).catch(() => null);
  return { title: project ? `${project.name} — FocusFlow` : "Project — FocusFlow" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const project = await getProject(supabase, id).catch(() => null);
  if (!project) notFound();

  const [tasks, chapters, notes, sessions] = await Promise.all([
    getTasksByProject(supabase, id).catch(() => []),
    project.is_course ? getChaptersByProject(supabase, id).catch(() => []) : Promise.resolve([]),
    getNotesByProject(supabase, id).catch(() => []),
    getSessionsByProject(supabase, id).catch(() => []),
  ]);

  return (
    <ProjectDetailTabs
      project={project}
      tasks={tasks}
      chapters={chapters}
      notes={notes}
      sessions={sessions}
    />
  );
}
