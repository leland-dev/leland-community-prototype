import { createContext, useContext, useState } from "react";

const SessionLayoutContext = createContext<{
  simpleSessionLayout: boolean;
  setSimpleSessionLayout: (v: boolean) => void;
}>({ simpleSessionLayout: false, setSimpleSessionLayout: () => {} });

export function SessionLayoutProvider({ children }: { children: React.ReactNode }) {
  const [simpleSessionLayout, setSimpleSessionLayout] = useState(false);
  return (
    <SessionLayoutContext.Provider value={{ simpleSessionLayout, setSimpleSessionLayout }}>
      {children}
    </SessionLayoutContext.Provider>
  );
}

export function useSessionLayout() {
  return useContext(SessionLayoutContext);
}
