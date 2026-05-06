import React, { useEffect } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { useEditorReady } from "./useEditorReady";
import { usePrompt } from "./PromptContext";

const LinkBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const { prompt } = usePrompt();
  const ready = useEditorReady();

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate();
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  if (!ready || !editor) return null;

  const isActive = editor.isActive("link");
  if (!isActive) return null;

  const rawHref = editor.getAttributes("link").href || "";
  let href = rawHref;
  if (href && !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href)) {
    href = `https://${href}`;
  }

  const handleEdit = async () => {
    const url = await prompt({
      title: "Edit Link URL:",
      defaultValue: rawHref,
    });

    // User clicked cancel
    if (url === null) return;

    // User cleared the URL -> remove link
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleRemove = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleOpen = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="linkBubbleMenu">
      <div className="link-bubble-menu" data-testid="bubble-menu-link">
        <a
          href={href}
          className="link-bubble-menu__url"
          data-testid="bubble-menu-link-url"
          onClick={e => {
            e.preventDefault();
            handleOpen();
          }}
          title={href}
        >
          {href.length > 35 ? `${href.substring(0, 35)}...` : href}
        </a>
        <div className="link-bubble-menu__divider" />
        <div className="link-bubble-menu__actions">
          <button type="button" onClick={handleOpen} title="Open link in new tab" data-testid="bubble-menu-link-open">
            <ExternalLink size={14} />
          </button>
          <button type="button" onClick={handleEdit} title="Edit link" data-testid="bubble-menu-link-edit">
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={handleRemove} title="Remove link" data-testid="bubble-menu-link-remove">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default LinkBubbleMenu;
