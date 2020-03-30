import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { Slate, Editable, withReact } from "slate-react";
import { isKeyHotkey } from "../../Util/isHotkey";
import initialJSONValue from "../value.json";
import { AppContext } from "../Content";
import Menu from "../Menu";

//eslint-disable-next-line
import { createEditor, Editor } from "slate";

import classes from "./editor.module.scss";

/** @type {JSON} */ const databaseValue = JSON.parse(localStorage.getItem("content"));
/** @type {Object} */ const starterValue = databaseValue || initialJSONValue;

/** @type {String} */ const DEFAULT_NODE = "paragraph";

/** @type {(value) => Boolean} */ const isHeadingHotkey = isKeyHotkey("mod+h");
/** @type {(value) => Boolean} */ const isBoldHotkey = isKeyHotkey("mod+b");
/** @type {(value) => Boolean} */ const isUnderlinedHotkey = isKeyHotkey("mod+u");
/** @type {(value) => Boolean} */ const isItalicHotkey = isKeyHotkey("mod+i");
/** @type {(value) => Boolean} */ const isStrikethroughHotkey = isKeyHotkey("mod+-");
/** @type {(value) => Boolean} */ const isCodeHotkey = isKeyHotkey("mod+`");
/** @type {(value) => Boolean} */ const isNewlineHotKey = isKeyHotkey("shift+enter");
/** @type {(value) => Boolean} */ const isDeleteHotKey = isKeyHotkey("delete");
/** @type {(value) => Boolean} */ const isSelectAllHotKey = isKeyHotkey("mod+a");

/**
 * A change helper to standardize wrapping links.
 *
 * @param {Editor} editor
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
 * @param {Editor} editor
 */

function unwrapLink(editor) {
    editor.unwrapInline("link");
}

/**
 * Hook to trigger a timeout
 *
 * @param {Function} closeTimer
 * @param {Function} saveEditor
 * @param {Object} value
 * @param {Number} delay
 * @param {Boolean} active
 */
function useTimeout(closeTimer, saveEditor, value, delay, active) {
    // Set up the interval.
    useEffect(() => {
        function save() {
            saveEditor(value);
            closeTimer();
        }
        if (delay !== null && active) {
            let id = setTimeout(save, delay);
            return () => clearInterval(id);
        }
    }, [active, delay, closeTimer, saveEditor, value]);
}

/**
 * Defines the core editor component
 *
 * @returns {JSX.Element}
 */

