import { expect, type Locator, type Page } from "@playwright/test";

export const richTextEditor = (page: Page) => page.getByTestId("editor-rich-text-input");
export const markupInput = (page: Page) => page.getByTestId("editor-markup-input");
export const previewToggleButton = (page: Page) => page.getByTestId("content-toggle-preview");
export const markupPreviewBody = (page: Page) => page.getByTestId("markup-preview-body");
export const previewContent = (page: Page) => page.getByTestId("preview-rendered-html");

export async function gotoApp(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.goto("/");
  await expect(page.getByText("Steam Review Editor")).toBeVisible();
  await expect(previewToggleButton(page)).toBeVisible();
  await expect(richTextEditor(page)).toBeVisible();
}

export async function expectMarkupPreviewToContain(page: Page, text: string | RegExp) {
  if (text instanceof RegExp) {
    await expect(markupPreviewBody(page)).toContainText(text);
    return;
  }

  await expect(markupPreviewBody(page)).toContainText(text);
}

export async function expectValueToContain(locator: Locator, text: string) {
  await expect.poll(async () => (await locator.inputValue()).includes(text)).toBe(true);
}
