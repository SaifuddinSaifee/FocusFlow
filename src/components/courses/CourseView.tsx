"use client";

import { useState, useTransition } from "react";
import { YouTubePlayer } from "./YouTubePlayer";
import { ChapterList } from "./ChapterList";
import { ChapterNoteEditor } from "./ChapterNoteEditor";
import { markChapterWatched } from "@/actions/chapters";
import type { Project, Chapter, Note } from "@/types/app.types";

interface CourseViewProps {
  project: Project;
  chapters: Chapter[];
  notes?: Note[];
}

export function CourseView({ project, chapters, notes = [] }: CourseViewProps) {
  const isYouTubeCourse = !!(project.playlist_id || project.video_id);
  const isUdemy = project.youtube_link?.includes("udemy.com");

  const firstUnwatched = chapters.find((c) => !c.is_watched) ?? chapters[0];
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(firstUnwatched ?? null);
  const [, startTransition] = useTransition();

  if (!chapters.length && isYouTubeCourse) {
    return (
      <div className="text-center py-12 text-base-content/60">
        <p className="text-lg mb-2">No chapters loaded yet</p>
        <p className="text-sm">Chapters are imported from the YouTube playlist when the project is created.</p>
      </div>
    );
  }

  const currentVideoId = activeChapter?.youtube_video_id ?? project.video_id ?? "";
  const watchedCount = chapters.filter((c) => c.is_watched).length;
  const progressPct = chapters.length > 0 ? Math.round((watchedCount / chapters.length) * 100) : 0;
  const chapterNote = activeChapter ? notes.find((n) => n.chapter_id === activeChapter.id) ?? null : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-base-300 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="text-sm font-medium text-base-content/70 shrink-0">
          {watchedCount}/{chapters.length} chapters · {progressPct}%
        </span>
      </div>

      {/* Video + Chapter list */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {isYouTubeCourse ? (
            currentVideoId ? (
              <YouTubePlayer
                key={currentVideoId}
                videoId={currentVideoId}
                onEnded={() => {
                  if (activeChapter && !activeChapter.is_watched) {
                    startTransition(async () => {
                      await markChapterWatched(activeChapter.id, project.id);
                    });
                    const currentIdx = chapters.findIndex((c) => c.id === activeChapter.id);
                    const next = chapters[currentIdx + 1];
                    if (next) setActiveChapter(next);
                  }
                }}
              />
            ) : (
              <div className="aspect-video bg-base-300 rounded-xl flex items-center justify-center">
                <p className="text-base-content/50">Select a chapter to play</p>
              </div>
            )
          ) : (
            <div className="aspect-video bg-gradient-to-br from-base-200 to-base-300 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-base-300 relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative z-10 max-w-md flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-lg">
                  {isUdemy ? (
                    <svg className="w-8 h-8 text-[#a435f0]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-3.5h-2V7h2v6z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-base-content mb-1">External Course Workspace</h3>
                <p className="text-sm text-base-content/60 mb-6">
                  {isUdemy ? "Udemy" : "External"} course: <span className="font-semibold text-primary">{project.name}</span>
                </p>
                
                <a
                  href={project.youtube_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-md gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Go to {isUdemy ? "Udemy Course" : "Course"} ↗
                </a>
              </div>
            </div>
          )}

          {activeChapter && (
            <div>
              <h3 className="font-semibold text-base-content">{activeChapter.title}</h3>
              <p className="text-xs text-base-content/50 mt-0.5">
                Chapter {chapters.findIndex((c) => c.id === activeChapter.id) + 1} of {chapters.length}
              </p>
            </div>
          )}

          {/* Inline note editor — sits directly below the video */}
          {activeChapter && (
            <ChapterNoteEditor
              key={activeChapter.id}
              chapter={activeChapter}
              projectId={project.id}
              initialNote={chapterNote}
            />
          )}
        </div>

        <div className="w-full md:w-72 shrink-0 border border-base-300 rounded-xl overflow-hidden min-h-[300px]">
          <ChapterList
            chapters={chapters}
            activeChapterId={activeChapter?.id ?? null}
            projectId={project.id}
            onSelect={setActiveChapter}
            isExternal={!isYouTubeCourse}
          />
        </div>
      </div>
    </div>
  );
}
