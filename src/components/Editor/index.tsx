import React, { useEffect, useState, useContext, useCallback } from "react";
import { AppContext, type AppContextType } from "components/Content";
import { htmlToSteamBBCode, cleanBBCode } from "util/htmlToSteamBBCode";
import { steamBBCodeToHtml } from "util/steamBBCodeToHtml";
import { ArrowLeftRight } from "lucide-react";
import TiptapEditor from "./BaseEditor";

export type EditorMode = "rich-text" | "markup";

/** Defines the core editor component */
function ReviewEditor() {
  const [initialContent, setInitialContent] = useState<string>("");
  const [editorMode, setEditorMode] = useState<EditorMode>("rich-text");
  const [markupText, setMarkupText] = useState<string>("");
  const [tiptapContent, setTiptapContent] = useState<string>("");
  const { setHTMLContent, notify } = useContext<AppContextType>(AppContext);

  // Store ref to latest HTML from TipTap for mode switching
  const latestHtmlRef = React.useRef<string>("");

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem("content");
    if (savedContent) {
      try {
        // Try to parse as JSON (old format)
        const parsed = JSON.parse(savedContent);
        setInitialContent(parsed);
      } catch {
        // If not JSON, use as HTML string
        setInitialContent(savedContent);
      }
    }
  }, []);

  /** Handles editor updates from TipTap */
  const handleUpdate = useCallback(
    (html: string) => {
      latestHtmlRef.current = html;
      setTiptapContent(html);
      setHTMLContent(html);
    },
    [setHTMLContent]
  );

  /** Toggle between modes */
  const toggleMode = useCallback(() => {
    if (editorMode === "rich-text") {
      const bbcode = cleanBBCode(htmlToSteamBBCode(latestHtmlRef.current));
      setMarkupText(bbcode);
      setEditorMode("markup");
    } else {
      const html = steamBBCodeToHtml(markupText);
      setTiptapContent(html);
      setInitialContent(html);
      setHTMLContent(html);
      latestHtmlRef.current = html;
      setEditorMode("rich-text");
    }
  }, [editorMode, markupText, setHTMLContent]);

  /** Handle changes in the markup textarea */
  const handleMarkupChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setMarkupText(value);
      // Also update the HTML content for Preview panel in real-time
      const html = steamBBCodeToHtml(value);
      setHTMLContent(html);
    },
    [setHTMLContent]
  );

  const isMarkup = editorMode === "markup";

  return (
    <div className="editor__root">
      {/* Consistent mode switch bar — always in the same spot */}
      <div className="editor-mode-bar">
        <span className="editor-mode-label">{isMarkup ? "Markup Mode" : "Rich Text Mode"}</span>
        <button
          type="button"
          className="mode-switch-btn"
          onClick={toggleMode}
          title={isMarkup ? "Switch to Rich Text" : "Switch to Markup"}
        >
          <ArrowLeftRight size={14} />
          <span>{isMarkup ? "Switch to Rich Text" : "Switch to Markup"}</span>
        </button>
      </div>

      {/* Rich Text Editor */}
      {!isMarkup && <TiptapEditor content={initialContent} onUpdate={handleUpdate} />}

      {/* Markup Editor */}
      {isMarkup && (
        <div className="markup-editor-wrapper">
          <textarea
            className="markup-editor-textarea"
            value={markupText}
            onChange={handleMarkupChange}
            spellCheck={false}
            placeholder="Enter Steam BBCode markup here..."
          />
        </div>
      )}
    </div>
  );
}

export default ReviewEditor;
