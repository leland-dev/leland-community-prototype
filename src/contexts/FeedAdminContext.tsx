import { createContext, useContext, useState, type ReactNode } from "react";

// Prototype admin toggles for the feed, driven by the bottom-right 3-dot menu.
//   verifiedBadgePosition — where a verified post's badge sits:
//     "avatar" (default) — bottom-right of the profile photo
//     "name"             — inline, between the name and the timestamp
export type VerifiedBadgePosition = "avatar" | "name";
//   sidebarVersion — which left-sidebar layout the main feed shows:
//     "v1" (default) — original: profile card, next session, my experts
//     "v2"           — profile card, upcoming sessions, continue-learning programs
//     "v3"           — reserved for the next iteration (currently mirrors v2)
export type SidebarVersion = "v1" | "v2" | "v3";

interface FeedAdminContextValue {
  verifiedBadgePosition: VerifiedBadgePosition;
  setVerifiedBadgePosition: (v: VerifiedBadgePosition) => void;
  sidebarVersion: SidebarVersion;
  setSidebarVersion: (v: SidebarVersion) => void;
}

const FeedAdminContext = createContext<FeedAdminContextValue>({
  verifiedBadgePosition: "avatar",
  setVerifiedBadgePosition: () => {},
  sidebarVersion: "v1",
  setSidebarVersion: () => {},
});

const STORAGE_KEY = "feed-verified-badge-position";
const SIDEBAR_KEY = "feed-sidebar-version";

export function FeedAdminProvider({ children }: { children: ReactNode }) {
  const [verifiedBadgePosition, setPos] = useState<VerifiedBadgePosition>(() =>
    localStorage.getItem(STORAGE_KEY) === "name" ? "name" : "avatar",
  );
  const setVerifiedBadgePosition = (v: VerifiedBadgePosition) => {
    localStorage.setItem(STORAGE_KEY, v);
    setPos(v);
  };
  const [sidebarVersion, setVer] = useState<SidebarVersion>(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    return saved === "v2" || saved === "v3" ? saved : "v1";
  });
  const setSidebarVersion = (v: SidebarVersion) => {
    localStorage.setItem(SIDEBAR_KEY, v);
    setVer(v);
  };
  return (
    <FeedAdminContext.Provider value={{ verifiedBadgePosition, setVerifiedBadgePosition, sidebarVersion, setSidebarVersion }}>
      {children}
    </FeedAdminContext.Provider>
  );
}

export function useFeedAdmin() {
  return useContext(FeedAdminContext);
}
