import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react/menus";
import { IconTablePlus, IconTableMinus, IconTableDown, IconTableUp, IconTrash } from "components/Icons";
import Tooltip from "components/Tooltip";
import "./toolbar.scss";

interface TableMenuButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

const TableMenuButton: React.FC<TableMenuButtonProps> = ({ onClick, disabled, tooltip, children }) => {
  const button = (
    <button type="button" onClick={onClick} disabled={disabled} className="table-menu-button">
      {children}
    </button>
  );

  // Wrap with tooltip if tooltip text is provided
  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="top">
        {button}
      </Tooltip>
    );
  }

  return button;
};

export const TableMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const shouldShow: BubbleMenuProps["shouldShow"] = ({ editor, state }) => {
    // Check if we're inside a table cell or header
    const isInTable = editor.isActive("tableCell") || editor.isActive("tableHeader");

    // Don't show if there's a text selection (let the text bubble menu handle that)
    const hasTextSelection = !state.selection.empty;

    // Show the table menu when in a table but without text selection
    return isInTable && !hasTextSelection;
  };

  return (
    <BubbleMenu editor={editor} pluginKey="tableMenu" shouldShow={shouldShow} updateDelay={0}>
      <div className="table-menu">
        <TableMenuButton onClick={() => editor.chain().focus().addRowBefore().run()} tooltip="Add Row Above">
          <IconTableUp />
        </TableMenuButton>
        <TableMenuButton onClick={() => editor.chain().focus().addRowAfter().run()} tooltip="Add Row Below">
          <IconTableDown />
        </TableMenuButton>
        <TableMenuButton onClick={() => editor.chain().focus().deleteRow().run()} tooltip="Delete Row">
          <IconTableMinus />
        </TableMenuButton>
        <TableMenuButton onClick={() => editor.chain().focus().addColumnAfter().run()} tooltip="Add Column">
          <IconTablePlus />
        </TableMenuButton>
        <TableMenuButton onClick={() => editor.chain().focus().deleteColumn().run()} tooltip="Delete Column">
          <IconTableMinus />
        </TableMenuButton>
        <TableMenuButton onClick={() => editor.chain().focus().deleteTable().run()} tooltip="Delete Table">
          <IconTrash />
        </TableMenuButton>
      </div>
    </BubbleMenu>
  );
};
