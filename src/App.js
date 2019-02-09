import React, { Component } from "react";
import classes from "./App.module.scss";
import Header from "./Components/Header";
import Content from "./Components/Content";
import Footer from "./Components/Footer";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
    faListAlt,
    faQuestionCircle,
    faTimesCircle
} from "@fortawesome/free-regular-svg-icons";

library.add(fab, faListAlt, faQuestionCircle, faTimesCircle);

class App extends Component {
    render() {
        return (
            <div className={classes.root}>
                <Header />
                <Content />
                <Footer />
            </div>
        );
    }
}

export default App;
