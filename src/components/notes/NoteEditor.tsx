"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { updateNote, deleteNote } from "@/actions/notes";
import { NoteExportMenu } from "./NoteExportMenu";
import { RichTextEditor } from "./RichTextEditor";
import { formatRelative } from "@/lib/utils/formatDate";
import type { Note } from "@/types/app.types";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const debouncedBody = useDebounce(body, 1500);
  const debouncedTitle = useDebounce(title, 1000);

  const save = useCallback(
    async (newTitle: string, newBody: string) => {
      if (newTitle === note.title && newBody === note.body) return;
      setIsSaving(true);
      await updateNote(note.id, { title: newTitle, body: newBody });
      setSavedAt(new Date());
      setIsSaving(false);
    },
    [note.id, note.title, note.body]
  );

  useEffect(() => {
    save(debouncedTitle, debouncedBody);
  }, [debouncedTitle, debouncedBody]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!confirm("Delete this note? This cannot be undone.")) return;
    await deleteNote(note.id, note.project_id);
    if (note.project_id) {
      router.push(`/projects/${note.project_id}`);
    } else {
      router.push("/notes");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-base-300 bg-base-100">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xl font-bold bg-transparent border-none outline-none text-base-content placeholder:text-base-content/30"
          placeholder="Note title…"
        />

        <div className="flex items-center gap-3 flex-shrink-0">
          {isSaving ? (
            <span className="text-xs text-base-content/40 flex items-center gap-1">
              <span className="loading loading-spinner loading-xs" />
              Saving…
            </span>
          ) : savedAt ? (
            <span className="text-xs text-base-content/40">Saved {formatRelative(savedAt)}</span>
          ) : null}

          <NoteExportMenu title={title} body={body} />

          <button
            onClick={handleDelete}
            className="btn btn-ghost btn-sm text-error"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <RichTextEditor
          initialContent={body}
          onChange={setBody}
          placeholder="Start writing…"
          className="min-h-full"
        />
      </div>

      {/* Hidden element for PDF export */}
      <div
        id="note-preview-export"
        className="hidden"
        dangerouslySetInnerHTML={{
          __html: `<div style="padding:32px;max-width:800px;font-family:sans-serif"><h1 style="margin-bottom:16px">${title}</h1>${body}</div>`,
        }}
      />
    </div>
  );
}
