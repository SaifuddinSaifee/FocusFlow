import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries/profiles";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id).catch(() => null) : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
