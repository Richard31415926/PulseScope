import { expect, test } from "@playwright/test";

test("filters traces by search and status", async ({ page }) => {
  await page.goto("/traces");

  await page.getByLabel("Search traces").fill("checkout");
  await expect(page).toHaveURL(/q=checkout/);
  await page.getByRole("button", { name: "Errors" }).click();

  await expect(page.getByTestId("trace-row-trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H")).toBeVisible();
  await expect(page.locator("[data-testid^='trace-row-']")).toHaveCount(1);
  await expect(page).toHaveURL(/q=checkout/);
  await expect(page).toHaveURL(/status=error/);
});

test("navigates from a trace row to the detail page", async ({ page }) => {
  await page.goto("/traces");

  await page.getByTestId("trace-row-trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H").click();

  await expect(page).toHaveURL(/\/traces\/trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H$/);
  await expect(page.getByRole("heading", { name: "Trace waterfall" })).toBeVisible();

  await page.getByTestId("span-row-sp-9").click();

  await expect(page).toHaveURL(/span=sp-9/);
  await expect(page.getByTestId("span-inspector-title")).toHaveText("LedgerWrite.commit");
});

test("opens a service detail page", async ({ page }) => {
  await page.goto("/services");

  const serviceLink = page.getByRole("link", { name: "Open service checkout-api" });
  await serviceLink.focus();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/services\/checkout-api$/);
  await expect(page.getByRole("heading", { name: "checkout-api" })).toBeVisible();
});

test("opens incident details in the response desk", async ({ page }) => {
  await page.goto("/incidents");

  await page.getByRole("button", { name: /Ingest partition imbalance/i }).click();

  await expect(page).toHaveURL(/incident=inc-209/);
  await expect(page.getByText("Incident detail")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ingest partition imbalance" })).toBeVisible();
  await expect(page.getByText("#inc-ingest-hot-shard")).toBeVisible();
});

test("toggles live mode in the logs explorer", async ({ page }) => {
  await page.goto("/logs");

  const liveToggle = page.getByRole("button", { name: "Live mode" });
  await expect(page.getByText("Live stream paused")).toBeVisible();

  await liveToggle.click();

  await expect(liveToggle).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/live=1/);
  await expect(page.getByText("Live stream active")).toBeVisible();
});

test("opens a deep-linked trace span from the url", async ({ page }) => {
  await page.goto("/traces/trc_01J9AE7CHK1YJX9P6ZT4ER1Q4H?span=sp-9");

  await expect(page.getByTestId("span-inspector-title")).toHaveText("LedgerWrite.commit");
});

test("navigates between surfaces from the command palette", async ({ page }) => {
  await page.goto("/overview");

  await page.getByRole("button", { name: /open command palette/i }).click();
  await expect(page.getByRole("dialog", { name: "Command Palette" })).toBeVisible();

  await page.getByPlaceholder("Search routes, views, and operator actions...").fill("logs");
  await page.locator("[cmdk-item]").filter({ hasText: "Logs" }).first().click();

  await expect(page).toHaveURL(/\/logs$/);
  await expect(page.getByRole("heading", { name: "Structured log investigation" })).toBeVisible();
});

test("applies the latency war room saved view preset", async ({ page }) => {
  await page.goto("/overview");

  await page.getByRole("button", { name: /default view/i }).first().click();
  await page.getByText("Latency War Room").click();

  await expect(page).toHaveURL(/\/traces/);
  await expect(page).toHaveURL(/view=latency-war-room/);
  await expect(page).toHaveURL(/compare=1/);
  await expect(page).toHaveURL(/duration=500-1000/);
  await expect(page).toHaveURL(/status=slow/);
});
