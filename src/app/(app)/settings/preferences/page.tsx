import { PreferencesSettings } from "@/components/settings/PreferencesSettings";

export default function PreferencesSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8 pb-6 border-b border-base-200/60">
        <h2 className="text-xl font-bold text-base-content">Preferences</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Customize app behavior and layout defaults.
        </p>
      </div>
      
      <PreferencesSettings />
    </div>
  );
}
