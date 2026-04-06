"use client";

import type { Route } from "next";
import { startTransition, useDeferredValue, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ErrorState } from "@/components/shell/error-state";
import { SavedViewsMenu } from "@/components/layout/saved-views-menu";
import { PageHeader } from "@/components/shell/page-header";
import { SurfacePanel } from "@/components/shell/panel";
import { Button } from "@/components/ui/button";
import { LogsFilterBar } from "@/features/logs/components/logs-filter-bar";
import { LogsLoadingState } from "@/features/logs/components/logs-loading-state";
import { VirtualizedLogList } from "@/features/logs/components/virtualized-log-list";
import { filterLogs } from "@/features/logs/lib/logs-filtering";
import { buildLogsSearchParams, getLogsUrlState } from "@/features/logs/lib/logs-url-state";
import { queryKeys } from "@/lib/query-keys";
import { createLiveLogEntry, getLogsShellData } from "@/lib/mock-api/logs";
import type { LogRecord, LogsExplorerFilters } from "@/types/pulsescope";

export function LogsExplorerShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlState = getLogsUrlState(searchParams);
  const [ephemeralLogs, setEphemeralLogs] = useState<LogRecord[]>([]);
  const deferredSearch = useDeferredValue(urlState.filters.search);
  const liveSequenceRef = useRef(0);
  const logsQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.logs(),
    queryFn: getLogsShellData,
  });

  function updateUrlState(
    updates: Partial<{
      expandedLogId: string | null;
      filters: Partial<LogsExplorerFilters>;
      liveMode: boolean;
    }>,
  ) {
    const nextQuery = buildLogsSearchParams(searchParams, {
      expandedLogId: updates.expandedLogId ?? urlState.expandedLogId,
      filters: {
        ...urlState.filters,
        ...(updates.filters ?? {}),
      },
      liveMode: updates.liveMode ?? urlState.liveMode,
    });

    startTransition(() => {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}` as Route, { scroll: false });
    });
  }

  const appendLiveLog = useEffectEvent(() => {
    liveSequenceRef.current += 1;

    setEphemeralLogs((current) => [
      createLiveLogEntry(liveSequenceRef.current),
      ...current.slice(0, 179),
    ]);
  });

  useEffect(() => {
    if (!urlState.liveMode) {
      return;
    }

    const interval = globalThis.setInterval(() => {
      appendLiveLog();
    }, 1_600);

    return () => {
      globalThis.clearInterval(interval);
    };
  }, [urlState.liveMode]);

  const combinedLogs = useMemo(
    () => [...ephemeralLogs, ...(logsQuery.data?.logs ?? [])],
    [ephemeralLogs, logsQuery.data?.logs],
  );

  const visibleLogs = useMemo(
    () =>
      filterLogs(combinedLogs, {
        ...urlState.filters,
        search: deferredSearch,
      }),
    [combinedLogs, deferredSearch, urlState.filters],
  );
  const traceLinkedCount = useMemo(
    () => combinedLogs.filter((log) => Boolean(log.traceId)).length,
    [combinedLogs],
  );
  const errorLikeCount = useMemo(
    () =>
      combinedLogs.filter((log) => log.level === "fatal" || log.level === "error" || log.level === "warn")
        .length,
    [combinedLogs],
  );
  const resolvedExpandedLogId =
    visibleLogs.find((log) => log.id === urlState.expandedLogId)?.id ?? null;

  if (logsQuery.isLoading) {
    return <LogsLoadingState />;
  }

  if (logsQuery.isError || !logsQuery.data) {
    return (
      <ErrorState
        description="The local log stream dataset did not resolve cleanly. Retry to rebuild the explorer state."
        onRetry={() => logsQuery.refetch()}
        title="Log explorer unavailable"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SavedViewsMenu triggerVariant="secondary" />
            <Button
              aria-pressed={urlState.liveMode}
              data-pulsescope-live-toggle="true"
              onClick={() => updateUrlState({ liveMode: !urlState.liveMode })}
              variant={urlState.liveMode ? "default" : "secondary"}
            >
              <Radio className="size-4" />
              Live mode
            </Button>
          </div>
        }
        description="A dense, virtualized log stream designed for stable scanning at scale: fast text search, level and environment narrowing, trace pivots, and inline expansion without losing your place in the list."
        eyebrow="Signal Stream"
        meta={
          <>
            {urlState.liveMode ? (
              <div
                className="rounded-full border border-success/20 bg-success/10 px-3 py-2 text-sm text-success"
                role="status"
                aria-live="polite"
              >
                Live stream active
              </div>
            ) : (
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/56">
                Live stream paused
              </div>
            )}
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/56">
              {logsQuery.data.totalCount.toLocaleString("en-US")} indexed events
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/56">
              up/down to move, enter to expand
            </div>
          </>
        }
        title="Structured log investigation"
      />

      <div className="space-y-4">
        <LogsFilterBar
          environments={logsQuery.data.environments}
          errorLikeCount={errorLikeCount}
          filters={urlState.filters}
          onChange={(updates) => {
            updateUrlState({
              expandedLogId: null,
              filters: updates,
            });
          }}
          services={logsQuery.data.services}
          totalCount={combinedLogs.length}
          traceLinkedCount={traceLinkedCount}
          visibleCount={visibleLogs.length}
        />

        <SurfacePanel
          className="p-4"
          description="Rendering is intentionally capped to visible rows while the full filtered dataset stays searchable and keyboard navigable."
          title="Log workspace"
        >
          <VirtualizedLogList
            expandedLogId={resolvedExpandedLogId}
            logs={visibleLogs}
            onResetFilters={() => {
              updateUrlState({
                expandedLogId: null,
                filters: {
                  environment: "all",
                  level: "all",
                  search: "",
                  service: "all",
                },
              });
            }}
            onToggleLog={(logId) => {
              updateUrlState({
                expandedLogId: resolvedExpandedLogId === logId ? null : logId,
              });
            }}
          />
        </SurfacePanel>
      </div>
    </div>
  );
}
