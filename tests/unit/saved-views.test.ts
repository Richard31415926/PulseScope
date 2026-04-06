import { describe, expect, it } from "vitest";
import { buildSavedViewHref, getSavedViewPreset, savedViewPresets } from "@/lib/saved-views";

describe("saved views", () => {
  it("returns the requested preset when it exists", () => {
    expect(getSavedViewPreset("handoff")).toMatchObject({
      href: "/overview",
      value: "handoff",
      workspace: {
        compareMode: true,
        compareRange: "previous-day",
        timeRange: "24h",
      },
    });
  });

  it("falls back to the default preset for unknown values", () => {
    expect(getSavedViewPreset("not-real" as never)).toEqual(savedViewPresets[0]);
  });

  it("builds a deep link for the latency war room preset", () => {
    expect(buildSavedViewHref("latency-war-room")).toBe(
      "/traces?view=latency-war-room&compare=1&duration=500-1000&sort=durationMs&status=slow",
    );
  });
});
