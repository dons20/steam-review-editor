import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";

export interface SteamStoreEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

/** Helper: create a div with a class and optional text content */
function div(className: string, text?: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export const SteamStoreEmbed = Node.create<SteamStoreEmbedOptions>({
  name: "steamStoreEmbed",
//   priority: 1000,
  group: "block",
  atom: true,
  selectable: true,

  marks: "",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      appid: {
        default: null,
        parseHTML: element => element.getAttribute("data-appid"),
        renderHTML: attributes => {
          if (!attributes.appid) return {};
          return { "data-appid": attributes.appid };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='steam-store-embed']" }];
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/store\.steampowered\.com\/app\/(\d+)[^\s]*/gi,
        type: this.type,
        getAttributes: match => ({ appid: match[1] }),
      }),
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const appid = node.attrs.appid ?? "";
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "steam-store-embed",
        class: "steam-store-embed",
      }),
      [
        "div",
        { class: "ss-header" },
        ["div", { class: "ss-header-title" }, "Buy Example Game"],
        ["div", { class: "ss-header-badge" }, "STEAM"],
      ],
      [
        "div",
        { class: "ss-body" },
        ["div", { class: "ss-cover" }],
        ["div", { class: "ss-description" }, "This game is available on Steam. Visit the store page for pricing, reviews, and more details about the game."],
      ],
      [
        "div",
        { class: "ss-footer" },
        ["div", { class: "ss-platforms" }, "PC \xb7 Mac \xb7 Linux"],
        ["div", { class: "ss-appid" }, `App #${appid}`],
        ["div", { class: "ss-buy" }, "View on Steam"],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const appid = String(node.attrs.appid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("steam-store-embed");
      dom.setAttribute("data-type", "steam-store-embed");
      if (appid) dom.setAttribute("data-appid", appid);

      // Apply any extra HTML attributes
      for (const [key, value] of Object.entries(HTMLAttributes)) {
        if (value != null) dom.setAttribute(key, String(value));
      }

      const header = div("ss-header");
      header.appendChild(div("ss-header-title", "Buy Example Game"));
      header.appendChild(div("ss-header-badge", "STEAM"));

      const body = div("ss-body");
      body.appendChild(div("ss-cover"));
      body.appendChild(div("ss-description", "This game is available on Steam. Visit the store page for pricing, reviews, and more details about the game."));

      const footer = div("ss-footer");
      footer.appendChild(div("ss-platforms", "PC \xb7 Mac \xb7 Linux"));
      footer.appendChild(div("ss-appid", `App #${appid}`));
      footer.appendChild(div("ss-buy", "View on Steam"));

      dom.appendChild(header);
      dom.appendChild(body);
      dom.appendChild(footer);

      return { dom };
    };
  },
});
