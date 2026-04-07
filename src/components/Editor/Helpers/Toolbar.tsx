import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import Tooltip from "components/Tooltip";
import { trackEvent } from "util/analytics";
import { usePrompt } from "../PromptContext";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconLink,
  IconPhoto,
  IconTable,
  IconCode,
  IconQuote,
  IconEyeOff,
  IconCircleOff,
  IconMinus,
  IconTrash,
  IconClearFormatting,
  IconStore,
  IconWorkshop,
  IconYoutube,
} from "components/Icons";
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
import "./toolbar.scss";
import { useEditorReady } from "../useEditorReady";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo(({ onClick, active, disabled, tooltip, children }) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`toolbar-button ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="top">
        {button}
      </Tooltip>
    );
  }

  return button;
});

const ToolbarDivider = () => <div className="toolbar-divider" />;

export const Toolbar: React.FC = () => {
  const { editor } = useCurrentEditor();
  const ready = useEditorReady();
  const { prompt, confirm } = usePrompt();
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const handleAddLink = React.useCallback(async () => {
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

  React.useEffect(() => {
    if (!editor || !ready) {
      return;
    }

    const update = () => forceUpdate();
    editor.on("transaction", update);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        handleAddLink();
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.off("transaction", update);
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, ready, handleAddLink]);

  if (!editor || !ready) {
    return null;
  }

  const handleAddImage = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: image");
    addImage(editor, prompt);
  }, [editor, prompt]);
  const handleAddQuote = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: quote");
    addQuote(editor, prompt);
  }, [editor, prompt]);
  const handleInsertTable = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: table");
    insertTable(editor);
  }, [editor]);
  const handleClearContent = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: clear content");
    clearContent(editor, confirm);
  }, [editor, confirm]);

  const handleToggleBold = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: bold");
    toggleBold(editor);
  }, [editor]);
  const handleToggleItalic = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: italic");
    toggleItalic(editor);
  }, [editor]);
  const handleToggleUnderline = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: underline");
    toggleUnderline(editor);
  }, [editor]);
  const handleToggleStrike = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: strikethrough");
    toggleStrike(editor);
  }, [editor]);

  const handleToggleH1 = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 1");
    toggleHeading1(editor);
  }, [editor]);
  const handleToggleH2 = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 2");
    toggleHeading2(editor);
  }, [editor]);
  const handleToggleH3 = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: heading 3");
    toggleHeading3(editor);
  }, [editor]);

  const handleToggleBulletList = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: bullet list");
    toggleBulletList(editor);
  }, [editor]);
  const handleToggleOrderedList = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: ordered list");
    toggleOrderedList(editor);
  }, [editor]);

  const handleToggleCodeBlock = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: code block");
    toggleCodeBlock(editor);
  }, [editor]);
  const handleToggleSpoiler = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: spoiler");
    toggleSpoiler(editor);
  }, [editor]);
  const handleToggleNoParse = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: no-parse");
    toggleNoParse(editor);
  }, [editor]);

  const handleSetHorizontalRule = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: horizontal rule");
    setHorizontalRule(editor);
  }, [editor]);
  const handleClearFormatting = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: clear formatting");
    clearFormatting(editor);
  }, [editor]);
  const handleInsertSteamStore = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: steam store");
    insertSteamStore(editor, prompt);
  }, [editor, prompt]);
  const handleInsertSteamWorkshop = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: steam workshop");
    insertSteamWorkshop(editor, prompt);
  }, [editor, prompt]);
  const handleInsertYouTube = React.useCallback(() => {
    trackEvent("editor-toolbar-used", "Toolbar action: youtube");
    insertYouTube(editor, prompt);
  }, [editor, prompt]);

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <ToolbarButton onClick={handleToggleBold} active={editor.isActive("bold")} tooltip="Bold (Ctrl+B)">
          <IconBold />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleItalic} active={editor.isActive("italic")} tooltip="Italic (Ctrl+I)">
          <IconItalic />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleToggleUnderline}
          active={editor.isActive("underline")}
          tooltip="Underline (Ctrl+U)"
        >
          <IconUnderline />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleToggleStrike}
          active={editor.isActive("strike")}
          tooltip="Strikethrough (Ctrl+Shift+X)"
        >
          <IconStrikethrough />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleToggleH1} active={editor.isActive("heading", { level: 1 })} tooltip="Heading 1">
          <IconH1 />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleH2} active={editor.isActive("heading", { level: 2 })} tooltip="Heading 2">
          <IconH2 />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleH3} active={editor.isActive("heading", { level: 3 })} tooltip="Heading 3">
          <IconH3 />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleToggleBulletList} active={editor.isActive("bulletList")} tooltip="Bullet List">
          <IconList />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleOrderedList} active={editor.isActive("orderedList")} tooltip="Ordered List">
          <IconListNumbers />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleAddLink} active={editor.isActive("link")} tooltip="Insert Link (Ctrl+K)">
          <IconLink />
        </ToolbarButton>
        <ToolbarButton onClick={handleAddImage} tooltip="Insert Image">
          <IconPhoto />
        </ToolbarButton>
        <ToolbarButton onClick={handleInsertTable} tooltip="Insert Table">
          <IconTable />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleToggleCodeBlock} active={editor.isActive("codeBlock")} tooltip="Code Block">
          <IconCode />
        </ToolbarButton>
        <ToolbarButton onClick={handleAddQuote} active={editor.isActive("quote")} tooltip="Quote">
          <IconQuote />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleSpoiler} active={editor.isActive("spoiler")} tooltip="Spoiler">
          <IconEyeOff />
        </ToolbarButton>
        <ToolbarButton onClick={handleToggleNoParse} active={editor.isActive("noParse")} tooltip="No Parse">
          <IconCircleOff />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleSetHorizontalRule} tooltip="Horizontal Rule">
          <IconMinus />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleInsertSteamStore} tooltip="Insert Steam Store">
          <IconStore />
        </ToolbarButton>
        <ToolbarButton onClick={handleInsertSteamWorkshop} tooltip="Insert Steam Workshop">
          <IconWorkshop />
        </ToolbarButton>
        <ToolbarButton onClick={handleInsertYouTube} tooltip="Insert YouTube">
          <IconYoutube />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={handleClearFormatting} tooltip="Clear Formatting">
          <IconClearFormatting />
        </ToolbarButton>
        <ToolbarButton onClick={handleClearContent} tooltip="Clear All Content">
          <IconTrash />
        </ToolbarButton>
      </div>
    </div>
  );
};
