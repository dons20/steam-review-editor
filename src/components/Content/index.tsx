import React, { useState, useEffect, useRef } from "react";
import { IconHelpCircle, IconCircleX } from "components/Icons";
import Tooltip from "components/Tooltip";
import { htmlToSteamBBCode, cleanBBCode } from "util/htmlToSteamBBCode";
import cx from "classnames";
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
  const [showTip, setShowTip] = useState<boolean>(JSON.parse(localStorage.getItem("showTip")));
  const [hideHelp, setHideHelp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHTMLContent] = useState<string>("");
  const [markup, setMarkup] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(document.body.getBoundingClientRect().width);
  const markupAreaRef = useRef<HTMLDivElement | null>(null);
  const helpAreaRef = useRef<HTMLDivElement | null>(null);

  const showInstructions = () => {
    setShowTip(true);
    setHideHelp(false);
    setTimeout(() => helpAreaRef.current.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  /** Fully hides the info bar */
  const hideInstructions = () => {
    setShowTip(false);
  };

  /** Helper function to fade out the info bar */
  const startHide = () => {
    setHideHelp(true);
  };

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

  useEffect(() => {
    function checkWidth() {
      setWidth(document.body.getBoundingClientRect().width);
    }

    window.addEventListener("resize", checkWidth);
    window.addEventListener("orientationchange", checkWidth);

    return function cleanup() {
      window.removeEventListener("resize", checkWidth);
      window.removeEventListener("orientationchange", checkWidth);
    };
  }, []);

  /**
   * Handles the visibility settings of the help tips
   */
  useEffect(() => {
    if (showTip === null) {
      setShowTip(true);
    }

    /** Saves the visibility of the info bar to local storage */
    const saveState = () => {
      localStorage.setItem("showTip", JSON.stringify(showTip));
    };

    window.addEventListener("beforeunload", saveState);
    return function cleanup() {
      window.removeEventListener("beforeunload", saveState);
    };
  }, [showTip]);

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
        <div
          className={cx("instructions", {
            hiding: hideHelp,
            hidden: !showTip,
            wide: width >= 1200,
          })}
          onAnimationEnd={hideInstructions}
          ref={helpAreaRef}
        >
          <p>
            Steam Review Editor allows you to easily create and modify your reviews in real-time without having to
            manually apply steam markup tags. Simply type your review, click "Copy Markup to Clipboard", and paste it in
            Steam!
          </p>
          {width >= 1200 ? (
            <Tooltip content="Close" position="top">
              <IconCircleX width={48} height={48} onClick={startHide} cursor="pointer" />
            </Tooltip>
          ) : (
            <div className="close" onClick={startHide}>
              Close
            </div>
          )}
        </div>
        {showTip === false && (
          <div className="showHelp" onClick={showInstructions}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <IconHelpCircle width={36} height={36} />
              &nbsp; Show Help
            </span>
          </div>
        )}
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
