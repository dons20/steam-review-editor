import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import {
  TablerBold,
  TablerItalic,
  TablerUnderline,
  TablerStrikethrough,
  TablerH1,
  TablerH2,
  TablerH3,
  TablerList,
  TablerListNumbers,
  TablerLink,
  TablerPhoto,
  TablerTable,
  TablerCode,
  TablerQuote,
  TablerEyeOff,
  TablerCircleOff,
  TablerMinus,
  TablerTrash,
  TablerClearFormatting,
} from "components/Icons";
import "./toolbar.scss";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, active, disabled, tooltip, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`toolbar-button ${active ? "is-active" : ""}`}
      data-tooltip={tooltip}
    >
      {children}
    </button>
  );
};

const ToolbarDivider = () => <div className="toolbar-divider" />;

export const Toolbar: React.FC = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addQuote = () => {
    const author = window.prompt("Enter author name (optional):");
    if (author !== null) {
      editor
        .chain()
        .focus()
        .toggleQuote({ author: author || undefined })
        .run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const clearContent = () => {
    if (window.confirm("Are you sure you want to clear all content?")) {
      editor.commands.clearContent();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          tooltip="Bold (Ctrl+B)"
        >
          <TablerBold />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          tooltip="Italic (Ctrl+I)"
        >
          <TablerItalic />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          tooltip="Underline (Ctrl+U)"
        >
          <TablerUnderline />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          tooltip="Strikethrough (Ctrl+Shift+X)"
        >
          <TablerStrikethrough />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          tooltip="Heading 1"
        >
          <TablerH1 />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          tooltip="Heading 2"
        >
          <TablerH2 />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          tooltip="Heading 3"
        >
          <TablerH3 />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          tooltip="Bullet List"
        >
          <TablerList />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          tooltip="Ordered List"
        >
          <TablerListNumbers />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} tooltip="Insert Link (Ctrl+K)">
          <TablerLink />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} tooltip="Insert Image">
          <TablerPhoto />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} tooltip="Insert Table">
          <TablerTable />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          tooltip="Code Block"
        >
          <TablerCode />
        </ToolbarButton>
        <ToolbarButton onClick={addQuote} active={editor.isActive("quote")} tooltip="Quote">
          <TablerQuote />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSpoiler().run()}
          active={editor.isActive("spoiler")}
          tooltip="Spoiler"
        >
          <TablerEyeOff />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleNoParse().run()}
          active={editor.isActive("noParse")}
          tooltip="No Parse"
        >
          <TablerCircleOff />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} tooltip="Horizontal Rule">
          <TablerMinus />
        </ToolbarButton>
      </div>

      <ToolbarDivider />

      <div className="toolbar-group">
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          tooltip="Clear Formatting"
        >
          <TablerClearFormatting />
        </ToolbarButton>
        <ToolbarButton onClick={clearContent} tooltip="Clear All Content">
          <TablerTrash />
        </ToolbarButton>
      </div>
    </div>
  );
};
