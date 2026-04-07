"use client";

import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FilterBar({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-panel min-w-0 rounded-[28px] border border-white/10 p-3.5 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FilterBarSection({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}>{children}</div>;
}

export function FilterBarLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pr-2 text-[11px] font-semibold tracking-[0.18em] text-white/34 uppercase">
      {children}
    </div>
  );
}

export function FilterSearchField({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("relative min-w-[260px] flex-1", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/26" />
      <Input className="h-10 rounded-[16px] pl-11" data-pulsescope-primary-search="true" {...props} />
    </div>
  );
}

export function FilterChipButton({
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "rounded-full border px-3 py-1.5 text-[13px] font-medium transition focus-visible:ring-2 focus-visible:ring-[rgba(89,175,255,0.72)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(7,10,20)]",
        active
          ? "border-[rgba(102,150,255,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(94,126,255,0.08))] text-white"
          : "border-white/10 bg-white/[0.04] text-white/58 hover:border-white/16 hover:bg-white/[0.08] hover:text-white/78",
        className,
      )}
      type="button"
      {...props}
    />
  );
}

export function FilterSelect<TValue extends string>({
  items,
  onSelect,
  placeholder,
  value,
}: {
  items: { value: TValue; label: string; description?: string }[];
  onSelect: (value: TValue) => void;
  placeholder: string;
  value: TValue;
}) {
  const selected = items.find((item) => item.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-9 min-w-[132px] justify-between rounded-[16px] px-3.5 text-[13px]" size="sm" variant="secondary">
          <span>{selected?.label ?? placeholder}</span>
          <ChevronDown className="size-4 text-white/34" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.value} onClick={() => onSelect(item.value)}>
            <div>
              <div className="font-medium text-white">{item.label}</div>
              {item.description ? (
                <div className="text-xs text-white/38">{item.description}</div>
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
