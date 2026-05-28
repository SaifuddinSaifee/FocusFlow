"use client";

import { useUIStore } from "@/stores/uiStore";
import { useTimerStore } from "@/stores/timerStore";
import { useAuthStore } from "@/stores/authStore";
import { TimerPill } from "./TimerPill";
import { ThemeToggle } from "./ThemeToggle";
import { formatTimer } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

export function TopNav() {
  const { toggleSidebar } = useUIStore();
  const { status, secondsRemaining, mode } = useTimerStore();
  const { profile } = useAuthStore();

  const isTimerActive = status === "running" || status === "paused";

  return (
    <header className="h-14 border-b border-base-300 bg-base-100 flex items-center px-4 gap-4">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="btn btn-ghost btn-sm btn-square"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Timer pill */}
      <TimerPill />

      {/* Theme toggle */}
      <ThemeToggle />

      {/* User avatar */}
      {profile && (
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-8">
            <span className="text-xs font-semibold">
              {(profile.display_name ?? profile.email)?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
