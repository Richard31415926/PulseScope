import { describe, expect, it } from "vitest";
import {
  buildIncidentSearchParams,
  getSelectedIncidentId,
} from "@/features/incidents/lib/incidents-url-state";

describe("incidents url state", () => {
  it("reads the selected incident id", () => {
    expect(getSelectedIncidentId(new URLSearchParams("incident=inc-214"))).toBe("inc-214");
  });

  it("updates the selected incident query param", () => {
    const searchParams = new URLSearchParams("incident=inc-214&env=production");

    expect(buildIncidentSearchParams(searchParams, "inc-209")).toBe("incident=inc-209&env=production");
    expect(buildIncidentSearchParams(searchParams, null)).toBe("env=production");
  });
});
