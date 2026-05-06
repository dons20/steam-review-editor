import { expect, test } from "@playwright/test";
import { gotoApp, markupInput, richTextEditor } from "./helpers/app";
import {
  clickToolbar,
  fillMarkup,
  submitPrompt,
  switchToMarkup,
  switchToRichText,
  typeInEditor,
} from "./helpers/editor";
import { expectMarkupPreviewToContain, expectPreviewHtmlToContain, openPreview } from "./helpers/preview";

test("round-trips between rich text and markup mode and keeps preview content in sync", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "bold");
  await typeInEditor(page, "Roundtrip Title");
  await clickToolbar(page, "bold");
  await typeInEditor(page, " body copy");

  await switchToMarkup(page);
  await expect(markupInput(page)).toContainText("[b]Roundtrip Title[/b]");

  await fillMarkup(
    page,
    "[h1]Markup Title[/h1]\n\n[url=https://example.com]Example Link[/url]\n\n[list]\n[*]Alpha\n[*]Beta\n[/list]\n\n[quote=Tester]Quoted[/quote]"
  );

  await switchToRichText(page);
  await expect(richTextEditor(page)).toContainText("Markup Title");
  await expect(richTextEditor(page)).toContainText("Example Link");
  await expect(richTextEditor(page)).toContainText("Alpha");
  await expect(richTextEditor(page)).toContainText("Quoted");

  await openPreview(page);
  await expectPreviewHtmlToContain(page, "Markup Title");
  await expectPreviewHtmlToContain(page, "Example Link");
  await expectMarkupPreviewToContain(page, "[quote=Tester]Quoted[/quote]");
});

test("switching from markup mode restores steam embeds in editor and store preview", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(
    page,
    "https://store.steampowered.com/app/400/Portal/\n\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=123456789"
  );

  await switchToRichText(page);
  await expect(richTextEditor(page).locator('[data-type="steam-store-embed"]')).toHaveCount(1);
  await expect(richTextEditor(page).locator('[data-type="steam-workshop-embed"]')).toHaveCount(1);

  await openPreview(page);
  await expect(page.getByTestId("preview-rendered-html").locator('[data-type="steam-store-embed"]')).toHaveCount(1);
  await expect(page.getByTestId("preview-rendered-html").locator('[data-type="steam-workshop-embed"]')).toHaveCount(1);
});

test("inserts templates and handles replacement confirmation", async ({ page }) => {
  await gotoApp(page);

  await page.getByTestId("editor-open-templates").click();
  await expect(page.getByTestId("template-modal")).toBeVisible();
  await page.getByTestId("template-card-demo").click();

  await openPreview(page);
  await switchToMarkup(page);
  await expect(markupInput(page)).toContainText("[table]");
  await expect(markupInput(page)).toContainText("[quote=Author Name]");
  await expect(markupInput(page)).toContainText("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  await expectMarkupPreviewToContain(page, "[quote=Author Name]");

  await switchToRichText(page);
  await page.getByTestId("editor-open-templates").click();
  await page.getByTestId("template-card-basic").click();
  await expect(page.getByTestId("template-modal-confirm")).toBeVisible();
  await page.getByTestId("template-modal-cancel-replace").click();
  await expect(page.getByTestId("template-modal-confirm")).toBeHidden();
  await page.getByTestId("template-card-tables").click();
  await page.getByTestId("template-modal-confirm-replace").click();

  await switchToMarkup(page);
  await expect(markupInput(page)).toContainText("[h2]Ratings Breakdown[/h2]");
  await expect(markupInput(page)).toContainText("[table]");
});
