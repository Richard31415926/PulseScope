"use client";

import { useRef } from "react";
import { EmptyState } from "@/components/shell/empty-state";
import { useVirtualList } from "@/hooks/use-virtual-list";
import { LogListRow } from "@/features/logs/components/log-list-row";
import type { LogRecord } from "@/types/pulsescope";

const collapsedRowHeight = 78;
const expandedRowHeight = 232;

const headerColumns = "146px 96px 176px minmax(0,1fr) 188px 28px";

export function VirtualizedLogList({
  expandedLogId,
  logs,
  onResetFilters,
  onToggleLog,
}: {
  expandedLogId: string | null;
  logs: LogRecord[];
  onResetFilters?: () => void;
  onToggleLog: (logId: string) => void;
}) {
  const rowRefs = useRef(new Map<number, HTMLButtonElement>());
  const { measurements, parentRef, totalSize, virtualItems } = useVirtualList({
    estimateSize: (log) => (log.id === expandedLogId ? expandedRowHeight : collapsedRowHeight),
    items: logs,
    overscan: 10,
  });

  function focusIndex(index: number) {
    const nextIndex = Math.max(0, Math.min(index, logs.length - 1));
    const measurement = measurements[nextIndex];
    const element = parentRef.current;

    if (!measurement || !element) {
      return;
    }

    element.scrollTop = measurement.start;

    globalThis.requestAnimationFrame(() => {
      rowRefs.current.get(nextIndex)?.focus();
    });
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        actionLabel={onResetFilters ? "Reset filters" : undefined}
        description="Try widening the search or resetting one of the filters to repopulate the stream."
        onAction={onResetFilters}
        title="No log events match this slice"
      />
    );
  }

  return (
    <div
      aria-label="Virtualized log table"
      className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]"
      role="table"
    >
      <div
        className="grid items-center gap-4 border-b border-white/8 bg-[rgba(25,30,40,0.9)] px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase backdrop-blur-xl"
        role="rowgroup"
        style={{ gridTemplateColumns: headerColumns }}
      >
        <div role="columnheader">Timestamp</div>
        <div role="columnheader">Level</div>
        <div role="columnheader">Service</div>
        <div role="columnheader">Message</div>
        <div role="columnheader">Trace</div>
        <div role="columnheader" />
      </div>

      <div className="h-[780px] overflow-auto px-1 py-1.5" ref={parentRef} role="rowgroup">
        <div className="relative" style={{ height: `${totalSize}px` }}>
          {virtualItems.map((virtualItem) => {
            const log = logs[virtualItem.index];

            return (
              <LogListRow
                buttonRef={(node) => {
                  if (node) {
                    rowRefs.current.set(virtualItem.index, node);
                    return;
                  }

                  rowRefs.current.delete(virtualItem.index);
                }}
                expanded={expandedLogId === log.id}
                index={virtualItem.index}
                key={log.id}
                log={log}
                onRequestFocus={focusIndex}
                onToggle={() => onToggleLog(log.id)}
                style={{
                  height: `${virtualItem.size}px`,
                  left: 0,
                  position: "absolute",
                  right: 0,
                  top: `${virtualItem.start}px`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
