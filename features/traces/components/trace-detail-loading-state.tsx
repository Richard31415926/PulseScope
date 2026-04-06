import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function TraceDetailLoadingState() {
  return (
    <div className="space-y-6">
      <PanelSkeleton className="min-h-32" lines={4} />
      <PanelSkeleton className="min-h-[240px]" lines={8} />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PanelSkeleton className="min-h-[720px]" lines={12} />
        <div className="space-y-4">
          <PanelSkeleton className="min-h-[320px]" lines={8} />
          <PanelSkeleton className="min-h-[320px]" lines={8} />
        </div>
      </div>
    </div>
  );
}
