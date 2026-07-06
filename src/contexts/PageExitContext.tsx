import { createContext, useContext, useState, type ReactNode } from "react";

interface PageExitContextValue {
  exitingNode: ReactNode | null;
  startExit: (node: ReactNode) => void;
  clearExit: () => void;
}

const PageExitContext = createContext<PageExitContextValue>({
  exitingNode: null,
  startExit: () => {},
  clearExit: () => {},
});

// Lets a pushed page hand its departing frame off to a persistent overlay
// (see PageExitOverlay) that outlives the page's own unmount, so the
// outgoing page and the page it's revealing can animate in the same frame
// instead of one waiting for the other to finish first.
export function PageExitProvider({ children }: { children: ReactNode }) {
  const [exitingNode, setExitingNode] = useState<ReactNode | null>(null);

  return (
    <PageExitContext.Provider
      value={{
        exitingNode,
        startExit: setExitingNode,
        clearExit: () => setExitingNode(null),
      }}
    >
      {children}
    </PageExitContext.Provider>
  );
}

export function usePageExit() {
  return useContext(PageExitContext);
}
