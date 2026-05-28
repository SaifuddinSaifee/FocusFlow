"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { ProjectWithStats } from "@/types/app.types";

interface ProjectListViewProps {
  projects: ProjectWithStats[];
}

type FilterStatus = "all" | "ToDo" | "InProgress" | "Done";
type FilterPriority = "all" | "High" | "Medium" | "Low";

export function ProjectListView({ projects }: ProjectListViewProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("all");

  const filtered = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (priorityFilter !== "all" && p.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="join">
          {(["all", "ToDo", "InProgress", "Done"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              className={cn("join-item btn btn-sm", statusFilter === s ? "btn-active" : "btn-ghost")}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s === "ToDo" ? "To Do" : s === "InProgress" ? "In Progress" : "Done"}
            </button>
          ))}
        </div>

        <select
          className="select select-bordered select-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
        >
          <option value="all">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects found"
          description={
            statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters."
              : "Create your first project to get started."
          }
          action={
            <Link href="/projects/new" className="btn btn-primary btn-sm">
              New Project
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
