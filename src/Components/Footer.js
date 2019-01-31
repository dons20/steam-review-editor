import React from "react";
import classes from "./footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
    const date = new Date().getFullYear();

    return (
        <footer className={classes.footer}>
            <div className={classes.iconRow}>
                <a
                    className={classes.tooltip}
                    href="http://twitter.com/kcinnovations"
                    target="_none"
                    data-title="Twitter"
                >
                    <FontAwesomeIcon
                        icon={["fab", "twitter-square"]}
                        size={"3x"}
                        className={classes.icon}
                    />
                </a>
                <a
                    className={classes.tooltip}
                    href="#changelogModal"
                    role="button"
                    data-toggle="modal"
                    data-title="Changelog"
                >
                    <FontAwesomeIcon
                        icon={["far", "question-circle"]}
                        size={"3x"}
                        className={classes.icon}
                    />
                </a>
            </div>
            <p>
                Copyright &copy; {date} | Keno Clayton, Licensed under the{" "}
                <a href="http://www.apache.org/licenses/LICENSE-2.0.html">
                    Apache License, Version 2.0
                </a>
                <br />
                This website is <strong>not</strong> associated with Valve
                Corporation
            </p>
        </footer>
    );
}

export default Footer;
