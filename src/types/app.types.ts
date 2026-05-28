import type { Tables } from "./database.types";

export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type Chapter = Tables<"chapters">;
export type Task = Tables<"tasks">;
export type Note = Tables<"notes">;
export type FocusSession = Tables<"focus_sessions">;

export type Priority = "High" | "Medium" | "Low";
export type ProjectStatus = "ToDo" | "InProgress" | "Done";
export type TaskStatus = "ToDo" | "InProgress" | "Done";

export type ProjectWithStats = Project & {
  task_count: number;
  done_task_count: number;
  session_count: number;
  watched_chapters: number;
};

export type TaskWithNote = Task & {
  note?: Note | null;
};

export type NoteWithContext = Note & {
  project?: Pick<Project, "id" | "name"> | null;
  task?: Pick<Task, "id" | "title"> | null;
  chapter?: Pick<Chapter, "id" | "title"> | null;
};

export type ChapterWithNote = Chapter & {
  note?: Note | null;
};

export type ActivityDay = {
  day: string;
  tasks_completed: number;
  focus_minutes: number;
};

export type DashboardData = {
  todayTasks: Task[];
  overdueProjects: Project[];
  activeProjects: ProjectWithStats[];
  profile: Profile;
  activityGraph: ActivityDay[];
  prioritySummary: {
    high: number;
    medium: number;
    low: number;
  };
};
