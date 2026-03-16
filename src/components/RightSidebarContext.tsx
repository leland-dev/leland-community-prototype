import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface RightSidebarContextValue {
  content: ReactNode | null;
  setContent: (node: ReactNode | null) => void;
}

const RightSidebarContext = createContext<RightSidebarContextValue>({
  content: null,
  setContent: () => {},
});

export function RightSidebarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  const stableSetContent = useCallback(
    (node: ReactNode | null) => setContent(node),
    [],
  );

  return (
    <RightSidebarContext.Provider
      value={{ content, setContent: stableSetContent }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
}

/** Layout reads this to get the current sidebar content. */
export function useRightSidebarContent() {
  return useContext(RightSidebarContext).content;
}

/**
 * Pages call this to set sidebar content. Auto-clears on unmount.
 * The node is captured via ref so the effect only runs on mount/unmount,
 * avoiding infinite re-render loops from unstable JSX references.
 */
export function useSetRightSidebar(node: ReactNode) {
  const { setContent } = useContext(RightSidebarContext);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  useEffect(() => {
    setContent(nodeRef.current);
    return () => setContent(null);
  }, [setContent]);
}
