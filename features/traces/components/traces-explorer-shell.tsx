"use client";

import type { Route } from "next";
import { startTransition, useDeferredValue, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SurfacePanel } from "@/components/shell/panel";
import { SavedViewsMenu } from "@/components/layout/saved-views-menu";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shell/empty-state";
import { ErrorState } from "@/components/shell/error-state";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TracesFilterBar } from "@/features/traces/components/traces-filter-bar";
import { TracesLoadingState } from "@/features/traces/components/traces-loading-state";
import { TracesPreviewDrawer } from "@/features/traces/components/traces-preview-drawer";
import { TracesTable } from "@/features/traces/components/traces-table";
import {
  buildTraceSearchParams,
  getTraceFilterKey,
  getTraceFiltersFromSearchParams,
} from "@/features/traces/lib/traces-url-state";
import { queryKeys } from "@/lib/query-keys";
import { getTraceDetail, getTracesShellData } from "@/lib/mock-api/traces";
import { useUiStore } from "@/store/ui-store";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import type { TraceSortKey, TracesExplorerFilters } from "@/types/pulsescope";

export function TracesExplorerShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const environment = useUiStore((state) => state.activeEnvironment);
  const timeRange = useUiStore((state) => state.activeTimeRange);
  const { navigateWithWorkspace } = useWorkspaceControls();
  const filters = getTraceFiltersFromSearchParams(searchParams);
  const deferredSearch = useDeferredValue(filters.search);
  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);
  const resolvedFilters: TracesExplorerFilters = {
    ...filters,
    search: deferredSearch,
  };

  const tracesQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.traces(`${environment}:${getTraceFilterKey(resolvedFilters)}`),
    queryFn: () =>
      getTracesShellData({
        environment,
        filters: resolvedFilters,
      }),
  });

  function updateFilters(updates: Partial<TracesExplorerFilters>) {
    const nextQuery = buildTraceSearchParams(searchParams, updates);

    startTransition(() => {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}` as Route, { scroll: false });
    });
  }

  async function handleHoverTrace(traceId: string) {
    setActiveTraceId(traceId);
    await queryClient.prefetchQuery({
      queryKey: queryKeys.traceDetail(traceId),
      queryFn: () => getTraceDetail(traceId),
      staleTime: 30_000,
    });
  }

  function handleSortChange(key: TraceSortKey) {
    updateFilters({
      sortKey: key,
      sortDirection:
        filters.sortKey === key
          ? filters.sortDirection === "desc"
            ? "asc"
            : "desc"
          : key === "service" || key === "status"
            ? "asc"
            : "desc",
    });
  }

  const activeTrace =
    tracesQuery.data?.traces.find((trace) => trace.id === activeTraceId) ??
    tracesQuery.data?.traces[0] ??
    null;

  if (tracesQuery.isLoading) {
    return <TracesLoadingState />;
  }

  if (tracesQuery.isError || !tracesQuery.data) {
    return (
      <ErrorState
        description="The trace explorer mock API did not return a usable result. Retry the query and the preview drawer will recover with it."
        onRetry={() => tracesQuery.refetch()}
        title="Trace explorer unavailable"
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          <>
            <SavedViewsMenu triggerVariant="secondary" />
            <Button variant="default">Create latency alert</Button>
          </>
        }
        density="tight"
        description="Flagship trace exploration for fast scanning: URL-synced filters, dense rows, and a right-side rail that preserves investigation flow."
        eyebrow="Latency Lab"
        meta={
          <>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {environment}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {timeRange}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              hover to preview, click to open
            </div>
          </>
        }
        title="Trace Explorer"
      />

      <div className="space-y-4">
        <TracesFilterBar
          averageDurationMs={tracesQuery.data.averageDurationMs}
          errorCount={tracesQuery.data.errorCount}
          filters={filters}
          matchedCount={tracesQuery.data.matchedCount}
          methods={tracesQuery.data.methods}
          onChange={updateFilters}
          regions={tracesQuery.data.regions}
          services={tracesQuery.data.services}
          totalCount={tracesQuery.data.totalCount}
        />

        <SurfacePanel
          className="overflow-hidden"
          title="Trace workspace"
        >
          {tracesQuery.data.traces.length > 0 ? (
            <ResizablePanelGroup
              autoSaveId="traces-explorer-layout-v3"
              className="min-h-[640px]"
              direction="horizontal"
            >
              <ResizablePanel defaultSize={72} minSize={58}>
                <div className="h-full min-w-0 p-4">
                  <div className="h-full min-w-0 overflow-auto rounded-[28px] border border-white/8 bg-white/[0.02] p-2">
                    <TracesTable
                      activeTraceId={activeTrace?.id ?? null}
                      onHoverTrace={(traceId) => {
                        void handleHoverTrace(traceId);
                      }}
                      onRowSelect={(traceId) => navigateWithWorkspace(`/traces/${traceId}`)}
                      onSortChange={handleSortChange}
                      sortDirection={filters.sortDirection}
                      sortKey={filters.sortKey}
                      traces={tracesQuery.data.traces}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={30} minSize={30}>
                <div className="h-full overflow-y-auto border-l border-white/8 p-5">
                  <TracesPreviewDrawer trace={activeTrace} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="p-6">
              <EmptyState
                actionLabel="Clear filters"
                description="No traces matched this query window. Reset the explorer filters and the flagship view will repopulate immediately."
                onAction={() => router.replace("/traces")}
                title="No traces in this slice"
              />
            </div>
          )}
        </SurfacePanel>
      </div>

    </div>
  );
}
