/**
 * Converts Steam BBCode markup to HTML compatible with the TipTap editor.
 *
 * Strategy:
 *  1. Replace all block-level BBCode tags with unique placeholders, storing
 *     the converted HTML.
 *  2. Split the remaining text by newlines and process each line:
 *       - Empty lines → <p></p>  (preserved as blank lines in the editor)
 *       - Lines that are only a block placeholder → restore the HTML
 *       - Lines with text/inline tags → <p>applyInlineTags(text)</p>
 *  3. This approach preserves intentional spacing (empty lines) from the
 *     original BBCode while keeping the round-trip conversion lossless.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escapes HTML entities so literal text doesn't get interpreted as HTML. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Apply inline BBCode tags (bold, italic, etc.) to a string */
function applyInlineTags(text: string): string {
  let result = text;

  result = result.replace(/\[b\]([\s\S]*?)\[\/b\]/gi, "<strong>$1</strong>");
  result = result.replace(/\[i\]([\s\S]*?)\[\/i\]/gi, "<em>$1</em>");
  result = result.replace(/\[u\]([\s\S]*?)\[\/u\]/gi, "<u>$1</u>");
  result = result.replace(/\[strike\]([\s\S]*?)\[\/strike\]/gi, "<s>$1</s>");
  result = result.replace(
    /\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi,
    (_match, content: string) => `<span data-type="spoiler" class="spoiler">${applyInlineTags(content.trim())}</span>`
  );

  // URLs
  result = result.replace(
    /\[url=["']?([^\]"']+)["']?\]([\s\S]*?)\[\/url\]/gi,
    (_match, href: string, label: string) => {
      const url = /^https?:\/\//i.test(href) ? href : `https://${href}`;
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }
  );

  // Images (inline context)
  result = result.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, '<img src="$1" class="steam-image" />');

  return result;
}

function restoreBlockPlaceholders(text: string, blocks: string[]): string {
  return text.replace(/%%BLOCK_(\d+)%%/g, (_match, index: string) => blocks[parseInt(index, 10)]);
}

function replaceListBlocks(text: string, addBlock: (html: string) => string, blocks: string[]): string {
  let result = text;

  while (true) {
    const listStart = result.lastIndexOf("[list]");
    const olistStart = result.lastIndexOf("[olist]");

    if (listStart === -1 && olistStart === -1) break;

    let tag: { open: string; close: string; htmlTag: string };
    let start: number;

    if (listStart > olistStart) {
      tag = { open: "[list]", close: "[/list]", htmlTag: "ul" };
      start = listStart;
    } else {
      tag = { open: "[olist]", close: "[/olist]", htmlTag: "ol" };
      start = olistStart;
    }

    const afterOpen = start + tag.open.length;
    const closeStart = result.indexOf(tag.close, afterOpen);
    if (closeStart === -1) break;

    const inner = result.slice(afterOpen, closeStart);
    const items = inner.split(/\[\*\]/gi).filter(s => s.trim());
    const replacement = addBlock(
      `<${tag.htmlTag}>` +
        items
          .map(item => {
            const parts = item.split(/(%%BLOCK_\d+%%)/);
            const html = parts
              .map(part => {
                if (/^%%BLOCK_\d+%%$/.test(part)) {
                  return restoreBlockPlaceholders(part, blocks);
                }
                const trimmed = part.trim();
                return trimmed ? `<p>${applyInlineTags(trimmed)}</p>` : "";
              })
              .join("");
            return `<li>${html}</li>`;
          })
          .join("") +
        `</${tag.htmlTag}>`
    );

    result = result.slice(0, start) + replacement + result.slice(closeStart + tag.close.length);
  }

  return result;
}

function replaceVerbatimBlocks(text: string, addBlock: (html: string) => string): string {
  const openTagPattern = /\[(code|noparse)\]/gi;
  let result = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = openTagPattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1].toLowerCase();
    const startIndex = match.index;
    const contentStart = startIndex + fullMatch.length;
    const closeTag = `[/${tagName}]`;
    const lowerText = text.toLowerCase();
    const closeIndex = lowerText.indexOf(closeTag, contentStart);

    if (closeIndex === -1) {
      continue;
    }

    result += text.slice(cursor, startIndex);

    const content = text.slice(contentStart, closeIndex);
    result +=
      tagName === "noparse"
        ? addBlock(`<pre data-type="noparse" class="noparse">${escapeHtml(content)}</pre>`)
        : addBlock(`<pre><code>${escapeHtml(content)}</code></pre>`);

    cursor = closeIndex + closeTag.length;
    openTagPattern.lastIndex = cursor;
  }

  result += text.slice(cursor);
  return result;
}

