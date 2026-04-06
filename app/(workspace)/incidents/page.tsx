import { Suspense } from "react";
import { IncidentsLoadingState } from "@/features/incidents/components/incidents-loading-state";
import { IncidentsShell } from "@/features/incidents/components/incidents-shell";

export default function IncidentsPage() {
  return (
    <Suspense fallback={<IncidentsLoadingState />}>
      <IncidentsShell />
    </Suspense>
  );
}
