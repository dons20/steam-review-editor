import { expect, type Page } from "@playwright/test";
import { markupInput, richTextEditor } from "./app";

export async function focusEditor(page: Page) {
  await richTextEditor(page).click();
}

export async function typeInEditor(page: Page, text: string) {
  await focusEditor(page);
  await page.keyboard.type(text);
}

export async function pressEnter(page: Page, times = 1) {
  for (let index = 0; index < times; index += 1) {
    await page.keyboard.press("Enter");
  }
}

export async function clickToolbar(
  page: Page,
  action:
    | "bold"
    | "italic"
    | "underline"
    | "strikethrough"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "bullet-list"
    | "ordered-list"
    | "link"
    | "image"
    | "table"
    | "code-block"
    | "quote"
    | "spoiler"
    | "no-parse"
    | "horizontal-rule"
    | "steam-store"
    | "steam-workshop"
    | "youtube"
    | "clear-formatting"
    | "clear-all"
) {
  await page.getByTestId(`toolbar-${action}`).click();
}

export async function submitPrompt(page: Page, value?: string) {
  await expect(page.getByTestId("prompt-modal")).toBeVisible();

  if (typeof value === "string") {
    await page.getByTestId("prompt-modal-input").fill(value);
  }

  await page.getByTestId("prompt-modal-submit").click();
}

export async function cancelPrompt(page: Page) {
  await expect(page.getByTestId("prompt-modal")).toBeVisible();
  await page.getByTestId("prompt-modal-cancel").click();
}

export async function switchToMarkup(page: Page) {
  const toggle = page.getByTestId("editor-mode-toggle");

  if (
    await markupInput(page)
      .isVisible()
      .catch(() => false)
  ) {
    return;
  }

  await toggle.click();
  await expect(markupInput(page)).toBeVisible();
}

export async function switchToRichText(page: Page) {
  const toggle = page.getByTestId("editor-mode-toggle");

  if (
    await richTextEditor(page)
      .isVisible()
      .catch(() => false)
  ) {
    return;
  }

  await toggle.click();
  await expect(richTextEditor(page)).toBeVisible();
}

export async function expectMarkupInputToContain(page: Page, text: string) {
  await switchToMarkup(page);
  await expect.poll(async () => (await markupInput(page).inputValue()).includes(text)).toBe(true);
}

export async function fillMarkup(page: Page, value: string) {
  await switchToMarkup(page);
  await markupInput(page).fill(value);
}

export async function selectAllEditorContent(page: Page) {
  await focusEditor(page);
  await page.keyboard.press("Control+A");
}

export async function selectTextInEditor(page: Page, text: string) {
  await richTextEditor(page).click();
  await page.evaluate(targetText => {
    const root = document.querySelector('[data-testid="editor-rich-text-input"]');
    if (!root) {
      throw new Error("Rich text editor not found");
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null = walker.nextNode();

    while (currentNode) {
      const content = currentNode.textContent ?? "";
      const index = content.indexOf(targetText);

      if (index >= 0) {
        const range = document.createRange();
        range.setStart(currentNode, index);
        range.setEnd(currentNode, index + targetText.length);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        return;
      }

      currentNode = walker.nextNode();
    }

    throw new Error(`Text not found in editor: ${targetText}`);
  }, text);
}

export async function placeCursorInEditorText(page: Page, text: string, offset = 0) {
  await page.evaluate(
    ({ targetText, targetOffset }) => {
      const root = document.querySelector('[data-testid="editor-rich-text-input"]');
      if (!root) {
        throw new Error("Rich text editor not found");
      }

      const editor = (root as any).pmViewDesc?.dom?.editor;
      if (!editor) {
        throw new Error("TipTap editor instance not found");
      }

      let position: number | null = null;

      editor.state.doc.descendants((node: any, pos: number) => {
        if (position !== null || !node.isText) {
          return;
        }

        const content = node.text ?? "";
        const index = content.indexOf(targetText);

        if (index >= 0) {
          const safeOffset = Math.min(index + targetOffset, content.length);
          position = pos + safeOffset + 1;
        }
      });

      if (position === null) {
        throw new Error(`Text not found in editor: ${targetText}`);
      }

      editor.chain().focus(position).setTextSelection(position).run();
    },
    { targetText: text, targetOffset: offset }
  );
}

export async function expectToolbarActive(page: Page, action: Parameters<typeof clickToolbar>[1], active = true) {
  const locator = page.getByTestId(`toolbar-${action}`);
  const expectedClass = active ? /is-active/ : /^((?!is-active).)*$/;
  await expect(locator).toHaveClass(expectedClass);
}

export async function expectBubbleButtonActive(page: Page, testId: string, active = true) {
  const locator = page.getByTestId(testId);
  const expectedClass = active ? /is-active/ : /^((?!is-active).)*$/;
  await expect(locator).toHaveClass(expectedClass);
}

export async function clickEditorNode(page: Page, selector: string) {
  await richTextEditor(page).locator(selector).click();
}

export async function typeHeading(page: Page, level: 1 | 2 | 3, text: string) {
  await clickToolbar(page, `heading-${level}`);
  await typeInEditor(page, text);
  await pressEnter(page, 2);
}

export async function typeList(page: Page, ordered: boolean, items: string[]) {
  await clickToolbar(page, ordered ? "ordered-list" : "bullet-list");

  for (let index = 0; index < items.length; index += 1) {
    await typeInEditor(page, items[index]);
    await pressEnter(page);
  }

  await pressEnter(page);
}