function ReviewEditor() {
    const editor = useMemo(() => withReact(createEditor()), []);

    /** @type {[Object, React.SetStateAction<any>]} */
    const [value, setValue] = useState(starterValue);

    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [timerActive, setTimerActive] = useState(true);

    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [isAllSelected, shouldSelectAll] = useState(false);

    /** @type {Function} */
    const setPreviewContent = useContext(AppContext);

    /**
     * Adds event listener to save editor content before refreshes/navigation changes
     */
    useEffect(() => {
        function runBeforeExit() {
            saveEditor(value);
        }

        window.addEventListener("beforeunload", runBeforeExit);
        return function cleanup() {
            window.removeEventListener("beforeunload", runBeforeExit);
        };
    });

    /**
     * Saves the content of the editor to localStorage
     */
    const saveEditor = () => {
        //let val = value.toJSON();
        const content = JSON.stringify(value);
        localStorage.setItem("content", content);
        setPreviewContent(value);
        setTimerActive(false);
    };

    /**
     * Auto-saves editor content after delay.
     */
    useTimeout(() => setTimerActive(false), saveEditor, value, 1500, timerActive);

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
     * @param {React.KeyboardEvent} event
     * @param {String} type
     */

    const onClickBlock = (event, type) => {
        event.preventDefault();

        const { value } = editor.current;
        const { document } = value;
        // Handle list blocks
        if (type === "unordered list" || type === "ordered list") {
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
        } else if (type === "table") {
            //Handle table blocks
            const isTable = editor.current.isSelectionInTable();
            if (isTable) {
                editor.current.removeTable();
            } else {
                let rows = parseInt(window.prompt("Enter the number of rows:"));
                if (!rows) return;
                let columns = parseInt(window.prompt("Enter the number of columns:"));
                if (!columns) return;
                editor.current.insertTable(columns, rows);
            }
        } else {
            //Handle every other block
            const isActive = hasBlock(type);
            const isList = hasBlock("list item");
            let author = null,
                img = null;

            if (type === "quote" && !isActive) {
                author = window.prompt("(Optional) Enter the author name:");
            } else if (type === "image" && !isActive) {
                img = window.prompt("Please enter the image url:");
                if (!img) return;
            }

            if (isList) {
                editor.current
                    .setBlocks({ type: isActive ? DEFAULT_NODE : type })
                    .unwrapBlock("unordered list")
                    .unwrapBlock("ordered list");
                if (author) editor.current.setBlocks({ data: { author } });
                if (img) editor.current.setBlocks({ data: { img } });
            } else {
                editor.current.setBlocks({
                    type: isActive ? DEFAULT_NODE : type
                });
                if (author) editor.current.setBlocks({ data: { author } });
                if (img) editor.current.setBlocks({ data: { img } });
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

        /** @type {Editor}*/
        const { value: currentValue } = editor.current;

        switch (type) {
            case "reset to default":
                //Select all and delete
                if (currentValue.document.nodes.size > 0) {
                    editor.current.moveToRangeOfDocument().delete();
                } else {
                    let willReset = window.confirm(
                        "The editor has no child nodes. Will you reset to a default value? (Will remove previous history)"
                    );
                    if (willReset) setValue(initialJSONValue);
                }
                break;
            case "link":
                const editorHasLinks = hasLinks();

                if (editorHasLinks) {
                    editor.current.command(unwrapLink);
                } else if (currentValue.selection.isExpanded) {
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
     * @return {JSX.Element}
     */

    const renderElement = useCallback(props => {
        const { attributes, children, element } = props;

        switch (element.type) {
            case "heading":
                return <h1 {...attributes}>{children}</h1>;
            case "quote":
                const { data } = element;
                const author = data.get("author");
                return (
                    <blockquote className={classes.quote} data-author={author} {...attributes}>
                        {children}
                    </blockquote>
                );
            case "unordered list":
                return <ul {...attributes}>{children}</ul>;
            case "ordered list":
                return <ol {...attributes}>{children}</ol>;
            case "list item":
                return <li {...attributes}>{children}</li>;
            case "code":
                return (
                    <pre className={classes.code} {...attributes}>
                        {children}
                    </pre>
                );
            case "spoiler":
                return (
                    <div className={classes.spoiler} {...attributes}>
                        {children}
                    </div>
                );
            case "noparse":
                return (
                    <pre className={classes.noparse} {...attributes}>
                        {children}
                    </pre>
                );
            case "table":
                return (
                    <table className={classes.table}>
                        <tbody {...attributes}>{children}</tbody>
                    </table>
                );
            case "table-row":
                return <tr {...attributes}>{children}</tr>;
            case "table-cell":
                return <td {...attributes}>{children}</td>;
            case "link": {
                const { data } = element;
                const href = data.get("href");
                return (
                    <a {...attributes} href={href}>
                        {children}
                    </a>
                );
            }
            case "image": {
                const { data } = element;
                const img = data.get("img");
                return (
                    <div {...attributes}>
                        <img src={img} alt={"Image Link: " + img} />
                        {children}
                    </div>
                );
            }
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, []);

    /**
     * Render a Slate leaf.
     *
     * @param {Object} props
     * @return {JSX.Element}
     */

    const renderLeaf = useCallback(props => {
        const { children, leaf, attributes } = props;

        if (leaf.bold) return <strong {...attributes}>{children}</strong>;
        if (leaf.italic) return <em {...attributes}>{children}</em>;
        if (leaf.underlined) return <u {...attributes}>{children}</u>;
        if (leaf.strikethrough) return <s {...attributes}>{children}</s>;
        if (leaf.image) {
            return (
                <img alt="" {...attributes}>
                    {children}
                </img>
            );
        }
        return <span {...attributes}>{children}</span>;
    }, []);

    /**
     * On change, save the new `value`.
     */

    const onChange = newValue => {
        // Check to see if the document has changed before saving.
        if (value.document !== newValue.document) {
            setTimerActive(true);
        }

        setValue(newValue);
    };

    /**
     * On key down, if it's a formatting command toggle a mark.
     *
     * @param {React.KeyboardEvent} event
     * @param {Editor} editor
     * @param {() => any} next
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
        } else if (isSelectAllHotKey(event)) {
            shouldSelectAll(!isAllSelected);
            return next();
        } else if (isDeleteHotKey(event)) {
            if (isAllSelected) {
                editor.setBlocks(DEFAULT_NODE);
                shouldSelectAll(false);
                return next();
            } else {
                return next();
            }
        } else {
            if (isAllSelected) shouldSelectAll(false);
            return next();
        }

        event.preventDefault();
        if (mark) {
            editor.toggleMark(mark);
        } else {
            onClickBlock(event, node);
        }
    };

    const onSelect = (event, editor, next) => {
        if (isAllSelected) shouldSelectAll(false);
        return next();
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
                <Slate
                    editor={editor}
                    value={value}
                    onChange={onChange}
                    //spellCheck
                    //autoFocus
                    //placeholder="Type your review here..."
                    //defaultValue={value}
                    //onSelect={onSelect}
                >
                    <Editable onKeyDown={onKeyDown} renderElement={renderElement} renderLeaf={renderLeaf} />
                </Slate>
            </div>
        </div>
    );
}

export default ReviewEditor;
