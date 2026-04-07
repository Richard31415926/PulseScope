"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SurfacePanel } from "@/components/shell/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { getStatusTone } from "@/lib/utils";
import type { LogRecord } from "@/types/pulsescope";

export function TraceRelatedLogsPanel({
  isError,
  isLoading,
  logs,
}: {
  isError: boolean;
  isLoading: boolean;
  logs: LogRecord[];
}) {
  const logsHref = useWorkspaceHref("/logs");

  return (
    <SurfacePanel
      description="Correlated log lines stay in the same investigation rail so trace-level timing and textual evidence can be read together."
      title="Related logs"
      action={
        <Button asChild size="sm" variant="ghost">
          <Link href={logsHref}>
            Open explorer
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              className="animate-pulse rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4"
              key={index}
            >
              <div className="mb-3 h-3 w-28 rounded-full bg-white/10" />
              <div className="h-4 w-full rounded-full bg-white/10" />
              <div className="mt-2 h-4 w-2/3 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <InlineState
          description="The related log stream did not resolve from the local mock API."
          title="Logs unavailable"
        />
      ) : logs.length === 0 ? (
        <InlineState
          description="No correlated log entries were attached to this trace sample."
          title="No related logs"
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4"
              key={log.id}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant={getLogVariant(log.level)}>{log.level}</Badge>
                <div className="text-xs text-white/36">{log.timestamp}</div>
                <div className="text-xs text-white/26 [overflow-wrap:anywhere]">{log.service}</div>
              </div>
              <div className="text-sm leading-6 text-white/82">{log.message}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {log.fields.map((field, fieldIndex) => (
                  <div
                    className="rounded-full border border-white/8 bg-black/18 px-3 py-1.5 text-xs text-white/56"
                    key={`${log.id}-${field.key}-${fieldIndex}`}
                  >
                    <span className="text-white/32">{field.key}</span>
                    <span className="mx-2 text-white/20">:</span>
                    <span className="font-mono text-[11px] text-white/74 [overflow-wrap:anywhere]">
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </SurfacePanel>
  );
}

function InlineState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-8 text-center">
      <div className="font-medium text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/48">{description}</p>
    </div>
  );
}

function getLogVariant(level: LogRecord["level"]) {
  const tone = getStatusTone(level);

  if (tone === "danger") {
    return "danger";
  }

  if (tone === "warning") {
    return "warning";
  }

  if (tone === "success") {
    return "success";
  }

  return "neutral";
}
