import { Suspense } from "react";
import { OverviewLoadingState } from "@/features/overview/components/overview-loading-state";
import { OverviewShell } from "@/features/overview/components/overview-shell";

export default function OverviewPage() {
  return (
    <Suspense fallback={<OverviewLoadingState />}>
      <OverviewShell />
    </Suspense>
  );
}
