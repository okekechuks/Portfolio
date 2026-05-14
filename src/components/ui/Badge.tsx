import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "learning" | "outline";
  className?: string;
}

const variants = {
  default: "bg-muted-bg text-foreground border-border",
  accent: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30",
  learning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  outline: "bg-transparent text-muted border-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
