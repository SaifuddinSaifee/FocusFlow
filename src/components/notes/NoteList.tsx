"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { NoteCard } from "./NoteCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { createNote } from "@/actions/notes";
import type { Note } from "@/types/app.types";

interface NoteListProps {
  notes: Note[];
  projectId?: string | null;
}

export function NoteList({ notes, projectId }: NoteListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createNote({ project_id: projectId ?? null });
      if (result.noteId) {
        router.push(`/notes/${result.noteId}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="btn btn-primary btn-sm gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
          New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No notes yet"
          description="Create a note to capture ideas, research, or references for this project."
          action={
            <button onClick={handleCreate} className="btn btn-primary btn-sm">
              Create first note
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
