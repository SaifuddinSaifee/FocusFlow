"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { cn } from "@/lib/utils/cn";

export function AppearanceSettings() {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Light Theme Card */}
        <button
          onClick={() => setTheme("cupcake")}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
            theme === "cupcake"
              ? "border-primary bg-primary/5"
              : "border-base-300 hover:border-primary/50 bg-base-200/50"
          )}
        >
          <div className="w-full h-24 rounded-lg bg-[#faf7f5] border border-base-300 flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-[#291334]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="font-semibold">Light Mode</span>
        </button>

        {/* Dark Theme Card */}
        <button
          onClick={() => setTheme("sunset")}
          className={cn(
            "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
            theme === "sunset"
              ? "border-primary bg-primary/5"
              : "border-base-300 hover:border-primary/50 bg-base-200/50"
          )}
        >
          <div className="w-full h-24 rounded-lg bg-[#121c22] border border-base-300 flex items-center justify-center shadow-sm">
            <svg className="w-8 h-8 text-[#fff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <span className="font-semibold">Dark Mode</span>
        </button>
      </div>
    </div>
  );
}
