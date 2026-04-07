import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Edit2, Trash2 } from "lucide-react";
import { useEditorReady } from "./useEditorReady";
import { usePrompt } from "./PromptContext";

const QuoteBubbleMenu = () => {
  const { editor } = useCurrentEditor();
  const { prompt } = usePrompt();
  const ready = useEditorReady();

  if (!ready || !editor) return null;

  const handleEditAuthor = async () => {
    const currentAuthor = editor.getAttributes("quote").author || "";
    const author = await prompt({
      title: "Enter author name (optional):",
      defaultValue: currentAuthor,
    });
    if (author === null) return;
    editor.chain().focus().updateQuoteAuthor(author || "").run();
  };

  const handleRemove = () => {
    editor.chain().focus().unsetQuote().run();
  };

  return (
    <BubbleMenu editor={undefined} pluginKey="quoteBubbleMenu" shouldShow={({ editor: e }) => e.isActive("quote")}>
      <div className="link-bubble-menu" onMouseDown={(e) => e.preventDefault()}>
        <span className="link-bubble-menu__url" style={{ color: "#aaa", cursor: "default", textDecoration: "none" }}>
          Quote Options
        </span>
        <div className="link-bubble-menu__divider" />
        <div className="link-bubble-menu__actions">
          <button type="button" onClick={handleEditAuthor} title="Edit Author">
            <Edit2 size={14} />
          </button>
          <button type="button" onClick={handleRemove} title="Remove Quote">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default QuoteBubbleMenu;
