import React, { useState, useContext } from "react";
import { Square, CircleHelp } from "lucide-react";
import notRec from "assets/img/thumbsDown.png";
import rec from "assets/img/thumbsUp.png";
import { AppContext } from "../Content";

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
 */
const randomize = (max = 1) => {
  return parseInt((Math.random() * Math.floor(max)).toFixed(1));
};

let rand = randomize(51);

/**
 * @param {Object} props
 */
function Preview({ markupRef, visible }: { markupRef: React.RefObject<any>; visible: boolean }) {
  const [isRecommended, setIsRecommended] = useState(true);
  const { previewContent, markup } = useContext(AppContext);

  /** Flips between Recommended/Not Recommended and randomizes hours */
  const setReview = () => {
    setIsRecommended(!isRecommended);
    rand = randomize(51);
  };

  return (
    <div className={`preview ${visible ? "" : "hidden"}`}>
      <div className="store">
        <h1 className="heading">Store Preview</h1>
        <div className="body">
          <div className="profile">
            <span className="fa-layers fa-fw">
              <Square size={32} color="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.2)" />
              <CircleHelp size={16} />
            </span>
            <div className="details">
              <p className="username">Your Username</p>
              <p className="sampleDetail">{0} products in account</p>
              <p className="sampleDetail">{0} reviews</p>
            </div>
          </div>
          <div className="stats" onClick={setReview}>
            <img src={isRecommended ? rec : notRec} alt={isRecommended ? "Recommended" : "Not Recommended"} />
            <div>
              <span className="recTitle">{isRecommended ? "Recommended" : "Not Recommended"}</span>
              <span className="subtext">
                {rand} hrs on record ({rand} hrs at review time)
              </span>
            </div>
            <div className="middle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-label="Steam Logo">
                <path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.328 2.865ZM7.83 1.417a6.593 6.593 0 0 1 6.58 6.583c0 3.63-2.95 6.583-6.58 6.583a6.59 6.59 0 0 1-6.3-4.665l1.756.734c.072.835.588 1.573 1.404 1.922a2.494 2.494 0 0 0 3.266-1.218 2.495 2.495 0 0 0-1.218-3.266l-1.826-.764a3.24 3.24 0 0 1 3.92-1.148 3.24 3.24 0 0 1 1.67 1.854 3.24 3.24 0 0 1-.115 2.496 3.24 3.24 0 0 1-1.854 1.67 3.24 3.24 0 0 1-2.155.069L4.2 11.724a6.568 6.568 0 0 1-.484-2.545c0-3.63 2.951-6.583 6.582-6.583l-.469.221Z" />
              </svg>
            </div>
          </div>
          <div className="content">
            <p className="subtext">
              POSTED: {date.getDate()} {months[date.getMonth()]}
            </p>
            {previewContent && <div dangerouslySetInnerHTML={{ __html: previewContent }} />}
          </div>
        </div>
      </div>
      <div className="markup">
        <h1 className="heading">Markup Preview</h1>
        <pre className="markupBody" ref={markupRef}>
          {markup ? (
            <React.Suspense fallback={<>Loading...</>}>{<Markup value={markup} />}</React.Suspense>
          ) : (
            <div className="empty-preview-message">
              <p>Start typing in the editor to see your Steam BBCode markup here.</p>
              <p className="hint">This is the text you'll copy and paste into your Steam review.</p>
            </div>
          )}
        </pre>
      </div>
    </div>
  );
}

export default Preview;
