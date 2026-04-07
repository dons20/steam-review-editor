import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";

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
      ["div", { class: "sw-thumbnail" }, ["div", { class: "sw-thumbnail-art" }]],
      [
        "div",
        { class: "sw-body" },
        ["div", { class: "sw-title" }, "Making your first Hat and Using In-Game"],
        ["div", { class: "sw-subtitle" }, "A Guide for Example Game"],
        ["div", { class: "sw-author" }, "By: Helpful Modder"],
        [
          "div",
          { class: "sw-description" },
          `Workshop #${workshopid} - Learn how to build your first cosmetic item and use it in-game with this illustrated step-by-step guide.`,
        ],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const workshopid = String(node.attrs.workshopid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("steam-workshop-embed");
      dom.contentEditable = "false";
      dom.setAttribute("data-type", "steam-workshop-embed");
      if (workshopid) dom.setAttribute("data-workshopid", workshopid);

      dom.addEventListener("mousedown", event => {
        event.preventDefault();
        const pos = typeof getPos === "function" ? getPos() : getPos;
        if (typeof pos !== "number") return;

        const { state, view } = editor;
        view.dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)));
        view.focus();
      });

      for (const [key, value] of Object.entries(HTMLAttributes)) {
        if (value != null) dom.setAttribute(key, String(value));
      }

      const thumbnail = div("sw-thumbnail");
      thumbnail.appendChild(div("sw-thumbnail-art"));
      dom.appendChild(thumbnail);

      const body = div("sw-body");
      body.appendChild(div("sw-title", "Making your first Hat and Using In-Game"));
      body.appendChild(div("sw-subtitle", "A Guide for Example Game"));
      body.appendChild(div("sw-author", "By: Helpful Modder"));
      body.appendChild(
        div(
          "sw-description",
          `Workshop #${workshopid} - Learn how to build your first cosmetic item and use it in-game with this illustrated step-by-step guide.`
        )
      );

      dom.appendChild(body);

      return { dom };
    };
  },
});
