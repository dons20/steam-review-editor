import { Node, mergeAttributes } from "@tiptap/core";

export interface NoParseOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    noParse: {
      setNoParse: () => ReturnType;
      toggleNoParse: () => ReturnType;
      unsetNoParse: () => ReturnType;
    };
  }
}

export const NoParse = Node.create<NoParseOptions>({
  name: "noParse",

  group: "block",

  content: "text*",

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre[data-type='noparse']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "noparse",
        class: "noparse",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setNoParse:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
      toggleNoParse:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph");
        },
      unsetNoParse:
        () =>
        ({ commands }) => {
          return commands.setNode("paragraph");
        },
    };
  },
});
