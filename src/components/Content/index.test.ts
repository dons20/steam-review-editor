import { describe, expect, it, vi, afterEach } from "vitest";
import { normalizePreviewSpoilers } from "./normalizePreviewSpoilers";

describe("normalizePreviewSpoilers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("skips DOM parsing when the html contains no spoiler markup", () => {
    const parseSpy = vi.spyOn(DOMParser.prototype, "parseFromString");
    const html = "<p>No spoiler markup here</p>";

    expect(normalizePreviewSpoilers(html)).toBe(html);
    expect(parseSpy).not.toHaveBeenCalled();
  });

  it("merges spoiler markup that wraps inline formatting", () => {
    expect(
      normalizePreviewSpoilers(
        '<p><span data-type="spoiler" class="spoiler">Before </span><strong><span data-type="spoiler" class="spoiler">bold</span></strong><span data-type="spoiler" class="spoiler"> and </span><em><span data-type="spoiler" class="spoiler">italic</span></em><span data-type="spoiler" class="spoiler"> after</span></p>'
      )
    ).toBe(
      '<p><span data-type="spoiler" class="spoiler">Before <strong>bold</strong> and <em>italic</em> after</span></p>'
    );
  });
});
