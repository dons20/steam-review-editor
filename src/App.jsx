import React, { Suspense, useState } from "react";
import { Header, Modal, Content, Footer } from "./Components";
import { toast } from "react-toastify";
import useEnableHover from "./Util/useEnableHover";

import classes from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/general.scss";

toast.configure();

function App() {
    const [showModal, setShowModal] = useState(false);
    useEnableHover();

    const notify = (text) => {
        toast.success(text, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: classes.toast,
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
