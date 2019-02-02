import React, { Component } from "react";
import Editor from "./Editor";
import classes from "./content.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Content extends Component {
    hideInstructions() {
        sessionStorage.showTip = false;
    }

    render() {
        let showTip = sessionStorage.showTip;

        return (
            <main className={classes.main}>
                {showTip && (
                    <div className={classes.instructions}>
                        <p>
                            Steam Review Editor allows you to easily create and
                            modify your reviews in real-time without having to
                            manually apply steam markup tags. Simply type your
                            review, hit "Copy to Clipboard", and paste it in
                            Steam!
                        </p>
                        <div className={classes.tooltip} data-title="Close">
                            <FontAwesomeIcon
                                icon={["far", "times-circle"]}
                                size={"2x"}
                                className={classes.close}
                                onClick={() => this.hideInstructions}
                            />
                        </div>
                    </div>
                )}
                <Editor />
                <button className={classes.previewBtn}>Show Preview</button>
                <button className={classes.markupBtn}>
                    Copy Markup to Clipboard
                </button>
            </main>
        );
    }
}

export default Content;
