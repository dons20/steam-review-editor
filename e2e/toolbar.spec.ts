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
