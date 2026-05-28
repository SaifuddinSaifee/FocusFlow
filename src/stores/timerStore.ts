"use client";

import { create } from "zustand";

export type TimerMode = "focus" | "shortBreak" | "longBreak";
export type TimerStatus = "idle" | "running" | "paused" | "completed";

interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  secondsRemaining: number;
  completedPomodoros: number;
  linkedProjectId: string | null;
  linkedTaskId: string | null;

  // Actions
  start: (durationSeconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: (durationSeconds: number) => void;
  tick: () => void;
  setMode: (mode: TimerMode, durationSeconds: number) => void;
  setLink: (projectId: string | null, taskId: string | null) => void;
  complete: () => void;
  incrementPomodoro: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: "focus",
  status: "idle",
  secondsRemaining: 25 * 60,
  completedPomodoros: 0,
  linkedProjectId: null,
  linkedTaskId: null,

  start: (durationSeconds) =>
    set({ status: "running", secondsRemaining: durationSeconds }),

  pause: () => set({ status: "paused" }),

  resume: () => set({ status: "running" }),

  reset: (durationSeconds) =>
    set({ status: "idle", secondsRemaining: durationSeconds }),

  tick: () => {
    const { secondsRemaining } = get();
    if (secondsRemaining <= 1) {
      set({ secondsRemaining: 0, status: "completed" });
    } else {
      set({ secondsRemaining: secondsRemaining - 1 });
    }
  },

  setMode: (mode, durationSeconds) =>
    set({ mode, status: "idle", secondsRemaining: durationSeconds }),

  setLink: (linkedProjectId, linkedTaskId) =>
    set({ linkedProjectId, linkedTaskId }),

  complete: () => set({ status: "completed" }),

  incrementPomodoro: () =>
    set((state) => ({ completedPomodoros: state.completedPomodoros + 1 })),
}));
