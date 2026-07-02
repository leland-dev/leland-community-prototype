import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface MobileSidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextValue>({
  open: false,
  setOpen: () => {},
});

export function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const setOpen = useCallback((v: boolean) => setOpenState(v), []);
  return (
    <MobileSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}
