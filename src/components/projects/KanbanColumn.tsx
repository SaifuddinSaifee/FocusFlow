import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProjectWithStats, ProjectStatus } from "@/types/app.types";
import { cn } from "@/lib/utils/cn";

interface KanbanColumnProps {
  status: ProjectStatus;
  label: string;
  projects: ProjectWithStats[];
}

const columnColors: Record<ProjectStatus, string> = {
  ToDo: "border-t-base-content/20",
  InProgress: "border-t-info",
  Done: "border-t-success",
};

export function KanbanColumn({ status, label, projects }: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-base-200 rounded-xl border-t-4 min-h-64",
        columnColors[status]
      )}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-base-content/80">{label}</h3>
        <span className="badge badge-sm badge-ghost">{projects.length}</span>
      </div>
      <div className="flex-1 px-3 pb-3 flex flex-col gap-2 overflow-y-auto">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects"
            className="py-8"
          />
        ) : (
          projects.map((p) => <ProjectCard key={p.id} project={p} />)
        )}
      </div>
    </div>
  );
}
