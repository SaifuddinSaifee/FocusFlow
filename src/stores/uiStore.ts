"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  projectViewMode: "list" | "board";
  timerModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setProjectViewMode: (mode: "list" | "board") => void;
  openTimerModal: () => void;
  closeTimerModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      projectViewMode: "list",
      timerModalOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setProjectViewMode: (projectViewMode) => set({ projectViewMode }),
      openTimerModal: () => set({ timerModalOpen: true }),
      closeTimerModal: () => set({ timerModalOpen: false }),
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
