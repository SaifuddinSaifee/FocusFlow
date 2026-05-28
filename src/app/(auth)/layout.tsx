import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FocusFlow — Sign In",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-base-content">FocusFlow</h1>
          <p className="text-base-content/60 mt-1 text-sm">Plan it. Focus. Finish it.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
