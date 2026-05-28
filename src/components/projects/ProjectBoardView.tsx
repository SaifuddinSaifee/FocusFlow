"use client";

import { KanbanColumn } from "./KanbanColumn";
import type { ProjectWithStats } from "@/types/app.types";

interface ProjectBoardViewProps {
  projects: ProjectWithStats[];
}

const COLUMNS = [
  { status: "ToDo" as const, label: "To Do" },
  { status: "InProgress" as const, label: "In Progress" },
  { status: "Done" as const, label: "Done" },
];

export function ProjectBoardView({ projects }: ProjectBoardViewProps) {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.status}
          status={col.status}
          label={col.label}
          projects={projects.filter((p) => p.status === col.status)}
        />
      ))}
    </div>
  );
}
