import React, { useEffect, useRef, useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
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

const EMBED_TYPES = new Set<string>(["youtubeEmbed", "steamStoreEmbed", "steamWorkshopEmbed"]);

/** Read the selected node if it's an embed; uses duck-typing instead of instanceof. */
function getSelectedEmbedNode(editor: any): any | null {
  const sel = editor.state.selection;
  // Duck-type NodeSelection: it has a `.node` property
  if (!sel.node) return null;
  return EMBED_TYPES.has(sel.node.type.name) ? sel.node : null;
}

function buildInfo(node: any): EmbedInfo | null {
  switch (node.type.name) {
    case "youtubeEmbed": {
      const videoid = node.attrs.videoid || "";
      return { type: "youtubeEmbed", url: `https://www.youtube.com/watch?v=${videoid}`, attrKey: "videoid" };
    }
    case "steamStoreEmbed": {
      const appid = node.attrs.appid || "";
      return { type: "steamStoreEmbed", url: `https://store.steampowered.com/app/${appid}/`, attrKey: "appid" };
    }
    case "steamWorkshopEmbed": {
      const workshopid = node.attrs.workshopid || "";
      return { type: "steamWorkshopEmbed", url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopid}`, attrKey: "workshopid" };
    }
    default:
      return null;
  }
}

function getPromptTitle(type: EmbedType): string {
  switch (type) {
    case "youtubeEmbed": return "Enter YouTube URL or video ID:";
    case "steamStoreEmbed": return "Enter Steam App ID or store URL:";
    case "steamWorkshopEmbed": return "Enter Workshop item ID or URL:";
  }
}

function parseInput(type: EmbedType, input: string): string | null {
  const str = String(input);
  switch (type) {
    case "youtubeEmbed": {
      const match = str.match(/[?&]v=([-\w]+)/i) || str.match(/youtu\.be\/([-\w]+)/i) || str.match(/^([-\w]{11})$/);
      return match ? match[1] : null;
    }
    case "steamStoreEmbed": {
      const match = str.match(/app\/(\d+)/i) || str.match(/^(\d+)$/);
      return match ? match[1] : null;
    }
    case "steamWorkshopEmbed": {
      const match = str.match(/[?&]id=(\d+)/i) || str.match(/^(\d+)$/);
      return match ? match[1] : null;
    }
  }
}

const EmbedBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const { prompt } = usePrompt();
  const ready = useEditorReady();
  const [info, setInfo] = useState<EmbedInfo | null>(null);
  const infoRef = useRef<EmbedInfo | null>(null);
  const prevPosRef = useRef<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const node = getSelectedEmbedNode(editor);
      if (!node) {
        infoRef.current = null;
        setInfo(null);
        prevPosRef.current = null;
        return;
      }

      const pos = editor.state.selection.from;

      // If the selected node position changed (switching between embeds),
      // briefly hide the menu to prevent a flash at the old position.
      if (prevPosRef.current !== null && prevPosRef.current !== pos) {
        setHidden(true);
        requestAnimationFrame(() => setHidden(false));
      }
      prevPosRef.current = pos;

      const latest = buildInfo(node);
      infoRef.current = latest;
      setInfo(latest);
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!ready || !editor) return null;

  const shouldShow = ({ editor: e }: { editor: any }) => {
    if (hidden) return false;
    const node = getSelectedEmbedNode(e);
    return node !== null;
  };

  const getFreshInfo = () => infoRef.current ?? (() => {
    const node = getSelectedEmbedNode(editor);
    return node ? buildInfo(node) : null;
  })();

  const handleEdit = async () => {
    const current = getFreshInfo();
    if (!current) return;
    const input = await prompt({ title: getPromptTitle(current.type), defaultValue: current.url });
    if (input === null || input === "") return;
    const parsed = parseInput(current.type, input);
    if (!parsed) return;
    editor.chain().focus().updateAttributes(current.type, { [current.attrKey]: parsed }).run();
  };

  const handleRemove = () => {
    editor.chain().focus().deleteSelection().run();
  };

  const handleOpen = () => {
    const current = getFreshInfo();
    if (current) window.open(current.url, "_blank", "noopener,noreferrer");
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="embedBubbleMenu" shouldShow={shouldShow}>
      <div className="link-bubble-menu" onMouseDown={(e) => e.preventDefault()}>
        <a
          href={info?.url ?? "#"}
          className="link-bubble-menu__url"
          onClick={(e) => { e.preventDefault(); handleOpen(); }}
          title={info?.url}
        >
          {info && info.url.length > 35 ? `${info.url.substring(0, 35)}...` : info?.url}
        </a>
        <div className="link-bubble-menu__divider" />
        <div className="link-bubble-menu__actions">
          <button type="button" onClick={handleOpen} title="Open link in new tab">
            <ExternalLink size={14} />
          </button>
          <button type="button" onClick={handleEdit} title="Edit link">
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={handleRemove} title="Remove embed">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default EmbedBubbleMenu;
