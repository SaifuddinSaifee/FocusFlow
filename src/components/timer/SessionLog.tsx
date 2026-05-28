import { formatRelative, formatMinutes } from "@/lib/utils/formatDate";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FocusSession } from "@/types/app.types";

interface SessionLogProps {
  sessions: FocusSession[];
}

export function SessionLog({ sessions }: SessionLogProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon="⏱"
        title="No focus sessions yet"
        description="Start a focus session from the timer in the top nav to track your work."
      />
    );
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="stat bg-base-200 rounded-xl p-4 flex-1">
          <div className="stat-title text-xs">Total sessions</div>
          <div className="stat-value text-2xl">{sessions.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-xl p-4 flex-1">
          <div className="stat-title text-xs">Total time</div>
          <div className="stat-value text-2xl">{formatMinutes(totalMinutes)}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between px-4 py-3 bg-base-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">⏱</span>
              <div>
                <p className="text-sm font-medium">{formatMinutes(session.duration_minutes)} session</p>
                <p className="text-xs text-base-content/50">
                  {formatRelative(session.completed_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
