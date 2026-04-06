import { describe, expect, it } from "vitest";
import {
  getSpanEndMs,
  getWaterfallOffsetPercent,
  getWaterfallScaleMax,
  getWaterfallTicks,
  getWaterfallWidthPercent,
} from "@/features/traces/lib/waterfall";

describe("waterfall helpers", () => {
  it("creates a readable nice-rounded scale", () => {
    expect(getWaterfallTicks(842)).toEqual([0, 200, 400, 600, 800, 1000]);
    expect(getWaterfallScaleMax(842)).toBe(1000);
  });

  it("converts timings into percentages against the scale", () => {
    expect(getWaterfallOffsetPercent(200, 1000)).toBe(20);
    expect(getWaterfallWidthPercent(250, 1000)).toBe(25);
  });

  it("calculates the span end timestamp", () => {
    expect(
      getSpanEndMs({
        id: "span-1",
        name: "db.query",
        service: "postgres-reader",
        durationMs: 148,
        offsetMs: 88,
        status: "ok",
        parentId: null,
        depth: 0,
        kind: "db",
        target: "orders datastore",
        summary: "query",
        selfTimeMs: 42,
        attributes: [],
      }),
    ).toBe(236);
  });
});
