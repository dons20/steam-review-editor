import React, { useState } from "react";
import classes from "./preview.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import rec from "../thumbsUp.png";
import notRec from "../thumbsDown.png";
import steamLogo from "../icon_review_steam.png";
import SteamMarkup from "../Util/slate-steam-serializer";
import { Value } from "slate";

const toSteamMarkup = new SteamMarkup({
    rules: [
        {
            /**
             * @param {import('slate').Document} obj
             * @param {Array<import('immutable').List>} children
             */
            serialize(obj, children) {
                if (obj.object === "block") {
                    let root = children.get(0).join("");
                    switch (obj.type) {
                        case "heading":
                            return `[h1]${root}[/h1]\n`;
                        case "paragraph":
                            return `${root}\n` || null;
                        default:
                            return;
                    }
                } else if (obj.object === "mark") {
                    switch (obj.type) {
                        case "bold":
                            return `[b]${children}[/b]`;
                        case "underlined":
                            return `[u]${children}[/u]`;
                        case "italic":
                            return `[i]${children}[/i]`;
                        case "strikethrough":
                            return `[strike]${children}[/strike]`;
                        default:
                            return;
                    }
                }
            }
        }
    ]
});

const date = new Date();
const randomize = () => {
    return parseFloat(Math.random() * 51).toFixed(1);
};
let rand = randomize();

function Preview(props) {
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

    /** @type {String} */
    const markup = toSteamMarkup.serialize(Value.fromJSON(props.content)).reduce((text, child) => {
        return text + child;
    });
    const content = markup.replace(/\[/g, "<").replace(/\]/g, ">");

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
                <div className={classes.markupBody}>{markup}</div>
            </div>
        </div>
    );
}

export default Preview;
