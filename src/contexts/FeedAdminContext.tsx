import { createContext, useContext, useState, type ReactNode } from "react";

// Prototype admin toggles for the feed, driven by the bottom-right 3-dot menu.
//   verifiedBadgePosition — where a verified post's badge sits:
//     "avatar" (default) — bottom-right of the profile photo
//     "name"             — inline, between the name and the timestamp
export type VerifiedBadgePosition = "avatar" | "name";
//   sidebarVersion — which left-sidebar layout the main feed shows:
//     "v1"           — original: profile card, next session, my experts
//     "v2" (default) — profile card, upcoming sessions, continue-learning programs
//     "v3"           — reserved for the next iteration (currently mirrors v2)
export type SidebarVersion = "v1" | "v2" | "v3";

interface FeedAdminContextValue {
  verifiedBadgePosition: VerifiedBadgePosition;
  setVerifiedBadgePosition: (v: VerifiedBadgePosition) => void;
  sidebarVersion: SidebarVersion;
  setSidebarVersion: (v: SidebarVersion) => void;
  // "Featured questions" carousel at the top of the feed — customer questions
  // the expert is well-suited to answer, shown as answerable prompts.
  featuredQuestions: boolean;
  setFeaturedQuestions: (v: boolean) => void;
  // Topics — the (in-progress) hashtag-like topics feature. When off (default),
  // post topic pills are hidden and the "Trending topics" sidebar card is
  // swapped for a "Find expert help" categories card.
  topics: boolean;
  setTopics: (v: boolean) => void;
}

const FeedAdminContext = createContext<FeedAdminContextValue>({
  verifiedBadgePosition: "avatar",
  setVerifiedBadgePosition: () => {},
  sidebarVersion: "v2",
  setSidebarVersion: () => {},
  featuredQuestions: false,
  setFeaturedQuestions: () => {},
  topics: false,
  setTopics: () => {},
});

const STORAGE_KEY = "feed-verified-badge-position";
const SIDEBAR_KEY = "feed-sidebar-version";
const FEATURED_QUESTIONS_KEY = "feed-featured-questions";
const TOPICS_KEY = "feed-topics";

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
    return saved === "v1" || saved === "v3" ? saved : "v2";
  });
  const setSidebarVersion = (v: SidebarVersion) => {
    localStorage.setItem(SIDEBAR_KEY, v);
    setVer(v);
  };
  const [featuredQuestions, setFQ] = useState<boolean>(() => {
    // Off by default; only an explicit "1" shows the carousel.
    return localStorage.getItem(FEATURED_QUESTIONS_KEY) === "1";
  });
  const setFeaturedQuestions = (v: boolean) => {
    localStorage.setItem(FEATURED_QUESTIONS_KEY, v ? "1" : "0");
    setFQ(v);
  };
  const [topics, setTopicsState] = useState<boolean>(() => {
    // Off by default; only an explicit "1" enables topics.
    return localStorage.getItem(TOPICS_KEY) === "1";
  });
  const setTopics = (v: boolean) => {
    localStorage.setItem(TOPICS_KEY, v ? "1" : "0");
    setTopicsState(v);
  };
  return (
    <FeedAdminContext.Provider value={{ verifiedBadgePosition, setVerifiedBadgePosition, sidebarVersion, setSidebarVersion, featuredQuestions, setFeaturedQuestions, topics, setTopics }}>
      {children}
    </FeedAdminContext.Provider>
  );
}

export function useFeedAdmin() {
  return useContext(FeedAdminContext);
}
