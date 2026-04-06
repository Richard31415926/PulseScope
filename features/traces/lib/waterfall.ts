import type { TraceSpan } from "@/types/pulsescope";

function getNiceStep(rawStep: number) {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(rawStep, 1)));
  const normalized = rawStep / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 2.5) {
    return 2.5 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

export function getWaterfallTicks(totalDurationMs: number, targetSegments = 5) {
  const rawStep = totalDurationMs / Math.max(targetSegments, 1);
  const step = getNiceStep(rawStep);
  const max = Math.ceil(totalDurationMs / step) * step;
  const ticks: number[] = [];

  for (let value = 0; value <= max; value += step) {
    ticks.push(value);
  }

  return ticks;
}

export function getWaterfallScaleMax(totalDurationMs: number, targetSegments = 5) {
  const ticks = getWaterfallTicks(totalDurationMs, targetSegments);
  return ticks[ticks.length - 1] ?? totalDurationMs;
}

export function getWaterfallOffsetPercent(offsetMs: number, scaleMaxMs: number) {
  return (offsetMs / Math.max(scaleMaxMs, 1)) * 100;
}

export function getWaterfallWidthPercent(durationMs: number, scaleMaxMs: number) {
  return (durationMs / Math.max(scaleMaxMs, 1)) * 100;
}

export function getSpanEndMs(span: TraceSpan) {
  return span.offsetMs + span.durationMs;
}
