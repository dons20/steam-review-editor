import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Editor from "./Editor";
import Preview from "./Preview";
import classes from "./content.module.scss";

function Content() {
    /** @type {[Boolean, React.SetStateAction<Boolean>]} */
    const [showTip, setShowTip] = useState(JSON.parse(localStorage.getItem("showTip")));
    /** @type {[Boolean, React.SetStateAction<Boolean>]} */
    const [hideHelp, setHideHelp] = useState(false);
    /** @type {[Boolean, React.SetStateAction<Boolean>]} */
    const [showPreview, setShowPreview] = useState(false);

    /**
     * Handles the visibility settings of the help tips
     */
    useEffect(() => {
        if (showTip === null) {
            setShowTip(true);
        }
        window.addEventListener("beforeunload", saveState);
        return function cleanup() {
            window.removeEventListener("beforeunload", saveState);
        };
    });

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

    /** Saves the visibility of the info bar to local storage */
    const saveState = () => {
        localStorage.setItem("showTip", JSON.stringify(showTip));
    };

    return (
        <main className={classes.main}>
            {showTip === true && (
                <div
                    className={`${classes.instructions} ${hideHelp ? classes.hiding : null}`}
                    onAnimationEnd={hideInstructions}
                >
                    <p>
                        Steam Review Editor allows you to easily create and modify your reviews in
                        real-time without having to manually apply steam markup tags. Simply type
                        your review, hit "Copy to Clipboard", and paste it in Steam!
                    </p>
                    <div className={classes.tooltip} data-title="Close">
                        <FontAwesomeIcon
                            icon={["far", "times-circle"]}
                            size={"2x"}
                            className={classes.close}
                            onClick={startHide}
                        />
                    </div>
                </div>
            )}
            {showTip === false && (
                <div className={`${classes.tooltip} ${classes.showHelp}`} data-title="Help">
                    <FontAwesomeIcon
                        icon={["far", "question-circle"]}
                        size={"4x"}
                        onClick={showInstructions}
                    />
                </div>
            )}
            <Editor />
            <div className={classes.buttons}>
                <button className={classes.previewBtn} onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? "Hide " : "Show "} Preview
                </button>
                <button className={classes.markupBtn}>Copy Markup to Clipboard</button>
            </div>
            {showPreview === true && <Preview />}
        </main>
    );
}

export default Content;
