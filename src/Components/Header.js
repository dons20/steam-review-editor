import React from "react";
import classes from "./header.module.scss";

function Header() {
    return (
        <header className={classes.main}>
            <a
                href="https://github.com/dons20/Steam-Review-Editor"
                rel="noopener noreferrer"
                target="_blank"
            >
                <img
                    className={classes.banner}
                    src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67"
                    alt="Fork me on GitHub"
                    data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"
                />
            </a>
            <div className={classes.title}>Steam Review Editor</div>
        </header>
    );
}

export default Header;
