/**
 * Converts HTML output from TipTap editor to Steam BBCode format.
 *
 * Block-level elements each output their content followed by exactly one `\n`.
 * Empty paragraphs (blank lines in the editor) output a bare `\n`, which
 * preserves intentional spacing in the BBCode output.
 *
 * The `cleanBBCode` function only trims leading/trailing whitespace — it
 * does NOT collapse multiple newlines, because consecutive empty lines
 * represent intentional spacing from the user.
 *
 * @param html - The HTML string from the editor
 * @returns Steam BBCode formatted string
 */
export function htmlToSteamBBCode(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return processNode(doc.body);
}

function processNode(node: Node): string {
  let result = "";

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || "";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement;
      result += processElement(element);
    }
  });

  return result;
}

function trimInnerSpaces(content: string): {
  before: string;
  trimmed: string;
  after: string;
} {
  const leadingSpaces = content.match(/^\s*/)?.[0] || "";
  const trailingSpaces = content.match(/\s*$/)?.[0] || "";
  const trimmed = content.trim();

  return {
    before: leadingSpaces,
    trimmed: trimmed,
    after: trailingSpaces,
  };
}

function processElement(element: HTMLElement): string {
  const tagName = element.tagName.toLowerCase();
  const content = processNode(element);

  // For inline formatting tags, handle spacing properly
  const inlineFormattingTags = ["strong", "b", "em", "i", "u", "s", "strike"];

  if (inlineFormattingTags.includes(tagName)) {
    const { before, trimmed, after } = trimInnerSpaces(content);

    // Only process if there's actual content
    if (!trimmed) {
      return content;
    }

    let formatted = "";
    switch (tagName) {
      case "strong":
      case "b":
        formatted = `[b]${trimmed}[/b]`;
        break;
      case "em":
      case "i":
        formatted = `[i]${trimmed}[/i]`;
        break;
      case "u":
        formatted = `[u]${trimmed}[/u]`;
        break;
      case "s":
      case "strike":
        formatted = `[strike]${trimmed}[/strike]`;
        break;
    }

    return before + formatted + after;
  }

  switch (tagName) {
    // ── Block-level elements ──────────────────────────────────────────
    // Each block emits exactly one trailing \n.
    // Empty paragraphs (blank lines in the editor) emit just \n.

    case "p": {
      // Strip trailing <br> artifacts that TipTap adds to empty paragraphs
      const stripped = content.replace(/^\n+|\n+$/g, "").trim();
      if (!stripped) {
        // Empty paragraph → blank line
        return "\n";
      }
      return content + "\n";
    }

    case "br":
      return "\n";

    case "h1":
      return `[h1]${content}[/h1]\n\n`;

    case "h2":
      return `[h2]${content}[/h2]\n\n`;

    case "h3":
      return `[h3]${content}[/h3]\n\n`;

    case "ul":
      return `[list]\n${content}[/list]\n\n`;

    case "ol":
      return `[olist]\n${content}[/olist]\n\n`;

    case "li":
      return `[*]${content.replace(/\n+$/, "")}\n`;

    // ── Inline elements ──────────────────────────────────────────────

    case "a": {
      const href = element.getAttribute("href") || "";
      return `[url=${href}]${content}[/url]`;
    }

    case "img": {
      const src = element.getAttribute("src") || "";
      return `[img]${src}[/img]\n\n`;
    }

    case "code":
      // Inside a <pre> (code block) — content is handled by the <pre> case
      if (element.parentElement?.tagName.toLowerCase() === "pre") {
        return content;
      }
      return `[code]${content}[/code]`;

    case "pre": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "noparse") {
        return `[noparse]${content}[/noparse]\n\n`;
      }
      return `[code]${content}[/code]\n\n`;
    }

    case "blockquote": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "quote") {
        const author = element.getAttribute("data-author");
        const inner = content.trim();
        if (author) {
          return `[quote=${author}]${inner}[/quote]\n\n`;
        }
        return `[quote]${inner}[/quote]\n\n`;
      }
      return content;
    }

    case "div": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "spoiler") {
        return `[spoiler]${content.trim()}[/spoiler]\n\n`;
      }
      return content;
    }

    case "hr":
      return `[hr][/hr]\n\n`;

    case "table": {
      let tableContent = "";
      const rows = element.querySelectorAll("tr");

      rows.forEach((row) => {
        tableContent += "[tr]\n";

        const headers = row.querySelectorAll("th");
        headers.forEach((th) => {
          tableContent += `[th]${processNode(th).trim()}[/th]\n`;
        });

        const cells = row.querySelectorAll("td");
        cells.forEach((td) => {
          tableContent += `[td]${processNode(td).trim()}[/td]\n`;
        });

        tableContent += "[/tr]\n";
      });

      return `[table]\n${tableContent}[/table]\n\n`;
    }

    case "thead":
    case "tbody":
    case "tr":
    case "th":
    case "td":
      return content;

    default:
      return content;
  }
}

/**
 * Cleans up formatting in BBCode output.
 * Only trims leading/trailing whitespace — does NOT collapse multiple
 * newlines, because consecutive empty lines represent intentional spacing.
 */
export function cleanBBCode(bbcode: string): string {
  return bbcode.trim();
}
