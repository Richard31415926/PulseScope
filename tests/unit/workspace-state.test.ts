import { describe, expect, it } from "vitest";
import {
  buildWorkspaceHref,
  buildWorkspaceSearchParams,
  defaultWorkspaceSearchState,
  getWorkspaceStateFromSearchParams,
} from "@/lib/workspace-state";

describe("workspace state helpers", () => {
  it("parses workspace controls from search params", () => {
    const searchParams = new URLSearchParams(
      "env=staging&range=24h&view=handoff&compare=1&cmpRange=previous-day",
    );

    expect(getWorkspaceStateFromSearchParams(searchParams)).toEqual({
      compareMode: true,
      compareRange: "previous-day",
      environment: "staging",
      savedView: "handoff",
      timeRange: "24h",
    });
  });

  it("drops default workspace values when serializing", () => {
    const searchParams = new URLSearchParams("env=staging&compare=1");
    const query = buildWorkspaceSearchParams(searchParams, defaultWorkspaceSearchState);

    expect(query).toBe("");
  });

  it("builds hrefs with workspace and page params", () => {
    expect(
      buildWorkspaceHref(
        "/logs",
        {
          compareMode: true,
          compareRange: "deploy-baseline",
          environment: "production",
          savedView: "latency-war-room",
          timeRange: "6h",
        },
        {
          logService: "checkout-api",
          q: "trace-1",
        },
      ),
    ).toBe(
      "/logs?range=6h&view=latency-war-room&cmpRange=deploy-baseline&compare=1&logService=checkout-api&q=trace-1",
    );
  });
});
