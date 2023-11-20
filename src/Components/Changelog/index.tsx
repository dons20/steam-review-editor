import React from "react";
import classes from "./modal.module.scss";

function Modal(props) {
  return (
    <div className={classes.root} role="dialog" aria-labelledby="dialogTitle" aria-describedby="dialogDescription">
      <div className={classes.main} id="dialogTitle">
        Modal
      </div>
    </div>
  );
}

export default Modal;
