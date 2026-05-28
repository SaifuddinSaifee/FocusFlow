"use client";

import { useState } from "react";
import { TaskForm } from "./TaskForm";

export function TaskFormStandalone() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Task
      </button>
      <TaskForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}
