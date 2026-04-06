"use client";

import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { buildSavedViewHref, getSavedViewPreset } from "@/lib/saved-views";
import {
  buildWorkspaceHref,
  buildWorkspaceSearchParams,
  getWorkspaceStateFromLocation,
} from "@/lib/workspace-state";
import { useUiStore } from "@/store/ui-store";
import type { CompareRange, Environment, SavedView, TimeRange } from "@/types/pulsescope";

export function useSyncWorkspaceUrlState() {
  const setWorkspacePreferences = useUiStore((state) => state.setWorkspacePreferences);

  useEffect(() => {
    const syncFromLocation = () => {
      if (typeof window === "undefined") {
        return;
      }

      setWorkspacePreferences(getWorkspaceStateFromLocation(window.location.search));
    };

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);

    return () => {
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, [setWorkspacePreferences]);
}

export function useWorkspaceControls() {
  const router = useRouter();
  const pathname = usePathname();
  const compareMode = useUiStore((state) => state.compareMode);
  const compareRange = useUiStore((state) => state.activeCompareRange);
  const environment = useUiStore((state) => state.activeEnvironment);
  const savedView = useUiStore((state) => state.activeSavedView);
  const timeRange = useUiStore((state) => state.activeTimeRange);
  const setWorkspacePreferences = useUiStore((state) => state.setWorkspacePreferences);

  const workspaceState = useMemo(
    () => ({
      compareMode,
      compareRange,
      environment,
      savedView,
      timeRange,
    }),
    [compareMode, compareRange, environment, savedView, timeRange],
  );

  const replaceWorkspaceState = useCallback(
    (
      updates: Partial<{
        compareMode: boolean;
        compareRange: CompareRange;
        environment: Environment;
        savedView: SavedView;
        timeRange: TimeRange;
      }>,
    ) => {
      if (typeof window === "undefined") {
        return;
      }

      const nextState = {
        ...workspaceState,
        ...updates,
      };
      const nextQuery = buildWorkspaceSearchParams(
        new URLSearchParams(window.location.search),
        nextState,
      );

      setWorkspacePreferences(nextState);
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}` as Route, {
        scroll: false,
      });
    },
    [pathname, router, setWorkspacePreferences, workspaceState],
  );

  const navigateWithWorkspace = useCallback(
    (
      href: string,
      extraSearchParams?: Record<string, string | null | undefined>,
      mode: "push" | "replace" = "push",
    ) => {
      const nextHref = buildWorkspaceHref(href, workspaceState, extraSearchParams) as Route;

      if (mode === "replace") {
        router.replace(nextHref, { scroll: false });
        return;
      }

      router.push(nextHref);
    },
    [router, workspaceState],
  );

  const applySavedView = useCallback(
    (view: SavedView) => {
      const preset = getSavedViewPreset(view);
      setWorkspacePreferences({
        ...preset.workspace,
        savedView: view,
      });
      router.push(buildSavedViewHref(view));
    },
    [router, setWorkspacePreferences],
  );

  return {
    applySavedView,
    navigateWithWorkspace,
    replaceWorkspaceState,
    workspaceState,
  };
}
