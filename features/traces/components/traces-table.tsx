"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  DataTableSortButton,
} from "@/components/table/data-table";
import { StatusPill } from "@/components/shell/status-pill";
import { cn, formatDuration } from "@/lib/utils";
import type {
  TraceExplorerRow,
  TraceSortDirection,
  TraceSortKey,
} from "@/types/pulsescope";

const columns =
  "minmax(0,2.35fr) minmax(0,1.15fr) minmax(0,0.92fr) minmax(0,0.85fr) minmax(0,0.82fr) minmax(0,0.8fr)";

export function TracesTable({
  activeTraceId,
  onHoverTrace,
  onRowSelect,
  onSortChange,
  sortDirection,
  sortKey,
  traces,
}: {
  activeTraceId: string | null;
  onHoverTrace: (traceId: string) => void;
  onRowSelect: (traceId: string) => void;
  onSortChange: (key: TraceSortKey) => void;
  sortDirection: TraceSortDirection;
  sortKey: TraceSortKey;
  traces: TraceExplorerRow[];
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <DataTable className="min-w-[1040px]">
        <DataTableHeader columns={columns}>
          <DataTableHeaderCell>Trace</DataTableHeaderCell>
          <DataTableHeaderCell>
            <DataTableSortButton
              active={sortKey === "service"}
              direction={sortDirection}
              onClick={() => onSortChange("service")}
            >
              Service
            </DataTableSortButton>
          </DataTableHeaderCell>
          <DataTableHeaderCell>
            <DataTableSortButton
              active={sortKey === "status"}
              direction={sortDirection}
              onClick={() => onSortChange("status")}
            >
              Status
            </DataTableSortButton>
          </DataTableHeaderCell>
          <DataTableHeaderCell>
            <DataTableSortButton
              active={sortKey === "durationMs"}
              direction={sortDirection}
              onClick={() => onSortChange("durationMs")}
            >
              Duration
            </DataTableSortButton>
          </DataTableHeaderCell>
          <DataTableHeaderCell>
            <DataTableSortButton
              active={sortKey === "spanCount"}
              direction={sortDirection}
              onClick={() => onSortChange("spanCount")}
            >
              Spans
            </DataTableSortButton>
          </DataTableHeaderCell>
          <DataTableHeaderCell>
            <DataTableSortButton
              active={sortKey === "startedAt"}
              direction={sortDirection}
              onClick={() => onSortChange("startedAt")}
            >
              Started
            </DataTableSortButton>
          </DataTableHeaderCell>
        </DataTableHeader>

        <DataTableBody>
          {traces.map((trace, index) => {
            const active = activeTraceId === trace.id;

            return (
              <DataTableRow
                active={active}
                aria-label={`Open trace ${trace.id}`}
                className="relative"
                columns={columns}
                data-testid={`trace-row-${trace.id}`}
                key={trace.id}
                onClick={() => onRowSelect(trace.id)}
                onFocus={() => onHoverTrace(trace.id)}
                onMouseEnter={() => onHoverTrace(trace.id)}
              >
                <DataTableCell>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1 flex size-9 shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.05] text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase transition",
                        active && "border-white/16 bg-white/[0.08] text-white/70",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] tracking-[0.16em] text-white/40 uppercase">
                          {trace.method}
                        </span>
                        <span className="text-xs text-white/36">{trace.httpStatus}</span>
                        <span className="text-xs text-white/32">{trace.region}</span>
                      </div>
                      <div className="truncate font-medium text-white">{trace.endpoint}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="truncate text-sm text-white/40">{trace.id}</span>
                        <ArrowUpRight
                          className={cn(
                            "size-3.5 shrink-0 text-white/0 transition group-hover:text-white/36",
                            active && "text-white/36",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1">
                    <div className="truncate font-medium text-white">{trace.service}</div>
                    <div className="truncate text-sm text-white/40">{trace.operation}</div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-2">
                    <StatusPill label={trace.status} />
                    <div className="truncate text-sm text-white/42">{trace.primaryIssue}</div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1">
                    <div className="font-display text-lg font-semibold tracking-[-0.03em] text-white">
                      {formatDuration(trace.durationMs)}
                    </div>
                    <div className="text-sm text-white/38">
                      DB {formatDuration(trace.databaseTimeMs)}
                    </div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-white">{trace.spanCount} spans</div>
                    <div className="text-white/38">{trace.correlatedLogs} correlated logs</div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-white">{trace.startedAt}</div>
                    <div className="text-white/38">{trace.userImpact}</div>
                  </div>
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTable>
    </motion.div>
  );
}
