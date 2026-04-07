# Analytics Events

This project uses GoatCounter custom events via `src/util/analytics.ts`.

## Principles

- Use a **small, low-noise** event set.
- Let GoatCounter's built-in pageview tracking handle page loads.
- Do **not** send raw review text, markup, URLs, or other user content.
- Event `path` values must not start with `/`.

## Current event inventory

### Core / engagement
- `core-editor-loaded` — editor became ready
- `core-help-opened` — guide/help modal opened

### Editor usage
- `editor-toolbar-used` — any toolbar or bubble-menu formatting action
- `editor-mode-switched` — switched between rich text and markup modes
- `editor-bbcode-pasted` — pasted Steam BBCode that was auto-converted

### Preview usage
- `preview-used` — preview opened, randomized, or settings adjusted

### Funnel signals
- `funnel-review-started` — first meaningful edit in a session
- `funnel-review-resumed` — saved draft restored from local storage
- `funnel-preview-opened` — preview opened
- `funnel-copy-markup` — markup copied successfully

### Error / quality signals
Generated via `trackError(area, reason, title)` and normalized into GoatCounter event names such as:
- `quality-clipboard-copy-failed`
- `quality-conversion-html-to-bbcode-error`
- `quality-conversion-bbcode-to-html-error`
- `quality-localstorage-content-parse-error`
- `quality-localstorage-save-content-failed`
- `quality-localstorage-save-markup-failed`
- `quality-localstorage-preview-settings-parse-error`
- `quality-localstorage-preview-settings-save-error`
- `quality-service-worker-registration-error`

## Manual verification

In local development, analytics events are logged to the browser console with an `[analytics]` prefix before they are sent to GoatCounter.

Suggested smoke test:
1. Open the app
2. Type into the editor
3. Use a toolbar button
4. Open preview
5. Copy markup
6. Check the browser console and GoatCounter event dashboard
