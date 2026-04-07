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
  "minmax(330px,2.75fr) minmax(188px,1.15fr) minmax(188px,1fr) minmax(156px,0.9fr) minmax(136px,0.82fr) minmax(176px,0.9fr)";

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
      <DataTable className="min-w-[1140px]">
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
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[14px] border text-[11px] font-semibold tracking-[0.18em] uppercase transition",
                        getOrdinalClass(trace.status, active),
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] tracking-[0.16em] text-white/40 uppercase">
                          {trace.method}
                        </span>
                        <span className="text-[11px] font-medium text-white/38">{trace.httpStatus}</span>
                        <span className="text-[11px] tracking-[0.12em] text-white/28 uppercase">{trace.region}</span>
                      </div>
                      <div className="truncate text-[1.03rem] font-medium tracking-[-0.02em] text-white">
                        {trace.endpoint}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="truncate font-mono text-[12px] text-white/36">{trace.id}</span>
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
                    <div className="truncate text-sm text-white/36">{trace.operation}</div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill label={trace.status} />
                      <span className="truncate text-[10px] font-semibold tracking-[0.16em] text-white/28 uppercase">
                        {trace.primarySpan}
                      </span>
                    </div>
                    <div className="line-clamp-2 text-sm leading-5 text-white/42">{trace.primaryIssue}</div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1">
                    <div className="font-display text-lg font-semibold tracking-[-0.03em] text-white">
                      {formatDuration(trace.durationMs)}
                    </div>
                    <div className="text-sm text-white/38">
                      DB {formatDuration(trace.databaseTimeMs)} · Net {formatDuration(trace.networkTimeMs)}
                    </div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-white">{trace.spanCount} spans</div>
                    <div className="text-white/38">
                      {trace.servicePath.length} hops · {trace.correlatedLogs} logs
                    </div>
                  </div>
                </DataTableCell>

                <DataTableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-white">{trace.startedAt}</div>
                    <div className="line-clamp-1 leading-5 text-white/38">{trace.userImpact}</div>
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

function getOrdinalClass(status: TraceExplorerRow["status"], active: boolean) {
  if (status === "error") {
    return active
      ? "border-danger/28 bg-danger/12 text-danger"
      : "border-danger/18 bg-danger/8 text-danger/80";
  }

  if (status === "slow") {
    return active
      ? "border-warning/28 bg-warning/12 text-warning"
      : "border-warning/18 bg-warning/8 text-warning/80";
  }

  return active
    ? "border-info/24 bg-info/12 text-info"
    : "border-white/10 bg-white/[0.05] text-white/34";
}
