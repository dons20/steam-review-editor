import { expect, test, type Page } from "@playwright/test";
import { gotoApp, markupInput, richTextEditor } from "./helpers/app";
import {
  clickToolbar,
  focusEditor,
  pressEnter,
  submitPrompt,
  switchToMarkup,
  switchToRichText,
  typeInEditor,
} from "./helpers/editor";
import { openPreview, openPreviewSettings, setPreviewSettings } from "./helpers/preview";

const INSTALL_PROMPT_TEXT = "Install Steam Review Editor for offline access.";

async function linger(page: Page, duration = 700) {
  await page.waitForTimeout(duration);
}

async function pressEditorShortcut(page: Page, shortcut: string) {
  await focusEditor(page);
  await page.keyboard.press(shortcut);
}

async function showChapter(page: Page, title: string, description: string, duration = 2200) {
  await page.screencast.showChapter(title, { description, duration });
  await linger(page, duration + 250);
}

async function dismissInstallPromptIfVisible(page: Page) {
  const prompt = page.getByText(INSTALL_PROMPT_TEXT);
  const isVisible = await prompt.isVisible().catch(() => false);

  if (!isVisible) {
    return;
  }

  const toast = prompt.locator('xpath=ancestor::*[contains(@class,"Toastify__toast")][1]');
  const closeButton = toast.locator(".Toastify__close-button");

  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  } else {
    await toast.click();
  }

  await expect(prompt).toBeHidden();
}

async function moveCursorBelowTable(page: Page) {
  const tableBox = await richTextEditor(page).locator("table").last().boundingBox();

  if (!tableBox) {
    throw new Error("Table was not rendered in the editor");
  }

  await page.mouse.click(tableBox.x + 24, tableBox.y + tableBox.height + 32);
}

async function fillTable(page: Page) {
  await clickToolbar(page, "table");
  await richTextEditor(page).locator("table td").first().click();

  const cells = ["Category", "Score", "Story", "9/10", "Performance", "8/10"];

  for (const cell of cells) {
    await page.keyboard.type(cell);
    await page.keyboard.press("Tab");
    await linger(page, 180);
  }
}

test("records a manual 1440p walkthrough of the editor", async ({ page }, testInfo) => {
  test.setTimeout(5 * 60 * 1000);

  const videoPath = testInfo.outputPath("steam-review-editor-walkthrough-1440p.webm");

  await gotoApp(page);
  await dismissInstallPromptIfVisible(page);

  await page.screencast.start({
    path: videoPath,
    quality: 100,
    size: { width: 2560, height: 1440 },
  });

  await page.screencast.showActions({
    cursor: "pointer",
    duration: 1100,
    fontSize: 26,
    position: "bottom-right",
  });

  await page.screencast.showOverlay(`
    <div style="
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 2147483647;
      padding: 14px 18px;
      border-radius: 14px;
      background: rgba(12, 18, 28, 0.82);
      color: #f4f7fb;
      font: 600 20px/1.35 'Segoe UI', sans-serif;
      letter-spacing: 0.02em;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(12px);
    ">
      Steam Review Editor<br />
      <span style="font-size: 14px; font-weight: 500; opacity: 0.82;">Playwright screencast walkthrough</span>
    </div>
  `);

  await showChapter(page, "Walkthrough", "A quick intro to Steam Review Editor's features");

  await showChapter(
    page,
    "Text Formatting",
    "Create a formatted review snippet with headings, inline styles, and a list."
  );
  await clickToolbar(page, "heading-1");
  await typeInEditor(page, "Steam Deck Favorite");
  await pressEnter(page, 2);
  await pressEditorShortcut(page, "ControlOrMeta+B");
  await typeInEditor(page, "Excellent");
  await pressEditorShortcut(page, "ControlOrMeta+B");
  await typeInEditor(page, " puzzle design with ");
  await pressEditorShortcut(page, "ControlOrMeta+I");
  await typeInEditor(page, "sharp pacing");
  await pressEditorShortcut(page, "ControlOrMeta+I");
  await typeInEditor(page, " and ");
  await pressEditorShortcut(page, "ControlOrMeta+U");
  await typeInEditor(page, "clean performance");
  await pressEditorShortcut(page, "ControlOrMeta+U");
  await pressEnter(page);
  await clickToolbar(page, "bullet-list");
  await typeInEditor(page, "Punchy writing");
  await pressEnter(page);
  await typeInEditor(page, "Strong handheld support");
  await pressEnter(page, 2);

  await showChapter(page, "Tables", "Insert a comparison table and populate a few cells.");
  await fillTable(page);
  await linger(page, 800);

  await showChapter(page, "Embeds", "Add Steam store, Workshop, and YouTube embeds.");
  await moveCursorBelowTable(page);
  await pressEnter(page, 2);
  await clickToolbar(page, "steam-store");
  await submitPrompt(page, "https://store.steampowered.com/app/620/Portal_2/");
  await linger(page, 500);
  await clickToolbar(page, "steam-workshop");
  await submitPrompt(page, "https://steamcommunity.com/sharedfiles/filedetails/?id=123456789");
  await linger(page, 500);
  await clickToolbar(page, "youtube");
  await submitPrompt(page, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  await linger(page, 700);

  await showChapter(page, "Markup Mode", "Switch to raw Steam BBCode and append a spoiler block.");
  await switchToMarkup(page);
  await markupInput(page).click();
  await markupInput(page).press("Control+End");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.type("[spoiler]Late-game surprise stays hidden here.[/spoiler]");
  await linger(page, 900);

  await showChapter(page, "Templates", "Replace the draft with a richer demo template.");
  await page.getByTestId("editor-open-templates").click();
  await expect(page.getByTestId("template-modal")).toBeVisible();
  await page.getByTestId("template-card-demo").click();
  if (
    await page
      .getByTestId("template-modal-confirm")
      .isVisible()
      .catch(() => false)
  ) {
    await page.getByTestId("template-modal-confirm-replace").click();
  }
  await expect(page.getByTestId("template-modal")).toBeHidden();
  await switchToRichText(page);
  await linger(page, 1000);

  await showChapter(page, "Preview", "Open the Steam-styled preview and inspect the rendered review.");
  await openPreview(page);
  await page.getByTestId("preview-root").scrollIntoViewIfNeeded();
  await linger(page, 1400);

  await showChapter(page, "Preview Settings", "Update reviewer details and recommendation state.");
  await openPreviewSettings(page);
  await setPreviewSettings(page, {
    username: "DeckPilot",
    products: "128",
    reviews: "42",
    hoursOnRecord: "87.4",
    hoursAtReview: "63.2",
    datePosted: "2026-07-06",
    recommended: false,
  });
  await linger(page, 900);
  await page.getByTestId("preview-settings-done").click();
  await expect(page.getByTestId("preview-settings-modal")).toBeHidden();
  await linger(page, 1200);

  await showChapter(page, "Copy Markup", "Copy the generated Steam BBCode to the clipboard.");
  await page.getByTestId("content-copy-markup").scrollIntoViewIfNeeded();
  await page.getByTestId("content-copy-markup").click();
  await expect(page.getByText("Markup copied to clipboard!")).toBeVisible();
  await linger(page, 1500);

  await showChapter(page, "Complete", "Try it out today!", 2400);

  await page.screencast.stop();
  await testInfo.attach("walkthrough-video", { path: videoPath, contentType: "video/webm" });
});
