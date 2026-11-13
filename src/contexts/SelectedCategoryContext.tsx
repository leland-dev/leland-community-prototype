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
    return localStorage.getItem(STORAGE_KEY) || null;
  });

  const setSelectedCategory = (v: string | null) => {
    if (v) {
      localStorage.setItem(STORAGE_KEY, v);
    } else {
      localStorage.removeItem(STORAGE_KEY);
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
