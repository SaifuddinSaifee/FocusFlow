"use client";

import { useTimerStore } from "@/stores/timerStore";
import { useUIStore } from "@/stores/uiStore";
import { formatTimer } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

export function TimerPill() {
  const { status, secondsRemaining, mode } = useTimerStore();
  const { openTimerModal } = useUIStore();

  const isActive = status === "running" || status === "paused";
  const modeLabel = mode === "focus" ? "Focus" : mode === "shortBreak" ? "Break" : "Long Break";

  return (
    <button
      onClick={openTimerModal}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
        isActive
          ? status === "running"
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-warning/10 border-warning/30 text-warning"
          : "bg-base-200 border-base-300 text-base-content/60 hover:bg-base-300"
      )}
      aria-label="Open focus timer"
    >
      <span>{isActive ? (status === "running" ? "⏱" : "⏸") : "⏱"}</span>
      {isActive ? (
        <>
          <span>{modeLabel}</span>
          <span className="font-mono">{formatTimer(secondsRemaining)}</span>
        </>
      ) : (
        <span>Focus Timer</span>
      )}
    </button>
  );
}
