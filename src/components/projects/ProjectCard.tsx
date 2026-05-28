"use client";

import Link from "next/link";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { formatDeadline, isOverdue } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import type { ProjectWithStats } from "@/types/app.types";

interface ProjectCardProps {
  project: ProjectWithStats;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const completionPct =
    project.task_count > 0
      ? Math.round((project.done_task_count / project.task_count) * 100)
      : project.is_course && project.total_chapters > 0
      ? Math.round((project.watched_chapters / project.total_chapters) * 100)
      : 0;

  const overdue = isOverdue(project.deadline) && project.status !== "Done";

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="card-body p-4 gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base-content truncate text-sm">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-base-content/60 mt-0.5 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
            <ProgressRing
              percent={completionPct}
              size={44}
              strokeWidth={4}
              label={`${completionPct}%`}
              className="flex-shrink-0"
            />
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={project.priority} />
            <StatusBadge status={project.status} />
            {project.is_course && (
              <span className="badge badge-sm badge-outline">Course</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-base-content/50 pt-1 border-t border-base-300">
            <span className={cn(overdue && "text-error font-medium")}>
              {overdue ? "Overdue: " : "Due: "}
              {formatDeadline(project.deadline)}
            </span>
            <div className="flex items-center gap-3">
              {project.task_count > 0 && (
                <span>{project.done_task_count}/{project.task_count} tasks</span>
              )}
              {project.session_count > 0 && (
                <span>⏱ {project.session_count} sessions</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
