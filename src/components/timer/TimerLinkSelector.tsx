"use client";

import { useEffect, useState } from "react";
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("id, name")
      .eq("user_id", user.id)
      .neq("status", "Done")
      .order("name")
      .then(({ data }) => setProjects((data as Project[]) ?? []));
  }, [user, supabase]);

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
      .then(({ data }) => setTasks((data as Task[]) ?? []));
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
