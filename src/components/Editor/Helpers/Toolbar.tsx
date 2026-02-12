import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import Tooltip from "components/Tooltip";
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
} from "components/Icons";
import {
  addLink,
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
} from "./tools";
import "./toolbar.scss";

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

  // Wrap with tooltip if tooltip text is provided
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

  if (!editor) {
    return null;
  }

  const handleAddLink = React.useCallback(() => addLink(editor), [editor]);
  const handleAddImage = React.useCallback(() => addImage(editor), [editor]);
  const handleAddQuote = React.useCallback(() => addQuote(editor), [editor]);
  const handleInsertTable = React.useCallback(() => insertTable(editor), [editor]);
  const handleClearContent = React.useCallback(() => clearContent(editor), [editor]);

  const handleToggleBold = React.useCallback(() => toggleBold(editor), [editor]);
  const handleToggleItalic = React.useCallback(() => toggleItalic(editor), [editor]);
  const handleToggleUnderline = React.useCallback(() => toggleUnderline(editor), [editor]);
  const handleToggleStrike = React.useCallback(() => toggleStrike(editor), [editor]);

  const handleToggleH1 = React.useCallback(() => toggleHeading1(editor), [editor]);
  const handleToggleH2 = React.useCallback(() => toggleHeading2(editor), [editor]);
  const handleToggleH3 = React.useCallback(() => toggleHeading3(editor), [editor]);

  const handleToggleBulletList = React.useCallback(() => toggleBulletList(editor), [editor]);
  const handleToggleOrderedList = React.useCallback(() => toggleOrderedList(editor), [editor]);

  const handleToggleCodeBlock = React.useCallback(() => toggleCodeBlock(editor), [editor]);
  const handleToggleSpoiler = React.useCallback(() => toggleSpoiler(editor), [editor]);
  const handleToggleNoParse = React.useCallback(() => toggleNoParse(editor), [editor]);

  const handleSetHorizontalRule = React.useCallback(() => setHorizontalRule(editor), [editor]);
  const handleClearFormatting = React.useCallback(() => clearFormatting(editor), [editor]);

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
