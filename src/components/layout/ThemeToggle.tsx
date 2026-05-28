"use client";

import { useSettingsStore } from "@/stores/settingsStore";

const THEMES = [
  { value: "cupcake", label: "Light" },
  { value: "sunset", label: "Dark" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();
  const isDark = theme === "sunset";

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-sm btn-square"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 border border-base-300 rounded-box w-40 mt-1"
      >
        {THEMES.map((t) => (
          <li key={t.value}>
            <button
              onClick={() => setTheme(t.value)}
              className={theme === t.value ? "active" : ""}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
