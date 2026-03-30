import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface LeftSidebarContextValue {
  content: ReactNode | null;
  setContent: (node: ReactNode | null) => void;
}

const LeftSidebarContext = createContext<LeftSidebarContextValue>({
  content: null,
  setContent: () => {},
});

export function LeftSidebarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  const stableSetContent = useCallback(
    (node: ReactNode | null) => setContent(node),
    [],
  );

  return (
    <LeftSidebarContext.Provider
      value={{ content, setContent: stableSetContent }}
    >
      {children}
    </LeftSidebarContext.Provider>
  );
}

export function useLeftSidebarContent() {
  return useContext(LeftSidebarContext).content;
}

export function useSetLeftSidebar(node: ReactNode) {
  const { setContent } = useContext(LeftSidebarContext);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  useEffect(() => {
    setContent(nodeRef.current);
    return () => setContent(null);
  }, [setContent]);
}
