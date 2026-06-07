"use client";

import { useState, useTransition } from "react";
import { toggleChapterWatched, createChapter, deleteChapter } from "@/actions/chapters";
import { formatMinutes } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import type { Chapter } from "@/types/app.types";

interface ChapterListProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  projectId: string;
  onSelect: (chapter: Chapter) => void;
  isExternal?: boolean;
}

export function ChapterList({
  chapters,
  activeChapterId,
  projectId,
  onSelect,
  isExternal = false,
}: ChapterListProps) {
  const [isPending, startTransition] = useTransition();
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const watchedCount = chapters.filter((c) => c.is_watched).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between bg-base-100">
        <h3 className="font-semibold text-sm">Chapters</h3>
        <span className="text-xs text-base-content/50">{watchedCount}/{chapters.length} watched</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={cn(
              "group flex items-start gap-3 px-4 py-3 border-b border-base-300/50 cursor-pointer hover:bg-base-200 transition-colors",
              activeChapterId === chapter.id && "bg-primary/5 border-l-2 border-l-primary"
            )}
            onClick={() => onSelect(chapter)}
          >
            <input
              type="checkbox"
              className="checkbox checkbox-xs checkbox-primary mt-0.5 shrink-0"
              checked={chapter.is_watched}
              onChange={(e) => {
                e.stopPropagation();
                const checked = e.target.checked;
                startTransition(async () => {
                  await toggleChapterWatched(chapter.id, checked, projectId);
                });
              }}
              disabled={isPending}
            />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm line-clamp-2", chapter.is_watched && "text-base-content/50 line-through")}>
                <span className="text-base-content/40 mr-1">{index + 1}.</span>
                {chapter.title}
              </p>
              {chapter.duration_seconds && chapter.duration_seconds > 0 && (
                <p className="text-xs text-base-content/40 mt-0.5">
                  {formatMinutes(Math.round(chapter.duration_seconds / 60))}
                </p>
              )}
            </div>
            {isExternal && (
              <button
                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 hover:bg-error/10 transition-opacity p-1 self-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete chapter "${chapter.title}"?`)) {
                    startTransition(async () => {
                      await deleteChapter(chapter.id, projectId);
                    });
                  }
                }}
                disabled={isPending}
                title="Delete chapter"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {chapters.length === 0 && (
          <div className="p-4 text-center text-xs text-base-content/40">
            No chapters yet. Add your first chapter below!
          </div>
        )}
      </div>

      {isExternal && (
        <div className="p-3 border-t border-base-300 bg-base-200/50">
          {isAdding ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTitle.trim()) return;
                startTransition(async () => {
                  await createChapter(projectId, newTitle.trim(), newDuration ? parseInt(newDuration) : undefined);
                  setNewTitle("");
                  setNewDuration("");
                  setIsAdding(false);
                });
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="text"
                placeholder="Chapter / Module title"
                className="input input-bordered input-xs w-full"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                disabled={isPending}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min (optional)"
                  className="input input-bordered input-xs w-full"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  min={1}
                  disabled={isPending}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-xs shrink-0"
                  disabled={isPending}
                >
                  {isPending ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs shrink-0"
                  onClick={() => setIsAdding(false)}
                  disabled={isPending}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="btn btn-outline btn-primary btn-xs w-full gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Chapter / Module
            </button>
          )}
        </div>
      )}
    </div>
  );
}
