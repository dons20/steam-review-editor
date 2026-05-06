import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { trackEvent } from "util/analytics";
import { usePrompt } from "../PromptContext";
import {
  addImage,
  addQuote,
  insertTable,
  clearContent,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrike,
  toggleHeading1,
  toggleHeading2,
  toggleHeading3,
  toggleBulletList,
  toggleOrderedList,
  toggleCodeBlock,
  toggleSpoiler,
  toggleNoParse,
  setHorizontalRule,
  clearFormatting,
  insertSteamStore,
  insertSteamWorkshop,
  insertYouTube,
} from "./tools";

type PromptFn = ReturnType<typeof usePrompt>["prompt"];
type ConfirmFn = ReturnType<typeof usePrompt>["confirm"];

interface UseToolbarActionsArgs {
  editor: Editor | null;
  prompt: PromptFn;
  confirm: ConfirmFn;
}

export function useToolbarActions({ editor, prompt, confirm }: UseToolbarActionsArgs) {
  const handleAddLink = useCallback(async () => {
    if (!editor) return;

    trackEvent("editor-toolbar-used", "Toolbar action: link");

    const previousUrl = editor.getAttributes("link").href || "";
    const url = await prompt({ title: "Enter Link URL:", defaultValue: previousUrl });
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else if (url === "") {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor, prompt]);

  const handleAddImage = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: image");
    addImage(editor, prompt);
  };

  const handleAddQuote = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: quote");
    addQuote(editor, prompt);
  };

  const handleInsertTable = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: table");
    insertTable(editor);
  };

  const handleClearContent = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: clear content");
    clearContent(editor, confirm);
  };

  const handleToggleBold = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: bold");
    toggleBold(editor);
  };

  const handleToggleItalic = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: italic");
    toggleItalic(editor);
  };

  const handleToggleUnderline = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: underline");
    toggleUnderline(editor);
  };

  const handleToggleStrike = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: strikethrough");
    toggleStrike(editor);
  };

  const handleToggleH1 = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 1");
    toggleHeading1(editor);
  };

  const handleToggleH2 = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 2");
    toggleHeading2(editor);
  };

  const handleToggleH3 = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 3");
    toggleHeading3(editor);
  };

  const handleToggleBulletList = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: bullet list");
    toggleBulletList(editor);
  };

  const handleToggleOrderedList = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: ordered list");
    toggleOrderedList(editor);
  };

  const handleToggleCodeBlock = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: code block");
    toggleCodeBlock(editor);
  };

  const handleToggleSpoiler = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: spoiler");
    toggleSpoiler(editor);
  };

  const handleToggleNoParse = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: no-parse");
    toggleNoParse(editor);
  };

  const handleSetHorizontalRule = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: horizontal rule");
    setHorizontalRule(editor);
  };

  const handleClearFormatting = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: clear formatting");
    clearFormatting(editor);
  };

  const handleInsertSteamStore = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: steam store");
    insertSteamStore(editor, prompt);
  };

  const handleInsertSteamWorkshop = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: steam workshop");
    insertSteamWorkshop(editor, prompt);
  };

  const handleInsertYouTube = () => {
    trackEvent("editor-toolbar-used", "Toolbar action: youtube");
    insertYouTube(editor, prompt);
  };

  return {
    handleAddLink,
    handleAddImage,
    handleAddQuote,
    handleInsertTable,
    handleClearContent,
    handleToggleBold,
    handleToggleItalic,
    handleToggleUnderline,
    handleToggleStrike,
    handleToggleH1,
    handleToggleH2,
    handleToggleH3,
    handleToggleBulletList,
    handleToggleOrderedList,
    handleToggleCodeBlock,
    handleToggleSpoiler,
    handleToggleNoParse,
    handleSetHorizontalRule,
    handleClearFormatting,
    handleInsertSteamStore,
    handleInsertSteamWorkshop,
    handleInsertYouTube,
  };
}
