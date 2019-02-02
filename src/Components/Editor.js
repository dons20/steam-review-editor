import React, { Component } from "react";
import { Editor as ReviewEditor } from "slate-react";
import { Value } from "slate";
import classes from "./editor.module.scss";

// Create our initial value...
const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: "block",
                type: "paragraph",
                nodes: [
                    {
                        object: "text",
                        leaves: [
                            {
                                text: "Write your review here!"
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

class Editor extends Component {
    // Set the initial value when the app is first constructed.
    state = {
        value: initialValue
    };

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        this.setState({ value });
    };

    render() {
        return (
            <div className={classes.root}>
                <ReviewEditor
                    value={this.state.value}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default Editor;
