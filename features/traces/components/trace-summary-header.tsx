"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Logs, Route, Server } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import type { TraceDetail } from "@/types/pulsescope";

export function TraceSummaryHeader({ trace }: { trace: TraceDetail }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <SurfacePanel className="surface-elevated overflow-hidden border-white/12 p-0">
        <div className="border-b border-white/8 px-6 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusPill label={trace.status} />
            <MetaBadge label={trace.method} />
            <MetaBadge label={trace.region} />
            <MetaBadge label={trace.startedAt} />
            <MetaBadge label={trace.id} mono />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                  Trace summary
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-[-0.05em] text-white lg:text-[2.5rem]">
                  {trace.endpoint}
                </h1>
                <div className="mt-2 text-base text-white/56">{trace.operation}</div>
              </div>

              <p className="max-w-3xl text-sm leading-7 text-white/60">{trace.rootCause}</p>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="secondary">
                  <Link href={`/services/${trace.service}`}>
                    Primary service
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href={`/services/${trace.relatedService}`}>
                    Related service
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/logs">
                    Open logs
                    <Logs className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/18 p-5">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                End-to-end latency
              </div>
              <div className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                {formatDuration(trace.durationMs)}
              </div>
              <div className="mt-3 text-sm leading-6 text-white/54">{trace.userImpact}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
              Request path
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {trace.servicePath.map((service, index) => (
                <div className="flex items-center gap-2" key={`${trace.id}-${service}`}>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/72">
                    <Server className="size-3.5 text-white/36" />
                    <span>{service}</span>
                  </div>
                  {index < trace.servicePath.length - 1 ? (
                    <Route className="size-4 text-white/22" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <MetricCard label="Spans visible" value={`${trace.spans.length}`} />
            <MetricCard label="Related logs" value={`${trace.correlationLogCount}`} />
            <MetricCard label="DB time" value={formatDuration(trace.databaseTimeMs)} />
            <MetricCard label="Network" value={formatDuration(trace.networkTimeMs)} />
          </div>
        </div>
      </SurfacePanel>
    </motion.div>
  );
}

function MetaBadge({
  label,
  mono = false,
}: {
  label: string;
  mono?: boolean;
}) {
  return (
    <div
      className={`rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/60 ${
        mono ? "font-mono text-[12px]" : ""
      }`}
    >
      {label}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="mb-2 text-sm text-white/40">{label}</div>
      <div className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
        {value}
      </div>
    </div>
  );
}
