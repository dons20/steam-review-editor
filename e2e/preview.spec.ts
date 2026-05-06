import { expect, test } from "@playwright/test";
import { gotoApp } from "./helpers/app";
import { clickToolbar, selectAllEditorContent, selectTextInEditor, submitPrompt, typeInEditor } from "./helpers/editor";
import {
  expectPreviewHtmlToContain,
  expectPreviewProfile,
  openPreview,
  openPreviewSettings,
  setPreviewSettings,
} from "./helpers/preview";

test("guide button displays the guide window", async ({ page }) => {
  await gotoApp(page);

  await page.getByTestId("editor-open-guide").click();
  await expect(page.getByTestId("guide-modal")).toBeVisible();
  await expect(page.getByTestId("guide-section-writing")).toBeVisible();
  await expect(page.getByTestId("guide-section-preview")).toBeVisible();
  await page.getByTestId("guide-modal-done").click();
  await expect(page.getByTestId("guide-modal")).toBeHidden();
});

test("preview settings update the store preview display", async ({ page }) => {
  await gotoApp(page);
  await typeInEditor(page, "Preview body content");

  await openPreview(page);
  await openPreviewSettings(page);
  await setPreviewSettings(page, {
    username: "QAUser",
    products: "321",
    reviews: "42",
    recommended: false,
    hoursOnRecord: "12.5",
    hoursAtReview: "7.0",
    datePosted: "2026-05-05",
  });

  await expectPreviewProfile(page, {
    username: "QAUser",
    products: "321 games",
    reviews: "42 reviews",
    recommendation: "Not Recommended",
    hours: "12.5 hrs on record (7.0 hrs at review time)",
    date: "POSTED: 5 MAY",
  });
  await expectPreviewHtmlToContain(page, "Preview body content");

  const usernameBeforeRandomize = await page.getByTestId("preview-username").textContent();
  await page.getByTestId("preview-settings-randomize-all").click();
  await expect(page.getByTestId("preview-username")).not.toHaveText(usernameBeforeRandomize || "QAUser");

  await page.getByTestId("preview-settings-done").click();
  await expect(page.getByTestId("preview-settings-modal")).toBeHidden();
});

test("store preview nests inline formatting inside spoiler spans", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Before bold and italic after");
  await selectAllEditorContent(page);
  await clickToolbar(page, "spoiler");

  await selectTextInEditor(page, "bold");
  await clickToolbar(page, "bold");

  await selectTextInEditor(page, "italic");
  await clickToolbar(page, "italic");

  await openPreview(page);

  await expect(page.getByTestId("preview-rendered-html")).toHaveJSProperty(
    "innerHTML",
    '<p><span data-type="spoiler" class="spoiler">Before <strong>bold</strong> and <em>italic</em> after</span></p>'
  );
});

test("store preview keeps inserted store embed markup intact", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "steam-store");
  await submitPrompt(page, "https://store.steampowered.com/app/400/Portal/");

  await openPreview(page);

  const preview = page.getByTestId("preview-rendered-html");
  await expect(preview.locator('[data-type="steam-store-embed"] .ss-header-title')).toHaveText(
    "Buy Placeholder Arena 6"
  );
});
