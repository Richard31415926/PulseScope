import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(durationMs: number) {
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  }

  return `${durationMs}ms`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercentage(value: number, maximumFractionDigits = 2) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value)}%`;
}

export function formatRequestsPerMinute(value: number) {
  return `${formatCompactNumber(value)}/m`;
}

export function getStatusTone(
  status:
    | "ok"
    | "slow"
    | "error"
    | "critical"
    | "high"
    | "medium"
    | "low"
    | "investigating"
    | "monitoring"
    | "resolved"
    | "fatal"
    | "warn"
    | "info"
    | "debug"
    | "core"
    | "edge",
) {
  if (status === "ok" || status === "resolved" || status === "info") {
    return "success";
  }

  if (
    status === "error" ||
    status === "critical" ||
    status === "high" ||
    status === "fatal" ||
    status === "investigating"
  ) {
    return "danger";
  }

  if (status === "slow" || status === "warn" || status === "medium" || status === "monitoring") {
    return "warning";
  }

  if (status === "core") {
    return "neutral";
  }

  if (status === "edge") {
    return "neutral";
  }

  return "neutral";
}
