import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurfacePanel } from "@/components/shell/panel";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  onSecondaryAction,
  secondaryActionLabel,
}: EmptyStateProps) {
  return (
    <SurfacePanel className="flex min-h-56 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/72">
          <SearchX className="size-5" />
        </div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase" role="status">
          Empty state
        </div>
        <div className="font-display text-2xl font-semibold text-white">{title}</div>
        <p className="text-sm leading-6 text-white/52">{description}</p>
        {actionLabel || secondaryActionLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {actionLabel ? (
              <Button onClick={onAction} variant="secondary">
                {actionLabel}
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
