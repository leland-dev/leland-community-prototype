import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ContentMaxWidthContextValue {
  contentMaxWidth: number | undefined;
  setContentMaxWidth: (v: number | undefined) => void;
}

const ContentMaxWidthContext = createContext<ContentMaxWidthContextValue>({
  contentMaxWidth: undefined,
  setContentMaxWidth: () => {},
});

export function ContentMaxWidthProvider({ children }: { children: ReactNode }) {
  const [contentMaxWidth, setContentMaxWidth] = useState<number | undefined>(
    undefined,
  );

  const stableSet = useCallback(
    (v: number | undefined) => setContentMaxWidth(v),
    [],
  );

  return (
    <ContentMaxWidthContext.Provider
      value={{ contentMaxWidth, setContentMaxWidth: stableSet }}
    >
      {children}
    </ContentMaxWidthContext.Provider>
  );
}

export function useContentMaxWidth() {
  return useContext(ContentMaxWidthContext).contentMaxWidth;
}

export function useSetContentMaxWidth(v: number) {
  const { setContentMaxWidth } = useContext(ContentMaxWidthContext);

  useEffect(() => {
    setContentMaxWidth(v);
    return () => setContentMaxWidth(undefined);
  }, [v, setContentMaxWidth]);
}
