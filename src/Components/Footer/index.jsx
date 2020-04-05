import React from "react";
import classes from "./footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer({ showModal }) {
    const date = new Date().getFullYear();

    return (
        <footer className={classes.root}>
            <div className={classes.iconRow}>
                <a
                    className="tooltip"
                    href="http://twitter.com/kcinnovations"
                    target="_none"
                    data-title="Twitter"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon icon={["fab", "twitter-square"]} size={"3x"} className={classes.icon} />
                </a>
                <a
                    className="tooltip"
                    href="https://github.com/dons20/Steam-Review-Editor"
                    target="_none"
                    data-title="GitHub"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon icon={["fab", "github-square"]} size={"3x"} className={classes.icon} />
                </a>
                <button
                    type="button"
                    className="tooltip"
                    onClick={() => showModal(true)}
                    data-toggle="modal"
                    data-title="Changelog"
                >
                    <FontAwesomeIcon icon={["far", "list-alt"]} size={"3x"} className={classes.icon} />
                </button>
            </div>
            <p>
                Copyright &copy; {date} | Keno Clayton, Licensed under the{" "}
                <a href="https://github.com/dons20/steam-review-editor/blob/gh-pages/LICENSE">MIT License</a>
                <br />
                This website is <strong>not</strong> associated with Valve Corporation
            </p>
        </footer>
    );
}

export default Footer;
