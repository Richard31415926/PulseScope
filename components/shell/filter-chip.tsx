import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function FilterChip({ active = false, className, ...props }: FilterChipProps) {
  return (
    <button
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium",
        active
          ? "border-white/20 bg-white/12 text-white"
          : "border-white/10 bg-white/5 text-white/58 hover:border-white/16 hover:bg-white/8 hover:text-white/78",
        className,
      )}
      type="button"
      {...props}
    />
  );
}
