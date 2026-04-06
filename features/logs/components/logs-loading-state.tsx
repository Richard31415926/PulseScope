import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function LogsLoadingState() {
  return (
    <div className="space-y-6">
      <PanelSkeleton className="min-h-32" lines={4} />
      <PanelSkeleton className="min-h-[140px]" lines={5} />
      <PanelSkeleton className="min-h-[760px]" lines={12} />
    </div>
  );
}
