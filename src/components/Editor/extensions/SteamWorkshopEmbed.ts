import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";

export interface SteamWorkshopEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

/** Helper: create a div with a class and optional text content */
function div(className: string, text?: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export const SteamWorkshopEmbed = Node.create<SteamWorkshopEmbedOptions>({
  name: "steamWorkshopEmbed",
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
      workshopid: {
        default: null,
        parseHTML: element => element.getAttribute("data-workshopid"),
        renderHTML: attributes => {
          if (!attributes.workshopid) return {};
          return { "data-workshopid": attributes.workshopid };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='steam-workshop-embed']" }];
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=(\d+)[^\s]*/gi,
        type: this.type,
        getAttributes: match => ({ workshopid: match[1] }),
      }),
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const workshopid = node.attrs.workshopid ?? "";
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "steam-workshop-embed",
        class: "steam-workshop-embed",
      }),
      ["div", { class: "sw-thumbnail" }],
      [
        "div",
        { class: "sw-body" },
        ["div", { class: "sw-title" }, "Example Workshop Item"],
        ["div", { class: "sw-subtitle" }, "A Steam Workshop Guide"],
        ["div", { class: "sw-author" }, "By: Workshop Author"],
        ["div", { class: "sw-description" }, `Workshop #${workshopid} \xb7 steamcommunity.com`],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const workshopid = String(node.attrs.workshopid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("steam-workshop-embed");
      dom.setAttribute("data-type", "steam-workshop-embed");
      if (workshopid) dom.setAttribute("data-workshopid", workshopid);

      for (const [key, value] of Object.entries(HTMLAttributes)) {
        if (value != null) dom.setAttribute(key, String(value));
      }

      dom.appendChild(div("sw-thumbnail"));

      const body = div("sw-body");
      body.appendChild(div("sw-title", "Example Workshop Item"));
      body.appendChild(div("sw-subtitle", "A Steam Workshop Guide"));
      body.appendChild(div("sw-author", "By: Workshop Author"));
      body.appendChild(div("sw-description", `Workshop #${workshopid} \xb7 steamcommunity.com`));

      dom.appendChild(body);

      return { dom };
    };
  },
});