// ---------------------------------------------------------------------------
// Main converter
// ---------------------------------------------------------------------------

export function steamBBCodeToHtml(bbcode: string): string {
  if (!bbcode || !bbcode.trim()) return "";

  // Normalise line-endings
  let text = bbcode.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Storage for block-level HTML replacements
  const blocks: string[] = [];

  function addBlock(html: string): string {
    const idx = blocks.length;
    blocks.push(html);
    return `%%BLOCK_${idx}%%`;
  }

  // ── 1. Replace block-level tags with placeholders ────────────────────

  // [code] and [noparse] are both verbatim blocks. Protect the outermost one
  // first so nested tags stay literal instead of being parsed into placeholders.
  text = replaceVerbatimBlocks(text, addBlock);

  // [table] – complex block (with optional options: noborder=1, equalcells=1)
  text = text.replace(/\[table([^\]]*)\]([\s\S]*?)\[\/table\]/gi, (_match, options: string, tableContent: string) => {
    const noborder = /noborder\s*=\s*1/i.test(options) ? "1" : null;
    const equalcells = /equalcells\s*=\s*1/i.test(options) ? "1" : null;
    return addBlock(convertTable(tableContent, noborder, equalcells));
  });

  // Steam Store URL embed: [url=...store.steampowered.com/app/ID/...]...[/url]
  text = text.replace(
    /\[url=["']?https?:\/\/store\.steampowered\.com\/app\/([\d]+)\/?[^\]]*["']?\][\s\S]*?\[\/url\]/gi,
    (_match, appid: string) => {
      return addBlock(buildStoreEmbedHtml(appid));
    }
  );

  // Steam Workshop URL embed: [url=...steamcommunity.com/sharedfiles/filedetails/?id=ID...]...[/url]
  text = text.replace(
    /\[url=["']?https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=([\d]+)[^\]]*["']?\][\s\S]*?\[\/url\]/gi,
    (_match, workshopid: string) => {
      return addBlock(buildWorkshopEmbedHtml(workshopid));
    }
  );

  // Headings
  text = text.replace(/\[h1\]([\s\S]*?)\[\/h1\]/gi, (_m, c: string) =>
    addBlock(`<h1>${applyInlineTags(c.trim())}</h1>`)
  );
  text = text.replace(/\[h2\]([\s\S]*?)\[\/h2\]/gi, (_m, c: string) =>
    addBlock(`<h2>${applyInlineTags(c.trim())}</h2>`)
  );
  text = text.replace(/\[h3\]([\s\S]*?)\[\/h3\]/gi, (_m, c: string) =>
    addBlock(`<h3>${applyInlineTags(c.trim())}</h3>`)
  );

  // Lists — processed inside-out via replaceListBlocks so nested lists work
  text = replaceListBlocks(text, addBlock, blocks);

  // Quote (with optional author)
  text = text.replace(/\[quote=([^\]]+)\]([\s\S]*?)\[\/quote\]/gi, (_match, author: string, content: string) => {
    const cleanAuthor = author.replace(/^["']|["']$/g, "");
    const processedContent = restoreBlockPlaceholders(applyInlineTags(content.trim()), blocks);
    return addBlock(
      `<blockquote data-type="quote" class="quote" data-author="${escapeHtml(cleanAuthor)}"><p>${processedContent}</p></blockquote>`
    );
  });
  text = text.replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, (_m, c: string) =>
    addBlock(
      `<blockquote data-type="quote" class="quote"><p>${restoreBlockPlaceholders(applyInlineTags(c.trim()), blocks)}</p></blockquote>`
    )
  );

  // Horizontal rule
  text = text.replace(/\[hr\]\s*\[\/hr\]/gi, () => addBlock("<hr>"));
  text = text.replace(/\[hr\]/gi, () => addBlock("<hr>"));

  // [img] as block-level
  text = text.replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_m, src: string) =>
    addBlock(`<img src="${src.trim()}" class="steam-image" />`)
  );

  // ── 2. Process remaining text line by line ──────────────────────────

  // Collapse the decorative blank line that follows a block placeholder.
  // Block tags emit \n\n for readability in the markup textarea, but when
  // converting back to rich text those extra blank lines would become
  // spurious empty paragraphs.
  text = text.replace(/(%%BLOCK_\d+%%)\n+/g, "$1\n");

  const lines = text.split("\n");
  const blockPlaceholderPattern = /^%%BLOCK_(\d+)%%$/;
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line → empty paragraph (renders as a blank line in the editor)
    if (!trimmed) {
      result.push("<p></p>");
      continue;
    }

    // Line is exactly one block placeholder → restore the block HTML
    const blockMatch = trimmed.match(blockPlaceholderPattern);
    if (blockMatch) {
      const idx = parseInt(blockMatch[1], 10);
      result.push(blocks[idx]);
      continue;
    }

    const storeMatch = trimmed.match(/^https?:\/\/store\.steampowered\.com\/app\/(\d+)\/?[^\s]*$/i);
    if (storeMatch) {
      result.push(buildStoreEmbedHtml(storeMatch[1]));
      continue;
    }

    const workshopMatch = trimmed.match(
      /^https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)[^\s]*$/i
    );
    if (workshopMatch) {
      result.push(buildWorkshopEmbedHtml(workshopMatch[1]));
      continue;
    }

    // Bare YouTube URL on its own line → YouTube embed block
    const ytMatch =
      trimmed.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?.*v=([-\w]+)/i) ||
      trimmed.match(/^https?:\/\/youtu\.be\/([-\w]+)/i);
    if (ytMatch) {
      const videoid = ytMatch[2] ?? ytMatch[1];
      result.push(buildYouTubeEmbedHtml(videoid));
      continue;
    }

    // Text/inline content → apply inline tags and wrap in <p>
    // First restore any embedded block placeholders (rare but possible)
    let processed = applyInlineTags(trimmed);
    processed = processed.replace(/%%BLOCK_(\d+)%%/g, (_m, idxStr: string) => blocks[parseInt(idxStr, 10)]);

    result.push(`<p>${processed}</p>`);
  }

  // Filter out leading/trailing empty paragraphs from the overall document
  // to avoid extra blank lines at the very start/end
  while (result.length > 0 && result[0] === "<p></p>") result.shift();
  while (result.length > 0 && result[result.length - 1] === "<p></p>") result.pop();

  return result.join("");
}

