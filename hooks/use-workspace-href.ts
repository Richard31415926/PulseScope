"use client";

import type { Route } from "next";
import { buildWorkspaceHref } from "@/lib/workspace-state";
import { useUiStore } from "@/store/ui-store";

export function useWorkspaceHref(
  pathname: string,
  extraSearchParams?: Record<string, string | null | undefined>,
): Route {
  const compareMode = useUiStore((state) => state.compareMode);
  const compareRange = useUiStore((state) => state.activeCompareRange);
  const environment = useUiStore((state) => state.activeEnvironment);
  const savedView = useUiStore((state) => state.activeSavedView);
  const timeRange = useUiStore((state) => state.activeTimeRange);
  return buildWorkspaceHref(
    pathname,
    {
      compareMode,
      compareRange,
      environment,
      savedView,
      timeRange,
    },
    extraSearchParams,
  );
}
