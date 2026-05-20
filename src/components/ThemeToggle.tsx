"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/utils/cn";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { darkMode, setDarkMode, isHydrated } = useThemeStore();

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "h-10 w-10 rounded-xl border border-border bg-card",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card p-2.5",
        "text-foreground shadow-lg shadow-black/5 transition-all duration-200",
        "hover:border-[var(--accent)] hover:text-[var(--accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
        "dark:shadow-black/30",
        showLabel && "px-4",
        className
      )}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      {showLabel && (
        <span className="text-sm font-medium">
          {darkMode ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
