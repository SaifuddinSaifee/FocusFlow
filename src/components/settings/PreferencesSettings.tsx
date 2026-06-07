"use client";

import { useUIStore } from "@/stores/uiStore";

export function PreferencesSettings() {
  const { projectViewMode, setProjectViewMode } = useUIStore();

  return (
    <div className="flex flex-col gap-8">
      {/* View Mode Setting */}
      <div>
        <h4 className="text-sm font-semibold text-base-content mb-3">Default Project View</h4>
        <div className="flex gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              className="radio radio-primary"
              checked={projectViewMode === "list"}
              onChange={() => setProjectViewMode("list")}
            />
            <span className="text-sm font-medium">List View</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              className="radio radio-primary"
              checked={projectViewMode === "board"}
              onChange={() => setProjectViewMode("board")}
            />
            <span className="text-sm font-medium">Kanban Board</span>
          </label>
        </div>
      </div>
    </div>
  );
}
