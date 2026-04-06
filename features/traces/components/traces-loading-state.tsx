import { PanelSkeleton } from "@/components/shell/panel-skeleton";

export function TracesLoadingState() {
  return (
    <div className="space-y-6">
      <PanelSkeleton className="min-h-40" lines={5} />
      <PanelSkeleton className="min-h-[760px]" lines={10} />
    </div>
  );
}
