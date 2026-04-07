"use client";

import type { Route } from "next";
import Link from "next/link";
import { BellRing, Command, LayoutTemplate, MonitorDot, PanelLeft, Search, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { SurfacePanel } from "@/components/shell/panel";
import { Button } from "@/components/ui/button";
import { useWorkspaceHref } from "@/hooks/use-workspace-href";
import { environmentOptions, savedViewOptions, timeRangeOptions } from "@/lib/navigation";
import { useUiStore } from "@/store/ui-store";

export function SettingsShell() {
  const activeEnvironment = useUiStore((state) => state.activeEnvironment);
  const activeTimeRange = useUiStore((state) => state.activeTimeRange);
  const activeSavedView = useUiStore((state) => state.activeSavedView);
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const compareMode = useUiStore((state) => state.compareMode);
  const setEnvironment = useUiStore((state) => state.setEnvironment);
  const setTimeRange = useUiStore((state) => state.setTimeRange);
  const setSavedView = useUiStore((state) => state.setSavedView);
  const setCompareMode = useUiStore((state) => state.setCompareMode);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const overviewHref = useWorkspaceHref("/overview");
  const tracesHref = useWorkspaceHref("/traces");
  const logsHref = useWorkspaceHref("/logs");
  const servicesHref = useWorkspaceHref("/services");
  const incidentsHref = useWorkspaceHref("/incidents");

  return (
    <div className="space-y-5">
      <PageHeader
        actions={<Button variant="default">Save workspace profile</Button>}
        density="tight"
        description="Shape the shared defaults behind PulseScope: environment, time window, compare posture, saved views, and shell behavior all feed directly into the investigative workflow."
        eyebrow="Workspace"
        meta={
          <>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {activeEnvironment}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {activeTimeRange}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              {activeSavedView}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/62">
              compare {compareMode ? "on" : "off"}
            </div>
          </>
        }
        title="Shell defaults and operator preferences"
      />

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-4">
          <SurfacePanel
            description="These defaults already drive the live topbar, URL state, command palette actions, and page-level query posture."
            title="Default investigation scope"
          >
            <div className="grid gap-4 xl:grid-cols-3">
              <OptionGroup
                icon={<MonitorDot className="size-4 text-white/40" />}
                items={environmentOptions}
                onSelect={setEnvironment}
                selected={activeEnvironment}
                title="Environment"
              />
              <OptionGroup
                icon={<TimerReset className="size-4 text-white/40" />}
                items={timeRangeOptions}
                onSelect={setTimeRange}
                selected={activeTimeRange}
                title="Time range"
              />
              <OptionGroup
                icon={<LayoutTemplate className="size-4 text-white/40" />}
                items={savedViewOptions}
                onSelect={setSavedView}
                selected={activeSavedView}
                title="Saved view"
              />
            </div>
          </SurfacePanel>

          <SurfacePanel
            description="These shell behaviors affect how quickly an operator can scan, pivot, and keep context while moving across signals."
            title="Operator ergonomics"
          >
            <div className="space-y-3">
              <ToggleRow
                description="Collapse or expand the desktop navigation rail."
                label="Compact sidebar"
                onToggle={toggleSidebar}
                pressed={sidebarCollapsed}
              />
              <ToggleRow
                description="Enable comparison language and baseline deltas across shared views."
                label="Compare time ranges"
                onToggle={() => setCompareMode(!compareMode)}
                pressed={compareMode}
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <PreferenceNote
                icon={<Command className="size-4 text-white/36" />}
                label="Command palette"
                value="Cmd/Ctrl + K keeps route jumps and shell actions one keystroke away."
              />
              <PreferenceNote
                icon={<PanelLeft className="size-4 text-white/36" />}
                label="Panel memory"
                value="Resizable workspaces persist their proportions so investigations feel continuous."
              />
            </div>
          </SurfacePanel>
        </div>

        <div className="space-y-4">
          <SurfacePanel
            description="A compact snapshot of the current shell posture so preference changes stay grounded in real operator context."
            title="Current workspace snapshot"
          >
            <div className="grid gap-3">
              <SnapshotRow label="Environment" value={activeEnvironment} />
              <SnapshotRow label="Time window" value={activeTimeRange} />
              <SnapshotRow label="Saved view" value={activeSavedView} />
              <SnapshotRow label="Compare mode" value={compareMode ? "enabled" : "disabled"} />
              <SnapshotRow label="Navigation" value={sidebarCollapsed ? "compact rail" : "expanded rail"} />
            </div>
          </SurfacePanel>

          <SurfacePanel
            description="Settings should shorten the path back into actual work, not trap the operator on a dead-end preferences page."
            title="Launch surfaces"
          >
            <div className="space-y-3">
              <LaunchLink description="Start from system posture and current anomalies." href={overviewHref} label="Open overview" />
              <LaunchLink description="Jump straight into trace-first request scanning." href={tracesHref} label="Open traces" />
              <LaunchLink description="Review the live or filtered log stream." href={logsHref} label="Open logs" />
              <LaunchLink description="Check ownership, dependencies, and service posture." href={servicesHref} label="Open services" />
              <LaunchLink description="Return to active coordination and severity context." href={incidentsHref} label="Open incidents" />
            </div>
          </SurfacePanel>

          <SurfacePanel
            description="These notes describe how the current frontend-only product behaves today, before persistence or backend policy wiring exists."
            title="Shell behavior"
          >
            <div className="space-y-3">
              <PreferenceNote
                icon={<Search className="size-4 text-white/36" />}
                label="URL-synced state"
                value="Environment, time range, compare mode, saved views, and page filters stay deep-linkable."
              />
              <PreferenceNote
                icon={<BellRing className="size-4 text-white/36" />}
                label="Mock operational cues"
                value="Live mode, incidents, and compare UI are wired as realistic frontend patterns on local data."
              />
            </div>
          </SurfacePanel>
        </div>
      </div>
    </div>
  );
}

function OptionGroup<TValue extends string>({
  icon,
  items,
  onSelect,
  selected,
  title,
}: {
  icon: React.ReactNode;
  items: { value: TValue; label: string; description: string }[];
  onSelect: (value: TValue) => void;
  selected: TValue;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-white/46">
        {icon}
        {title}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${
              item.value === selected
                ? "border-white/16 bg-white/[0.08] text-white"
                : "border-white/8 bg-white/[0.03] text-white/62 hover:border-white/14 hover:bg-white/[0.05]"
            }`}
            key={item.value}
            onClick={() => onSelect(item.value)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-white/42">{item.description}</div>
              </div>
              <div
                className={`mt-0.5 size-2.5 shrink-0 rounded-full ${
                  item.value === selected ? "bg-info" : "bg-white/12"
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({
  description,
  label,
  onToggle,
  pressed,
}: {
  description: string;
  label: string;
  onToggle: () => void;
  pressed: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div>
        <div className="font-medium text-white">{label}</div>
        <div className="text-sm text-white/42">{description}</div>
      </div>
      <Button aria-pressed={pressed} onClick={onToggle} variant={pressed ? "default" : "secondary"}>
        {pressed ? "On" : "Off"}
      </Button>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="text-sm text-white/40">{label}</div>
      <div className="text-sm font-medium text-white capitalize">{value}</div>
    </div>
  );
}

function LaunchLink({
  description,
  href,
  label,
}: {
  description: string;
  href: Route;
  label: string;
}) {
  return (
    <Button asChild className="h-auto w-full justify-between rounded-[18px] px-4 py-3" variant="secondary">
      <Link href={href}>
        <span className="min-w-0 text-left">
          <span className="block font-medium text-white">{label}</span>
          <span className="mt-1 block text-sm leading-5 text-white/42">{description}</span>
        </span>
      </Link>
    </Button>
  );
}

function PreferenceNote({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-sm text-white/44">
        {icon}
        {label}
      </div>
      <div className="text-sm leading-6 text-white/50">{value}</div>
    </div>
  );
}
