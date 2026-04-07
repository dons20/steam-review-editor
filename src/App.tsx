import React, { Suspense, useEffect, useRef } from "react";
import { Header, Footer, ProgressiveBackground } from "./components";
import useEnableHover from "./util/useEnableHover";
import { toast, Flip, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./util/ThemeContext";
import { PWA_EVENTS, PwaUpdateDetail } from "./util/pwaEvents";
import { trackEvent } from "./util/analytics";

/** Lazy-loaded: splits the entire TipTap editor stack out of the initial bundle */
const Content = React.lazy(() => import("./components/Content"));

/** Styling */
import classes from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";

const UPDATE_TOAST_ID = "SRE_pwa_update";
const OFFLINE_READY_TOAST_ID = "SRE_pwa_offline_ready";
const OFFLINE_STATUS_TOAST_ID = "SRE_network_offline";
const ONLINE_STATUS_TOAST_ID = "SRE_network_online";
const INSTALL_TOAST_ID = "SRE_pwa_install";
const INSTALL_PROMPT_HIDE_UNTIL_KEY = "SRE_pwa_install_hide_until";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type NotifyOptions = {
  actionLabel?: string;
  autoClose?: number | false;
  closeOnClick?: boolean;
  onClose?: () => void;
  onAction?: () => void | Promise<void>;
  toastId?: string;
  type?: "info" | "success";
};

function App() {
  useEnableHover();
  const hasReloadedOnControllerChange = useRef(false);
  const deferredInstallPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  /**
   * Creates a success notification
   * @param {String} text
   */
  const notify = (text: string, options: NotifyOptions = {}) => {
    const toastFn = options.type === "info" ? toast.info : toast.success;
    const message = options.onAction ? (
      <div className={classes.pwaToastBody}>
        <span className={classes.pwaToastText}>{text}</span>
        <div className={classes.pwaToastActions}>
          <button
            className={classes.pwaToastAction}
            onClick={() => {
              void options.onAction?.();
            }}
            type="button"
          >
            {options.actionLabel ?? "Action"}
          </button>
        </div>
      </div>
    ) : (
      text
    );

    toastFn(message, {
      autoClose: options.autoClose ?? 2500,
      className: classes.toast,
      closeOnClick: options.closeOnClick ?? true,
      onClose: options.onClose,
      position: "bottom-right",
      toastId: options.toastId ?? "SRE_success",
      transition: Flip,
    });
  };

  const shouldHideInstallPrompt = () => {
    try {
      const hideUntilRaw = localStorage.getItem(INSTALL_PROMPT_HIDE_UNTIL_KEY);
      if (!hideUntilRaw) {
        return false;
      }

      const hideUntil = Number(hideUntilRaw);
      if (!Number.isFinite(hideUntil)) {
        localStorage.removeItem(INSTALL_PROMPT_HIDE_UNTIL_KEY);
        return false;
      }

      if (Date.now() < hideUntil) {
        return true;
      }

      localStorage.removeItem(INSTALL_PROMPT_HIDE_UNTIL_KEY);
      return false;
    } catch {
      return false;
    }
  };

  const suppressInstallPromptForThirtyDays = () => {
    try {
      localStorage.setItem(INSTALL_PROMPT_HIDE_UNTIL_KEY, String(Date.now() + THIRTY_DAYS_MS));
    } catch {
      // Ignore storage errors and keep default prompt behavior.
    }
  };

  useEffect(() => {
    const onOfflineReady = () => {
      toast.success("Ready for offline use.", {
        autoClose: 3500,
        position: "bottom-right",
        toastId: OFFLINE_READY_TOAST_ID,
        transition: Flip,
      });
      trackEvent("pwa-offline-ready");
    };

    const onUpdateAvailable = (event: Event) => {
      const customEvent = event as CustomEvent<PwaUpdateDetail>;
      const registration = customEvent.detail?.registration;
      if (!registration) {
        return;
      }

      const applyUpdate = () => {
        if (!registration.waiting) {
          return;
        }

        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        trackEvent("pwa-update-reload-clicked");
      };

      toast.info(
        <div className={classes.pwaToastBody}>
          <span className={classes.pwaToastText}>New version available.</span>
          <div className={classes.pwaToastActions}>
            <button className={classes.pwaToastAction} onClick={applyUpdate} type="button">
              Reload
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
          position: "bottom-right",
          toastId: UPDATE_TOAST_ID,
          transition: Flip,
        }
      );
      trackEvent("pwa-update-available");
    };

    const onControllerChange = () => {
      if (hasReloadedOnControllerChange.current) {
        return;
      }

      hasReloadedOnControllerChange.current = true;
      window.location.reload();
    };

    const onOffline = () => {
      toast.warn("You are offline. Existing features remain available.", {
        autoClose: 3000,
        position: "bottom-right",
        toastId: OFFLINE_STATUS_TOAST_ID,
        transition: Flip,
      });
      trackEvent("pwa-network-offline");
    };

    const onOnline = () => {
      toast.success("Back online.", {
        autoClose: 1800,
        position: "bottom-right",
        toastId: ONLINE_STATUS_TOAST_ID,
        transition: Flip,
      });
      trackEvent("pwa-network-online");
    };

    const onBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      event.preventDefault();
      deferredInstallPrompt.current = promptEvent;

      if (shouldHideInstallPrompt()) {
        trackEvent("pwa-install-prompt-suppressed");
        return;
      }

      let hasAttemptedInstall = false;

      const installApp = async () => {
        if (!deferredInstallPrompt.current) {
          notify("Install option is not available on this device/browser.", {
            autoClose: 3500,
            toastId: INSTALL_TOAST_ID,
            type: "info",
          });
          trackEvent("pwa-install-not-available");
          return;
        }

        hasAttemptedInstall = true;
        await deferredInstallPrompt.current.prompt();
        const choice = await deferredInstallPrompt.current.userChoice;
        deferredInstallPrompt.current = null;
        trackEvent(`pwa-install-${choice.outcome}`);

        if (choice.outcome === "accepted") {
          toast.dismiss(INSTALL_TOAST_ID);
        }
      };

      notify("Install Steam Review Editor for offline access.", {
        actionLabel: "Install",
        autoClose: false,
        closeOnClick: false,
        onClose: () => {
          if (hasAttemptedInstall) {
            return;
          }

          suppressInstallPromptForThirtyDays();
          trackEvent("pwa-install-toast-dismissed");
        },
        onAction: installApp,
        toastId: INSTALL_TOAST_ID,
        type: "info",
      });
      trackEvent("pwa-install-prompt-ready");
    };

    window.addEventListener(PWA_EVENTS.OFFLINE_READY, onOfflineReady);
    window.addEventListener(PWA_EVENTS.UPDATE_AVAILABLE, onUpdateAvailable as EventListener);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    navigator.serviceWorker?.addEventListener("controllerchange", onControllerChange);

    return () => {
      window.removeEventListener(PWA_EVENTS.OFFLINE_READY, onOfflineReady);
      window.removeEventListener(PWA_EVENTS.UPDATE_AVAILABLE, onUpdateAvailable as EventListener);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
      navigator.serviceWorker?.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

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
