import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitterSquare, faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { faListAlt, faTimesCircle, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import {
    faHeading,
    faBold,
    faUnderline,
    faItalic,
    faStrikethrough,
    faEyeSlash,
    faCode,
    faLink,
    faListOl,
    faListUl,
    faComment,
    faQuoteLeft,
    faTable,
    faSpinner,
    faBan,
    faImage,
    faSquare,
    faQuestion
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faTwitterSquare,
    faGithubSquare,
    faHeading,
    faBold,
    faBan,
    faImage,
    faUnderline,
    faItalic,
    faStrikethrough,
    faEyeSlash,
    faCode,
    faLink,
    faListOl,
    faListUl,
    faComment,
    faQuoteLeft,
    faTable,
    faSpinner,
    faListAlt,
    faSquare,
    faQuestion,
    faQuestionCircle,
    faTimesCircle
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
