"use client";

import { exportNoteHtml, exportNotePdf } from "@/lib/pdf/exportNote";

interface NoteExportMenuProps {
  title: string;
  body: string;
}

export function NoteExportMenu({ title, body }: NoteExportMenuProps) {
  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-sm gap-1.5"
        title="Export note"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 border border-base-300 rounded-box w-44 mt-1"
      >
        <li>
          <button onClick={() => exportNoteHtml(title, body)}>
            Download .html
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              try {
                await exportNotePdf(title, "note-preview-export");
              } catch (err) {
                console.error("PDF export failed", err);
              }
            }}
          >
            Export as PDF
          </button>
        </li>
      </ul>
    </div>
  );
}
