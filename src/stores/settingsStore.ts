"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  theme: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  setTheme: (theme: string) => void;
  updateTimerSettings: (settings: Partial<{
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartBreaks: boolean;
    soundEnabled: boolean;
  }>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "cupcake",
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreaks: false,
      soundEnabled: true,
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
      updateTimerSettings: (settings) => set((state) => ({ ...state, ...settings })),
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
