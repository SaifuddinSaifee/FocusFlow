"use client";

import { useState } from "react";
import Link from "next/link";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { TaskKanban } from "@/components/tasks/TaskKanban";
import { NoteList } from "@/components/notes/NoteList";
import { CourseView } from "@/components/courses/CourseView";
import { SessionLog } from "@/components/timer/SessionLog";
import { formatDeadline } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import { updateProjectStatus, deleteProject } from "@/actions/projects";
import { useRouter } from "next/navigation";
import type { Project, Task, Chapter, Note, FocusSession } from "@/types/app.types";

interface ProjectDetailTabsProps {
  project: Project;
  tasks: Task[];
  chapters: Chapter[];
  notes: Note[];
  sessions: FocusSession[];
}

type Tab = "overview" | "tasks" | "notes" | "chapters" | "sessions";

export function ProjectDetailTabs({
  project,
  tasks,
  chapters,
  notes,
  sessions,
}: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const router = useRouter();

  const doneTasks = tasks.filter((t) => t.status === "Done").length;
  const completionPct =
    tasks.length > 0
      ? Math.round((doneTasks / tasks.length) * 100)
      : project.is_course && project.total_chapters > 0
      ? Math.round(
          (chapters.filter((c) => c.is_watched).length / project.total_chapters) * 100
        )
      : 0;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "tasks", label: "Tasks", count: tasks.length },
    { id: "notes", label: "Notes", count: notes.length },
    ...(project.is_course
      ? [{ id: "chapters" as Tab, label: "Course", count: chapters.length }]
      : []),
    { id: "sessions", label: "Sessions", count: sessions.length },
  ];

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    await deleteProject(project.id);
    router.push("/projects");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="px-6 pt-6 pb-4 border-b border-base-300 bg-base-100">
        <div className="flex items-start justify-between gap-4 max-w-5xl">
          <div className="flex items-start gap-4 min-w-0">
            <ProgressRing
              percent={completionPct}
              size={60}
              strokeWidth={5}
              label={`${completionPct}%`}
              className="flex-shrink-0 mt-1"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-base-content">{project.name}</h1>
                {project.is_course && (
                  <span className="badge badge-outline badge-sm">Course</span>
                )}
              </div>
              {project.description && (
                <p className="text-sm text-base-content/60 mt-1">{project.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <PriorityBadge priority={project.priority} />
                <StatusBadge status={project.status} />
                <span className="text-xs text-base-content/50">
                  Due {formatDeadline(project.deadline)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {project.is_course && (
              <Link
                href={`/projects/${project.id}`}
                className="btn btn-primary btn-sm gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Study Mode
              </Link>
            )}
            <select
              className="select select-bordered select-sm"
              value={project.status}
              onChange={(e) =>
                updateProjectStatus(
                  project.id,
                  e.target.value as Project["status"]
                )
              }
            >
              <option value="ToDo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button
              onClick={handleDelete}
              className="btn btn-ghost btn-sm text-error"
              title="Delete project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-4 border-b border-transparent -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/60 hover:text-base-content"
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="badge badge-sm badge-ghost">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl">
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="stat bg-base-200 rounded-xl p-4">
                <div className="stat-title text-xs">Tasks</div>
                <div className="stat-value text-2xl">{doneTasks}/{tasks.length}</div>
                <div className="stat-desc">completed</div>
              </div>
              <div className="stat bg-base-200 rounded-xl p-4">
                <div className="stat-title text-xs">Sessions</div>
                <div className="stat-value text-2xl">{sessions.length}</div>
                <div className="stat-desc">focus sessions</div>
              </div>
              <div className="stat bg-base-200 rounded-xl p-4">
                <div className="stat-title text-xs">Notes</div>
                <div className="stat-value text-2xl">{notes.length}</div>
                <div className="stat-desc">attached notes</div>
              </div>
              {project.is_course && (
                <div className="stat bg-base-200 rounded-xl p-4">
                  <div className="stat-title text-xs">Videos</div>
                  <div className="stat-value text-2xl">
                    {chapters.filter((c) => c.is_watched).length}/{project.total_chapters}
                  </div>
                  <div className="stat-desc">watched</div>
                </div>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <TaskKanban tasks={tasks} projectId={project.id} />
          )}

          {activeTab === "notes" && (
            <NoteList notes={notes} projectId={project.id} />
          )}

          {activeTab === "chapters" && project.is_course && (
            <CourseView project={project} chapters={chapters} notes={notes} />
          )}

          {activeTab === "sessions" && (
            <SessionLog sessions={sessions} />
          )}
        </div>
      </div>
    </div>
  );
}
