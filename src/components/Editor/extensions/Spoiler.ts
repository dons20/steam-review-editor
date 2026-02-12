import { Node, mergeAttributes } from "@tiptap/core";

export interface SpoilerOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spoiler: {
      setSpoiler: () => ReturnType;
      toggleSpoiler: () => ReturnType;
      unsetSpoiler: () => ReturnType;
    };
  }
}

export const Spoiler = Node.create<SpoilerOptions>({
  name: "spoiler",

  group: "block",

  content: "block+",

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='spoiler']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "spoiler",
        class: "spoiler",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSpoiler:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      toggleSpoiler:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
      unsetSpoiler:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});
