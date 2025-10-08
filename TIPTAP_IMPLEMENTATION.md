# TipTap v3 Steam Review Editor - Implementation Guide

## Overview
This document provides an overview of the TipTap v3 implementation for the Steam Review Editor application.

## Features Implemented

### 1. Custom TipTap Extensions

#### Spoiler Extension (`src/components/Editor/extensions/Spoiler.ts`)
- Creates a block-level spoiler element
- Renders as `<div data-type="spoiler">` in HTML
- Converts to `[spoiler]...[/spoiler]` in Steam BBCode
- Commands: `setSpoiler()`, `toggleSpoiler()`, `unsetSpoiler()`

#### NoParse Extension (`src/components/Editor/extensions/NoParse.ts`)
- Creates a block that prevents Steam from parsing markup
- Renders as `<pre data-type="noparse">` in HTML
- Converts to `[noparse]...[/noparse]` in Steam BBCode
- Commands: `setNoParse()`, `toggleNoParse()`, `unsetNoParse()`

#### Quote Extension (`src/components/Editor/extensions/Quote.ts`)
- Creates a blockquote with optional author attribution
- Renders as `<blockquote data-type="quote" data-author="...">` in HTML
- Converts to `[quote=author]...[/quote]` in Steam BBCode
- Commands: `setQuote()`, `toggleQuote()`, `unsetQuote()`, `updateQuoteAuthor()`

### 2. Toolbar Component (`src/components/Editor/Helpers/Toolbar.tsx`)

The toolbar includes buttons for all Steam-supported formatting:

**Text Formatting:**
- Bold (Ctrl+B)
- Italic (Ctrl+I)
- Underline (Ctrl+U)
- Strikethrough (Ctrl+Shift+X)

**Headers:**
- H1, H2, H3 (Steam-supported heading levels)

**Lists:**
- Bullet List (unordered)
- Ordered List (numbered)

**Rich Content:**
- Links (Ctrl+K) - prompts for URL
- Images - prompts for URL
- Tables - inserts 3x3 table with headers

**Steam-Specific:**
- Code Block - for code snippets
- Quote - prompts for optional author name
- Spoiler - hides content until hovered/clicked
- NoParse - displays text without Steam parsing
- Horizontal Rule - adds separator line

**Utilities:**
- Clear All - removes all content (with confirmation)

### 3. Bubble Menu (`src/components/Editor/BaseEditor.tsx`)

Context menu that appears when text is selected, featuring:
- Bold
- Italic
- Underline
- Strikethrough
- Link (prompts for URL)

### 4. HTML to Steam BBCode Converter (`src/util/htmlToSteamBBCode.ts`)

Converts TipTap's HTML output to Steam's BBCode format:

| HTML Element | Steam BBCode |
|--------------|--------------|
| `<strong>`, `<b>` | `[b]...[/b]` |
| `<em>`, `<i>` | `[i]...[/i]` |
| `<u>` | `[u]...[/u]` |
| `<s>`, `<strike>` | `[strike]...[/strike]` |
| `<h1>` | `[h1]...[/h1]` |
| `<h2>` | `[h2]...[/h2]` |
| `<h3>` | `[h3]...[/h3]` |
| `<ul>` | `[list]...[/list]` |
| `<ol>` | `[olist]...[/olist]` |
| `<li>` | `[*]...` |
| `<a href="...">` | `[url=...]...[/url]` |
| `<img src="...">` | `[img]...[/img]` |
| `<pre>` (code) | `[code]...[/code]` |
| `<div data-type="spoiler">` | `[spoiler]...[/spoiler]` |
| `<pre data-type="noparse">` | `[noparse]...[/noparse]` |
| `<blockquote data-type="quote">` | `[quote]...[/quote]` or `[quote=author]...[/quote]` |
| `<hr>` | `[hr][/hr]` |
| `<table>` | `[table][tr][th/td]...[/tr][/table]` |

### 5. Keyboard Shortcuts

Implemented via custom extension (`CustomKeyboardShortcuts`):

- **Ctrl+B** - Toggle Bold (built-in)
- **Ctrl+I** - Toggle Italic (built-in)
- **Ctrl+U** - Toggle Underline (custom)
- **Ctrl+Shift+X** - Toggle Strikethrough (custom)
- **Ctrl+K** - Insert Link (custom, with prompt)

