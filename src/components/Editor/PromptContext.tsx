import React, { createContext, useContext, useState, ReactNode } from "react";
import PromptModal from "./PromptModal";

interface PromptOptions {
  title: string;
  defaultValue?: string;
}

interface PromptContextType {
  prompt: (options: PromptOptions | string) => Promise<string | null>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
};

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [resolvePromise, setResolvePromise] = useState<(value: string | null) => void>();

  const prompt = (options: PromptOptions | string): Promise<string | null> => {
    return new Promise((resolve) => {
      const opts = typeof options === "string" ? { title: options } : options;
      setTitle(opts.title);
      setDefaultValue(opts.defaultValue || "");
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  };

  const handleClose = (value: string | null) => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(value);
    }
  };

  return (
    <PromptContext.Provider value={{ prompt }}>
      {children}
      <PromptModal
        open={isOpen}
        title={title}
        defaultValue={defaultValue}
        onClose={() => handleClose(null)}
        onSubmit={(val) => handleClose(val)}
      />
    </PromptContext.Provider>
  );
};
