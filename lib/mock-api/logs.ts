import type {
  Environment,
  LogField,
  LogLevel,
  LogRecord,
  LogsShellData,
} from "@/types/pulsescope";

type LogTemplate = {
  service: string;
  environment: Environment;
  level: LogLevel;
  message: string;
  traceId?: string;
  fields: Array<[string, string]>;
};

const baseTime = Date.UTC(2026, 3, 6, 22, 54, 15, 201);

const traceIds = [
  "trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H",
  "trc_01J9AE8B3WFQY8T02Z8MBJVRFG",
  "trc_01J9AE8NCW2P3WJNKDC1V41VW5",
  "trc_01J9AE9C5DZZKFHNHQMHVJB4XF",
  "trc_01J9AEA1K0R4V3M6F2PQ1VFHD6",
  "trc_01J9AEAWH9F8B4V71HMAQ6TQKQ",
  "trc_01J9AEB6XX2HM89KFK4CSPG2M1",
  "trc_01J9AEBST0QEWVFSP4CGNX6RY2",
  "trc_01J9AECJ6Z6T5AAZP3TFGFMMH4",
  "trc_01J9AED3F1D5D91YCJGEPT27X5",
];

const templates: LogTemplate[] = [
  {
    service: "checkout-api",
    environment: "production",
    level: "error",
    message: "payment confirmation exceeded latency budget while awaiting ledger commit",
    traceId: "trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H",
    fields: [["region", "eu-west-1"], ["customerSegment", "enterprise"]],
  },
  {
    service: "postgres-writer",
    environment: "production",
    level: "warn",
    message: "ledger writer lock queue exceeded the mitigation threshold",
    traceId: "trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H",
    fields: [["lockQueueDepth", "18"], ["shard", "ledger-eu-3"]],
  },
  {
    service: "order-orchestrator",
    environment: "production",
    level: "info",
    message: "trace sample retained for latency analysis",
    traceId: "trc_01J9AE8B3WFQY8T02Z8MBJVRFG",
    fields: [["samplingRate", "0.25"], ["reason", "slow-path"]],
  },
  {
    service: "fulfillment-api",
    environment: "production",
    level: "warn",
    message: "shipment enrichment missed warm cache and fell back to carrier metadata fetch",
    traceId: "trc_01J9AE8B3WFQY8T02Z8MBJVRFG",
    fields: [["cacheHit", "false"], ["carrier", "ups"]],
  },
  {
    service: "gateway-proxy",
    environment: "production",
    level: "info",
    message: "auth charge request entered retry-safe window after external processor delay",
    traceId: "trc_01J9AE8NCW2P3WJNKDC1V41VW5",
    fields: [["processor", "stripe-eu"], ["retrySafe", "true"]],
  },
  {
    service: "recommendation-engine",
    environment: "staging",
    level: "debug",
    message: "cache warm read completed under steady-state threshold",
    traceId: "trc_01J9AE9C5DZZKFHNHQMHVJB4XF",
    fields: [["featureSet", "feed-v6"], ["cacheHit", "true"]],
  },
  {
    service: "edge-gateway",
    environment: "production",
    level: "info",
    message: "session refresh completed from regional cache with no token fan-out",
    traceId: "trc_01J9AEA1K0R4V3M6F2PQ1VFHD6",
    fields: [["path", "refresh"], ["cacheState", "warm"]],
  },
  {
    service: "stream-router",
    environment: "production",
    level: "fatal",
    message: "kafka producer backpressure forced ingest retry exhaustion",
    traceId: "trc_01J9AEAWH9F8B4V71HMAQ6TQKQ",
    fields: [["retries", "5"], ["topic", "events.main"]],
  },
  {
    service: "event-ingest",
    environment: "production",
    level: "warn",
    message: "consumer lag above target for shard group-14",
    traceId: "trc_01J9AEAWH9F8B4V71HMAQ6TQKQ",
    fields: [["lagSeconds", "94"], ["partition", "14"]],
  },
  {
    service: "pricing-engine",
    environment: "production",
    level: "warn",
    message: "promotion rule fan-out expanded due to flash-sale override stack",
    traceId: "trc_01J9AEB6XX2HM89KFK4CSPG2M1",
    fields: [["ruleCount", "27"], ["campaign", "spring-launch"]],
  },
  {
    service: "search-api",
    environment: "production",
    level: "info",
    message: "broad category query triggered facet aggregation fallback on a cold segment",
    traceId: "trc_01J9AEBST0QEWVFSP4CGNX6RY2",
    fields: [["facetCount", "19"], ["segment", "cold-7"]],
  },
  {
    service: "document-renderer",
    environment: "staging",
    level: "error",
    message: "renderer worker exceeded memory ceiling while compiling invoice template",
    traceId: "trc_01J9AECJ6Z6T5AAZP3TFGFMMH4",
    fields: [["memoryMb", "1642"], ["template", "invoice-v12"]],
  },
  {
    service: "identity-api",
    environment: "production",
    level: "info",
    message: "oauth exchange issued a token from warm signing material",
    traceId: "trc_01J9AED3F1D5D91YCJGEPT27X5",
    fields: [["signer", "session-signer"], ["keyState", "warm"]],
  },
  {
    service: "inventory-api",
    environment: "development",
    level: "warn",
    message: "inventory reservation hit local shard contention during synthetic test load",
    fields: [["lockOwner", "dev-runner"], ["contention", "high"]],
  },
  {
    service: "profile-api",
    environment: "production",
    level: "debug",
    message: "profile snapshot fan-out resolved from graph-store without retry pressure",
    fields: [["graphEdges", "41"], ["cacheState", "warm"]],
  },
  {
    service: "config-bus",
    environment: "staging",
    level: "info",
    message: "rule propagation broadcast received both downstream acknowledgements",
    fields: [["ackCount", "2"], ["channel", "pricing.rules"]],
  },
];

