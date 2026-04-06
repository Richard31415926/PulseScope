import { describe, expect, it } from "vitest";
import { getServiceDetail, getServicesShellData } from "@/lib/mock-api/services";

describe("services mock api", () => {
  it("returns enriched services for overview and detail surfaces", async () => {
    const overview = await getServicesShellData();
    const detail = await getServiceDetail("checkout-api");

    expect(overview.services.length).toBeGreaterThan(10);
    expect(overview.services.some((service) => service.status === "error")).toBe(true);
    expect(detail?.owner).toBe("Payments Platform");
    expect(detail?.dependents.length).toBeGreaterThan(0);
    expect(detail?.metricSeries.length).toBe(12);
    expect(detail?.recentIncidents.length).toBeGreaterThan(0);
  });
});
