import { Suspense } from "react";
import { TraceDetailLoadingState } from "@/features/traces/components/trace-detail-loading-state";
import { TraceDetailShell } from "@/features/traces/components/trace-detail-shell";

export default async function TraceDetailPage({
  params,
}: {
  params: Promise<{ traceId: string }>;
}) {
  const { traceId } = await params;

  return (
    <Suspense fallback={<TraceDetailLoadingState />}>
      <TraceDetailShell traceId={traceId} />
    </Suspense>
  );
}
