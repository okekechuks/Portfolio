"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  FolderKanban,
  Briefcase,
  Share2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/socials", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const COLLAPSE_KEY = "portfolio_admin_sidebar_collapsed";

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "true");
    } catch {
      setCollapsed(false);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      const next = !value;
      try {
        localStorage.setItem(COLLAPSE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("border-b border-zinc-800", collapsed ? "p-3" : "p-6")}>
        <div className="flex items-start justify-between gap-3">
          <Link
            href="/admin/dashboard"
            className={cn(
              "font-bold text-zinc-100",
              collapsed ? "text-sm leading-tight" : "text-lg"
            )}
            title="Portfolio Manager"
          >
            {collapsed ? (
              <span className="text-[var(--accent)]">PM</span>
            ) : (
              <>
                Portfolio<span className="text-[var(--accent)]">MANAGER</span>
              </>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="rounded-lg border border-zinc-800 p-2 text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        {!collapsed && <p className="mt-1 text-xs text-zinc-500">Admin Dashboard</p>}
      </div>

      <nav className={cn("flex-1 space-y-1", collapsed ? "p-2" : "p-4")}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5",
              pathname === href
                ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
            )}
          >
            <Icon size={18} />
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      <div className={cn("border-t border-zinc-800 space-y-2", collapsed ? "p-2" : "p-4")}>
        <Link
          href="/"
          title={collapsed ? "View Site" : undefined}
          className={cn(
            "flex items-center rounded-xl text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-100",
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          )}
        >
          {!collapsed && "View Site"}
        </Link>
        <button
          onClick={() => logout()}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center rounded-xl text-sm text-red-400 transition-colors hover:bg-red-500/10",
            collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
