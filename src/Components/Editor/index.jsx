import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { withImages, withLinks, Element, Leaf, BlockButton, MarkButton, LinkButton, EraseButton } from "./Helpers";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Transforms, Text } from "slate";
import { isKeyHotkey } from "../../Util/isHotkey";
import initialJSONValue from "../value.json";
import { withHistory } from "slate-history";
import { AppContext } from "../Content";
import { Toolbar } from "../Menu";

import "./editor.scss";

/** @type {JSON} */ const databaseValue = JSON.parse(localStorage.getItem("content"));
/** @type {Object} */ const starterValue = databaseValue || initialJSONValue;
/** @type {Object} */ const blankSlateValue = [{ type: "paragraph", children: [{ text: "" }] }];

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
    const editor = useMemo(() => withImages(withLinks(withHistory(withReact(createEditor())))), []);
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    /** @type {[Object, React.SetStateAction<any>]} */
    const [value, setValue] = useState(starterValue);

    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [timerActive, setTimerActive] = useState(true);

    /** @type {[Boolean, React.SetStateAction<any>]} */
    const [isAllSelected, shouldSelectAll] = useState(false);

    /** @type {Function} */
    const setPreviewContent = useContext(AppContext);

    /**
     * Saves the content of the editor to localStorage
     */
    const saveEditor = useCallback(() => {
        const content = JSON.stringify(value);
        localStorage.setItem("content", content);
        setPreviewContent(value);
        setTimerActive(false);
    }, [setPreviewContent, value]);

    /**
     * Adds event listener to save editor content before refreshes/navigation changes
     */
    useEffect(() => {
        function runBeforeExit() {
            saveEditor();
        }

        window.addEventListener("beforeunload", runBeforeExit);
        return function cleanup() {
            window.removeEventListener("beforeunload", runBeforeExit);
        };
    }, [saveEditor]);

    /**
     * Auto-saves editor content after delay.
     */
    useTimeout(() => setTimerActive(false), saveEditor, value, 3000, timerActive);

    /**
     * On change, save the new `value`.
     */

    const onChange = (newValue) => {
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
     */

    const onKeyDown = (event) => {
        if (!event.ctrlKey) {
            return;
        }

        if (isBoldHotkey(event)) {
            event.preventDefault();

            Transforms.setNodes(editor, { bold: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isItalicHotkey(event)) {
            Transforms.setNodes(editor, { italic: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isUnderlinedHotkey(event)) {
            Transforms.setNodes(editor, { underline: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isCodeHotkey(event)) {
            Transforms.setNodes(editor, { code: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isHeadingHotkey(event)) {
            Transforms.setNodes(editor, { heading: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isStrikethroughHotkey(event)) {
            Transforms.setNodes(editor, { strikethrough: true }, { match: (n) => Text.isText(n), split: true });
        } else if (isNewlineHotKey(event)) {
            return editor.insertText("\n");
        } else if (isDeleteHotKey(event)) {
            if (isAllSelected) {
                Transforms.delete(editor);
                Transforms.setNodes(editor, { type: "paragraph" });
                shouldSelectAll(false);
                return;
            }
        }

        if (isSelectAllHotKey(event)) {
            shouldSelectAll(!isAllSelected);
        } else {
            shouldSelectAll(false);
        }
    };

    const onSelect = () => {
        if (isAllSelected) shouldSelectAll(false);
        return;
    };

    const clearEditor = () => {
        setValue(blankSlateValue);
    };

    return (
        <div className="editor__root">
            <Slate editor={editor} value={value} onChange={onChange} onSelect={onSelect}>
                <Toolbar>
                    <BlockButton format="heading" icon="heading" />
                    <MarkButton format="bold" icon="bold" />
                    <MarkButton format="underline" icon="underline" />
                    <MarkButton format="italic" icon="italic" />
                    <MarkButton format="strikethrough" icon="strikethrough" />
                    <BlockButton format="spoiler" icon="eye-slash" />
                    <MarkButton format="noparse" icon="noparse" />
                    <LinkButton />
                    <BlockButton format="UList" icon="list-ul" />
                    <BlockButton format="OList" icon="list-ol" />
                    <BlockButton format="quote" icon="comment" />
                    <BlockButton format="code" icon="code" />
                    <BlockButton format="table" icon="table" />
                    <BlockButton format="image" icon="image" />
                    <EraseButton clearFunction={clearEditor} />
                </Toolbar>

                <div className="editor">
                    <Editable
                        onKeyDown={onKeyDown}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Type your review here..."
                        spellCheck
                        autoFocus
                    />
                </div>
            </Slate>
        </div>
    );
}

export default ReviewEditor;
