"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OverviewMetricCard as OverviewMetricCardType } from "@/types/pulsescope";

function Sparkline({
  points,
  strokeClassName,
}: {
  points: number[];
  strokeClassName: string;
}) {
  if (points.length === 0) {
    return null;
  }

  const width = 160;
  const height = 56;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const coordinates = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width;
    const y = height - ((point - min) / span) * (height - 8) - 4;
    return `${x},${y}`;
  });

  const areaPoints = [`0,${height}`, ...coordinates, `${width},${height}`].join(" ");

  return (
    <svg
      aria-hidden
      className="h-14 w-full"
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <polygon className="fill-white/4" points={areaPoints} />
      <polyline
        className={strokeClassName}
        fill="none"
        points={coordinates.join(" ")}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function OverviewMetricCard({
  index,
  metric,
}: {
  index: number;
  metric: OverviewMetricCardType;
}) {
  const icon =
    metric.tone === "positive" ? (
      <ArrowUpRight className="size-3.5" />
    ) : metric.tone === "negative" ? (
      <ArrowDownRight className="size-3.5" />
    ) : (
      <Minus className="size-3.5" />
    );

  const toneClasses =
    metric.tone === "positive"
      ? "border-success/24 bg-success/10 text-success"
      : metric.tone === "negative"
        ? "border-danger/24 bg-danger/10 text-danger"
        : "border-white/10 bg-white/6 text-white/58";

  const sparklineClasses =
    metric.tone === "positive"
      ? "stroke-success"
      : metric.tone === "negative"
        ? "stroke-danger"
        : "stroke-white/56";

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="surface-panel group rounded-[28px] border border-white/10 p-5 backdrop-blur-xl"
      initial={{ opacity: 0, y: 14 }}
      transition={{ delay: index * 0.035, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/46">{metric.label}</div>
          <div className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
            {metric.value}
          </div>
        </div>
        <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", toneClasses)}>
          {icon}
          <span>{metric.delta}</span>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-[22px] border border-white/8 bg-black/14 px-3 pt-3">
        <Sparkline points={metric.sparkline} strokeClassName={sparklineClasses} />
      </div>

      <div className="space-y-2">
        <p className="text-sm leading-6 text-white/56">{metric.context}</p>
        <div className="text-xs font-medium tracking-[0.14em] text-white/34 uppercase">
          {metric.footnote}
        </div>
      </div>
    </motion.article>
  );
}
