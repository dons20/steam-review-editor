import React, { useEffect, useState, useContext, useCallback } from "react";
import { AppContext, type AppContextType } from "components/Content";
import TiptapEditor from "./BaseEditor";

/** Defines the core editor component */
function ReviewEditor() {
  const [initialContent, setInitialContent] = useState<string>("");
  const { setHTMLContent, notify } = useContext<AppContextType>(AppContext);

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

  /** Handles editor updates */
  const handleUpdate = useCallback(
    (html: string) => {
      setHTMLContent(html);
    },
    [setHTMLContent]
  );

  return (
    <div className="editor__root">
      <TiptapEditor content={initialContent} onUpdate={handleUpdate} />
    </div>
  );
}

export default ReviewEditor;
