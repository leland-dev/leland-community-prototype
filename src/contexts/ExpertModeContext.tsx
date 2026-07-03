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

export function ExpertModeProvider({ children }: { children: ReactNode }) {
  const [expert, setExpert] = useState(true);
  const toggle = () => setExpert((v) => !v);

  return (
    <ExpertModeContext.Provider value={{ expert, setExpert, toggle }}>
      {children}
    </ExpertModeContext.Provider>
  );
}

export function useExpertMode() {
  return useContext(ExpertModeContext);
}
