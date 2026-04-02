import { createContext, useContext, useState } from "react";

const SubNavStyleContext = createContext<{
  showSubNav: boolean;
  setShowSubNav: (v: boolean) => void;
}>({ showSubNav: true, setShowSubNav: () => {} });

export function SubNavStyleProvider({ children }: { children: React.ReactNode }) {
  const [showSubNav, setShowSubNav] = useState(true);
  return (
    <SubNavStyleContext.Provider value={{ showSubNav, setShowSubNav }}>
      {children}
    </SubNavStyleContext.Provider>
  );
}

export function useSubNavStyle() {
  return useContext(SubNavStyleContext);
}
