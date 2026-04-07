"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { PageTransition } from "@/components/layout/page-transition";
import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";
import { useSyncWorkspaceUrlState } from "@/hooks/use-workspace-controls";

export function AppShell({ children }: { children: React.ReactNode }) {
  useGlobalShortcuts();
  useSyncWorkspaceUrlState();

  return (
    <div className="relative min-h-screen">
      <a className="skip-link" href="#workspace-content">
        Skip to content
      </a>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(86,142,255,0.1),transparent_24%),radial-gradient(circle_at_78%_12%,rgba(44,191,255,0.07),transparent_18%),radial-gradient(circle_at_82%_100%,rgba(255,182,95,0.04),transparent_20%)]"
      />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <AppTopbar />
          <PageTransition>
            <main
              className="mx-auto flex min-h-[calc(100vh-74px)] w-full max-w-[1720px] flex-col px-4 py-4 lg:px-8 lg:py-6"
              id="workspace-content"
              tabIndex={-1}
            >
              {children}
            </main>
          </PageTransition>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
