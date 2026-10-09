import { createContext, useContext, useState, type ReactNode } from "react";

// Prototype admin toggles for the feed, driven by the bottom-right 3-dot menu.
//   verifiedBadgePosition — where a verified post's badge sits:
//     "avatar" (default) — bottom-right of the profile photo
//     "name"             — inline, between the name and the timestamp
export type VerifiedBadgePosition = "avatar" | "name";
//   featuredQuestionsVersion — which treatment of the "Answer a question"
//   section the feed shows (the carousel is first enabled via the toggle):
//     "v1" (default) — original: scrollable cards, facepile social proof
//     "v2"           — v1 + "Asked by anonymous" attribution on each card
//     "v3"           — a promotional banner (abstract stack + chevron) that
//                      links straight to the "see all" questions page
export type FeaturedQuestionsVersion = "v1" | "v2" | "v3";
//   goalSidebar — what the right sidebar shows for the user's goals:
//     "default" (default) — no goals card (just sessions + continue learning)
//     "goals"             — the "Your goals" preview card is shown
//     "no-goal"           — simulates a user with no goal data: a first-goal
//                           onboarding card replaces the sessions/learning cards
export type GoalSidebarState = "default" | "goals" | "no-goal";

interface FeedAdminContextValue {
  verifiedBadgePosition: VerifiedBadgePosition;
  setVerifiedBadgePosition: (v: VerifiedBadgePosition) => void;
  // "Featured questions" carousel at the top of the feed — customer questions
  // the expert is well-suited to answer, shown as answerable prompts.
  featuredQuestions: boolean;
  setFeaturedQuestions: (v: boolean) => void;
  featuredQuestionsVersion: FeaturedQuestionsVersion;
  setFeaturedQuestionsVersion: (v: FeaturedQuestionsVersion) => void;
  // Topics — the (in-progress) hashtag-like topics feature. When off (default),
  // post topic pills are hidden and the "Trending topics" sidebar card is
  // swapped for a "Find expert help" categories card.
  topics: boolean;
  setTopics: (v: boolean) => void;
  // Goals treatment in the right sidebar — see GoalSidebarState above.
  goalSidebar: GoalSidebarState;
  setGoalSidebar: (v: GoalSidebarState) => void;
}

const FeedAdminContext = createContext<FeedAdminContextValue>({
  verifiedBadgePosition: "avatar",
  setVerifiedBadgePosition: () => {},
  featuredQuestions: false,
  setFeaturedQuestions: () => {},
  featuredQuestionsVersion: "v1",
  setFeaturedQuestionsVersion: () => {},
  topics: false,
  setTopics: () => {},
  goalSidebar: "default",
  setGoalSidebar: () => {},
});

const STORAGE_KEY = "feed-verified-badge-position";
const FEATURED_QUESTIONS_KEY = "feed-featured-questions";
const FEATURED_QUESTIONS_VERSION_KEY = "feed-featured-questions-version";
const TOPICS_KEY = "feed-topics";
const GOAL_SIDEBAR_KEY = "feed-goal-sidebar";

export function FeedAdminProvider({ children }: { children: ReactNode }) {
  const [verifiedBadgePosition, setPos] = useState<VerifiedBadgePosition>(() =>
    localStorage.getItem(STORAGE_KEY) === "name" ? "name" : "avatar",
  );
  const setVerifiedBadgePosition = (v: VerifiedBadgePosition) => {
    localStorage.setItem(STORAGE_KEY, v);
    setPos(v);
  };
  const [featuredQuestions, setFQ] = useState<boolean>(() => {
    // Off by default; only an explicit "1" shows the carousel.
    return localStorage.getItem(FEATURED_QUESTIONS_KEY) === "1";
  });
  const setFeaturedQuestions = (v: boolean) => {
    localStorage.setItem(FEATURED_QUESTIONS_KEY, v ? "1" : "0");
    setFQ(v);
  };
  const [featuredQuestionsVersion, setFQV] = useState<FeaturedQuestionsVersion>(() => {
    const saved = localStorage.getItem(FEATURED_QUESTIONS_VERSION_KEY);
    return saved === "v2" || saved === "v3" ? saved : "v1";
  });
  const setFeaturedQuestionsVersion = (v: FeaturedQuestionsVersion) => {
    localStorage.setItem(FEATURED_QUESTIONS_VERSION_KEY, v);
    setFQV(v);
  };
  const [topics, setTopicsState] = useState<boolean>(() => {
    // Off by default; only an explicit "1" enables topics.
    return localStorage.getItem(TOPICS_KEY) === "1";
  });
  const setTopics = (v: boolean) => {
    localStorage.setItem(TOPICS_KEY, v ? "1" : "0");
    setTopicsState(v);
  };
  const [goalSidebar, setGoalSidebarState] = useState<GoalSidebarState>(() => {
    const saved = localStorage.getItem(GOAL_SIDEBAR_KEY);
    return saved === "goals" || saved === "no-goal" ? saved : "default";
  });
  const setGoalSidebar = (v: GoalSidebarState) => {
    localStorage.setItem(GOAL_SIDEBAR_KEY, v);
    setGoalSidebarState(v);
  };
  return (
    <FeedAdminContext.Provider value={{ verifiedBadgePosition, setVerifiedBadgePosition, featuredQuestions, setFeaturedQuestions, featuredQuestionsVersion, setFeaturedQuestionsVersion, topics, setTopics, goalSidebar, setGoalSidebar }}>
      {children}
    </FeedAdminContext.Provider>
  );
}

export function useFeedAdmin() {
  return useContext(FeedAdminContext);
}
