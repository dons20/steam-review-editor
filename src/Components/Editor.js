import React, { useState } from "react";
import { Editor as ReviewEditor } from "slate-react";
import { Value } from "slate";
import classes from "./editor.module.scss";

const existingValue = JSON.parse(localStorage.getItem("content"));
const initialValue = Value.fromJSON(
    existingValue || {
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
    }
);

/**
 * Required features
 *
 * H1
 * Bold
 * Underlined
 * Italic
 * Strikethrough
 * Spoiler
 * Noparse
 * Link/URL
 * Unordered List
 * Ordered list
 * Quote
 * Code
 * Table
 */

function Editor() {
    const [value, setValue] = useState(initialValue);

    // On change, update the app's React state with the new editor value.
    function onChange({ value }) {
        // Check to see if the document has changed before saving.
        if (value.document !== this.state.value.document) {
            const content = JSON.stringify(value.toJSON());
            localStorage.setItem("content", content);
        }

        setValue(value);
    }

    function onKeyDown(e, change) {
        if (!e.ctrlKey) {
            return;
        }
        e.preventDefault();

        switch (e.key) {
            case "b": {
                change.addMark("bold");
                return true;
            }
            default: {
                return;
            }
        }
    }

    return (
        <div className={classes.root}>
            <ReviewEditor
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
}

export default Editor;
