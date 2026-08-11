import { useLocale } from "next-intl";
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
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <span
      className={cn("text-primary select-none", className)}
      style={
        isAr
          ? { fontFamily: "var(--font-logo)", fontWeight: 700 }
          : { fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em" }
      }
    >
      <span className={isAr ? "text-5xl leading-none" : "text-3xl leading-none"}>
        {isAr ? "جبر" : "GABR"}
      </span>
    </span>
  );
}
