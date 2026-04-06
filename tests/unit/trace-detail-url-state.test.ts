import { describe, expect, it } from "vitest";
import {
  buildTraceDetailSearchParams,
  getSelectedSpanId,
} from "@/features/traces/lib/trace-detail-url-state";

describe("trace detail url state", () => {
  it("reads the selected span id", () => {
    expect(getSelectedSpanId(new URLSearchParams("span=sp-9"))).toBe("sp-9");
  });

  it("updates the selected span query param", () => {
    const searchParams = new URLSearchParams("env=production");

    expect(buildTraceDetailSearchParams(searchParams, "sp-11")).toBe("env=production&span=sp-11");
    expect(buildTraceDetailSearchParams(searchParams, null)).toBe("env=production");
  });
});
