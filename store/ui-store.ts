"use client";

import { create } from "zustand";
import type { CompareRange, Environment, SavedView, TimeRange } from "@/types/pulsescope";

interface WorkspacePreferences {
  compareMode: boolean;
  compareRange: CompareRange;
  environment: Environment;
  savedView: SavedView;
  timeRange: TimeRange;
}

interface UiState {
  sidebarCollapsed: boolean;
  mobileNavigationOpen: boolean;
  commandPaletteOpen: boolean;
  compareMode: boolean;
  activeCompareRange: CompareRange;
  activeEnvironment: Environment;
  activeTimeRange: TimeRange;
  activeSavedView: SavedView;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileNavigationOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCompareMode: (enabled: boolean) => void;
  setCompareRange: (range: CompareRange) => void;
  setEnvironment: (environment: Environment) => void;
  setTimeRange: (range: TimeRange) => void;
  setSavedView: (view: SavedView) => void;
  setWorkspacePreferences: (preferences: Partial<WorkspacePreferences>) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileNavigationOpen: false,
  commandPaletteOpen: false,
  compareMode: false,
  activeCompareRange: "previous-period",
  activeEnvironment: "production",
  activeTimeRange: "1h",
  activeSavedView: "default",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileNavigationOpen: (open) => set({ mobileNavigationOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setCompareMode: (enabled) => set({ compareMode: enabled }),
  setCompareRange: (range) => set({ activeCompareRange: range }),
  setEnvironment: (environment) => set({ activeEnvironment: environment }),
  setTimeRange: (range) => set({ activeTimeRange: range }),
  setSavedView: (view) => set({ activeSavedView: view }),
  setWorkspacePreferences: (preferences) =>
    set((state) => ({
      compareMode: preferences.compareMode ?? state.compareMode,
      activeCompareRange: preferences.compareRange ?? state.activeCompareRange,
      activeEnvironment: preferences.environment ?? state.activeEnvironment,
      activeSavedView: preferences.savedView ?? state.activeSavedView,
      activeTimeRange: preferences.timeRange ?? state.activeTimeRange,
    })),
}));
