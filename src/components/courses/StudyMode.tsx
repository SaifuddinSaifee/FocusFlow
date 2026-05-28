"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import Link from "next/link";
import { YouTubePlayer } from "./YouTubePlayer";
import { ChapterList } from "./ChapterList";
import { ChapterNoteEditor } from "./ChapterNoteEditor";
import { markChapterWatched } from "@/actions/chapters";
import { cn } from "@/lib/utils/cn";
import type { Project, Chapter, Note } from "@/types/app.types";

type SidebarTab = "chapters" | "notes";

interface StudyModeProps {
  project: Project;
  chapters: Chapter[];
  notes: Note[];
}

const CHROME_HIDE_DELAY = 3000;

export function StudyMode({ project, chapters, notes }: StudyModeProps) {
  const firstUnwatched = chapters.find((c) => !c.is_watched) ?? chapters[0];
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(firstUnwatched ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>("chapters");
  const [showChrome, setShowChrome] = useState(true);
  const [, startTransition] = useTransition();
  const chromeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealChrome = useCallback(() => {
    setShowChrome(true);
    if (chromeTimerRef.current) clearTimeout(chromeTimerRef.current);
    chromeTimerRef.current = setTimeout(() => setShowChrome(false), CHROME_HIDE_DELAY);
  }, []);

  const currentVideoId = activeChapter?.youtube_video_id ?? project.video_id ?? "";
  const watchedCount = chapters.filter((c) => c.is_watched).length;
  const progressPct = chapters.length > 0 ? Math.round((watchedCount / chapters.length) * 100) : 0;

  const chapterNote = activeChapter
    ? notes.find((n) => n.chapter_id === activeChapter.id) ?? null
    : null;

  const openSidebar = (tab: SidebarTab) => {
    setActiveTab(tab);
    setSidebarOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-base-100 flex flex-col" onMouseMove={revealChrome}>
      {/* Top bar */}
      <div
        className={cn(
          "flex items-center justify-between px-4 h-12 border-b border-base-300 bg-base-100 shrink-0 transition-opacity duration-300",
          !showChrome && "opacity-0"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/projects/${project.id}?mode=overview`}
            className="text-base-content/50 hover:text-base-content transition-colors shrink-0"
            title="Back to project"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-semibold text-sm truncate">{project.name}</span>
          {activeChapter && (
            <span className="text-xs text-base-content/40 truncate hidden md:block">
              — {activeChapter.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 bg-base-300 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-base-content/50 tabular-nums">
              {watchedCount}/{chapters.length}
            </span>
          </div>

          {/* Island — always visible in top bar when sidebar is open; standalone pill when closed */}
          {sidebarOpen ? (
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn btn-ghost btn-xs gap-1.5"
              title="Close sidebar"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Hide panel
            </button>
          ) : (
            <div className="flex items-center bg-base-200 border border-base-300 rounded-full px-1.5 py-1 gap-0.5">
              <button
                onClick={() => openSidebar("chapters")}
                className="px-3 py-0.5 text-xs font-medium rounded-full hover:bg-base-300 transition-colors"
              >
                Chapters
              </button>
              <div className="w-px h-3.5 bg-base-300" />
              <button
                onClick={() => openSidebar("notes")}
                className="px-3 py-0.5 text-xs font-medium rounded-full hover:bg-base-300 transition-colors"
              >
                Notes
              </button>
              <div className="w-px h-3.5 bg-base-300" />
              <Link
                href={`/projects/${project.id}?mode=overview`}
                className="px-3 py-0.5 text-xs font-medium rounded-full hover:bg-base-300 transition-colors"
              >
                Overview
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 min-w-0 flex flex-col bg-black overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            {currentVideoId ? (
              <div className="w-full max-w-full">
                <YouTubePlayer
                  key={currentVideoId}
                  videoId={currentVideoId}
                  onEnded={() => {
                    if (activeChapter && !activeChapter.is_watched) {
                      startTransition(async () => {
                        await markChapterWatched(activeChapter.id, project.id);
                      });
                      const idx = chapters.findIndex((c) => c.id === activeChapter.id);
                      const next = chapters[idx + 1];
                      if (next) setActiveChapter(next);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center bg-base-300 rounded-xl">
                <p className="text-base-content/50">Select a chapter to play</p>
              </div>
            )}
          </div>

          {/* Chapter info strip */}
          {activeChapter && (
            <div
              className={cn(
                "shrink-0 px-4 py-3 bg-base-100 border-t border-base-300 transition-opacity duration-300",
                !showChrome && "opacity-0"
              )}
            >
              <p className="font-semibold text-sm text-base-content truncate">{activeChapter.title}</p>
              <p className="text-xs text-base-content/40 mt-0.5">
                Chapter {chapters.findIndex((c) => c.id === activeChapter.id) + 1} of {chapters.length}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="border-l border-base-300 flex flex-col shrink-0 bg-base-100"
            style={{ width: "clamp(280px, 40%, 50%)" }}
          >
            {/* Sidebar tabs */}
            <div className="flex items-center border-b border-base-300 shrink-0 bg-base-100">
              <button
                onClick={() => setActiveTab("chapters")}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "chapters"
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/60 hover:text-base-content"
                )}
              >
                Chapters
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === "notes"
                    ? "border-primary text-primary"
                    : "border-transparent text-base-content/60 hover:text-base-content"
                )}
              >
                Notes
              </button>
              <Link
                href={`/projects/${project.id}?mode=overview`}
                className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-base-content/60 hover:text-base-content transition-colors"
              >
                Overview
              </Link>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "chapters" && (
                <ChapterList
                  chapters={chapters}
                  activeChapterId={activeChapter?.id ?? null}
                  projectId={project.id}
                  onSelect={setActiveChapter}
                />
              )}
              {activeTab === "notes" && activeChapter && (
                <div className="p-4">
                  <ChapterNoteEditor
                    key={activeChapter.id}
                    chapter={activeChapter}
                    projectId={project.id}
                    initialNote={chapterNote}
                  />
                </div>
              )}
              {activeTab === "notes" && !activeChapter && (
                <div className="p-4 text-sm text-base-content/50">Select a chapter to take notes.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
