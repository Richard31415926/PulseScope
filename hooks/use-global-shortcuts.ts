"use client";

import type { Route } from "next";
import { useEffect, useEffectEvent, useRef } from "react";
import { useWorkspaceControls } from "@/hooks/use-workspace-controls";
import { OPEN_COMPARE_MENU_EVENT, OPEN_SAVED_VIEWS_EVENT } from "@/lib/ux-events";
import { useUiStore } from "@/store/ui-store";

type RouteShortcut = "o" | "t" | "l" | "s" | "i" | "c";

const routeShortcutMap: Record<RouteShortcut, Route> = {
  o: "/overview",
  t: "/traces",
  l: "/logs",
  s: "/services",
  i: "/incidents",
  c: "/settings",
};

export function useGlobalShortcuts() {
  const { navigateWithWorkspace } = useWorkspaceControls();
  const commandPaletteOpen = useUiStore((state) => state.commandPaletteOpen);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const pendingPrefix = useRef<string | null>(null);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target;
    const targetIsEditable =
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox");

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setCommandPaletteOpen(!commandPaletteOpen);
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      toggleSidebar();
      return;
    }

    if (targetIsEditable) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>(
        "[data-pulsescope-primary-search='true']",
      );
      searchInput?.focus();
      searchInput?.select();
      return;
    }

    if (event.shiftKey && key === "v") {
      event.preventDefault();
      window.dispatchEvent(new Event(OPEN_SAVED_VIEWS_EVENT));
      return;
    }

    if (event.shiftKey && key === "c") {
      event.preventDefault();
      window.dispatchEvent(new Event(OPEN_COMPARE_MENU_EVENT));
      return;
    }

    if (event.shiftKey && key === "l") {
      event.preventDefault();
      document
        .querySelector<HTMLButtonElement>("[data-pulsescope-live-toggle='true']")
        ?.click();
      return;
    }

    if (pendingPrefix.current === "g" && key in routeShortcutMap) {
      event.preventDefault();
      pendingPrefix.current = null;
      navigateWithWorkspace(routeShortcutMap[key as RouteShortcut]);
      return;
    }

    if (key === "g") {
      pendingPrefix.current = "g";
      window.setTimeout(() => {
        pendingPrefix.current = null;
      }, 1_000);
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
