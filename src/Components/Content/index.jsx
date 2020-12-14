import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import serializeMarkup from "Util/slate-steam-serializer";
import serializeHTML from "Util/slate-html-serializer";
import ReviewEditor from "Components/Editor";
import Preview from "Components/Preview";
import "./content.scss";

const AppContext = React.createContext(null);

function Content({ notify }) {
	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [showTip, setShowTip] = useState(JSON.parse(localStorage.getItem("showTip")));

	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [hideHelp, setHideHelp] = useState(false);

	/** @type {[Boolean, React.Dispatch<React.SetStateAction<any>>]} */
	const [showPreview, setShowPreview] = useState(false);

	/** @type {[Object, React.Dispatch<React.SetStateAction<any>>]} */
	const [htmlContent, setHTMLContent] = useState(null);

	/** @type {[Object, React.Dispatch<React.SetStateAction<any>>]} */
	const [markup, setMarkup] = useState(null);

	/** @type {[Object, React.Dispatch<React.SetStateAction<any>>]} */
	const [previewContent, setPreviewContent] = useState(null);

	/** @type {[Number, React.Dispatch<React.SetStateAction<any>>]} */
	const [width, setWidth] = useState(document.body.getBoundingClientRect().width);

	const markupAreaRef = useRef(null);

	/** Shows the instructions */
	const showInstructions = () => {
		setShowTip(true);
		setHideHelp(false);
	};

	/** Fully hides the info bar */
	const hideInstructions = () => {
		setShowTip(false);
	};

	/** Helper function to fade out the info bar */
	const startHide = () => {
		setHideHelp(true);
	};

	/** Copies the markup to clipboard */
	const copyToClipboard = () => {
		if (!markupAreaRef.current) return;
		const range = document.createRange();
		const selection = window.getSelection();
		range.selectNodeContents(markupAreaRef.current);
		selection.removeAllRanges();
		selection.addRange(range);
		document.execCommand("copy");
		notify("Markup copied to clipboard!");
	};

	useEffect(() => {
		function checkWidth() {
			setWidth(document.body.getBoundingClientRect().width);
		}

		window.addEventListener("resize", checkWidth);
		window.addEventListener("orientationchange", checkWidth);

		return function cleanup() {
			window.removeEventListener("resize", checkWidth);
			window.removeEventListener("orientationchange", checkWidth);
		};
	}, []);

	/**
	 * Handles the visibility settings of the help tips
	 */
	useEffect(() => {
		if (showTip === null) {
			setShowTip(true);
		}

		/** Saves the visibility of the info bar to local storage */
		const saveState = () => {
			localStorage.setItem("showTip", JSON.stringify(showTip));
		};

		window.addEventListener("beforeunload", saveState);
		return function cleanup() {
			window.removeEventListener("beforeunload", saveState);
		};
	}, [showTip]);

	/** Serializes the editor content before preview is rendered */
	useEffect(() => {
		async function handleSerialization() {
			setMarkup(await serializeMarkup(htmlContent));
			setPreviewContent(await serializeHTML(htmlContent));
		}

		if (htmlContent) handleSerialization();
	}, [htmlContent]);

	return (
		<AppContext.Provider value={{ setHTMLContent, markup, previewContent, notify }}>
			<main className={"content-root"}>
				{showTip && (
					<div
						className={`instructions${hideHelp ? " hiding" : ""}${width >= 1200 ? " wide" : ""}`}
						onAnimationEnd={hideInstructions}
					>
						<p>
							Steam Review Editor allows you to easily create and modify your reviews in real-time without having to
							manually apply steam markup tags. Simply type your review, click "Copy Markup to Clipboard", and paste it
							in Steam!
						</p>
						<div className={`${width >= 1200 ? "tooltip " : ""} close`} onClick={startHide} data-title="Close">
							{width >= 1200 ? (
								<FontAwesomeIcon icon={["far", "times-circle"]} size={"2x"} className="close" />
							) : (
								"Close"
							)}
						</div>
					</div>
				)}
				{showTip === false && (
					<div className={`tooltip showHelp`} data-title="Help" onClick={showInstructions}>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FontAwesomeIcon icon={["far", "question-circle"]} size={"2x"} />
							&nbsp; Show Help
						</span>
					</div>
				)}
				<ReviewEditor />
				<div className="buttons">
					<button className="previewBtn ripple" onClick={() => setShowPreview(!showPreview)}>
						{`${showPreview ? "Hide" : "Show"} Preview`}
					</button>
					<button className="markupBtn ripple" onClick={copyToClipboard}>
						Copy Markup to Clipboard
					</button>
				</div>
				<React.Suspense fallback={<></>}>
					<Preview markupRef={markupAreaRef} visible={showPreview} />
				</React.Suspense>
			</main>
		</AppContext.Provider>
	);
}

export default Content;
export { AppContext };
