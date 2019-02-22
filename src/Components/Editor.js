import React, { useEffect, useState, useRef } from "react";
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
const isNewlineHotKey = isKeyHotkey("shift+enter");

/**
 * A change helper to standardize wrapping links.
 *
 * @param {ReviewEditor} editor
 * @param {String} href
 */

function wrapLink(editor, href) {
    editor.wrapInline({
        type: "link",
        data: { href }
    });

    editor.moveToEnd();
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {ReviewEditor} editor
 */

function unwrapLink(editor) {
    editor.unwrapInline("link");
}

/**
 * Hook to trigger a timeout
 *
 * @param {Function} callback
 * @param {Function} beforeTimeout
 * @param {Number} delay
 * @param {Boolean} active
 */
function useTimeout(beforeTimeout, callback, delay, active) {
    const savedCallback = useRef();

    // Remember the latest callback and run initial function
    useEffect(() => {
        savedCallback.current = callback;
        beforeTimeout();
    });

    // Set up the interval.
    useEffect(() => {
        function save() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setTimeout(save, delay);
            return () => clearInterval(id);
        }
    }, [active, delay]);
}

/**
 * Defines the core editor component
 */

function Editor() {
    /**
     * @type {Object} value
     * @type {Function} setValue
     */
    const [value, setValue] = useState(starterValue);
    const [timerActive, setTimerActive] = useState(false);
    const editor = useRef(null);

    /**
     * Adds event listener to save editor content before refreshes/navigation changes
     */
    useEffect(() => {
        window.addEventListener("beforeunload", saveEditor.bind(this, value));
        return function cleanup() {
            window.removeEventListener("beforeunload", saveEditor);
        };
    });

    /**
     * Auto-saves editor content after delay.
     */
    useTimeout(() => setTimerActive(false), () => saveEditor(value), 1000, timerActive);

    /**
     * Saves the content of the editor to localStorage
     *
     * @param {Value} value
     */
    const saveEditor = value => {
        const content = JSON.stringify(value.toJSON());
        localStorage.setItem("content", content);
    };

    /**
     * Check if the current selection has a mark with `type` in it.
     *
     * @param {String} type
     * @return {Boolean}
     */

    const hasMark = type => {
        if (editor.current) {
            const { value } = editor.current;
            return value.activeMarks.some(mark => mark.type === type);
        }
    };

    /**
     * Check if the any of the currently selected blocks are of `type`.
     *
     * @param {String} type
     * @return {Boolean}
     */

    const hasBlock = type => {
        if (editor.current) {
            const { value } = editor.current;
            return value.blocks.some(node => node.type === type);
        }
    };

    /**
     * Check whether the current selection has a link in it.
     *
     * @return {Boolean} hasLinks
     */

    const hasLinks = () => {
        if (editor.current) {
            const { value } = editor.current;
            return value.inlines.some(inline => inline.type === "link");
        }
    };

    /**
     * When a mark button is clicked, toggle the current mark.
     *
     * @param {Event} event
     * @param {String} type
     */

    const onClickMark = (event, type) => {
        event.preventDefault();
        editor.current.toggleMark(type);
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            editor.current.focus();
        });
    };

    /**
     * When a block button is clicked, toggle the block type.
     *
     * @param {Event} event
     * @param {String} type
     */

    const onClickBlock = (event, type) => {
        event.preventDefault();

        /**
         * @type {Object}
         */
        const { value } = editor.current;
        const { document } = value;

        // Handle everything but list buttons.
        if (type !== "unordered list" && type !== "ordered list") {
            const isActive = hasBlock(type);
            const isList = hasBlock("list item");

            if (isList) {
                editor.current
                    .setBlocks(isActive ? DEFAULT_NODE : type)
                    .unwrapBlock("unordered list")
                    .unwrapBlock("ordered list");
            } else {
                editor.current.setBlocks(isActive ? DEFAULT_NODE : type);
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = hasBlock("list item");
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === type);
            });

            if (isList && isType) {
                editor.current
                    .setBlocks(DEFAULT_NODE)
                    .unwrapBlock("unordered list")
                    .unwrapBlock("ordered list");
            } else if (isList) {
                editor.current
                    .unwrapBlock(type === "unordered list" ? "ordered list" : "unordered list")
                    .wrapBlock(type);
            } else {
                editor.current.setBlocks("list item").wrapBlock(type);
            }
        }

        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            editor.current.focus();
        });
    };

    /**
     * Performs Custom behaviour on click
     *
     * @param {MouseEvent} event
     * @param {String} type
     */
    const onClickCustom = (event, type) => {
        event.preventDefault();

        const { value } = editor.current;

        switch (type) {
            case "reset to default":
                //Select all and delete
                editor.current.moveToRangeOfDocument().insertText("");
                break;
            case "link":
                const editorHasLinks = hasLinks();

                if (editorHasLinks) {
                    editor.current.command(unwrapLink);
                } else if (value.selection.isExpanded) {
                    const href = window.prompt("Enter the URL of the link:");

                    if (href === null) {
                        return;
                    }

                    editor.current.command(wrapLink, href);
                } else {
                    const href = window.prompt("Enter the URL of the link:");

                    if (href === null) {
                        return;
                    }

                    const text = window.prompt("Enter the text for the link:");

                    if (text === null) {
                        return;
                    }

                    editor.current
                        .insertText(text)
                        .moveFocusBackward(text.length)
                        .command(wrapLink, href);
                }
                break;
            default:
                break;
        }
        //Small hack to allow correct editor reference to be focused
        setTimeout(() => {
            editor.current.focus();
        });
    };

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @param {ReviewEditor} editor
     * @return {Element}
     */

    const renderNode = (props, editor, next) => {
        const { attributes, children, node } = props;

        switch (node.type) {
            case "code":
                return <pre {...attributes}>{children}</pre>;
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
            case "link": {
                const { data } = node;
                const href = data.get("href");
                return (
                    <a {...attributes} href={href}>
                        {children}
                    </a>
                );
            }
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
     * @param {ReviewEditor} editor
     */

    const onChange = ({ value: newValue }) => {
        // Check to see if the document has changed before saving.
        if (value.document !== newValue.document) {
            setTimerActive(true);
        }

        setValue(newValue);
    };

    /**
     * On key down, if it's a formatting command toggle a mark.
     *
     * @param {Event} event
     * @param {ReviewEditor} editor
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
        } else if (isNewlineHotKey(event)) {
            return editor.insertText("\n");
        } else {
            return next();
        }

        event.preventDefault();
        if (mark) {
            editor.toggleMark(mark);
        } else {
            onClickBlock(event, node);
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.menu}>
                <Menu
                    editor={editor}
                    hasMark={hasMark}
                    hasBlock={hasBlock}
                    hasLinks={hasLinks}
                    classes={classes}
                    onClickMark={onClickMark}
                    onClickBlock={onClickBlock}
                    onClickCustom={onClickCustom}
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