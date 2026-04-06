import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricSnapshot } from "@/types/pulsescope";

export function MetricCard({
  metric,
  className,
}: {
  metric: MetricSnapshot;
  className?: string;
}) {
  const icon =
    metric.tone === "positive" ? (
      <ArrowUpRight className="size-3.5" />
    ) : metric.tone === "negative" ? (
      <ArrowDownRight className="size-3.5" />
    ) : (
      <Minus className="size-3.5" />
    );

  return (
    <div
      className={cn(
        "surface-panel rounded-[24px] border border-white/10 p-4 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-5 text-sm text-white/46">{metric.label}</div>
      <div className="space-y-3">
        <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
          {metric.value}
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            metric.tone === "positive" && "border-success/20 bg-success/10 text-success",
            metric.tone === "negative" && "border-danger/20 bg-danger/10 text-danger",
            metric.tone === "neutral" && "border-white/10 bg-white/6 text-white/58",
          )}
        >
          {icon}
          <span>{metric.delta}</span>
        </div>
      </div>
    </div>
  );
}
