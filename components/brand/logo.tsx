import { cn } from "@/lib/cn";

const sizeClasses = {
  sm: "h-11",
  md: "h-16",
  lg: "h-44 md:h-56",
} as const;

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="GABR Perfumes"
      className={cn("w-auto select-none object-contain", sizeClasses[size], className)}
    />
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-primary select-none", className)}
      style={{ fontFamily: "var(--font-logo)", fontWeight: 700 }}
    >
      <span className="text-3xl leading-none">جبر</span>
    </span>
  );
}
