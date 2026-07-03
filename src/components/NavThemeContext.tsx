import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface NavTheme {
  /** Background color for the mobile top nav (default: "white") */
  bg: string;
  /** Use light (white) icons/logo instead of dark (default: false) */
  light: boolean;
  /** Hide the wordmark entirely, not just on scroll (default: false) */
  hideWordmark: boolean;
  /** Override for <meta name="theme-color"> / status bar color (defaults to bg) */
  themeColor?: string;
  /** Fade bg to transparent at the bottom (for blending into cover images) */
  bgGradient?: boolean;
}

const defaultTheme: NavTheme = { bg: "white", light: false, hideWordmark: false };

interface NavThemeContextValue {
  theme: NavTheme;
  setTheme: (t: NavTheme) => void;
  rightSlot: ReactNode | null;
  setRightSlot: (slot: ReactNode | null) => void;
}

const NavThemeContext = createContext<NavThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
  rightSlot: null,
  setRightSlot: () => {},
});

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>(defaultTheme);
  const [rightSlot, setRightSlot] = useState<ReactNode | null>(null);

  const stableSetTheme = useCallback(
    (t: NavTheme) => setTheme(t),
    [],
  );

  const stableSetRightSlot = useCallback(
    (slot: ReactNode | null) => setRightSlot(slot),
    [],
  );

  return (
    <NavThemeContext.Provider value={{ theme, setTheme: stableSetTheme, rightSlot, setRightSlot: stableSetRightSlot }}>
      {children}
    </NavThemeContext.Provider>
  );
}

export function useNavTheme() {
  return useContext(NavThemeContext).theme;
}

export function useNavRightSlot() {
  return useContext(NavThemeContext).rightSlot;
}

export function useSetNavRightSlot(slot: ReactNode | null) {
  const { setRightSlot } = useContext(NavThemeContext);

  useEffect(() => {
    setRightSlot(slot);
    return () => setRightSlot(null);
  }, [slot, setRightSlot]);
}

export function useSetNavTheme(t: NavTheme) {
  const { setTheme } = useContext(NavThemeContext);

  useEffect(() => {
    setTheme(t);
    return () => setTheme(defaultTheme);
  }, [t.bg, t.light, t.hideWordmark, t.themeColor, t.bgGradient, setTheme]);
}
