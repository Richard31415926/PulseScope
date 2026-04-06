"use client";

import { ActivitySquare, MonitorDot, PanelLeftClose, Search, TimerReset } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  compareRangeOptions,
  environmentOptions,
  primaryNavigation,
  timeRangeOptions,
} from "@/lib/navigation";
import { savedViewPresets } from "@/lib/saved-views";
import { OPEN_COMPARE_MENU_EVENT, OPEN_SAVED_VIEWS_EVENT } from "@/lib/ux-events";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { useUiStore } from "@/store/ui-store";

export function CommandPalette() {
  const commandPaletteOpen = useUiStore((state) => state.commandPaletteOpen);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const { applySavedView, navigateWithWorkspace, replaceWorkspaceState, workspaceState } =
    useWorkspaceControls();

  function runAction(action: () => void) {
    action();
    setCommandPaletteOpen(false);
  }

  return (
    <Dialog onOpenChange={setCommandPaletteOpen} open={commandPaletteOpen}>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>
            Jump between surfaces, pivot the global environment, and toggle shell-level views.
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter>
          <CommandInput placeholder="Search routes, views, and operator actions..." />
          <CommandList>
            <CommandEmpty>No matching command. Try a route, environment, or saved view.</CommandEmpty>
            <CommandGroup heading="Navigate">
              {primaryNavigation.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() =>
                    runAction(() => {
                      navigateWithWorkspace(item.href);
                    })
                  }
                >
                  <item.icon className="size-4 text-white/48" />
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-xs text-white/38">{item.description}</div>
                  </div>
                  <CommandShortcut>{item.commandKey}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Environment">
              {environmentOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => runAction(() => replaceWorkspaceState({ environment: option.value }))}
                >
                  <MonitorDot className="size-4 text-white/48" />
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-white/38">{option.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Time Window">
              {timeRangeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => runAction(() => replaceWorkspaceState({ timeRange: option.value }))}
                >
                  <TimerReset className="size-4 text-white/48" />
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-white/38">{option.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Saved Views">
              {savedViewPresets.map((preset) => (
                <CommandItem key={preset.value} onSelect={() => runAction(() => applySavedView(preset.value))}>
                  <Search className="size-4 text-white/48" />
                  <div>
                    <div className="font-medium text-white">{preset.label}</div>
                    <div className="text-xs text-white/38">{preset.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Compare">
              {compareRangeOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() =>
                    runAction(() =>
                      replaceWorkspaceState({
                        compareMode: true,
                        compareRange: option.value,
                      }),
                    )
                  }
                >
                  <TimerReset className="size-4 text-white/48" />
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-white/38">{option.description}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Shell Actions">
              <CommandItem onSelect={() => runAction(toggleSidebar)}>
                <PanelLeftClose className="size-4 text-white/48" />
                <div>
                  <div className="font-medium text-white">Toggle Sidebar Density</div>
                  <div className="text-xs text-white/38">Collapse or expand the desktop navigation rail.</div>
                </div>
                <CommandShortcut>Cmd B</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runAction(() => replaceWorkspaceState({ compareMode: !workspaceState.compareMode }))
                }
              >
                <TimerReset className="size-4 text-white/48" />
                <div>
                  <div className="font-medium text-white">
                    {workspaceState.compareMode ? "Disable Time Compare" : "Enable Time Compare"}
                  </div>
                  <div className="text-xs text-white/38">
                    Flip the global comparison state for later chart overlays.
                  </div>
                </div>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runAction(() => {
                    window.dispatchEvent(new Event(OPEN_SAVED_VIEWS_EVENT));
                  })
                }
              >
                <Search className="size-4 text-white/48" />
                <div>
                  <div className="font-medium text-white">Open saved views</div>
                  <div className="text-xs text-white/38">Reveal the curated workspace presets menu.</div>
                </div>
                <CommandShortcut>Shift V</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runAction(() => {
                    window.dispatchEvent(new Event(OPEN_COMPARE_MENU_EVENT));
                  })
                }
              >
                <ActivitySquare className="size-4 text-white/48" />
                <div>
                  <div className="font-medium text-white">Open compare ranges</div>
                  <div className="text-xs text-white/38">Adjust the reference window for chart overlays.</div>
                </div>
                <CommandShortcut>Shift C</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runAction(() => {
                    const searchInput = document.querySelector<HTMLInputElement>(
                      "[data-pulsescope-primary-search='true']",
                    );
                    searchInput?.focus();
                    searchInput?.select();
                  })
                }
              >
                <Search className="size-4 text-white/48" />
                <div>
                  <div className="font-medium text-white">Focus current search</div>
                  <div className="text-xs text-white/38">
                    Jump directly into the active page’s primary search control.
                  </div>
                </div>
                <CommandShortcut>/</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
