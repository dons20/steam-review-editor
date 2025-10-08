/**
 * Converts HTML output from TipTap editor to Steam BBCode format
 * @param html - The HTML string from the editor
 * @returns Steam BBCode formatted string
 */
export function htmlToSteamBBCode(html: string): string {
  // Create a temporary div to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return processNode(doc.body);
}

function processNode(node: Node): string {
  let result = "";

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || "";
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement;
      result += processElement(element);
    }
  });

  return result;
}

function trimInnerSpaces(content: string): { before: string; trimmed: string; after: string } {
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
    case "p":
      return content + "\n\n";

    case "br":
      return "\n";

    case "h1":
      return `[h1]${content}[/h1]\n`;

    case "h2":
      return `[h2]${content}[/h2]\n`;

    case "h3":
      return `[h3]${content}[/h3]\n`;

    case "ul":
      return `[list]\n${content}[/list]\n`;

    case "ol":
      return `[olist]\n${content}[/olist]\n`;

    case "li":
      return `[*]${content}\n`;

    case "a": {
      const href = element.getAttribute("href") || "";
      return `[url=${href}]${content}[/url]`;
    }

    case "img": {
      const src = element.getAttribute("src") || "";
      return `[img]${src}[/img]\n`;
    }

    case "code":
      // Check if it's inside a pre tag (code block) or inline code
      if (element.parentElement?.tagName.toLowerCase() === "pre") {
        return content;
      }
      return `[code]${content}[/code]`;

    case "pre": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "noparse") {
        return `[noparse]${content}[/noparse]\n`;
      }
      // Regular code block
      return `[code]${content}[/code]\n`;
    }

    case "blockquote": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "quote") {
        const author = element.getAttribute("data-author");
        if (author) {
          return `[quote=${author}]${content}[/quote]\n`;
        }
        return `[quote]${content}[/quote]\n`;
      }
      return content;
    }

    case "div": {
      const dataType = element.getAttribute("data-type");
      if (dataType === "spoiler") {
        return `[spoiler]${content}[/spoiler]\n`;
      }
      return content;
    }

    case "hr":
      return `[hr][/hr]\n`;

    case "table": {
      let tableContent = "";
      const rows = element.querySelectorAll("tr");

      rows.forEach(row => {
        tableContent += "[tr]\n";

        // Check for header cells
        const headers = row.querySelectorAll("th");
        headers.forEach(th => {
          tableContent += `[th]${processNode(th)}[/th]\n`;
        });

        // Check for data cells
        const cells = row.querySelectorAll("td");
        cells.forEach(td => {
          tableContent += `[td]${processNode(td)}[/td]\n`;
        });

        tableContent += "[/tr]\n";
      });

      return `[table]\n${tableContent}[/table]\n`;
    }

    case "thead":
    case "tbody":
    case "tr":
    case "th":
    case "td":
      // These are handled by the table case
      return content;

    default:
      return content;
  }
}

/**
 * Cleans up extra whitespace and formatting in BBCode
 */
export function cleanBBCode(bbcode: string): string {
  return bbcode
    .replace(/\n{3,}/g, "\n\n") // Replace multiple newlines with double newline
    .replace(/\n\s+\n/g, "\n\n") // Remove whitespace-only lines
    .trim();
}
