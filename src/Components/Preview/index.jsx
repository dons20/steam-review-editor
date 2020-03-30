import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import steamLogo from "../../assets/img/icon_review_steam.png";
import SteamMarkup from "../../Util/slate-steam-serializer";
import notRec from "../../assets/img/thumbsDown.png";
import HTML from "../../Util/slate-html-serializer";
import rec from "../../assets/img/thumbsUp.png";
import value from "../value.json";
import markupRules from "../markupRules.js";
import htmlRules from "../htmlRules.js";

import classes from "./preview.module.scss";

//const toSteamMarkup = SteamMarkup(value);
//const toHTMLMarkup = HTML(value);
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
 * @param {number} max
 */
const randomize = (max = 1) => {
    return parseInt((Math.random() * Math.floor(max)).toFixed(1));
};

let rand = randomize(51);

/**
 * @typedef {Object} props
 * @property {JSON} content
 * @property {React.MutableRefObject<any>} markupRef
 *
 * @param {props} props
 */
function Preview(props) {
    const [isRecommended, setIsRecommended] = useState(true);

    /** @type {String} */
    //const markup = toSteamMarkup.serialize(props.content);
    //const content = toHTMLMarkup.serialize(props.content);
    /** Flips between Recommended/Not Recommended and randomizes hours */
    const setReview = () => {
        setIsRecommended(!isRecommended);
        rand = randomize(51);
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
                        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
                    </div>
                </div>
            </div>
            <div className={classes.markup}>
                <h1 className={classes.heading}>Markup Preview</h1>
                <pre className={classes.markupBody} ref={props.markupRef}>
                    {/* {markup} */}
                </pre>
            </div>
        </div>
    );
}

export default Preview;