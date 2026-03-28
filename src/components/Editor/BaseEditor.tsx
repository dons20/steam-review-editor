import "./editor.scss";

import React from "react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import TiptapUnderline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import { Bold, Italic, Underline, Strikethrough, Link } from "lucide-react";
import { toast } from "react-toastify";
import { Toolbar, TableMenu } from "./Helpers";
import { Spoiler, NoParse, Quote } from "./extensions";
import { steamBBCodeToHtml, containsSteamBBCode } from "util/steamBBCodeToHtml";

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

const SteamPasteExtension = Extension.create({
  name: "steamPasteExtension",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("steamPasteExtension"),
        props: {
          handlePaste: (view, event) => {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const plainText = clipboardData.getData("text/plain");

            // If the pasted text contains Steam BBCode, convert it
            if (plainText && containsSteamBBCode(plainText)) {
              event.preventDefault();
              const html = steamBBCodeToHtml(plainText);

              // Use TipTap's native insertContent which handles marks correctly
              // and safely triggers all internal state updates.
              this.editor.commands.insertContent(html);

              toast.info("Steam markup converted", {
                autoClose: 2000,
                position: "bottom-right",
                toastId: "bbcode-paste",
                hideProgressBar: true,
              });

              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
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
  TiptapUnderline,
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  }),
  CustomKeyboardShortcuts,
  SteamPasteExtension,
];

const BubbleMenuContent = () => {
  const { editor } = useCurrentEditor();
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    if (!editor) {
      return;
    }

    const update = () => forceUpdate();
    editor.on("transaction", update);

    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

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
      <div className="tooltip-wrapper">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`bubble-menu-button ${editor.isActive("bold") ? "is-active" : ""}`}
        >
          <Bold size={16} />
        </button>
        <span className="action-tooltip">Bold</span>
      </div>
      <div className="tooltip-wrapper">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`bubble-menu-button ${editor.isActive("italic") ? "is-active" : ""}`}
        >
          <Italic size={16} />
        </button>
        <span className="action-tooltip">Italic</span>
      </div>
      <div className="tooltip-wrapper">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`bubble-menu-button ${editor.isActive("underline") ? "is-active" : ""}`}
        >
          <Underline size={16} />
        </button>
        <span className="action-tooltip">Underline</span>
      </div>
      <div className="tooltip-wrapper">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`bubble-menu-button ${editor.isActive("strike") ? "is-active" : ""}`}
        >
          <Strikethrough size={16} />
        </button>
        <span className="action-tooltip">Strikethrough</span>
      </div>
      <div className="tooltip-wrapper">
        <button
          type="button"
          onClick={addLink}
          className={`bubble-menu-button ${editor.isActive("link") ? "is-active" : ""}`}
        >
          <Link size={16} />
        </button>
        <span className="action-tooltip">Link</span>
      </div>
    </div>
  );
};

interface BaseEditorProps {
  content?: string;
  onUpdate?: (html: string) => void;
}

const BaseEditor = ({ content, onUpdate }: BaseEditorProps) => {
  const handleUpdate = ({ editor }: { editor: any }) => {
    const html = editor.getHTML();

    // Propagate to parent (which handles preview + auto-save)
    if (onUpdate) {
      onUpdate(html);
    }
  };

  // Fire once after mount so the preview is populated from restored content
  // without requiring the user to make an edit first.
  const handleCreate = ({ editor }: { editor: any }) => {
    const html = editor.getHTML();
    if (onUpdate && html && html !== "<p></p>") {
      onUpdate(html);
    }
  };

  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      onCreate={handleCreate}
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
