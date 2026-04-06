import { describe, expect, it } from "vitest";
import { filterLogs } from "@/features/logs/lib/logs-filtering";
import type { LogRecord } from "@/types/pulsescope";

const sampleLogs: LogRecord[] = [
  {
    id: "log-a",
    level: "error",
    message: "checkout request failed during ledger commit",
    service: "checkout-api",
    environment: "production",
    timestamp: "22:54:15.201",
    traceId: "trc_checkout",
    fields: [
      { key: "region", value: "eu-west-1" },
      { key: "customerSegment", value: "enterprise" },
    ],
  },
  {
    id: "log-b",
    level: "info",
    message: "profile snapshot resolved from graph-store",
    service: "profile-api",
    environment: "staging",
    timestamp: "22:50:11.182",
    fields: [{ key: "cacheState", value: "warm" }],
  },
];

describe("logs filtering", () => {
  it("filters by text, level, service, and environment", () => {
    const results = filterLogs(sampleLogs, {
      search: "ledger",
      level: "error",
      service: "checkout-api",
      environment: "production",
    });

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("log-a");
  });

  it("matches field values and trace ids through text search", () => {
    expect(
      filterLogs(sampleLogs, {
        search: "enterprise",
        level: "all",
        service: "all",
        environment: "all",
      }),
    ).toHaveLength(1);

    expect(
      filterLogs(sampleLogs, {
        search: "trc_checkout",
        level: "all",
        service: "all",
        environment: "all",
      }),
    ).toHaveLength(1);
  });
});
