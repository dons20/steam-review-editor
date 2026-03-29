import React from "react";
import { TableKit } from "@tiptap/extension-table";
import { Bold, Italic, Underline, Strikethrough, Link } from "lucide-react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import TiptapUnderline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { BubbleMenu } from "@tiptap/react/menus";
import TiptapLink from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { toast } from "react-toastify";
import { steamBBCodeToHtml, containsSteamBBCode } from "util/steamBBCodeToHtml";
import { PromptProvider, usePrompt } from "./PromptContext";
import { Spoiler, NoParse, Quote } from "./extensions";
import ImageBubbleMenu from "./ImageBubbleMenu";
import { Toolbar, TableMenu } from "./Helpers";
import LinkBubbleMenu from "./LinkBubbleMenu";

import "./editor.scss";

const CustomKeyboardShortcuts = Extension.create({
  name: "customKeyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-Shift-x": () => this.editor.commands.toggleStrike(),
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-i": () => this.editor.commands.toggleItalic(),
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
    blockquote: false,
    link: false,
    underline: false,
  }),
  Placeholder.configure({
    placeholder: "Write your review here...",
  }),
  Image.configure({
    HTMLAttributes: {
      class: "steam-image",
    },
  }),
  TableKit.configure({
    table: {
      allowTableNodeSelection: true,
      resizable: true,
      HTMLAttributes: {
        class: "steam-table",
      },
    },
  }),
  Spoiler,
  NoParse,
  Quote,
  TiptapUnderline,
  TiptapLink.configure({
    openOnClick: false,
    enableClickSelection: true,
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
  const { prompt } = usePrompt();
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

  if (!editor || editor.isActive("image") || editor.isActive("link")) {
    return null;
  }

  const handleAddLink = async () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = await prompt({
      title: "Enter Link URL:",
      defaultValue: previousUrl,
    });

    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else if (url === "") {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="baseBubbleMenu">
      <div className="bubble-menu">
        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={handleAddLink}
            className={`bubble-menu-button ${editor.isActive("link") ? "is-active" : ""}`}
          >
            <Link size={16} />
          </button>
          <span className="action-tooltip">Link</span>
        </div>

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
      </div>
    </BubbleMenu>
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
    <PromptProvider>
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
        <BubbleMenuContent />
        <LinkBubbleMenu />
        <ImageBubbleMenu />
        <TableMenu />
      </EditorProvider>
    </PromptProvider>
  );
};

export default BaseEditor;
