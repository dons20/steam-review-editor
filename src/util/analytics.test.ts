import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent, trackOncePerSession, trackError } from "./analytics";

describe("analytics helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    delete window.goatcounter;
  });

  it("sends GoatCounter-compatible event payloads", () => {
    const count = vi.fn();
    window.goatcounter = { count };

    trackEvent("/core-app-opened", "App opened");

    expect(count).toHaveBeenCalledWith({
      path: "core-app-opened",
      title: "App opened",
      event: true,
    });
  });

  it("queues events until GoatCounter is ready", () => {
    trackEvent("editor-loaded");

    const count = vi.fn();
    window.goatcounter = { count };
    vi.runAllTimers();

    expect(count).toHaveBeenCalledWith({
      path: "editor-loaded",
      event: true,
    });
  });

  it("only tracks one-time events once per session", () => {
    const count = vi.fn();
    window.goatcounter = { count };

    trackOncePerSession("funnel-review-started");
    trackOncePerSession("funnel-review-started");

    expect(count).toHaveBeenCalledTimes(1);
  });

  it("sanitizes error events into stable names", () => {
    const count = vi.fn();
    window.goatcounter = { count };

    trackError("clipboard", "failed copy");

    expect(count).toHaveBeenCalledWith({
      path: "quality-clipboard-failed-copy",
      event: true,
    });
  });
});
