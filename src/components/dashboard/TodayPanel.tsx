import Link from "next/link";
import { TaskItem } from "@/components/tasks/TaskItem";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Task } from "@/types/app.types";

interface TodayPanelProps {
  tasks: Task[];
}

export function TodayPanel({ tasks }: TodayPanelProps) {
  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base-content">Today</h2>
          <Link href="/tasks" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="All caught up!"
            description="No tasks due today."
            className="py-6"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {tasks.slice(0, 5).map((task) => (
              <TaskItem key={task.id} task={task} projectId={task.project_id} />
            ))}
            {tasks.length > 5 && (
              <p className="text-xs text-base-content/50 text-center mt-1">
                +{tasks.length - 5} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
