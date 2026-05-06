import { expect, test } from "@playwright/test";
import { gotoApp, richTextEditor } from "./helpers/app";
import {
  clickEditorNode,
  clickToolbar,
  expectBubbleButtonActive,
  expectToolbarActive,
  placeCursorInEditorText,
  selectAllEditorContent,
  switchToRichText,
  fillMarkup,
  submitPrompt,
  typeInEditor,
} from "./helpers/editor";

test("highlights toolbar buttons for active marks and nodes at the cursor", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[h1][b]Heading Bold[/b][/h1]");
  await switchToRichText(page);
  await richTextEditor(page).getByText("Heading Bold", { exact: true }).click();

  await expectToolbarActive(page, "heading-1");
  await expectToolbarActive(page, "bold");
  await expectToolbarActive(page, "italic", false);
});

test("highlights the list toolbar button when the cursor is inside a list item", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[list]\n[*]List item\n[/list]");
  await switchToRichText(page);

  await richTextEditor(page).getByText("List item", { exact: true }).click();
  await expectToolbarActive(page, "bullet-list");
});

test("highlights the quote toolbar button when the cursor is inside a quote", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[quote=State QA]Quoted text[/quote]");
  await switchToRichText(page);

  await placeCursorInEditorText(page, "Quoted text", 2);
  await expectToolbarActive(page, "quote");
});

test("shows the inline bubble menu for text selections and reflects active mark state", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[b]Bubble selection text[/b]");
  await switchToRichText(page);
  await richTextEditor(page).click();
  await selectAllEditorContent(page);

  await expect(page.getByTestId("bubble-menu-inline")).toBeVisible();
  await expectBubbleButtonActive(page, "bubble-menu-inline-bold");
  await expectToolbarActive(page, "bold");
});

test("shows the link bubble menu and can edit and remove links", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Link target");
  await selectAllEditorContent(page);
  await clickToolbar(page, "link");
  await submitPrompt(page, "https://example.com/original");
  await clickEditorNode(page, 'a[href="https://example.com/original"]');

  await expect(page.getByTestId("bubble-menu-link")).toBeVisible();
  await expect(page.getByTestId("bubble-menu-link-url")).toContainText("https://example.com/original");
  await page.getByTestId("bubble-menu-link-edit").click();
  await submitPrompt(page, "https://example.com/updated");
  await expect(richTextEditor(page).locator('a[href="https://example.com/updated"]')).toHaveCount(1);

  await clickEditorNode(page, 'a[href="https://example.com/updated"]');
  await page.getByTestId("bubble-menu-link-remove").click();
  await expect(richTextEditor(page).locator("a")).toHaveCount(0);
});

test("shows the image bubble menu and can edit and remove images", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "image");
  await submitPrompt(page, "https://cdn.example.com/original.png");
  await clickEditorNode(page, 'img[src="https://cdn.example.com/original.png"]');

  await expect(page.getByTestId("bubble-menu-image")).toBeVisible();
  await page.getByTestId("bubble-menu-image-edit").click();
  await submitPrompt(page, "https://cdn.example.com/updated.png");
  await expect(richTextEditor(page).locator('img[src="https://cdn.example.com/updated.png"]')).toHaveCount(1);

  await clickEditorNode(page, 'img[src="https://cdn.example.com/updated.png"]');
  await page.getByTestId("bubble-menu-image-remove").click();
  await expect(richTextEditor(page).locator("img.steam-image")).toHaveCount(0);
});

test("shows the embed bubble menu and can edit and remove embeds", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "steam-store");
  await submitPrompt(page, "https://store.steampowered.com/app/400/Portal/");
  await clickEditorNode(page, '[data-type="steam-store-embed"]');

  await expect(page.getByTestId("bubble-menu-embed")).toBeVisible();
  await expect(page.getByTestId("bubble-menu-embed-url")).toHaveAttribute(
    "href",
    "https://store.steampowered.com/app/400/"
  );
  await page.getByTestId("bubble-menu-embed-edit").click();
  await submitPrompt(page, "https://store.steampowered.com/app/620/Portal_2/");
  await clickEditorNode(page, '[data-type="steam-store-embed"]');
  await expect(page.getByTestId("bubble-menu-embed-url")).toHaveAttribute(
    "href",
    "https://store.steampowered.com/app/620/"
  );

  await page.getByTestId("bubble-menu-embed-remove").click();
  await expect(richTextEditor(page).locator('[data-type="steam-store-embed"]')).toHaveCount(0);
});

test("shows the quote bubble menu and can edit and remove quotes", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Bubble quote");
  await selectAllEditorContent(page);
  await clickToolbar(page, "quote");
  await submitPrompt(page, "Bubble Author");
  await clickEditorNode(page, 'blockquote[data-type="quote"]');

  await expect(page.getByTestId("bubble-menu-quote")).toBeVisible();
  await page.getByTestId("bubble-menu-quote-edit").click();
  await submitPrompt(page, "Updated Bubble Author");
  await expect(
    richTextEditor(page).locator('blockquote[data-type="quote"][data-author="Updated Bubble Author"]')
  ).toHaveCount(1);

  await clickEditorNode(page, 'blockquote[data-type="quote"]');
  await page.getByTestId("bubble-menu-quote-remove").click();
  await expect(richTextEditor(page).locator('blockquote[data-type="quote"]')).toHaveCount(0);
});
