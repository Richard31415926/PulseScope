import { describe, expect, it } from "vitest";
import {
  buildTraceSearchParams,
  defaultTraceFilters,
  getTraceFilterKey,
  getTraceFiltersFromSearchParams,
} from "@/features/traces/lib/traces-url-state";

describe("trace url state", () => {
  it("parses valid trace filters from search params", () => {
    const searchParams = new URLSearchParams(
      "q=checkout&status=error&service=checkout-api&region=eu-west-1&method=POST&duration=500-1000&sort=durationMs&dir=asc",
    );

    expect(getTraceFiltersFromSearchParams(searchParams)).toEqual({
      search: "checkout",
      status: "error",
      service: "checkout-api",
      region: "eu-west-1",
      method: "POST",
      duration: "500-1000",
      sortKey: "durationMs",
      sortDirection: "asc",
    });
  });

  it("drops default values when serializing filters back to the url", () => {
    const searchParams = new URLSearchParams("status=error");
    const query = buildTraceSearchParams(searchParams, {
      ...defaultTraceFilters,
      search: "orders",
      status: "all",
      service: "order-orchestrator",
    });

    expect(query).toBe("q=orders&service=order-orchestrator");
  });

  it("creates a stable cache key", () => {
    expect(getTraceFilterKey(defaultTraceFilters)).toBe(JSON.stringify(defaultTraceFilters));
  });
});
