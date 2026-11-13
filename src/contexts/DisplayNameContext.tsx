import { createContext, useContext, useState, type ReactNode } from "react";

// The learner's first name, shown in Program Hub's "Welcome, {name}" header.
// Settable from the Prototype options menu — sales uses this prototype on
// demos, so they can preset the prospect's actual first name beforehand
// rather than always showing "Maddy".
interface DisplayNameContextValue {
  displayName: string;
  setDisplayName: (v: string) => void;
}

const DEFAULT_NAME = "Maddy";

const DisplayNameContext = createContext<DisplayNameContextValue>({
  displayName: DEFAULT_NAME,
  setDisplayName: () => {},
});

const STORAGE_KEY = "prototype-display-name";

export function DisplayNameProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_NAME;
  });

  const setDisplayName = (v: string) => {
    const next = v.trim() || DEFAULT_NAME;
    localStorage.setItem(STORAGE_KEY, next);
    setDisplayNameState(next);
  };

  return (
    <DisplayNameContext.Provider value={{ displayName, setDisplayName }}>
      {children}
    </DisplayNameContext.Provider>
  );
}

export function useDisplayName() {
  return useContext(DisplayNameContext);
}
