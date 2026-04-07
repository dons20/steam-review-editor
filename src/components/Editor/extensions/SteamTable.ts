import { Table } from "@tiptap/extension-table";
import { mergeAttributes } from "@tiptap/core";

/**
 * Extends the standard TipTap Table with Steam-specific attributes:
 * - noborder: removes all cell borders ( [table noborder=1] )
 * - equalcells: forces equal-width columns ( [table equalcells=1] )
 */
export const SteamTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      noborder: {
        default: null,
        parseHTML: element => element.getAttribute("data-noborder") || null,
        renderHTML: attributes => {
          if (!attributes.noborder) return {};
          return { "data-noborder": attributes.noborder };
        },
      },
      equalcells: {
        default: null,
        parseHTML: element => element.getAttribute("data-equalcells") || null,
        renderHTML: attributes => {
          if (!attributes.equalcells) return {};
          return { "data-equalcells": attributes.equalcells };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ["tbody", 0],
    ];
  },
}).configure({
  allowTableNodeSelection: true,
  resizable: true,
  HTMLAttributes: {
    class: "steam-table",
  },
});
