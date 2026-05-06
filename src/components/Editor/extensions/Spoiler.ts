import { Mark, mergeAttributes } from "@tiptap/core";

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

export const Spoiler = Mark.create<SpoilerOptions>({
  name: "spoiler",

  inclusive: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-type='spoiler']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
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
          return commands.setMark(this.name);
        },
      toggleSpoiler:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },
      unsetSpoiler:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
