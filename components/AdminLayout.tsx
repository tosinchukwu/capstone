"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children, wallet }: { children: React.ReactNode; wallet?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Doctors", href: "/admin/doctors" },
    { name: "Settings", href: "/admin/settings" },
    { name: "🏠 Home", href: "/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-gray-200 flex flex-col sm:flex-row">
      {/* Sidebar – responsive */}
      <aside className="w-full sm:w-64 bg-slate-800/60 backdrop-blur-sm border-b sm:border-b-0 sm:border-r border-gold-500/20 p-4 sm:p-6 space-y-4 sm:space-y-8 shadow-2xl">
        <div className="text-center border-b border-gold-500/20 pb-4">
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-gold-400 tracking-wide">Admin</h1>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {wallet ? `${wallet.slice(0, 10)}...` : "No wallet"}
          </p>
        </div>
        <nav className="flex flex-row sm:flex-col gap-2 sm:gap-1 overflow-x-auto sm:overflow-x-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap sm:whitespace-normal text-sm sm:text-base ${
                pathname === item.href
                  ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                  : "hover:bg-slate-700/50 text-gray-300 hover:text-gold-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block absolute bottom-6 text-xs text-gray-500">
          <p>© 2026 HealthBooking</p>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}