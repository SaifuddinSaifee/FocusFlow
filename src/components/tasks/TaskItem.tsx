"use client";

import { useTransition } from "react";
import { PriorityBadge } from "@/components/ui/Badge";
import { formatDeadline, isOverdue } from "@/lib/utils/formatDate";
import { updateTaskStatus, deleteTask } from "@/actions/tasks";
import { cn } from "@/lib/utils/cn";
import type { Task } from "@/types/app.types";

interface TaskItemProps {
  task: Task;
  projectId?: string | null;
  onEdit?: (task: Task) => void;
}

export function TaskItem({ task, projectId, onEdit }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const overdue = task.deadline && isOverdue(task.deadline) && task.status !== "Done";

  const handleToggle = () => {
    const newStatus = task.status === "Done" ? "ToDo" : "Done";
    startTransition(async () => {
      await updateTaskStatus(task.id, newStatus, projectId ?? task.project_id);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id, projectId ?? task.project_id);
    });
  };

  const handleStatusChange = (status: Task["status"]) => {
    startTransition(async () => {
      await updateTaskStatus(task.id, status, projectId ?? task.project_id);
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg border border-base-300 bg-base-100 group hover:border-base-content/20 transition-colors",
        task.status === "Done" && "opacity-60"
      )}
    >
      <input
        type="checkbox"
        className="checkbox checkbox-sm checkbox-primary"
        checked={task.status === "Done"}
        onChange={handleToggle}
        disabled={isPending}
      />

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm text-base-content truncate", task.status === "Done" && "line-through")}>
          {task.title}
        </p>
        {task.deadline && (
          <p className={cn("text-xs mt-0.5", overdue ? "text-error" : "text-base-content/50")}>
            {overdue ? "Overdue · " : ""}{formatDeadline(task.deadline)}
          </p>
        )}
      </div>

      <PriorityBadge priority={task.priority} />

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        <select
          className="select select-ghost select-xs text-base-content/60"
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as Task["status"])}
          disabled={isPending}
        >
          <option value="ToDo">To Do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        {onEdit && (
          <button onClick={() => onEdit(task)} className="btn btn-ghost btn-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}

        <button onClick={handleDelete} className="btn btn-ghost btn-xs text-error" disabled={isPending}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
