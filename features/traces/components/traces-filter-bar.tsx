"use client";

import { ActivitySquare, GaugeCircle, Rows3 } from "lucide-react";
import {
  FilterBar,
  FilterBarLabel,
  FilterBarSection,
  FilterChipButton,
  FilterSearchField,
  FilterSelect,
} from "@/components/filter-bar/filter-bar";
import { formatDuration } from "@/lib/utils";
import type { HttpMethod, TraceDurationRange, TracesExplorerFilters, TraceStatus } from "@/types/pulsescope";

const statusOptions: Array<{ value: TraceStatus | "all"; label: string }> = [
  { value: "all", label: "All traces" },
  { value: "error", label: "Errors" },
  { value: "slow", label: "Slow" },
  { value: "ok", label: "Healthy" },
];

const durationOptions: Array<{ value: TraceDurationRange; label: string }> = [
  { value: "all", label: "All durations" },
  { value: "under-200", label: "< 200ms" },
  { value: "200-500", label: "200-500ms" },
  { value: "500-1000", label: "500ms-1s" },
  { value: "1000-plus", label: "1s+" },
];

export function TracesFilterBar({
  averageDurationMs,
  errorCount,
  filters,
  matchedCount,
  methods,
  onChange,
  regions,
  services,
  totalCount,
}: {
  averageDurationMs: number;
  errorCount: number;
  filters: TracesExplorerFilters;
  matchedCount: number;
  methods: HttpMethod[];
  onChange: (updates: Partial<TracesExplorerFilters>) => void;
  regions: string[];
  services: string[];
  totalCount: number;
}) {
  const serviceItems = [
    { value: "all", label: "All services", description: "Cross-service request flow" },
    ...services.map((service) => ({
      value: service,
      label: service,
      description: "Narrow to a single service boundary",
    })),
  ];
  const regionItems = [
    { value: "all", label: "All regions", description: "Cross-region request view" },
    ...regions.map((region) => ({
      value: region,
      label: region,
      description: "Region-specific trace slice",
    })),
  ];

  return (
    <FilterBar>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <FilterSearchField
            aria-label="Search traces"
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search by trace ID, endpoint, or operation"
            value={filters.search}
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              items={serviceItems}
              onSelect={(value) => onChange({ service: value })}
              placeholder="Service"
              value={filters.service}
            />
            <FilterSelect
              items={regionItems}
              onSelect={(value) => onChange({ region: value })}
              placeholder="Region"
              value={filters.region}
            />
          </div>
        </div>

        <FilterBarSection>
          <FilterBarLabel>Status</FilterBarLabel>
          {statusOptions.map((option) => (
            <FilterChipButton
              active={filters.status === option.value}
              key={option.value}
              onClick={() => onChange({ status: option.value })}
            >
              {option.label}
            </FilterChipButton>
          ))}
        </FilterBarSection>

        <FilterBarSection>
          <FilterBarLabel>Method</FilterBarLabel>
          <FilterChipButton
            active={filters.method === "all"}
            onClick={() => onChange({ method: "all" })}
          >
            All methods
          </FilterChipButton>
          {methods.map((method) => (
            <FilterChipButton
              active={filters.method === method}
              key={method}
              onClick={() => onChange({ method })}
            >
              {method}
            </FilterChipButton>
          ))}
        </FilterBarSection>

        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <FilterBarSection>
            <FilterBarLabel>Duration</FilterBarLabel>
            {durationOptions.map((option) => (
              <FilterChipButton
                active={filters.duration === option.value}
                key={option.value}
                onClick={() => onChange({ duration: option.value })}
              >
                {option.label}
              </FilterChipButton>
            ))}
          </FilterBarSection>

          <div className="flex flex-wrap gap-2">
            <SummaryBadge icon={<Rows3 className="size-4" />} label="Matched" value={`${matchedCount}/${totalCount}`} />
            <SummaryBadge
              icon={<GaugeCircle className="size-4" />}
              label="Avg duration"
              value={matchedCount > 0 ? formatDuration(averageDurationMs) : "0ms"}
            />
            <SummaryBadge icon={<ActivitySquare className="size-4" />} label="Errors" value={`${errorCount}`} />
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
