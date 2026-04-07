import type {
  Environment,
  HttpMethod,
  OverviewDashboardData,
  OverviewIncidentSummary,
  OverviewMetricCard,
  OverviewMockState,
  OverviewTimelinePoint,
  SlowEndpointRow,
  TimeRange,
  TraceStatus,
} from "@/types/pulsescope";
import { formatCompactNumber, formatPercentage } from "@/lib/utils";

type RangeConfig = {
  points: number;
  stepMinutes: number;
  windowLabel: string;
};

type EnvironmentProfile = {
  latencyBase: number;
  throughputBase: number;
  errorRateBase: number;
  services: number;
  alerts: number;
  availabilityBase: number;
};

const rangeConfig: Record<TimeRange, RangeConfig> = {
  "15m": { points: 15, stepMinutes: 1, windowLabel: "Last 15 minutes" },
  "1h": { points: 12, stepMinutes: 5, windowLabel: "Last hour" },
  "6h": { points: 12, stepMinutes: 30, windowLabel: "Last 6 hours" },
  "24h": { points: 24, stepMinutes: 60, windowLabel: "Last 24 hours" },
  "7d": { points: 14, stepMinutes: 720, windowLabel: "Last 7 days" },
};

const environmentProfiles: Record<Environment, EnvironmentProfile> = {
  production: {
    latencyBase: 184,
    throughputBase: 18200,
    errorRateBase: 0.37,
    services: 28,
    alerts: 14,
    availabilityBase: 99.982,
  },
  staging: {
    latencyBase: 228,
    throughputBase: 7200,
    errorRateBase: 0.61,
    services: 12,
    alerts: 6,
    availabilityBase: 99.914,
  },
  development: {
    latencyBase: 312,
    throughputBase: 1200,
    errorRateBase: 1.42,
    services: 6,
    alerts: 2,
    availabilityBase: 99.631,
  },
};

const incidentTemplates: Record<Environment, OverviewIncidentSummary[]> = {
  production: [
    {
      id: "inc-214",
      title: "EU checkout latency regression",
      severity: "critical",
      status: "investigating",
      summary:
        "Write amplification inside the billing confirmation path is stretching p99 latency for EU checkout flows.",
      impactedServices: ["checkout-api", "billing-core", "postgres-writer"],
      startedAt: "22:41",
      updatedAt: "3 min ago",
      commander: "Maya Chen",
    },
    {
      id: "inc-209",
      title: "Kafka consumer lag elevated",
      severity: "high",
      status: "monitoring",
      summary:
        "Autoscaling reduced queue lag, but burst traffic still creates heat on ingest partitions during regional spikes.",
      impactedServices: ["event-ingest", "stream-router"],
      startedAt: "20:12",
      updatedAt: "18 min ago",
      commander: "Noah Patel",
    },
    {
      id: "inc-201",
      title: "Personalization cache churn",
      severity: "medium",
      status: "resolved",
      summary:
        "Feed cache warmup completed and edge hit ratio returned to target after invalidation policies were narrowed.",
      impactedServices: ["recommendation-engine", "edge-gateway"],
      startedAt: "17:02",
      updatedAt: "52 min ago",
      commander: "Isla Romero",
    },
  ],
  staging: [
    {
      id: "inc-stg-18",
      title: "Preview deploy rollback under review",
      severity: "medium",
      status: "monitoring",
      summary:
        "Canary rollback stabilized staging traffic, but trace outliers are still being monitored for regression drift.",
      impactedServices: ["checkout-api", "edge-gateway"],
      startedAt: "18:14",
      updatedAt: "9 min ago",
      commander: "Theo Morgan",
    },
  ],
  development: [],
};

const endpointTemplates: Array<{
  id: string;
  endpoint: string;
  method: HttpMethod;
  service: string;
  region: string;
  baseLatency: number;
  baseRpm: number;
  baseErrorRate: number;
  status: TraceStatus;
}> = [
  {
    id: "endpoint-1",
    endpoint: "/api/checkout/confirm",
    method: "POST",
    service: "checkout-api",
    region: "eu-west-1",
    baseLatency: 742,
    baseRpm: 3240,
    baseErrorRate: 0.72,
    status: "error",
  },
  {
    id: "endpoint-2",
    endpoint: "/api/orders/:id",
    method: "GET",
    service: "order-orchestrator",
    region: "us-east-1",
    baseLatency: 518,
    baseRpm: 2180,
    baseErrorRate: 0.34,
    status: "slow",
  },
  {
    id: "endpoint-3",
    endpoint: "/api/payments/authorize",
    method: "POST",
    service: "billing-core",
    region: "eu-west-1",
    baseLatency: 471,
    baseRpm: 1980,
    baseErrorRate: 0.51,
    status: "slow",
  },
  {
    id: "endpoint-4",
    endpoint: "/api/feed/personalized",
    method: "GET",
    service: "recommendation-engine",
    region: "us-west-2",
    baseLatency: 406,
    baseRpm: 4860,
    baseErrorRate: 0.18,
    status: "slow",
  },
  {
    id: "endpoint-5",
    endpoint: "/internal/ingest/events",
    method: "POST",
    service: "event-ingest",
    region: "us-east-1",
    baseLatency: 388,
    baseRpm: 7320,
    baseErrorRate: 0.42,
    status: "ok",
  },
  {
    id: "endpoint-6",
    endpoint: "/api/session/refresh",
    method: "POST",
    service: "edge-gateway",
    region: "ap-southeast-2",
    baseLatency: 194,
    baseRpm: 8400,
    baseErrorRate: 0.09,
    status: "ok",
  },
];

