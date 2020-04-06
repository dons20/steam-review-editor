import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReviewEditor from "../Editor";
import Preview from "../Preview";
import classes from "./content.module.scss";

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
            <main className={classes.main}>
                {showTip && (
                    <div
                        className={`${classes.instructions} ${hideHelp ? classes.hiding : ""} ${
                            width >= 1200 ? classes.wide : ""
                        }`}
                        onAnimationEnd={hideInstructions}
                    >
                        <p>
                            Steam Review Editor allows you to easily create and modify your reviews in real-time without
                            having to manually apply steam markup tags. Simply type your review, click "Copy Markup to
                            Clipboard", and paste it in Steam!
                        </p>
                        <div
                            className={`${width >= 1200 ? "tooltip " : ""}${classes.close}`}
                            onClick={startHide}
                            data-title="Close"
                        >
                            {width >= 1200 ? (
                                <FontAwesomeIcon icon={["far", "times-circle"]} size={"2x"} className={classes.close} />
                            ) : (
                                "Close"
                            )}
                        </div>
                    </div>
                )}
                {showTip === false && (
                    <div className={`tooltip ${classes.showHelp}`} data-title="Help">
                        <FontAwesomeIcon icon={["far", "question-circle"]} size={"3x"} onClick={showInstructions} />
                    </div>
                )}
                <ReviewEditor />
                <div className={classes.buttons}>
                    <button className={classes.previewBtn} onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "Hide " : "Show "} Preview
                    </button>
                    <button className={classes.markupBtn} onClick={copyToClipboard}>
                        Copy Markup to Clipboard
                    </button>
                </div>
                {showPreview && htmlContent && <Preview content={htmlContent} markupRef={markup} />}
            </main>
        </AppContext.Provider>
    );
}

export default Content;
