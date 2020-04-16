import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppContext } from "../Content";
import steamLogo from "../../assets/img/icon_review_steam.png";
import notRec from "../../assets/img/thumbsDown.png";
import rec from "../../assets/img/thumbsUp.png";

import "./preview.scss";

const Markup = React.lazy(() => import("./Markup"));

const date = new Date();
const months = [
    "JANUARY",
    "FEBUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
];

/**
 * Randomizes a number between 0 and max
 * @param {number} max
 */
const randomize = (max = 1) => {
    return parseInt((Math.random() * Math.floor(max)).toFixed(1));
};

let rand = randomize(51);

function Preview({ markupRef }) {
    /** @type {[boolean, import("react").Dispatch<import("react").SetStateAction<any>>]} */
    const [isRecommended, setIsRecommended] = useState(true);

    /** @type {{markup: JSON, previewContent: JSON}} */
    const { previewContent, markup } = useContext(AppContext);

    //const content = toHTMLMarkup.serialize(props.content);
    /** Flips between Recommended/Not Recommended and randomizes hours */
    const setReview = () => {
        setIsRecommended(!isRecommended);
        rand = randomize(51);
    };

    return (
        <div className={"preview"}>
            <div className={"store"}>
                <h1 className={"heading"}>Store Preview</h1>
                <div className={"body"}>
                    <div className={"avatar"}>
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon="square" color="rgba(255,255,255,0.2)" />
                            <FontAwesomeIcon icon="question" transform="shrink-7" />
                        </span>
                        <div className={"username"}>Your Username</div>
                    </div>
                    <div className={"stats"} onClick={setReview}>
                        <img
                            src={isRecommended ? rec : notRec}
                            alt={isRecommended ? "Recommended" : "Not Recommended"}
                        />
                        <div>
                            {isRecommended ? "Recommended" : "Not Recommended"}
                            <br />
                            <span className={"subtext"}>{rand} hrs on record</span>
                        </div>
                        <div className={"middle"}>
                            <img src={steamLogo} alt="Steam Logo" />
                        </div>
                    </div>
                    <div className={"content"}>
                        <p className={"subtext"}>
                            POSTED: {date.getDate()} {months[date.getMonth()]}
                        </p>
                        <Markup value={previewContent} />
                    </div>
                </div>
            </div>
            <div className={"markup"}>
                <h1 className={"heading"}>Markup Preview</h1>
                <pre className={"markupBody"} ref={markupRef}>
                    {markup ? (
                        <React.Suspense fallback={<>Loading...</>}>
                            <Markup value={markup} />
                        </React.Suspense>
                    ) : (
                        <FontAwesomeIcon icon="spinner" size="4x" style={{ width: "100%" }} spin pulse />
                    )}
                </pre>
            </div>
        </div>
    );
}

export default Preview;
