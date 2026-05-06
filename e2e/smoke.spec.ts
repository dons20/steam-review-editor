import { test, expect } from "@playwright/test";
import { gotoApp } from "./helpers/app";

test("app boots and preview can be opened", async ({ page }) => {
  await gotoApp(page);

  await page.getByRole("button", { name: /show preview/i }).click();

  await expect(page.getByRole("heading", { name: "Store Preview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Markup Preview" })).toBeVisible();
  await expect(page.getByText("Start typing in the editor to see your Steam BBCode markup here.")).toBeVisible();
});
