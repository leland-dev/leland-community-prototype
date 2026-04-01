import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type LayoutVariant = "standard" | "thin";

interface LayoutVariantContextValue {
  variant: LayoutVariant;
  setVariant: (v: LayoutVariant) => void;
}

const LayoutVariantContext = createContext<LayoutVariantContextValue>({
  variant: "standard",
  setVariant: () => {},
});

export function LayoutVariantProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<LayoutVariant>("standard");

  const stableSetVariant = useCallback(
    (v: LayoutVariant) => setVariant(v),
    [],
  );

  return (
    <LayoutVariantContext.Provider
      value={{ variant, setVariant: stableSetVariant }}
    >
      {children}
    </LayoutVariantContext.Provider>
  );
}

export function useLayoutVariant() {
  return useContext(LayoutVariantContext).variant;
}

export function useSetLayoutVariant(v: LayoutVariant) {
  const { setVariant } = useContext(LayoutVariantContext);

  useEffect(() => {
    setVariant(v);
    return () => setVariant("standard");
  }, [v, setVariant]);
}
