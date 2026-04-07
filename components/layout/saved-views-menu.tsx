"use client";

import { Check, ChevronsUpDown, LayoutTemplate, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { savedViewPresets } from "@/lib/saved-views";
import { OPEN_SAVED_VIEWS_EVENT } from "@/lib/ux-events";
import { cn } from "@/lib/utils";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";

export function SavedViewsMenu({
  bridgeShortcut = false,
  className,
  label,
  triggerVariant = "secondary",
}: {
  bridgeShortcut?: boolean;
  className?: string;
  label?: string;
  triggerVariant?: "default" | "secondary" | "ghost" | "outline";
}) {
  const { applySavedView, workspaceState } = useWorkspaceControls();
  const [open, setOpen] = useState(false);
  const activePreset =
    savedViewPresets.find((preset) => preset.value === workspaceState.savedView) ?? savedViewPresets[0];

  useEffect(() => {
    if (!bridgeShortcut) {
      return;
    }

    const openMenu = () => setOpen(true);
    window.addEventListener(OPEN_SAVED_VIEWS_EVENT, openMenu);

    return () => {
      window.removeEventListener(OPEN_SAVED_VIEWS_EVENT, openMenu);
    };
  }, [bridgeShortcut]);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("min-w-[154px] justify-between rounded-[16px]", className)}
          data-pulsescope-saved-views-trigger={bridgeShortcut ? "global" : "local"}
          size="sm"
          variant={triggerVariant}
        >
          <span className="flex items-center gap-2 truncate">
            <LayoutTemplate className="size-4 text-white/40" />
            <span className="truncate">{label ?? activePreset.label}</span>
          </span>
          <ChevronsUpDown className="size-4 text-white/34" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[320px]">
        <DropdownMenuLabel className="px-3 py-2 text-[11px] tracking-[0.18em] text-white/34 uppercase">
          Saved views
        </DropdownMenuLabel>

        {savedViewPresets.map((preset) => {
          const active = preset.value === workspaceState.savedView;

          return (
            <DropdownMenuItem key={preset.value} onClick={() => applySavedView(preset.value)}>
              <div className="flex w-full items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex size-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/0",
                    active && "text-white",
                  )}
                >
                  <Check className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-white">{preset.label}</div>
                  <div className="mt-1 text-xs leading-5 text-white/38">{preset.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <div className="flex items-start gap-3">
            <Plus className="mt-0.5 size-4 text-white/34" />
            <div>
              <div className="font-medium text-white">Save current view</div>
              <div className="text-xs text-white/38">
                Mocked for now. Presets are curated instead of user-authored.
              </div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
