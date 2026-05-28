"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import type { Task } from "@/types/app.types";

interface TaskKanbanProps {
  tasks: Task[];
  projectId: string;
}

const COLUMNS = [
  { status: "ToDo" as const, label: "To Do", color: "border-t-base-content/20" },
  { status: "InProgress" as const, label: "In Progress", color: "border-t-info" },
  { status: "Done" as const, label: "Done", color: "border-t-success" },
];

export function TaskKanban({ tasks, projectId }: TaskKanbanProps) {
  const [addingTo, setAddingTo] = useState<Task["status"] | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className={cn(
                "flex flex-col bg-base-200 rounded-xl border-t-4 min-h-48",
                col.color
              )}
            >
              <div className="px-4 py-3 flex items-center justify-between">
                <h4 className="font-semibold text-sm text-base-content/80">{col.label}</h4>
                <span className="badge badge-sm badge-ghost">{colTasks.length}</span>
              </div>
              <div className="flex-1 px-3 pb-3 flex flex-col gap-2">
                {colTasks.map((task) => (
                  <TaskItem key={task.id} task={task} projectId={projectId} />
                ))}
                <button
                  onClick={() => setAddingTo(col.status)}
                  className="btn btn-ghost btn-xs text-base-content/40 hover:text-base-content justify-start gap-1 mt-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <TaskForm
        open={addingTo !== null}
        onClose={() => setAddingTo(null)}
        projectId={projectId}
      />
    </>
  );
}
