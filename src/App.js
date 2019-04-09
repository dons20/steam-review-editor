import React, { Suspense } from "react";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
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

function App() {
    return (
        <div className={classes.root}>
            <Header />
            <Suspense fallback={<div>Editor is now loading...</div>}>
                <Content />
            </Suspense>
            <Footer />
        </div>
    );
}

export default App;
