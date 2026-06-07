import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries/profiles";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id).catch(() => null) : null;

  return (
    <div className="max-w-2xl">
      <div className="mb-8 pb-6 border-b border-base-200/60">
        <h2 className="text-xl font-bold text-base-content">Public Profile</h2>
        <p className="text-sm text-base-content/60 mt-1">
          This information will be displayed on your profile and across the app.
        </p>
      </div>
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
