import { cn } from "@/lib/utils";
import type { TraceStatus } from "@/types/pulsescope";

const copy: Record<TraceStatus, string> = {
  ok: "Healthy",
  slow: "Degraded",
  error: "Critical",
};

export function HealthIndicator({
  status,
  compact = false,
}: {
  status: TraceStatus;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        status === "error"
          ? "border-danger/25 bg-danger/10 text-danger"
          : status === "slow"
            ? "border-warning/25 bg-warning/10 text-warning"
            : "border-success/25 bg-success/10 text-success",
        compact && "px-2.5 py-1",
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          status === "error" ? "bg-danger" : status === "slow" ? "bg-warning" : "bg-success",
        )}
      />
      <span>{copy[status]}</span>
    </div>
  );
}
