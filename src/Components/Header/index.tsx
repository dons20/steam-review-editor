import React from "react";
import classes from "./header.module.scss";

function Header() {
  return (
    <header className={classes.main}>
      <div className={classes.title}>Steam Review Editor</div>
    </header>
  );
}

export default Header;
