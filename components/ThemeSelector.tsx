"use client";
import { useTheme } from "@/context/ThemeContext";

const themes = [
  { name: "Navy Gold", value: "navy" },
  { name: "Teal Mint", value: "teal" },
  { name: "Dark Neon", value: "neon" },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value as any)}
          className={`px-2 py-1 text-xs rounded transition ${
            theme === t.value
              ? "bg-primary-600 text-white dark:bg-primary-400"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}