import { Node, mergeAttributes, nodePasteRule } from "@tiptap/core";

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
      // youtube.com/watch?v=ID
      nodePasteRule({
        find: /https?:\/\/(www\.)?youtube\.com\/watch\?[^\s]*v=([-\w]+)[^\s]*/gi,
        type: this.type,
        getAttributes: match => ({ videoid: match[2] }),
      }),
      // youtu.be/ID
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
        ["div", { class: "yt-play" }],
      ],
      [
        "div",
        { class: "yt-body" },
        ["div", { class: "yt-label" }, "YouTube\u2122 Video:"],
        ["div", { class: "yt-title" }, `youtube.com/watch?v=${videoid}`],
        ["div", { class: "yt-views" }, "Views: \u2014"],
        ["div", { class: "yt-description" }, "Click to watch this video on YouTube."],
      ],
    ];
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const videoid = String(node.attrs.videoid ?? "");
      const dom = document.createElement("div");
      dom.classList.add("youtube-embed");
      dom.setAttribute("data-type", "youtube-embed");
      if (videoid) dom.setAttribute("data-videoid", videoid);

      for (const [key, value] of Object.entries(HTMLAttributes)) {
        if (value != null) dom.setAttribute(key, String(value));
      }

      const thumbnail = div("yt-thumbnail");
      thumbnail.appendChild(div("yt-play"));
      dom.appendChild(thumbnail);

      const body = div("yt-body");
      body.appendChild(div("yt-label", "YouTube\u2122 Video:"));
      body.appendChild(div("yt-title", `youtube.com/watch?v=${videoid}`));
      body.appendChild(div("yt-views", "Views: \u2014"));
      body.appendChild(div("yt-description", "Click to watch this video on YouTube."));
      dom.appendChild(body);

      return { dom };
    };
  },
});
