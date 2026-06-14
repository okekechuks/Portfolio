"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminNavbarProps {
  title: string;
}

export function AdminNavbar({ title }: AdminNavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
      <ThemeToggle />
    </header>
  );
}
