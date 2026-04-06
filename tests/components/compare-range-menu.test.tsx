import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CompareRangeMenu } from "@/components/layout/compare-range-menu";
import { OPEN_COMPARE_MENU_EVENT } from "@/lib/ux-events";
import { useUiStore } from "@/store/ui-store";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/overview",
  useRouter: () => ({
    push: vi.fn(),
    replace,
  }),
}));

describe("compare range menu", () => {
  beforeEach(() => {
    replace.mockReset();
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

  it("enables compare mode and writes the selected range into the url state", async () => {
    const user = userEvent.setup();

    render(<CompareRangeMenu />);

    await user.click(screen.getByRole("button", { name: /^compare/i }));
    await user.click(screen.getByText("Previous day"));

    expect(replace).toHaveBeenCalledWith("/overview?cmpRange=previous-day&compare=1", {
      scroll: false,
    });
    expect(useUiStore.getState()).toMatchObject({
      compareMode: true,
      activeCompareRange: "previous-day",
    });
  });

  it("opens from the bridge event when used as a global trigger", async () => {
    render(<CompareRangeMenu bridgeShortcut />);

    window.dispatchEvent(new Event(OPEN_COMPARE_MENU_EVENT));

    await waitFor(() => {
      expect(screen.getByText("Previous day")).toBeVisible();
    });
  });
});
