import React, { Suspense } from "react";
import { Header, Content, Footer } from "./components";
import useEnableHover from "./util/useEnableHover";
import { toast, Flip } from "react-toastify";

/** Styling */
import classes from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/general.scss";

function App() {
  useEnableHover();

  /**
   * Creates a success notification
   * @param {String} text
   */
  const notify = text => {
    toast.success(text, {
      autoClose: 2500,
      className: classes.toast,
      position: "bottom-right",
      toastId: "SRE_success",
      transition: Flip,
    });
  };

  return (
    <div className={classes.root}>
      <Header />
      <Suspense fallback={<div>Editor is now loading...</div>}>
        <Content notify={notify} />
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
