import { cn } from "@/lib/cn";

export function DiamondDivider({ className }: { className?: string }) {
  return (
    <div className={cn("diamond-rule", className)} role="presentation">
      <span className="diamond-mark" />
    </div>
  );
}
