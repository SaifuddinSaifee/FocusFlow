import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNote } from "@/lib/supabase/queries/notes";
import { NoteEditor } from "@/components/notes/NoteEditor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const note = await getNote(supabase, id).catch(() => null);
  return { title: note ? `${note.title} — FocusFlow` : "Note — FocusFlow" };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const note = await getNote(supabase, id).catch(() => null);
  if (!note) notFound();

  return (
    <div className="h-full flex flex-col">
      <NoteEditor note={note} />
    </div>
  );
}
