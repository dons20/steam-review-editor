import React, { Component } from "react";
import Editor from "./Editor";
import classes from "./content.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTip: JSON.parse(sessionStorage.getItem("showTip")),
            contentIsDirty: false,
            hideHelp: false
        };
        this.showInstructions = this.showInstructions.bind(this);
        this.hideInstructions = this.hideInstructions.bind(this);
        this.saveState = this.saveState.bind(this);
    }

    showInstructions() {
        this.setState({ showTip: true, hideHelp: false });
    }

    hideInstructions() {
        this.setState({ showTip: false });
    }

    saveState(e) {
        if (this.state.contentIsDirty) {
            // Cancel the event
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = "";
            sessionStorage.setItem(
                "showTip",
                JSON.stringify(this.state.showTip)
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.saveState);
    }

    componentDidMount() {
        if (this.state.showTip === null) {
            this.setState({ showTip: true });
        }

        window.addEventListener("beforeunload", e => this.saveState(e));
    }

    render() {
        const { showTip, hideHelp } = this.state;
        let helpClasses = [classes.instructions];
        if (hideHelp) {
            helpClasses.push(classes.hiding);
        }
        let join = helpClasses.join(" ");

        return (
            <main className={classes.main}>
                {showTip === true && (
                    <div
                        className={join}
                        onAnimationEnd={this.hideInstructions}
                    >
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
                                onClick={() =>
                                    this.setState({ hideHelp: true })
                                }
                            />
                        </div>
                    </div>
                )}
                {showTip === false && (
                    <div
                        className={`${classes.tooltip} ${classes.showHelp}`}
                        data-title="Help"
                    >
                        <FontAwesomeIcon
                            icon={["far", "question-circle"]}
                            size={"4x"}
                            onClick={this.showInstructions}
                        />
                    </div>
                )}
                <Editor />
                <div className={classes.buttons}>
                    <button className={classes.previewBtn}>Show Preview</button>
                    <button className={classes.markupBtn}>
                        Copy Markup to Clipboard
                    </button>
                </div>
            </main>
        );
    }
}

export default Content;
