import React, { useState } from "react";
import classes from "./preview.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Value } from "slate";
import rec from "../thumbsUp.png";
import notRec from "../thumbsDown.png";
import steamLogo from "../icon_review_steam.png";
import SteamMarkup from "../Util/slate-steam-serializer";
import HTML from "../Util/slate-html-serializer";
import markupRules from "./markupRules.js";
import htmlRules from "./htmlRules.js";

const toSteamMarkup = new SteamMarkup(markupRules);
const toHTMLMarkup = new HTML(htmlRules);
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
    "DECEMBER"
];

/**
 * Randomizes a number between 0 and max
 * @param {Integer} max
 */
const randomize = max => {
    return parseFloat(Math.random() * max).toFixed(1);
};

let rand = randomize(51);

/**
 * @typedef {Object} props
 * @property {JSON} content
 *
 * @param {props} props
 */
function Preview(props) {
    const [isRecommended, setIsRecommended] = useState(true);

    /** @type {String} */
    const markup = toSteamMarkup.serialize(Value.fromJSON(props.content)).join("");
    const content = toHTMLMarkup.serialize(Value.fromJSON(props.content));
    /** Flips between Recommended/Not Recommended and randomizes hours */
    const setReview = () => {
        setIsRecommended(!isRecommended);
        rand = randomize();
    };

    return (
        <div className={classes.preview}>
            <div className={classes.store}>
                <h1 className={classes.heading}>Store Preview</h1>
                <div className={classes.body}>
                    <div className={classes.avatar}>
                        <span className="fa-layers fa-fw">
                            <FontAwesomeIcon icon="square" color="rgba(255,255,255,0.2)" />
                            <FontAwesomeIcon icon="question" transform="shrink-7" />
                        </span>
                        <div className={classes.username}>Your Username</div>
                    </div>
                    <div className={classes.stats} onClick={setReview}>
                        <img
                            src={isRecommended ? rec : notRec}
                            alt={isRecommended ? "Recommended" : "Not Recommended"}
                        />
                        <div>
                            {isRecommended ? "Recommended" : "Not Recommended"}
                            <br />
                            <span className={classes.subtext}>{rand} hrs on record</span>
                        </div>
                        <div className={classes.middle}>
                            <img src={steamLogo} alt="Steam Logo" />
                        </div>
                    </div>
                    <div className={classes.content}>
                        <p className={classes.subtext}>
                            POSTED: {date.getDate()} {months[date.getMonth()]}
                        </p>
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </div>
            </div>
            <div className={classes.markup}>
                <h1 className={classes.heading}>Markup Preview</h1>
                <div className={classes.markupBody} ref={props.markupRef}>
                    {markup}
                </div>
            </div>
        </div>
    );
}

export default Preview;
