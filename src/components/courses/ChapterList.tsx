"use client";

import { useTransition } from "react";
import { toggleChapterWatched } from "@/actions/chapters";
import { formatMinutes } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";
import type { Chapter } from "@/types/app.types";

interface ChapterListProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  projectId: string;
  onSelect: (chapter: Chapter) => void;
}

export function ChapterList({ chapters, activeChapterId, projectId, onSelect }: ChapterListProps) {
  const [isPending, startTransition] = useTransition();
  const watchedCount = chapters.filter((c) => c.is_watched).length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Chapters</h3>
        <span className="text-xs text-base-content/50">{watchedCount}/{chapters.length} watched</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3 border-b border-base-300/50 cursor-pointer hover:bg-base-200 transition-colors",
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
          </div>
        ))}
      </div>
    </div>
  );
}
