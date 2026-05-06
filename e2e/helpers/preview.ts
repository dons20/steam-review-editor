import { expect, type Page } from "@playwright/test";
import { expectMarkupPreviewToContain, previewContent, previewToggleButton } from "./app";

export async function openPreview(page: Page) {
  if (
    !(await page
      .getByRole("heading", { name: "Store Preview" })
      .isVisible()
      .catch(() => false))
  ) {
    await previewToggleButton(page).click();
  }

  await expect(page.getByTestId("store-preview")).toBeVisible();
  await expect(page.getByTestId("markup-preview")).toBeVisible();
}

export async function openPreviewSettings(page: Page) {
  await openPreview(page);
  await page.getByTestId("preview-open-settings").click();
  await expect(page.getByTestId("preview-settings-modal")).toBeVisible();
}

export async function setPreviewSettings(
  page: Page,
  settings: {
    username?: string;
    products?: string;
    reviews?: string;
    hoursOnRecord?: string;
    hoursAtReview?: string;
    datePosted?: string;
    recommended?: boolean;
  }
) {
  if (settings.username !== undefined) {
    await page.getByTestId("preview-settings-username").fill(settings.username);
  }
  if (settings.products !== undefined) {
    await page.getByTestId("preview-settings-products").fill(settings.products);
  }
  if (settings.reviews !== undefined) {
    await page.getByTestId("preview-settings-reviews").fill(settings.reviews);
  }
  if (settings.hoursOnRecord !== undefined) {
    await page.getByTestId("preview-settings-hours-on-record").fill(settings.hoursOnRecord);
  }
  if (settings.hoursAtReview !== undefined) {
    await page.getByTestId("preview-settings-hours-at-review").fill(settings.hoursAtReview);
  }
  if (settings.datePosted !== undefined) {
    await page.getByTestId("preview-settings-date-posted").fill(settings.datePosted);
  }
  if (settings.recommended !== undefined) {
    await page
      .getByTestId(settings.recommended ? "preview-settings-recommended" : "preview-settings-not-recommended")
      .click();
  }
}

export async function expectPreviewProfile(
  page: Page,
  expected: {
    username: string;
    products: string;
    reviews: string;
    recommendation: string;
    hours: string;
    date: string;
  }
) {
  await expect(page.getByTestId("preview-username")).toHaveText(expected.username);
  await expect(page.getByTestId("preview-products")).toHaveText(expected.products);
  await expect(page.getByTestId("preview-reviews")).toHaveText(expected.reviews);
  await expect(page.getByTestId("preview-recommendation")).toHaveText(expected.recommendation);
  await expect(page.getByTestId("preview-hours")).toHaveText(expected.hours);
  await expect(page.getByTestId("preview-date")).toHaveText(expected.date);
}

export async function expectPreviewHtmlToContain(page: Page, text: string) {
  await expect(previewContent(page)).toContainText(text);
}

export { expectMarkupPreviewToContain };
