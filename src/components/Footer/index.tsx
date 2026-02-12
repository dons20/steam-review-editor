import React from "react";
import classes from "./footer.module.scss";
import IconStack from "components/IconStack";
import Tooltip from "components/Tooltip";
import { IconBrandGithub, IconClipboardList, IconBrandX, IconCircle } from "components/Icons";

function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer className={classes.root}>
      <div className={classes.iconRow}>
        <Tooltip content="X / Twitter" position="top">
          <a href="http://twitter.com/kcinnovations" target="_none" rel="noopener noreferrer">
            <IconBrandX width={48} height={48} className={classes.icon} />
          </a>
        </Tooltip>
        <Tooltip content="GitHub" position="top">
          <a href="https://github.com/dons20/Steam-Review-Editor" target="_none" rel="noopener noreferrer">
            <IconStack
              size={48}
              layers={[
                { Icon: IconCircle, scale: 1 },
                { Icon: IconBrandGithub, scale: 0.6 },
              ]}
              className={classes.icon}
            />
          </a>
        </Tooltip>
        <Tooltip content="Changelog" position="top">
          <a href="https://github.com/dons20/steam-review-editor/releases" target="_blank" rel="noopener noreferrer">
            <IconClipboardList width={48} height={48} className={classes.icon} />
          </a>
        </Tooltip>
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
