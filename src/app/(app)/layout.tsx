// All routes under (app) are user-specific — never statically prerender
export const dynamic = "force-dynamic";

import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import Script from "next/script";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        {/* YouTube IFrame API — loaded once for the whole app */}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-y-auto bg-base-200">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </SupabaseProvider>
  );
}
