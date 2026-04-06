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
    <SurfacePanel className="flex min-h-56 items-center justify-center">
      <div className="max-w-md space-y-4 text-center" role="alert">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
          <AlertTriangle className="size-5" />
        </div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
          Error state
        </div>
        <div className="font-display text-2xl font-semibold text-white">{title}</div>
        <p className="text-sm leading-6 text-white/52">{description}</p>
        {onRetry || secondaryActionLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {onRetry ? (
              <Button onClick={onRetry} variant="secondary">
                Retry
              </Button>
            ) : null}
            {secondaryActionLabel ? (
              <Button onClick={onSecondaryAction} variant="ghost">
                {secondaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
