export const PWA_EVENTS = {
  OFFLINE_READY: "sre:pwa-offline-ready",
  UPDATE_AVAILABLE: "sre:pwa-update-available",
} as const;

export type PwaUpdateDetail = {
  registration: ServiceWorkerRegistration;
};

export function dispatchPwaOfflineReady() {
  window.dispatchEvent(new Event(PWA_EVENTS.OFFLINE_READY));
}

export function dispatchPwaUpdateAvailable(registration: ServiceWorkerRegistration) {
  window.dispatchEvent(
    new CustomEvent<PwaUpdateDetail>(PWA_EVENTS.UPDATE_AVAILABLE, {
      detail: { registration },
    })
  );
}
