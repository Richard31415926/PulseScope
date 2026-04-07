import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function LogsLoadingState() {
  return (
    <div className="space-y-5">
      <PanelSkeleton className="min-h-28" lines={3} />
      <PanelSkeleton className="min-h-[118px]" lines={4} />
      <PanelSkeleton className="min-h-[780px]" lines={12} />
    </div>
  );
}
