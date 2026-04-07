"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Logs } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { formatDuration } from "@/lib/utils";
import type { TraceDetail, TraceSpan } from "@/types/pulsescope";

export function TraceSpanInspector({
  span,
  trace,
}: {
  span: TraceSpan | null;
  trace: TraceDetail;
}) {
  const relatedServiceHref = useWorkspaceHref(`/services/${trace.relatedService}`);
  const relatedLogsHref = useWorkspaceHref("/logs", { q: trace.id });

  if (!span) {
    return null;
  }

  const isPrimarySpan = span.name === trace.primarySpan;

  return (
    <SurfacePanel
      className="surface-elevated"
      description="Selection stays dense but legible so you can move between the waterfall and the inspector without context loss."
      title="Span inspector"
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          key={span.id}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-black/18 p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusPill label={span.status} />
                <Badge variant="neutral">{span.kind}</Badge>
                {isPrimarySpan ? <Badge variant="warning">primary pressure point</Badge> : null}
              </div>
              <div
                className="font-display text-2xl font-semibold tracking-[-0.04em] text-white [overflow-wrap:anywhere]"
                data-testid="span-inspector-title"
              >
                {span.name}
              </div>
              <div className="mt-2 text-sm text-white/48 [overflow-wrap:anywhere]">{span.service}</div>
              <p className="mt-4 text-sm leading-7 text-white/60">{span.summary}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricBlock label="Duration" value={formatDuration(span.durationMs)} />
              <MetricBlock label="Self time" value={formatDuration(span.selfTimeMs)} />
              <MetricBlock label="Start offset" value={formatDuration(span.offsetMs)} />
              <MetricBlock label="Completes at" value={formatDuration(span.offsetMs + span.durationMs)} />
            </div>

            <div className="space-y-3">
              <DetailLine label="Service" value={span.service} />
              <DetailLine label="Target" value={span.target} />
              <DetailLine label="Depth" value={`${span.depth}`} />
              <DetailLine label="Parent span" value={span.parentId ?? "root span"} />
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                Span attributes
              </div>
              <div className="flex flex-wrap gap-2">
                {span.attributes.map((attribute) => (
                  <div
                    className="rounded-full border border-white/8 bg-black/18 px-3 py-2 text-xs text-white/58"
                    key={`${span.id}-${attribute.key}`}
                  >
                    <span className="text-white/34">{attribute.key}</span>
                    <span className="mx-2 text-white/20">/</span>
                    <span className="font-mono text-[11px] text-white/76 [overflow-wrap:anywhere]">
                      {attribute.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="justify-between" variant="secondary">
                <Link href={relatedServiceHref}>
                  Related service
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
          </div>
        </motion.div>
      </AnimatePresence>
    </SurfacePanel>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="mb-2 text-sm text-white/40">{label}</div>
      <div className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="shrink-0 text-sm text-white/40">{label}</div>
      <div className="justify-self-end text-right text-sm font-medium leading-6 text-white [overflow-wrap:anywhere]">
        {value}
      </div>
    </div>
  );
}
