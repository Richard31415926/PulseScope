"use client";

import { ActivitySquare, Link2, Rows3 } from "lucide-react";
import {
  FilterBar,
  FilterBarLabel,
  FilterBarSection,
  FilterChipButton,
  FilterSearchField,
  FilterSelect,
} from "@/components/filter-bar/filter-bar";
import type { Environment, LogLevel, LogsExplorerFilters } from "@/types/pulsescope";

const levelOptions: Array<{ label: string; value: LogLevel | "all" }> = [
  { value: "all", label: "All levels" },
  { value: "fatal", label: "Fatal" },
  { value: "error", label: "Error" },
  { value: "warn", label: "Warn" },
  { value: "info", label: "Info" },
  { value: "debug", label: "Debug" },
];

export function LogsFilterBar({
  environments,
  errorLikeCount,
  filters,
  onChange,
  services,
  totalCount,
  traceLinkedCount,
  visibleCount,
}: {
  environments: Environment[];
  errorLikeCount: number;
  filters: LogsExplorerFilters;
  onChange: (updates: Partial<LogsExplorerFilters>) => void;
  services: string[];
  totalCount: number;
  traceLinkedCount: number;
  visibleCount: number;
}) {
  return (
    <FilterBar>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <FilterSearchField
            aria-label="Search logs"
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search messages, fields, services, or trace IDs"
            value={filters.search}
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              items={[
                { value: "all", label: "All services", description: "Cross-service log stream" },
                ...services.map((service) => ({
                  value: service,
                  label: service,
                  description: "Narrow the stream to one service",
                })),
              ]}
              onSelect={(value) => onChange({ service: value })}
              placeholder="Service"
              value={filters.service}
            />
            <FilterSelect
              items={[
                { value: "all", label: "All environments", description: "Production, staging, and development" },
                ...environments.map((environment) => ({
                  value: environment,
                  label: environment,
                  description: "Limit the stream to one environment",
                })),
              ]}
              onSelect={(value) => onChange({ environment: value })}
              placeholder="Environment"
              value={filters.environment}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <FilterBarSection>
            <FilterBarLabel>Level</FilterBarLabel>
            {levelOptions.map((option) => (
              <FilterChipButton
                active={filters.level === option.value}
                key={option.value}
                onClick={() => onChange({ level: option.value })}
              >
                {option.label}
              </FilterChipButton>
            ))}
          </FilterBarSection>

          <div className="flex flex-wrap gap-2">
            <SummaryBadge icon={<Rows3 className="size-4" />} label="Visible" value={`${visibleCount}/${totalCount}`} />
            <SummaryBadge icon={<Link2 className="size-4" />} label="Trace-linked" value={`${traceLinkedCount}`} />
            <SummaryBadge icon={<ActivitySquare className="size-4" />} label="Error-like" value={`${errorLikeCount}`} />
          </div>
        </div>
      </div>
    </FilterBar>
  );
}

function SummaryBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
      <span className="text-white/36">{icon}</span>
      <span className="text-sm text-white/42">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
