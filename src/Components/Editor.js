import React, { useState, useEffect } from "react";
import { Editor as ReviewEditor } from "slate-react";
import { Value } from "slate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./editor.module.scss";

const existingValue = JSON.parse(localStorage.getItem("content"));
const basicValue = {
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
};
const initialValue = Value.fromJSON(existingValue || basicValue);

const items = [
    {
        name: "Header",
        value: <FontAwesomeIcon icon="heading" />
    },
    {
        name: "Bold",
        value: <FontAwesomeIcon icon="bold" />
    },
    {
        name: "Underlined",
        value: <FontAwesomeIcon icon="underline" />
    },
    {
        name: "Italic",
        value: <FontAwesomeIcon icon="italic" />
    },
    {
        name: "Strikethrough",
        value: <FontAwesomeIcon icon="strikethrough" />
    },
    {
        name: "Spoiler",
        value: <FontAwesomeIcon icon="eye-slash" />
    },
    {
        name: "Noparse",
        value: (
            <span className="fa-layers fa-fw static">
                <FontAwesomeIcon icon="code" />
                <FontAwesomeIcon
                    icon="ban"
                    color="rgba(255, 99, 71, 0.5)"
                    size="2x"
                />
            </span>
        )
    },
    {
        name: "Link",
        value: <FontAwesomeIcon icon="link" />
    },
    {
        name: "Unordered List",
        value: <FontAwesomeIcon icon="list-ul" />
    },
    {
        name: "Ordered List",
        value: <FontAwesomeIcon icon="list-ol" />
    },
    {
        name: "Quote",
        value: <FontAwesomeIcon icon="comment" />
    },
    {
        name: "Code",
        value: <FontAwesomeIcon icon="code" />
    },
    {
        name: "Table",
        value: <FontAwesomeIcon icon="table" />
    },
    {
        name: "Reset to Default",
        value: <FontAwesomeIcon icon="spinner" />
    }
];

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
 * Reset to Default
 */

const MenuItems = props => {
    const [activeItems, setActiveItems] = useState(Array);
    const listItems = items.map((item, index) => (
        <div
            className={`${classes.tooltip} ${classes.custom}${
                activeItems.includes(index) ? ` ${classes.active}` : ""
            }`}
            data-title={item.name}
            key={item.name}
            onClick={() => handleActiveItems(index)}
        >
            {item.value}
        </div>
    ));

    function handleActiveItems(index) {
        let pos = activeItems.indexOf(index);
        let copy = [...activeItems];
        if (pos !== -1) {
            copy.splice(pos, 1);
            setActiveItems(copy);
        } else {
            setActiveItems([...copy, index]);
        }
    }

    return listItems;
};

function Editor() {
    const [value, setValue] = useState(initialValue);

    // On change, update the app's React state with the new editor value.
    function onChange({ value: localValue }) {
        // Check to see if the document has changed before saving.
        if (localValue.document !== value.document) {
            const content = JSON.stringify(value.toJSON());
            localStorage.setItem("content", content);
        }

        setValue(localValue);
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

    useEffect(() => {});

    return (
        <div className={classes.root}>
            <div className={classes.menu}>
                <MenuItems />
            </div>
            <div className={classes.editor}>
                <ReviewEditor
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </div>
        </div>
    );
}

export default Editor;
