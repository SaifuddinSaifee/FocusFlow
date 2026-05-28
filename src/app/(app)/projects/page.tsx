import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProjectsWithStats } from "@/lib/supabase/queries/projects";
import { ProjectListView } from "@/components/projects/ProjectListView";
import { ProjectBoardView } from "@/components/projects/ProjectBoardView";
import { ViewToggle } from "@/components/projects/ViewToggle";

export const metadata = { title: "Projects — FocusFlow" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const projects = user ? await getProjectsWithStats(supabase, user.id).catch(() => []) : [];
  const { view } = await searchParams;
  const isBoard = view === "board";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Projects</h1>
          <p className="text-sm text-base-content/60 mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle isBoard={isBoard} />
          <Link href="/projects/new" className="btn btn-primary btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {isBoard ? (
        <ProjectBoardView projects={projects} />
      ) : (
        <ProjectListView projects={projects} />
      )}
    </div>
  );
}
