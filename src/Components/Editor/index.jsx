import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { EDITOR_JS_TOOLS } from "./Helpers/tools";
import { AppContext } from "Components/Content";
import EditorJs from "react-editor-js";

import "./editor.scss";

/** @type {JSON} */ const databaseValue = JSON.parse(localStorage.getItem("content"));
/** @type {Object} */ const starterValue = databaseValue || undefined;

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
	const editorRef = useRef(null);

	/** @type {[Object, React.Dispatch<React.SetStateAction<any>>]} */
	const [data, setData] = useState(starterValue);

	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [timerActive, setTimerActive] = useState(true);

	/** @type {{ setHTMLContent: React.Dispatch<React.SetStateAction<any>>, notify: Function }} */
	const { setHTMLContent, notify } = useContext(AppContext);

	const currentValue = useRef(data);

	/**
	 * Saves the content of the editor to localStorage
	 */
	const saveEditor = useCallback(async () => {
		const savedData = await editorRef.current.save();
		const content = JSON.stringify(savedData);
		localStorage.setItem("content", content);
		//setHTMLContent(data);
		console.log(savedData);
		setTimerActive(false);
		notify("Latest changes saved ✅");
		currentValue.current = data;
	}, [data, notify]);

	/**
	 * Adds event listener to save editor content before refreshes/navigation changes
	 */
	useEffect(() => {
		function runBeforeExit() {
			saveEditor();
		}

		//setHTMLContent(data);

		window.addEventListener("beforeunload", runBeforeExit);

		return function cleanup() {
			window.removeEventListener("beforeunload", runBeforeExit);
		};
	}, [saveEditor, setHTMLContent, data]);

	/**
	 * Auto-saves editor content after delay.
	 */
	useTimeout(() => setTimerActive(false), saveEditor, data, 10000, timerActive);

	/**
	 * On change, save the new `value`.
	 */

	const onChange = newValue => {
		// Check to see if the value has changed before saving.
		if (!Object.is(currentValue.current, newValue)) {
			setTimerActive(true);
		}

		setData(newValue);
	};

	return (
		<div className="editor__root">
			<EditorJs
				data={data}
				placeholder="Type your review here..."
				instanceRef={instance => (editorRef.current = instance)}
				onChange={onChange}
				autofocus={true}
				tools={EDITOR_JS_TOOLS}
			/>
		</div>
	);
}

export default ReviewEditor;
