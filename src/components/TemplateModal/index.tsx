import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useModalTheme } from "../../util/ThemeContext";
import { TEMPLATES, type Template } from "./templates";
import "./template-modal.scss";

interface TemplateModalProps {
  open: boolean;
  hasContent: boolean;
  onClose: () => void;
  onInsert: (template: Template) => void;
}

function TemplateModal({ open, hasContent, onClose, onInsert }: TemplateModalProps) {
  const { modalTheme } = useModalTheme();
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);

  if (!open) return null;

  const handleCardClick = (template: Template) => {
    if (hasContent) {
      setPendingTemplate(template);
    } else {
      onInsert(template);
    }
  };

  const handleClose = () => {
    setPendingTemplate(null);
    onClose();
  };

  const handleConfirm = () => {
    if (pendingTemplate) {
      onInsert(pendingTemplate);
      setPendingTemplate(null);
    }
  };

  const handleCancelConfirm = () => {
    setPendingTemplate(null);
  };

  return (
    <div className="tm-overlay" data-theme={modalTheme} onClick={handleClose}>
      <div className="tm-modal" onClick={e => e.stopPropagation()}>
        <div className="tm-modal__header">
          <h2 className="tm-modal__title">Templates</h2>
          <button className="tm-modal__close" onClick={handleClose} aria-label="Close templates">
            <X size={20} />
          </button>
        </div>

        <div className="tm-modal__body">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              className={`tm-card${pendingTemplate?.id === template.id ? " tm-card--pending" : ""}`}
              onClick={() => handleCardClick(template)}
              type="button"
            >
              <span className="tm-card__label">{template.label}</span>
              <span className="tm-card__desc">{template.description}</span>
            </button>
          ))}
        </div>

        {pendingTemplate && (
          <div className="tm-modal__confirm">
            <div className="tm-confirm__message">
              <AlertTriangle size={15} className="tm-confirm__icon" />
              <span>
                This will replace your current content with the <strong>{pendingTemplate.label}</strong> template.
              </span>
            </div>
            <div className="tm-confirm__actions">
              <button type="button" className="tm-confirm__cancel" onClick={handleCancelConfirm}>
                Cancel
              </button>
              <button type="button" className="tm-confirm__ok" onClick={handleConfirm}>
                Replace Content
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateModal;
export type { TemplateModalProps };
