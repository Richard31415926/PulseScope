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
    <SurfacePanel className="flex min-h-48 items-center justify-center rounded-[26px]">
      <div className="max-w-[34rem] space-y-3 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/68">
          <SearchX className="size-4.5" />
        </div>
        <div className="text-[11px] font-semibold tracking-[0.18em] text-white/32 uppercase" role="status">
          No results in this slice
        </div>
        <div className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] text-white">
          {title}
        </div>
        <p className="text-sm leading-6 text-white/50">{description}</p>
        {actionLabel || secondaryActionLabel ? (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {actionLabel ? (
              <Button onClick={onAction} size="sm" variant="secondary">
                {actionLabel}
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
