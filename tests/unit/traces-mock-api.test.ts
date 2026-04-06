import { describe, expect, it } from "vitest";
import { getTraceDetail, getTraceRelatedLogs, getTracesShellData } from "@/lib/mock-api/traces";

describe("trace mock api", () => {
  it("filters and sorts traces for the explorer", async () => {
    const data = await getTracesShellData({
      environment: "production",
      filters: {
        search: "",
        status: "error",
        service: "all",
        region: "all",
        method: "POST",
        duration: "500-1000",
        sortKey: "durationMs",
        sortDirection: "desc",
      },
    });

    expect(data.traces.length).toBeGreaterThan(0);
    expect(data.traces.every((trace) => trace.status === "error")).toBe(true);
    expect(data.traces.every((trace) => trace.method === "POST")).toBe(true);
    expect(data.traces.every((trace) => trace.durationMs >= 500 && trace.durationMs < 1000)).toBe(
      true,
    );
    expect(data.traces[0].durationMs).toBeGreaterThanOrEqual(
      data.traces[data.traces.length - 1].durationMs,
    );
  });

  it("returns trace detail records for preview and detail surfaces", async () => {
    const trace = await getTraceDetail("trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H");
    const logs = await getTraceRelatedLogs("trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H");

    expect(trace?.service).toBe("checkout-api");
    expect(trace?.spans.length).toBeGreaterThan(10);
    expect(trace?.spans.some((span) => span.depth > 1)).toBe(true);
    expect(trace?.rootCause).toContain("write-heavy");
    expect(logs.length).toBeGreaterThan(1);
  });
});
