import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ModalTheme = "light" | "dark";

interface ThemeContextValue {
  modalTheme: ModalTheme;
  toggleModalTheme: () => void;
}

const LS_KEY = "steam-review-modal-theme";

const ThemeContext = createContext<ThemeContextValue>({
  modalTheme: "dark",
  toggleModalTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [modalTheme, setModalTheme] = useState<ModalTheme>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {}
    return "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, modalTheme);
    } catch {}
  }, [modalTheme]);

  const toggleModalTheme = useCallback(() => {
    setModalTheme(prev => (prev === "light" ? "dark" : "light"));
  }, []);

  return <ThemeContext.Provider value={{ modalTheme, toggleModalTheme }}>{children}</ThemeContext.Provider>;
}

export function useModalTheme() {
  return useContext(ThemeContext);
}
