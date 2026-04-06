import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import type { CompareRange, Environment, SavedView, TimeRange } from "@/types/pulsescope";

export type AppRouteKey =
  | "overview"
  | "traces"
  | "trace-detail"
  | "logs"
  | "services"
  | "service-detail"
  | "incidents"
  | "settings";

export interface NavigationItem {
  title: string;
  href: Route;
  icon: LucideIcon;
  commandKey: string;
  description: string;
}

export interface RouteMeta {
  key: AppRouteKey;
  eyebrow: string;
  title: string;
  description: string;
}

export interface GlobalOption<TValue extends string> {
  value: TValue;
  label: string;
  description: string;
}

export type EnvironmentOption = GlobalOption<Environment>;
export type TimeRangeOption = GlobalOption<TimeRange>;
export type SavedViewOption = GlobalOption<SavedView>;
export type CompareRangeOption = GlobalOption<CompareRange>;
