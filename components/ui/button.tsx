import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-medium whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,145,255,0.78)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(7,10,20)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-white text-slate-950 hover:bg-white/92",
        secondary:
          "border-white/10 bg-white/6 text-white hover:border-white/18 hover:bg-white/10",
        ghost:
          "border-transparent bg-transparent text-white/78 hover:bg-white/6 hover:text-white",
        outline:
          "border-white/12 bg-black/10 text-white/84 hover:border-white/24 hover:bg-white/8",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "size-10",
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
