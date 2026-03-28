import React, { Suspense } from "react";
import { Header, Content, Footer } from "./components";
import useEnableHover from "./util/useEnableHover";
import { toast, Flip, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./util/ThemeContext";

/** Styling */
import classes from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";

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
    <ThemeProvider>
      <div className={classes.root}>
        <Header />
        <Suspense fallback={<div>Editor is now loading...</div>}>
          <Content notify={notify} />
        </Suspense>
        <Footer />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
