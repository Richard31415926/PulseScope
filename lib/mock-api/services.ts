import { incidentRecords } from "@/lib/mock-api/incidents";
import { formatCompactNumber, formatDuration, formatPercentage } from "@/lib/utils";
import type {
  ServiceDetailData,
  ServiceMetricPoint,
  ServiceOperationStat,
  ServiceRecord,
  ServicesShellData,
  ServiceTier,
  TraceStatus,
} from "@/types/pulsescope";

type ServiceSeed = {
  id: string;
  name: string;
  tier: ServiceTier;
  environment: ServiceRecord["environment"];
  status: TraceStatus;
  owner: string;
  description: string;
  p95LatencyMs: number;
  throughputPerMin: number;
  errorRatePct: number;
  availabilityPct: number;
  dependencies: string[];
  incidents: string[];
  failingOperations: string[];
};

const serviceSeeds: ServiceSeed[] = [
  {
    id: "checkout-api",
    name: "checkout-api",
    tier: "critical",
    environment: "production",
    status: "error",
    owner: "Payments Platform",
    description: "Customer-facing checkout orchestration for payment confirmation and order finalization.",
    p95LatencyMs: 184,
    throughputPerMin: 4800,
    errorRatePct: 0.61,
    availabilityPct: 99.82,
    dependencies: ["billing-core", "inventory-api", "risk-engine"],
    incidents: ["inc-214"],
    failingOperations: ["confirmCheckout", "reconcilePayment"],
  },
  {
    id: "billing-core",
    name: "billing-core",
    tier: "critical",
    environment: "production",
    status: "slow",
    owner: "Payments Platform",
    description: "Core payment authorization, ledger posting, and retry-safe billing workflows.",
    p95LatencyMs: 201,
    throughputPerMin: 3200,
    errorRatePct: 0.47,
    availabilityPct: 99.88,
    dependencies: ["gateway-proxy", "postgres-writer"],
    incidents: ["inc-214"],
    failingOperations: ["authorizePayment", "postLedgerWrite"],
  },
  {
    id: "event-ingest",
    name: "event-ingest",
    tier: "core",
    environment: "production",
    status: "slow",
    owner: "Telemetry Systems",
    description: "High-throughput ingestion for telemetry envelopes and downstream stream fan-out.",
    p95LatencyMs: 129,
    throughputPerMin: 28000,
    errorRatePct: 0.18,
    availabilityPct: 99.93,
    dependencies: ["stream-router", "registry-api"],
    incidents: ["inc-209"],
    failingOperations: ["publishEnvelope"],
  },
  {
    id: "edge-gateway",
    name: "edge-gateway",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Edge Runtime",
    description: "Ingress layer handling authentication, routing, and regional request framing.",
    p95LatencyMs: 92,
    throughputPerMin: 68000,
    errorRatePct: 0.09,
    availabilityPct: 99.97,
    dependencies: ["checkout-api", "session-cache"],
    incidents: [],
    failingOperations: ["refreshSession"],
  },
  {
    id: "recommendation-engine",
    name: "recommendation-engine",
    tier: "edge",
    environment: "staging",
    status: "ok",
    owner: "Discovery ML",
    description: "Personalized feed composition and ranking for recommendation surfaces.",
    p95LatencyMs: 146,
    throughputPerMin: 11000,
    errorRatePct: 0.04,
    availabilityPct: 99.98,
    dependencies: ["feature-store", "model-serving"],
    incidents: [],
    failingOperations: ["assembleFeed"],
  },
  {
    id: "order-orchestrator",
    name: "order-orchestrator",
    tier: "critical",
    environment: "production",
    status: "slow",
    owner: "Orders Platform",
    description: "Order read and enrichment orchestration across fulfillment and state storage.",
    p95LatencyMs: 211,
    throughputPerMin: 3900,
    errorRatePct: 0.22,
    availabilityPct: 99.91,
    dependencies: ["postgres-reader", "fulfillment-api"],
    incidents: [],
    failingOperations: ["fetchOrder", "hydrateShipmentState"],
  },
  {
    id: "fulfillment-api",
    name: "fulfillment-api",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Operations Services",
    description: "Shipment context enrichment and carrier orchestration for order detail views.",
    p95LatencyMs: 174,
    throughputPerMin: 2700,
    errorRatePct: 0.16,
    availabilityPct: 99.93,
    dependencies: ["shipment-cache", "carrier-proxy"],
    incidents: [],
    failingOperations: ["attachTrackingContext"],
  },
  {
    id: "gateway-proxy",
    name: "gateway-proxy",
    tier: "critical",
    environment: "production",
    status: "slow",
    owner: "Payments Platform",
    description: "External processor gateway boundary for authorization, capture, and receipt normalization.",
    p95LatencyMs: 238,
    throughputPerMin: 3000,
    errorRatePct: 0.31,
    availabilityPct: 99.89,
    dependencies: ["payments-vault", "processor-egress"],
    incidents: ["inc-214"],
    failingOperations: ["chargeAuthorization", "retrySafeCapture"],
  },
  {
    id: "feature-store",
    name: "feature-store",
    tier: "core",
    environment: "staging",
    status: "ok",
    owner: "Discovery ML",
    description: "Low-latency feature retrieval layer for recommendation and personalization models.",
    p95LatencyMs: 82,
    throughputPerMin: 9100,
    errorRatePct: 0.03,
    availabilityPct: 99.99,
    dependencies: ["vector-cache"],
    incidents: [],
    failingOperations: ["lookupUserFeatures"],
  },
  {
    id: "session-cache",
    name: "session-cache",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Identity Platform",
    description: "Session token cache serving warm-path auth refresh requests.",
    p95LatencyMs: 48,
    throughputPerMin: 41000,
    errorRatePct: 0.02,
    availabilityPct: 99.99,
    dependencies: ["redis-cluster"],
    incidents: [],
    failingOperations: ["fetchRefreshToken"],
  },
  {
    id: "stream-router",
    name: "stream-router",
    tier: "critical",
    environment: "production",
    status: "error",
    owner: "Telemetry Systems",
    description: "Routing layer that maps ingress envelopes onto the right Kafka partitions and topics.",
    p95LatencyMs: 281,
    throughputPerMin: 31000,
    errorRatePct: 0.54,
    availabilityPct: 99.78,
    dependencies: ["kafka-main", "registry-api"],
    incidents: ["inc-209"],
    failingOperations: ["enqueueTopicPartition", "retryProducerBatch"],
  },
  {
    id: "cart-api",
    name: "cart-api",
    tier: "critical",
    environment: "production",
    status: "slow",
    owner: "Commerce Core",
    description: "Cart mutation and hydration layer for pricing, inventory, and promotion context.",
    p95LatencyMs: 164,
    throughputPerMin: 5600,
    errorRatePct: 0.18,
    availabilityPct: 99.92,
    dependencies: ["pricing-engine", "inventory-api"],
    incidents: ["inc-191"],
    failingOperations: ["addItem", "hydratePromotionState"],
  },
  {
    id: "pricing-engine",
    name: "pricing-engine",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Commerce Core",
    description: "Promotion rule evaluation and price calculation engine for cart and catalog flows.",
    p95LatencyMs: 149,
    throughputPerMin: 6200,
    errorRatePct: 0.11,
    availabilityPct: 99.95,
    dependencies: ["config-bus", "rule-store"],
    incidents: ["inc-191"],
    failingOperations: ["resolvePricingRules", "broadcastPriceRule"],
  },
  {
    id: "search-api",
    name: "search-api",
    tier: "core",
    environment: "production",
    status: "slow",
    owner: "Discovery Search",
    description: "Query orchestration, result assembly, and facet presentation for search surfaces.",
    p95LatencyMs: 172,
    throughputPerMin: 12300,
    errorRatePct: 0.08,
    availabilityPct: 99.94,
    dependencies: ["search-index", "personalization-edge"],
    incidents: ["inc-198"],
    failingOperations: ["querySearch", "assembleFacets"],
  },
  {
    id: "search-index",
    name: "search-index",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Discovery Search",
    description: "Index read path and facet aggregation engine backing search queries.",
    p95LatencyMs: 131,
    throughputPerMin: 14800,
    errorRatePct: 0.06,
    availabilityPct: 99.96,
    dependencies: ["segment-store"],
    incidents: ["inc-198"],
    failingOperations: ["facetAggregation", "termExpansion"],
  },
  {
    id: "invoice-worker",
    name: "invoice-worker",
    tier: "core",
    environment: "staging",
    status: "error",
    owner: "Backoffice Billing",
    description: "Asynchronous invoice finalization and document generation orchestration.",
    p95LatencyMs: 411,
    throughputPerMin: 420,
    errorRatePct: 0.69,
    availabilityPct: 99.58,
    dependencies: ["document-renderer", "storage-signing"],
    incidents: ["inc-203"],
    failingOperations: ["runFinalizer", "retryInvoiceTemplate"],
  },
  {
    id: "document-renderer",
    name: "document-renderer",
    tier: "core",
    environment: "staging",
    status: "slow",
    owner: "Backoffice Billing",
    description: "PDF and rich document rendering workers used by invoice pipelines.",
    p95LatencyMs: 441,
    throughputPerMin: 390,
    errorRatePct: 0.51,
    availabilityPct: 99.64,
    dependencies: ["font-cache", "render-queue"],
    incidents: ["inc-203"],
    failingOperations: ["compilePdfTemplate"],
  },
  {
    id: "identity-api",
    name: "identity-api",
    tier: "critical",
    environment: "production",
    status: "ok",
    owner: "Identity Platform",
    description: "Authentication flows, token issuance, and session lifecycle APIs.",
    p95LatencyMs: 93,
    throughputPerMin: 7400,
    errorRatePct: 0.05,
    availabilityPct: 99.98,
    dependencies: ["session-signer", "revocation-cache"],
    incidents: [],
    failingOperations: ["issueOAuthToken", "revokeSession"],
  },
  {
    id: "session-signer",
    name: "session-signer",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Identity Platform",
    description: "Fast-path signer for session tokens and auth material.",
    p95LatencyMs: 34,
    throughputPerMin: 8000,
    errorRatePct: 0.01,
    availabilityPct: 99.99,
    dependencies: ["key-material-store"],
    incidents: [],
    failingOperations: ["signSessionEnvelope"],
  },
  {
    id: "inventory-api",
    name: "inventory-api",
    tier: "core",
    environment: "production",
    status: "slow",
    owner: "Commerce Core",
    description: "Reservation and inventory confirmation service for checkout and cart flows.",
    p95LatencyMs: 186,
    throughputPerMin: 4300,
    errorRatePct: 0.14,
    availabilityPct: 99.93,
    dependencies: ["stock-ledger"],
    incidents: [],
    failingOperations: ["reserveInventory", "confirmStockLevels"],
  },
  {
    id: "stock-ledger",
    name: "stock-ledger",
    tier: "core",
    environment: "development",
    status: "slow",
    owner: "Commerce Core",
    description: "Synthetic development ledger for stock-shard locking and reservation testing.",
    p95LatencyMs: 278,
    throughputPerMin: 980,
    errorRatePct: 0.12,
    availabilityPct: 99.9,
    dependencies: ["dev-postgres"],
    incidents: [],
    failingOperations: ["acquireShardLock"],
  },
  {
    id: "profile-api",
    name: "profile-api",
    tier: "edge",
    environment: "production",
    status: "ok",
    owner: "Identity Graph",
    description: "Profile assembly and snapshot reads for account-facing experiences.",
    p95LatencyMs: 117,
    throughputPerMin: 5100,
    errorRatePct: 0.03,
    availabilityPct: 99.98,
    dependencies: ["graph-store"],
    incidents: [],
    failingOperations: ["readProfileSnapshot"],
  },
  {
    id: "graph-store",
    name: "graph-store",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Identity Graph",
    description: "Graph-backed storage for identity, relationship, and profile fan-out queries.",
    p95LatencyMs: 64,
    throughputPerMin: 7200,
    errorRatePct: 0.02,
    availabilityPct: 99.99,
    dependencies: ["graph-cache"],
    incidents: [],
    failingOperations: ["fetchIdentityGraph"],
  },
  {
    id: "config-bus",
    name: "config-bus",
    tier: "core",
    environment: "staging",
    status: "slow",
    owner: "Commerce Core",
    description: "Configuration propagation bus for staging pricing and rules consumers.",
    p95LatencyMs: 88,
    throughputPerMin: 620,
    errorRatePct: 0.08,
    availabilityPct: 99.95,
    dependencies: ["staging-consumer-a", "staging-consumer-b"],
    incidents: [],
    failingOperations: ["broadcastRulePropagation"],
  },
  {
    id: "revocation-cache",
    name: "revocation-cache",
    tier: "core",
    environment: "production",
    status: "ok",
    owner: "Identity Platform",
    description: "Low-latency revocation cache for session invalidation and auth checks.",
    p95LatencyMs: 31,
    throughputPerMin: 7000,
    errorRatePct: 0.01,
    availabilityPct: 99.99,
    dependencies: ["redis-cluster"],
    incidents: [],
    failingOperations: ["invalidateRevocationEntry"],
  },
];

