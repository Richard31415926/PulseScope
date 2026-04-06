"use client";

import { MonitorDot, Save, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/shell/page-header";
import { SurfacePanel } from "@/components/shell/panel";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Button variant="default">Save preferences</Button>}
        description="The settings shell exposes the global state that already powers the app shell, which makes it a practical proving ground before persistence is added."
        eyebrow="Workspace"
        title="Shell defaults and operator preferences"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SurfacePanel description="These controls already drive the live topbar, shell badges, and command palette actions." title="Global context">
          <div className="space-y-4">
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
              icon={<Save className="size-4 text-white/40" />}
              items={savedViewOptions}
              onSelect={setSavedView}
              selected={activeSavedView}
              title="Saved view"
            />
          </div>
        </SurfacePanel>

        <SurfacePanel
          description="A few shell toggles are already functional and update the live layout immediately."
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
              description="Enable future comparison overlays across shared charts."
              label="Compare time ranges"
              onToggle={() => setCompareMode(!compareMode)}
              pressed={compareMode}
            />
          </div>
        </SurfacePanel>
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
            className={`w-full rounded-[22px] border px-4 py-3 text-left ${
              item.value === selected
                ? "border-white/16 bg-white/[0.08] text-white"
                : "border-white/8 bg-white/[0.03] text-white/62 hover:border-white/14 hover:bg-white/[0.05]"
            }`}
            key={item.value}
            onClick={() => onSelect(item.value)}
            type="button"
          >
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-white/42">{item.description}</div>
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
