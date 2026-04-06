import { cn } from "@/lib/utils";

export function PanelSkeleton({
  className,
  lines = 4,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("surface-panel rounded-[28px] border border-white/10 p-5", className)}>
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-28 rounded-full bg-white/8" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            className="h-3 rounded-full bg-white/7"
            key={`skeleton-${index + 1}`}
            style={{ width: `${68 + (index % 3) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}
