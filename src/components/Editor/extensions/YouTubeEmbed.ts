import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";

export interface YouTubeEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

/** Helper: create a div with a class and optional text content */
function div(className: string, text?: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function span(className: string, text?: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export const YouTubeEmbed = Node.create<YouTubeEmbedOptions>({
  name: "youtubeEmbed",
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
      videoid: {
        default: null,
        parseHTML: element => element.getAttribute("data-videoid"),
        renderHTML: attributes => {
          if (!attributes.videoid) return {};
          return { "data-videoid": attributes.videoid };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='youtube-embed']" }];
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/(www\.)?youtube\.com\/watch\?[^\s]*v=([-\w]+)[^\s]*/gi,
        type: this.type,
        getAttributes: match => ({ videoid: match[2] }),
      }),
      nodePasteRule({
        find: /https?:\/\/youtu\.be\/([-\w]+)[^\s]*/gi,
        type: this.type,
        getAttributes: match => ({ videoid: match[1] }),
      }),
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const videoid = node.attrs.videoid ?? "";
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "youtube-embed",
        class: "youtube-embed",
      }),
      [
        "div",
        { class: "yt-thumbnail" },
        ["div", { class: "yt-thumbnail-art" }],
        ["div", { class: "yt-badge", "aria-hidden": "true" }],
        ["div", { class: "yt-play" }],
      ],
      [
        "div",
        { class: "yt-body" },
        [
          "div",
          { class: "yt-title" },
          ["span", { class: "yt-title-label" }, "YouTube™ Video: "],
          ["span", { class: "yt-title-text" }, "Gameplay Breakdown: Action Fighter Review"],
        ],
        ["div", { class: "yt-views" }, "Views: 4,589"],
        [
          "div",
          { class: "yt-description" },
          `Original footage: https://video.example/watch?v=${videoid} Follow: https://social.example/reviewer Watch more at https://stream.example/live`,
        ],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const videoid = String(node.attrs.videoid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("youtube-embed");
      dom.contentEditable = "false";
      dom.setAttribute("data-type", "youtube-embed");
      if (videoid) dom.setAttribute("data-videoid", videoid);

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

      const thumbnail = div("yt-thumbnail");
      thumbnail.appendChild(div("yt-thumbnail-art"));
      const badge = div("yt-badge");
      badge.setAttribute("aria-hidden", "true");
      thumbnail.appendChild(badge);
      thumbnail.appendChild(div("yt-play"));
      dom.appendChild(thumbnail);

      const body = div("yt-body");
      const title = div("yt-title");
      title.appendChild(span("yt-title-label", "YouTube™ Video: "));
      title.appendChild(span("yt-title-text", "Gameplay Breakdown: Action Fighter Review"));
      body.appendChild(title);
      body.appendChild(div("yt-views", "Views: 4,589"));
      body.appendChild(
        div(
          "yt-description",
          `Original footage: https://video.example/watch?v=${videoid} Follow: https://social.example/reviewer Watch more at https://stream.example/live`
        )
      );
      dom.appendChild(body);

      return { dom };
    };
  },
});
