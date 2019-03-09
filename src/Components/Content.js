import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import classes from "./content.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Content() {
    /** @type {[Boolean, React.SetStateAction<Boolean>]} */
    const [showTip, setShowTip] = useState(JSON.parse(localStorage.getItem("showTip")));
    /** @type {[Boolean, React.SetStateAction<Boolean>]} */
    const [hideHelp, setHideHelp] = useState(false);

    let helpClasses = [classes.instructions];
    if (hideHelp) {
        helpClasses.push(classes.hiding);
    }
    let join = helpClasses.join(" ");

    useEffect(() => {
        if (showTip === null) {
            setShowTip(true);
        }
        window.addEventListener("beforeunload", saveState);
        return function cleanup() {
            window.removeEventListener("beforeunload", saveState);
        };
    });

    const showInstructions = () => {
        setShowTip(true);
        setHideHelp(false);
    };

    const hideInstructions = () => {
        setShowTip(false);
    };

    const startHide = () => {
        setHideHelp(true);
    };

    const saveState = () => {
        localStorage.setItem("showTip", JSON.stringify(showTip));
    };

    return (
        <main className={classes.main}>
            {showTip === true && (
                <div className={join} onAnimationEnd={hideInstructions}>
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
                <button className={classes.previewBtn}>Show Preview</button>
                <button className={classes.markupBtn}>Copy Markup to Clipboard</button>
            </div>
        </main>
    );
}

export default Content;
