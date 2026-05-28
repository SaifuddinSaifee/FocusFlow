import { cn } from "@/lib/utils/cn";
import {
  priorityBadgeClass,
  priorityLabel,
  statusBadgeClass,
  statusLabel,
} from "@/lib/utils/priorityColor";
import type { Priority, ProjectStatus, TaskStatus } from "@/types/app.types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn("badge badge-sm", priorityBadgeClass(priority))}>
      {priorityLabel(priority)}
    </span>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus | TaskStatus }) {
  return (
    <span className={cn("badge badge-sm", statusBadgeClass(status))}>
      {statusLabel(status)}
    </span>
  );
}
