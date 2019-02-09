import React from "react";
import classes from "./footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
    const date = new Date().getFullYear();

    return (
        <footer className={classes.root}>
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
                        icon={["far", "list-alt"]}
                        size={"3x"}
                        className={classes.icon}
                    />
                </a>
            </div>
            <p>
                Copyright &copy; {date} | Keno Clayton, Licensed under the{" "}
                <a href="https://github.com/dons20/steam-review-editor/blob/gh-pages/LICENSE">
                    MIT License
                </a>
                <br />
                This website is <strong>not</strong> associated with Valve
                Corporation
            </p>
        </footer>
    );
}

export default Footer;
