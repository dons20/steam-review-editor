import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useModalTheme } from "../../util/ThemeContext";
import "./prompt-modal.scss";

interface PromptModalProps {
  open: boolean;
  title: string;
  defaultValue?: string;
  mode?: "prompt" | "confirm";
  confirmMessage?: string;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

function PromptModal({ open, title, defaultValue = "", mode = "prompt", confirmMessage, onClose, onSubmit }: PromptModalProps) {
  const { modalTheme } = useModalTheme();
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      if (mode === "prompt") {
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [open, defaultValue, mode]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="prompt-modal-overlay" data-theme={modalTheme} onClick={onClose}>
      <div className="prompt-modal" onClick={e => e.stopPropagation()}>
        <div className="prompt-modal__header">
          <h2 className="prompt-modal__title">{title}</h2>
          <button className="prompt-modal__close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="prompt-modal__body">
            {mode === "confirm" ? (
              <p className="prompt-modal__message">{confirmMessage}</p>
            ) : (
              <input
                ref={inputRef}
                type="text"
                className="prompt-modal__input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value..."
              />
            )}
          </div>

          <div className="prompt-modal__footer">
            <button type="button" className="prompt-modal__cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="prompt-modal__submit-btn">
              {mode === "confirm" ? "Confirm" : "OK"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PromptModal;
