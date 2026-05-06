import type { Editor } from "@tiptap/core";
import type { EditorStateSnapshot } from "@tiptap/react";

export function toolbarStateSelector(ctx: EditorStateSnapshot<Editor>) {
  const currentEditor = ctx.editor;

  return {
    isBold: currentEditor.isActive("bold") ?? false,
    // canBold: currentEditor.can().chain().toggleBold().run() ?? false,
    isItalic: currentEditor.isActive("italic") ?? false,
    // canItalic: currentEditor.can().chain().toggleItalic().run() ?? false,
    isStrike: currentEditor.isActive("strike") ?? false,
    // canStrike: currentEditor.can().chain().toggleStrike().run() ?? false,
    isUnderline: currentEditor.isActive("underline") ?? false,
    // canUnderline: currentEditor.can().chain().toggleUnderline().run() ?? false,
    isCode: currentEditor.isActive("code") ?? false,
    // canCode: currentEditor.can().chain().toggleCode().run() ?? false,
    canClearMarks: currentEditor.can().chain().unsetAllMarks().run() ?? false,

    isParagraph: currentEditor.isActive("paragraph") ?? false,
    isHeading1: currentEditor.isActive("heading", { level: 1 }) ?? false,
    isHeading2: currentEditor.isActive("heading", { level: 2 }) ?? false,
    isHeading3: currentEditor.isActive("heading", { level: 3 }) ?? false,

    isBulletList: currentEditor.isActive("bulletList") ?? false,
    isOrderedList: currentEditor.isActive("orderedList") ?? false,
    isCodeBlock: currentEditor.isActive("codeBlock") ?? false,
    isQuote: currentEditor.isActive("quote") ?? false,
    isLink: currentEditor.isActive("link") ?? false,
    isSpoiler: currentEditor.isActive("spoiler") ?? false,
    isNoParse: currentEditor.isActive("noParse") ?? false,

    canUndo: currentEditor.can().chain().undo().run() ?? false,
    canRedo: currentEditor.can().chain().redo().run() ?? false,
  };
}
