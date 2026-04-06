"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ActivitySquare, BellRing, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/shell/empty-state";
import { ErrorState } from "@/components/shell/error-state";
import { PageHeader } from "@/components/shell/page-header";
import { OverviewControls } from "@/features/overview/components/overview-controls";
import {
  ErrorRateChartPanel,
  LatencyChartPanel,
  ThroughputChartPanel,
} from "@/features/overview/components/overview-charts";
import { OverviewLoadingState } from "@/features/overview/components/overview-loading-state";
import { OverviewMetricCard } from "@/features/overview/components/overview-metric-card";
import { OverviewRecentIncidents } from "@/features/overview/components/overview-recent-incidents";
import { OverviewSlowEndpointsTable } from "@/features/overview/components/overview-slow-endpoints-table";
import { compareRangeOptions } from "@/lib/navigation";
import { getOverviewDashboardData } from "@/lib/mock-api/overview";
import { queryKeys } from "@/lib/query-keys";
import { useUiStore } from "@/store/ui-store";
import type { OverviewMockState } from "@/types/pulsescope";

function resolveMockState(value: string | null): OverviewMockState {
  if (value === "empty" || value === "error") {
    return value;
  }

  return "live";
}

export function OverviewShell() {
  const router = useRouter();
  const environment = useUiStore((state) => state.activeEnvironment);
  const timeRange = useUiStore((state) => state.activeTimeRange);
  const compareMode = useUiStore((state) => state.compareMode);
  const compareRange = useUiStore((state) => state.activeCompareRange);
  const searchParams = useSearchParams();
  const mockState = resolveMockState(searchParams.get("mock"));
  const compareLabel =
    compareRangeOptions.find((option) => option.value === compareRange)?.label ?? "Previous period";
  const overviewQuery = useQuery({
    queryKey: queryKeys.overview(environment, timeRange, mockState),
    queryFn: () =>
      getOverviewDashboardData({
        environment,
        timeRange,
        mockState,
      }),
  });

  const readyData = overviewQuery.data?.state === "ready" ? overviewQuery.data : null;
  const meta = readyData ? (
    <>
      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
        {readyData.availability} availability
      </div>
      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
        {readyData.trackedServices} tracked services
      </div>
      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
        {readyData.activeAlerts} active alerts
      </div>
      {compareMode ? (
        <div className="rounded-full border border-info/20 bg-info/10 px-3 py-2 text-sm text-info">
          comparing vs {compareLabel.toLowerCase()}
        </div>
      ) : null}
      {mockState !== "live" ? (
        <div className="rounded-full border border-warning/20 bg-warning/10 px-3 py-2 text-sm text-warning">
          mock {mockState}
        </div>
      ) : null}
    </>
  ) : (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/52">
      Overview query ready for {environment}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<OverviewControls generatedAt={overviewQuery.data?.generatedAt} />}
        description="A dense operational readout with premium KPI cards, trend charts, slow-path ranking, and incident context. The selectors are wired to typed mock APIs so the page behaves like a real observability product, not a static showcase."
        eyebrow="Command Center"
        meta={meta}
        title="Global system pulse"
      />

      {overviewQuery.isLoading ? <OverviewLoadingState /> : null}

      {overviewQuery.isError ? (
        <ErrorState
          description="The local overview feed failed to resolve. Retry the query or switch away from the current mock state."
          onRetry={() => overviewQuery.refetch()}
          title="Overview data unavailable"
        />
      ) : null}

      {overviewQuery.data?.state === "empty" ? (
        <EmptyState
          actionLabel="Restore live mock"
          description="No telemetry was returned for this overview slice. The empty state is intentionally mocked so the layout can be validated before a backend exists."
          onAction={() => {
            router.replace("/overview");
          }}
          title="No observability data in this window"
        />
      ) : null}

      {readyData ? (
        <>
          <motion.div
            animate="visible"
            className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6"
            initial="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {readyData.metrics.map((metric, index) => (
              <OverviewMetricCard index={index} key={metric.id} metric={metric} />
            ))}
          </motion.div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <LatencyChartPanel compareMode={compareMode} timeline={readyData.timeline} />
            </motion.div>
            <div className="grid gap-4">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                transition={{ delay: 0.08, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <ThroughputChartPanel compareMode={compareMode} timeline={readyData.timeline} />
              </motion.div>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                transition={{ delay: 0.12, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <ErrorRateChartPanel compareMode={compareMode} timeline={readyData.timeline} />
              </motion.div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
            <OverviewSlowEndpointsTable endpoints={readyData.slowEndpoints} />
            <OverviewRecentIncidents incidents={readyData.incidents} />
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-3"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.16, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="surface-panel rounded-[28px] border border-white/10 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/44">
                <ShieldCheck className="size-4" />
                Availability posture
              </div>
              <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                {readyData.availability}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/52">
                Availability stays elevated, but the current latency profile shows concentrated pressure in checkout and billing paths.
              </p>
            </div>
            <div className="surface-panel rounded-[28px] border border-white/10 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/44">
                <BellRing className="size-4" />
                Alert load
              </div>
              <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                {readyData.activeAlerts}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/52">
                Alert volume is curated to stay actionable, giving the overview room to feel high-signal instead of chaotic.
              </p>
            </div>
            <div className="surface-panel rounded-[28px] border border-white/10 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/44">
                <ActivitySquare className="size-4" />
                Active window
              </div>
              <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                {readyData.windowLabel}
              </div>
              <p className="mt-3 text-sm leading-6 text-white/52">
                Environment and time range selectors update this page immediately through shared global UI state and typed query keys.
              </p>
            </div>
          </motion.div>
        </>
      ) : null}
    </div>
  );
}