function wait(duration = 140) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

function formatThroughput(value: number) {
  return `${formatCompactNumber(value)} rpm`;
}

function createMetricSeries(seed: ServiceSeed, index: number): ServiceMetricPoint[] {
  return Array.from({ length: 12 }, (_, pointIndex) => {
    const wave = ((pointIndex + 1) * (index + 2)) % 7;
    const drift = (wave - 3) / 10;
    const latencyMs = Math.max(18, Math.round(seed.p95LatencyMs * (1 + drift * 0.18)));
    const throughputPerMin = Math.max(
      40,
      Math.round(seed.throughputPerMin * (1 + drift * 0.12)),
    );
    const errorRatePct = Math.max(
      0.01,
      Number((seed.errorRatePct * (1 + drift * 0.22)).toFixed(2)),
    );

    return {
      timestamp: `${String(pointIndex * 5).padStart(2, "0")}m`,
      latencyMs,
      throughputPerMin,
      errorRatePct,
    };
  });
}

function createOperations(seed: ServiceSeed): ServiceOperationStat[] {
  return seed.failingOperations.map((operation, index) => ({
    name: operation,
    latencyMs: Math.round(seed.p95LatencyMs * (1.15 + index * 0.14)),
    requestsPerMin: Math.max(24, Math.round(seed.throughputPerMin / (index + 2.4))),
    errorRatePct: Number((seed.errorRatePct * (1.2 + index * 0.25)).toFixed(2)),
    status: index === 0 && seed.status !== "ok" ? seed.status : seed.status === "error" ? "slow" : "ok",
  }));
}

