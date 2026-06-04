import { SettingsNav } from "@/components/settings/SettingsNav";

export const metadata = { title: "Settings — FocusFlow" };

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content tracking-tight">Settings</h1>
        <p className="text-base-content/60 mt-1">Manage your account settings and preferences.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <SettingsNav />

        {/* Content Area */}
        <div className="flex-1 bg-base-100 rounded-2xl border border-base-200/60 shadow-sm p-6 md:p-8 relative min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}
