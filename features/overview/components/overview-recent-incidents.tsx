"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock3, Users2 } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { StatusPill } from "@/components/shell/status-pill";
import type { OverviewIncidentSummary } from "@/types/pulsescope";

export function OverviewRecentIncidents({
  incidents,
}: {
  incidents: OverviewIncidentSummary[];
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: 0.18, duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <SurfacePanel
        description="Recent incidents stay tightly summarized so the page remains an executive-quality operational snapshot."
        title="Recent incidents"
      >
        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4"
                key={incident.id}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <AlertTriangle className="size-4 text-danger" />
                  <StatusPill label={incident.severity} />
                  <StatusPill label={incident.status} />
                </div>
                <div className="mb-2 font-medium text-white">{incident.title}</div>
                <p className="mb-4 text-sm leading-6 text-white/50">{incident.summary}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {incident.impactedServices.map((service) => (
                    <div
                      className="rounded-full border border-white/10 bg-black/14 px-3 py-1.5 text-xs text-white/54"
                      key={`${incident.id}-${service}`}
                    >
                      {service}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/42">
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4" />
                    Started {incident.startedAt}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users2 className="size-4" />
                    {incident.commander}
                  </span>
                  <span>{incident.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 text-center text-sm leading-6 text-white/44">
            No incidents touched this slice of the system. This is the quiet version of a good day.
          </div>
        )}
      </SurfacePanel>
    </motion.div>
  );
}
