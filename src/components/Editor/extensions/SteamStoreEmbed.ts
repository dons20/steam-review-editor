import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import React from "react";
import { CircleDot, Disc3, Monitor } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

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

function platformIcon(className: string, icon: typeof Monitor | typeof Disc3): HTMLDivElement {
  const el = div(`ss-platform ${className}`);
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = renderToStaticMarkup(React.createElement(icon, { size: 15, strokeWidth: 2 }));
  return el;
}

function badgeIcon(): HTMLDivElement {
  const el = div("ss-header-badge");
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = renderToStaticMarkup(React.createElement(CircleDot, { size: 24, strokeWidth: 2 }));
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
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "steam-store-embed",
        class: "steam-store-embed",
      }),
      ["div", { class: "ss-header" }, ["div", { class: "ss-header-title" }, "Buy Placeholder Arena 6"], badgeIcon()],
      [
        "div",
        { class: "ss-body" },
        ["div", { class: "ss-cover" }, ["div", { class: "ss-cover-art" }], ["div", { class: "ss-cover-accent" }]],
        [
          "div",
          { class: "ss-description" },
          "A bold action showcase with three distinct modes, dramatic arenas, and a flexible combat system built for long sessions and fast rematches.",
        ],
      ],
      [
        "div",
        { class: "ss-footer" },
        [
          "div",
          { class: "ss-utility" },
          [
            "div",
            { class: "ss-platforms", "aria-hidden": "true" },
            platformIcon("ss-platform-monitor", Monitor),
            platformIcon("ss-platform-disc", Disc3),
          ],
        ],
        [
          "div",
          { class: "ss-cta" },
          ["div", { class: "ss-price" }, "$59.99 USD"],
          ["div", { class: "ss-buy" }, "Buy on Steam"],
        ],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const appid = String(node.attrs.appid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("steam-store-embed");
      dom.contentEditable = "false";
      dom.setAttribute("data-type", "steam-store-embed");
      if (appid) dom.setAttribute("data-appid", appid);

      dom.addEventListener("mousedown", event => {
        event.preventDefault();
        const pos = typeof getPos === "function" ? getPos() : getPos;
        if (typeof pos !== "number") return;

        const { state, view } = editor;
        view.dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
        view.focus();
      });

      // Apply any extra HTML attributes
      for (const [key, value] of Object.entries(HTMLAttributes)) {
        if (value != null) dom.setAttribute(key, String(value));
      }

      const header = div("ss-header");
      header.appendChild(div("ss-header-title", "Buy Placeholder Arena 6"));
      header.appendChild(badgeIcon());

      const body = div("ss-body");
      const cover = div("ss-cover");
      cover.appendChild(div("ss-cover-art"));
      cover.appendChild(div("ss-cover-accent"));
      body.appendChild(cover);
      body.appendChild(
        div(
          "ss-description",
          "A bold action showcase with three distinct modes, dramatic arenas, and a flexible combat system built for long sessions and fast rematches."
        )
      );

      const footer = div("ss-footer");
      const utility = div("ss-utility");
      const platforms = div("ss-platforms");
      platforms.setAttribute("aria-hidden", "true");
      platforms.appendChild(platformIcon("ss-platform-monitor", Monitor));
      platforms.appendChild(platformIcon("ss-platform-disc", Disc3));
      utility.appendChild(platforms);

      const cta = div("ss-cta");
      cta.appendChild(div("ss-price", "$59.99 USD"));
      cta.appendChild(div("ss-buy", "Buy on Steam"));

      footer.appendChild(utility);
      footer.appendChild(cta);

      dom.appendChild(header);
      dom.appendChild(body);
      dom.appendChild(footer);

      return { dom };
    };
  },
});
