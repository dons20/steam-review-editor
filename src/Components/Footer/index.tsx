import React from "react";
import classes from "./footer.module.scss";
import { FaClipboardList, FaSquareGithub, FaSquareTwitter } from "react-icons/fa6";

function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer className={classes.root}>
      <div className={classes.iconRow}>
        <a
          className="tooltip"
          href="http://twitter.com/kcinnovations"
          target="_none"
          data-tooltip="Twitter"
          rel="noopener noreferrer"
        >
          <FaSquareTwitter size="36" className={classes.icon} />
        </a>
        <a
          className="tooltip"
          href="https://github.com/dons20/Steam-Review-Editor"
          target="_none"
          data-tooltip="GitHub"
          rel="noopener noreferrer"
        >
          <FaSquareGithub size="36" className={classes.icon} />
        </a>
        <a
          className="tooltip"
          href="https://github.com/dons20/steam-review-editor/releases"
          target="_blank"
          data-tooltip="Changelog"
          rel="noopener noreferrer"
        >
          <FaClipboardList size="36" className={classes.icon} />
        </a>
      </div>
      <p>
        Copyright &copy; {date} | Keno Clayton.
        <br />
        Licensed under the
        <a href="https://github.com/dons20/steam-review-editor/LICENSE">{" Blue Oak License."}</a>
        <br />
        This website is <strong>not</strong> associated with Valve Corporation
      </p>
    </footer>
  );
}

export default Footer;
