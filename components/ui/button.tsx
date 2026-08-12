import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 text-label whitespace-nowrap transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-cta text-cta-foreground shadow-soft hover:bg-primary-deep hover:shadow-lifted hover:-translate-y-0.5",
        outline:
          "border border-primary text-foreground hover:bg-primary hover:text-cta-foreground hover:shadow-soft hover:-translate-y-0.5",
        ghost: "text-foreground hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-5",
        md: "h-12 px-7",
        lg: "h-14 px-9",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
