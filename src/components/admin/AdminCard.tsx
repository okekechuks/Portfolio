import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface AdminCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AdminCard({ title, value, description, icon, className }: AdminCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-zinc-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
