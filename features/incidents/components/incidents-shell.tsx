"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Clock3, Layers3, Siren, Waves, Workflow } from "lucide-react";
import { ErrorState } from "@/components/shell/error-state";
import { EmptyState } from "@/components/shell/empty-state";
import { SurfacePanel } from "@/components/shell/panel";
import { PageHeader } from "@/components/shell/page-header";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { IncidentsLoadingState } from "@/features/incidents/components/incidents-loading-state";
import { buildIncidentSearchParams, getSelectedIncidentId } from "@/features/incidents/lib/incidents-url-state";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { queryKeys } from "@/lib/query-keys";
import { getIncidentsShellData } from "@/lib/mock-api/incidents";
import { buildWorkspaceHref } from "@/lib/workspace-state";

export function IncidentsShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { workspaceState } = useWorkspaceControls();
  const incidentsQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.incidents(),
    queryFn: getIncidentsShellData,
  });

  if (incidentsQuery.isLoading) {
    return <IncidentsLoadingState />;
  }

  if (incidentsQuery.isError || !incidentsQuery.data) {
    return (
      <ErrorState
        description="The incidents response desk could not load its local dataset."
        onRetry={() => incidentsQuery.refetch()}
        title="Incidents unavailable"
      />
    );
  }

  const incidents = incidentsQuery.data.incidents;
  const selectedIncidentId = getSelectedIncidentId(searchParams);
  const selectedIncident =
    incidents.find((incident) => incident.id === selectedIncidentId) ?? incidents[0];
  const activeCount = incidents.filter((incident) => incident.status !== "resolved").length;
  const criticalCount = incidents.filter((incident) => incident.severity === "critical").length;
  const trackedServices = new Set(incidents.flatMap((incident) => incident.impactedServices)).size;
  const latestTimelineEvent = selectedIncident.timeline.at(-1);
  const serviceFocusHref = buildWorkspaceHref(
    selectedIncident.impactedServices[0]
      ? `/services/${selectedIncident.impactedServices[0]}`
      : "/services",
    workspaceState,
  );
  const traceFocusHref = buildWorkspaceHref(
    "/traces",
    workspaceState,
    selectedIncident.impactedServices[0] ? { service: selectedIncident.impactedServices[0] } : undefined,
  );
  const logsFocusHref = buildWorkspaceHref(
    "/logs",
    workspaceState,
    selectedIncident.relatedTraceIds[0]
      ? { q: selectedIncident.relatedTraceIds[0] }
      : selectedIncident.impactedServices[0]
        ? { logService: selectedIncident.impactedServices[0] }
        : undefined,
  );

  if (incidents.length === 0) {
    return (
      <EmptyState
        description="Response history is currently empty for this workspace. Switch environments or apply a different saved view to repopulate the desk."
        title="No incidents in scope"
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        actions={<Button variant="default">Open response room</Button>}
        density="tight"
        description="A triage-first response desk: severity-led queue, current brief, and direct pivots into affected traces, services, and logs."
        eyebrow="Response Desk"
        meta={
          <>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {activeCount} active incidents
            </div>
            <StatusPill label={selectedIncident.severity} />
            <StatusPill label={selectedIncident.status} />
          </>
        }
        title="Coordinated incident review"
      />

      <div className="grid gap-4 xl:grid-cols-4">
        <SummaryCard icon={<Siren className="size-4" />} label="Active" supporting="Incidents not yet resolved" value={`${activeCount}`} />
        <SummaryCard icon={<Waves className="size-4" />} label="Critical" supporting="Highest-severity incidents" value={`${criticalCount}`} />
        <SummaryCard icon={<Layers3 className="size-4" />} label="Tracked services" supporting="Blast radius in current workspace" value={`${trackedServices}`} />
        <SummaryCard icon={<Workflow className="size-4" />} label="Selected status" supporting="Current incident posture" value={selectedIncident.status} />
      </div>

      <SurfacePanel
        className="overflow-hidden"
        description="The queue stays dense while the incident brief preserves the full response narrative in one anchored workspace."
        title="Incident workspace"
      >
        <ResizablePanelGroup autoSaveId="incidents-workspace-layout-v2" className="min-h-[720px]" direction="horizontal">
          <ResizablePanel defaultSize={40} minSize={32}>
            <div className="space-y-2 p-1">
              {incidents.map((incident) => {
                const active = incident.id === selectedIncident.id;

                return (
                  <button
                    aria-pressed={active}
                    key={incident.id}
                    onClick={() =>
                      router.replace(
                        `${pathname}?${buildIncidentSearchParams(searchParams, incident.id)}` as Route,
                        { scroll: false },
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.replace(
                          `${pathname}?${buildIncidentSearchParams(searchParams, incident.id)}` as Route,
                          { scroll: false },
                        );
                      }
                    }}
                    className={`w-full rounded-[24px] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(89,175,255,0.72)] focus-visible:ring-inset ${
                      active
                        ? getDrawerAccent(incident.severity)
                        : "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-[linear-gradient(90deg,rgba(77,122,255,0.06),rgba(255,255,255,0.02))]"
                    }`}
                    type="button"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <StatusPill label={incident.severity} />
                      <StatusPill label={incident.status} />
                    </div>
                    <div className="font-medium text-white">{incident.title}</div>
                    <div className="mt-2 line-clamp-2 text-sm leading-6 text-white/48">{incident.summary}</div>
                    <div className="mt-3 text-xs text-white/30">
                      Updated {incident.updatedAt} · Commander {incident.commander}
                    </div>
                  </button>
                );
              })}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={60} minSize={42}>
            <div className="h-full overflow-y-auto border-l border-white/8 p-5">
              <div className={`rounded-[30px] border p-5 ${getDrawerAccent(selectedIncident.severity)}`}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                      Incident detail
                    </div>
                    <h2 className="mt-2 break-words font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                      {selectedIncident.title}
                    </h2>
                  </div>
                  <Button size="sm" variant="secondary">
                    Timeline export
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>

                <p className="max-w-3xl text-sm leading-7 text-white/58">
                  {selectedIncident.impactStatement}
                </p>
                {latestTimelineEvent ? (
                  <div className="mt-4 rounded-[22px] border border-white/8 bg-black/18 px-4 py-3">
                    <div className="text-[11px] font-semibold tracking-[0.18em] text-white/30 uppercase">
                      Latest update
                    </div>
                    <div className="mt-2 text-sm text-white">{latestTimelineEvent.label}</div>
                    <div className="mt-1 text-sm leading-6 text-white/48">{latestTimelineEvent.detail}</div>
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <MetaCard label="Started" value={selectedIncident.startedAt} />
                  <MetaCard label="Updated" value={selectedIncident.updatedAt} />
                  <MetaCard label="Commander" value={selectedIncident.commander} />
                  <MetaCard label="Channel" value={selectedIncident.responseChannel} />
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                  <SurfacePanel
                    description="Impacted services are kept close to the drawer header so blast radius is visible immediately."
                    title="Impact radius"
                  >
                    <div className="space-y-3">
                      {selectedIncident.impactedServices.map((service) => (
                        <Button asChild className="w-full justify-between rounded-[18px]" key={service} variant="secondary">
                          <Link href={buildWorkspaceHref(`/services/${service}`, workspaceState)}>
                            {service}
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </SurfacePanel>

                  <SurfacePanel
                    description="Trace links offer a fast pivot into the execution evidence behind the incident."
                    title="Related traces"
                  >
                    <div className="space-y-3">
                      {selectedIncident.relatedTraceIds.map((traceId) => (
                        <Button asChild className="w-full justify-between rounded-[18px]" key={traceId} variant="ghost">
                          <Link href={buildWorkspaceHref(`/traces/${traceId}`, workspaceState)}>
                            <span className="truncate font-mono text-[12px]">{traceId}</span>
                            <ArrowUpRight className="size-4 shrink-0" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </SurfacePanel>

                  <SurfacePanel
                    description="The response desk keeps the next investigative moves one click away instead of forcing a context reset."
                    title="Response pivots"
                  >
                    <div className="space-y-3">
                      <Button asChild className="w-full justify-between rounded-[18px]" variant="secondary">
                        <Link href={serviceFocusHref}>
                          Impacted service posture
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-between rounded-[18px]" variant="secondary">
                        <Link href={traceFocusHref}>
                          Trace explorer slice
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                      <Button asChild className="w-full justify-between rounded-[18px]" variant="ghost">
                        <Link href={logsFocusHref}>
                          Correlated logs
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </SurfacePanel>
                </div>

                <SurfacePanel
                  description="Status changes are stacked as a readable incident narrative rather than a generic changelog."
                  title="Status timeline"
                >
                  <div className="space-y-3">
                    {selectedIncident.timeline.map((event) => (
                      <div
                        className="grid gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 md:grid-cols-[auto_1fr_auto] md:items-center"
                        key={event.id}
                      >
                        <Clock3 className="size-4 text-white/34" />
                        <div>
                          <div className="font-medium text-white">{event.label}</div>
                          <div className="text-sm text-white/44">{event.detail}</div>
                        </div>
                        <div className="text-sm text-white/40">{event.at}</div>
                      </div>
                    ))}
                  </div>
                </SurfacePanel>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SurfacePanel>
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
      <div className="font-display text-[2rem] font-semibold tracking-[-0.04em] text-white capitalize">{value}</div>
      <div className="mt-1 text-sm text-white/42">{supporting}</div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-2 text-sm text-white/40">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function getDrawerAccent(severity: "critical" | "high" | "medium" | "low") {
  if (severity === "critical") {
    return "border-danger/22 bg-[linear-gradient(180deg,rgba(211,88,88,0.16),rgba(255,255,255,0.03))]";
  }

  if (severity === "high") {
    return "border-warning/20 bg-[linear-gradient(180deg,rgba(221,159,73,0.14),rgba(255,255,255,0.03))]";
  }

  if (severity === "medium") {
    return "border-info/16 bg-[linear-gradient(180deg,rgba(109,145,255,0.12),rgba(255,255,255,0.03))]";
  }

  return "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]";
}
