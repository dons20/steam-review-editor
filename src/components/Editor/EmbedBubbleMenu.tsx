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

function getActiveEmbedInfo(editor: any): EmbedInfo | null {
  if (editor.isActive("youtubeEmbed")) {
    const videoid = editor.getAttributes("youtubeEmbed").videoid || "";
    return { type: "youtubeEmbed", url: `https://www.youtube.com/watch?v=${videoid}`, attrKey: "videoid" };
  }

  if (editor.isActive("steamStoreEmbed")) {
    const appid = editor.getAttributes("steamStoreEmbed").appid || "";
    return { type: "steamStoreEmbed", url: `https://store.steampowered.com/app/${appid}/`, attrKey: "appid" };
  }

  if (editor.isActive("steamWorkshopEmbed")) {
    const workshopid = editor.getAttributes("steamWorkshopEmbed").workshopid || "";
    return {
      type: "steamWorkshopEmbed",
      url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopid}`,
      attrKey: "workshopid",
    };
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

  if (!ready || !editor) return null;

  const info = getActiveEmbedInfo(editor);

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
      <div className="link-bubble-menu" onMouseDown={e => e.preventDefault()}>
        <span className="link-bubble-menu__title">Embed Options</span>
        <div className="link-bubble-menu__divider" />
        {info && (
          <a
            href={info.url}
            className="link-bubble-menu__url"
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
