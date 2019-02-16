import React, { useState, useRef } from "react";
import { Editor as ReviewEditor } from "slate-react";
import { Value } from "slate";
import { isKeyHotkey } from "../Util/isHotkey";
import classes from "./editor.module.scss";
import Menu from "./Menu";

const databaseValue = JSON.parse(localStorage.getItem("content"));
const initialValue = {
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
const starterValue = Value.fromJSON(databaseValue || initialValue);

/**
 * Define the default node type.
 *
 * @type {String}
 */

const DEFAULT_NODE = "paragraph";

/**
 * Define hotkey matchers.
 *
 * @type {Function}
 */

const isHeadingHotkey = isKeyHotkey("mod+h");
const isBoldHotkey = isKeyHotkey("mod+b");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isItalicHotkey = isKeyHotkey("mod+i");
const isStrikethroughHotkey = isKeyHotkey("mod+-");
const isCodeHotkey = isKeyHotkey("mod+`");

/**
 * Deserialize the initial editor value.
 *
 * @type {JSX.Element}
 */

function Editor(props) {
    const [value, setValue] = useState(starterValue);
    const editor = useRef();

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} event
     * @param {String} type
     */

    const onClickMark = (event, type) => {
        event.preventDefault();
        editor.current.toggleMark(type);
    };

    /**
     * When a block button is clicked, toggle the block type.
     *
     * @param {Event} event
     * @param {String} type
     */

    const onClickBlock = (event, type) => {
        event.preventDefault();

        const { value } = editor.current;
        const { document } = value;

        // Handle everything but list buttons.
        if (type !== "unordered list" && type !== "ordered list") {
            const isActive = hasBlock(type);
            const isList = hasBlock("list-item");

            if (isList) {
                editor
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock("bulleted-list")
                    .unwrapBlock("numbered-list");
            } else {
                editor.current.setBlocks(isActive ? DEFAULT_NODE : type);
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = hasBlock("list-item");
            const isType = value.blocks.some(block => {
                return !!document.getClosest(
                    block.key,
                    parent => parent.type === type
                );
            });

            if (isList && isType) {
                editor
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock("bulleted-list")
                    .unwrapBlock("numbered-list");
            } else if (isList) {
                editor
                    .unwrapBlock(
                        type === "bulleted-list"
                            ? "numbered-list"
                            : "bulleted-list"
                    )
                    .wrapBlock(type);
            } else {
                editor.current.setBlocks("list-item").wrapBlock(type);
            }
        }
    };

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    const hasMark = type => {
        return value.activeMarks.some(mark => mark.type === type);
    };

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */

    const hasBlock = type => {
        return value.blocks.some(node => node.type === type);
    };

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @return {Element}
     */

    const renderNode = (props, editor, next) => {
        const { attributes, children, node } = props;

        switch (node.type) {
            case "quote":
                return <blockquote {...attributes}>{children}</blockquote>;
            case "unordered list":
                return <ul {...attributes}>{children}</ul>;
            case "heading":
                return <h1 {...attributes}>{children}</h1>;
            case "list item":
                return <li {...attributes}>{children}</li>;
            case "ordered list":
                return <ol {...attributes}>{children}</ol>;
            default:
                return next();
        }
    };

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    const renderMark = (props, editor, next) => {
        const { children, mark, attributes } = props;

        switch (mark.type) {
            case "bold":
                return <strong {...attributes}>{children}</strong>;
            case "code":
                return <code {...attributes}>{children}</code>;
            case "italic":
                return <em {...attributes}>{children}</em>;
            case "underlined":
                return <u {...attributes}>{children}</u>;
            default:
                return next();
        }
    };

    /**
     * On change, save the new `value`.
     *
     * @param {Editor} editor
     */

    const onChange = ({ value }) => {
        setValue(value);
    };

    /**
     * On key down, if it's a formatting command toggle a mark.
     *
     * @param {Event} event
     * @param {Editor} editor
     * @return {Change}
     */

    const onKeyDown = (event, editor, next) => {
        let mark, node;

        if (isBoldHotkey(event)) {
            mark = "bold";
        } else if (isItalicHotkey(event)) {
            mark = "italic";
        } else if (isUnderlinedHotkey(event)) {
            mark = "underlined";
        } else if (isCodeHotkey(event)) {
            mark = "code";
        } else if (isHeadingHotkey(event)) {
            node = "heading";
        } else if (isStrikethroughHotkey(event)) {
            mark = "strikethrough";
        } else {
            return next();
        }

        event.preventDefault();
        if (mark) {
            editor.toggleMark(mark);
        } else {
            this.handleBlock(event, node);
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.menu}>
                <Menu
                    hasMark={hasMark}
                    hasBlock={hasBlock}
                    classes={classes}
                    onClickBlock={onClickBlock}
                    onClickMark={onClickMark}
                />
            </div>
            <div className={classes.editor}>
                <ReviewEditor
                    spellCheck
                    autoFocus
                    placeholder="Type your review here..."
                    ref={editor}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    renderNode={renderNode}
                    renderMark={renderMark}
                />
            </div>
        </div>
    );
}

export default Editor;
