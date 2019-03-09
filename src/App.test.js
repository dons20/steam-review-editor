import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faListAlt, faQuestionCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";
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
    faImage
} from "@fortawesome/free-solid-svg-icons";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it("loads font-awesome icons to library", () => {
    library.add(
        fab,
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
        faQuestionCircle,
        faTimesCircle
    );
});
