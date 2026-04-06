import { getLogsByTraceId } from "@/lib/mock-api/logs";
import type {
  Environment,
  LogRecord,
  TraceDetail,
  TraceDurationRange,
  TraceSortDirection,
  TraceSortKey,
  TracesExplorerFilters,
  TracesShellData,
  TraceSpan,
  TraceSpanKind,
  TraceStatus,
} from "@/types/pulsescope";

type TraceSpanSeed = Pick<
  TraceSpan,
  "id" | "name" | "service" | "durationMs" | "offsetMs" | "status"
>;

type TraceSeed = Omit<TraceDetail, "spans"> & {
  spans: TraceSpanSeed[];
};

const traceSeedDetails: TraceSeed[] = [
  {
    id: "trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H",
    endpoint: "/api/checkout/confirm",
    service: "checkout-api",
    environment: "production",
    region: "eu-west-1",
    method: "POST",
    status: "error",
    durationMs: 842,
    startedAt: "22:54:14",
    spanCount: 13,
    httpStatus: 504,
    operation: "CheckoutController.confirm",
    correlatedLogs: 9,
    correlationLogCount: 9,
    primarySpan: "LedgerWrite.commit",
    primaryIssue: "Ledger commit stalled behind cross-region write amplification.",
    servicePath: ["edge-gateway", "checkout-api", "billing-core", "postgres-writer"],
    userImpact: "Customers see delayed checkout confirmation and occasional payment retries.",
    databaseTimeMs: 384,
    networkTimeMs: 112,
    rootCause: "A write-heavy ledger shard introduced a lock queue during payment confirmation fan-out.",
    relatedService: "billing-core",
    previewEvents: [
      { id: "evt-1", label: "HTTP", value: "504 upstream", tone: "danger" },
      { id: "evt-2", label: "DB", value: "384ms lock wait", tone: "warning" },
      { id: "evt-3", label: "Logs", value: "9 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-1", name: "HTTP POST /checkout/confirm", service: "edge-gateway", durationMs: 842, offsetMs: 0, status: "error" },
      { id: "sp-2", name: "RequestBody.decode", service: "edge-gateway", durationMs: 38, offsetMs: 6, status: "ok" },
      { id: "sp-3", name: "CheckoutController.confirm", service: "checkout-api", durationMs: 701, offsetMs: 34, status: "error" },
      { id: "sp-4", name: "CartState.read", service: "checkout-api", durationMs: 82, offsetMs: 58, status: "ok" },
      { id: "sp-5", name: "PaymentSession.lookup", service: "billing-core", durationMs: 148, offsetMs: 88, status: "ok" },
      { id: "sp-6", name: "RiskContext.fetch", service: "risk-engine", durationMs: 64, offsetMs: 118, status: "ok" },
      { id: "sp-7", name: "FraudModel.score", service: "risk-engine", durationMs: 97, offsetMs: 129, status: "ok" },
      { id: "sp-8", name: "PricingSnapshot.lookup", service: "checkout-api", durationMs: 52, offsetMs: 214, status: "ok" },
      { id: "sp-9", name: "LedgerWrite.commit", service: "postgres-writer", durationMs: 384, offsetMs: 203, status: "slow" },
      { id: "sp-10", name: "LedgerLock.acquire", service: "postgres-writer", durationMs: 166, offsetMs: 226, status: "slow" },
      { id: "sp-11", name: "InventoryReservation.reserve", service: "inventory-api", durationMs: 121, offsetMs: 256, status: "ok" },
      { id: "sp-12", name: "PaymentConfirmation.publish", service: "billing-core", durationMs: 91, offsetMs: 628, status: "ok" },
      { id: "sp-13", name: "NotificationWebhook.enqueue", service: "stream-router", durationMs: 78, offsetMs: 664, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AE8B3WFQY8T02Z8MBJVRFG",
    endpoint: "/api/orders/:id",
    service: "order-orchestrator",
    environment: "production",
    region: "us-east-1",
    method: "GET",
    status: "slow",
    durationMs: 534,
    startedAt: "22:53:51",
    spanCount: 6,
    httpStatus: 200,
    operation: "OrderResolver.fetch",
    correlatedLogs: 4,
    correlationLogCount: 4,
    primarySpan: "ReadReplica.query",
    primaryIssue: "Replica reads are healthy, but shipment enrichment is adding jitter.",
    servicePath: ["edge-gateway", "order-orchestrator", "postgres-reader", "fulfillment-api"],
    userImpact: "Order detail views feel sluggish during peak traffic bursts.",
    databaseTimeMs: 228,
    networkTimeMs: 74,
    rootCause: "Shipment enrichment fan-out expands when tracking metadata cache misses cluster together.",
    relatedService: "fulfillment-api",
    previewEvents: [
      { id: "evt-4", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-5", label: "Replica", value: "228ms", tone: "warning" },
      { id: "evt-6", label: "Logs", value: "4 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-14", name: "HTTP GET /orders/:id", service: "edge-gateway", durationMs: 534, offsetMs: 0, status: "slow" },
      { id: "sp-15", name: "OrderResolver.fetch", service: "order-orchestrator", durationMs: 478, offsetMs: 23, status: "slow" },
      { id: "sp-16", name: "RequestCache.lookup", service: "order-orchestrator", durationMs: 44, offsetMs: 55, status: "ok" },
      { id: "sp-17", name: "ReadReplica.query", service: "postgres-reader", durationMs: 228, offsetMs: 96, status: "ok" },
      { id: "sp-18", name: "ShipmentEnricher.attach", service: "fulfillment-api", durationMs: 166, offsetMs: 188, status: "ok" },
      { id: "sp-19", name: "CarrierMetadata.fetch", service: "fulfillment-api", durationMs: 74, offsetMs: 241, status: "slow" },
    ],
  },
  {
    id: "trc_01J9AE8NCW2P3WJNKDC1V41VW5",
    endpoint: "/api/payments/authorize",
    service: "billing-core",
    environment: "production",
    region: "eu-west-1",
    method: "POST",
    status: "slow",
    durationMs: 476,
    startedAt: "22:52:37",
    spanCount: 5,
    httpStatus: 200,
    operation: "GatewayAuth.charge",
    correlatedLogs: 6,
    correlationLogCount: 6,
    primarySpan: "GatewayAuth.charge",
    primaryIssue: "External processor authorization is pushing p95 beyond target.",
    servicePath: ["checkout-api", "billing-core", "gateway-proxy", "payments-vault"],
    userImpact: "Payment authorization lingers long enough to risk duplicate retries.",
    databaseTimeMs: 84,
    networkTimeMs: 168,
    rootCause: "A processor-side latency spike caused retry-safe auth calls to serialize.",
    relatedService: "gateway-proxy",
    previewEvents: [
      { id: "evt-7", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-8", label: "Gateway", value: "252ms auth", tone: "warning" },
      { id: "evt-9", label: "Logs", value: "6 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-20", name: "AuthorizeRequest", service: "billing-core", durationMs: 476, offsetMs: 0, status: "slow" },
      { id: "sp-21", name: "VaultToken.fetch", service: "payments-vault", durationMs: 104, offsetMs: 41, status: "ok" },
      { id: "sp-22", name: "IdempotencyLookup", service: "billing-core", durationMs: 58, offsetMs: 74, status: "ok" },
      { id: "sp-23", name: "GatewayAuth.charge", service: "gateway-proxy", durationMs: 252, offsetMs: 126, status: "slow" },
      { id: "sp-24", name: "ProcessorReceipt.normalize", service: "gateway-proxy", durationMs: 61, offsetMs: 326, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AE9C5DZZKFHNHQMHVJB4XF",
    endpoint: "/api/feed/personalized",
    service: "recommendation-engine",
    environment: "staging",
    region: "us-west-2",
    method: "GET",
    status: "ok",
    durationMs: 188,
    startedAt: "22:51:09",
    spanCount: 3,
    httpStatus: 200,
    operation: "FeedRequest",
    correlatedLogs: 2,
    correlationLogCount: 2,
    primarySpan: "FeatureStore.lookup",
    primaryIssue: "Healthy baseline request retained for comparison.",
    servicePath: ["edge-gateway", "recommendation-engine", "feature-store"],
    userImpact: "No visible user impact.",
    databaseTimeMs: 48,
    networkTimeMs: 26,
    rootCause: "Healthy trace sample retained as a known-good reference.",
    relatedService: "feature-store",
    previewEvents: [
      { id: "evt-10", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-11", label: "Cache", value: "warm hits", tone: "positive" },
      { id: "evt-12", label: "Logs", value: "2 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-25", name: "HTTP GET /feed/personalized", service: "edge-gateway", durationMs: 188, offsetMs: 0, status: "ok" },
      { id: "sp-26", name: "FeedRequest", service: "recommendation-engine", durationMs: 154, offsetMs: 17, status: "ok" },
      { id: "sp-27", name: "FeatureStore.lookup", service: "feature-store", durationMs: 72, offsetMs: 33, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AEA1K0R4V3M6F2PQ1VFHD6",
    endpoint: "/api/session/refresh",
    service: "edge-gateway",
    environment: "production",
    region: "ap-southeast-2",
    method: "POST",
    status: "ok",
    durationMs: 143,
    startedAt: "22:50:44",
    spanCount: 3,
    httpStatus: 200,
    operation: "SessionRefresh",
    correlatedLogs: 1,
    correlationLogCount: 1,
    primarySpan: "RedisToken.fetch",
    primaryIssue: "Fast path session refresh operating within steady-state targets.",
    servicePath: ["edge-gateway", "session-cache"],
    userImpact: "No visible user impact.",
    databaseTimeMs: 0,
    networkTimeMs: 18,
    rootCause: "Healthy cache-backed refresh path.",
    relatedService: "session-cache",
    previewEvents: [
      { id: "evt-13", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-14", label: "Redis", value: "48ms", tone: "positive" },
      { id: "evt-15", label: "Logs", value: "1 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-28", name: "HTTP POST /session/refresh", service: "edge-gateway", durationMs: 143, offsetMs: 0, status: "ok" },
      { id: "sp-29", name: "SessionRefresh", service: "edge-gateway", durationMs: 118, offsetMs: 14, status: "ok" },
      { id: "sp-30", name: "RedisToken.fetch", service: "session-cache", durationMs: 48, offsetMs: 22, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AEAWH9F8B4V71HMAQ6TQKQ",
    endpoint: "/internal/ingest/events",
    service: "event-ingest",
    environment: "production",
    region: "us-east-1",
    method: "POST",
    status: "error",
    durationMs: 691,
    startedAt: "22:49:28",
    spanCount: 4,
    httpStatus: 500,
    operation: "EventIngest.handle",
    correlatedLogs: 12,
    correlationLogCount: 12,
    primarySpan: "KafkaPublish.enqueue",
    primaryIssue: "Producer backpressure exhausted retries on a hot shard.",
    servicePath: ["event-ingest", "stream-router", "registry-api"],
    userImpact: "Telemetry events queue up and downstream freshness degrades.",
    databaseTimeMs: 0,
    networkTimeMs: 198,
    rootCause: "Kafka broker saturation in one shard forced backpressure across the ingest path.",
    relatedService: "stream-router",
    previewEvents: [
      { id: "evt-16", label: "HTTP", value: "500 error", tone: "danger" },
      { id: "evt-17", label: "Queue", value: "281ms publish", tone: "warning" },
      { id: "evt-18", label: "Logs", value: "12 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-31", name: "EventIngest.handle", service: "event-ingest", durationMs: 691, offsetMs: 0, status: "error" },
      { id: "sp-32", name: "SchemaRegistry.validate", service: "registry-api", durationMs: 126, offsetMs: 74, status: "ok" },
      { id: "sp-33", name: "KafkaPublish.enqueue", service: "stream-router", durationMs: 281, offsetMs: 109, status: "slow" },
      { id: "sp-34", name: "ProducerRetryWindow", service: "stream-router", durationMs: 104, offsetMs: 338, status: "error" },
    ],
  },
  {
    id: "trc_01J9AEB6XX2HM89KFK4CSPG2M1",
    endpoint: "/api/cart/items",
    service: "cart-api",
    environment: "production",
    region: "us-east-1",
    method: "POST",
    status: "slow",
    durationMs: 392,
    startedAt: "22:48:44",
    spanCount: 4,
    httpStatus: 201,
    operation: "CartMutation.addItem",
    correlatedLogs: 3,
    correlationLogCount: 3,
    primarySpan: "PricingRules.resolve",
    primaryIssue: "Promotion rule evaluation is widening cart mutation latency.",
    servicePath: ["edge-gateway", "cart-api", "pricing-engine", "inventory-api"],
    userImpact: "Cart interactions feel sticky during flash-sale traffic.",
    databaseTimeMs: 76,
    networkTimeMs: 92,
    rootCause: "Promotion resolution fan-out grows with rule-cardinality spikes.",
    relatedService: "pricing-engine",
    previewEvents: [
      { id: "evt-19", label: "HTTP", value: "201 created", tone: "positive" },
      { id: "evt-20", label: "Rules", value: "144ms eval", tone: "warning" },
      { id: "evt-21", label: "Logs", value: "3 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-35", name: "HTTP POST /cart/items", service: "edge-gateway", durationMs: 392, offsetMs: 0, status: "slow" },
      { id: "sp-36", name: "CartMutation.addItem", service: "cart-api", durationMs: 348, offsetMs: 21, status: "slow" },
      { id: "sp-37", name: "PricingRules.resolve", service: "pricing-engine", durationMs: 144, offsetMs: 68, status: "slow" },
      { id: "sp-38", name: "InventoryCheck", service: "inventory-api", durationMs: 118, offsetMs: 182, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AEBST0QEWVFSP4CGNX6RY2",
    endpoint: "/api/search",
    service: "search-api",
    environment: "production",
    region: "us-west-2",
    method: "GET",
    status: "slow",
    durationMs: 448,
    startedAt: "22:47:58",
    spanCount: 4,
    httpStatus: 200,
    operation: "SearchResolver.query",
    correlatedLogs: 5,
    correlationLogCount: 5,
    primarySpan: "FacetAggregation",
    primaryIssue: "Facet aggregation drifts under wide search queries.",
    servicePath: ["edge-gateway", "search-api", "search-index", "personalization-edge"],
    userImpact: "Search responses feel slower on broad category queries.",
    databaseTimeMs: 0,
    networkTimeMs: 104,
    rootCause: "Index fan-out expands with broad category searches and personalization overlays.",
    relatedService: "search-index",
    previewEvents: [
      { id: "evt-22", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-23", label: "Facet", value: "173ms", tone: "warning" },
      { id: "evt-24", label: "Logs", value: "5 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-39", name: "HTTP GET /search", service: "edge-gateway", durationMs: 448, offsetMs: 0, status: "slow" },
      { id: "sp-40", name: "SearchResolver.query", service: "search-api", durationMs: 392, offsetMs: 19, status: "slow" },
      { id: "sp-41", name: "FacetAggregation", service: "search-index", durationMs: 173, offsetMs: 98, status: "slow" },
      { id: "sp-42", name: "PersonalizationScore", service: "personalization-edge", durationMs: 102, offsetMs: 224, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AECJ6Z6T5AAZP3TFGFMMH4",
    endpoint: "/api/invoices/finalize",
    service: "invoice-worker",
    environment: "staging",
    region: "eu-central-1",
    method: "POST",
    status: "error",
    durationMs: 1084,
    startedAt: "22:46:19",
    spanCount: 4,
    httpStatus: 502,
    operation: "InvoiceFinalizer.run",
    correlatedLogs: 8,
    correlationLogCount: 8,
    primarySpan: "PDFRender.compile",
    primaryIssue: "Document compilation overflowed staging worker capacity.",
    servicePath: ["invoice-worker", "document-renderer", "storage-signing"],
    userImpact: "Internal staging invoice runs fail during regression testing.",
    databaseTimeMs: 118,
    networkTimeMs: 144,
    rootCause: "Renderer workers are under-provisioned for high-resolution PDF templates in staging.",
    relatedService: "document-renderer",
    previewEvents: [
      { id: "evt-25", label: "HTTP", value: "502 upstream", tone: "danger" },
      { id: "evt-26", label: "Render", value: "441ms", tone: "warning" },
      { id: "evt-27", label: "Logs", value: "8 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-43", name: "InvoiceFinalizer.run", service: "invoice-worker", durationMs: 1084, offsetMs: 0, status: "error" },
      { id: "sp-44", name: "TemplateHydration", service: "invoice-worker", durationMs: 148, offsetMs: 54, status: "ok" },
      { id: "sp-45", name: "PDFRender.compile", service: "document-renderer", durationMs: 441, offsetMs: 236, status: "slow" },
      { id: "sp-46", name: "SignedUrl.issue", service: "storage-signing", durationMs: 132, offsetMs: 712, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AED3F1D5D91YCJGEPT27X5",
    endpoint: "/api/oauth/exchange",
    service: "identity-api",
    environment: "production",
    region: "eu-west-1",
    method: "POST",
    status: "ok",
    durationMs: 128,
    startedAt: "22:45:12",
    spanCount: 3,
    httpStatus: 200,
    operation: "OAuthExchange.issueToken",
    correlatedLogs: 2,
    correlationLogCount: 2,
    primarySpan: "SessionSigner.sign",
    primaryIssue: "Healthy auth exchange path retained as low-latency reference.",
    servicePath: ["identity-api", "session-signer"],
    userImpact: "No visible user impact.",
    databaseTimeMs: 22,
    networkTimeMs: 18,
    rootCause: "Fast path auth exchange with warm key material.",
    relatedService: "session-signer",
    previewEvents: [
      { id: "evt-28", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-29", label: "Sign", value: "34ms", tone: "positive" },
      { id: "evt-30", label: "Logs", value: "2 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-47", name: "HTTP POST /oauth/exchange", service: "identity-api", durationMs: 128, offsetMs: 0, status: "ok" },
      { id: "sp-48", name: "OAuthExchange.issueToken", service: "identity-api", durationMs: 97, offsetMs: 14, status: "ok" },
      { id: "sp-49", name: "SessionSigner.sign", service: "session-signer", durationMs: 34, offsetMs: 41, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AEDP2TSHQKPX6HMH9A0YP6",
    endpoint: "/api/inventory/reserve",
    service: "inventory-api",
    environment: "development",
    region: "ap-south-1",
    method: "POST",
    status: "slow",
    durationMs: 622,
    startedAt: "22:44:18",
    spanCount: 3,
    httpStatus: 200,
    operation: "InventoryReservation.reserve",
    correlatedLogs: 4,
    correlationLogCount: 4,
    primarySpan: "StockShard.lock",
    primaryIssue: "Local development shard locking remains intentionally noisy.",
    servicePath: ["inventory-api", "stock-ledger"],
    userImpact: "Developer test runs show elevated local reservation latency.",
    databaseTimeMs: 278,
    networkTimeMs: 24,
    rootCause: "Local stock shard lock contention in a synthetic development environment.",
    relatedService: "stock-ledger",
    previewEvents: [
      { id: "evt-31", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-32", label: "Shard", value: "278ms lock", tone: "warning" },
      { id: "evt-33", label: "Logs", value: "4 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-50", name: "InventoryReservation.reserve", service: "inventory-api", durationMs: 622, offsetMs: 0, status: "slow" },
      { id: "sp-51", name: "ReservationState.load", service: "inventory-api", durationMs: 82, offsetMs: 47, status: "ok" },
      { id: "sp-52", name: "StockShard.lock", service: "stock-ledger", durationMs: 278, offsetMs: 166, status: "slow" },
    ],
  },
  {
    id: "trc_01J9AEE9J08EJQKRZ1FVG2ENH7",
    endpoint: "/api/profile/snapshot",
    service: "profile-api",
    environment: "production",
    region: "ap-southeast-2",
    method: "GET",
    status: "ok",
    durationMs: 214,
    startedAt: "22:43:37",
    spanCount: 3,
    httpStatus: 200,
    operation: "ProfileSnapshot.read",
    correlatedLogs: 2,
    correlationLogCount: 2,
    primarySpan: "GraphFanout.fetch",
    primaryIssue: "Healthy profile request with moderate fan-out.",
    servicePath: ["edge-gateway", "profile-api", "graph-store"],
    userImpact: "No visible user impact.",
    databaseTimeMs: 64,
    networkTimeMs: 42,
    rootCause: "Healthy graph fan-out request.",
    relatedService: "graph-store",
    previewEvents: [
      { id: "evt-34", label: "HTTP", value: "200 ok", tone: "positive" },
      { id: "evt-35", label: "Graph", value: "64ms", tone: "positive" },
      { id: "evt-36", label: "Logs", value: "2 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-53", name: "HTTP GET /profile/snapshot", service: "edge-gateway", durationMs: 214, offsetMs: 0, status: "ok" },
      { id: "sp-54", name: "ProfileSnapshot.read", service: "profile-api", durationMs: 178, offsetMs: 18, status: "ok" },
      { id: "sp-55", name: "GraphFanout.fetch", service: "graph-store", durationMs: 64, offsetMs: 79, status: "ok" },
    ],
  },
  {
    id: "trc_01J9AEEYB5WD6SR6BYKQ7M8PH8",
    endpoint: "/api/catalog/price-rule",
    service: "pricing-engine",
    environment: "staging",
    region: "us-east-1",
    method: "PUT",
    status: "slow",
    durationMs: 318,
    startedAt: "22:42:10",
    spanCount: 3,
    httpStatus: 202,
    operation: "PriceRuleMutation.update",
    correlatedLogs: 3,
    correlationLogCount: 3,
    primarySpan: "RulePropagation.broadcast",
    primaryIssue: "Rule propagation adds controlled latency during staging writes.",
    servicePath: ["pricing-engine", "config-bus"],
    userImpact: "Internal configuration writes complete slowly but successfully.",
    databaseTimeMs: 44,
    networkTimeMs: 88,
    rootCause: "Write propagation waits for two downstream staging consumers to ack.",
    relatedService: "config-bus",
    previewEvents: [
      { id: "evt-37", label: "HTTP", value: "202 accepted", tone: "positive" },
      { id: "evt-38", label: "Bus", value: "88ms", tone: "warning" },
      { id: "evt-39", label: "Logs", value: "3 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-56", name: "PriceRuleMutation.update", service: "pricing-engine", durationMs: 318, offsetMs: 0, status: "slow" },
      { id: "sp-57", name: "RuleStore.read", service: "pricing-engine", durationMs: 44, offsetMs: 52, status: "ok" },
      { id: "sp-58", name: "RulePropagation.broadcast", service: "config-bus", durationMs: 88, offsetMs: 136, status: "slow" },
    ],
  },
  {
    id: "trc_01J9AEFG70PAAW8N8X3B3VQ7N9",
    endpoint: "/api/sessions/:id",
    service: "identity-api",
    environment: "production",
    region: "eu-west-1",
    method: "DELETE",
    status: "ok",
    durationMs: 267,
    startedAt: "22:41:02",
    spanCount: 3,
    httpStatus: 204,
    operation: "SessionTermination.revoke",
    correlatedLogs: 2,
    correlationLogCount: 2,
    primarySpan: "RevocationCache.invalidate",
    primaryIssue: "Healthy session termination trace retained for contrast.",
    servicePath: ["identity-api", "revocation-cache"],
    userImpact: "No visible user impact.",
    databaseTimeMs: 18,
    networkTimeMs: 34,
    rootCause: "Healthy revocation path.",
    relatedService: "revocation-cache",
    previewEvents: [
      { id: "evt-40", label: "HTTP", value: "204 no content", tone: "positive" },
      { id: "evt-41", label: "Cache", value: "31ms", tone: "positive" },
      { id: "evt-42", label: "Logs", value: "2 correlated", tone: "neutral" },
    ],
    spans: [
      { id: "sp-59", name: "HTTP DELETE /sessions/:id", service: "identity-api", durationMs: 267, offsetMs: 0, status: "ok" },
      { id: "sp-60", name: "SessionTermination.revoke", service: "identity-api", durationMs: 212, offsetMs: 24, status: "ok" },
      { id: "sp-61", name: "RevocationCache.invalidate", service: "revocation-cache", durationMs: 31, offsetMs: 72, status: "ok" },
    ],
  },
];

function wait(duration = 160) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

function matchesDurationRange(durationMs: number, duration: TraceDurationRange) {
  if (duration === "under-200") {
    return durationMs < 200;
  }

  if (duration === "200-500") {
    return durationMs >= 200 && durationMs < 500;
  }

  if (duration === "500-1000") {
    return durationMs >= 500 && durationMs < 1000;
  }

  if (duration === "1000-plus") {
    return durationMs >= 1000;
  }

  return true;
}

function compareStatus(left: TraceStatus, right: TraceStatus) {
  const order: Record<TraceStatus, number> = {
    error: 0,
    slow: 1,
    ok: 2,
  };

  return order[left] - order[right];
}

function inferSpanKind(span: TraceSpanSeed, endpoint: string): TraceSpanKind {
  const value = `${span.name} ${span.service} ${endpoint}`.toLowerCase();

  if (span.offsetMs === 0 || value.includes("http ")) {
    return "entry";
  }

  if (value.includes("cache") || value.includes("redis")) {
    return "cache";
  }

  if (
    value.includes("kafka") ||
    value.includes("enqueue") ||
    value.includes("publish") ||
    value.includes("broadcast") ||
    value.includes("router")
  ) {
    return "queue";
  }

  if (
    value.includes("query") ||
    value.includes("lookup") ||
    value.includes("read") ||
    value.includes("ledger") ||
    value.includes("graph") ||
    value.includes("replica") ||
    value.includes("lock") ||
    value.includes("store")
  ) {
    return "db";
  }

  if (
    value.includes("gateway") ||
    value.includes("carrier") ||
    value.includes("charge") ||
    value.includes("oauth") ||
    value.includes("sign")
  ) {
    return "external";
  }

  if (
    value.includes("controller") ||
    value.includes("resolver") ||
    value.includes("request") ||
    value.includes("mutation") ||
    value.includes("/api/")
  ) {
    return "http";
  }

  return "compute";
}

function inferSpanTarget(kind: TraceSpanKind, span: TraceSpanSeed, trace: TraceSeed) {
  if (kind === "entry" || kind === "http") {
    return trace.endpoint;
  }

  if (kind === "db") {
    return `${span.service} datastore`;
  }

  if (kind === "cache") {
    return "regional cache cluster";
  }

  if (kind === "queue") {
    return "event transport";
  }

  if (kind === "external") {
    return "upstream dependency";
  }

  return trace.operation;
}

function inferSpanSummary(kind: TraceSpanKind, span: TraceSpanSeed, trace: TraceSeed) {
  if (kind === "entry") {
    return `Ingress request enters the ${trace.region} edge and frames the full end-to-end trace budget.`;
  }

  if (kind === "db") {
    return `${span.service} is spending most of this slice waiting on data access or lock acquisition.`;
  }

  if (kind === "cache") {
    return `${span.service} is resolving the request through a cache-backed fast path.`;
  }

  if (kind === "queue") {
    return `${span.service} is handing work off across an asynchronous transport boundary.`;
  }

  if (kind === "external") {
    return `${span.service} is crossing a dependency boundary where retries and upstream jitter matter most.`;
  }

  if (kind === "http") {
    return `${span.service} owns the request orchestration layer for this endpoint slice.`;
  }

  return `${span.service} is performing internal compute for ${trace.operation}.`;
}

function findParentId(seed: TraceSpanSeed, spans: TraceSpanSeed[]) {
  const seedEnd = seed.offsetMs + seed.durationMs;
  const candidates = spans.filter((candidate) => {
    if (candidate.id === seed.id) {
      return false;
    }

    const candidateEnd = candidate.offsetMs + candidate.durationMs;
    const containsSeed = candidate.offsetMs <= seed.offsetMs && candidateEnd >= seedEnd;
    const isProperParent =
      candidate.offsetMs < seed.offsetMs ||
      candidate.durationMs > seed.durationMs;

    return containsSeed && isProperParent;
  });

  candidates.sort((left, right) => left.durationMs - right.durationMs);
  return candidates[0]?.id ?? null;
}

function buildTraceSpans(trace: TraceSeed) {
  const parentIds = new Map(
    trace.spans.map((span) => [span.id, findParentId(span, trace.spans)]),
  );
  const depthCache = new Map<string, number>();

  function getDepth(spanId: string): number {
    const cached = depthCache.get(spanId);

    if (typeof cached === "number") {
      return cached;
    }

    const parentId = parentIds.get(spanId) ?? null;
    const nextDepth = parentId ? getDepth(parentId) + 1 : 0;
    depthCache.set(spanId, nextDepth);
    return nextDepth;
  }

  return trace.spans
    .map((span) => {
      const parentId = parentIds.get(span.id) ?? null;
      const kind = inferSpanKind(span, trace.endpoint);
      const target = inferSpanTarget(kind, span, trace);
      const childDurationTotal = trace.spans
        .filter((candidate) => parentIds.get(candidate.id) === span.id)
        .reduce((total, candidate) => total + candidate.durationMs, 0);
      const estimatedChildBusyMs = Math.round(childDurationTotal * 0.58);
      const selfTimeMs = Math.max(
        6,
        span.durationMs - Math.min(span.durationMs - 6, estimatedChildBusyMs),
      );
      const host = `${span.service}.${trace.region}.${trace.environment}.svc.cluster.local`;

      return {
        ...span,
        parentId,
        depth: getDepth(span.id),
        kind,
        target,
        summary: inferSpanSummary(kind, span, trace),
        selfTimeMs,
        attributes: [
          { key: "host", value: host },
          { key: "target", value: target },
          { key: "offset", value: `${span.offsetMs}ms` },
          { key: "end", value: `${span.offsetMs + span.durationMs}ms` },
        ],
      };
    })
    .sort((left, right) => {
      if (left.offsetMs !== right.offsetMs) {
        return left.offsetMs - right.offsetMs;
      }

      if (left.depth !== right.depth) {
        return left.depth - right.depth;
      }

      return right.durationMs - left.durationMs;
    });
}

function buildTraceDetail(trace: TraceSeed): TraceDetail {
  const spans = buildTraceSpans(trace);

  return {
    ...trace,
    spanCount: spans.length,
    spans,
  };
}

const traceDetails: TraceDetail[] = traceSeedDetails.map(buildTraceDetail);

function sortTraces(
  traces: TraceDetail[],
  sortKey: TraceSortKey,
  sortDirection: TraceSortDirection,
) {
  const direction = sortDirection === "asc" ? 1 : -1;

  return [...traces].sort((left, right) => {
    if (sortKey === "durationMs") {
      return (left.durationMs - right.durationMs) * direction;
    }

    if (sortKey === "service") {
      return left.service.localeCompare(right.service) * direction;
    }

    if (sortKey === "spanCount") {
      return (left.spanCount - right.spanCount) * direction;
    }

    if (sortKey === "status") {
      return compareStatus(left.status, right.status) * direction;
    }

    return left.startedAt.localeCompare(right.startedAt) * direction;
  });
}

export async function getTracesShellData({
  environment,
  filters,
}: {
  environment: Environment;
  filters: TracesExplorerFilters;
}): Promise<TracesShellData> {
  await wait();

  const search = filters.search.toLowerCase().trim();
  const baseTraces = traceDetails.filter((trace) => trace.environment === environment);

  const filteredTraces = baseTraces.filter((trace) => {
    const matchesSearch =
      search.length === 0 ||
      trace.id.toLowerCase().includes(search) ||
      trace.endpoint.toLowerCase().includes(search) ||
      trace.operation.toLowerCase().includes(search);
    const matchesStatus = filters.status === "all" || trace.status === filters.status;
    const matchesService = filters.service === "all" || trace.service === filters.service;
    const matchesRegion = filters.region === "all" || trace.region === filters.region;
    const matchesMethod = filters.method === "all" || trace.method === filters.method;
    const matchesDuration = matchesDurationRange(trace.durationMs, filters.duration);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesService &&
      matchesRegion &&
      matchesMethod &&
      matchesDuration
    );
  });

  const sortedTraces = sortTraces(filteredTraces, filters.sortKey, filters.sortDirection);
  const averageDurationMs =
    sortedTraces.length > 0
      ? Math.round(
          sortedTraces.reduce((total, trace) => total + trace.durationMs, 0) / sortedTraces.length,
        )
      : 0;

  return {
    traces: sortedTraces,
    matchedCount: sortedTraces.length,
    totalCount: baseTraces.length,
    averageDurationMs,
    slowCount: sortedTraces.filter((trace) => trace.status === "slow").length,
    errorCount: sortedTraces.filter((trace) => trace.status === "error").length,
    services: Array.from(new Set(baseTraces.map((trace) => trace.service))).sort(),
    regions: Array.from(new Set(baseTraces.map((trace) => trace.region))).sort(),
    methods: Array.from(new Set(baseTraces.map((trace) => trace.method))).sort(),
  };
}

export async function getTraceDetail(traceId: string): Promise<TraceDetail | null> {
  await wait();
  return traceDetails.find((trace) => trace.id === traceId) ?? null;
}

export async function getTraceRelatedLogs(traceId: string): Promise<LogRecord[]> {
  return getLogsByTraceId(traceId);
}
