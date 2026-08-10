import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center text-label px-2.5 py-1", {
  variants: {
    variant: {
      solid: "bg-primary text-background",
      outline: "border border-primary text-primary",
      muted: "bg-surface-muted text-muted-foreground",
    },
  },
  defaultVariants: { variant: "outline" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
