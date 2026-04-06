"use client";

import { useCallback, useMemo } from "react";
import { GripVertical } from "lucide-react";
import {
  Group,
  type Layout,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  autoSaveId,
  className,
  defaultLayout: defaultLayoutProp,
  direction,
  onLayoutChanged,
  orientation,
  ...props
}: GroupProps & {
  autoSaveId?: string;
  direction?: "horizontal" | "vertical";
}) {
  const defaultLayout = useMemo(() => {
    if (!autoSaveId || typeof window === "undefined") {
      return defaultLayoutProp;
    }

    try {
      const stored = window.localStorage.getItem(`pulsescope:layout:${autoSaveId}`);
      return stored ? (JSON.parse(stored) as Layout) : defaultLayoutProp;
    } catch {
      return defaultLayoutProp;
    }
  }, [autoSaveId, defaultLayoutProp]);

  const handleLayoutChanged = useCallback(
    (layout: Layout) => {
      onLayoutChanged?.(layout);

      if (!autoSaveId || typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(`pulsescope:layout:${autoSaveId}`, JSON.stringify(layout));
    },
    [autoSaveId, onLayoutChanged],
  );

  return (
    <Group
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      defaultLayout={defaultLayout}
      orientation={direction ?? orientation}
      onLayoutChanged={handleLayoutChanged}
      {...props}
    />
  );
}

function ResizablePanel(props: PanelProps) {
  return <Panel {...props} />;
}

function ResizableHandle({
  className,
  withHandle,
  ...props
}: SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <Separator
      className={cn(
        "relative flex w-3 items-center justify-center outline-none after:absolute after:inset-y-2 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-white/10 hover:after:bg-white/24 focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-[rgba(122,145,255,0.72)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(7,10,20)]",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="surface-elevated z-10 rounded-full border border-white/10 p-1 text-white/40">
          <GripVertical className="size-3.5" />
        </div>
      ) : null}
    </Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
