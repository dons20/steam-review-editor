import React, { useEffect, useState, useContext, useMemo, useCallback, useRef } from "react";
import {
	withImages,
	withLinks,
	withTables,
	Element,
	Leaf,
	BlockButton,
	MarkButton,
	LinkButton,
	QuoteButton,
	TableButton,
	ImageButton,
	EraseButton,
	toggleBlock,
	toggleMark,
} from "./Helpers";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Transforms } from "slate";
import { isKeyHotkey } from "../../Util/isHotkey";
import initialJSONValue from "../value.json";
import { withHistory } from "slate-history";
import { AppContext } from "../Content";
import Menu from "../Menu";

import "./editor.scss";

/** @type {JSON} */ const databaseValue = JSON.parse(localStorage.getItem("content"));
/** @type {Object} */ const starterValue = databaseValue || initialJSONValue;
/** @type {Object} */ const blankSlateValue = [{ type: "paragraph", children: [{ text: "" }] }];

const HOTKEYS = {
	heading: { isHotkey: isKeyHotkey("mod+h"), type: "block", formatType: "heading" },
	bold: { isHotkey: isKeyHotkey("mod+b"), type: "mark", formatType: "bold" },
	underline: { isHotkey: isKeyHotkey("mod+u"), type: "mark", formatType: "underline" },
	italic: { isHotkey: isKeyHotkey("mod+i"), type: "mark", formatType: "italic" },
	strikethrough: { isHotkey: isKeyHotkey("mod+-"), type: "mark", formatType: "strikethrough" },
	spoiler: { isHotkey: isKeyHotkey("mod+1"), type: "block", formatType: "spoiler" },
	noparse: { isHotkey: isKeyHotkey("mod+\\"), type: "block", formatType: "noparse" },
	link: { isHotkey: isKeyHotkey("mod+L"), type: "mark", formatType: "link" },
	olist: { isHotkey: isKeyHotkey("mod+2"), type: "block", formatType: "OList" },
	ulist: { isHotkey: isKeyHotkey("mod+3"), type: "block", formatType: "UList" },
	quote: { isHotkey: isKeyHotkey("mod+q"), type: "block", formatType: "quote" },
	code: { isHotkey: isKeyHotkey("mod+`"), type: "block", formatType: "code" },
	table: { isHotkey: isKeyHotkey("mod+t"), type: "block", formatType: "table" },
	image: { isHotkey: isKeyHotkey("mod+y"), type: "block", formatType: "image" },
	erase: { isHotkey: isKeyHotkey("mod+e"), type: "format", formatType: "erase" },
	softbreak: { isHotkey: isKeyHotkey("shift+enter"), type: "format", formatType: "softbreak" },
	delete: { isHotkey: isKeyHotkey("delete"), type: "format", formatType: "delete" },
	selectall: { isHotkey: isKeyHotkey("mod+a"), type: "format", formatType: "selectall" },
};

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
	const editor = useMemo(() => withTables(withImages(withLinks(withHistory(withReact(createEditor()))))), []);
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);

	/** @type {[Object, React.Dispatch<React.SetStateAction<any>>]} */
	const [value, setValue] = useState(starterValue);

	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [timerActive, setTimerActive] = useState(true);

	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [isAllSelected, shouldSelectAll] = useState(false);

	/** @type {{ setHTMLContent: React.Dispatch<React.SetStateAction<any>>, notify: Function }} */
	const { setHTMLContent, notify } = useContext(AppContext);

	/** @type {{current: Boolean}} */
	const shouldBreakout = useRef(false);

	const currentValue = useRef(value);

	/**
	 * Saves the content of the editor to localStorage
	 */
	const saveEditor = useCallback(() => {
		const content = JSON.stringify(value);
		localStorage.setItem("content", content);
		setHTMLContent(value);
		setTimerActive(false);
		notify("Latest changes saved ✅");
		currentValue.current = value;
	}, [setHTMLContent, value, notify]);

	/**
	 * Adds event listener to save editor content before refreshes/navigation changes
	 */
	useEffect(() => {
		function runBeforeExit() {
			saveEditor();
		}

		setHTMLContent(value);

		window.addEventListener("beforeunload", runBeforeExit);

		return function cleanup() {
			window.removeEventListener("beforeunload", runBeforeExit);
		};
	}, [saveEditor, setHTMLContent, value]);

	/**
	 * Auto-saves editor content after delay.
	 */
	useTimeout(() => setTimerActive(false), saveEditor, value, 10000, timerActive);

	/**
	 * On change, save the new `value`.
	 */

	const onChange = newValue => {
		// Check to see if the value has changed before saving.
		if (!Object.is(currentValue.current, newValue)) {
			setTimerActive(true);
		}

		setValue(newValue);
	};

	/**
	 * On key down, if it's a formatting command toggle a mark.
	 *
	 * @param {React.KeyboardEvent} event
	 */

	const onKeyDown = event => {
		if (event.shiftKey || event.ctrlKey || event.keyCode === 13) {
			if (event.keyCode === 13) {
				if (shouldBreakout.current) {
					event.preventDefault();
					let { selection } = editor;
					Transforms.setNodes(editor, { type: "paragraph" });
					if (selection?.anchor?.path.length > 2) {
						Transforms.liftNodes(editor);
					}
					shouldBreakout.current = false;
					return;
				} else {
					shouldBreakout.current = true;
					return;
				}
			} else {
				shouldBreakout.current = false;
			}

			for (const [, value] of Object.entries(HOTKEYS)) {
				if (value.isHotkey(event)) {
					if (value.type === "mark") {
						event.preventDefault();
						toggleMark(editor, value.formatType);
					} else if (value.type === "block") {
						event.preventDefault();
						toggleBlock(editor, value.formatType);
					} else {
						if (value.formatType === "softbreak") {
							event.preventDefault();
							Transforms.insertText(editor, "\n");
						} else if (value.formatType === "delete") {
							if (isAllSelected) {
								event.preventDefault();
								Transforms.delete(editor);
								Transforms.setNodes(editor, { type: "paragraph" });
								shouldSelectAll(false);
							}
						} else if (value.formatType === "selectall") {
							shouldSelectAll(!isAllSelected);
						} else {
							shouldSelectAll(false);
						}
					}
				}
			}
		} else {
			shouldBreakout.current = false;
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
				<Menu>
					<BlockButton format="heading" icon="heading" />
					<MarkButton format="bold" icon="bold" />
					<MarkButton format="underline" icon="underline" />
					<MarkButton format="italic" icon="italic" />
					<MarkButton format="strikethrough" icon="strikethrough" />
					<BlockButton format="spoiler" icon="eye-slash" />
					<BlockButton format="noparse" icon="noparse" />
					<LinkButton />
					<BlockButton format="UList" icon="list-ul" />
					<BlockButton format="OList" icon="list-ol" />
					<QuoteButton format="quote" icon="comment" />
					<BlockButton format="code" icon="code" />
					<TableButton format="table" icon="table" />
					<ImageButton format="image" icon="image" />
					<EraseButton clearFunction={clearEditor} />
				</Menu>

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
