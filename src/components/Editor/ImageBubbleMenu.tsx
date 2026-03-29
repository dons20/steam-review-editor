import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Edit2, Trash2 } from "lucide-react";
import { usePrompt } from "./PromptContext";

const ImageBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const { prompt } = usePrompt();

  if (!editor) return null;

  const handleEdit = async () => {
    const src = editor.getAttributes("image").src || "";
    const url = await prompt({
      title: "Edit Image URL:",
      defaultValue: src,
    });

    // User clicked cancel
    if (url === null) return;

    // User cleared the URL -> remove image
    if (url === "") {
      editor.chain().focus().deleteSelection().run();
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleRemove = () => {
    editor.chain().focus().deleteSelection().run();
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="imageBubbleMenu" shouldShow={({ editor: e }) => e.isActive("image")}>
      <div className="link-bubble-menu">
        <span className="link-bubble-menu__url" style={{ color: "#aaa", cursor: "default", textDecoration: "none" }}>
          Image Options
        </span>
        <div className="link-bubble-menu__divider" />
        <div className="link-bubble-menu__actions">
          <button type="button" onClick={handleEdit} title="Edit Image URL">
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={handleRemove} title="Remove Image">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default ImageBubbleMenu;
