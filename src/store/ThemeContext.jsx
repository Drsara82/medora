import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, readStorage, writeStorage } from "../utils";

const ThemeContext = createContext();

function prefersDark() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = readStorage(STORAGE_KEYS.theme, null);
    return stored === "light" || stored === "dark"
      ? stored
      : prefersDark()
        ? "dark"
        : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
