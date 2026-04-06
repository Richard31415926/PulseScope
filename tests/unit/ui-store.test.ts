import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "@/store/ui-store";

describe("ui store", () => {
  beforeEach(() => {
    useUiStore.setState({
      sidebarCollapsed: false,
      mobileNavigationOpen: false,
      commandPaletteOpen: false,
      compareMode: false,
      activeCompareRange: "previous-period",
      activeEnvironment: "production",
      activeTimeRange: "1h",
      activeSavedView: "default",
    });
  });

  it("toggles the sidebar state", () => {
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarCollapsed).toBe(true);
  });

  it("updates global selections", () => {
    useUiStore.getState().setEnvironment("staging");
    useUiStore.getState().setTimeRange("24h");
    useUiStore.getState().setSavedView("handoff");
    useUiStore.getState().setCompareMode(true);
    useUiStore.getState().setCompareRange("previous-day");

    expect(useUiStore.getState().activeEnvironment).toBe("staging");
    expect(useUiStore.getState().activeTimeRange).toBe("24h");
    expect(useUiStore.getState().activeSavedView).toBe("handoff");
    expect(useUiStore.getState().compareMode).toBe(true);
    expect(useUiStore.getState().activeCompareRange).toBe("previous-day");
  });

  it("applies workspace preferences in one update", () => {
    useUiStore.getState().setWorkspacePreferences({
      compareMode: true,
      compareRange: "deploy-baseline",
      environment: "development",
      savedView: "latency-war-room",
      timeRange: "6h",
    });

    expect(useUiStore.getState().compareMode).toBe(true);
    expect(useUiStore.getState().activeCompareRange).toBe("deploy-baseline");
    expect(useUiStore.getState().activeEnvironment).toBe("development");
    expect(useUiStore.getState().activeSavedView).toBe("latency-war-room");
    expect(useUiStore.getState().activeTimeRange).toBe("6h");
  });
});
