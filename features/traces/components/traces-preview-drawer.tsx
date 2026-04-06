"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FileCode2, Logs, Route, Server } from "lucide-react";
import { EmptyState } from "@/components/shell/empty-state";
import { PanelSkeleton } from "@/components/shell/panel-skeleton";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { queryKeys } from "@/lib/query-keys";
import { getTraceDetail } from "@/lib/mock-api/traces";
import { formatDuration } from "@/lib/utils";
import type { TraceExplorerRow } from "@/types/pulsescope";

export function TracesPreviewDrawer({
  trace,
}: {
  trace: TraceExplorerRow | null;
}) {
  const serviceMapHref = useWorkspaceHref("/services");
  const relatedLogsHref = useWorkspaceHref("/logs", trace ? { q: trace.id } : undefined);
  const traceDetailHref = useWorkspaceHref(trace ? `/traces/${trace.id}` : "/traces");
  const previewQuery = useQuery({
    enabled: Boolean(trace),
    queryKey: queryKeys.traceDetail(trace?.id ?? "trace-preview-empty"),
    queryFn: () => getTraceDetail(trace!.id),
  });

  if (!trace) {
    return (
      <EmptyState
        description="Hover a trace row to inspect its request path before opening the full detail view."
        title="Preview drawer waiting"
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 12 }}
        key={trace.id}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="space-y-4">
          <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(109,128,255,0.16),rgba(255,255,255,0.02))] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                  Hover preview
                </div>
                <div className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                  {trace.service}
                </div>
              </div>
              <StatusPill label={trace.status} />
            </div>
            <div className="mb-3 font-medium text-white">{trace.endpoint}</div>
            <p className="text-sm leading-6 text-white/54">{trace.userImpact}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <PreviewStat label="Duration" value={formatDuration(trace.durationMs)} />
            <PreviewStat label="HTTP status" value={`${trace.httpStatus}`} />
            <PreviewStat label="Spans" value={`${trace.spanCount}`} />
            <PreviewStat label="Logs" value={`${trace.correlatedLogs}`} />
          </div>

          <SurfacePanel
            description="Primary request path surfaced immediately so hover preview still feels useful, not decorative."
            title="Service path"
          >
            <div className="space-y-2">
              {trace.servicePath.map((service, index) => (
                <div
                  className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3"
                  key={`${trace.id}-${service}`}
                >
                  <Server className="size-4 text-white/36" />
                  <div className="text-sm font-medium text-white">{service}</div>
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
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3"
                  key={event.id}
                >
                  <div className="text-sm text-white/44">{event.label}</div>
                  <div
                    className={
                      event.tone === "danger"
                        ? "text-sm font-medium text-danger"
                        : event.tone === "warning"
                          ? "text-sm font-medium text-warning"
                          : event.tone === "positive"
                            ? "text-sm font-medium text-success"
                            : "text-sm font-medium text-white"
                    }
                  >
                    {event.value}
                  </div>
                </div>
              ))}
            </div>
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
                  <div className="grid gap-3 lg:grid-cols-[1fr_auto]" key={span.id}>
                    <div>
                      <div className="truncate font-medium text-white">{span.name}</div>
                      <div className="truncate text-sm text-white/40">{span.service}</div>
                    </div>
                    <div className="text-sm text-white/60">{formatDuration(span.durationMs)}</div>
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
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="mb-2 text-sm text-white/42">{label}</div>
      <div className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}
