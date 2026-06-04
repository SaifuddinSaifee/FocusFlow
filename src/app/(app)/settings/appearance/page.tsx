import { AppearanceSettings } from "@/components/settings/AppearanceSettings";

export default function AppearanceSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8 pb-6 border-b border-base-200/60">
        <h2 className="text-xl font-bold text-base-content">Appearance</h2>
        <p className="text-sm text-base-content/60 mt-1">
          Customize how FocusFlow looks on your device.
        </p>
      </div>
      
      <div>
        <h3 className="text-base font-semibold text-base-content mb-4">Theme Preferences</h3>
        <AppearanceSettings />
      </div>
    </div>
  );
}
