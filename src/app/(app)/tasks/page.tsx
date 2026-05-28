import { createClient } from "@/lib/supabase/server";
import { getStandaloneTasks } from "@/lib/supabase/queries/tasks";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskFormStandalone } from "@/components/tasks/TaskFormStandalone";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Tasks — FocusFlow" };

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const tasks = user
    ? await getStandaloneTasks(supabase, user.id).catch(() => [])
    : [];

  const todo = tasks.filter((t) => t.status === "ToDo");
  const inProgress = tasks.filter((t) => t.status === "InProgress");
  const done = tasks.filter((t) => t.status === "Done");

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Tasks</h1>
          <p className="text-sm text-base-content/60 mt-0.5">Standalone tasks not tied to a project</p>
        </div>
        <TaskFormStandalone />
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No standalone tasks"
          description="Add tasks here for quick to-dos, or create a project to organize bigger work."
        />
      ) : (
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
      )}
    </div>
  );
}
