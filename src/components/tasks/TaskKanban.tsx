"use client";

import { useState, useTransition } from "react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { cn } from "@/lib/utils/cn";
import { updateTaskStatus } from "@/actions/tasks";
import type { Task } from "@/types/app.types";

interface TaskKanbanProps {
  tasks: Task[];
  projectId?: string | null;
}

const COLUMNS = [
  { status: "ToDo" as const, label: "To Do", color: "border-t-base-content/20" },
  { status: "InProgress" as const, label: "In Progress", color: "border-t-info" },
  { status: "Done" as const, label: "Done", color: "border-t-success" },
];

export function TaskKanban({ tasks, projectId }: TaskKanbanProps) {
  const [addingTo, setAddingTo] = useState<Task["status"] | null>(null);
  const [draggedOverCol, setDraggedOverCol] = useState<Task["status"] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    setDraggedOverCol(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    startTransition(async () => {
      await updateTaskStatus(taskId, status, projectId ?? task.project_id);
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          const isOver = draggedOverCol === col.status;

          return (
            <div
              key={col.status}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
              className={cn(
                "flex flex-col bg-base-200 rounded-xl border-t-4 min-h-[400px] transition-all duration-200",
                col.color,
                isOver && "bg-base-300 ring-2 ring-primary/20 scale-[1.01]"
              )}
            >
              <div className="px-4 py-3 flex items-center justify-between">
                <h4 className="font-semibold text-sm text-base-content/80">{col.label}</h4>
                <span className="badge badge-sm badge-ghost">{colTasks.length}</span>
              </div>
              <div className="flex-1 px-3 pb-3 flex flex-col gap-2">
                {colTasks.map((task) => (
                  <TaskItem key={task.id} task={task} projectId={projectId} draggable />
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
