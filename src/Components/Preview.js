import React, { useState } from "react";
import classes from "./preview.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import rec from "../thumbsUp.png";
import notRec from "../thumbsDown.png";
import steamLogo from "../icon_review_steam.png";

function Preview() {
    const [isRecommended, setIsRecommended] = useState(true);
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
    const date = new Date();
    const Content = "Here's some text";

    const setReview = () => {
        setIsRecommended(!isRecommended);
        rand = randomize();
    };

    const randomize = () => {
        return parseFloat(Math.random() * 51).toFixed(1);
    };

    let rand = randomize();

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
                        {Content}
                    </div>
                </div>
            </div>
            <div className={classes.markup}>
                <h1 className={classes.heading}>Markup Preview</h1>
                <div className={classes.body} />
            </div>
        </div>
    );
}

export default Preview;
