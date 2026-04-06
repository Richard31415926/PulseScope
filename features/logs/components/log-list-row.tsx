"use client";

import { memo } from "react";
import Link from "next/link";
import { ChevronDown, CornerDownRight, ExternalLink, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { cn } from "@/lib/utils";
import type { LogRecord } from "@/types/pulsescope";

const headerColumns = "126px 86px 176px minmax(0,1fr) 180px 28px";

function LogListRowComponent({
  buttonRef,
  expanded,
  index,
  log,
  onRequestFocus,
  onToggle,
  style,
}: {
  buttonRef?: (node: HTMLButtonElement | null) => void;
  expanded: boolean;
  index: number;
  log: LogRecord;
  onRequestFocus: (index: number) => void;
  onToggle: () => void;
  style: React.CSSProperties;
}) {
  const detailId = `log-row-details-${log.id}`;
  const traceHref = useWorkspaceHref(log.traceId ? `/traces/${log.traceId}` : "/traces");

  return (
    <div className="px-3 py-1.5" style={style}>
      <div
        className={cn(
          "overflow-hidden rounded-[24px] border transition",
          expanded
            ? "border-white/14 bg-[linear-gradient(180deg,rgba(104,123,255,0.08),rgba(255,255,255,0.03))]"
            : "border-white/8 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.05]",
        )}
      >
        <button
          aria-controls={detailId}
          aria-expanded={expanded}
          className="group grid w-full items-center gap-4 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,145,255,0.68)] focus-visible:ring-inset"
          data-log-row-index={index}
          data-testid={`log-row-${log.id}`}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              onRequestFocus(index + 1);
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              onRequestFocus(index - 1);
            }

            if (event.key === "Home") {
              event.preventDefault();
              onRequestFocus(0);
            }

            if (event.key === "End") {
              event.preventDefault();
              onRequestFocus(Number.MAX_SAFE_INTEGER);
            }
          }}
          ref={buttonRef}
          style={{ gridTemplateColumns: headerColumns }}
          type="button"
        >
          <div className="font-mono text-[12px] text-white/56">{log.timestamp}</div>

          <div className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", getLevelDotClass(log.level))} />
            <span className="text-xs font-medium tracking-[0.16em] text-white/64 uppercase">
              {log.level}
            </span>
          </div>

          <div className="min-w-0">
            <div className="truncate font-medium text-white">{log.service}</div>
            <div className="mt-1 text-xs text-white/38">{log.environment}</div>
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm text-white">{log.message}</div>
            <div className="mt-1 flex items-center gap-2 overflow-hidden text-xs text-white/34">
              {log.fields.slice(0, 2).map((field, fieldIndex) => (
                <span className="truncate" key={`${log.id}-${field.key}-${fieldIndex}`}>
                  {field.key}={field.value}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            {log.traceId ? (
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/16 px-3 py-2 text-xs text-white/64">
                <Link2 className="size-3.5 shrink-0 text-white/34" />
                <span className="truncate font-mono">{log.traceId}</span>
              </div>
            ) : (
              <div className="text-xs text-white/28">No trace correlation</div>
            )}
          </div>

          <ChevronDown
            className={cn(
              "size-4 justify-self-end text-white/30 transition",
              expanded && "rotate-180 text-white/58",
            )}
          />
        </button>

        {expanded ? (
          <div
            className="grid gap-4 border-t border-white/8 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_280px]"
            id={detailId}
          >
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                  Structured fields
                </div>
                <div className="flex flex-wrap gap-2">
                  {log.fields.map((field, fieldIndex) => (
                    <div
                      className="rounded-full border border-white/8 bg-black/18 px-3 py-1.5 text-xs text-white/58"
                      key={`${log.id}-${field.key}-${fieldIndex}`}
                    >
                      <span className="text-white/34">{field.key}</span>
                      <span className="mx-2 text-white/20">:</span>
                      <span className="font-mono text-[11px] text-white/76">{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/8 bg-black/18 p-4 text-sm leading-6 text-white/62">
                {log.message}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4">
                <div className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
                  Correlation
                </div>
                <div className="space-y-3">
                  <DetailLine label="Service" value={log.service} />
                  <DetailLine label="Environment" value={log.environment} />
                  <DetailLine label="Log id" value={log.id} mono />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {log.traceId ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={traceHref}>
                      Open trace
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                ) : null}
                <Badge variant="neutral" className="rounded-full px-3 py-2">
                  <CornerDownRight className="mr-1 size-3.5" />
                  keyboard expandable
                </Badge>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const LogListRow = memo(LogListRowComponent);

function DetailLine({
  label,
  mono = false,
  value,
}: {
  label: string;
  mono?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <div className="text-white/38">{label}</div>
      <div className={cn("truncate text-white", mono && "font-mono text-[12px]")}>{value}</div>
    </div>
  );
}

function getLevelDotClass(level: LogRecord["level"]) {
  if (level === "fatal" || level === "error") {
    return "bg-danger";
  }

  if (level === "warn") {
    return "bg-warning";
  }

  if (level === "info") {
    return "bg-success";
  }

  return "bg-info";
}
