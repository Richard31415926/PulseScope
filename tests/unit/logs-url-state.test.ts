import { describe, expect, it } from "vitest";
import { buildLogsSearchParams, getLogsUrlState } from "@/features/logs/lib/logs-url-state";

describe("logs url state", () => {
  it("parses filters, live mode, and expanded rows", () => {
    const searchParams = new URLSearchParams(
      "q=trace-1&level=error&logService=checkout-api&logEnv=production&live=1&log=log_1",
    );

    expect(getLogsUrlState(searchParams)).toEqual({
      expandedLogId: "log_1",
      filters: {
        search: "trace-1",
        level: "error",
        service: "checkout-api",
        environment: "production",
      },
      liveMode: true,
    });
  });

  it("drops defaults when serializing back to the url", () => {
    const searchParams = new URLSearchParams("live=1&level=error");

    expect(
      buildLogsSearchParams(searchParams, {
        expandedLogId: null,
        filters: {
          environment: "all",
          level: "all",
          search: "",
          service: "all",
        },
        liveMode: false,
      }),
    ).toBe("");
  });
});
