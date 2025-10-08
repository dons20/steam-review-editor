import { Node, mergeAttributes } from "@tiptap/core";

export interface QuoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    quote: {
      setQuote: (attributes?: { author?: string }) => ReturnType;
      toggleQuote: (attributes?: { author?: string }) => ReturnType;
      unsetQuote: () => ReturnType;
      updateQuoteAuthor: (author: string) => ReturnType;
    };
  }
}

export const Quote = Node.create<QuoteOptions>({
  name: "quote",

  group: "block",

  content: "block+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      author: {
        default: null,
        parseHTML: element => element.getAttribute("data-author"),
        renderHTML: attributes => {
          if (!attributes.author) {
            return {};
          }
          return {
            "data-author": attributes.author,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "blockquote[data-type='quote']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "quote",
        class: "quote",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setQuote:
        attributes =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
      toggleQuote:
        attributes =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes);
        },
      unsetQuote:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
      updateQuoteAuthor:
        author =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { author });
        },
    };
  },
});
