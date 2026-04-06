import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Environment, LogLevel, LogsExplorerFilters } from "@/types/pulsescope";

interface LogsUrlState {
  expandedLogId: string | null;
  filters: LogsExplorerFilters;
  liveMode: boolean;
}

const validLevels = new Set<LogLevel | "all">(["all", "fatal", "error", "warn", "info", "debug"]);
const validEnvironments = new Set<Environment | "all">([
  "all",
  "production",
  "staging",
  "development",
]);

export const defaultLogsUrlState: LogsUrlState = {
  expandedLogId: null,
  filters: {
    search: "",
    level: "all",
    service: "all",
    environment: "all",
  },
  liveMode: false,
};

function readValue(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  key: string,
) {
  return searchParams.get(key);
}

export function getLogsUrlState(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): LogsUrlState {
  const level = readValue(searchParams, "level");
  const environment = readValue(searchParams, "logEnv");

  return {
    expandedLogId: readValue(searchParams, "log"),
    filters: {
      search: readValue(searchParams, "q") ?? defaultLogsUrlState.filters.search,
      level: validLevels.has((level ?? "all") as LogLevel | "all")
        ? ((level ?? "all") as LogLevel | "all")
        : defaultLogsUrlState.filters.level,
      service: readValue(searchParams, "logService") ?? defaultLogsUrlState.filters.service,
      environment: validEnvironments.has((environment ?? "all") as Environment | "all")
        ? ((environment ?? "all") as Environment | "all")
        : defaultLogsUrlState.filters.environment,
    },
    liveMode: readValue(searchParams, "live") === "1",
  };
}

export function buildLogsSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Partial<LogsUrlState>,
) {
  const next = new URLSearchParams(searchParams.toString());
  const current = getLogsUrlState(searchParams);
  const resolved: LogsUrlState = {
    ...current,
    ...updates,
    filters: {
      ...current.filters,
      ...(updates.filters ?? {}),
    },
  };

  setParam(next, "q", resolved.filters.search, defaultLogsUrlState.filters.search);
  setParam(next, "level", resolved.filters.level, defaultLogsUrlState.filters.level);
  setParam(next, "logService", resolved.filters.service, defaultLogsUrlState.filters.service);
  setParam(next, "logEnv", resolved.filters.environment, defaultLogsUrlState.filters.environment);
  setParam(next, "log", resolved.expandedLogId, null);

  if (!resolved.liveMode) {
    next.delete("live");
  } else {
    next.set("live", "1");
  }

  return next.toString();
}

function setParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | null,
  defaultValue: string | null,
) {
  if (!value || value === defaultValue) {
    searchParams.delete(key);
    return;
  }

  searchParams.set(key, value);
}
