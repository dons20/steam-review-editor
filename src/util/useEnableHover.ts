import { useEffect } from "react";

/**
 * Attaches a listener to the document to
 * enable/disable styles related to mouse usage
 */
function useEnableHover() {
  useEffect(() => {
    function watchForHover() {
      let container = document.body;
      let hasHoverClass = false;
      let date = new Date();

      /** @type {Date} */
      let lastTouchTime = null;

      /** Enables styles related to mouse usage */
      function enableHover() {
        // discard emulated mouseMove events coming from touch events
        if (date?.getTime() - lastTouchTime?.getTime() < 300) return;
        if (hasHoverClass) return;

        container.classList.add("enableHover");
        hasHoverClass = true;
      }

      /** Disables styles related to mouse usage */
      function disableHover() {
        if (!hasHoverClass) return;

        container.classList.remove("enableHover");
        hasHoverClass = false;
      }

      /** Stores the last update timestamp when called */
      function updateLastTouchTime() {
        lastTouchTime = new Date();
      }

      document.addEventListener("touchstart", updateLastTouchTime, true);
      document.addEventListener("touchstart", disableHover, true);
      document.addEventListener("mousemove", enableHover, true);

      enableHover();
    }

    watchForHover();
  }, []);
}

export default useEnableHover;
