"use client";

import { motion } from "framer-motion";
import { ArrowRight, Braces, Database, RadioTower, ServerCog, Zap } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { Badge } from "@/components/ui/badge";
import {
  getSpanEndMs,
  getWaterfallOffsetPercent,
  getWaterfallScaleMax,
  getWaterfallTicks,
  getWaterfallWidthPercent,
} from "@/features/traces/lib/waterfall";
import { cn, formatDuration } from "@/lib/utils";
import type { TraceDetail, TraceSpan, TraceSpanKind } from "@/types/pulsescope";

const columns = "minmax(0,334px) minmax(780px,1fr) 112px";

const kindCopy: Record<TraceSpanKind, string> = {
  entry: "entry",
  http: "http",
  db: "db",
  cache: "cache",
  queue: "queue",
  compute: "compute",
  external: "external",
};

export function TraceWaterfallTimeline({
  selectedSpanId,
  onSelectSpan,
  trace,
}: {
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
  trace: TraceDetail;
}) {
  const ticks = getWaterfallTicks(trace.durationMs);
  const scaleMaxMs = getWaterfallScaleMax(trace.durationMs);

  return (
    <SurfacePanel
      className="h-full overflow-hidden"
      description="Scaled against a clean time axis so the slow path reads at a glance without turning the panel into a chart for chart’s sake."
      title="Trace waterfall"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[1240px]">
          <div
            className="grid gap-4 border-b border-white/8 pb-3"
            style={{ gridTemplateColumns: columns }}
          >
            <HeaderLabel>Span</HeaderLabel>
            <div className="relative h-12 rounded-[22px] border border-white/8 bg-black/18">
              {ticks.map((tick) => {
                const left = getWaterfallOffsetPercent(tick, scaleMaxMs);

                return (
                  <div className="absolute inset-y-0" key={tick} style={{ left: `${left}%` }}>
                    <div className="absolute top-0 bottom-0 w-px bg-white/8" />
                    <div className="absolute top-3 left-2 text-[11px] text-white/34">
                      {formatDuration(tick)}
                    </div>
                  </div>
                );
              })}
            </div>
            <HeaderLabel className="text-right">Time</HeaderLabel>
          </div>

          <div className="mt-3 space-y-1.5">
            {trace.spans.map((span, index) => {
              const selected = span.id === selectedSpanId;
              const offsetPercent = getWaterfallOffsetPercent(span.offsetMs, scaleMaxMs);
              const widthPercent = Math.max(
                getWaterfallWidthPercent(span.durationMs, scaleMaxMs),
                1.2,
              );
              const isPrimary = span.name === trace.primarySpan;

              return (
                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  aria-label={`Select span ${span.name}`}
                  aria-pressed={selected}
                  className={cn(
                    "group grid w-full items-center gap-4 rounded-[24px] border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,145,255,0.72)] focus-visible:ring-inset",
                    selected
                      ? "border-white/16 bg-[linear-gradient(90deg,rgba(104,123,255,0.11),rgba(255,255,255,0.03))]"
                      : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]",
                  )}
                  data-testid={`span-row-${span.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  key={span.id}
                  onClick={() => onSelectSpan(span.id)}
                  transition={{ delay: index * 0.015, duration: 0.18 }}
                  type="button"
                  style={{ gridTemplateColumns: columns }}
                >
                  <div
                    className={cn(
                      "min-w-0 rounded-[18px] px-3 py-2 transition",
                      selected ? "bg-white/[0.04]" : "group-hover:bg-white/[0.02]",
                    )}
                  >
                    <div
                      className="flex min-w-0 items-start gap-3"
                      style={{ paddingLeft: `${span.depth * 18}px` }}
                    >
                      <div className="mt-1 shrink-0 text-white/38">{getKindIcon(span.kind)}</div>
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge variant={selected ? "info" : "neutral"}>{kindCopy[span.kind]}</Badge>
                          {isPrimary ? <Badge variant="warning">critical path</Badge> : null}
                        </div>
                        <div className="truncate font-medium text-white">{span.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                          <span className="truncate">{span.service}</span>
                          <ArrowRight className="size-3 shrink-0 text-white/20" />
                          <span className="truncate">{span.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-14 overflow-hidden rounded-[18px] border border-white/8 bg-black/18">
                    {ticks.map((tick) => {
                      const left = getWaterfallOffsetPercent(tick, scaleMaxMs);

                      return (
                        <div
                          aria-hidden
                          className="absolute top-0 bottom-0 w-px bg-white/7"
                          key={`${span.id}-${tick}`}
                          style={{ left: `${left}%` }}
                        />
                      );
                    })}

                    <div
                      className={cn(
                        "absolute top-1/2 h-9 -translate-y-1/2 rounded-[14px] border px-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)]",
                        getBarClass(span.status, selected),
                      )}
                      style={{
                        left: `${offsetPercent}%`,
                        width: `${widthPercent}%`,
                        minWidth: "14px",
                      }}
                    >
                      {widthPercent > 10 ? (
                        <div className="flex h-full items-center gap-2 overflow-hidden text-xs font-medium text-white">
                          <span className="truncate">{span.name}</span>
                        </div>
                      ) : null}
                    </div>

                    {selected ? (
                      <>
                        <div
                          aria-hidden
                          className="absolute inset-y-1.5 w-px bg-white/55"
                          style={{ left: `${offsetPercent}%` }}
                        />
                        <div
                          aria-hidden
                          className="absolute inset-y-1.5 w-px bg-white/22"
                          style={{
                            left: `${getWaterfallOffsetPercent(getSpanEndMs(span), scaleMaxMs)}%`,
                          }}
                        />
                      </>
                    ) : null}
                  </div>

                  <div className="text-right">
                    <div className="font-display text-lg font-semibold tracking-[-0.03em] text-white">
                      {formatDuration(span.durationMs)}
                    </div>
                    <div className="text-xs text-white/34">
                      self {formatDuration(span.selfTimeMs)}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </SurfacePanel>
  );
}

function HeaderLabel({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
}

function getKindIcon(kind: TraceSpanKind) {
  if (kind === "entry" || kind === "http") {
    return <Braces className="size-4" />;
  }

  if (kind === "db" || kind === "cache") {
    return <Database className="size-4" />;
  }

  if (kind === "queue") {
    return <RadioTower className="size-4" />;
  }

  if (kind === "external") {
    return <ServerCog className="size-4" />;
  }

  return <Zap className="size-4" />;
}

function getBarClass(status: TraceSpan["status"], selected: boolean) {
  if (status === "error") {
    return selected
      ? "border-danger/55 bg-[linear-gradient(90deg,rgba(244,96,96,0.88),rgba(255,157,78,0.48))]"
      : "border-danger/40 bg-[linear-gradient(90deg,rgba(244,96,96,0.74),rgba(255,157,78,0.34))]";
  }

  if (status === "slow") {
    return selected
      ? "border-warning/55 bg-[linear-gradient(90deg,rgba(245,189,92,0.88),rgba(122,154,255,0.4))]"
      : "border-warning/36 bg-[linear-gradient(90deg,rgba(245,189,92,0.74),rgba(122,154,255,0.24))]";
  }

  return selected
    ? "border-info/45 bg-[linear-gradient(90deg,rgba(110,145,255,0.88),rgba(77,190,255,0.36))]"
    : "border-info/28 bg-[linear-gradient(90deg,rgba(110,145,255,0.7),rgba(77,190,255,0.22))]";
}
