"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme as useAdminTheme } from "@/context/ThemeContext";
import { useTheme as useNextTheme } from "next-themes";

const themes = [
  { 
    name: "Clinical Blue", 
    value: "clinical",
    colors: ["#1E88E5", "#0D47A1", "#42A5F5", "#F8FAFC"]
  },
  { 
    name: "Healing Green", 
    value: "healing",
    colors: ["#10B981", "#14B8A6", "#34D399", "#F0FDF4"]
  },
];

export default function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useAdminTheme();
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = nextTheme === "dark";

  return (
    <div className="relative" ref={popupRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Theme Settings"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Theme Settings
          </h3>

          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Palette</p>
            <div className="flex flex-col gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value as any)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition ${
                    theme === t.value
                      ? "border-accent bg-gray-100 dark:bg-gray-700"
                      : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex gap-1">
                    {t.colors.map((c, i) => (
                      <span key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-sm theme-text">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
              {isDark ? "🌙 Dark" : "☀️ Light"}
            </span>
            <button
              onClick={() => setNextTheme(isDark ? "light" : "dark")}
              className="relative w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none"
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDark ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>

          <button onClick={() => setIsOpen(false)} className="mt-3 w-full text-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Close
          </button>
        </div>
      )}
    </div>
  );
}