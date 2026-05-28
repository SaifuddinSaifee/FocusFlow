"use client";

import { useUIStore } from "@/stores/uiStore";
import { TimerDisplay } from "./TimerDisplay";

export function TimerModal() {
  const { timerModalOpen, closeTimerModal } = useUIStore();

  if (!timerModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeTimerModal();
      }}
    >
      <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <h2 className="font-semibold text-base-content">Focus Timer</h2>
          <button
            onClick={closeTimerModal}
            className="btn btn-ghost btn-sm btn-square"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <TimerDisplay />
      </div>
    </div>
  );
}
