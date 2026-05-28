"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTimerStore } from "@/stores/timerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatTimer } from "@/lib/utils/formatDate";

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { status, mode, secondsRemaining, tick, incrementPomodoro, setMode, reset, completedPomodoros } =
    useTimerStore();
  const { focusDuration, shortBreakDuration, longBreakDuration, autoStartBreaks, soundEnabled } =
    useSettingsStore();

  const originalTitleRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-load sound
  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer-end.mp3");
    audioRef.current.preload = "auto";
  }, []);

  const handleComplete = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (typeof window !== "undefined" && Notification.permission === "granted") {
      const modeLabel = mode === "focus" ? "Focus session" : mode === "shortBreak" ? "Short break" : "Long break";
      new Notification("FocusFlow", {
        body: `${modeLabel} complete!`,
        icon: "/favicon.ico",
      });
    }

    if (mode === "focus") {
      incrementPomodoro();
      const newCount = completedPomodoros + 1;
      // After 4 focus sessions, suggest a long break
      const nextMode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
      const nextDuration = nextMode === "longBreak" ? longBreakDuration * 60 : shortBreakDuration * 60;
      if (autoStartBreaks) {
        setMode(nextMode, nextDuration);
        useTimerStore.getState().start(nextDuration);
      } else {
        setMode(nextMode, nextDuration);
      }
    } else {
      const nextDuration = focusDuration * 60;
      if (autoStartBreaks) {
        setMode("focus", nextDuration);
        useTimerStore.getState().start(nextDuration);
      } else {
        setMode("focus", nextDuration);
      }
    }
  }, [
    mode, soundEnabled, completedPomodoros, autoStartBreaks,
    focusDuration, shortBreakDuration, longBreakDuration,
    incrementPomodoro, setMode
  ]);

  // Manage interval
  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, tick]);

  // Handle session completion
  useEffect(() => {
    if (status === "completed") {
      handleComplete();
    }
  }, [status, handleComplete]);

  // Sync document title
  useEffect(() => {
    if (status === "running" || status === "paused") {
      if (!originalTitleRef.current) {
        originalTitleRef.current = document.title;
      }
      const modeEmoji = mode === "focus" ? "⏱" : "☕";
      document.title = `${modeEmoji} ${formatTimer(secondsRemaining)} — FocusFlow`;
    } else {
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
        originalTitleRef.current = "";
      }
    }
  }, [status, secondsRemaining, mode]);

  // Initialize timer duration from settings
  useEffect(() => {
    const { status: currentStatus } = useTimerStore.getState();
    if (currentStatus === "idle") {
      reset(focusDuration * 60);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
