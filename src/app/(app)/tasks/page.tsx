import { createClient } from "@/lib/supabase/server";
import { getStandaloneTasks } from "@/lib/supabase/queries/tasks";
import { TasksView } from "@/components/tasks/TasksView";

export const metadata = { title: "Tasks — FocusFlow" };

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const tasks = user
    ? await getStandaloneTasks(supabase, user.id).catch(() => [])
    : [];

  return <TasksView tasks={tasks} />;
}
