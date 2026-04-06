import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SavedViewsMenu } from "@/components/layout/saved-views-menu";
import { OPEN_SAVED_VIEWS_EVENT } from "@/lib/ux-events";
import { useUiStore } from "@/store/ui-store";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/overview",
  useRouter: () => ({
    push,
    replace: vi.fn(),
  }),
}));

describe("saved views menu", () => {
  beforeEach(() => {
    push.mockReset();
    window.history.replaceState({}, "", "/overview");
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

  it("applies a saved view preset and navigates to its deep link", async () => {
    const user = userEvent.setup();

    render(<SavedViewsMenu />);

    await user.click(screen.getByRole("button", { name: /default view/i }));
    await user.click(screen.getByText("Latency War Room"));

    expect(push).toHaveBeenCalledWith(
      "/traces?view=latency-war-room&compare=1&duration=500-1000&sort=durationMs&status=slow",
    );
    expect(useUiStore.getState()).toMatchObject({
      compareMode: true,
      activeSavedView: "latency-war-room",
      activeTimeRange: "1h",
    });
  });

  it("opens from the bridge event when used as a global trigger", async () => {
    render(<SavedViewsMenu bridgeShortcut />);

    window.dispatchEvent(new Event(OPEN_SAVED_VIEWS_EVENT));

    await waitFor(() => {
      expect(screen.getByText("Latency War Room")).toBeVisible();
    });
  });
});
