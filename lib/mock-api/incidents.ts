import type { IncidentRecord, IncidentsShellData } from "@/types/pulsescope";

export const incidentRecords: IncidentRecord[] = [
  {
    id: "inc-214",
    title: "EU checkout latency regression",
    severity: "critical",
    status: "investigating",
    summary:
      "Downstream write amplification is stretching the payment confirmation path in eu-west-1.",
    impactedServices: ["checkout-api", "billing-core", "postgres-writer"],
    timeline: [
      {
        id: "inc-214-1",
        label: "Detected",
        detail: "Latency SLO crossed 600ms p99 on checkout confirmation in eu-west-1.",
        at: "22:41",
      },
      {
        id: "inc-214-2",
        label: "Incident created",
        detail: "Primary on-call acknowledged and paged billing and data platform.",
        at: "22:44",
      },
      {
        id: "inc-214-3",
        label: "Mitigation paused",
        detail: "Canary rollback paused while trace evidence is collected on the write path.",
        at: "22:51",
      },
      {
        id: "inc-214-4",
        label: "Current hypothesis",
        detail: "Ledger shard lock queue is amplifying end-to-end confirmation latency.",
        at: "22:56",
      },
    ],
    startedAt: "22:41",
    updatedAt: "22:56",
    commander: "Maya Chen",
    responseChannel: "#inc-checkout-eu",
    impactStatement:
      "Checkout confirmations are delayed for a subset of EU customers, with visible retries during payment completion.",
    relatedTraceIds: ["trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H", "trc_01J9AE8NCW2P3WJNKDC1V41VW5"],
  },
  {
    id: "inc-209",
    title: "Ingest partition imbalance",
    severity: "high",
    status: "monitoring",
    summary:
      "Consumer rebalancing reduced backlog, but shard heat remains elevated during bursts.",
    impactedServices: ["event-ingest", "stream-router"],
    timeline: [
      {
        id: "inc-209-1",
        label: "Detected",
        detail: "Lag climbed above 90 seconds for two consumer groups on the hottest partition.",
        at: "20:12",
      },
      {
        id: "inc-209-2",
        label: "Mitigated",
        detail: "Autoscaling policy increased partition workers and reduced lag back under target.",
        at: "20:25",
      },
      {
        id: "inc-209-3",
        label: "Monitoring",
        detail: "Heat remains elevated on one broker, so the response room is still tracking spikes.",
        at: "20:41",
      },
    ],
    startedAt: "20:12",
    updatedAt: "20:41",
    commander: "Jordan Park",
    responseChannel: "#inc-ingest-hot-shard",
    impactStatement:
      "Telemetry freshness briefly degraded for downstream consumers, though event loss has not been observed.",
    relatedTraceIds: ["trc_01J9AEAWH9F8B4V71HMAQ6TQKQ"],
  },
  {
    id: "inc-203",
    title: "Document renderer memory ceiling",
    severity: "high",
    status: "resolved",
    summary:
      "High-resolution invoice templates exhausted renderer worker memory in staging.",
    impactedServices: ["invoice-worker", "document-renderer"],
    timeline: [
      {
        id: "inc-203-1",
        label: "Detected",
        detail: "Renderer restarts spiked while invoice regression runs were active.",
        at: "18:06",
      },
      {
        id: "inc-203-2",
        label: "Scoped",
        detail: "Issue narrowed to memory-heavy invoice-v12 templates in staging only.",
        at: "18:21",
      },
      {
        id: "inc-203-3",
        label: "Resolved",
        detail: "Worker memory ceiling raised and image compression fallback enabled.",
        at: "18:44",
      },
    ],
    startedAt: "18:06",
    updatedAt: "18:44",
    commander: "Anika Shah",
    responseChannel: "#inc-renderer-staging",
    impactStatement:
      "Internal staging invoice validation failed intermittently, but no production customer traffic was affected.",
    relatedTraceIds: ["trc_01J9AECJ6Z6T5AAZP3TFGFMMH4"],
  },
  {
    id: "inc-198",
    title: "Search facet drift under broad queries",
    severity: "medium",
    status: "monitoring",
    summary:
      "Facet aggregation latency grows under wide category searches with personalization overlays.",
    impactedServices: ["search-api", "search-index", "personalization-edge"],
    timeline: [
      {
        id: "inc-198-1",
        label: "Detected",
        detail: "Broad query cohorts pushed p95 above 400ms in the west region.",
        at: "16:18",
      },
      {
        id: "inc-198-2",
        label: "Mitigated",
        detail: "Cold segment warmup and cache retention rules reduced the spike.",
        at: "16:31",
      },
      {
        id: "inc-198-3",
        label: "Monitoring",
        detail: "Query volume is stable, but the personalization overlay remains under watch.",
        at: "16:47",
      },
    ],
    startedAt: "16:18",
    updatedAt: "16:47",
    commander: "Leah Romero",
    responseChannel: "#inc-search-facets",
    impactStatement:
      "A subset of broad search requests felt slower to customers, especially when personalization context was attached.",
    relatedTraceIds: ["trc_01J9AEBST0QEWVFSP4CGNX6RY2"],
  },
  {
    id: "inc-191",
    title: "Cart promotion rule expansion",
    severity: "low",
    status: "resolved",
    summary:
      "A flash-sale override stack widened promotion evaluation time during cart mutation peaks.",
    impactedServices: ["cart-api", "pricing-engine"],
    timeline: [
      {
        id: "inc-191-1",
        label: "Detected",
        detail: "Promotion rule evaluation crossed alert threshold during launch traffic.",
        at: "14:02",
      },
      {
        id: "inc-191-2",
        label: "Mitigated",
        detail: "Rule-cardinality cap applied to the launch campaign stack.",
        at: "14:19",
      },
      {
        id: "inc-191-3",
        label: "Resolved",
        detail: "Promotion graph normalized and checkout flow returned to baseline.",
        at: "14:37",
      },
    ],
    startedAt: "14:02",
    updatedAt: "14:37",
    commander: "Nadia Brooks",
    responseChannel: "#inc-cart-promotions",
    impactStatement:
      "Cart interactions felt sticky during a short sales window, but checkout conversions recovered after mitigation.",
    relatedTraceIds: ["trc_01J9AEB6XX2HM89KFK4CSPG2M1"],
  },
];

function wait(duration = 140) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

export async function getIncidentsShellData(): Promise<IncidentsShellData> {
  await wait();
  return {
    incidents: incidentRecords,
  };
}

export async function getIncidentDetail(incidentId: string) {
  await wait(110);
  return incidentRecords.find((incident) => incident.id === incidentId) ?? null;
}
