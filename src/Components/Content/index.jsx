import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReviewEditor from "../Editor";
import Preview from "../Preview";
import "./content.scss";

export const AppContext = React.createContext(null);

function Content(props) {
    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [showTip, setShowTip] = useState(JSON.parse(localStorage.getItem("showTip")));
    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [hideHelp, setHideHelp] = useState(false);
    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [showPreview, setShowPreview] = useState(false);
    /** @type {[Object, React.SetStateAction<any>]} */
    const [htmlContent, setHTMLContent] = useState(null);

    /** @type {[Number, React.SetStateAction<any>]} */
    const [width, setWidth] = useState(document.body.getBoundingClientRect().width);

    const markup = useRef(null);

    /** Shows the instructions */
    const showInstructions = () => {
        setShowTip(true);
        setHideHelp(false);
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
        if (!markup.current) return;
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(markup.current);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        props.notify("Markup copied to clipboard!");
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

    return (
        <AppContext.Provider value={setHTMLContent}>
            <main className={"content-root"}>
                {showTip && (
                    <div
                        className={`instructions ${hideHelp && "hiding"} ${width >= 1200 && "wide"}`}
                        onAnimationEnd={hideInstructions}
                    >
                        <p>
                            Steam Review Editor allows you to easily create and modify your reviews in real-time without
                            having to manually apply steam markup tags. Simply type your review, click "Copy Markup to
                            Clipboard", and paste it in Steam!
                        </p>
                        <div
                            className={`${width >= 1200 ? "tooltip " : ""} close`}
                            onClick={startHide}
                            data-title="Close"
                        >
                            {width >= 1200 ? (
                                <FontAwesomeIcon icon={["far", "times-circle"]} size={"2x"} className="close" />
                            ) : (
                                "Close"
                            )}
                        </div>
                    </div>
                )}
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
                {showPreview && htmlContent && <Preview content={htmlContent} markupRef={markup} />}
            </main>
        </AppContext.Provider>
    );
}

export default Content;