// ---------------------------------------------------------------------------
// Table converter
// ---------------------------------------------------------------------------

function buildStoreEmbedHtml(appid: string): string {
  return `<div data-type="steam-store-embed" data-appid="${appid}" class="steam-store-embed"><div class="steam-embed-cover"></div><div class="steam-embed-info"><div class="steam-embed-title">Example Game</div><div class="steam-embed-meta">App #${appid}</div></div></div>`;
}

function buildWorkshopEmbedHtml(workshopid: string): string {
  return `<div data-type="steam-workshop-embed" data-workshopid="${workshopid}" class="steam-workshop-embed"><div class="steam-embed-cover"></div><div class="steam-embed-info"><div class="steam-embed-title">Example Workshop Item</div><div class="steam-embed-meta">Workshop #${workshopid}</div></div></div>`;
}

function buildYouTubeEmbedHtml(videoid: string): string {
  return `<div data-type="youtube-embed" data-videoid="${videoid}" class="youtube-embed"><div class="youtube-embed-thumbnail"><div class="youtube-embed-play"></div></div><div class="youtube-embed-caption">youtube.com/watch?v=${videoid}</div></div>`;
}

function convertTable(raw: string, noborder: string | null = null, equalcells: string | null = null): string {
  const attrs: string[] = [];
  if (noborder) attrs.push(`data-noborder="${noborder}"`);
  if (equalcells) attrs.push(`data-equalcells="${equalcells}"`);
  const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";
  let html = `<table${attrStr}>`;

  const headerRegex = /\[th\]([\s\S]*?)\[\/th\]/gi;
  const headerMatches = [...raw.matchAll(headerRegex)];

  if (headerMatches.length > 0) {
    html += "<tr>";
    headerMatches.forEach(m => {
      html += `<th><p>${applyInlineTags(m[1].trim())}</p></th>`;
    });
    html += "</tr>";
  }

  const rowRegex = /\[tr\]([\s\S]*?)\[\/tr\]/gi;
  let rowMatch: RegExpExecArray | null;
  while ((rowMatch = rowRegex.exec(raw)) !== null) {
    const rowContent = rowMatch[1];
    html += "<tr>";

    const cellRegex = /\[td\]([\s\S]*?)\[\/td\]/gi;
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      html += `<td><p>${applyInlineTags(cellMatch[1].trim())}</p></td>`;
    }

    html += "</tr>";
  }

  html += "</table>";
  return html;
}

// ---------------------------------------------------------------------------
// Detection helper
// ---------------------------------------------------------------------------

/** Returns true if the text probably contains Steam BBCode */
export function containsSteamBBCode(text: string): boolean {
  const bbcodePattern = /\[(h[1-3]|b|i|u|strike|url|img|code|noparse|spoiler|quote|table|list|olist|hr)\b/i;
  return bbcodePattern.test(text);
}
