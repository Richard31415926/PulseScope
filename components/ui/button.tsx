import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[18px] border text-sm font-medium whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(89,175,255,0.78)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(7,10,20)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-slate-950 shadow-[0_10px_30px_-16px_rgba(255,255,255,0.45)] hover:bg-white/94",
        secondary:
          "border-white/10 bg-white/[0.06] text-white hover:border-white/16 hover:bg-white/[0.1]",
        ghost:
          "border-transparent bg-transparent text-white/74 hover:bg-white/[0.06] hover:text-white",
        outline:
          "border-white/12 bg-black/10 text-white/84 hover:border-white/22 hover:bg-white/[0.08]",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
