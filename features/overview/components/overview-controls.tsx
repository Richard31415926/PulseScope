"use client";

import { Check, Clock3, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { CompareRangeMenu } from "@/components/layout/compare-range-menu";
import { SavedViewsMenu } from "@/components/layout/saved-views-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { environmentOptions, timeRangeOptions } from "@/lib/navigation";
import type { Environment, TimeRange } from "@/types/pulsescope";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { Button } from "@/components/ui/button";

interface SelectorProps<TValue extends string> {
  items: { value: TValue; label: string; description: string }[];
  label: string;
  onSelect: (value: TValue) => void;
  value: TValue;
}

function Selector<TValue extends string>({
  items,
  label,
  onSelect,
  value,
}: SelectorProps<TValue>) {
  const selected = items.find((item) => item.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-w-[172px] justify-between rounded-full" variant="secondary">
          <span className="truncate">{selected?.label ?? label}</span>
          <Check className="size-4 text-white/28" />
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

export function OverviewControls({
  generatedAt,
}: {
  generatedAt?: string;
}) {
  const { replaceWorkspaceState, workspaceState } = useWorkspaceControls();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="surface-panel flex min-w-0 flex-wrap items-center gap-2.5 rounded-[26px] border border-white/10 p-3"
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/48">
        <Layers3 className="size-4 shrink-0" />
        <span className="truncate">Overview scope</span>
      </div>
      <Selector
        items={environmentOptions}
        label="Environment"
        onSelect={(value) => replaceWorkspaceState({ environment: value as Environment })}
        value={workspaceState.environment}
      />
      <Selector
        items={timeRangeOptions}
        label="Time range"
        onSelect={(value) => replaceWorkspaceState({ timeRange: value as TimeRange })}
        value={workspaceState.timeRange}
      />
      <SavedViewsMenu triggerVariant="secondary" />
      <CompareRangeMenu compact />
      {generatedAt ? (
        <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/46">
          <Clock3 className="size-4 shrink-0" />
          <span className="truncate">{generatedAt}</span>
        </div>
      ) : null}
    </motion.div>
  );
}
