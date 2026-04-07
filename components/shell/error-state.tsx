import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfacePanel } from "@/components/shell/panel";

export function ErrorState({
  title = "Something slipped out of alignment",
  description = "The mock data layer didn’t respond as expected. Try reloading the current surface.",
  onRetry,
  secondaryActionLabel,
  onSecondaryAction,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}) {
  return (
    <SurfacePanel className="flex min-h-48 items-center justify-center rounded-[26px]">
      <div className="max-w-[34rem] space-y-3 text-center" role="alert">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-danger/28 bg-danger/10 text-danger">
          <AlertTriangle className="size-4.5" />
        </div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/32 uppercase">
          Query failed
        </div>
        <div className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] text-white">
          {title}
        </div>
        <p className="text-sm leading-6 text-white/50">{description}</p>
        {onRetry || secondaryActionLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {onRetry ? (
              <Button onClick={onRetry} size="sm" variant="secondary">
                Retry
              </Button>
            ) : null}
            {secondaryActionLabel ? (
              <Button onClick={onSecondaryAction} size="sm" variant="ghost">
                {secondaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
