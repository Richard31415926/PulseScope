import type { ReadonlyURLSearchParams } from "next/navigation";
import type {
  HttpMethod,
  TraceDurationRange,
  TracesExplorerFilters,
  TraceSortDirection,
  TraceSortKey,
  TraceStatus,
} from "@/types/pulsescope";

const validStatuses = new Set<TraceStatus | "all">(["all", "ok", "slow", "error"]);
const validMethods = new Set<HttpMethod | "all">([
  "all",
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);
const validDurations = new Set<TraceDurationRange>([
  "all",
  "under-200",
  "200-500",
  "500-1000",
  "1000-plus",
]);
const validSortKeys = new Set<TraceSortKey>([
  "startedAt",
  "durationMs",
  "service",
  "spanCount",
  "status",
]);
const validSortDirections = new Set<TraceSortDirection>(["asc", "desc"]);

export const defaultTraceFilters: TracesExplorerFilters = {
  search: "",
  status: "all",
  service: "all",
  region: "all",
  method: "all",
  duration: "all",
  sortKey: "startedAt",
  sortDirection: "desc",
};

function readValue(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  key: string,
) {
  return searchParams.get(key);
}

export function getTraceFiltersFromSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): TracesExplorerFilters {
  const status = readValue(searchParams, "status");
  const method = readValue(searchParams, "method");
  const duration = readValue(searchParams, "duration");
  const sortKey = readValue(searchParams, "sort");
  const sortDirection = readValue(searchParams, "dir");

  return {
    search: readValue(searchParams, "q") ?? defaultTraceFilters.search,
    status: validStatuses.has((status ?? "all") as TraceStatus | "all")
      ? ((status ?? "all") as TraceStatus | "all")
      : defaultTraceFilters.status,
    service: readValue(searchParams, "service") ?? defaultTraceFilters.service,
    region: readValue(searchParams, "region") ?? defaultTraceFilters.region,
    method: validMethods.has((method ?? "all") as HttpMethod | "all")
      ? ((method ?? "all") as HttpMethod | "all")
      : defaultTraceFilters.method,
    duration: validDurations.has((duration ?? "all") as TraceDurationRange)
      ? ((duration ?? "all") as TraceDurationRange)
      : defaultTraceFilters.duration,
    sortKey: validSortKeys.has((sortKey ?? "startedAt") as TraceSortKey)
      ? ((sortKey ?? "startedAt") as TraceSortKey)
      : defaultTraceFilters.sortKey,
    sortDirection: validSortDirections.has((sortDirection ?? "desc") as TraceSortDirection)
      ? ((sortDirection ?? "desc") as TraceSortDirection)
      : defaultTraceFilters.sortDirection,
  };
}

export function buildTraceSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Partial<TracesExplorerFilters>,
) {
  const next = new URLSearchParams(searchParams.toString());
  const resolved = {
    ...getTraceFiltersFromSearchParams(searchParams),
    ...updates,
  };

  const mappings: Array<[keyof TracesExplorerFilters, string]> = [
    ["search", "q"],
    ["status", "status"],
    ["service", "service"],
    ["region", "region"],
    ["method", "method"],
    ["duration", "duration"],
    ["sortKey", "sort"],
    ["sortDirection", "dir"],
  ];

  mappings.forEach(([stateKey, queryKey]) => {
    const value = resolved[stateKey];
    const defaultValue = defaultTraceFilters[stateKey];
    const normalized = typeof value === "string" ? value : "";

    if (!normalized || normalized === defaultValue) {
      next.delete(queryKey);
    } else {
      next.set(queryKey, normalized);
    }
  });

  return next.toString();
}

export function getTraceFilterKey(filters: TracesExplorerFilters) {
  return JSON.stringify(filters);
}
