import { describe, expect, it } from "vitest";
import { createLiveLogEntry, getLogsByTraceId, getLogsShellData } from "@/lib/mock-api/logs";

describe("logs mock api", () => {
  it("returns a large structured dataset with explorer metadata", async () => {
    const data = await getLogsShellData();

    expect(data.logs.length).toBeGreaterThan(2000);
    expect(data.services.length).toBeGreaterThan(10);
    expect(data.environments).toContain("production");
    expect(data.traceLinkedCount).toBeGreaterThan(0);
  });

  it("returns trace-correlated log slices and can synthesize live events", async () => {
    const correlated = await getLogsByTraceId("trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H");
    const live = createLiveLogEntry(4);

    expect(correlated.length).toBeGreaterThan(1);
    expect(correlated.every((log) => log.traceId === "trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H")).toBe(true);
    expect(live.id.startsWith("live-")).toBe(true);
    expect(live.fields.some((field) => field.key === "mode" && field.value === "live")).toBe(
      true,
    );
  });
});
