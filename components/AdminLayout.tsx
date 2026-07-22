"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function AdminLayout({ children, wallet }: { children: React.ReactNode; wallet?: string }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Doctors", href: "/admin/doctors" },
    { name: "Settings", href: "/admin/settings" },
    { name: "🏠 Home", href: "/" },
  ];

  return (
    <div className="min-h-screen theme-bg theme-text flex flex-col sm:flex-row">
      <aside className="w-full sm:w-64 theme-bg-secondary border-b sm:border-b-0 sm:border-r theme-border p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl">
        <div className="text-center border-b theme-border pb-4">
          <h1 className="text-xl sm:text-2xl font-serif font-bold theme-accent tracking-wide">Admin</h1>
          <p className="text-xs theme-text-secondary mt-1 truncate">
            {wallet ? `${wallet.slice(0, 10)}...` : "No wallet"}
          </p>
          <p className="text-[10px] theme-text-secondary mt-1 opacity-50">
            Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </p>
        </div>

        <nav className="flex flex-row sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-x-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap sm:whitespace-normal text-sm sm:text-base ${
                pathname === item.href
                  ? "theme-accent-bg text-slate-900 border theme-border"
                  : "hover:theme-bg-secondary theme-text-secondary hover:theme-text"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block absolute bottom-6 text-xs theme-text-secondary">
          <p>© 2026 HealthBooking</p>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}