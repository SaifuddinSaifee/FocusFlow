"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "cupcake",
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
    }),
    {
      name: "focusflow-settings",
      onRehydrateStorage: () => (state) => {
        // Apply saved theme on hydration
        if (state?.theme && typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