function wait(duration = 220) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

function round(value: number, precision = 0) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function formatLabel(index: number, total: number, stepMinutes: number) {
  const anchorHour = 22;
  const anchorMinute = 55;
  const offset = (total - 1 - index) * stepMinutes;
  const date = new Date(Date.UTC(2026, 3, 6, anchorHour, anchorMinute - offset));

  if (stepMinutes >= 720) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

function buildTimeline(environment: Environment, timeRange: TimeRange): OverviewTimelinePoint[] {
  const profile = environmentProfiles[environment];
  const range = rangeConfig[timeRange];

  return Array.from({ length: range.points }, (_, index) => {
    const waveA = Math.sin((index / Math.max(range.points - 1, 1)) * Math.PI * 2);
    const waveB = Math.cos((index / Math.max(range.points - 1, 1)) * Math.PI * 1.4);
    const drift = index / Math.max(range.points - 1, 1);
    const intensity =
      environment === "production" ? 1 : environment === "staging" ? 1.12 : 1.2;

    const latencyP95 = round(
      profile.latencyBase * intensity +
        waveA * 22 +
        waveB * 14 +
        drift * (environment === "production" ? 26 : -8),
    );
    const latencyP99 = round(latencyP95 * 3.1 + 42 + waveB * 18);
    const throughput = round(
      profile.throughputBase +
        waveA * profile.throughputBase * 0.07 +
        drift * profile.throughputBase * 0.06,
    );
    const errorRate = round(
      Math.max(profile.errorRateBase + waveB * 0.07 + drift * 0.04, 0.03),
      2,
    );

    return {
      label: formatLabel(index, range.points, range.stepMinutes),
      timestamp: formatLabel(index, range.points, range.stepMinutes),
      latencyP95,
      latencyP99,
      compareLatencyP95: round(latencyP95 * 0.93 + 8),
      compareLatencyP99: round(latencyP99 * 0.92 + 21),
      throughput,
      compareThroughput: round(throughput * 0.95 - 180),
      errorRate,
      compareErrorRate: round(Math.max(errorRate - 0.08, 0.02), 2),
      incidentLoad: Math.max(
        0,
        round(
          (environment === "production" ? 2 : environment === "staging" ? 1 : 0) +
            waveB * 0.6 +
            drift * 0.7,
        ),
      ),
    };
  });
}

function deltaLabel(current: number, previous: number, suffix: string) {
  const delta = round(current - previous, suffix === "%" ? 2 : 0);
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}${suffix}`;
}

function metricTone(current: number, previous: number, inverse = false) {
  if (current === previous) {
    return "neutral";
  }

  if (inverse) {
    return current < previous ? "positive" : "negative";
  }

  return current > previous ? "positive" : "negative";
}

function buildMetrics(
  timeline: OverviewTimelinePoint[],
  incidents: OverviewIncidentSummary[],
  environment: Environment,
): OverviewMetricCard[] {
  const latest = timeline.at(-1);
  const previous = timeline.at(-2) ?? timeline.at(-1);

  if (!latest || !previous) {
    return [];
  }

  const availability = round(
    environmentProfiles[environment].availabilityBase - latest.errorRate * 0.06,
    3,
  );

  return [
    {
      id: "p95-latency",
      label: "P95 latency",
      value: `${latest.latencyP95}ms`,
      delta: deltaLabel(latest.latencyP95, previous.latencyP95, "ms"),
      tone: metricTone(latest.latencyP95, previous.latencyP95, true),
      context: "Checkout and order reads are the first customer-facing paths drifting above latency budget.",
      footnote: "3 services above budget",
      sparkline: timeline.map((point) => point.latencyP95),
    },
    {
      id: "p99-latency",
      label: "P99 latency",
      value: `${latest.latencyP99}ms`,
      delta: deltaLabel(latest.latencyP99, previous.latencyP99, "ms"),
      tone: metricTone(latest.latencyP99, previous.latencyP99, true),
      context: "The slow tail is being stretched by write-heavy billing and storage fan-out paths.",
      footnote: "tail risk centered on billing-core",
      sparkline: timeline.map((point) => point.latencyP99),
    },
    {
      id: "throughput",
      label: "Throughput",
      value: `${formatCompactNumber(latest.throughput)} rpm`,
      delta: deltaLabel(latest.throughput / 1000, previous.throughput / 1000, "k"),
      tone: metricTone(latest.throughput, previous.throughput),
      context: "Request volume is elevated but not anomalous enough to explain the current latency pressure alone.",
      footnote: "volume steady across ingress + api",
      sparkline: timeline.map((point) => point.throughput),
    },
    {
      id: "error-rate",
      label: "Error rate",
      value: formatPercentage(latest.errorRate),
      delta: deltaLabel(latest.errorRate, previous.errorRate, "%"),
      tone: metricTone(latest.errorRate, previous.errorRate, true),
      context: "Failures are clustering around payment confirmation and ingest retry paths.",
      footnote: "2 endpoints over error budget",
      sparkline: timeline.map((point) => point.errorRate),
    },
    {
      id: "availability",
      label: "Availability",
      value: formatPercentage(availability, 3),
      delta: deltaLabel(availability, availability - 0.012, "%"),
      tone: "positive",
      context: "Availability remains inside SLO, but the remaining margin is thinner than the dashboard headline suggests.",
      footnote: "slo margin still intact",
      sparkline: timeline.map((point) => 99.6 + (100 - point.errorRate) * 0.004),
    },
    {
      id: "active-incidents",
      label: "Active incidents",
      value: `${incidents.filter((incident) => incident.status !== "resolved").length}`,
      delta:
        incidents.filter((incident) => incident.severity === "critical").length > 0
          ? "+1 critical"
          : "Stable",
      tone:
        incidents.filter((incident) => incident.status !== "resolved").length > 0
          ? "negative"
          : "neutral",
      context: "Current response threads still overlap customer-facing request paths and need active ownership.",
      footnote: "checkout + ingest still active",
      sparkline: timeline.map((point) => point.incidentLoad),
    },
  ];
}

function buildSlowEndpoints(environment: Environment, timeRange: TimeRange): SlowEndpointRow[] {
  const latencyMultiplier =
    environment === "production" ? 1 : environment === "staging" ? 1.08 : 1.16;
  const trafficMultiplier =
    timeRange === "15m" ? 1 : timeRange === "1h" ? 1.04 : timeRange === "6h" ? 1.1 : 1.16;

  return endpointTemplates
    .map((endpoint, index) => ({
      id: endpoint.id,
      endpoint: endpoint.endpoint,
      method: endpoint.method,
      service: endpoint.service,
      region: endpoint.region,
      latencyMs: round(endpoint.baseLatency * latencyMultiplier + index * 12),
      requestsPerMin: round(endpoint.baseRpm * trafficMultiplier - index * 110),
      errorRate: round(
        endpoint.baseErrorRate *
          (environment === "development" ? 1.25 : environment === "staging" ? 1.12 : 1),
        2,
      ),
      changePct: round(
        (environment === "production" ? 1 : environment === "staging" ? 0.6 : 0.35) *
          (18 - index * 2.5),
        1,
      ),
      status: endpoint.status,
    }))
    .sort((left, right) => right.latencyMs - left.latencyMs);
}

function buildIncidents(environment: Environment): OverviewIncidentSummary[] {
  return incidentTemplates[environment];
}

export async function getOverviewDashboardData({
  environment,
  timeRange,
  mockState = "live",
}: {
  environment: Environment;
  timeRange: TimeRange;
  mockState?: OverviewMockState;
}): Promise<OverviewDashboardData> {
  await wait();

  if (mockState === "error") {
    throw new Error("Historical overview rollups are unavailable in the local mock API.");
  }

  if (mockState === "empty") {
    return {
      state: "empty",
      generatedAt: "Updated just now",
      windowLabel: rangeConfig[timeRange].windowLabel,
      availability: "No data",
      trackedServices: 0,
      activeAlerts: 0,
      metrics: [],
      timeline: [],
      slowEndpoints: [],
      incidents: [],
    };
  }

  const incidents = buildIncidents(environment);
  const timeline = buildTimeline(environment, timeRange);
  const profile = environmentProfiles[environment];

  return {
    state: "ready",
    generatedAt:
      environment === "production"
        ? "Updated 28s ago"
        : environment === "staging"
          ? "Updated 1m ago"
          : "Updated 3m ago",
    windowLabel: rangeConfig[timeRange].windowLabel,
    availability: formatPercentage(
      round(profile.availabilityBase - timeline.at(-1)!.errorRate * 0.06, 3),
      3,
    ),
    trackedServices: profile.services,
    activeAlerts: profile.alerts,
    metrics: buildMetrics(timeline, incidents, environment),
    timeline,
    slowEndpoints: buildSlowEndpoints(environment, timeRange),
    incidents,
  };
}
