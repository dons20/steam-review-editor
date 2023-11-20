import React, { Suspense, useState } from "react";
import { Header, Content, Footer } from "./Components";
import useEnableHover from "./Util/useEnableHover";
import { toast, Flip } from "react-toastify";
import Modal from "react-modal";

/** Styling */
import classes from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/general.scss";

/** Configuration */
Modal.setAppElement("#root");

function App() {
  const [showModal, setShowModal] = useState(false);
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

  /** Closes the modal */
  function closeModal() {
    setShowModal(false);
  }

  return (
    <div className={classes.root}>
      <Modal
        isOpen={showModal}
        className={{ base: classes.modal, afterOpen: classes.afterOpen, beforeClose: classes.beforeClose }}
        overlayClassName={{
          base: classes.modalOverlay,
          afterOpen: classes.afterOpen,
          beforeClose: classes.beforeClose,
        }}
        closeTimeoutMS={300}
        onRequestClose={closeModal}
        shouldReturnFocusAfterClose={false}
      >
        <button className={classes.close} onClick={closeModal} type="button">
          X
        </button>
      </Modal>
      <Header />
      <Suspense fallback={<div>Editor is now loading...</div>}>
        <Content notify={notify} />
      </Suspense>
      <Footer showModal={setShowModal} />
    </div>
  );
}

export default App;
