import { createContext, useContext, useState, type ReactNode } from "react";

// Which top navbar to render on the customer experience:
//   "classic"  — the original Leland top nav (text links + avatar dropdown)
//   "linkedin" — the LinkedIn-style icon nav (stacked icon items + search)
// Defaults to "linkedin" — the alt-nav is now the default experience; the
// classic nav is opt-in via the "Switch to Classic nav" toggle in the profile
// dropdown / Account admin panel.
export type TopNavStyle = "classic" | "linkedin";

// Which "modality" nav items sit between My Leland and Messages:
//   "off"      — none
//   "jobs"     — a single "Jobs" item
//   "existing" — "Livestreams" + "Leland+" (the default modality set)
export type NavModalities = "off" | "jobs" | "existing";

interface TopNavStyleContextValue {
  style: TopNavStyle;
  setStyle: (v: TopNavStyle) => void;
  toggle: () => void;
  showNavLabels: boolean;
  setShowNavLabels: (v: boolean) => void;
  // Which modality items appear in the icon group. Off by default; toggled from
  // the Navigation admin dropdown.
  modalities: NavModalities;
  setModalities: (v: NavModalities) => void;
  // "Search Leland" input in the navbar. Hidden by default; toggled from
  // the Navigation admin dropdown.
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  // Alt layout: Messages + Notifications move to the right of the divider and
  // render icon-only (no labels). Off by default; toggled from the Navigation
  // admin dropdown.
  altLayout: boolean;
  setAltLayout: (v: boolean) => void;
  // Classic-nav feed + post-detail frame: false = feed/sidebars centered within
  // 1280 (default), true = pushed to the window edges (edge-to-edge). Toggled
  // from the Navigation admin dropdown.
  feedEdgeToEdge: boolean;
  setFeedEdgeToEdge: (v: boolean) => void;
}

const TopNavStyleContext = createContext<TopNavStyleContextValue>({
  style: "linkedin",
  setStyle: () => {},
  toggle: () => {},
  showNavLabels: true,
  setShowNavLabels: () => {},
  modalities: "existing",
  setModalities: () => {},
  showSearch: false,
  setShowSearch: () => {},
  altLayout: false,
  setAltLayout: () => {},
  feedEdgeToEdge: false,
  setFeedEdgeToEdge: () => {},
});

// v2: the default flipped to "linkedin" (alt-nav is now the default experience).
// Bumped so stale "classic" values written by the old (no-op, path-based) toggle
// don't force the classic nav on load.
const STORAGE_KEY = "prototype-topnav-style-v2";
const LABELS_STORAGE_KEY = "prototype-topnav-labels";
const MODALITIES_STORAGE_KEY = "prototype-topnav-modalities";
const SEARCH_STORAGE_KEY = "prototype-topnav-search";
const ALT_LAYOUT_STORAGE_KEY = "prototype-topnav-alt-layout";
const FEED_EDGE_STORAGE_KEY = "prototype-feed-edge-to-edge";

export function TopNavStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState<TopNavStyle>(() => {
    // Alt-nav (LinkedIn) is the default; only an explicit "classic" opts out.
    return localStorage.getItem(STORAGE_KEY) === "classic" ? "classic" : "linkedin";
  });
  const [showNavLabels, setShowNavLabelsState] = useState<boolean>(() => {
    // Labels shown by default; only an explicit "0" hides them.
    return localStorage.getItem(LABELS_STORAGE_KEY) !== "0";
  });
  const [modalities, setModalitiesState] = useState<NavModalities>(() => {
    // Defaults to "existing"; only an explicit "off" / "jobs" opts out.
    const v = localStorage.getItem(MODALITIES_STORAGE_KEY);
    return v === "off" || v === "jobs" ? v : "existing";
  });
  const [showSearch, setShowSearchState] = useState<boolean>(() => {
    // Hidden by default; only an explicit "1" shows the search input.
    return localStorage.getItem(SEARCH_STORAGE_KEY) === "1";
  });
  const [altLayout, setAltLayoutState] = useState<boolean>(() => {
    // Off by default; only an explicit "1" enables the alt layout.
    return localStorage.getItem(ALT_LAYOUT_STORAGE_KEY) === "1";
  });
  const [feedEdgeToEdge, setFeedEdgeToEdgeState] = useState<boolean>(() => {
    // Centered (constrained) by default; only an explicit "1" pushes to edges.
    return localStorage.getItem(FEED_EDGE_STORAGE_KEY) === "1";
  });
  const setStyle = (v: TopNavStyle) => {
    localStorage.setItem(STORAGE_KEY, v);
    setStyleState(v);
  };

  const setShowNavLabels = (v: boolean) => {
    localStorage.setItem(LABELS_STORAGE_KEY, v ? "1" : "0");
    setShowNavLabelsState(v);
  };

  const setModalities = (v: NavModalities) => {
    localStorage.setItem(MODALITIES_STORAGE_KEY, v);
    setModalitiesState(v);
  };

  const setShowSearch = (v: boolean) => {
    localStorage.setItem(SEARCH_STORAGE_KEY, v ? "1" : "0");
    setShowSearchState(v);
  };

  const setAltLayout = (v: boolean) => {
    localStorage.setItem(ALT_LAYOUT_STORAGE_KEY, v ? "1" : "0");
    setAltLayoutState(v);
  };

  const setFeedEdgeToEdge = (v: boolean) => {
    localStorage.setItem(FEED_EDGE_STORAGE_KEY, v ? "1" : "0");
    setFeedEdgeToEdgeState(v);
  };

  const toggle = () => setStyle(style === "linkedin" ? "classic" : "linkedin");

  return (
    <TopNavStyleContext.Provider value={{ style, setStyle, toggle, showNavLabels, setShowNavLabels, modalities, setModalities, showSearch, setShowSearch, altLayout, setAltLayout, feedEdgeToEdge, setFeedEdgeToEdge }}>
      {children}
    </TopNavStyleContext.Provider>
  );
}

export function useTopNavStyle() {
  return useContext(TopNavStyleContext);
}
