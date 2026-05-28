import { createClient } from "@/lib/supabase/server";
import { getNotes } from "@/lib/supabase/queries/notes";
import { NoteList } from "@/components/notes/NoteList";

export const metadata = { title: "Notes — FocusFlow" };

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const notes = user ? await getNotes(supabase, user.id).catch(() => []) : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-base-content">Notes</h1>
        <p className="text-sm text-base-content/60 mt-0.5">
          {notes.length} standalone note{notes.length !== 1 ? "s" : ""}
        </p>
      </div>
      <NoteList notes={notes} />
    </div>
  );
}
