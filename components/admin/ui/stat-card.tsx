import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AdminStatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border border-border bg-surface p-5 transition-colors",
        accent && "border-primary"
      )}
    >
      {icon && (
        <div className="grid h-11 w-11 shrink-0 place-items-center bg-surface-muted text-primary">
          {icon}
        </div>
      )}
      <div>
        <p className="text-label text-muted-foreground">{label}</p>
        <p className="text-h3 mt-1">{value}</p>
      </div>
    </div>
  );
}
