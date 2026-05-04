import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface DarkModeContextValue {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({
  dark: false,
  toggle: () => {},
  setDark: () => {},
});

const STORAGE_KEY = "prototype-dark-mode";

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setDark = (v: boolean) => {
    localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    setDarkState(v);
  };

  const toggle = () => setDark(!dark);

  return (
    <DarkModeContext.Provider value={{ dark, toggle, setDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
