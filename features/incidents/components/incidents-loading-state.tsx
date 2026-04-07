import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function IncidentsLoadingState() {
  return (
    <div className="space-y-5">
      <PanelSkeleton className="min-h-28" lines={3} />
      <div className="grid gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PanelSkeleton className="min-h-[180px]" key={`incident-summary-${index + 1}`} lines={4} />
        ))}
      </div>
      <PanelSkeleton className="min-h-[760px]" lines={12} />
    </div>
  );
}
