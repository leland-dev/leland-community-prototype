import { createContext, useContext, useState, type ReactNode } from "react";

// Which top navbar to render on the customer (non-alt-nav) experience:
//   "classic"  — the original Leland top nav (text links + avatar dropdown)
//   "linkedin" — the LinkedIn-style icon nav (stacked icon items + search)
// Defaults to "classic" so the original is preserved; switchable via an admin
// tool in the profile dropdown.
export type TopNavStyle = "classic" | "linkedin";

// Design variants of the LinkedIn-style nav (v1/v2/v3) — a scratch space for
// presenting minor styling alternatives to the team. Only meaningful when
// style === "linkedin"; toggled from the Navigation dropdown.
export type TopNavVariant = 1 | 2 | 3;

interface TopNavStyleContextValue {
  style: TopNavStyle;
  setStyle: (v: TopNavStyle) => void;
  toggle: () => void;
  variant: TopNavVariant;
  setVariant: (v: TopNavVariant) => void;
  showNavLabels: boolean;
  setShowNavLabels: (v: boolean) => void;
  // Classic-nav feed + post-detail frame: false = feed/sidebars centered within
  // 1280 (default), true = pushed to the window edges (edge-to-edge). Toggled
  // from the Navigation admin dropdown.
  feedEdgeToEdge: boolean;
  setFeedEdgeToEdge: (v: boolean) => void;
  // LinkedIn-style navbar content: false = constrained to 1280 (default),
  // true = extends to the window edges. Toggled from the Navigation dropdown.
  navEdgeToEdge: boolean;
  setNavEdgeToEdge: (v: boolean) => void;
}

const TopNavStyleContext = createContext<TopNavStyleContextValue>({
  style: "classic",
  setStyle: () => {},
  toggle: () => {},
  variant: 1,
  setVariant: () => {},
  showNavLabels: true,
  setShowNavLabels: () => {},
  feedEdgeToEdge: false,
  setFeedEdgeToEdge: () => {},
  navEdgeToEdge: false,
  setNavEdgeToEdge: () => {},
});

const STORAGE_KEY = "prototype-topnav-style";
const VARIANT_STORAGE_KEY = "prototype-topnav-variant";
const LABELS_STORAGE_KEY = "prototype-topnav-labels";
const FEED_EDGE_STORAGE_KEY = "prototype-feed-edge-to-edge";
const NAV_EDGE_STORAGE_KEY = "prototype-nav-edge-to-edge";

export function TopNavStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState<TopNavStyle>(() => {
    return localStorage.getItem(STORAGE_KEY) === "linkedin" ? "linkedin" : "classic";
  });
  const [variant, setVariantState] = useState<TopNavVariant>(() => {
    const v = Number(localStorage.getItem(VARIANT_STORAGE_KEY));
    return v === 2 || v === 3 ? (v as TopNavVariant) : 1;
  });
  const [showNavLabels, setShowNavLabelsState] = useState<boolean>(() => {
    // Labels shown by default; only an explicit "0" hides them.
    return localStorage.getItem(LABELS_STORAGE_KEY) !== "0";
  });
  const [feedEdgeToEdge, setFeedEdgeToEdgeState] = useState<boolean>(() => {
    // Centered (constrained) by default; only an explicit "1" pushes to edges.
    return localStorage.getItem(FEED_EDGE_STORAGE_KEY) === "1";
  });
  const [navEdgeToEdge, setNavEdgeToEdgeState] = useState<boolean>(() => {
    // Constrained by default; only an explicit "1" extends the nav to the edges.
    return localStorage.getItem(NAV_EDGE_STORAGE_KEY) === "1";
  });

  const setStyle = (v: TopNavStyle) => {
    localStorage.setItem(STORAGE_KEY, v);
    setStyleState(v);
  };

  const setVariant = (v: TopNavVariant) => {
    localStorage.setItem(VARIANT_STORAGE_KEY, String(v));
    setVariantState(v);
  };

  const setShowNavLabels = (v: boolean) => {
    localStorage.setItem(LABELS_STORAGE_KEY, v ? "1" : "0");
    setShowNavLabelsState(v);
  };

  const setFeedEdgeToEdge = (v: boolean) => {
    localStorage.setItem(FEED_EDGE_STORAGE_KEY, v ? "1" : "0");
    setFeedEdgeToEdgeState(v);
  };

  const setNavEdgeToEdge = (v: boolean) => {
    localStorage.setItem(NAV_EDGE_STORAGE_KEY, v ? "1" : "0");
    setNavEdgeToEdgeState(v);
  };

  const toggle = () => setStyle(style === "linkedin" ? "classic" : "linkedin");

  return (
    <TopNavStyleContext.Provider value={{ style, setStyle, toggle, variant, setVariant, showNavLabels, setShowNavLabels, feedEdgeToEdge, setFeedEdgeToEdge, navEdgeToEdge, setNavEdgeToEdge }}>
      {children}
    </TopNavStyleContext.Provider>
  );
}

export function useTopNavStyle() {
  return useContext(TopNavStyleContext);
}
