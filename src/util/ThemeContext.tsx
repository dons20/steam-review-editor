import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ModalTheme = "light" | "dark";

interface ThemeContextValue {
  modalTheme: ModalTheme;
  toggleModalTheme: () => void;
}

const LS_KEY = "steam-review-modal-theme";

function getStoredTheme(): ModalTheme | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(LS_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): ModalTheme {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  return "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  modalTheme: "dark",
  toggleModalTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [hasManualPreference, setHasManualPreference] = useState(() => getStoredTheme() !== null);
  const [modalTheme, setModalTheme] = useState<ModalTheme>(() => getStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = modalTheme;
      document.documentElement.style.colorScheme = modalTheme;
    }
  }, [modalTheme]);

  useEffect(() => {
    if (hasManualPreference || typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const applySystemTheme = (matches: boolean) => {
      setModalTheme(matches ? "light" : "dark");
    };
    const handleChange = (event: MediaQueryListEvent) => {
      applySystemTheme(event.matches);
    };

    applySystemTheme(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [hasManualPreference]);

  const toggleModalTheme = useCallback(() => {
    setModalTheme(prev => {
      const nextTheme = prev === "light" ? "dark" : "light";

      try {
        localStorage.setItem(LS_KEY, nextTheme);
      } catch {}

      return nextTheme;
    });
    setHasManualPreference(true);
  }, []);

  return <ThemeContext.Provider value={{ modalTheme, toggleModalTheme }}>{children}</ThemeContext.Provider>;
}

export function useModalTheme() {
  return useContext(ThemeContext);
}
