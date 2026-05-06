import React from "react";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { useEditorReady } from "./useEditorReady";
import { usePrompt } from "./PromptContext";

type EmbedType = "youtubeEmbed" | "steamStoreEmbed" | "steamWorkshopEmbed";

interface EmbedInfo {
  type: EmbedType;
  url: string;
  attrKey: string;
}

function createEmbedInfo(type: EmbedType, value: string): EmbedInfo {
  switch (type) {
    case "youtubeEmbed":
      return { type, url: `https://www.youtube.com/watch?v=${value}`, attrKey: "videoid" };
    case "steamStoreEmbed":
      return { type, url: `https://store.steampowered.com/app/${value}/`, attrKey: "appid" };
    case "steamWorkshopEmbed":
      return {
        type,
        url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${value}`,
        attrKey: "workshopid",
      };
  }
}

function getActiveEmbedInfo(editor: any): EmbedInfo | null {
  const selectedNode = "node" in editor.state.selection ? editor.state.selection.node : null;

  if (selectedNode) {
    if (selectedNode.type.name === "youtubeEmbed") {
      return createEmbedInfo("youtubeEmbed", String(selectedNode.attrs.videoid ?? ""));
    }

    if (selectedNode.type.name === "steamStoreEmbed") {
      return createEmbedInfo("steamStoreEmbed", String(selectedNode.attrs.appid ?? ""));
    }

    if (selectedNode.type.name === "steamWorkshopEmbed") {
      return createEmbedInfo("steamWorkshopEmbed", String(selectedNode.attrs.workshopid ?? ""));
    }
  }

  if (editor.isActive("youtubeEmbed")) {
    return createEmbedInfo("youtubeEmbed", String(editor.getAttributes("youtubeEmbed").videoid || ""));
  }

  if (editor.isActive("steamStoreEmbed")) {
    return createEmbedInfo("steamStoreEmbed", String(editor.getAttributes("steamStoreEmbed").appid || ""));
  }

  if (editor.isActive("steamWorkshopEmbed")) {
    return createEmbedInfo("steamWorkshopEmbed", String(editor.getAttributes("steamWorkshopEmbed").workshopid || ""));
  }

  return null;
}

function getPromptTitle(type: EmbedType): string {
  switch (type) {
    case "youtubeEmbed":
      return "Enter YouTube URL:";
    case "steamStoreEmbed":
      return "Enter Steam store URL:";
    case "steamWorkshopEmbed":
      return "Enter Steam Workshop URL:";
  }
}

function parseInput(type: EmbedType, input: string): string | null {
  const str = String(input);
  switch (type) {
    case "youtubeEmbed": {
      const match = str.match(/[?&]v=([-\w]+)/i) || str.match(/youtu\.be\/([-\w]+)/i);
      return match ? match[1] : null;
    }
    case "steamStoreEmbed": {
      const match = str.match(/app\/(\d+)/i);
      return match ? match[1] : null;
    }
    case "steamWorkshopEmbed": {
      const match = str.match(/[?&]id=(\d+)/i);
      return match ? match[1] : null;
    }
  }
}

const EmbedBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const { prompt } = usePrompt();
  const ready = useEditorReady();
  const info = useEditorState({
    editor,
    selector: snapshot => {
      const currentEditor = snapshot.editor;
      return currentEditor ? getActiveEmbedInfo(currentEditor) : null;
    },
  });

  if (!ready || !editor) return null;

  const handleEdit = async () => {
    const current = getActiveEmbedInfo(editor);
    if (!current) return;
    const input = await prompt({ title: getPromptTitle(current.type), defaultValue: current.url });
    if (input === null || input === "") return;
    const parsed = parseInput(current.type, input);
    if (!parsed) return;
    editor
      .chain()
      .focus()
      .updateAttributes(current.type, { [current.attrKey]: parsed })
      .run();
  };

  const handleRemove = () => {
    editor.chain().focus().deleteSelection().run();
  };

  const handleOpen = () => {
    const current = getActiveEmbedInfo(editor);
    if (current) window.open(current.url, "_blank", "noopener,noreferrer");
  };

  return (
    <BubbleMenu
      editor={undefined}
      pluginKey="embedBubbleMenu"
      shouldShow={({ editor: e }) => getActiveEmbedInfo(e) !== null}
      updateDelay={0}
    >
      <div className="link-bubble-menu" onMouseDown={e => e.preventDefault()} data-testid="bubble-menu-embed">
        <span className="link-bubble-menu__title" data-testid="bubble-menu-embed-title">
          Embed Options
        </span>
        <div className="link-bubble-menu__divider" />
        {info && (
          <a
            href={info.url}
            className="link-bubble-menu__url"
            data-testid="bubble-menu-embed-url"
            onClick={e => {
              e.preventDefault();
              handleOpen();
            }}
            title={info.url}
          >
            {info.url.length > 35 ? `${info.url.substring(0, 35)}...` : info.url}
          </a>
        )}
        {info && <div className="link-bubble-menu__divider" />}
        <div className="link-bubble-menu__actions">
          <button type="button" onClick={handleOpen} title="Open link in new tab" data-testid="bubble-menu-embed-open">
            <ExternalLink size={14} />
          </button>
          <button type="button" onClick={handleEdit} title="Edit link" data-testid="bubble-menu-embed-edit">
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={handleRemove} title="Remove embed" data-testid="bubble-menu-embed-remove">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default EmbedBubbleMenu;
