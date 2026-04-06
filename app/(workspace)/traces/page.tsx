import { Suspense } from "react";
import { TracesExplorerShell } from "@/features/traces/components/traces-explorer-shell";
import { TracesLoadingState } from "@/features/traces/components/traces-loading-state";

export default function TracesPage() {
  return (
    <Suspense fallback={<TracesLoadingState />}>
      <TracesExplorerShell />
    </Suspense>
  );
}
