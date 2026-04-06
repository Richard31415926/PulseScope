import {
  getLogsByTraceId as getLogsByTraceIdFromDataset,
  getLogsShellData as getLogsShellDataFromDataset,
} from "@/lib/mock-api/logs";
import {
  getIncidentDetail as getIncidentDetailFromDataset,
  getIncidentsShellData as getIncidentsShellDataFromDataset,
} from "@/lib/mock-api/incidents";
import {
  getServiceDetail as getServiceDetailFromDataset,
  getServicesShellData as getServicesShellDataFromDataset,
} from "@/lib/mock-api/services";
import type {
  OverviewShellData,
} from "@/types/pulsescope";

const overviewData: OverviewShellData = {
  metrics: [
    { label: "P95 latency", value: "184ms", delta: "+12ms", tone: "negative" },
    { label: "P99 latency", value: "612ms", delta: "-34ms", tone: "positive" },
    { label: "Throughput", value: "18.2k rpm", delta: "+4.2%", tone: "positive" },
    { label: "Error rate", value: "0.37%", delta: "-0.09%", tone: "positive" },
    { label: "Active incidents", value: "2", delta: "+1 scope change", tone: "negative" },
    { label: "Recent alerts", value: "14", delta: "-3 noisy rules", tone: "positive" },
  ],
  alerts: [
    { id: "alrt-1", title: "Checkout timeout spike", service: "checkout-api", severity: "critical", age: "4m ago" },
    { id: "alrt-2", title: "Kafka consumer lag elevated", service: "event-ingest", severity: "high", age: "11m ago" },
    { id: "alrt-3", title: "Warm cache miss ratio drift", service: "edge-gateway", severity: "medium", age: "23m ago" },
    { id: "alrt-4", title: "Invoice queue backlog rising", service: "billing-core", severity: "low", age: "41m ago" },
  ],
  slowEndpoints: [
    { id: "ep-1", endpoint: "POST /api/checkout/confirm", service: "checkout-api", latency: "742ms", change: "+18%" },
    { id: "ep-2", endpoint: "GET /api/orders/:id", service: "order-orchestrator", latency: "512ms", change: "+9%" },
    { id: "ep-3", endpoint: "POST /api/payments/authorize", service: "billing-core", latency: "468ms", change: "+12%" },
    { id: "ep-4", endpoint: "GET /api/feed/personalized", service: "recommendation-engine", latency: "401ms", change: "+6%" },
  ],
  incidents: [
    {
      id: "inc-214",
      title: "EU checkout latency regression",
      severity: "critical",
      status: "investigating",
      summary: "Downstream write amplification is stretching the payment confirmation path in eu-west-1.",
      impactedServices: ["checkout-api", "billing-core", "postgres-writer"],
      timeline: [
        { id: "inc-214-1", label: "Detected", detail: "Latency SLO crossed 600ms p99.", at: "22:41" },
        { id: "inc-214-2", label: "Incident created", detail: "Primary on-call acknowledged and paged billing.", at: "22:44" },
        { id: "inc-214-3", label: "Mitigation", detail: "Canary rollback paused while span evidence is collected.", at: "22:51" },
      ],
      startedAt: "22:41",
      updatedAt: "22:51",
      commander: "Maya Chen",
      responseChannel: "#inc-checkout-eu",
      impactStatement: "Checkout confirmations are delayed for a subset of EU customers.",
      relatedTraceIds: ["trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H"],
    },
    {
      id: "inc-209",
      title: "Ingest partition imbalance",
      severity: "high",
      status: "monitoring",
      summary: "Consumer rebalancing reduced backlog, but shard heat remains elevated during bursts.",
      impactedServices: ["event-ingest", "stream-router"],
      timeline: [
        { id: "inc-209-1", label: "Detected", detail: "Lag climbed above 90s for two consumer groups.", at: "20:12" },
        { id: "inc-209-2", label: "Mitigated", detail: "Autoscaling policy increased partition workers.", at: "20:25" },
      ],
      startedAt: "20:12",
      updatedAt: "20:25",
      commander: "Jordan Park",
      responseChannel: "#inc-ingest-hot-shard",
      impactStatement: "Telemetry freshness briefly degraded for downstream consumers.",
      relatedTraceIds: ["trc_01J9AEAWH9F8B4V71HMAQ6TQKQ"],
    },
  ],
};

function wait(duration = 140) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

export async function getOverviewShellData(): Promise<OverviewShellData> {
  await wait();
  return overviewData;
}

export async function getLogsShellData() {
  return getLogsShellDataFromDataset();
}

export async function getLogsByTraceId(traceId: string) {
  return getLogsByTraceIdFromDataset(traceId);
}

export async function getServicesShellData() {
  return getServicesShellDataFromDataset();
}

export async function getServiceDetail(serviceId: string) {
  return getServiceDetailFromDataset(serviceId);
}

export async function getIncidentsShellData() {
  return getIncidentsShellDataFromDataset();
}

export async function getIncidentDetail(incidentId: string) {
  return getIncidentDetailFromDataset(incidentId);
}
