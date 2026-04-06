import {
  Activity,
  Bell,
  Blocks,
  Gauge,
  Search,
  ServerCrash,
  Settings2,
} from "lucide-react";
import type {
  EnvironmentOption,
  NavigationItem,
  CompareRangeOption,
  RouteMeta,
  SavedViewOption,
  TimeRangeOption,
} from "@/types/navigation";

export const primaryNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/overview",
    icon: Gauge,
    commandKey: "G O",
    description: "Global health summary, active incidents, and recent alerts.",
  },
  {
    title: "Traces",
    href: "/traces",
    icon: Search,
    commandKey: "G T",
    description: "Query traces, inspect spans, and drill into request execution.",
  },
  {
    title: "Logs",
    href: "/logs",
    icon: Activity,
    commandKey: "G L",
    description: "Stream logs, inspect structured fields, and follow trace links.",
  },
  {
    title: "Services",
    href: "/services",
    icon: Blocks,
    commandKey: "G S",
    description: "Compare service health, dependencies, and failing operations.",
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: Bell,
    commandKey: "G I",
    description: "Track severity, impact, and response progress in one place.",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2,
    commandKey: "G C",
    description: "Tune workspace preferences, notifications, and data retention.",
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    title: "Status Center",
    href: "/incidents",
    icon: ServerCrash,
    commandKey: "G I",
    description: "Critical incident surface and executive-ready timeline.",
  },
];

export const routeMetadata: RouteMeta[] = [
  {
    key: "overview",
    eyebrow: "Command Center",
    title: "Overview",
    description: "A dense, high-signal readout of system health, alerts, and service posture.",
  },
  {
    key: "traces",
    eyebrow: "Latency Lab",
    title: "Traces Explorer",
    description: "Explore request flows with fast filters, preview panels, and drill-down detail.",
  },
  {
    key: "trace-detail",
    eyebrow: "Execution Path",
    title: "Trace Detail",
    description: "Follow the waterfall, inspect spans, and correlate services and logs.",
  },
  {
    key: "logs",
    eyebrow: "Signal Stream",
    title: "Logs Explorer",
    description: "Investigate structured log events with live-mode foundations and trace pivots.",
  },
  {
    key: "services",
    eyebrow: "Service Map",
    title: "Services",
    description: "Review service posture, ownership, latency, and dependency relationships.",
  },
  {
    key: "service-detail",
    eyebrow: "Service Focus",
    title: "Service Detail",
    description: "Inspect a single service’s health, incidents, and failing operations.",
  },
  {
    key: "incidents",
    eyebrow: "Response Desk",
    title: "Incidents",
    description: "Stay aligned on severity, impact, and timeline updates during active issues.",
  },
  {
    key: "settings",
    eyebrow: "Workspace",
    title: "Settings",
    description: "Shape the environment, saved views, and operator defaults behind the shell.",
  },
];

export const environmentOptions: EnvironmentOption[] = [
  {
    value: "production",
    label: "Production",
    description: "Primary traffic and critical customer journeys.",
  },
  {
    value: "staging",
    label: "Staging",
    description: "Pre-release validation and performance rehearsal.",
  },
  {
    value: "development",
    label: "Development",
    description: "Local and branch environments with loose guardrails.",
  },
];

export const timeRangeOptions: TimeRangeOption[] = [
  {
    value: "15m",
    label: "Last 15m",
    description: "Tight incident response and hot path triage.",
  },
  {
    value: "1h",
    label: "Last hour",
    description: "A fast operational snapshot for active debugging.",
  },
  {
    value: "6h",
    label: "Last 6h",
    description: "Useful for deploy regressions and traffic shifts.",
  },
  {
    value: "24h",
    label: "Last 24h",
    description: "Cross-shift service review and performance drift.",
  },
  {
    value: "7d",
    label: "Last 7d",
    description: "Longer trend comparison for service health.",
  },
];

export const savedViewOptions: SavedViewOption[] = [
  {
    value: "default",
    label: "Default View",
    description: "Balanced coverage across core production signals.",
  },
  {
    value: "handoff",
    label: "Handoff",
    description: "Compact state for shift changes and operator notes.",
  },
  {
    value: "latency-war-room",
    label: "Latency War Room",
    description: "A trace-first lens tuned for slow-path investigations.",
  },
];

export const compareRangeOptions: CompareRangeOption[] = [
  {
    value: "previous-period",
    label: "Previous period",
    description: "Compare against the immediately preceding window of the same size.",
  },
  {
    value: "previous-day",
    label: "Previous day",
    description: "Useful for operator handoff and time-of-day regressions.",
  },
  {
    value: "same-day-last-week",
    label: "Same day last week",
    description: "Highlights weekly traffic patterns and recurring degradation.",
  },
  {
    value: "deploy-baseline",
    label: "Deploy baseline",
    description: "Mock baseline anchored to the last stable deploy checkpoint.",
  },
];

export function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith("/traces/")) {
    return routeMetadata[2];
  }

  if (pathname.startsWith("/traces")) {
    return routeMetadata[1];
  }

  if (pathname.startsWith("/services/")) {
    return routeMetadata[5];
  }

  if (pathname.startsWith("/services")) {
    return routeMetadata[4];
  }

  if (pathname.startsWith("/logs")) {
    return routeMetadata[3];
  }

  if (pathname.startsWith("/incidents")) {
    return routeMetadata[6];
  }

  if (pathname.startsWith("/settings")) {
    return routeMetadata[7];
  }

  return routeMetadata[0];
}

export function isActivePath(pathname: string, href: string) {
  if (href === "/overview") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
