import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[20px] border border-white/10 bg-black/14 px-4 py-2 text-sm text-white shadow-none outline-none placeholder:text-white/35 focus:border-white/22 focus:bg-black/20 focus-visible:ring-2 focus-visible:ring-[rgba(89,175,255,0.72)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(7,10,20)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
