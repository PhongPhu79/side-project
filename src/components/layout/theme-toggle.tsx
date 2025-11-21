"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full
                   border border-slate-200 bg-white text-slate-700 text-xs
                   dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
        disabled
      >
        …
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full
                 border border-slate-200 bg-white text-slate-700 text-xs
                 hover:border-slate-300 cursor-pointer
                 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100
                 dark:hover:bg-slate-700 dark:hover:border-slate-500
                 transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
