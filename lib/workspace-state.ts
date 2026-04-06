import type { Route } from "next";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { CompareRange, Environment, SavedView, TimeRange } from "@/types/pulsescope";

export interface WorkspaceSearchState {
  compareMode: boolean;
  compareRange: CompareRange;
  environment: Environment;
  savedView: SavedView;
  timeRange: TimeRange;
}

export const defaultWorkspaceSearchState: WorkspaceSearchState = {
  compareMode: false,
  compareRange: "previous-period",
  environment: "production",
  savedView: "default",
  timeRange: "1h",
};

const validEnvironments = new Set<Environment>(["production", "staging", "development"]);
const validTimeRanges = new Set<TimeRange>(["15m", "1h", "6h", "24h", "7d"]);
const validSavedViews = new Set<SavedView>(["default", "handoff", "latency-war-room"]);
const validCompareRanges = new Set<CompareRange>([
  "previous-period",
  "previous-day",
  "same-day-last-week",
  "deploy-baseline",
]);

function readValue(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  key: string,
) {
  return searchParams.get(key);
}

export function getWorkspaceStateFromSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): WorkspaceSearchState {
  const environment = readValue(searchParams, "env");
  const timeRange = readValue(searchParams, "range");
  const savedView = readValue(searchParams, "view");
  const compareRange = readValue(searchParams, "cmpRange");
  const compareMode = readValue(searchParams, "compare");

  return {
    compareMode: compareMode === "1",
    compareRange: validCompareRanges.has((compareRange ?? "previous-period") as CompareRange)
      ? ((compareRange ?? "previous-period") as CompareRange)
      : defaultWorkspaceSearchState.compareRange,
    environment: validEnvironments.has((environment ?? "production") as Environment)
      ? ((environment ?? "production") as Environment)
      : defaultWorkspaceSearchState.environment,
    savedView: validSavedViews.has((savedView ?? "default") as SavedView)
      ? ((savedView ?? "default") as SavedView)
      : defaultWorkspaceSearchState.savedView,
    timeRange: validTimeRanges.has((timeRange ?? "1h") as TimeRange)
      ? ((timeRange ?? "1h") as TimeRange)
      : defaultWorkspaceSearchState.timeRange,
  };
}

export function buildWorkspaceSearchParams(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  updates: Partial<WorkspaceSearchState>,
) {
  const next = new URLSearchParams(searchParams.toString());
  const resolved = {
    ...getWorkspaceStateFromSearchParams(searchParams),
    ...updates,
  };

  setParam(next, "env", resolved.environment, defaultWorkspaceSearchState.environment);
  setParam(next, "range", resolved.timeRange, defaultWorkspaceSearchState.timeRange);
  setParam(next, "view", resolved.savedView, defaultWorkspaceSearchState.savedView);
  setParam(next, "cmpRange", resolved.compareRange, defaultWorkspaceSearchState.compareRange);

  if (!resolved.compareMode) {
    next.delete("compare");
  } else {
    next.set("compare", "1");
  }

  return next.toString();
}

export function getWorkspaceStateFromLocation(search: string) {
  return getWorkspaceStateFromSearchParams(new URLSearchParams(search));
}

export function buildWorkspaceHref(
  pathname: string,
  workspace: Partial<WorkspaceSearchState>,
  extraSearchParams?: Record<string, string | null | undefined>,
): Route {
  const next = new URLSearchParams();
  const resolved = {
    ...defaultWorkspaceSearchState,
    ...workspace,
  };

  setParam(next, "env", resolved.environment, defaultWorkspaceSearchState.environment);
  setParam(next, "range", resolved.timeRange, defaultWorkspaceSearchState.timeRange);
  setParam(next, "view", resolved.savedView, defaultWorkspaceSearchState.savedView);
  setParam(next, "cmpRange", resolved.compareRange, defaultWorkspaceSearchState.compareRange);

  if (resolved.compareMode) {
    next.set("compare", "1");
  }

  Object.entries(extraSearchParams ?? {}).forEach(([key, value]) => {
    if (!value) {
      next.delete(key);
      return;
    }

    next.set(key, value);
  });

  const query = next.toString();
  return (query ? `${pathname}?${query}` : pathname) as Route;
}

function setParam(
  searchParams: URLSearchParams,
  key: string,
  value: string,
  defaultValue: string,
) {
  if (!value || value === defaultValue) {
    searchParams.delete(key);
    return;
  }

  searchParams.set(key, value);
}
