import { cn } from "@/lib/cn";

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const latin = {
    sm: "text-xl tracking-[0.18em]",
    md: "text-2xl tracking-[0.2em]",
    lg: "text-5xl md:text-6xl tracking-[0.16em]",
  }[size];

  const label = {
    sm: "text-[0.55rem] tracking-[0.3em]",
    md: "text-[0.6rem] tracking-[0.32em]",
    lg: "text-xs tracking-[0.4em]",
  }[size];

  return (
    <div className={cn("flex flex-col items-center gap-1.5 select-none", className)}>
      <span
        className="text-primary"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        <span className={latin}>GABR</span>
      </span>
      <div className="diamond-rule w-full min-w-28">
        <span className="diamond-mark" />
      </div>
      <span className={cn("text-muted-foreground uppercase", label)}>Perfumes</span>
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-primary", className)}
      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
    >
      <span className="text-2xl tracking-[0.2em]">GABR</span>
    </span>
  );
}
