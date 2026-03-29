import React from "react";
import { Shuffle, X } from "lucide-react";
import { useModalTheme } from "../../util/ThemeContext";
import "./previewSettingsModal.scss";

export interface PreviewSettings {
  username: string;
  productsInAccount: number;
  numReviews: number;
  isRecommended: boolean;
  hoursOnRecord: number;
  hoursAtReview: number;
  datePosted: string;
}

interface PreviewSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
  onRandomize: () => void;
}

const randomize = (max = 1) => Math.random() * max;

export function PreviewSettingsModal({ isOpen, onClose, settings, onChange, onRandomize }: PreviewSettingsModalProps) {
  const { modalTheme } = useModalTheme();
  if (!isOpen) return null;

  const handleChange = <K extends keyof PreviewSettings>(key: K, value: PreviewSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const randomizeHours = () => {
    const hoursOnRecord = parseFloat((randomize(900) + 0.1).toFixed(1));
    const hoursAtReview = parseFloat(randomize(hoursOnRecord).toFixed(1));
    onChange({ ...settings, hoursOnRecord, hoursAtReview });
  };

  return (
    <div className="preview-settings-overlay" data-theme={modalTheme} onClick={onClose}>
      <div className="preview-settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Preview Settings</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-title">Reviewer Profile</h3>
            <div className="field-group">
              <label className="field-label" htmlFor="ps-username">
                Username
              </label>
              <input
                id="ps-username"
                type="text"
                className="field-input"
                value={settings.username}
                onChange={e => handleChange("username", e.target.value)}
                placeholder="Your Username"
              />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label" htmlFor="ps-products">
                  Games
                </label>
                <input
                  id="ps-products"
                  type="number"
                  className="field-input"
                  value={settings.productsInAccount}
                  onChange={e => handleChange("productsInAccount", parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="ps-reviews">
                  Number of Reviews
                </label>
                <input
                  id="ps-reviews"
                  type="number"
                  className="field-input"
                  value={settings.numReviews}
                  onChange={e => handleChange("numReviews", parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="section-title">Review Details</h3>

            <div className="field-group">
              <label className="field-label">Recommendation</label>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${settings.isRecommended ? "active recommended" : ""}`}
                  onClick={() => handleChange("isRecommended", true)}
                >
                  👍 Recommended
                </button>
                <button
                  className={`toggle-btn ${!settings.isRecommended ? "active not-recommended" : ""}`}
                  onClick={() => handleChange("isRecommended", false)}
                >
                  👎 Not Recommended
                </button>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Hours</label>
              <div className="hours-row">
                <div className="field-group flex-1">
                  <label className="field-sublabel" htmlFor="ps-hours-on-record">
                    Hours on Record
                  </label>
                  <input
                    id="ps-hours-on-record"
                    type="number"
                    className="field-input"
                    value={settings.hoursOnRecord}
                    step="0.1"
                    min={0}
                    onChange={e => handleChange("hoursOnRecord", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="field-group flex-1">
                  <label className="field-sublabel" htmlFor="ps-hours-at-review">
                    Hours at Review Time
                  </label>
                  <input
                    id="ps-hours-at-review"
                    type="number"
                    className="field-input"
                    value={settings.hoursAtReview}
                    step="0.1"
                    min={0}
                    onChange={e => handleChange("hoursAtReview", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <button
                  className="icon-btn randomize-hours-btn"
                  onClick={randomizeHours}
                  title="Randomize hours"
                  aria-label="Randomize hours"
                >
                  <Shuffle size={16} />
                </button>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="ps-date-posted">
                Date Posted
              </label>
              <input
                id="ps-date-posted"
                type="date"
                className="field-input date-input"
                value={settings.datePosted}
                onChange={e => handleChange("datePosted", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="randomize-all-btn" onClick={onRandomize}>
            <Shuffle size={16} />
            Randomize All
          </button>
          <button className="done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
