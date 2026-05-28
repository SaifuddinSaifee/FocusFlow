import Link from "next/link";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { ProjectWithStats } from "@/types/app.types";

interface ProgressRingsGridProps {
  projects: ProjectWithStats[];
}

export function ProgressRingsGrid({ projects }: ProgressRingsGridProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <h2 className="font-semibold text-base-content mb-3">Active Projects</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {projects.slice(0, 6).map((project) => {
            const pct =
              project.task_count > 0
                ? Math.round((project.done_task_count / project.task_count) * 100)
                : project.is_course && project.total_chapters > 0
                ? Math.round((project.watched_chapters / project.total_chapters) * 100)
                : 0;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-base-200 transition-colors"
              >
                <ProgressRing percent={pct} size={56} strokeWidth={5} label={`${pct}%`} />
                <p className="text-xs text-center text-base-content/70 line-clamp-2 leading-tight">
                  {project.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
