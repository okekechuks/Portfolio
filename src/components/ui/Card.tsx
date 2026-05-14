import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-lg shadow-black/5",
        "backdrop-blur-sm transition-all duration-300",
        hover && "hover:border-muted hover:shadow-xl dark:shadow-black/20",
        className
      )}
    >
      {children}
    </div>
  );
}
