"use client";

import { Bell, ChevronDown, Command, Menu, PanelTop, Search, TimerReset } from "lucide-react";
import { usePathname } from "next/navigation";
import { CompareRangeMenu } from "@/components/layout/compare-range-menu";
import { SavedViewsMenu } from "@/components/layout/saved-views-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getRouteMeta, savedViewOptions, timeRangeOptions, environmentOptions } from "@/lib/navigation";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { useUiStore } from "@/store/ui-store";

function TopbarDropdown<TValue extends string>({
  items,
  label,
  onSelect,
  triggerIcon,
}: {
  items: { value: TValue; label: string; description: string }[];
  label: string;
  onSelect: (value: TValue) => void;
  triggerIcon?: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-9 min-w-[132px] justify-between rounded-[16px] px-3.5 text-[13px]"
          size="sm"
          variant="secondary"
        >
          <span className="flex items-center gap-2">
            {triggerIcon}
            <span>{label}</span>
          </span>
          <ChevronDown className="size-4 text-white/34" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.value} onClick={() => onSelect(item.value)}>
            <div>
              <div className="font-medium text-white">{item.label}</div>
              <div className="text-xs text-white/38">{item.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppTopbar() {
  const pathname = usePathname();
  const routeMeta = getRouteMeta(pathname);
  const setMobileNavigationOpen = useUiStore((state) => state.setMobileNavigationOpen);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const { replaceWorkspaceState, workspaceState } = useWorkspaceControls();

  const environmentLabel =
    environmentOptions.find((option) => option.value === workspaceState.environment)?.label ?? "Production";
  const timeRangeLabel =
    timeRangeOptions.find((option) => option.value === workspaceState.timeRange)?.label ?? "Last hour";

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(9,12,17,0.74)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            aria-label="Open navigation"
            className="lg:hidden"
            onClick={() => setMobileNavigationOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Menu className="size-4" />
          </Button>
          <div className="min-w-0 max-w-[360px]">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-white/32 uppercase">
              {routeMeta.eyebrow}
            </div>
            <div className="truncate text-sm font-medium text-white/82">{routeMeta.title}</div>
            <div className="hidden text-xs leading-5 text-white/52 2xl:block">{routeMeta.description}</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <TopbarDropdown
            items={environmentOptions}
            label={environmentLabel}
            onSelect={(value) => replaceWorkspaceState({ environment: value })}
            triggerIcon={<PanelTop className="size-4 text-white/40" />}
          />
          <TopbarDropdown
            items={timeRangeOptions}
            label={timeRangeLabel}
            onSelect={(value) => replaceWorkspaceState({ timeRange: value })}
            triggerIcon={<TimerReset className="size-4 text-white/40" />}
          />
          <SavedViewsMenu
            bridgeShortcut
            className="h-9 min-w-[142px] rounded-[16px] px-3.5 text-[13px]"
            label={savedViewOptions.find((option) => option.value === workspaceState.savedView)?.label ?? "Default View"}
          />
          <CompareRangeMenu bridgeShortcut className="h-9 rounded-[16px] px-3.5 text-[13px]" compact />
        </div>

        <div className="flex items-center gap-2">
          <Button
            aria-label="Open command palette"
            className="h-9 min-w-[148px] justify-between rounded-[16px] px-3.5 max-sm:size-10 max-sm:min-w-0"
            onClick={() => setCommandPaletteOpen(true)}
            size="sm"
            variant="secondary"
          >
            <span className="flex items-center gap-2 max-sm:hidden">
              <Search className="size-4 text-white/42" />
              <span className="text-white/72">Search</span>
            </span>
            <span className="hidden items-center gap-1 text-[11px] tracking-[0.18em] text-white/34 uppercase sm:flex">
              <Command className="size-3.5" />
              K
            </span>
            <Search className="size-4 sm:hidden" />
          </Button>
          <Button aria-label="Notifications" size="icon" variant="ghost">
            <Bell className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
