import type { LogRecord, LogsExplorerFilters } from "@/types/pulsescope";

export function filterLogs(logs: LogRecord[], filters: LogsExplorerFilters) {
  const search = filters.search.trim().toLowerCase();

  return logs.filter((log) => {
    const matchesLevel = filters.level === "all" || log.level === filters.level;
    const matchesService = filters.service === "all" || log.service === filters.service;
    const matchesEnvironment =
      filters.environment === "all" || log.environment === filters.environment;
    const matchesSearch =
      search.length === 0 ||
      log.message.toLowerCase().includes(search) ||
      log.service.toLowerCase().includes(search) ||
      log.traceId?.toLowerCase().includes(search) ||
      log.fields.some(
        (field) =>
          field.key.toLowerCase().includes(search) || field.value.toLowerCase().includes(search),
      );

    return matchesLevel && matchesService && matchesEnvironment && matchesSearch;
  });
}
