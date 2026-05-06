import React from "react";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import Tooltip from "components/Tooltip";
import { usePrompt } from "../PromptContext";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconLink,
  IconPhoto,
  IconTable,
  IconCode,
  IconQuote,
  IconEyeOff,
  IconCircleOff,
  IconMinus,
  IconTrash,
  IconClearFormatting,
  IconStore,
  IconWorkshop,
  IconYoutube,
} from "components/Icons";
import "./toolbar.scss";
import { useEditorReady } from "../useEditorReady";
import { toolbarStateSelector } from "./ToolbarStateSelector";
import { useToolbarActions } from "./useToolbarActions";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  testId?: string;
  children: React.ReactNode;
}

interface ToolbarActionItem {
  key: string;
  onClick: () => void;
  icon: React.ComponentType;
  tooltip?: string;
  testId?: string;
  active?: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, active, disabled, tooltip, testId, children }) => {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`toolbar-button ${active ? "is-active" : ""}`}
      data-testid={testId}
    >
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position="top">
        {button}
      </Tooltip>
    );
  }

  return button;
};

const ToolbarDivider = () => <div className="toolbar-divider" />;

export const Toolbar: React.FC = () => {
  const ready = useEditorReady();
  const { editor } = useCurrentEditor();
  const { prompt, confirm } = usePrompt();
  const editorState = useEditorState({
    editor,
    selector: toolbarStateSelector,
  });

  const {
    handleAddLink,
    handleAddImage,
    handleAddQuote,
    handleInsertTable,
    handleClearContent,
    handleToggleBold,
    handleToggleItalic,
    handleToggleUnderline,
    handleToggleStrike,
    handleToggleH1,
    handleToggleH2,
    handleToggleH3,
    handleToggleBulletList,
    handleToggleOrderedList,
    handleToggleCodeBlock,
    handleToggleSpoiler,
    handleToggleNoParse,
    handleSetHorizontalRule,
    handleClearFormatting,
    handleInsertSteamStore,
    handleInsertSteamWorkshop,
    handleInsertYouTube,
  } = useToolbarActions({ editor, prompt, confirm });

  React.useEffect(() => {
    if (!editor || !ready) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        handleAddLink();
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, ready, handleAddLink]);

  const toolbarGroups: ToolbarActionItem[][] = [
    [
      {
        key: "bold",
        onClick: handleToggleBold,
        active: editorState.isBold,
        tooltip: "Bold (Ctrl+B)",
        testId: "toolbar-bold",
        icon: IconBold,
      },
      {
        key: "italic",
        onClick: handleToggleItalic,
        active: editorState.isItalic,
        tooltip: "Italic (Ctrl+I)",
        testId: "toolbar-italic",
        icon: IconItalic,
      },
      {
        key: "underline",
        onClick: handleToggleUnderline,
        active: editorState.isUnderline,
        tooltip: "Underline (Ctrl+U)",
        testId: "toolbar-underline",
        icon: IconUnderline,
      },
      {
        key: "strikethrough",
        onClick: handleToggleStrike,
        active: editorState.isStrike,
        tooltip: "Strikethrough (Ctrl+Shift+X)",
        testId: "toolbar-strikethrough",
        icon: IconStrikethrough,
      },
    ],
    [
      {
        key: "heading-1",
        onClick: handleToggleH1,
        active: editorState.isHeading1,
        tooltip: "Heading 1",
        testId: "toolbar-heading-1",
        icon: IconH1,
      },
      {
        key: "heading-2",
        onClick: handleToggleH2,
        active: editorState.isHeading2,
        tooltip: "Heading 2",
        testId: "toolbar-heading-2",
        icon: IconH2,
      },
      {
        key: "heading-3",
        onClick: handleToggleH3,
        active: editorState.isHeading3,
        tooltip: "Heading 3",
        testId: "toolbar-heading-3",
        icon: IconH3,
      },
    ],
    [
      {
        key: "bullet-list",
        onClick: handleToggleBulletList,
        active: editorState.isBulletList,
        tooltip: "Bullet List",
        testId: "toolbar-bullet-list",
        icon: IconList,
      },
      {
        key: "ordered-list",
        onClick: handleToggleOrderedList,
        active: editorState.isOrderedList,
        tooltip: "Ordered List",
        testId: "toolbar-ordered-list",
        icon: IconListNumbers,
      },
    ],
    [
      {
        key: "link",
        onClick: handleAddLink,
        active: editorState.isLink,
        tooltip: "Insert Link (Ctrl+K)",
        testId: "toolbar-link",
        icon: IconLink,
      },
      {
        key: "image",
        onClick: handleAddImage,
        tooltip: "Insert Image",
        testId: "toolbar-image",
        icon: IconPhoto,
      },
      {
        key: "table",
        onClick: handleInsertTable,
        tooltip: "Insert Table",
        testId: "toolbar-table",
        icon: IconTable,
      },
    ],
    [
      {
        key: "code-block",
        onClick: handleToggleCodeBlock,
        active: editorState.isCodeBlock,
        tooltip: "Code Block",
        testId: "toolbar-code-block",
        icon: IconCode,
      },
      {
        key: "quote",
        onClick: handleAddQuote,
        active: editorState.isQuote,
        tooltip: "Quote",
        testId: "toolbar-quote",
        icon: IconQuote,
      },
      {
        key: "spoiler",
        onClick: handleToggleSpoiler,
        active: editorState.isSpoiler,
        tooltip: "Spoiler",
        testId: "toolbar-spoiler",
        icon: IconEyeOff,
      },
      {
        key: "no-parse",
        onClick: handleToggleNoParse,
        active: editorState.isNoParse,
        tooltip: "No Parse",
        testId: "toolbar-no-parse",
        icon: IconCircleOff,
      },
    ],
    [
      {
        key: "horizontal-rule",
        onClick: handleSetHorizontalRule,
        tooltip: "Horizontal Rule",
        testId: "toolbar-horizontal-rule",
        icon: IconMinus,
      },
    ],
    [
      {
        key: "steam-store",
        onClick: handleInsertSteamStore,
        tooltip: "Insert Steam Store Link",
        testId: "toolbar-steam-store",
        icon: IconStore,
      },
      {
        key: "steam-workshop",
        onClick: handleInsertSteamWorkshop,
        tooltip: "Insert Steam Workshop Link",
        testId: "toolbar-steam-workshop",
        icon: IconWorkshop,
      },
      {
        key: "youtube",
        onClick: handleInsertYouTube,
        tooltip: "Insert YouTube Link",
        testId: "toolbar-youtube",
        icon: IconYoutube,
      },
    ],
    [
      {
        key: "clear-formatting",
        onClick: handleClearFormatting,
        tooltip: "Clear Formatting",
        testId: "toolbar-clear-formatting",
        icon: IconClearFormatting,
      },
      {
        key: "clear-all",
        onClick: handleClearContent,
        tooltip: "Clear All Content",
        testId: "toolbar-clear-all",
        icon: IconTrash,
      },
    ],
  ];

  if (!editor || !ready) {
    return null;
  }

  return (
    <div className="toolbar">
      {toolbarGroups.map((group, index) => (
        <React.Fragment key={group.map(item => item.key).join("-")}>
          {index > 0 ? <ToolbarDivider /> : null}
          <div className="toolbar-group">
            {group.map(({ key, icon: Icon, ...item }) => (
              <ToolbarButton
                key={key}
                onClick={item.onClick}
                active={item.active}
                disabled={item.disabled}
                tooltip={item.tooltip}
                testId={item.testId}
              >
                <Icon />
              </ToolbarButton>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
