import React, { Component } from "react";
import classes from "./app.module.scss";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

library.add(fab, faQuestionCircle);

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
