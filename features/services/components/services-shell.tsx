"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ShieldCheck, Orbit, Siren, Waypoints } from "lucide-react";
import { ErrorState } from "@/components/shell/error-state";
import { HealthIndicator } from "@/components/shell/health-indicator";
import { PanelSkeleton } from "@/components/shell/panel-skeleton";
import { SurfacePanel } from "@/components/shell/panel";
import { PageHeader } from "@/components/shell/page-header";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { ServiceDependencyPanorama } from "@/features/services/components/service-dependency-panorama";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { buildWorkspaceHref } from "@/lib/workspace-state";
import { queryKeys } from "@/lib/query-keys";
import { getIncidentsShellData } from "@/lib/mock-api/incidents";
import { getServicesShellData } from "@/lib/mock-api/services";
import { formatPercentage } from "@/lib/utils";

const rowColumns =
  "minmax(0,2fr) minmax(0,1.1fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.8fr) auto";

export function ServicesShell() {
  const servicesQuery = useQuery({
    queryKey: queryKeys.services(),
    queryFn: getServicesShellData,
  });
  const incidentsQuery = useQuery({
    queryKey: queryKeys.incidents(),
    queryFn: getIncidentsShellData,
  });
  const { workspaceState } = useWorkspaceControls();

  if (servicesQuery.isLoading || incidentsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PanelSkeleton className="min-h-32" lines={4} />
        <div className="grid gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PanelSkeleton key={`services-summary-${index + 1}`} lines={4} />
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <PanelSkeleton className="min-h-[820px]" lines={14} />
          <div className="space-y-4">
            <PanelSkeleton className="min-h-[360px]" lines={8} />
            <PanelSkeleton className="min-h-[420px]" lines={8} />
          </div>
        </div>
      </div>
    );
  }

  if (servicesQuery.isError || !servicesQuery.data || incidentsQuery.isError || !incidentsQuery.data) {
    return (
      <ErrorState
        description="The services and incidents datasets did not resolve together. Retry to rebuild the service posture view."
        onRetry={() => {
          void servicesQuery.refetch();
          void incidentsQuery.refetch();
        }}
        title="Service posture unavailable"
      />
    );
  }

  const services = servicesQuery.data.services;
  const incidents = incidentsQuery.data.incidents;
  const featuredServices = [...services]
    .sort((left, right) => {
      const severity = { error: 0, slow: 1, ok: 2 } as const;
      if (severity[left.status] !== severity[right.status]) {
        return severity[left.status] - severity[right.status];
      }

      return right.incidents.length - left.incidents.length;
    })
    .slice(0, 3);
  const degradedCount = services.filter((service) => service.status === "slow").length;
  const criticalCount = services.filter((service) => service.status === "error").length;
  const averageAvailability =
    services.reduce((total, service) => total + Number.parseFloat(service.availability), 0) /
    services.length;
  const activeIncidents = incidents.filter((incident) => incident.status !== "resolved");

  return (
    <div className="space-y-5">
      <PageHeader
        actions={<Button variant="default">Dependency review</Button>}
        density="tight"
        description="A service posture workbench for dependency risk, degraded ownership, and fast pivots into traces, logs, and incident context."
        eyebrow="Service Map"
        meta={
          <>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {services.length} services in scope
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {activeIncidents.length} active incidents
            </div>
          </>
        }
        title="Service health and topology"
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <SummaryCard icon={<Orbit className="size-4" />} label="Monitored services" supporting="Services in current workspace" value={`${services.length}`} />
        <SummaryCard icon={<Siren className="size-4" />} label="Critical attention" supporting="Services in critical state" value={`${criticalCount}`} />
        <SummaryCard icon={<Waypoints className="size-4" />} label="Degraded services" supporting="Latency or error pressure" value={`${degradedCount}`} />
        <SummaryCard icon={<ShieldCheck className="size-4" />} label="Avg availability" supporting="Synthetic fleet posture" value={formatPercentage(averageAvailability, 2)} />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.12fr)_390px]">
        <div className="space-y-4">
          <SurfacePanel
            description="Priority services condense the highest-risk nodes into compact dossiers before you drop into the full ledger."
            title="Priority services"
          >
            <div className="grid gap-4 xl:grid-cols-3">
              {featuredServices.map((service) => (
                <SurfacePanel
                  action={<HealthIndicator status={service.status} />}
                  className="h-full border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4 shadow-none"
                  description={service.description}
                  key={service.id}
                  title={service.name}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <StatusPill label={service.tier} />
                    <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/56">
                      {service.owner}
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <MetricCell label="Latency" value={service.latency} />
                    <MetricCell label="Throughput" value={service.throughput} />
                    <MetricCell label="Error rate" value={service.errorRate} />
                    <MetricCell label="Deps" value={`${service.dependencies.length}`} />
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Button asChild className="justify-between" size="sm" variant="ghost">
                      <Link
                        aria-label={`Open traces for ${service.name}`}
                        href={buildWorkspaceHref("/traces", workspaceState, { service: service.id })}
                      >
                        Traces
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild className="justify-between" size="sm" variant="ghost">
                      <Link
                        aria-label={`Open logs for ${service.name}`}
                        href={buildWorkspaceHref("/logs", workspaceState, { logService: service.id })}
                      >
                        Logs
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild className="justify-between" size="sm" variant="ghost">
                      <Link
                        aria-label={`Open incidents for ${service.name}`}
                        href={buildWorkspaceHref(
                          "/incidents",
                          workspaceState,
                          service.incidents[0] ? { incident: service.incidents[0] } : undefined,
                        )}
                      >
                        Incidents
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>

                  <Button asChild className="mt-2 w-full justify-between" size="sm" variant="secondary">
                    <Link
                      aria-label={`Open featured service ${service.name}`}
                      href={buildWorkspaceHref(`/services/${service.id}`, workspaceState)}
                    >
                      Open service
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </SurfacePanel>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel
            className="overflow-hidden"
            description="The ledger stays dense and readable by keeping high-value operational fields visible while actions remain one click away."
            title="Service ledger"
          >
            <div className="grid gap-3 border-b border-white/8 bg-[rgba(25,30,40,0.86)] px-5 py-3 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase backdrop-blur-xl" style={{ gridTemplateColumns: rowColumns }}>
              <div>Service</div>
              <div>Owner</div>
              <div>Latency</div>
              <div>Throughput</div>
              <div>Errors</div>
              <div />
            </div>

            <div className="p-2">
              {services.map((service) => (
                <div
                  className="grid items-center gap-3 rounded-[22px] border border-transparent px-4 py-3 transition hover:border-white/10 hover:bg-[linear-gradient(90deg,rgba(77,122,255,0.06),rgba(255,255,255,0.02))]"
                  key={service.id}
                  style={{ gridTemplateColumns: rowColumns }}
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <HealthIndicator compact status={service.status} />
                      <StatusPill label={service.tier} />
                    </div>
                    <div className="truncate font-medium text-white">{service.name}</div>
                    <div className="mt-1 truncate text-sm text-white/40">
                      {service.environment} · {service.dependencies.length} dependencies
                    </div>
                  </div>
                  <div className="min-w-0 truncate text-sm text-white/56">{service.owner}</div>
                  <div className="text-sm text-white">{service.latency}</div>
                  <div className="text-sm text-white">{service.throughput}</div>
                  <div className="text-sm text-white">{service.errorRate}</div>
                  <Button asChild size="sm" variant="ghost">
                    <Link
                      aria-label={`Open service ${service.name}`}
                      href={buildWorkspaceHref(`/services/${service.id}`, workspaceState)}
                    >
                      Open
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>

        <div className="space-y-4">
          <SurfacePanel
            description="A simplified dependency panorama keeps the system shape visible without turning the service overview into a graphing exercise."
            title="Dependency panorama"
          >
            <ServiceDependencyPanorama services={services} />
          </SurfacePanel>

          <SurfacePanel
            description="Recent incident context stays adjacent to the ledger so health, ownership, and response history can be read together."
            title="Incident pulse"
          >
            <div className="space-y-3">
              {incidents.slice(0, 4).map((incident) => (
                <div
                  className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-4"
                  key={incident.id}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <StatusPill label={incident.severity} />
                    <StatusPill label={incident.status} />
                  </div>
                  <div className="font-medium text-white">{incident.title}</div>
                  <div className="mt-2 text-sm leading-6 text-white/48">{incident.impactStatement}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {incident.impactedServices.map((service) => (
                      <div
                        className="rounded-full border border-white/10 bg-black/16 px-3 py-1.5 text-xs text-white/56"
                        key={`${incident.id}-${service}`}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="mt-4 justify-between" size="sm" variant="ghost">
                    <Link href={buildWorkspaceHref("/incidents", workspaceState, { incident: incident.id })}>
                      Open incidents
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </SurfacePanel>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  supporting,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  supporting: string;
  value: string;
}) {
  return (
    <div className="surface-panel rounded-[24px] border border-white/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-white/40">
        <span className="text-white/32">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="font-display text-[2rem] font-semibold tracking-[-0.04em] text-white">{value}</div>
      <div className="mt-1 text-sm text-white/42">{supporting}</div>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="mb-1 text-xs uppercase tracking-[0.18em] text-white/32">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}
