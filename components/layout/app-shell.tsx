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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,110,255,0.11),transparent_24%),radial-gradient(circle_at_70%_20%,rgba(45,172,255,0.08),transparent_18%)]"
      />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <AppTopbar />
          <PageTransition>
            <main
              className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-[1700px] flex-col px-4 py-6 lg:px-8 lg:py-8"
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
