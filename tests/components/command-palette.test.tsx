import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "@/components/layout/command-palette";
import { useUiStore } from "@/store/ui-store";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
  }),
  usePathname: () => "/overview",
}));

describe("command palette", () => {
  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    useUiStore.setState({
      sidebarCollapsed: false,
      mobileNavigationOpen: false,
      commandPaletteOpen: true,
      compareMode: false,
      activeCompareRange: "previous-period",
      activeEnvironment: "production",
      activeTimeRange: "1h",
      activeSavedView: "default",
    });
  });

  it("updates the environment from a command action", async () => {
    const user = userEvent.setup();

    render(<CommandPalette />);
    await user.click(screen.getByText("Staging"));

    expect(useUiStore.getState().activeEnvironment).toBe("staging");
    expect(replace).toHaveBeenCalledWith("/overview?env=staging", { scroll: false });
    expect(useUiStore.getState().commandPaletteOpen).toBe(false);
  });

  it("navigates to a route from the command palette", async () => {
    const user = userEvent.setup();

    render(<CommandPalette />);
    await user.click(screen.getByText("Traces"));

    expect(push).toHaveBeenCalledWith("/traces");
  });
});
