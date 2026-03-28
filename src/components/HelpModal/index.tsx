import React from "react";
import { X, FileText, ArrowLeftRight, Eye, Shuffle, Save } from "lucide-react";
import { useModalTheme } from "../../util/ThemeContext";
import "./help-modal.scss";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

function HelpModal({ open, onClose }: HelpModalProps) {
  const { modalTheme } = useModalTheme();
  if (!open) return null;

  return (
    <div className="help-modal-overlay" data-theme={modalTheme} onClick={onClose}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <div className="help-modal__header">
          <h2 className="help-modal__title">Guide</h2>
          <button className="help-modal__close" onClick={onClose} aria-label="Close guide">
            <X size={20} />
          </button>
        </div>

        <div className="help-modal__body">
          <section className="help-section">
            <div className="help-section__icon">
              <FileText size={22} />
            </div>
            <div className="help-section__content">
              <h3>Writing Your Review</h3>
              <p>
                Type your review in the editor using the rich text toolbar to apply formatting — bold, italic,
                underline, headings, lists, spoilers, and more. All formatting is automatically converted to Steam
                BBCode when you copy to clipboard.
              </p>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section__icon">
              <ArrowLeftRight size={22} />
            </div>
            <div className="help-section__content">
              <h3>Switching Modes</h3>
              <p>
                Use the <strong>Switch to Markup</strong> button in the editor bar to toggle between{" "}
                <strong>Rich Text</strong> mode (visual editor) and <strong>Markup</strong> mode (raw Steam BBCode).
                Edits in either mode are converted and synced when you switch back.
              </p>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section__icon">
              <Eye size={22} />
            </div>
            <div className="help-section__content">
              <h3>Store Preview</h3>
              <p>
                Click <strong>Show Preview</strong> to open a live Steam-styled preview of how your review will look on
                the store page. You can customize the preview details — username, hours played, recommendation status,
                and more — using the <strong>⚙ Preview Settings</strong> button in the preview header. All fields update
                the preview in real time.
              </p>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section__icon">
              <Shuffle size={22} />
            </div>
            <div className="help-section__content">
              <h3>Randomizing Preview Data</h3>
              <p>
                Hit the <Shuffle size={13} /> icon next to the settings button to instantly generate a random username,
                play hours, and other stats. You can also randomize individual fields inside Preview Settings for
                fine-grained control.
              </p>
            </div>
          </section>

          <section className="help-section">
            <div className="help-section__icon">
              <Save size={22} />
            </div>
            <div className="help-section__content">
              <h3>Auto-Save</h3>
              <p>
                Your review content is <strong>automatically saved</strong> to this device's browser storage as you type
                and will be restored the next time you visit. Content is saved <em>locally only</em>, nothing is sent to
                any server.
              </p>
            </div>
          </section>
        </div>

        <div className="help-modal__footer">
          <button className="help-modal__done-btn" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
