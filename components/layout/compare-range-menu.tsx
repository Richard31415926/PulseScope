"use client";

import { ChevronsUpDown, GitCompareArrows, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { compareRangeOptions } from "@/lib/navigation";
import { OPEN_COMPARE_MENU_EVENT } from "@/lib/ux-events";
import { cn } from "@/lib/utils";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";

export function CompareRangeMenu({
  bridgeShortcut = false,
  className,
  compact = false,
}: {
  bridgeShortcut?: boolean;
  className?: string;
  compact?: boolean;
}) {
  const { replaceWorkspaceState, workspaceState } = useWorkspaceControls();
  const [open, setOpen] = useState(false);
  const activeRange =
    compareRangeOptions.find((option) => option.value === workspaceState.compareRange) ??
    compareRangeOptions[0];

  useEffect(() => {
    if (!bridgeShortcut) {
      return;
    }

    const openMenu = () => setOpen(true);
    window.addEventListener(OPEN_COMPARE_MENU_EVENT, openMenu);

    return () => {
      window.removeEventListener(OPEN_COMPARE_MENU_EVENT, openMenu);
    };
  }, [bridgeShortcut]);

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-pressed={workspaceState.compareMode}
          className={cn(
            "justify-between rounded-full",
            compact ? "min-w-[140px]" : "min-w-[196px]",
            className,
          )}
          data-pulsescope-compare-trigger={bridgeShortcut ? "global" : "local"}
          variant={workspaceState.compareMode ? "default" : "secondary"}
        >
          <span className="flex items-center gap-2 truncate">
            <GitCompareArrows className="size-4" />
            <span className="truncate">
              {workspaceState.compareMode ? activeRange.label : "Compare"}
            </span>
          </span>
          <ChevronsUpDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[320px]">
        <DropdownMenuLabel className="px-3 py-2 text-[11px] tracking-[0.18em] text-white/34 uppercase">
          Compare time ranges
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={workspaceState.compareMode}
          onCheckedChange={(checked) => replaceWorkspaceState({ compareMode: Boolean(checked) })}
        >
          <div>
            <div className="font-medium text-white">
              {workspaceState.compareMode ? "Compare enabled" : "Enable compare"}
            </div>
            <div className="text-xs text-white/38">
              Overlay a reference window across charts and saved views.
            </div>
          </div>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {compareRangeOptions.map((option) => {
          return (
            <DropdownMenuCheckboxItem
              checked={option.value === workspaceState.compareRange}
              key={option.value}
              onCheckedChange={() =>
                replaceWorkspaceState({
                  compareMode: true,
                  compareRange: option.value,
                })
              }
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white">{option.label}</div>
                <div className="mt-1 text-xs leading-5 text-white/38">{option.description}</div>
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}

        <DropdownMenuSeparator />

        <div className="px-3 py-3">
          <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-white/40">
              <Sparkle className="size-3.5" />
              Mock UI
            </div>
            <div className="text-sm leading-6 text-white/54">
              Compare controls are wired across the product shell, with chart overlays currently emphasized most heavily on the overview surface.
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
