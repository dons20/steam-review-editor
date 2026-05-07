import { describe, expect, it } from "vitest";
import { steamBBCodeToHtml } from "./steamBBCodeToHtml";
import { cleanBBCode, htmlToSteamBBCode } from "./htmlToSteamBBCode";

describe("noparse and code conversion", () => {
  it("renders noparse blocks as noparse html instead of code blocks", () => {
    expect(steamBBCodeToHtml("[noparse][b]literal[/b][/noparse]")).toBe(
      '<pre data-type="noparse" class="noparse">[b]literal[/b]</pre>'
    );
  });

  it("converts noparse html back into noparse bbcode without parsing inner tags", () => {
    expect(cleanBBCode(htmlToSteamBBCode('<pre data-type="noparse" class="noparse">[b]literal[/b]</pre>'))).toBe(
      "[noparse][b]literal[/b][/noparse]"
    );
  });

  it("restores nested block placeholders inside quoted noparse and code content", () => {
    const input =
      "[quote=skdjgsl][code]s[u]dkjf[/u]hs[noparse]kdl[b]jhs[/b]fd[/noparse][b]g[/b][/code]sdf[u]sdf[/u][/quote]";

    const html = steamBBCodeToHtml(input);
    const roundTrip = cleanBBCode(htmlToSteamBBCode(html));

    expect(html).not.toContain("%%BLOCK_");
    expect(roundTrip).not.toContain("%%BLOCK_");
    expect(roundTrip).toContain("[quote=skdjgsl]");
    expect(roundTrip).toContain("[code]s[u]dkjf[/u]hs[noparse]kdl[b]jhs[/b]fd[/noparse][b]g[/b][/code]");
    expect(roundTrip).toContain("sdf[u]sdf[/u][/quote]");
  });
});
