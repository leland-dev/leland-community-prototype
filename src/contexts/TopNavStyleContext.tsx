import { createContext, useContext, useState, type ReactNode } from "react";

// Which top navbar to render on the customer experience:
//   "classic"  — the original Leland top nav (text links + avatar dropdown)
//   "linkedin" — the LinkedIn-style icon nav (stacked icon items + search)
// Defaults to "linkedin" — the alt-nav is now the default experience; the
// classic nav is opt-in via the "Switch to Classic nav" toggle in the profile
// dropdown / Account admin panel.
export type TopNavStyle = "classic" | "linkedin";

interface TopNavStyleContextValue {
  style: TopNavStyle;
  setStyle: (v: TopNavStyle) => void;
  toggle: () => void;
  showNavLabels: boolean;
  setShowNavLabels: (v: boolean) => void;
  // Individual "modality" nav items shown between My Leland and Messages, each
  // toggled from the Navigation admin dropdown. Livestreams + Leland+ default on,
  // Jobs defaults off.
  showLivestreams: boolean;
  setShowLivestreams: (v: boolean) => void;
  showLelandPlus: boolean;
  setShowLelandPlus: (v: boolean) => void;
  showJobs: boolean;
  setShowJobs: (v: boolean) => void;
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
  showLivestreams: true,
  setShowLivestreams: () => {},
  showLelandPlus: true,
  setShowLelandPlus: () => {},
  showJobs: false,
  setShowJobs: () => {},
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
const LIVESTREAMS_STORAGE_KEY = "prototype-topnav-livestreams";
const LELANDPLUS_STORAGE_KEY = "prototype-topnav-lelandplus";
const JOBS_STORAGE_KEY = "prototype-topnav-jobs";
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
  const [showLivestreams, setShowLivestreamsState] = useState<boolean>(() => {
    // On by default; only an explicit "0" hides it.
    return localStorage.getItem(LIVESTREAMS_STORAGE_KEY) !== "0";
  });
  const [showLelandPlus, setShowLelandPlusState] = useState<boolean>(() => {
    // On by default; only an explicit "0" hides it.
    return localStorage.getItem(LELANDPLUS_STORAGE_KEY) !== "0";
  });
  const [showJobs, setShowJobsState] = useState<boolean>(() => {
    // Off by default; only an explicit "1" shows it.
    return localStorage.getItem(JOBS_STORAGE_KEY) === "1";
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

  const setShowLivestreams = (v: boolean) => {
    localStorage.setItem(LIVESTREAMS_STORAGE_KEY, v ? "1" : "0");
    setShowLivestreamsState(v);
  };

  const setShowLelandPlus = (v: boolean) => {
    localStorage.setItem(LELANDPLUS_STORAGE_KEY, v ? "1" : "0");
    setShowLelandPlusState(v);
  };

  const setShowJobs = (v: boolean) => {
    localStorage.setItem(JOBS_STORAGE_KEY, v ? "1" : "0");
    setShowJobsState(v);
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
    <TopNavStyleContext.Provider value={{ style, setStyle, toggle, showNavLabels, setShowNavLabels, showLivestreams, setShowLivestreams, showLelandPlus, setShowLelandPlus, showJobs, setShowJobs, showSearch, setShowSearch, altLayout, setAltLayout, feedEdgeToEdge, setFeedEdgeToEdge }}>
      {children}
    </TopNavStyleContext.Provider>
  );
}

export function useTopNavStyle() {
  return useContext(TopNavStyleContext);
}
