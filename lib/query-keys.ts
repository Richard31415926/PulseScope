export const queryKeys = {
  overview: (environment: string, timeRange: string, mockState: string) =>
    ["overview-shell", environment, timeRange, mockState] as const,
  traces: (filterKey: string) => ["traces-shell", filterKey] as const,
  traceDetail: (traceId: string) => ["trace-detail", traceId] as const,
  traceLogs: (traceId: string) => ["trace-logs", traceId] as const,
  logs: () => ["logs-shell"] as const,
  services: () => ["services-shell"] as const,
  serviceDetail: (serviceId: string) => ["service-detail", serviceId] as const,
  incidents: () => ["incidents-shell"] as const,
};
