import React, { Suspense } from "react";
import { Header, Footer, ProgressiveBackground } from "./components";
import useEnableHover from "./util/useEnableHover";
import { toast, Flip, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./util/ThemeContext";

/** Lazy-loaded: splits the entire TipTap editor stack out of the initial bundle */
const Content = React.lazy(() => import("./components/Content"));

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
        <ProgressiveBackground />
        <Header />
        <Suspense
          fallback={
            <div className={classes.skeleton}>
              <div className={classes.skeletonBar} />
              <div className={classes.skeletonEditor} />
              <div className={classes.skeletonButtons}>
                <div className={classes.skeletonBtn} />
                <div className={classes.skeletonBtn} />
              </div>
            </div>
          }
        >
          <Content notify={notify} />
        </Suspense>
        <Footer />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
