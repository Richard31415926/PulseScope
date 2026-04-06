"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartShell } from "@/components/charts/chart-shell";
import { formatCompactNumber, formatPercentage } from "@/lib/utils";
import type { OverviewTimelinePoint } from "@/types/pulsescope";

const axisClassName =
  "fill-white/30 text-[11px] tracking-[0.14em]";

function ChartTooltip({
  active,
  formatter,
  label,
  payload,
}: {
  active?: boolean;
  formatter: (value: number) => string;
  label?: string;
  payload?: Array<{ dataKey?: string | number; color?: string; name?: string; value?: number }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="surface-elevated rounded-[22px] border border-white/10 px-4 py-3 backdrop-blur-xl">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
        {label}
      </div>
      <div className="space-y-2">
        {payload.map((entry) => (
          <div className="flex items-center justify-between gap-4 text-sm" key={`${entry.dataKey}`}>
            <div className="flex items-center gap-2 text-white/56">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color ?? "white" }}
              />
              {entry.name}
            </div>
            <div className="font-medium text-white">{formatter(Number(entry.value ?? 0))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeltaTag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "positive" | "negative" | "neutral";
}) {
  return (
    <div
      className={
        tone === "positive"
          ? "rounded-full border border-success/24 bg-success/10 px-3 py-1 text-xs font-medium text-success"
          : tone === "negative"
            ? "rounded-full border border-danger/24 bg-danger/10 px-3 py-1 text-xs font-medium text-danger"
            : "rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/56"
      }
    >
      {children}
    </div>
  );
}

export function LatencyChartPanel({
  compareMode,
  timeline,
}: {
  compareMode: boolean;
  timeline: OverviewTimelinePoint[];
}) {
  const latest = timeline.at(-1);
  const previous = timeline.at(-2) ?? latest;

  if (!latest || !previous) {
    return null;
  }

  const latencyDelta = latest.latencyP95 - previous.latencyP95;

  return (
    <ChartShell
      className="h-full"
      description="P95 and P99 latency over the active window, tuned for fast visual detection of tail amplification."
      headline={`${latest.latencyP95}ms p95`}
      supporting={
        <div className="flex flex-wrap gap-2">
          <DeltaTag tone={latencyDelta <= 0 ? "positive" : "negative"}>
            {latencyDelta > 0 ? "+" : ""}
            {latencyDelta}ms
          </DeltaTag>
          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/58">
            {latest.latencyP99}ms p99
          </div>
        </div>
      }
      title="Latency"
    >
      <div className="h-[320px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={timeline}>
            <defs>
              <linearGradient id="latency-grid" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(112,130,255,0.18)" />
                <stop offset="100%" stopColor="rgba(112,130,255,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis axisLine={false} className={axisClassName} dataKey="label" tickLine={false} />
            <YAxis axisLine={false} className={axisClassName} tickFormatter={(value) => `${value}ms`} tickLine={false} width={56} />
            <Tooltip
              content={<ChartTooltip formatter={(value) => `${value}ms`} />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }}
            />
            {compareMode ? (
              <>
                <Line
                  dataKey="compareLatencyP95"
                  dot={false}
                  name="P95 compare"
                  opacity={0.45}
                  stroke="#8ca2ff"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  type="monotone"
                />
                <Line
                  dataKey="compareLatencyP99"
                  dot={false}
                  name="P99 compare"
                  opacity={0.32}
                  stroke="#5bbcff"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  type="monotone"
                />
              </>
            ) : null}
            <Line
              dataKey="latencyP95"
              dot={false}
              name="P95"
              stroke="#8ca2ff"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="latencyP99"
              dot={false}
              name="P99"
              stroke="#5bbcff"
              strokeWidth={2.4}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  );
}

export function ThroughputChartPanel({
  compareMode,
  timeline,
}: {
  compareMode: boolean;
  timeline: OverviewTimelinePoint[];
}) {
  const latest = timeline.at(-1);
  const previous = timeline.at(-2) ?? latest;

  if (!latest || !previous) {
    return null;
  }

  return (
    <ChartShell
      description="Request volume across ingress and service fan-out, normalized for the selected window."
      headline={`${formatCompactNumber(latest.throughput)} rpm`}
      supporting={
        <DeltaTag tone={latest.throughput >= previous.throughput ? "positive" : "negative"}>
          {latest.throughput >= previous.throughput ? "+" : ""}
          {formatCompactNumber(Math.abs(latest.throughput - previous.throughput))} rpm
        </DeltaTag>
      }
      title="Throughput"
    >
      <div className="h-[240px]">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="throughput-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(90,182,255,0.32)" />
                <stop offset="100%" stopColor="rgba(90,182,255,0.03)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis axisLine={false} className={axisClassName} dataKey="label" tickLine={false} />
            <YAxis
              axisLine={false}
              className={axisClassName}
              tickFormatter={(value) => formatCompactNumber(value)}
              tickLine={false}
              width={56}
            />
            <Tooltip
              content={<ChartTooltip formatter={(value) => `${formatCompactNumber(value)} rpm`} />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }}
            />
            <Area
              dataKey="throughput"
              fill="url(#throughput-fill)"
              name="Current window"
              stroke="#58b8ff"
              strokeWidth={2.5}
              type="monotone"
            />
            {compareMode ? (
              <Line
                dataKey="compareThroughput"
                dot={false}
                name="Compare window"
                opacity={0.42}
                stroke="#b8d7ff"
                strokeDasharray="6 4"
                strokeWidth={2}
                type="monotone"
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  );
}

export function ErrorRateChartPanel({
  compareMode,
  timeline,
}: {
  compareMode: boolean;
  timeline: OverviewTimelinePoint[];
}) {
  const latest = timeline.at(-1);
  const previous = timeline.at(-2) ?? latest;

  if (!latest || !previous) {
    return null;
  }

  return (
    <ChartShell
      description="Error rate across customer-facing and critical internal operations, with optional compare overlays."
      headline={formatPercentage(latest.errorRate)}
      supporting={
        <DeltaTag tone={latest.errorRate <= previous.errorRate ? "positive" : "negative"}>
          {latest.errorRate > previous.errorRate ? "+" : ""}
          {formatPercentage(latest.errorRate - previous.errorRate)}
        </DeltaTag>
      }
      title="Error rate"
    >
      <div className="h-[240px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={timeline}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis axisLine={false} className={axisClassName} dataKey="label" tickLine={false} />
            <YAxis
              axisLine={false}
              className={axisClassName}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip formatter={(value) => formatPercentage(value)} />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeDasharray: "4 4" }}
            />
            {compareMode ? (
              <Line
                dataKey="compareErrorRate"
                dot={false}
                name="Compare window"
                opacity={0.42}
                stroke="#ffb8b8"
                strokeDasharray="6 4"
                strokeWidth={2}
                type="monotone"
              />
            ) : null}
            <Line
              dataKey="errorRate"
              dot={false}
              name="Current window"
              stroke="#ff7c7c"
              strokeWidth={2.6}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  );
}