function toServiceRecord(seed: ServiceSeed): ServiceRecord {
  return {
    id: seed.id,
    name: seed.name,
    tier: seed.tier,
    environment: seed.environment,
    status: seed.status,
    description: seed.description,
    owner: seed.owner,
    latency: `${formatDuration(seed.p95LatencyMs)} p95`,
    throughput: formatThroughput(seed.throughputPerMin),
    errorRate: formatPercentage(seed.errorRatePct),
    availability: formatPercentage(seed.availabilityPct, 2),
    p95LatencyMs: seed.p95LatencyMs,
    throughputPerMin: seed.throughputPerMin,
    errorRatePct: seed.errorRatePct,
    dependencies: seed.dependencies,
    incidents: seed.incidents,
    failingOperations: seed.failingOperations,
  };
}

export const serviceRecords: ServiceRecord[] = serviceSeeds.map(toServiceRecord);

const serviceDetails = new Map(
  serviceSeeds.map((seed, index) => {
    const record = toServiceRecord(seed);
    const dependents = serviceSeeds
      .filter((candidate) => candidate.dependencies.includes(seed.id))
      .map((candidate) => candidate.name);
    const recentIncidents = seed.incidents
      .map((incidentId) => incidentRecords.find((incident) => incident.id === incidentId))
      .filter((incident): incident is NonNullable<typeof incident> => Boolean(incident));

    const detail: ServiceDetailData = {
      ...record,
      dependents,
      recentIncidents,
      metricSeries: createMetricSeries(seed, index),
      topOperations: createOperations(seed),
    };

    return [seed.id, detail] as const;
  }),
);

export async function getServicesShellData(): Promise<ServicesShellData> {
  await wait();
  return {
    services: serviceRecords,
  };
}

export async function getServiceDetail(serviceId: string): Promise<ServiceDetailData | null> {
  await wait(120);
  return serviceDetails.get(serviceId) ?? null;
}
