"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TraceSortDirection } from "@/types/pulsescope";

export function DataTable({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[26px] border border-white/8 bg-black/10",
        className,
      )}
      role="table"
    >
      {children}
    </div>
  );
}

export function DataTableHeader({
  children,
  className,
  columns,
}: React.HTMLAttributes<HTMLDivElement> & { columns: string }) {
  return (
    <div
      className={cn(
        "grid items-center gap-3 border-b border-white/8 bg-white/[0.04] px-4 py-3",
        className,
      )}
      role="rowgroup"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}

export function DataTableHeaderCell({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase",
        className,
      )}
      role="columnheader"
    >
      {children}
    </div>
  );
}

export function DataTableSortButton({
  active,
  children,
  direction,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  direction: TraceSortDirection;
  onClick: () => void;
}) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-1 transition",
        active
          ? "text-white"
          : "text-white/38 hover:bg-white/[0.05] hover:text-white/70",
      )}
      onClick={onClick}
      type="button"
    >
      <span>{children}</span>
      <Icon className="size-3.5" />
    </button>
  );
}

export function DataTableBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div role="rowgroup">{children}</div>;
}

export function DataTableRow({
  active = false,
  children,
  className,
  columns,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  columns: string;
}) {
  return (
    <button
      className={cn(
        "group relative grid w-full items-center gap-3 border-t border-white/6 px-4 py-3 text-left transition first:border-t-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(122,145,255,0.72)] focus-visible:ring-inset",
        active
          ? "bg-[linear-gradient(90deg,rgba(104,123,255,0.11),rgba(255,255,255,0.02))]"
          : "bg-transparent hover:bg-[linear-gradient(90deg,rgba(104,123,255,0.07),rgba(255,255,255,0.02))]",
        className,
      )}
      aria-selected={active}
      role="row"
      style={{ gridTemplateColumns: columns }}
      type="button"
      {...props}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-3 left-1 w-1 rounded-full bg-transparent transition",
          active && "bg-[linear-gradient(180deg,rgba(140,162,255,0.9),rgba(91,188,255,0.3))]",
        )}
      />
      {children}
    </button>
  );
}

export function DataTableCell({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-w-0", className)} role="cell">
      {children}
    </div>
  );
}