const messageSuffixes = [
  "after the first retry window",
  "while pressure remained within the current incident scope",
  "before the adaptive sampler lowered capture volume",
  "after a regional canary finished draining",
  "while downstream saturation was still elevated",
  "before the mitigation guardrail completed evaluation",
];

const regions = ["eu-west-1", "us-east-1", "us-west-2", "ap-southeast-2"];

function wait(duration = 150) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

function formatTimestamp(timestampMs: number) {
  const date = new Date(timestampMs);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function buildFields(template: LogTemplate, index: number): LogField[] {
  const requestId = `req_${String(4100 + index).padStart(6, "0")}`;
  const host = `${template.service}-${(index % 9) + 1}`;
  const region = regions[index % regions.length];

  return [
    ...template.fields.map(([key, value]) => ({ key, value })),
    { key: "requestId", value: requestId },
    { key: "host", value: host },
    { key: "region", value: region },
  ];
}

function buildMessage(template: LogTemplate, index: number) {
  return `${template.message} ${messageSuffixes[index % messageSuffixes.length]}`;
}

function buildTraceId(template: LogTemplate, index: number) {
  if (template.traceId) {
    return template.traceId;
  }

  return index % 4 === 0 ? traceIds[index % traceIds.length] : undefined;
}

function buildGeneratedLogs() {
  return Array.from({ length: 2400 }, (_, index) => {
    const template = templates[index % templates.length];
    const timestampMs = baseTime - index * 3_600 - (index % 7) * 83;

    return {
      id: `log-${index + 1}`,
      level: template.level,
      message: buildMessage(template, index),
      service: template.service,
      environment: template.environment,
      timestamp: formatTimestamp(timestampMs),
      traceId: buildTraceId(template, index),
      fields: buildFields(template, index),
    } satisfies LogRecord;
  });
}

const logs = buildGeneratedLogs();
const services = Array.from(new Set(logs.map((log) => log.service))).sort();
const environments = Array.from(
  new Set(logs.map((log) => log.environment)),
).sort() as Environment[];

export async function getLogsShellData(): Promise<LogsShellData> {
  await wait();

  return {
    logs,
    services,
    environments,
    totalCount: logs.length,
    traceLinkedCount: logs.filter((log) => Boolean(log.traceId)).length,
    errorLikeCount: logs.filter((log) => log.level === "fatal" || log.level === "error").length,
  };
}

export async function getLogsByTraceId(traceId: string): Promise<LogRecord[]> {
  await wait(120);
  return logs.filter((log) => log.traceId === traceId).slice(0, 8);
}

export function createLiveLogEntry(sequence: number): LogRecord {
  const template = templates[(sequence * 3) % templates.length];

  return {
    id: `live-${sequence}-${Date.now()}`,
    level: sequence % 5 === 0 ? "warn" : sequence % 9 === 0 ? "error" : "info",
    message: `${template.service} emitted a live tail event while the stream simulator was active`,
    service: template.service,
    environment: template.environment,
    timestamp: formatTimestamp(Date.now()),
    traceId: sequence % 2 === 0 ? traceIds[sequence % traceIds.length] : undefined,
    fields: [
      { key: "mode", value: "live" },
      { key: "sampler", value: "tail" },
      { key: "sequence", value: `${sequence}` },
      { key: "region", value: regions[sequence % regions.length] },
    ],
  };
}
