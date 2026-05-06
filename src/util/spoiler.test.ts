import { describe, expect, it } from "vitest";
import { steamBBCodeToHtml } from "./steamBBCodeToHtml";
import { cleanBBCode, htmlToSteamBBCode } from "./htmlToSteamBBCode";

describe("spoiler conversion", () => {
  it("converts spoiler bbcode into inline spoiler html", () => {
    expect(steamBBCodeToHtml("Before [spoiler]secret[/spoiler] after")).toBe(
      '<p>Before <span data-type="spoiler" class="spoiler">secret</span> after</p>'
    );
  });

  it("converts inline spoiler html back into spoiler bbcode", () => {
    expect(
      cleanBBCode(htmlToSteamBBCode('<p>Before <span data-type="spoiler" class="spoiler">secret</span> after</p>'))
    ).toBe("Before [spoiler]secret[/spoiler] after");
  });

  it("merges adjacent spoiler segments around bold and italic text", () => {
    expect(
      cleanBBCode(
        htmlToSteamBBCode(
          '<p><span data-type="spoiler" class="spoiler">Before </span><strong><span data-type="spoiler" class="spoiler">bold</span></strong><span data-type="spoiler" class="spoiler"> and </span><em><span data-type="spoiler" class="spoiler">italic</span></em><span data-type="spoiler" class="spoiler"> after</span></p>'
        )
      )
    ).toBe("[spoiler]Before [b]bold[/b] and [i]italic[/i] after[/spoiler]");
  });
});
