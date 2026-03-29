import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { htmlToSteamBBCode, cleanBBCode } from "util/htmlToSteamBBCode";
import { AppContext, type AppContextType } from "components/Content";
import { ArrowLeftRight, CircleHelp, Check } from "lucide-react";
import { steamBBCodeToHtml } from "util/steamBBCodeToHtml";
import { useModalTheme } from "util/ThemeContext";
import HelpModal from "components/HelpModal";
import TiptapEditor from "./BaseEditor";

export type EditorMode = "rich-text" | "markup";

/** Defines the core editor component */
function ReviewEditor() {
  // Lazy initializer — reads localStorage *before* first render so TipTap
  // gets the saved content on mount (useEffect fires too late).
  const [initialContent, setInitialContent] = useState<string>(() => {
    const saved = localStorage.getItem("content");
    if (!saved) return "";
    try {
      return JSON.parse(saved);
    } catch {
      return saved;
    }
  });
  const [editorMode, setEditorMode] = useState<EditorMode>("rich-text");
  const [markupText, setMarkupText] = useState<string>(() => {
    return localStorage.getItem("content-markup") ?? "";
  });
  const { setHTMLContent } = useContext<AppContextType>(AppContext);

  const latestHtmlRef = React.useRef<string>("");

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showSaved, setShowSaved] = useState(false);

  /** Fires debounced auto-save and shows a toast when the timer expires */
  const scheduleAutoSave = useCallback((key: string, value: string) => {
    setShowSaved(false);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(key, value);
      setShowSaved(true);

      // Hide the saved indicator after 3 seconds
      hideTimerRef.current = setTimeout(() => setShowSaved(false), 3000);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleUpdate = useCallback(
    (html: string) => {
      latestHtmlRef.current = html;
      setHTMLContent(html);
      scheduleAutoSave("content", html);
    },
    [setHTMLContent, scheduleAutoSave]
  );

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

  const handleMarkupChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setMarkupText(value);
      const html = steamBBCodeToHtml(value);
      setHTMLContent(html);
      scheduleAutoSave("content-markup", value);
    },
    [setHTMLContent, scheduleAutoSave]
  );

  const isMarkup = editorMode === "markup";
  const [showHelp, setShowHelp] = useState(false);
  const { modalTheme } = useModalTheme();

  return (
    <div className="editor__root" data-theme={modalTheme}>
      <div className="editor-mode-bar">
        <span className="editor-mode-label">{isMarkup ? "Markup Mode" : "Rich Text Mode"}</span>
        <div className="editor-mode-bar__actions">
          {showSaved && (
            <div className="editor-save-indicator">
              <Check size={14} className="save-icon" />
              <span className="save-text">
                <span className="save-text-main">All changes </span>
                saved
              </span>
            </div>
          )}
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
            <button type="button" className="help-btn" onClick={() => setShowHelp(true)} aria-label="Open guide">
              <CircleHelp size={15} />
            </button>
            <span className="action-tooltip">Guide</span>
          </div>
        </div>
      </div>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

      {!isMarkup && <TiptapEditor content={initialContent} onUpdate={handleUpdate} />}

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
