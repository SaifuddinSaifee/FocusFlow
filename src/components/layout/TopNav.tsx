"use client";

import { useUIStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils/cn";

export function TopNav() {
  const { toggleSidebar } = useUIStore();
  const { profile, user } = useAuthStore();

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <header className="h-14 border-b border-base-300 bg-base-200 flex items-center px-4 gap-4">
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

      {/* Theme toggle */}
      <ThemeToggle />

      {/* User avatar */}
      {profile && (
        <div className="avatar">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.display_name ?? "User"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xs font-semibold">
                {(profile.display_name ?? profile.email)?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
