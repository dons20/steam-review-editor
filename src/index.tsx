import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { applyBackdropFilterCapabilityClass } from "./util/backdropFilterSupport";
import { dispatchPwaOfflineReady, dispatchPwaUpdateAvailable } from "./util/pwaEvents";
import "./index.scss";

applyBackdropFilterCapabilityClass();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

serviceWorker.register({
  onSuccess: () => {
    dispatchPwaOfflineReady();
  },
  onUpdate: registration => {
    dispatchPwaUpdateAvailable(registration);
  },
});
