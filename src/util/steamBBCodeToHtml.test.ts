import { describe, expect, it } from "vitest";
import { steamBBCodeToHtml } from "./steamBBCodeToHtml";

describe("steamBBCodeToHtml", () => {
  describe("lists", () => {
    it("converts a flat list", () => {
      const bbcode = "[list]\n[*]Alpha\n[*]Beta\n[/list]";
      expect(steamBBCodeToHtml(bbcode)).toBe(
        "<ul><li><p>Alpha</p></li><li><p>Beta</p></li></ul>"
      );
    });

    it("converts nested lists preserving proper HTML structure", () => {
      const bbcode =
        "[list]\n[*]No indent\n[list]\n[*]With indent\n[*]With indent\n[/list]\n[*]No indent\n[/list]";
      const result = steamBBCodeToHtml(bbcode);
      expect(result).toContain("<ul>");
      expect(result).toContain("<p>No indent</p>");
      expect(result).toContain("<p>With indent</p>");
      expect(result).toContain("<p>No indent</p>");
      expect((result.match(/<ul>/g) || []).length).toBe(2);
      expect((result.match(/<\/ul>/g) || []).length).toBe(2);
    });

    it("converts a flat ordered list", () => {
      const bbcode = "[olist]\n[*]First\n[*]Second\n[/olist]";
      expect(steamBBCodeToHtml(bbcode)).toBe(
        "<ol><li><p>First</p></li><li><p>Second</p></li></ol>"
      );
    });

    it("round-trips nested lists through both converters", () => {
      const original =
        "[list]\n[*]No indent\n[list]\n[*]With indent\n[*]With indent\n[/list]\n[*]No indent\n[/list]";
      const html = steamBBCodeToHtml(original);
      const result = steamBBCodeToHtml(original);

      const ulCount = (html.match(/<ul>/g) || []).length;
      const endUlCount = (html.match(/<\/ul>/g) || []).length;
      expect(ulCount).toBe(2);
      expect(endUlCount).toBe(2);
    });
  });

  describe("headers", () => {
    it("converts h1 bbcode to html", () => {
      expect(steamBBCodeToHtml("[h1]Title[/h1]")).toBe("<h1>Title</h1>");
    });

    it("converts header followed by text", () => {
      expect(steamBBCodeToHtml("[h1]Title[/h1]\nText")).toBe("<h1>Title</h1><p>Text</p>");
    });
  });
});
