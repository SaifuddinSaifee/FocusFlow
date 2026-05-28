import type { Priority } from "@/types/app.types";

export function priorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case "High":
      return "badge-error";
    case "Medium":
      return "badge-warning";
    case "Low":
      return "badge-success";
  }
}

export function priorityDotClass(priority: Priority): string {
  switch (priority) {
    case "High":
      return "text-error";
    case "Medium":
      return "text-warning";
    case "Low":
      return "text-success";
  }
}

export function priorityLabel(priority: Priority): string {
  return priority;
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "ToDo":
      return "badge-ghost";
    case "InProgress":
      return "badge-info";
    case "Done":
      return "badge-success";
    default:
      return "badge-ghost";
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case "ToDo":
      return "To Do";
    case "InProgress":
      return "In Progress";
    case "Done":
      return "Done";
    default:
      return status;
  }
}
