export type Environment = "production" | "staging" | "development";
export type TimeRange = "15m" | "1h" | "6h" | "24h" | "7d";
export type SavedView = "default" | "handoff" | "latency-war-room";
export type CompareRange = "previous-period" | "previous-day" | "same-day-last-week" | "deploy-baseline";
export type TraceStatus = "ok" | "slow" | "error";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "investigating" | "monitoring" | "resolved";
export type ServiceTier = "critical" | "core" | "edge";
export type OverviewMockState = "live" | "empty" | "error";
export type TraceDurationRange = "all" | "under-200" | "200-500" | "500-1000" | "1000-plus";
export type TraceSortKey = "startedAt" | "durationMs" | "service" | "spanCount" | "status";
export type TraceSortDirection = "asc" | "desc";
export type TraceSpanKind = "entry" | "http" | "db" | "cache" | "queue" | "compute" | "external";

export interface MetricSnapshot {
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "negative" | "neutral";
}

export interface AlertPreview {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  age: string;
}

export interface EndpointPreview {
  id: string;
  endpoint: string;
  service: string;
  latency: string;
  change: string;
}

export interface TimelineEntry {
  id: string;
  label: string;
  detail: string;
  at: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  summary: string;
  impactedServices: string[];
  timeline: TimelineEntry[];
  startedAt: string;
  updatedAt: string;
  commander: string;
  responseChannel: string;
  impactStatement: string;
  relatedTraceIds: string[];
}

export interface TraceRecord {
  id: string;
  endpoint: string;
  service: string;
  environment: Environment;
  region: string;
  method: HttpMethod;
  status: TraceStatus;
  durationMs: number;
  startedAt: string;
  spanCount: number;
}

export interface TracePreviewEvent {
  id: string;
  label: string;
  value: string;
  tone: "neutral" | "positive" | "warning" | "danger";
}

export interface TraceExplorerRow extends TraceRecord {
  httpStatus: number;
  operation: string;
  correlatedLogs: number;
  primarySpan: string;
  primaryIssue: string;
  servicePath: string[];
  userImpact: string;
  databaseTimeMs: number;
  networkTimeMs: number;
  previewEvents: TracePreviewEvent[];
}

export interface TraceAttribute {
  key: string;
  value: string;
}

export interface TraceSpan {
  id: string;
  name: string;
  service: string;
  durationMs: number;
  offsetMs: number;
  status: TraceStatus;
  parentId: string | null;
  depth: number;
  kind: TraceSpanKind;
  target: string;
  summary: string;
  selfTimeMs: number;
  attributes: TraceAttribute[];
}

export interface TraceDetail extends TraceExplorerRow {
  correlationLogCount: number;
  spans: TraceSpan[];
  rootCause: string;
  relatedService: string;
}

export interface LogField {
  key: string;
  value: string;
}

export interface LogRecord {
  id: string;
  level: LogLevel;
  message: string;
  service: string;
  environment: Environment;
  timestamp: string;
  traceId?: string;
  fields: LogField[];
}

export interface LogsExplorerFilters {
  search: string;
  level: LogLevel | "all";
  service: string;
  environment: Environment | "all";
}

export interface ServiceRecord {
  id: string;
  name: string;
  tier: ServiceTier;
  environment: Environment;
  status: TraceStatus;
  description: string;
  owner: string;
  latency: string;
  throughput: string;
  errorRate: string;
  availability: string;
  p95LatencyMs: number;
  throughputPerMin: number;
  errorRatePct: number;
  dependencies: string[];
  incidents: string[];
  failingOperations: string[];
}

export interface ServiceMetricPoint {
  timestamp: string;
  latencyMs: number;
  throughputPerMin: number;
  errorRatePct: number;
}

export interface ServiceOperationStat {
  name: string;
  latencyMs: number;
  requestsPerMin: number;
  errorRatePct: number;
  status: TraceStatus;
}

export interface ServiceDetailData extends ServiceRecord {
  dependents: string[];
  recentIncidents: IncidentRecord[];
  metricSeries: ServiceMetricPoint[];
  topOperations: ServiceOperationStat[];
}

export interface OverviewShellData {
  metrics: MetricSnapshot[];
  alerts: AlertPreview[];
  slowEndpoints: EndpointPreview[];
  incidents: IncidentRecord[];
}

export interface OverviewMetricCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "positive" | "negative" | "neutral";
  context: string;
  footnote: string;
  sparkline: number[];
}

export interface OverviewTimelinePoint {
  label: string;
  timestamp: string;
  latencyP95: number;
  latencyP99: number;
  compareLatencyP95: number;
  compareLatencyP99: number;
  throughput: number;
  compareThroughput: number;
  errorRate: number;
  compareErrorRate: number;
  incidentLoad: number;
}

export interface SlowEndpointRow {
  id: string;
  endpoint: string;
  method: HttpMethod;
  service: string;
  region: string;
  latencyMs: number;
  requestsPerMin: number;
  errorRate: number;
  changePct: number;
  status: TraceStatus;
}

export interface OverviewIncidentSummary {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  summary: string;
  impactedServices: string[];
  startedAt: string;
  updatedAt: string;
  commander: string;
}

export interface OverviewDashboardData {
  state: "ready" | "empty";
  generatedAt: string;
  windowLabel: string;
  availability: string;
  trackedServices: number;
  activeAlerts: number;
  metrics: OverviewMetricCard[];
  timeline: OverviewTimelinePoint[];
  slowEndpoints: SlowEndpointRow[];
  incidents: OverviewIncidentSummary[];
}

export interface TracesShellData {
  traces: TraceExplorerRow[];
  matchedCount: number;
  totalCount: number;
  averageDurationMs: number;
  slowCount: number;
  errorCount: number;
  services: string[];
  regions: string[];
  methods: HttpMethod[];
}

export interface TracesExplorerFilters {
  search: string;
  status: TraceStatus | "all";
  service: string;
  region: string;
  method: HttpMethod | "all";
  duration: TraceDurationRange;
  sortKey: TraceSortKey;
  sortDirection: TraceSortDirection;
}

export interface LogsShellData {
  logs: LogRecord[];
  services: string[];
  environments: Environment[];
  totalCount: number;
  traceLinkedCount: number;
  errorLikeCount: number;
}

export interface ServicesShellData {
  services: ServiceRecord[];
}

export interface IncidentsShellData {
  incidents: IncidentRecord[];
}
