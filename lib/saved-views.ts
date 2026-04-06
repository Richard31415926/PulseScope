import type { Route } from "next";
import { buildWorkspaceHref, type WorkspaceSearchState } from "@/lib/workspace-state";
import type { SavedView } from "@/types/pulsescope";

interface SavedViewPreset {
  description: string;
  href: Route;
  label: string;
  value: SavedView;
  workspace: Partial<WorkspaceSearchState>;
  params?: Record<string, string>;
}

export const savedViewPresets: SavedViewPreset[] = [
  {
    value: "default",
    label: "Default View",
    description: "Balanced cross-product operational readout for the current hour.",
    href: "/overview",
    workspace: {
      compareMode: false,
      environment: "production",
      savedView: "default",
      timeRange: "1h",
    },
  },
  {
    value: "handoff",
    label: "Handoff",
    description: "Shift handoff posture with longer-range context and compare enabled.",
    href: "/overview",
    workspace: {
      compareMode: true,
      compareRange: "previous-day",
      environment: "production",
      savedView: "handoff",
      timeRange: "24h",
    },
  },
  {
    value: "latency-war-room",
    label: "Latency War Room",
    description: "Trace-first view tuned for degraded request paths and tail investigations.",
    href: "/traces",
    workspace: {
      compareMode: true,
      compareRange: "previous-period",
      environment: "production",
      savedView: "latency-war-room",
      timeRange: "1h",
    },
    params: {
      duration: "500-1000",
      sort: "durationMs",
      status: "slow",
    },
  },
];

export function getSavedViewPreset(view: SavedView) {
  return savedViewPresets.find((preset) => preset.value === view) ?? savedViewPresets[0];
}

export function buildSavedViewHref(view: SavedView) {
  const preset = getSavedViewPreset(view);
  return buildWorkspaceHref(preset.href, preset.workspace, preset.params);
}
