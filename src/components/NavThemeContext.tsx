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
  /** Slide the nav in from the right on mount */
  slideIn?: boolean;
}

const defaultTheme: NavTheme = { bg: "white", light: false, hideWordmark: false };

interface NavThemeContextValue {
  theme: NavTheme;
  setTheme: (t: NavTheme) => void;
  rightSlot: ReactNode | null;
  setRightSlot: (slot: ReactNode | null) => void;
  backHandler: (() => void) | null;
  setBackHandler: (fn: (() => void) | null) => void;
}

const NavThemeContext = createContext<NavThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
  rightSlot: null,
  setRightSlot: () => {},
  backHandler: null,
  setBackHandler: () => {},
});

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>(defaultTheme);
  const [rightSlot, setRightSlot] = useState<ReactNode | null>(null);
  const [backHandler, setBackHandler] = useState<(() => void) | null>(null);

  const stableSetTheme = useCallback(
    (t: NavTheme) => setTheme(t),
    [],
  );

  const stableSetRightSlot = useCallback(
    (slot: ReactNode | null) => setRightSlot(slot),
    [],
  );

  const stableSetBackHandler = useCallback(
    (fn: (() => void) | null) => setBackHandler(() => fn),
    [],
  );

  return (
    <NavThemeContext.Provider value={{ theme, setTheme: stableSetTheme, rightSlot, setRightSlot: stableSetRightSlot, backHandler, setBackHandler: stableSetBackHandler }}>
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

export function useNavBackHandler() {
  return useContext(NavThemeContext).backHandler;
}

/** Lets a page intercept the top nav's back button — e.g. to play an exit
 *  animation before actually navigating away. */
export function useSetNavBackHandler(fn: (() => void) | null) {
  const { setBackHandler } = useContext(NavThemeContext);

  useEffect(() => {
    setBackHandler(fn);
    return () => setBackHandler(null);
  }, [fn, setBackHandler]);
}
