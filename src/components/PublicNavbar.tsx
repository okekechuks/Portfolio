"use client";

import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="flex w-full flex-wrap items-center justify-start gap-2 text-sm sm:justify-center sm:gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "group relative inline-flex rounded-full px-3 py-2 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                item.label === "Home" && "text-foreground"
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
