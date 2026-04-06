"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import { formatPercentage, formatRequestsPerMinute } from "@/lib/utils";
import type { SlowEndpointRow } from "@/types/pulsescope";

export function OverviewSlowEndpointsTable({
  endpoints,
}: {
  endpoints: SlowEndpointRow[];
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: 0.12, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <SurfacePanel
        description="High-cost routes ranked by latency contribution and operational risk rather than generic table noise."
        title="Top slow endpoints"
      >
        <div className="overflow-x-auto rounded-[24px] border border-white/8">
          <table className="w-full border-collapse">
            <thead className="bg-white/[0.03]">
              <tr className="text-left text-[11px] tracking-[0.18em] text-white/34 uppercase">
                <th className="px-4 py-3 font-semibold">Endpoint</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">P95</th>
                <th className="px-4 py-3 font-semibold">Traffic</th>
                <th className="px-4 py-3 font-semibold">Errors</th>
                <th className="px-4 py-3 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((endpoint) => (
                <tr
                  className="border-t border-white/8 bg-white/[0.02] transition hover:bg-white/[0.05]"
                  key={endpoint.id}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <StatusPill label={endpoint.status} />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">
                          {endpoint.method} {endpoint.endpoint}
                        </div>
                        <div className="text-sm text-white/42">Trace-linked hot path</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-white/66">{endpoint.service}</td>
                  <td className="px-4 py-4 text-sm text-white/46">{endpoint.region}</td>
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
