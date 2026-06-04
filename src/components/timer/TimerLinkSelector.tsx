"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useAuthStore } from "@/stores/authStore";
import type { Project, Task } from "@/types/app.types";

interface TimerLinkSelectorProps {
  linkedProjectId: string | null;
  linkedTaskId: string | null;
  onLink: (projectId: string | null, taskId: string | null) => void;
  disabled?: boolean;
}

export function TimerLinkSelector({
  linkedProjectId,
  linkedTaskId,
  onLink,
  disabled,
}: TimerLinkSelectorProps) {
  const supabase = useSupabase();
  const { user } = useAuthStore();
  const params = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const projectIdFromUrl = typeof params?.id === "string" ? params.id : null;

  // 1. Auto-link to the current project if viewing a project page and nothing is linked yet
  useEffect(() => {
    if (projectIdFromUrl && !linkedProjectId) {
      onLink(projectIdFromUrl, null);
    }
  }, [projectIdFromUrl, linkedProjectId, onLink]);

  // 2. Fetch all user's projects for the dropdown
  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("id, name, status")
      .eq("user_id", user.id)
      .neq("status", "Done")
      .order("name")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching projects for timer:", error);
          return;
        }
        setProjects((data as Project[]) ?? []);
      });
  }, [user, supabase]);

  // 3. Ensure currently linked project is in the list of options (even if status is Done or not yet loaded)
  useEffect(() => {
    if (!linkedProjectId) return;
    if (projects.some((p) => p.id === linkedProjectId)) return;

    supabase
      .from("projects")
      .select("id, name, status")
      .eq("id", linkedProjectId)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching individual linked project:", error);
          return;
        }
        if (data) {
          setProjects((prev) => {
            const projectData = data as any;
            if (prev.some((p) => p.id === projectData.id)) return prev;
            return [...prev, projectData as Project];
          });
        }
      });
  }, [linkedProjectId, projects, supabase]);

  // 4. Fetch tasks of the linked project
  useEffect(() => {
    if (!linkedProjectId) {
      setTasks([]);
      return;
    }
    supabase
      .from("tasks")
      .select("id, title")
      .eq("project_id", linkedProjectId)
      .neq("status", "Done")
      .order("created_at")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching tasks for timer:", error);
          return;
        }
        setTasks((data as Task[]) ?? []);
      });
  }, [linkedProjectId, supabase]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <select
        className="select select-bordered select-sm"
        value={linkedProjectId ?? ""}
        onChange={(e) => {
          const val = e.target.value || null;
          onLink(val, null);
        }}
        disabled={disabled}
      >
        <option value="">No project linked</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {linkedProjectId && tasks.length > 0 && (
        <select
          className="select select-bordered select-sm"
          value={linkedTaskId ?? ""}
          onChange={(e) => onLink(linkedProjectId, e.target.value || null)}
          disabled={disabled}
        >
          <option value="">No task linked</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      )}
    </div>
  );
}
