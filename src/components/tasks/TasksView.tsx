"use client";

import { useState, useTransition } from "react";
import { TaskItem } from "./TaskItem";
import { TaskKanban } from "./TaskKanban";
import { TaskFormStandalone } from "./TaskFormStandalone";
import { TaskForm } from "./TaskForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import { updateTaskStatus } from "@/actions/tasks";
import { PriorityBadge } from "@/components/ui/Badge";
import { formatDeadline } from "@/lib/utils/formatDate";
import type { Task } from "@/types/app.types";

interface TasksViewProps {
  tasks: Task[];
}

type ViewMode = "list" | "kanban" | "cards" | "calendar";

export function TasksView({ tasks }: TasksViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isPending, startTransition] = useTransition();

  // Calendar View State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [addingTaskDate, setAddingTaskDate] = useState<string | null>(null);

  // Grouped tasks for List view
  const todo = tasks.filter((t) => t.status === "ToDo");
  const inProgress = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Done");

  const handleToggle = (task: Task) => {
    const newStatus = task.status === "Done" ? "ToDo" : "Done";
    startTransition(async () => {
      await updateTaskStatus(task.id, newStatus, task.project_id);
    });
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill start of week with previous month days
    const prevMonthDays = [];
    const prevMonthTotal = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthTotal - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthTotal - i),
      });
    }

    // Fill current month days
    const currentMonthDays = [];
    for (let i = 1; i <= totalDays; i++) {
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Fill end of week with next month days
    const totalSlots = prevMonthDays.length + currentMonthDays.length;
    const remainingSlots = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
    const nextMonthDays = [];
    for (let i = 1; i <= remainingSlots; i++) {
      nextMonthDays.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getTasksForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    return tasks.filter((t) => t.deadline && t.deadline.startsWith(dateString));
  };

  const calendarDays = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const isTodayDate = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div
      className={cn(
        "p-6 mx-auto transition-all duration-300",
        viewMode === "list" ? "max-w-3xl" : "max-w-6xl"
      )}
    >
      {/* Header with Title, Toggle and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Tasks</h1>
          <p className="text-sm text-base-content/60 mt-0.5">Manage and organize your standalone tasks</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          {/* Toggle buttons */}
          <div className="join bg-base-200 p-0.5 rounded-lg border border-base-300">
            {(["list", "kanban", "cards", "calendar"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "join-item btn btn-xs px-2.5 h-7 gap-1 font-medium border-none capitalize",
                  viewMode === mode
                    ? "btn-active bg-base-100 shadow-sm text-primary"
                    : "btn-ghost hover:bg-base-300 text-base-content/60"
                )}
                title={`${mode} view`}
              >
                {mode === "list" && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                {mode === "kanban" && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                )}
                {mode === "cards" && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
                {mode === "calendar" && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {mode}
              </button>
            ))}
          </div>

          <TaskFormStandalone />
        </div>
      </div>

      {/* Content renders based on active viewMode */}
      {tasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No standalone tasks"
          description="Add tasks here for quick to-dos, or create a project to organize bigger work."
        />
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-6">
          {todo.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">To Do</h2>
              <div className="flex flex-col gap-2">
                {todo.map((t) => <TaskItem key={t.id} task={t} />)}
              </div>
            </section>
          )}
          {inProgress.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">In Progress</h2>
              <div className="flex flex-col gap-2">
                {inProgress.map((t) => <TaskItem key={t.id} task={t} />)}
              </div>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Done</h2>
              <div className="flex flex-col gap-2">
                {done.map((t) => <TaskItem key={t.id} task={t} />)}
              </div>
            </section>
          )}
        </div>
      ) : viewMode === "kanban" ? (
        <TaskKanban tasks={tasks} />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "card bg-base-100 border border-base-300 shadow-sm hover:border-primary/45 hover:shadow-md transition-all duration-200",
                task.status === "Done" && "opacity-60"
              )}
            >
              <div className="card-body p-4 justify-between gap-3">
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={task.status === "Done"}
                      onChange={() => handleToggle(task)}
                      disabled={isPending}
                    />
                    <h3 className={cn("font-medium text-sm text-base-content", task.status === "Done" && "line-through")}>
                      {task.title}
                    </h3>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-base-200 text-xs text-base-content/60">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {task.deadline ? formatDeadline(task.deadline) : "No deadline"}
                  </span>

                  <span
                    className={cn(
                      "badge badge-xs font-semibold px-2 py-1",
                      task.status === "ToDo"
                        ? "badge-ghost"
                        : task.status === "InProgress"
                        ? "badge-info text-info-content"
                        : "badge-success text-success-content"
                    )}
                  >
                    {task.status === "ToDo" ? "To Do" : task.status === "InProgress" ? "In Progress" : "Done"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar / Timeline View */
        <div className="flex flex-col gap-4 bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-base-content">{formatMonthYear(currentDate)}</h2>
            <div className="join border border-base-300 rounded-lg">
              <button onClick={prevMonth} className="join-item btn btn-xs btn-ghost px-3">
                Prev
              </button>
              <button onClick={setToday} className="join-item btn btn-xs btn-ghost px-3">
                Today
              </button>
              <button onClick={nextMonth} className="join-item btn btn-xs btn-ghost px-3">
                Next
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-t border-l border-base-300 rounded-lg overflow-hidden">
            {/* Weekdays */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
              <div
                key={dayName}
                className="bg-base-200 text-center py-2 text-xs font-semibold text-base-content/60 border-r border-b border-base-300"
              >
                {dayName}
              </div>
            ))}

            {/* Days Grid */}
            {calendarDays.map((cell, idx) => {
              const dayTasks = getTasksForDate(cell.date);
              const cellToday = isTodayDate(cell.date);

              // Get year-month-day string for input: YYYY-MM-DD
              const dateString = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(cell.date.getDate()).padStart(2, "0")}`;

              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-24 p-1.5 flex flex-col gap-1 border-r border-b border-base-300 group transition-colors relative bg-base-100",
                    !cell.isCurrentMonth && "bg-base-200/40 opacity-50",
                    cellToday && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center",
                        cellToday ? "bg-primary text-primary-content font-extrabold" : "text-base-content/70"
                      )}
                    >
                      {cell.day}
                    </span>

                    {/* Quick plus button to add task for this day */}
                    <button
                      onClick={() => setAddingTaskDate(dateString)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost btn-circle btn-xs h-5 w-5 min-h-0 text-primary"
                      title="Add task for this date"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Tasks List inside cell */}
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-16 no-scrollbar">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggle(t)}
                        title={`Click to toggle: ${t.title}`}
                        className={cn(
                          "px-1 py-0.5 rounded text-[10px] truncate cursor-pointer transition-all border flex items-center gap-1 font-medium",
                          t.status === "Done"
                            ? "bg-success/10 text-success border-success/20 line-through opacity-75"
                            : t.priority === "High"
                            ? "bg-error/15 text-error border-error/25"
                            : t.priority === "Medium"
                            ? "bg-warning/15 text-warning border-warning/25"
                            : "bg-base-200 text-base-content/80 border-base-300"
                        )}
                      >
                        <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pop-up modal if they click quick add task in a cell */}
      {addingTaskDate && (
        <TaskForm
          open={true}
          onClose={() => setAddingTaskDate(null)}
          defaultDeadline={addingTaskDate}
        />
      )}
    </div>
  );
}
