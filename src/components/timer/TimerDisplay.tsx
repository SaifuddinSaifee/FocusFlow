"use client";

import { useCallback } from "react";
import { useTimerStore } from "@/stores/timerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { formatTimer } from "@/lib/utils/formatDate";
import { logFocusSession } from "@/actions/sessions";
import { TimerLinkSelector } from "./TimerLinkSelector";
import { cn } from "@/lib/utils/cn";
import type { TimerMode } from "@/stores/timerStore";

export function TimerDisplay() {
  const {
    mode, status, secondsRemaining, completedPomodoros,
    linkedProjectId, linkedTaskId,
    start, pause, resume, reset, setMode, setLink,
  } = useTimerStore();

  const { focusDuration, shortBreakDuration, longBreakDuration } = useSettingsStore();

  const durations: Record<TimerMode, number> = {
    focus: focusDuration * 60,
    shortBreak: shortBreakDuration * 60,
    longBreak: longBreakDuration * 60,
  };

  const handleStart = useCallback(async () => {
    if (status === "idle") {
      // Request notification permission on first start
      if (typeof window !== "undefined" && Notification.permission === "default") {
        await Notification.requestPermission();
      }
      start(durations[mode]);
    } else if (status === "paused") {
      resume();
    }
  }, [status, mode, durations, start, resume]);

  const handleReset = useCallback(() => {
    reset(durations[mode]);
  }, [mode, durations, reset]);

  const handleModeSwitch = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode, durations[newMode]);
    },
    [durations, setMode]
  );

  // Log session when completed (called from TimerProvider, but also allows manual log)
  const handleManualComplete = useCallback(async () => {
    if (mode === "focus") {
      const elapsed = Math.round((durations.focus - secondsRemaining) / 60);
      if (elapsed > 0) {
        await logFocusSession({
          durationMinutes: elapsed,
          projectId: linkedProjectId,
          taskId: linkedTaskId,
        });
      }
    }
    reset(durations[mode]);
  }, [mode, durations, secondsRemaining, linkedProjectId, linkedTaskId, reset]);

  const pomodoroSlots = Array.from({ length: 4 }, (_, i) => i < (completedPomodoros % 4));

  const modeColors = {
    focus: "text-primary",
    shortBreak: "text-success",
    longBreak: "text-info",
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Mode tabs */}
      <div className="join border border-base-300 rounded-full">
        {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            className={cn(
              "join-item btn btn-sm rounded-full",
              mode === m ? "btn-primary" : "btn-ghost"
            )}
            onClick={() => handleModeSwitch(m)}
            disabled={status === "running"}
          >
            {m === "focus" ? "Focus" : m === "shortBreak" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </div>

      {/* Countdown */}
      <div className={cn("text-7xl font-mono font-bold tabular-nums", modeColors[mode])}>
        {formatTimer(secondsRemaining)}
      </div>

      {/* Pomodoro dots */}
      <div className="flex gap-2">
        {pomodoroSlots.map((filled, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full border-2 border-primary transition-colors",
              filled ? "bg-primary" : "bg-transparent"
            )}
          />
        ))}
      </div>

      {/* Session link selector */}
      <TimerLinkSelector
        linkedProjectId={linkedProjectId}
        linkedTaskId={linkedTaskId}
        onLink={setLink}
        disabled={status === "running"}
      />

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="btn btn-ghost btn-sm btn-circle"
          title="Reset"
          disabled={status === "idle"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={status === "running" ? pause : handleStart}
          className={cn(
            "btn btn-lg btn-circle",
            status === "running" ? "btn-warning" : "btn-primary"
          )}
        >
          {status === "running" ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleManualComplete}
          className="btn btn-ghost btn-sm btn-circle"
          title="Mark complete"
          disabled={status === "idle"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {completedPomodoros > 0 && (
        <p className="text-xs text-base-content/50">
          {completedPomodoros} session{completedPomodoros !== 1 ? "s" : ""} today
        </p>
      )}
    </div>
  );
}
