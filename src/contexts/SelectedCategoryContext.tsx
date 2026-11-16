import { createContext, useContext, useState, type ReactNode } from "react";

// The learner's selected work category (Sales, Marketing, Human Resources,
// etc. — the same labels Program Hub's CATEGORIES list uses). A single,
// shared "who is this learner" signal across the prototype: it decides the
// Browse All category filter's default, which "Browse by use case" tiles
// surface, the Recommended for you section's content, and which role's
// builds the lesson build-picker auto-selects. Settable from the Prototype
// options menu on either Program Hub or the course viewer, and persisted so
// a change on one page carries over to the other.
interface SelectedCategoryContextValue {
  selectedCategory: string | null;
  setSelectedCategory: (v: string | null) => void;
}

const SelectedCategoryContext = createContext<SelectedCategoryContextValue>({
  selectedCategory: null,
  setSelectedCategory: () => {},
});

const STORAGE_KEY = "prototype-selected-category";

export function SelectedCategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // localStorage access can throw (private browsing, blocked third-party
  // storage, a sandboxed preview iframe) — if it does, fall back to
  // session-only state rather than letting the throw abort this function
  // before the selection itself ever updates, which made the picker look
  // permanently stuck on whatever value was last persisted successfully.
  const setSelectedCategory = (v: string | null) => {
    try {
      if (v) {
        localStorage.setItem(STORAGE_KEY, v);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore — state still updates below
    }
    setSelectedCategoryState(v);
  };

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
}

export function useSelectedCategory() {
  return useContext(SelectedCategoryContext);
}
