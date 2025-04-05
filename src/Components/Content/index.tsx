/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import steamParser from "Util/steamParser";
// import parseHTML from "Util/htmlParser";
import cx from "classnames";
import ReviewEditor from "Components/Editor";
import Preview from "Components/Preview";
import "./content.scss";

import type { OutputData } from "@editorjs/editorjs";

export type AppContextType = null | {
  setHTMLContent: React.Dispatch<React.SetStateAction<OutputData>>;
  notify: Function;
  markup: string | null;
  previewContent: Record<string, unknown> | null;
};

const AppContext = React.createContext<AppContextType>(null);
const markupParser = steamParser();

function Content({ notify }) {
  const [showTip, setShowTip] = useState<boolean>(JSON.parse(localStorage.getItem("showTip")));
  const [hideHelp, setHideHelp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHTMLContent] = useState<OutputData>(null);
  const [markup, setMarkup] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<Record<string, unknown> | null>(null);
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
    async function handleSerialization() {
      console.log(htmlContent, markupParser.parse(htmlContent));
      setMarkup(markupParser.parse(htmlContent));
      // setPreviewContent(await serializeHTML(htmlContent));
    }

    if (htmlContent) handleSerialization();
    console.log("htmlContent Updated");
  }, [htmlContent, markupParser]);

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
          <div className={`${width >= 1200 ? "tooltip " : ""} close`} onClick={startHide} data-title="Close">
            {width >= 1200 ? <FontAwesomeIcon icon={["far", "times-circle"]} size={"2x"} className="close" /> : "Close"}
          </div>
        </div>
        {showTip === false && (
          <div className={`tooltip showHelp`} data-title="Help" onClick={showInstructions}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={["far", "question-circle"]} size={"2x"} />
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
