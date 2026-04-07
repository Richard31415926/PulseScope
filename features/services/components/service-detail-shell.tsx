"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ErrorState } from "@/components/shell/error-state";
import { HealthIndicator } from "@/components/shell/health-indicator";
import { PanelSkeleton } from "@/components/shell/panel-skeleton";
import { SurfacePanel } from "@/components/shell/panel";
import { PageHeader } from "@/components/shell/page-header";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { ServiceDependencyGraph } from "@/features/services/components/service-dependency-graph";
import { ServiceMetricTrendCard } from "@/features/services/components/service-metric-trend-card";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { queryKeys } from "@/lib/query-keys";
import { getServiceDetail } from "@/lib/mock-api/services";
import { buildWorkspaceHref } from "@/lib/workspace-state";
import { formatCompactNumber, formatDuration, formatPercentage } from "@/lib/utils";

export function ServiceDetailShell({ serviceId }: { serviceId: string }) {
  const servicesHref = useWorkspaceHref("/services");
  const incidentsHref = useWorkspaceHref("/incidents");
  const { workspaceState } = useWorkspaceControls();
  const serviceQuery = useQuery({
    queryKey: queryKeys.serviceDetail(serviceId),
    queryFn: () => getServiceDetail(serviceId),
  });

  if (serviceQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PanelSkeleton className="min-h-32" lines={4} />
        <div className="grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PanelSkeleton className="min-h-[220px]" key={`metric-skeleton-${index + 1}`} lines={7} />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <PanelSkeleton className="min-h-[520px]" lines={10} />
          <div className="space-y-4">
            <PanelSkeleton className="min-h-[360px]" lines={8} />
            <PanelSkeleton className="min-h-[360px]" lines={8} />
          </div>
        </div>
      </div>
    );
  }

  if (serviceQuery.isError || !serviceQuery.data) {
    return (
      <ErrorState
        description="This service detail could not be resolved from the local mock dataset."
        onRetry={() => serviceQuery.refetch()}
        title="Service detail unavailable"
      />
    );
  }

  const service = serviceQuery.data;
  const tracesHref = buildWorkspaceHref("/traces", workspaceState, { service: service.id });
  const logsHref = buildWorkspaceHref("/logs", workspaceState, { logService: service.id });
  const incidentFocusHref = buildWorkspaceHref(
    "/incidents",
    workspaceState,
    service.recentIncidents[0] ? { incident: service.recentIncidents[0].id } : undefined,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href={servicesHref}>
                <ArrowLeft className="size-4" />
                Back to services
              </Link>
            </Button>
            <Button asChild variant="default">
              <Link href={incidentsHref}>
                Open incident history
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </>
        }
        description={service.description}
        density="tight"
        eyebrow="Service Focus"
        meta={
          <>
            <HealthIndicator status={service.status} />
            <StatusPill label={service.tier} />
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {service.environment}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {service.owner}
            </div>
          </>
        }
        title={service.name}
      />

      <SurfacePanel
        action={<HealthIndicator status={service.status} />}
        className="surface-elevated"
        description="Operational summary tuned for quick comprehension before diving into trend detail, incident history, or dependency context."
        title="Service synopsis"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
          <div className="min-w-0 rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusPill label={service.tier} />
              <div className="rounded-full border border-white/10 bg-black/14 px-3 py-1.5 text-xs text-white/56">
                {service.owner}
              </div>
              <div className="rounded-full border border-white/10 bg-black/14 px-3 py-1.5 text-xs text-white/56">
                {service.environment}
              </div>
            </div>
            <div className="max-w-2xl text-sm leading-7 text-white/56">
              {service.description}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SynopsisDetail label="Dependencies" value={`${service.dependencies.length}`} />
              <SynopsisDetail label="Dependents" value={`${service.dependents.length}`} />
              <SynopsisDetail label="Recent incidents" value={`${service.recentIncidents.length}`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="ghost">
                <Link href={tracesHref}>
                  Service traces
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={logsHref}>
                  Service logs
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={incidentFocusHref}>
                  Incident context
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SynopsisMetric label="Latency" value={service.latency} />
            <SynopsisMetric label="Throughput" value={service.throughput} />
            <SynopsisMetric label="Error rate" value={service.errorRate} />
            <SynopsisMetric label="Availability" value={service.availability} />
          </div>
        </div>
      </SurfacePanel>

      <div className="grid gap-4 xl:grid-cols-3">
        <ServiceMetricTrendCard
          colorClass="bg-[linear-gradient(180deg,rgba(130,151,255,0.95),rgba(70,94,255,0.16))]"
          label="Latency trend"
          points={service.metricSeries}
          type="latency"
        />
        <ServiceMetricTrendCard
          colorClass="bg-[linear-gradient(180deg,rgba(112,224,180,0.92),rgba(35,118,84,0.16))]"
          label="Throughput trend"
          points={service.metricSeries}
          type="throughput"
        />
        <ServiceMetricTrendCard
          colorClass="bg-[linear-gradient(180deg,rgba(242,178,92,0.92),rgba(120,74,18,0.16))]"
          label="Error trend"
          points={service.metricSeries}
          type="errorRate"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="space-y-4">
          <SurfacePanel
            description="Operations are ranked to keep the highest-latency or most failure-prone paths visible first."
            title="Top failing operations"
          >
            <div className="space-y-3">
              {service.topOperations.map((operation) => (
                <div
                  className="grid gap-4 rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-4 py-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]"
                  key={operation.name}
                >
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <HealthIndicator compact status={operation.status} />
                    </div>
                    <div className="font-medium text-white">{operation.name}</div>
                  </div>
                  <MetricDatum label="Latency" value={formatDuration(operation.latencyMs)} />
                  <MetricDatum label="Volume" value={`${formatCompactNumber(operation.requestsPerMin)}/m`} />
                  <MetricDatum label="Errors" value={formatPercentage(operation.errorRatePct)} />
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel
            description="Incident history stays anchored to the service page so operational changes can be read with the same context as current performance."
            title="Recent incident history"
          >
            {service.recentIncidents.length > 0 ? (
              <div className="space-y-3">
                {service.recentIncidents.map((incident) => (
                  <div
                    className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4"
                    key={incident.id}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusPill label={incident.severity} />
                      <StatusPill label={incident.status} />
                    </div>
                    <div className="font-medium text-white">{incident.title}</div>
                    <div className="mt-2 text-sm leading-6 text-white/48">{incident.impactStatement}</div>
                    <div className="mt-3 text-xs text-white/32">
                      Commander {incident.commander} · Updated {incident.updatedAt}
                    </div>
                    <Button asChild className="mt-4 justify-between" size="sm" variant="ghost">
                      <Link href={buildWorkspaceHref("/incidents", workspaceState, { incident: incident.id })}>
                        Open incident
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-8 text-sm text-white/46">
                No recent incidents are attached to this service record.
              </div>
            )}
          </SurfacePanel>
        </div>

        <div className="space-y-4">
          <SurfacePanel
            description="The graph stays intentionally restrained: dependents on the left, dependencies on the right, service context fixed in the center."
            title="Dependency topology"
          >
            <ServiceDependencyGraph
              dependencies={service.dependencies}
              dependents={service.dependents}
              serviceName={service.name}
            />
          </SurfacePanel>

          <SurfacePanel
            description="Quick posture metrics preserve the enterprise feel without overwhelming the main trend panels."
            title="Operational posture"
          >
            <div className="space-y-3">
              <DetailLine label="Owner team" value={service.owner} />
              <DetailLine label="Availability" value={service.availability} />
              <DetailLine label="Linked dependencies" value={`${service.dependencies.length}`} />
              <DetailLine label="Downstream dependents" value={`${service.dependents.length}`} />
              <DetailLine label="Tracked incidents" value={`${service.recentIncidents.length}`} />
            </div>
          </SurfacePanel>
        </div>
      </div>
    </div>
  );
}

function SynopsisMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-2 text-sm text-white/40">{label}</div>
      <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
    </div>
  );
}

function SynopsisDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-black/14 px-4 py-3">
      <div className="text-[10px] font-semibold tracking-[0.18em] text-white/30 uppercase">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function MetricDatum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/32">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="text-sm text-white/40">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}
