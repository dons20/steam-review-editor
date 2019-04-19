import React, { Suspense, useState } from "react";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import Modal from "./Components/Modal";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

toast.configure();

function App() {
    const [showModal, setShowModal] = useState(false);

    const notify = text => {
        toast.success(text, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: classes.toast
        });
    };

    return (
        <div className={classes.root}>
            <Header />
            {showModal && <Modal />}
            <Suspense fallback={<div>Editor is now loading...</div>}>
                <Content notify={notify} />
            </Suspense>
            <Footer showModal={setShowModal} />
        </div>
    );
}

export default App;
