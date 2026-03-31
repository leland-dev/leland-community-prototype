import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface SubNavContextValue {
  content: ReactNode | null;
  setContent: (node: ReactNode | null) => void;
}

export const SubNavContext = createContext<SubNavContextValue>({
  content: null,
  setContent: () => {},
});

export function SubNavProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  const stableSetContent = useCallback(
    (node: ReactNode | null) => setContent(node),
    [],
  );

  return (
    <SubNavContext.Provider value={{ content, setContent: stableSetContent }}>
      {children}
    </SubNavContext.Provider>
  );
}

export function useSubNavContent() {
  return useContext(SubNavContext).content;
}

export function useSetSubNav(node: ReactNode) {
  const { setContent } = useContext(SubNavContext);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  useEffect(() => {
    setContent(nodeRef.current);
    return () => setContent(null);
  }, [setContent]);
}
