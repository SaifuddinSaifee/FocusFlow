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
  const firstUnwatched = chapters.find((c) => !c.is_watched) ?? chapters[0];
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(firstUnwatched ?? null);
  const [, startTransition] = useTransition();

  if (!chapters.length) {
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
          {watchedCount}/{chapters.length} videos · {progressPct}%
        </span>
      </div>

      {/* Video + Chapter list */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {currentVideoId ? (
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

        <div className="w-72 shrink-0 border border-base-300 rounded-xl overflow-hidden">
          <ChapterList
            chapters={chapters}
            activeChapterId={activeChapter?.id ?? null}
            projectId={project.id}
            onSelect={setActiveChapter}
          />
        </div>
      </div>
    </div>
  );
}
