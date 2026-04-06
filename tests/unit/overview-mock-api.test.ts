import { describe, expect, it } from "vitest";
import { getOverviewDashboardData } from "@/lib/mock-api/overview";

describe("overview mock api", () => {
  it("returns structured live overview data", async () => {
    const data = await getOverviewDashboardData({
      environment: "production",
      timeRange: "1h",
    });

    expect(data.state).toBe("ready");
    expect(data.metrics).toHaveLength(6);
    expect(data.timeline).toHaveLength(12);
    expect(data.slowEndpoints.length).toBeGreaterThan(3);
    expect(data.incidents.length).toBeGreaterThan(0);
  });

  it("returns an empty state payload when requested", async () => {
    const data = await getOverviewDashboardData({
      environment: "development",
      timeRange: "15m",
      mockState: "empty",
    });

    expect(data.state).toBe("empty");
    expect(data.metrics).toHaveLength(0);
    expect(data.timeline).toHaveLength(0);
    expect(data.slowEndpoints).toHaveLength(0);
  });

  it("throws a mocked error when requested", async () => {
    await expect(
      getOverviewDashboardData({
        environment: "staging",
        timeRange: "7d",
        mockState: "error",
      }),
    ).rejects.toThrow("Historical overview rollups are unavailable");
  });
});
