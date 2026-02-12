import "./editor.scss";

import React from "react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Extension } from "@tiptap/core";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import Tooltip from "components/Tooltip";
import { Toolbar, TableMenu } from "./Helpers";
import { Spoiler, NoParse, Quote } from "./extensions";

// Custom keyboard shortcuts extension
const CustomKeyboardShortcuts = Extension.create({
  name: "customKeyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      // Ctrl+U for underline
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      // Ctrl+Shift+X for strikethrough
      "Mod-Shift-x": () => this.editor.commands.toggleStrike(),
      // Ctrl+K for link
      "Mod-k": () => {
        const url = window.prompt("Enter URL:");
        if (url) {
          this.editor.chain().focus().setLink({ href: url }).run();
        }
        return true;
      },
    };
  },
});

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    link: {
      openOnClick: false,
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
      },
    },
  }),
  Placeholder.configure({
    placeholder: "Write your review here...",
  }),
  Image.configure({
    HTMLAttributes: {
      class: "steam-image",
    },
  }),
  Table.configure({
    allowTableNodeSelection: true,
    HTMLAttributes: {
      class: "steam-table",
    },
  }),
  TableRow,
  TableCell,
  TableHeader,
  Spoiler,
  NoParse,
  Quote,
  CustomKeyboardShortcuts,
];

const BubbleMenuContent = () => {
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

  return (
    <div className="bubble-menu">
      <Tooltip content="Bold">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`bubble-menu-button ${editor.isActive("bold") ? "is-active" : ""}`}
        >
          <FaBold />
        </button>
      </Tooltip>
      <Tooltip content="Italic">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`bubble-menu-button ${editor.isActive("italic") ? "is-active" : ""}`}
        >
          <FaItalic />
        </button>
      </Tooltip>
      <Tooltip content="Underline">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`bubble-menu-button ${editor.isActive("underline") ? "is-active" : ""}`}
        >
          <FaUnderline />
        </button>
      </Tooltip>
      <Tooltip content="Strikethrough">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`bubble-menu-button ${editor.isActive("strike") ? "is-active" : ""}`}
        >
          <FaStrikethrough />
        </button>
      </Tooltip>
      <Tooltip content="Link">
        <button
          type="button"
          onClick={addLink}
          className={`bubble-menu-button ${editor.isActive("link") ? "is-active" : ""}`}
        >
          <FaLink />
        </button>
      </Tooltip>
    </div>
  );
};

interface BaseEditorProps {
  content?: string;
  onUpdate?: (html: string) => void;
}

const BaseEditor = ({ content, onUpdate }: BaseEditorProps) => {
  const [saveTimer, setSaveTimer] = React.useState<NodeJS.Timeout | null>(null);

  const handleUpdate = ({ editor }: { editor: any }) => {
    const html = editor.getHTML();

    // Call parent onUpdate immediately for preview
    if (onUpdate) {
      onUpdate(html);
    }

    // Debounced autosave to localStorage
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    const timer = setTimeout(() => {
      localStorage.setItem("content", html);

      toast.info("Content auto-saved", {
        autoClose: 2000,
        position: "bottom-right",
        toastId: "autosave-notification",
        hideProgressBar: true,
      });
    }, 3000);

    setSaveTimer(timer);
  };

  // Save on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [saveTimer]);

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      onUpdate={handleUpdate}
      slotBefore={
        <div className="editor-toolbar-header">
          <Toolbar />
        </div>
      }
      editorProps={{
        attributes: {
          class: "tiptap-editor",
        },
      }}
    >
      <BubbleMenu editor={null}>
        <BubbleMenuContent />
      </BubbleMenu>
      <TableMenu />
    </EditorProvider>
  );
};

export default BaseEditor;
