import { describe, expect, it } from "vitest";
import { getRouteMeta, isActivePath } from "@/lib/navigation";
import { formatDuration } from "@/lib/utils";

describe("navigation helpers", () => {
  it("resolves detail routes to the correct metadata", () => {
    expect(getRouteMeta("/traces/trc_123").key).toBe("trace-detail");
    expect(getRouteMeta("/services/checkout-api").key).toBe("service-detail");
  });

  it("marks nested paths as active", () => {
    expect(isActivePath("/services/checkout-api", "/services")).toBe(true);
    expect(isActivePath("/overview", "/traces")).toBe(false);
  });
});

describe("formatDuration", () => {
  it("formats millisecond and second values", () => {
    expect(formatDuration(184)).toBe("184ms");
    expect(formatDuration(1_420)).toBe("1.42s");
  });
});
