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
}

const defaultTheme: NavTheme = { bg: "white", light: false, hideWordmark: false };

interface NavThemeContextValue {
  theme: NavTheme;
  setTheme: (t: NavTheme) => void;
}

const NavThemeContext = createContext<NavThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function NavThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<NavTheme>(defaultTheme);

  const stableSetTheme = useCallback(
    (t: NavTheme) => setTheme(t),
    [],
  );

  return (
    <NavThemeContext.Provider value={{ theme, setTheme: stableSetTheme }}>
      {children}
    </NavThemeContext.Provider>
  );
}

export function useNavTheme() {
  return useContext(NavThemeContext).theme;
}

export function useSetNavTheme(t: NavTheme) {
  const { setTheme } = useContext(NavThemeContext);

  useEffect(() => {
    setTheme(t);
    return () => setTheme(defaultTheme);
  }, [t.bg, t.light, t.hideWordmark, setTheme]);
}
