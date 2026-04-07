"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FileCode2, Logs, Route, Server, Siren } from "lucide-react";
import { EmptyState } from "@/components/shell/empty-state";
import { PanelSkeleton } from "@/components/shell/panel-skeleton";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { queryKeys } from "@/lib/query-keys";
import { buildWorkspaceHref } from "@/lib/workspace-state";
import { getIncidentsShellData } from "@/lib/mock-api/incidents";
import { getTraceDetail } from "@/lib/mock-api/traces";
import { formatDuration } from "@/lib/utils";
import type { TraceExplorerRow } from "@/types/pulsescope";

export function TracesPreviewDrawer({
  trace,
}: {
  trace: TraceExplorerRow | null;
}) {
  const incidentsHref = useWorkspaceHref("/incidents");
  const { workspaceState } = useWorkspaceControls();
  const serviceMapHref = buildWorkspaceHref(
    trace ? `/services/${trace.service}` : "/services",
    workspaceState,
  );
  const relatedLogsHref = buildWorkspaceHref(
    "/logs",
    workspaceState,
    trace ? { q: trace.id } : undefined,
  );
  const traceDetailHref = buildWorkspaceHref(trace ? `/traces/${trace.id}` : "/traces", workspaceState);
  const previewQuery = useQuery({
    enabled: Boolean(trace),
    queryKey: queryKeys.traceDetail(trace?.id ?? "trace-preview-empty"),
    queryFn: () => getTraceDetail(trace!.id),
  });
  const incidentsQuery = useQuery({
    enabled: Boolean(trace),
    queryKey: queryKeys.incidents(),
    queryFn: getIncidentsShellData,
    staleTime: 30_000,
  });

  if (!trace) {
    return (
      <EmptyState
        description="Hover a trace row to inspect its request path before opening the full detail view."
        title="Preview drawer waiting"
      />
    );
  }

  const correlatedIncidents =
    incidentsQuery.data?.incidents.filter((incident) =>
      incident.impactedServices.some((service) => trace.servicePath.includes(service)),
    ) ?? [];
  const primaryIncident = correlatedIncidents[0] ?? null;
  const incidentDetailHref = primaryIncident
    ? buildWorkspaceHref("/incidents", workspaceState, { incident: primaryIncident.id })
    : incidentsHref;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        key={trace.id}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="min-w-0 space-y-4">
          <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(84,126,255,0.16),rgba(255,255,255,0.02))] p-4">
            <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                  Hover preview
                </div>
                <div className="mt-1 font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.05em] text-white [overflow-wrap:anywhere]">
                  {trace.service}
                </div>
              </div>
              <StatusPill label={trace.status} />
            </div>
            <div className="mb-2 text-[0.98rem] font-medium leading-6 text-white [overflow-wrap:anywhere]">
              {trace.endpoint}
            </div>
            <div className="mb-3 text-sm text-white/42 [overflow-wrap:anywhere]">{trace.primarySpan}</div>
            <p className="text-sm leading-6 text-white/54">{trace.userImpact}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PreviewStat label="Duration" value={formatDuration(trace.durationMs)} />
            <PreviewStat label="HTTP status" value={`${trace.httpStatus}`} />
            <PreviewStat label="Spans" value={`${trace.spanCount}`} />
            <PreviewStat label="Logs" value={`${trace.correlatedLogs}`} />
          </div>

          <SurfacePanel
            description="Request path stays visible in the rail so ownership and likely blast radius are obvious before you open the full detail surface."
            title="Service path"
          >
            <div className="space-y-2">
              {trace.servicePath.map((service, index) => (
                <div
                  className="flex min-w-0 items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3"
                  key={`${trace.id}-${service}`}
                >
                  <Server className="size-4 text-white/36" />
                  <div className="min-w-0 text-sm font-medium leading-5 text-white [overflow-wrap:anywhere]">
                    {service}
                  </div>
                  {index < trace.servicePath.length - 1 ? (
                    <Route className="ml-auto size-4 text-white/24" />
                  ) : null}
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel
            description={previewQuery.data?.rootCause ?? trace.primaryIssue}
            title={trace.primarySpan}
          >
            <div className="space-y-3">
              {trace.previewEvents.map((event) => (
                <div
                  className="grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] items-start gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3"
                  key={event.id}
                >
                  <div className="min-w-0 text-sm leading-5 text-white/44 [overflow-wrap:anywhere]">
                    {event.label}
                  </div>
                  <div
                    className={
                      event.tone === "danger"
                        ? "min-w-0 text-right text-sm font-medium leading-5 text-danger [overflow-wrap:anywhere]"
                        : event.tone === "warning"
                          ? "min-w-0 text-right text-sm font-medium leading-5 text-warning [overflow-wrap:anywhere]"
                          : event.tone === "positive"
                            ? "min-w-0 text-right text-sm font-medium leading-5 text-success [overflow-wrap:anywhere]"
                            : "min-w-0 text-right text-sm font-medium leading-5 text-white [overflow-wrap:anywhere]"
                    }
                  >
                    {event.value}
                  </div>
                </div>
              ))}
            </div>
          </SurfacePanel>

          <SurfacePanel
            description={
              primaryIncident
                ? "Incident context is surfaced directly in the trace rail when affected services overlap with the current request path."
                : "No active incident is linked to the current request path in the local workspace sample."
            }
            title="Incident correlation"
          >
            {primaryIncident ? (
              <div className="space-y-3">
                <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Siren className="size-4 text-danger" />
                    <StatusPill label={primaryIncident.severity} />
                    <StatusPill label={primaryIncident.status} />
                  </div>
                  <div className="font-medium text-white [overflow-wrap:anywhere]">{primaryIncident.title}</div>
                  <div className="mt-2 text-sm leading-6 text-white/50">{primaryIncident.summary}</div>
                </div>
                <Button asChild className="w-full justify-between" variant="secondary">
                  <Link href={incidentDetailHref}>
                    Open incident context
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-white/46">
                No incident correlation in this path.
              </div>
            )}
          </SurfacePanel>

          <SurfacePanel
            description="A compact span preview helps the drawer feel genuinely investigative before the full detail page takes over."
            title="Span preview"
          >
            {previewQuery.isLoading ? (
              <PanelSkeleton className="border-none bg-transparent p-0 shadow-none" lines={5} />
            ) : previewQuery.data ? (
              <div className="space-y-3">
                {previewQuery.data.spans.slice(0, 4).map((span) => (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3" key={span.id}>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-5 text-white [overflow-wrap:anywhere]">
                        {span.name}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-white/40 [overflow-wrap:anywhere]">
                        {span.service}
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-white/60">{formatDuration(span.durationMs)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/44">Preview details unavailable.</div>
            )}
          </SurfacePanel>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild className="justify-between" variant="secondary">
              <Link href={serviceMapHref}>
                Service map
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild className="justify-between" variant="secondary">
              <Link href={relatedLogsHref}>
                Related logs
                <Logs className="size-4" />
              </Link>
            </Button>
          </div>

          <Button asChild className="w-full justify-between" variant="default">
            <Link href={traceDetailHref}>
              Open full trace detail
              <FileCode2 className="size-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="mb-2 text-sm text-white/42">{label}</div>
      <div className="font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.04em] text-white [overflow-wrap:anywhere]">
        {value}
      </div>
    </div>
  );
}
