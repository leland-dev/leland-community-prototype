import { createContext, useContext, useState, type ReactNode } from "react";

// Tracks whether the full-width "Saved to your profile" toast is showing, so
// the floating compose (+) button can lift above it instead of colliding with
// its dismiss (X) on the right.
const SavedToastContext = createContext<{ active: boolean; setActive: (v: boolean) => void }>({
  active: false,
  setActive: () => {},
});

export function SavedToastProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  return (
    <SavedToastContext.Provider value={{ active, setActive }}>
      {children}
    </SavedToastContext.Provider>
  );
}

export const useSavedToast = () => useContext(SavedToastContext);
