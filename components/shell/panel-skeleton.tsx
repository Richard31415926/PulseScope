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
      <div className="animate-pulse space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-white/7" />
          <div className="h-5 w-40 rounded-full bg-white/8" />
        </div>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            className="h-3 rounded-full bg-white/7"
            key={`skeleton-${index + 1}`}
            style={{ width: `${68 + (index % 3) * 10}%` }}
          />
        ))}
        <div className="rounded-[22px] border border-white/6 bg-white/[0.02] p-4">
          <div className="h-3 w-24 rounded-full bg-white/7" />
          <div className="mt-3 h-3 w-5/6 rounded-full bg-white/7" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-white/7" />
        </div>
      </div>
    </div>
  );
}
