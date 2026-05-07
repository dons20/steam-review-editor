import React from "react";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Bold, Italic, Underline, Strikethrough, Link, EyeOff } from "lucide-react";
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
import { trackError, trackEvent } from "util/analytics";
import { PromptProvider, usePrompt } from "./PromptContext";
import { Spoiler, NoParse, Quote, SteamTable, SteamStoreEmbed, SteamWorkshopEmbed, YouTubeEmbed } from "./extensions";
import ImageBubbleMenu from "./ImageBubbleMenu";
import EmbedBubbleMenu from "./EmbedBubbleMenu";
import QuoteBubbleMenu from "./QuoteBubbleMenu";
import { useEditorReady } from "./useEditorReady";
import { Toolbar, TableMenu } from "./Helpers";
import { addLink, toggleBold, toggleItalic, toggleSpoiler, toggleStrike, toggleUnderline } from "./Helpers/tools";
import LinkBubbleMenu from "./LinkBubbleMenu";

import "./editor.scss";

const CustomKeyboardShortcuts = Extension.create({
  name: "customKeyboardShortcuts",

  addKeyboardShortcuts() {
    return {
      "Mod-u": () => {
        toggleUnderline(this.editor);
        return true;
      },
      "Mod-Shift-x": () => {
        toggleStrike(this.editor);
        return true;
      },
      "Mod-b": () => {
        toggleBold(this.editor);
        return true;
      },
      "Mod-i": () => {
        toggleItalic(this.editor);
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
          handlePaste: (_view, event) => {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const plainText = clipboardData.getData("text/plain").trim();

            // If the pasted text contains Steam BBCode, convert it
            if (plainText && containsSteamBBCode(plainText)) {
              event.preventDefault();

              try {
                const html = steamBBCodeToHtml(plainText);

                // Use TipTap's native insertContent which handles marks correctly
                // and safely triggers all internal state updates.
                this.editor.commands.insertContent(html);
                trackEvent("editor-bbcode-pasted", "Converted pasted Steam markup");

                toast.info("Steam markup converted", {
                  autoClose: 2000,
                  position: "bottom-right",
                  toastId: "bbcode-paste",
                  hideProgressBar: true,
                });

                return true;
              } catch (error) {
                trackError("conversion", "bbcode-paste-error", "Steam markup paste conversion failed");
                console.error("Failed to convert pasted Steam markup:", error);
              }
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
  SteamTable,
  TableRow,
  TableCell,
  TableHeader,
  SteamStoreEmbed,
  SteamWorkshopEmbed,
  YouTubeEmbed,
  Spoiler,
  NoParse,
  Quote,
  TiptapUnderline,
  TiptapLink.configure({
    openOnClick: false,
    defaultProtocol: "https",
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
  const ready = useEditorReady();
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

  if (
    !ready ||
    !editor ||
    editor.isActive("image") ||
    editor.isActive("link") ||
    editor.isActive("youtubeEmbed") ||
    editor.isActive("steamStoreEmbed") ||
    editor.isActive("steamWorkshopEmbed") ||
    editor.isActive("quote")
  ) {
    return null;
  }

  const handleAddLink = async () => {
    trackEvent("editor-toolbar-used", "Toolbar action: link");

    await addLink(editor, prompt);
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="baseBubbleMenu">
      <div className="bubble-menu" onMouseDown={event => event.preventDefault()} data-testid="bubble-menu-inline">
        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={handleAddLink}
            className={`bubble-menu-button ${editor.isActive("link") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-link"
          >
            <Link size={16} />
          </button>
          <span className="action-tooltip">Link</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={() => {
              trackEvent("editor-toolbar-used", "Toolbar action: bold");
              toggleBold(editor);
            }}
            className={`bubble-menu-button ${editor.isActive("bold") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-bold"
          >
            <Bold size={16} />
          </button>
          <span className="action-tooltip">Bold</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={() => {
              trackEvent("editor-toolbar-used", "Toolbar action: italic");
              toggleItalic(editor);
            }}
            className={`bubble-menu-button ${editor.isActive("italic") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-italic"
          >
            <Italic size={16} />
          </button>
          <span className="action-tooltip">Italic</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={() => {
              trackEvent("editor-toolbar-used", "Toolbar action: underline");
              toggleUnderline(editor);
            }}
            className={`bubble-menu-button ${editor.isActive("underline") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-underline"
          >
            <Underline size={16} />
          </button>
          <span className="action-tooltip">Underline</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={() => {
              trackEvent("editor-toolbar-used", "Toolbar action: strikethrough");
              toggleStrike(editor);
            }}
            className={`bubble-menu-button ${editor.isActive("strike") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <span className="action-tooltip">Strikethrough</span>
        </div>

        <div className="tooltip-wrapper">
          <button
            type="button"
            onClick={() => {
              trackEvent("editor-toolbar-used", "Toolbar action: spoiler");
              toggleSpoiler(editor);
            }}
            className={`bubble-menu-button ${editor.isActive("spoiler") ? "is-active" : ""}`}
            data-testid="bubble-menu-inline-spoiler"
          >
            <EyeOff size={16} />
          </button>
          <span className="action-tooltip">Spoiler</span>
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
            "data-testid": "editor-rich-text-input",
          },
        }}
      >
        <BubbleMenuContent />
        <LinkBubbleMenu />
        <ImageBubbleMenu />
        <EmbedBubbleMenu />
        <QuoteBubbleMenu />
        <TableMenu />
      </EditorProvider>
    </PromptProvider>
  );
};

export default BaseEditor;
