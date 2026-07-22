"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const themes = [
  { name: "Navy Gold", value: "navy" },
  { name: "Teal Mint", value: "teal" },
  { name: "Dark Neon", value: "neon" },
];

export default function AdminLayout({ children, wallet }: { children: React.ReactNode; wallet?: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Doctors", href: "/admin/doctors" },
    { name: "Settings", href: "/admin/settings" },
    { name: "🏠 Home", href: "/" },
  ];

  return (
    <div className="min-h-screen admin-bg text-admin-text flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 admin-bg-secondary border-b sm:border-b-0 sm:border-r admin-border p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="text-center border-b admin-border pb-4">
          <h1 className="text-xl sm:text-2xl font-serif font-bold admin-accent tracking-wide">Admin</h1>
          <p className="text-xs admin-text-secondary mt-1 truncate">
            {wallet ? `${wallet.slice(0, 10)}...` : "No wallet"}
          </p>
        </div>

        {/* Theme Switcher */}
        <div className="flex flex-col gap-1 border-b admin-border pb-3">
          <span className="text-xs admin-text-secondary uppercase tracking-wider">Theme</span>
          <div className="flex flex-wrap gap-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value as any)}
                className={`px-2 py-1 text-xs rounded transition ${
                  theme === t.value
                    ? "admin-accent-bg text-slate-900 font-semibold"
                    : "admin-bg-secondary hover:admin-accent-hover text-admin-text-secondary"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex flex-row sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-x-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap sm:whitespace-normal text-sm sm:text-base ${
                pathname === item.href
                  ? "admin-accent-bg text-slate-900 border admin-border"
                  : "hover:admin-bg-secondary text-admin-text-secondary hover:text-admin-text"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block absolute bottom-6 text-xs admin-text-secondary">
          <p>© 2026 HealthBooking</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}