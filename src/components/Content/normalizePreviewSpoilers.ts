const SPOILER_SELECTOR = "span[data-type='spoiler']";
const INLINE_FORMATTED_SPOILER_SELECTOR = ["strong", "b", "em", "i", "u", "s", "strike"]
  .map(tag => `${tag} > ${SPOILER_SELECTOR}`)
  .join(", ");
const SPOILER_MARKER = 'data-type="spoiler"';

function isSpoilerElement(node: Node | null): node is HTMLElement {
  return node instanceof HTMLElement && node.tagName === "SPAN" && node.getAttribute("data-type") === "spoiler";
}

export function normalizePreviewSpoilers(html: string): string {
  if (!html.includes(SPOILER_MARKER)) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll(INLINE_FORMATTED_SPOILER_SELECTOR).forEach(node => {
    const spoiler = node as HTMLElement;
    const inlineWrapper = spoiler.parentElement;

    if (!inlineWrapper || inlineWrapper.childNodes.length !== 1) {
      return;
    }

    const mergedSpoiler = spoiler.cloneNode(false) as HTMLElement;
    inlineWrapper.replaceWith(mergedSpoiler);
    mergedSpoiler.appendChild(inlineWrapper);
  });

  doc.querySelectorAll(SPOILER_SELECTOR).forEach(node => {
    const spoiler = node as HTMLElement;
    const parentSpoiler = spoiler.parentElement?.closest(SPOILER_SELECTOR);

    if (!parentSpoiler) {
      return;
    }

    while (spoiler.firstChild) {
      spoiler.parentNode?.insertBefore(spoiler.firstChild, spoiler);
    }

    spoiler.remove();
  });

  const mergeAdjacentSpoilers = (parent: ParentNode) => {
    let current = parent.firstChild;

    while (current) {
      if (current instanceof HTMLElement) {
        mergeAdjacentSpoilers(current);
      }

      if (!isSpoilerElement(current)) {
        current = current?.nextSibling ?? null;
        continue;
      }

      let next = current.nextSibling;

      while (
        next?.nodeType === Node.TEXT_NODE &&
        !(next.textContent ?? "").trim() &&
        isSpoilerElement(next.nextSibling)
      ) {
        current.appendChild(next);
        next = current.nextSibling;
      }

      while (isSpoilerElement(next)) {
        while (next.firstChild) {
          current.appendChild(next.firstChild);
        }

        const nodeToRemove = next;
        next = next.nextSibling;
        nodeToRemove.remove();

        while (
          next?.nodeType === Node.TEXT_NODE &&
          !(next.textContent ?? "").trim() &&
          isSpoilerElement(next.nextSibling)
        ) {
          current.appendChild(next);
          next = current.nextSibling;
        }
      }

      current = next;
    }
  };

  mergeAdjacentSpoilers(doc.body);

  return doc.body.innerHTML;
}
