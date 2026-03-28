import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { AppContext, type AppContextType } from "components/Content";
import { htmlToSteamBBCode, cleanBBCode } from "util/htmlToSteamBBCode";
import { steamBBCodeToHtml } from "util/steamBBCodeToHtml";
import { ArrowLeftRight, CircleHelp } from "lucide-react";
import TiptapEditor from "./BaseEditor";
import HelpModal from "components/HelpModal";
import { useModalTheme } from "util/ThemeContext";

export type EditorMode = "rich-text" | "markup";

/** Defines the core editor component */
function ReviewEditor() {
  // Lazy initializer — reads localStorage *before* first render so TipTap
  // gets the saved content on mount (useEffect fires too late).
  const [initialContent, setInitialContent] = useState<string>(() => {
    const saved = localStorage.getItem("content");
    if (!saved) return "";
    try {
      return JSON.parse(saved); // handle legacy JSON-wrapped format
    } catch {
      return saved;
    }
  });
  const [editorMode, setEditorMode] = useState<EditorMode>("rich-text");
  const [markupText, setMarkupText] = useState<string>(() => {
    // Also restore markup mode content if it was saved
    return localStorage.getItem("content-markup") ?? "";
  });
  const { setHTMLContent, notify } = useContext<AppContextType>(AppContext);

  // Store ref to latest HTML from TipTap for mode switching
  const latestHtmlRef = React.useRef<string>("");

  // Debounce timer ref — avoids stale closures from useState
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Fires debounced auto-save and shows a toast when the timer expires */
  const scheduleAutoSave = useCallback((key: string, value: string) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(key, value);
      toast.success("Review content auto-saved", {
        autoClose: 1800,
        position: "bottom-right",
        toastId: "autosave-notification",
        hideProgressBar: true,
      });
    }, 2000);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  /** Handles editor updates from TipTap */
  const handleUpdate = useCallback(
    (html: string) => {
      latestHtmlRef.current = html;
      setHTMLContent(html);
      scheduleAutoSave("content", html);
    },
    [setHTMLContent, scheduleAutoSave]
  );

  /** Toggle between modes */
  const toggleMode = useCallback(() => {
    if (editorMode === "rich-text") {
      const bbcode = cleanBBCode(htmlToSteamBBCode(latestHtmlRef.current));
      setMarkupText(bbcode);
      setEditorMode("markup");
    } else {
      const html = steamBBCodeToHtml(markupText);
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
      // Auto-save the raw BBCode markup
      scheduleAutoSave("content-markup", value);
    },
    [setHTMLContent, scheduleAutoSave]
  );

  const isMarkup = editorMode === "markup";
  const [showHelp, setShowHelp] = useState(false);
  const { modalTheme } = useModalTheme();

  return (
    <div className="editor__root" data-theme={modalTheme}>
      {/* Consistent mode switch bar — always in the same spot */}
      <div className="editor-mode-bar">
        <span className="editor-mode-label">{isMarkup ? "Markup Mode" : "Rich Text Mode"}</span>
        <div className="editor-mode-bar__actions">
          <div className="tooltip-wrapper">
            <button
              type="button"
              className="mode-switch-btn"
              onClick={toggleMode}
              aria-label={isMarkup ? "Switch to Rich Text" : "Switch to Markup"}
            >
              <ArrowLeftRight size={14} />
              <span>{isMarkup ? "Switch to Rich Text" : "Switch to Markup"}</span>
            </button>
            <span className="action-tooltip">{isMarkup ? "Switch to Rich Text" : "Switch to Markup"}</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              type="button"
              className="help-btn"
              onClick={() => setShowHelp(true)}
              aria-label="Open guide"
            >
              <CircleHelp size={15} />
            </button>
            <span className="action-tooltip">Guide</span>
          </div>
        </div>
      </div>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

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
