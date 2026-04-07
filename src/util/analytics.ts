type GoatCounterPayload = {
  path: string;
  title?: string;
  referrer?: string;
  event?: boolean;
};

const MAX_FLUSH_ATTEMPTS = 20;
const SESSION_KEY = "goatcounter:tracked-events";
const pendingEvents: Array<Omit<GoatCounterPayload, "event">> = [];
const trackedThisSession = new Set<string>();

let flushTimer: number | null = null;
let flushAttempts = 0;
let sessionLoaded = false;

function normalizeEventName(name: string): string {
  return name.trim().replace(/^\/+/, "").replace(/\s+/g, "-").toLowerCase();
}

function getCounter(): ((payload: GoatCounterPayload) => void) | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return typeof window.goatcounter?.count === "function" ? window.goatcounter.count : undefined;
}

function loadTrackedSessionEvents() {
  if (sessionLoaded || typeof window === "undefined") {
    return;
  }

  sessionLoaded = true;

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return;
    }

    const names = JSON.parse(raw) as string[];
    names.forEach((name) => trackedThisSession.add(name));
  } catch {
    // ignore storage access issues
  }
}

function persistTrackedSessionEvents() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify([...trackedThisSession]));
  } catch {
  }
}

function flushPendingEvents() {
  const count = getCounter();
  if (!count) {
    return false;
  }

  while (pendingEvents.length > 0) {
    const payload = pendingEvents.shift();
    if (!payload) {
      continue;
    }

    count({ ...payload, event: true });
  }

  return true;
}

function scheduleFlush() {
  if (typeof window === "undefined") {
    return;
  }

  if (flushPendingEvents()) {
    flushAttempts = 0;
    return;
  }

  if (flushTimer !== null || flushAttempts >= MAX_FLUSH_ATTEMPTS) {
    return;
  }

  flushAttempts += 1;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    if (flushPendingEvents()) {
      flushAttempts = 0;
      return;
    }

    scheduleFlush();
  }, 250);
}

export function trackEvent(name: string, title?: string) {
  const path = normalizeEventName(name);
  if (!path) {
    return;
  }

  const payload = title ? { path, title } : { path };
  const count = getCounter();

  if (import.meta.env.DEV) {
    console.debug("[analytics]", { ...payload, event: true });
  }

  if (count) {
    count({ ...payload, event: true });
    return;
  }

  pendingEvents.push(payload);
  scheduleFlush();
}

export function trackOncePerSession(name: string, title?: string) {
  loadTrackedSessionEvents();

  const path = normalizeEventName(name);
  if (!path || trackedThisSession.has(path)) {
    return;
  }

  trackedThisSession.add(path);
  persistTrackedSessionEvents();
  trackEvent(path, title);
}

export function trackError(area: string, reason: string, title?: string) {
  const safeArea = normalizeEventName(area);
  const safeReason = normalizeEventName(reason);
  const eventName = ["quality", safeArea, safeReason].filter(Boolean).join("-");

  trackEvent(eventName, title);
}
