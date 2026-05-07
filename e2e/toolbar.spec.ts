import { expect, test } from "@playwright/test";
import { gotoApp, markupInput, richTextEditor } from "./helpers/app";
import {
  clickToolbar,
  expectMarkupInputToContain,
  fillMarkup,
  selectAllEditorContent,
  selectTextInEditor,
  submitPrompt,
  switchToMarkup,
  switchToRichText,
  typeInEditor,
} from "./helpers/editor";
import { expectMarkupPreviewToContain, openPreview } from "./helpers/preview";

test("applies bold inside heading 1", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[h1]Heading Bold[/h1]");
  await switchToRichText(page);
  await selectTextInEditor(page, "Heading Bold");
  await clickToolbar(page, "bold");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[h1][b]Heading Bold[/b][/h1]");
  await expectMarkupPreviewToContain(page, "[h1][b]Heading Bold[/b][/h1]");
});

test("applies italic and underline inside heading and list block nodes", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[h2]Italic Heading[/h2]");
  await switchToRichText(page);
  await selectTextInEditor(page, "Italic Heading");
  await clickToolbar(page, "italic");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[h2][i]Italic Heading[/i][/h2]");
});

test("applies underline inside ordered list items", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[olist]\n[*]Ordered Underline Item\n[/olist]");
  await switchToRichText(page);
  await selectTextInEditor(page, "Ordered Underline Item");
  await clickToolbar(page, "underline");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[olist]");
  await expectMarkupInputToContain(page, "[u]Ordered Underline Item[/u]");
});

test("applies italic inside bullet list items", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[list]\n[*]Bullet Italic Item\n[/list]");
  await switchToRichText(page);
  await selectTextInEditor(page, "Bullet Italic Item");
  await clickToolbar(page, "italic");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[list]");
  await expectMarkupInputToContain(page, "[i]Bullet Italic Item[/i]");
});

test("applies quote and inline strikethrough inside the quote block", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Quoted Strike Text");
  await selectAllEditorContent(page);
  await clickToolbar(page, "quote");
  await submitPrompt(page, "Author QA");
  await clickToolbar(page, "strikethrough");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[quote=Author QA][strike]Quoted Strike Text[/strike][/quote]");
});

test("applies spoiler to selected text", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Spoiler text");
  await selectAllEditorContent(page);
  await clickToolbar(page, "spoiler");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[spoiler]Spoiler text[/spoiler]");
});

test("applies code block to selected text", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "console.log('steam');");
  await selectAllEditorContent(page);
  await clickToolbar(page, "code-block");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[code]console.log('steam');");
});

test("applies no-parse to selected text", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "[b]literal[/b]");
  await selectAllEditorContent(page);
  await clickToolbar(page, "no-parse");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[noparse][b]literal[/b]");
  await expectMarkupPreviewToContain(page, "[noparse][b]literal[/b]");
});

test("applies bold inside no-parse as literal markup instead of editor formatting", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "bold");

  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[b]literal[/b] text");
  await expect(richTextEditor(page).locator("pre.noparse strong")).toHaveCount(0);

  await openPreview(page);
  await expectMarkupInputToContain(page, "[noparse][b]literal[/b] text[/noparse]");
  await expectMarkupPreviewToContain(page, "[noparse][b]literal[/b] text[/noparse]");
});

test("applies selection-based wrapper actions inside no-parse as literal bbcode", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "spoiler");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[spoiler]literal[/spoiler] text");

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "code-block");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[code]literal[/code] text");

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "heading-2");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[h2]literal[/h2] text");

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal text");
  await clickToolbar(page, "ordered-list");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[olist]\n[*]literal text\n[/olist]");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[noparse][olist]\n[*]literal text\n[/olist][/noparse]");
  await expectMarkupPreviewToContain(page, "[noparse][olist]");
});

test("applies prompt-based wrapper actions inside no-parse as literal bbcode", async ({ page }) => {
  await gotoApp(page);

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "quote");
  await submitPrompt(page, "Author QA");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText("[quote=Author QA]literal[/quote] text");

  await fillMarkup(page, "[noparse]literal text[/noparse]");
  await switchToRichText(page);
  await selectTextInEditor(page, "literal");
  await clickToolbar(page, "link");
  await submitPrompt(page, "https://example.com/review");
  await expect(richTextEditor(page).locator("pre.noparse")).toContainText(
    "[url=https://example.com/review]literal[/url] text"
  );

  await openPreview(page);
  await expectMarkupInputToContain(page, "[noparse][url=https://example.com/review]literal[/url] text[/noparse]");
  await expectMarkupPreviewToContain(page, "[noparse][url=https://example.com/review]literal[/url] text[/noparse]");
});

test("applies horizontal rule", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "horizontal-rule");
  await openPreview(page);
  await expectMarkupInputToContain(page, "[hr][/hr]");
});

test("covers link insertion toolbar action", async ({ page }) => {
  await gotoApp(page);

  await typeInEditor(page, "Steam link text");
  await selectAllEditorContent(page);
  await clickToolbar(page, "link");
  await submitPrompt(page, "https://example.com/review");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[url=https://example.com/review]Steam link text[/url]");
});

test("covers image and embed insertion toolbar actions", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "image");
  await submitPrompt(page, "https://cdn.example.com/cover.png");

  await openPreview(page);
  await expectMarkupInputToContain(page, "[img]https://cdn.example.com/cover.png[/img]");
});

test("covers steam store insertion toolbar action", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "steam-store");
  await submitPrompt(page, "https://store.steampowered.com/app/400/Portal/");

  await openPreview(page);
  await expectMarkupInputToContain(page, "https://store.steampowered.com/app/400/");
});

test("covers steam workshop insertion toolbar action", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "steam-workshop");
  await submitPrompt(page, "https://steamcommunity.com/sharedfiles/filedetails/?id=123456789");

  await openPreview(page);
  await expectMarkupInputToContain(page, "https://steamcommunity.com/sharedfiles/filedetails/?id=123456789");
});

test("covers youtube insertion toolbar action", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "youtube");
  await submitPrompt(page, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  await openPreview(page);
  await expectMarkupInputToContain(page, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

test("covers table insertion toolbar action", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "table");
  await openPreview(page);
  await expectMarkupInputToContain(page, "[table]");
});

test("covers clear formatting and clear all toolbar actions", async ({ page }) => {
  await gotoApp(page);

  await clickToolbar(page, "bold");
  await clickToolbar(page, "italic");
  await typeInEditor(page, "Styled text");
  await clickToolbar(page, "italic");
  await clickToolbar(page, "bold");

  await selectAllEditorContent(page);
  await clickToolbar(page, "clear-formatting");
  await switchToMarkup(page);
  await expect(markupInput(page)).toHaveValue("Styled text");

  await page.getByTestId("editor-mode-toggle").click();
  await expect(richTextEditor(page)).toBeVisible();

  await clickToolbar(page, "clear-all");
  await submitPrompt(page);
  await switchToMarkup(page);
  await expect(markupInput(page)).toHaveValue("");
});
