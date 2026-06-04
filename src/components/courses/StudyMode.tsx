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

  const isYouTubeCourse = !!(project.playlist_id || project.video_id);
  const isUdemy = project.youtube_link?.includes("udemy.com");

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
            {isYouTubeCourse && currentVideoId ? (
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
            ) : isYouTubeCourse ? (
              <div className="aspect-video w-full flex items-center justify-center bg-base-300 rounded-xl">
                <p className="text-base-content/50">Select a chapter to play</p>
              </div>
            ) : (
              <div className="w-full max-w-xl bg-base-100/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-30" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/30">
                    {isUdemy ? (
                      <svg className="w-8 h-8 text-[#a435f0]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-300 max-w-sm mb-8 leading-relaxed">
                    This is an external course. Open it in a new window to watch the videos, and use this workspace to track your progress and take notes.
                  </p>
                  
                  <a
                    href={project.youtube_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-md px-8 gap-2 shadow-lg hover:shadow-primary/30 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Go to {isUdemy ? "Udemy Course" : "Course"} ↗
                  </a>
                </div>
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
                  isExternal={!isYouTubeCourse}
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
