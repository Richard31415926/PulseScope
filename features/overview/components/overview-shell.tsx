"use client";

import type { Route } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ActivitySquare, ArrowUpRight, BellRing, ShieldCheck } from "lucide-react";
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
import { SurfacePanel } from "@/components/shell/panel";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { buildWorkspaceHref } from "@/lib/workspace-state";
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
  const { workspaceState } = useWorkspaceControls();
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
    <div className="space-y-5">
      <PageHeader
        actions={<OverviewControls generatedAt={overviewQuery.data?.generatedAt} />}
        density="tight"
        description="A live launch surface for what changed, what is regressing, and where to investigate next across traces, services, logs, and incidents."
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
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <div className="min-w-0 space-y-6">
            <SurfacePanel
              description="High-value changes are surfaced first so the overview behaves like an operational launchpad rather than a passive status wall."
              title="What changed"
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <LaunchCard
                  description={`${readyData.slowEndpoints[0]?.service ?? "checkout-api"} is carrying the hottest latency regression in the current window.`}
                  href={buildWorkspaceHref("/traces", workspaceState, {
                    q: readyData.slowEndpoints[0]?.endpoint ?? "",
                    service: readyData.slowEndpoints[0]?.service ?? "",
                  })}
                  label="Latency regression"
                  value={`${readyData.slowEndpoints[0]?.changePct ?? 0}%`}
                />
                <LaunchCard
                  description={`${new Set(readyData.incidents.flatMap((incident) => incident.impactedServices)).size} services are currently part of active or recently resolved incident paths.`}
                  href={buildWorkspaceHref(
                    `/services/${readyData.slowEndpoints[0]?.service ?? "checkout-api"}`,
                    workspaceState,
                  )}
                  label="Services under pressure"
                  value={`${new Set(readyData.incidents.flatMap((incident) => incident.impactedServices)).size}`}
                />
                <LaunchCard
                  description={`${readyData.incidents.length} incident threads remain close enough to current posture that they should stay one click away.`}
                  href={buildWorkspaceHref(
                    "/incidents",
                    workspaceState,
                    readyData.incidents[0] ? { incident: readyData.incidents[0].id } : undefined,
                  )}
                  label="Incident activity"
                  value={`${readyData.incidents.length}`}
                />
                <LaunchCard
                  description={`${readyData.slowEndpoints[0]?.service ?? "billing-core"} logs are the fastest text pivot for confirming whether the trace-level regression is isolated or systemic.`}
                  href={buildWorkspaceHref("/logs", workspaceState, {
                    q: readyData.slowEndpoints[0]?.service ?? "billing-core",
                  })}
                  label="Cross-signal pivot"
                  value={compareMode ? compareLabel : "logs"}
                />
              </div>
            </SurfacePanel>

            <motion.div
              animate="visible"
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
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

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="min-w-0"
                initial={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <LatencyChartPanel compareMode={compareMode} timeline={readyData.timeline} />
              </motion.div>
              <div className="grid min-w-0 gap-4">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="min-w-0"
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ delay: 0.08, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <ThroughputChartPanel compareMode={compareMode} timeline={readyData.timeline} />
                </motion.div>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="min-w-0"
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ delay: 0.12, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <ErrorRateChartPanel compareMode={compareMode} timeline={readyData.timeline} />
                </motion.div>
              </div>
            </div>

            <OverviewSlowEndpointsTable endpoints={readyData.slowEndpoints} />
          </div>

          <div className="space-y-6">
            <OverviewRecentIncidents incidents={readyData.incidents} />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ delay: 0.16, duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <SurfacePanel
                description="A compact operator brief that keeps the right rail useful even when there is no active firefight."
                title="Operational brief"
              >
                <div className="grid gap-3">
                  <OperationalNote
                    description="Availability stays elevated, but checkout and billing still carry the densest tail risk."
                    icon={<ShieldCheck className="size-4" />}
                    label="Availability posture"
                    value={readyData.availability}
                  />
                  <OperationalNote
                    description="Alert load is intentionally curated so the command center feels decisive rather than noisy."
                    icon={<BellRing className="size-4" />}
                    label="Alert load"
                    value={`${readyData.activeAlerts}`}
                  />
                  <OperationalNote
                    description="Environment and time range selectors push through shared workspace state immediately."
                    icon={<ActivitySquare className="size-4" />}
                    label="Active window"
                    value={readyData.windowLabel}
                  />
                </div>
              </SurfacePanel>
            </motion.div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LaunchCard({
  description,
  href,
  label,
  value,
}: {
  description: string;
  href: Route;
  label: string;
  value: string;
}) {
  return (
    <Link
      className="group rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4 transition hover:border-white/14 hover:bg-[linear-gradient(180deg,rgba(70,110,255,0.08),rgba(255,255,255,0.02))]"
      href={href}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/32 uppercase">{label}</div>
        <ArrowUpRight className="size-4 text-white/28 transition group-hover:text-white/60" />
      </div>
      <div className="font-display text-[1.9rem] font-semibold tracking-[-0.05em] text-white">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-white/50">{description}</p>
    </Link>
  );
}

function OperationalNote({
  description,
  icon,
  label,
  value,
}: {
  description: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-white/44">
        {icon}
        {label}
      </div>
      <div className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-white">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-white/52">{description}</p>
    </div>
  );
}
