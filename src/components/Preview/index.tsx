import React, { useState, useContext, useEffect, useRef } from "react";
import { User, Settings, Shuffle } from "lucide-react";
import { IconRecommended, IconNotRecommended, IconStar } from "components/Icons";
import { trackError, trackEvent } from "util/analytics";
import { AppContext } from "../Content";
import type { PreviewSettings } from "./PreviewSettingsModal";
import { randomizeSettings } from "./previewUtils";

/** Lazy-loaded: only fetched when user opens the settings modal */
const PreviewSettingsModal = React.lazy(() =>
  import("./PreviewSettingsModal").then(m => ({ default: m.PreviewSettingsModal }))
);

import "./preview.scss";

const Markup = React.lazy(() => import("./Markup"));

const months = [
  "JANUARY",
  "FEBUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

const LS_KEY = "steam-preview-settings";

function loadSettings(): PreviewSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as PreviewSettings;
  } catch {
    trackError("localstorage", "preview-settings-parse-error", "Preview settings could not be restored");
  }
  return randomizeSettings();
}

function Preview({ markupRef, visible }: { markupRef: React.RefObject<any>; visible: boolean }) {
  const { previewContent, markup } = useContext(AppContext);

  const [settings, setSettings] = useState<PreviewSettings>(loadSettings);
  const [modalOpen, setModalOpen] = useState(false);
  const hasPersistedInitialSettings = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));

      if (hasPersistedInitialSettings.current) {
        trackEvent("preview-used", "Preview settings updated");
      } else {
        hasPersistedInitialSettings.current = true;
      }
    } catch {
      trackError("localstorage", "preview-settings-save-error", "Unable to save preview settings");
    }
  }, [settings]);

  const handleRandomize = () => {
    trackEvent("preview-used", "Preview randomized");
    setSettings(randomizeSettings());
  };

  return (
    <div className={`preview ${visible ? "" : "hidden"}`}>
      <div className="store">
        <div className="heading-row">
          <h1 className="heading">Store Preview</h1>
          <div className="heading-actions">
            <div className="tooltip-wrapper">
              <button className="preview-action-btn" onClick={handleRandomize} aria-label="Randomize preview">
                <Shuffle size={15} />
              </button>
              <span className="action-tooltip">Randomize</span>
            </div>
            <div className="tooltip-wrapper">
              <button
                className="preview-action-btn"
                onClick={() => {
                  trackEvent("preview-used", "Preview settings opened");
                  setModalOpen(true);
                }}
                aria-label="Preview settings"
              >
                <Settings size={15} />
              </button>
              <span className="action-tooltip">Preview Settings</span>
            </div>
          </div>
        </div>
        <div className="body">
          <div className="profile">
            <div className="avatar-container">
              <User size={18} />
            </div>
            <div className="details">
              <p className="username">{settings.username}</p>
              <p className="sampleDetail">{settings.productsInAccount} games</p>
              <p className="sampleDetail">{settings.numReviews} reviews</p>
            </div>
          </div>
          <div className="rightColumn">
            <div className="stats">
              {settings.isRecommended ? (
                <IconRecommended width={40} height={40} />
              ) : (
                <IconNotRecommended width={40} height={40} />
              )}
              <div>
                <span className="recTitle">{settings.isRecommended ? "Recommended" : "Not Recommended"}</span>
                <span className="subtext">
                  {settings.hoursOnRecord.toFixed(1)} hrs on record ({settings.hoursAtReview.toFixed(1)} hrs at review
                  time)
                </span>
              </div>
              <div className="middle">
                <IconStar width={16} height={16} display="block" />
              </div>
            </div>
            <div className="content">
              <p className="datePosted">POSTED: {formatDate(settings.datePosted)}</p>
              {previewContent && <div dangerouslySetInnerHTML={{ __html: previewContent }} />}
            </div>
          </div>
        </div>
      </div>
      <div className="markup">
        <h1 className="heading" style={{ marginBottom: 10 }}>
          Markup Preview
        </h1>
        <pre className="markupBody" ref={markupRef}>
          {markup ? (
            <React.Suspense fallback={<>Loading...</>}>{<Markup value={markup} />}</React.Suspense>
          ) : (
            <div className="empty-preview-message">
              <p>Start typing in the editor to see your Steam BBCode markup here.</p>
              <p className="hint">This is the text you'll copy and paste into your Steam review.</p>
            </div>
          )}
        </pre>
      </div>

      <React.Suspense fallback={null}>
        <PreviewSettingsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          settings={settings}
          onChange={setSettings}
          onRandomize={() => {
            trackEvent("preview-used", "Preview randomized from settings");
            setSettings(randomizeSettings());
          }}
        />
      </React.Suspense>
    </div>
  );
}

export default Preview;
