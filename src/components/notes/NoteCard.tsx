import Link from "next/link";
import { formatRelative } from "@/lib/utils/formatDate";
import type { Note } from "@/types/app.types";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const preview = note.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <div className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-sm transition-all p-4 cursor-pointer">
        <h3 className="font-medium text-base-content text-sm truncate">{note.title}</h3>
        {preview && (
          <p className="text-xs text-base-content/50 mt-1 line-clamp-2">{preview}</p>
        )}
        <p className="text-xs text-base-content/40 mt-2">
          Updated {formatRelative(note.updated_at)}
        </p>
      </div>
    </Link>
  );
}
