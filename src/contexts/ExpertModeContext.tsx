import { createContext, useContext, useState, type ReactNode } from "react";

interface ExpertModeContextValue {
  expert: boolean;
  setExpert: (v: boolean) => void;
  toggle: () => void;
}

const ExpertModeContext = createContext<ExpertModeContextValue>({
  expert: true,
  setExpert: () => {},
  toggle: () => {},
});

const STORAGE_KEY = "expert-mode";

export function ExpertModeProvider({ children }: { children: ReactNode }) {
  const [expert, setExpertState] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
  const setExpert = (v: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(v));
    setExpertState(v);
  };
  const toggle = () =>
    setExpertState((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

  return (
    <ExpertModeContext.Provider value={{ expert, setExpert, toggle }}>
      {children}
    </ExpertModeContext.Provider>
  );
}

export function useExpertMode() {
  return useContext(ExpertModeContext);
}