### 6. Content Persistence

**Auto-save:**
- Content automatically saves to `localStorage` 3 seconds after the last edit
- Key: `"content"`
- Format: HTML string

**Load on Startup:**
- Editor checks `localStorage` for saved content
- Loads automatically when the app starts
- Falls back to empty editor if no saved content

**Manual Clear:**
- Clear All button in toolbar
- Shows confirmation dialog
- Saves empty state to localStorage

### 7. Preview System

**Store Preview:**
- Displays content as it would appear on Steam
- Renders HTML with Steam-themed styling
- Includes custom elements: spoilers, quotes, code blocks, tables, etc.
- Located in left column of preview section

**Markup Preview:**
- Displays the Steam BBCode format
- Shows exactly what to copy/paste into Steam
- Uses monospace font for clarity
- Located in right column of preview section

## File Structure

```
src/
├── components/
│   ├── Editor/
│   │   ├── BaseEditor.tsx          # Main editor component with TipTap setup
│   │   ├── index.tsx                # Wrapper with persistence logic
│   │   ├── editor.scss              # Editor and bubble menu styles
│   │   ├── extensions/
│   │   │   ├── Spoiler.ts          # Custom spoiler extension
│   │   │   ├── NoParse.ts          # Custom noparse extension
│   │   │   ├── Quote.ts            # Custom quote extension
│   │   │   └── index.ts            # Extension exports
│   │   └── Helpers/
│   │       ├── Toolbar.tsx         # Toolbar component
│   │       └── toolbar.scss        # Toolbar styles
│   ├── Preview/
│   │   ├── index.tsx               # Preview component
│   │   ├── Markup.tsx              # Markup display component
│   │   └── preview.scss            # Steam-themed preview styles
│   └── Content/
│       └── index.tsx               # Main content wrapper with context
└── util/
    └── htmlToSteamBBCode.ts        # HTML to BBCode converter
```

## Usage

### Basic Editing
1. Type content in the editor
2. Use toolbar buttons or keyboard shortcuts to format text
3. Content auto-saves every 3 seconds

### Adding Links
1. Select text or place cursor
2. Click link button or press Ctrl+K
3. Enter URL in prompt
4. Link is created

### Adding Images
1. Click image button in toolbar
2. Enter image URL in prompt
3. Image is inserted

### Adding Tables
1. Click table button in toolbar
2. 3x3 table with headers is inserted
3. Edit cells as needed

### Creating Quotes
1. Click quote button in toolbar
2. Enter author name (optional) in prompt
3. Type quote content

### Using Spoilers
1. Click spoiler button in toolbar
2. Type content that should be hidden
3. In preview, content is black until hovered

### Copying to Steam
1. Click "Show Preview" button
2. Review content in Store Preview
3. Click "Copy Markup to Clipboard" button
4. Paste into Steam review

## Steam BBCode Reference

Based on: https://steamcommunity.com/comment/Recommendation/formattinghelp

All formatting options listed above are supported by the editor.

## Dependencies

```json
{
  "@tiptap/core": "^3.6.5",
  "@tiptap/react": "^3.6.5",
  "@tiptap/starter-kit": "^3.6.5",
  "@tiptap/extension-placeholder": "^3.6.5",
  "@tiptap/extension-underline": "^3.6.5",
  "@tiptap/extension-link": "^3.6.5",
  "@tiptap/extension-image": "^3.6.5",
  "@tiptap/extension-table": "^3.6.5",
  "@tiptap/extension-table-row": "^3.6.5",
  "@tiptap/extension-table-cell": "^3.6.5",
  "@tiptap/extension-table-header": "^3.6.5"
}
```

## Known Limitations

1. **Tables:** While functional, table editing in TipTap may require some manual adjustment
2. **Images:** Only URL-based images are supported (no file upload)
3. **YouTube/Steam Widgets:** These automatic Steam features are not rendered in preview
4. **Table Options:** Steam's `noborder` and `equalcells` attributes not yet supported

## Future Enhancements

- [ ] Add more sophisticated table controls
- [ ] Support for Steam widget previews
- [ ] Better mobile experience
- [ ] Undo/Redo buttons in toolbar
- [ ] Export/Import functionality
- [ ] Template system for common review structures
- [ ] Character/word count display
