interface PrioritySummaryProps {
  summary: { high: number; medium: number; low: number };
}

export function PrioritySummary({ summary }: PrioritySummaryProps) {
  const total = summary.high + summary.medium + summary.low;

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <h2 className="font-semibold text-base-content mb-3">Open Tasks</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="text-sm">High priority</span>
            </div>
            <span className="badge badge-error badge-sm">{summary.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-sm">Medium priority</span>
            </div>
            <span className="badge badge-warning badge-sm">{summary.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm">Low priority</span>
            </div>
            <span className="badge badge-success badge-sm">{summary.low}</span>
          </div>
          <div className="divider my-0" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total open</span>
            <span className="font-semibold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
