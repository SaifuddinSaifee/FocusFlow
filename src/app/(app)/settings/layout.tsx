import Link from "next/link";

export const metadata = { title: "Settings — FocusFlow" };

const settingsNav = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/timer", label: "Timer" },
  { href: "/settings/account", label: "Account" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content mb-6">Settings</h1>
      <div className="flex gap-6">
        <nav className="w-44 flex-shrink-0">
          <ul className="menu menu-sm bg-base-200 rounded-xl p-2">
            {settingsNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 card bg-base-100 border border-base-300">
          <div className="card-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
