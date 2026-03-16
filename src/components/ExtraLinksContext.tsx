import { createContext, useContext, useState, type ReactNode } from "react";

interface ExtraLinksContextValue {
  showExtraLinks: boolean;
  toggleExtraLinks: () => void;
}

const ExtraLinksContext = createContext<ExtraLinksContextValue | null>(null);

const STORAGE_KEY = "leland:showExtraLinks";

export function ExtraLinksProvider({ children }: { children: ReactNode }) {
  const [showExtraLinks, setShowExtraLinks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  const toggleExtraLinks = () =>
    setShowExtraLinks((v) => {
      localStorage.setItem(STORAGE_KEY, String(!v));
      return !v;
    });

  return (
    <ExtraLinksContext.Provider value={{ showExtraLinks, toggleExtraLinks }}>
      {children}
    </ExtraLinksContext.Provider>
  );
}

export function useExtraLinks() {
  const ctx = useContext(ExtraLinksContext);
  if (!ctx) throw new Error("useExtraLinks must be used within ExtraLinksProvider");
  return ctx;
}
