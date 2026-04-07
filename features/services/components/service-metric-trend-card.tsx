import { cn, formatCompactNumber, formatDuration, formatPercentage } from "@/lib/utils";
import type { ServiceMetricPoint } from "@/types/pulsescope";

export function ServiceMetricTrendCard({
  colorClass,
  label,
  points,
  type,
}: {
  colorClass: string;
  label: string;
  points: ServiceMetricPoint[];
  type: "latency" | "throughput" | "errorRate";
}) {
  const values = points.map((point) =>
    type === "latency"
      ? point.latencyMs
      : type === "throughput"
        ? point.throughputPerMin
        : point.errorRatePct,
  );
  const max = Math.max(...values, 1);
  const current = values[values.length - 1] ?? 0;
  const baseline = values[0] ?? 0;
  const delta = baseline === 0 ? 0 : ((current - baseline) / baseline) * 100;

  return (
    <div className="surface-panel min-w-0 rounded-[26px] border border-white/10 p-4">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 text-sm text-white/40">{label}</div>
          <div className="font-display text-3xl font-semibold tracking-[-0.05em] text-white">
            {formatMetric(current, type)}
          </div>
        </div>
        <div
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium",
            delta > 0
              ? "border-warning/20 bg-warning/10 text-warning"
              : "border-success/20 bg-success/10 text-success",
          )}
        >
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}%
        </div>
      </div>

      <div className="rounded-[22px] border border-white/8 bg-black/12 px-3 py-3">
        <div className="flex h-20 items-end gap-1.5">
        {values.map((value, index) => (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={`${label}-${index}`}>
            <div
              className={cn("w-full rounded-full", colorClass)}
              style={{ height: `${Math.max((value / max) * 100, 12)}%` }}
            />
            <div className="text-[10px] text-white/28">{points[index]?.timestamp}</div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

function formatMetric(value: number, type: "latency" | "throughput" | "errorRate") {
  if (type === "latency") {
    return formatDuration(Math.round(value));
  }

  if (type === "throughput") {
    return `${formatCompactNumber(Math.round(value))}/m`;
  }

  return formatPercentage(value);
}
