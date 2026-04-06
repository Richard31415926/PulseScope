"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, PanelLeftClose, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { environmentOptions, isActivePath, primaryNavigation, secondaryNavigation } from "@/lib/navigation";
import { buildWorkspaceHref } from "@/lib/workspace-state";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import type { CompareRange, Environment, SavedView, TimeRange } from "@/types/pulsescope";

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const compareMode = useUiStore((state) => state.compareMode);
  const compareRange = useUiStore((state) => state.activeCompareRange);
  const environment = useUiStore((state) => state.activeEnvironment);
  const savedView = useUiStore((state) => state.activeSavedView);
  const timeRange = useUiStore((state) => state.activeTimeRange);
  const currentEnvironment =
    environmentOptions.find((option) => option.value === environment)?.label ?? "Production";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 p-4">
        <Link
          className={cn(
            "overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-3",
            collapsed && "mx-auto",
          )}
          href={buildWorkspaceHref("/overview", {
            compareMode,
            compareRange,
            environment,
            savedView,
            timeRange,
          })}
          onClick={onNavigate}
        >
          <BrandMark compact={collapsed} />
        </Link>
      </div>

      <div className="px-4">
        <div className="surface-panel rounded-[24px] border border-white/10 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] tracking-[0.18em] text-white/34 uppercase">
            <Sparkles className="size-3.5" />
            {!collapsed ? <span>Current surface</span> : null}
          </div>
          <div className={cn("space-y-1", collapsed && "text-center")}>
            <div className="text-sm font-medium text-white">{collapsed ? "Live" : currentEnvironment}</div>
            {!collapsed ? (
              <div className="text-xs leading-5 text-white/44">
                Dense, trace-first shell with local mock APIs and keyboard navigation.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        <TooltipProvider>
          <NavSection
            collapsed={collapsed}
            compareMode={compareMode}
            compareRange={compareRange}
            environment={environment}
            items={primaryNavigation}
            label="Workspace"
            onNavigate={onNavigate}
            pathname={pathname}
            savedView={savedView}
            timeRange={timeRange}
          />
          <NavSection
            collapsed={collapsed}
            compareMode={compareMode}
            compareRange={compareRange}
            environment={environment}
            items={secondaryNavigation}
            label="Response"
            onNavigate={onNavigate}
            pathname={pathname}
            savedView={savedView}
            timeRange={timeRange}
          />
        </TooltipProvider>
      </nav>

      <div className="px-4 pb-4">
        <div className={cn("surface-panel rounded-[24px] border border-white/10 p-4", collapsed && "px-3")}>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 text-sm font-semibold text-white">
              PS
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">PulseScope Shell</div>
                <div className="text-xs text-white/42">Foundation milestone</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavSection({
  collapsed,
  compareMode,
  compareRange,
  environment,
  items,
  label,
  onNavigate,
  pathname,
  savedView,
  timeRange,
}: {
  collapsed: boolean;
  compareMode: boolean;
  compareRange: CompareRange;
  environment: Environment;
  items: typeof primaryNavigation;
  label: string;
  onNavigate?: () => void;
  pathname: string;
  savedView: SavedView;
  timeRange: TimeRange;
}) {
  return (
    <div className="space-y-3">
      {!collapsed ? (
        <div className="px-2 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
          {label}
        </div>
      ) : null}
      <div className="space-y-1.5">
        {items.map((item) => {
          const active = isActivePath(pathname, item.href);
          const navLink = (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-[22px] border px-3 py-3",
                active
                  ? "border-white/14 bg-white/[0.08] text-white"
                  : "border-transparent text-white/56 hover:border-white/8 hover:bg-white/[0.05] hover:text-white/86",
                collapsed && "justify-center px-0",
              )}
              href={buildWorkspaceHref(item.href, {
                compareMode,
                compareRange,
                environment,
                savedView,
                timeRange,
              })}
              onClick={onNavigate}
            >
              <item.icon className={cn("size-4 shrink-0", active ? "text-white" : "text-white/52")} />
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="truncate text-xs text-white/36">{item.description}</div>
                </div>
              ) : null}
              {!collapsed ? (
                <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] tracking-[0.16em] text-white/32 uppercase">
                  {item.commandKey}
                </span>
              ) : null}
            </Link>
          );

          if (!collapsed) {
            return <div key={item.href}>{navLink}</div>;
          }

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>{navLink}</TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="max-w-52 text-white/56">{item.description}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const mobileNavigationOpen = useUiStore((state) => state.mobileNavigationOpen);
  const setMobileNavigationOpen = useUiStore((state) => state.setMobileNavigationOpen);

  return (
    <>
      <aside className="hidden shrink-0 lg:block">
        <motion.div
          animate={{ width: sidebarCollapsed ? 106 : 312 }}
          className="relative h-screen border-r border-white/8 bg-black/18 backdrop-blur-xl"
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="absolute inset-y-0 right-0 w-px bg-white/6" />
          <div className="absolute inset-y-4 right-[-18px] z-10 flex items-start">
            <Button
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="surface-elevated rounded-full"
              onClick={toggleSidebar}
              size="icon"
              variant="ghost"
            >
              {sidebarCollapsed ? <PanelLeftClose className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          </div>
          <SidebarContent collapsed={sidebarCollapsed} />
        </motion.div>
      </aside>

      <Sheet onOpenChange={setMobileNavigationOpen} open={mobileNavigationOpen}>
        <SheetContent className="overflow-hidden" side="left">
          <div className="h-full border border-white/0">
            <SidebarContent collapsed={false} onNavigate={() => setMobileNavigationOpen(false)} />
          </div>
          <Separator className="sr-only" />
        </SheetContent>
      </Sheet>
    </>
  );
}
