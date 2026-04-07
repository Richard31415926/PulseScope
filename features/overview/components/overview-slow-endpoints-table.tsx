"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { formatPercentage, formatRequestsPerMinute } from "@/lib/utils";
import type { SlowEndpointRow } from "@/types/pulsescope";

export function OverviewSlowEndpointsTable({
  endpoints,
}: {
  endpoints: SlowEndpointRow[];
}) {
  const tracesHref = useWorkspaceHref(
    "/traces",
    endpoints[0] ? { q: endpoints[0].endpoint, service: endpoints[0].service } : undefined,
  );

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: 0.12, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <SurfacePanel
        action={
          <Button asChild size="sm" variant="ghost">
            <Link href={tracesHref}>
              Open traces
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
        description="High-cost routes ranked by latency contribution and operational risk, tuned to feel like a real hot-path board instead of a generic dashboard table."
        title="Top slow endpoints"
      >
        <div className="overflow-x-auto rounded-[24px] border border-white/8 bg-black/[0.12]">
          <table className="w-full min-w-[860px] border-collapse table-fixed">
            <thead className="bg-white/[0.035]">
              <tr className="text-left text-[11px] tracking-[0.18em] text-white/34 uppercase">
                <th className="w-[35%] px-4 py-3 font-semibold">Endpoint</th>
                <th className="w-[14%] px-4 py-3 font-semibold">Service</th>
                <th className="w-[12%] px-4 py-3 font-semibold">Region</th>
                <th className="w-[10%] px-4 py-3 font-semibold">P95</th>
                <th className="w-[10%] px-4 py-3 font-semibold">Traffic</th>
                <th className="w-[8%] px-4 py-3 font-semibold">Errors</th>
                <th className="w-[11%] px-4 py-3 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr
                  className="border-t border-white/8 bg-white/[0.02] transition hover:bg-[linear-gradient(90deg,rgba(93,130,255,0.08),rgba(255,255,255,0.02))]"
                  key={endpoint.id}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <StatusPill label={endpoint.status} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">
                          {endpoint.method} {endpoint.endpoint}
                        </div>
                        <div className="truncate text-sm text-white/42">Trace-linked hot path</div>
                      </div>
                    </div>
                  </td>
                  <td className="truncate px-4 py-4 text-sm text-white/66">{endpoint.service}</td>
                  <td className="truncate px-4 py-4 text-sm text-white/46">{endpoint.region}</td>
                  <td className="px-4 py-4 text-sm font-medium text-white">{endpoint.latencyMs}ms</td>
                  <td className="px-4 py-4 text-sm text-white/66">
                    {formatRequestsPerMinute(endpoint.requestsPerMin)}
                  </td>
                  <td className="px-4 py-4 text-sm text-white/66">
                    {formatPercentage(endpoint.errorRate)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-danger/24 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
                      +{endpoint.changePct}%
                      <ArrowUpRight className="size-3.5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfacePanel>
    </motion.div>
  );
}
