"use client";

import type { Route } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "@/components/shell/error-state";
import { PageHeader } from "@/components/shell/page-header";
import { StatusPill } from "@/components/shell/status-pill";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TraceDetailLoadingState } from "@/features/traces/components/trace-detail-loading-state";
import { TraceRelatedLogsPanel } from "@/features/traces/components/trace-related-logs-panel";
import { TraceSpanInspector } from "@/features/traces/components/trace-span-inspector";
import { TraceSummaryHeader } from "@/features/traces/components/trace-summary-header";
import { TraceWaterfallTimeline } from "@/features/traces/components/trace-waterfall-timeline";
import { buildTraceDetailSearchParams, getSelectedSpanId } from "@/features/traces/lib/trace-detail-url-state";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { queryKeys } from "@/lib/query-keys";
import { getTraceDetail, getTraceRelatedLogs } from "@/lib/mock-api/traces";

export function TraceDetailShell({ traceId }: { traceId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const traceQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.traceDetail(traceId),
    queryFn: () => getTraceDetail(traceId),
  });
  const relatedLogsQuery = useQuery({
    enabled: Boolean(traceId),
    queryKey: queryKeys.traceLogs(traceId),
    queryFn: () => getTraceRelatedLogs(traceId),
  });
  const tracesHref = useWorkspaceHref("/traces");

  if (traceQuery.isLoading) {
    return <TraceDetailLoadingState />;
  }

  if (traceQuery.isError || !traceQuery.data) {
    return (
      <ErrorState
        description="This trace detail could not be resolved from the local mock API."
        onRetry={() => traceQuery.refetch()}
        title="Trace detail unavailable"
      />
    );
  }

  const trace = traceQuery.data;
  const defaultSpanId =
    trace.spans.find((span) => span.name === trace.primarySpan)?.id ?? trace.spans[0]?.id ?? null;
  const selectedSpanId = getSelectedSpanId(searchParams) ?? defaultSpanId;
  const selectedSpan =
    trace.spans.find((span) => span.id === selectedSpanId) ?? trace.spans[0] ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href={tracesHref}>
                <ArrowLeft className="size-4" />
                Back to explorer
              </Link>
            </Button>
            <Button variant="default">Pin investigation</Button>
          </>
        }
        description="A dense investigation surface designed around the waterfall, with the inspector and correlated logs staying visible while you move across spans."
        eyebrow="Trace Investigation"
        meta={
          <>
            <StatusPill label={trace.status} />
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {trace.service}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {trace.environment}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {trace.region}
            </div>
          </>
        }
        title="Trace detail"
      />

      <TraceSummaryHeader trace={trace} />

      <ResizablePanelGroup autoSaveId="trace-detail-layout" className="min-h-[840px]" direction="horizontal">
        <ResizablePanel defaultSize={68} minSize={54}>
          <div className="h-full pr-2">
            <TraceWaterfallTimeline
              onSelectSpan={(spanId) =>
                router.replace(
                  `${pathname}?${buildTraceDetailSearchParams(searchParams, spanId)}` as Route,
                  {
                    scroll: false,
                  },
                )
              }
              selectedSpanId={selectedSpanId}
              trace={trace}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={32} minSize={28}>
          <div className="space-y-4 pl-2">
            <TraceSpanInspector span={selectedSpan} trace={trace} />
            <TraceRelatedLogsPanel
              isError={relatedLogsQuery.isError}
              isLoading={relatedLogsQuery.isLoading}
              logs={relatedLogsQuery.data ?? []}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
