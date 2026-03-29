import React, { useState, useEffect, useRef } from "react";
import { htmlToSteamBBCode, cleanBBCode } from "util/htmlToSteamBBCode";
import ReviewEditor from "components/Editor";
import Preview from "components/Preview";
import "./content.scss";

export type AppContextType = null | {
  setHTMLContent: React.Dispatch<React.SetStateAction<string>>;
  notify: Function;
  markup: string | null;
  previewContent: string | null;
};

const AppContext = React.createContext<AppContextType>(null);

function Content({ notify }) {
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHTMLContent] = useState<string>("");
  const [markup, setMarkup] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const markupAreaRef = useRef<HTMLDivElement | null>(null);

  /** Copies the markup to clipboard */
  const copyToClipboard = () => {
    if (!markupAreaRef.current) return;
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(markupAreaRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    notify("Markup copied to clipboard!");
  };


  /** Parses the editor content before preview is rendered */
  useEffect(() => {
    if (htmlContent) {
      // Convert HTML to Steam BBCode
      const bbcode = htmlToSteamBBCode(htmlContent);
      const cleanedBBCode = cleanBBCode(bbcode);
      setMarkup(cleanedBBCode);

      // Set preview content (HTML for Store Preview)
      setPreviewContent(htmlContent);
    }
  }, [htmlContent]);

  return (
    <AppContext.Provider value={{ setHTMLContent, markup, previewContent, notify }}>
      <main className={"content-root"}>
        <ReviewEditor />
        <div className="buttons">
          <button className="previewBtn ripple" onClick={() => setShowPreview(!showPreview)}>
            {`${showPreview ? "Hide" : "Show"} Preview`}
          </button>
          <button className="markupBtn ripple" onClick={copyToClipboard}>
            Copy Markup to Clipboard
          </button>
        </div>
        <React.Suspense fallback={<></>}>
          <Preview markupRef={markupAreaRef} visible={showPreview} />
        </React.Suspense>
      </main>
    </AppContext.Provider>
  );
}

export default Content;
export { AppContext };
