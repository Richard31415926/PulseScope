import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function OverviewLoadingState() {
  return (
    <div className="space-y-6">
      <PanelSkeleton className="min-h-40" lines={4} />
      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PanelSkeleton key={`overview-card-skeleton-${index + 1}`} lines={4} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PanelSkeleton className="min-h-[430px]" lines={8} />
        <div className="grid gap-4">
          <PanelSkeleton className="min-h-[208px]" lines={6} />
          <PanelSkeleton className="min-h-[208px]" lines={6} />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <PanelSkeleton className="min-h-[420px]" lines={9} />
        <PanelSkeleton className="min-h-[420px]" lines={9} />
      </div>
    </div>
  );
}
