import { Suspense } from "react";
import { LogsLoadingState } from "@/features/logs/components/logs-loading-state";
import { LogsExplorerShell } from "@/features/logs/components/logs-explorer-shell";

export default function LogsPage() {
  return (
    <Suspense fallback={<LogsLoadingState />}>
      <LogsExplorerShell />
    </Suspense>
  );
}
