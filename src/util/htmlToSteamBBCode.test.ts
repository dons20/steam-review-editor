import { describe, expect, it } from "vitest";
import { cleanBBCode, htmlToSteamBBCode } from "./htmlToSteamBBCode";

describe("htmlToSteamBBCode", () => {
  describe("headers", () => {
    it("emits a single trailing newline after a header", () => {
      const html = "<h1>Example</h1><p>Text</p>";
      expect(cleanBBCode(htmlToSteamBBCode(html))).toBe("[h1]Example[/h1]\nText");
    });

    it("emits a single trailing newline after h2", () => {
      const html = "<h2>Subtitle</h2><p>Body</p>";
      expect(cleanBBCode(htmlToSteamBBCode(html))).toBe("[h2]Subtitle[/h2]\nBody");
    });

    it("emits a single trailing newline after h3", () => {
      const html = "<h3>Small</h3><p>Body</p>";
      expect(cleanBBCode(htmlToSteamBBCode(html))).toBe("[h3]Small[/h3]\nBody");
    });
  });

  describe("lists", () => {
    it("converts a flat list", () => {
      const html = "<ul><li><p>Alpha</p></li><li><p>Beta</p></li></ul>";
      expect(cleanBBCode(htmlToSteamBBCode(html))).toBe("[list]\n[*]Alpha\n[*]Beta\n[/list]");
    });

    it("converts nested lists with proper structure", () => {
      const html =
        "<ul><li><p>No indent</p><ul><li><p>With indent</p></li><li><p>With indent</p></li></ul></li><li><p>No indent</p></li></ul>";
      const result = cleanBBCode(htmlToSteamBBCode(html));
      expect(result).toBe(
        "[list]\n[*]No indent\n[list]\n[*]With indent\n[*]With indent\n[/list]\n[*]No indent\n[/list]"
      );
    });

    it("ensures newline before nested list when li has no p wrapper", () => {
      const html = "<ul><li>No indent<ul><li>With indent</li></ul></li></ul>";
      const result = cleanBBCode(htmlToSteamBBCode(html));
      expect(result).toBe("[list]\n[*]No indent\n[list]\n[*]With indent\n[/list]\n[/list]");
    });
  });
});
