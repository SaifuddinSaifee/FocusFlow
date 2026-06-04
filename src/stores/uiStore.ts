"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  projectViewMode: "list" | "board";
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setProjectViewMode: (mode: "list" | "board") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      projectViewMode: "list",
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setProjectViewMode: (projectViewMode) => set({ projectViewMode }),
    }),
    {
      name: "focusflow-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        projectViewMode: state.projectViewMode,
      }),
    }
  )
);
