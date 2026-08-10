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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.png"
      alt="GABR Perfumes"
      className={cn("h-12 w-auto select-none object-contain", className)}
    />
  );
}
