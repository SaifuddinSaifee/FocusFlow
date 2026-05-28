"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { createNote, updateNote } from "@/actions/notes";
import { RichTextEditor } from "@/components/notes/RichTextEditor";
import { formatRelative } from "@/lib/utils/formatDate";
import type { Note, Chapter } from "@/types/app.types";

interface ChapterNoteEditorProps {
  chapter: Chapter;
  projectId: string;
  initialNote: Note | null;
}

const EMPTY_HTML = "<p></p>";

export function ChapterNoteEditor({ chapter, projectId, initialNote }: ChapterNoteEditorProps) {
  const noteIdRef = useRef<string | null>(initialNote?.id ?? null);
  const [body, setBody] = useState(initialNote?.body ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const debouncedBody = useDebounce(body, 1500);

  const save = useCallback(async (html: string) => {
    if (!html || html === EMPTY_HTML) return;

    setIsSaving(true);

    let id = noteIdRef.current;
    if (!id) {
      const result = await createNote({
        project_id: projectId,
        chapter_id: chapter.id,
        title: `Notes – ${chapter.title}`,
      });
      if (!result.noteId) {
        setIsSaving(false);
        return;
      }
      noteIdRef.current = result.noteId;
      id = result.noteId;
    }

    await updateNote(id, { body: html });
    setSavedAt(new Date());
    setIsSaving(false);
  }, [projectId, chapter.id, chapter.title]);

  useEffect(() => {
    save(debouncedBody);
  }, [debouncedBody]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-base-content/70">
          Notes for <span className="text-base-content">{chapter.title}</span>
        </h4>
        {isSaving ? (
          <span className="text-xs text-base-content/40 flex items-center gap-1">
            <span className="loading loading-spinner loading-xs" />
            Saving…
          </span>
        ) : savedAt ? (
          <span className="text-xs text-base-content/40">Saved {formatRelative(savedAt)}</span>
        ) : null}
      </div>

      <RichTextEditor
        initialContent={body}
        onChange={setBody}
        placeholder="Take notes for this chapter…"
      />
    </div>
  );
}
