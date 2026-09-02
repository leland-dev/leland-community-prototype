import { createContext, useContext, useState, type ReactNode } from "react";

// Prototype admin toggles for the feed, driven by the bottom-right 3-dot menu.
//   verifiedBadgePosition — where a verified post's badge sits:
//     "avatar" (default) — bottom-right of the profile photo
//     "name"             — inline, between the name and the timestamp
export type VerifiedBadgePosition = "avatar" | "name";

interface FeedAdminContextValue {
  verifiedBadgePosition: VerifiedBadgePosition;
  setVerifiedBadgePosition: (v: VerifiedBadgePosition) => void;
}

const FeedAdminContext = createContext<FeedAdminContextValue>({
  verifiedBadgePosition: "avatar",
  setVerifiedBadgePosition: () => {},
});

const STORAGE_KEY = "feed-verified-badge-position";

export function FeedAdminProvider({ children }: { children: ReactNode }) {
  const [verifiedBadgePosition, setPos] = useState<VerifiedBadgePosition>(() =>
    localStorage.getItem(STORAGE_KEY) === "name" ? "name" : "avatar",
  );
  const setVerifiedBadgePosition = (v: VerifiedBadgePosition) => {
    localStorage.setItem(STORAGE_KEY, v);
    setPos(v);
  };
  return (
    <FeedAdminContext.Provider value={{ verifiedBadgePosition, setVerifiedBadgePosition }}>
      {children}
    </FeedAdminContext.Provider>
  );
}

export function useFeedAdmin() {
  return useContext(FeedAdminContext);
}
