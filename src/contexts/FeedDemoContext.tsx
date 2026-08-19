import { createContext, useContext, useState, type ReactNode } from "react";

// Demo toggles (Admin Tools) for the feed post-type explorations:
//
//   liveCardStyle — how a live stream renders in the feed
//     "video" — immersive: full-width autoplaying video with chat overlay
//     "min"   — compact Twitter-style: slim thumbnail row, no embedded player
//
//   eventStage — morphs the demo event post through its lifecycle
//     "upcoming" — RSVP in the feed
//     "live"     — happening now (renders the live treatment)
//     "wrapped"  — ended: recap + continue-the-conversation
export type LiveCardStyle = "video" | "min";
export type EventStage = "upcoming" | "live" | "wrapped";

const FeedDemoContext = createContext<{
  liveCardStyle: LiveCardStyle;
  setLiveCardStyle: (s: LiveCardStyle) => void;
  eventStage: EventStage;
  setEventStage: (s: EventStage) => void;
  // Demo: pretend the coach has no recordings yet, to show the composer's
  // livestream empty state.
  hasLivestreams: boolean;
  setHasLivestreams: (v: boolean) => void;
}>({
  liveCardStyle: "video",
  setLiveCardStyle: () => {},
  eventStage: "upcoming",
  setEventStage: () => {},
  hasLivestreams: true,
  setHasLivestreams: () => {},
});

export function FeedDemoProvider({ children }: { children: ReactNode }) {
  const [liveCardStyle, setLiveCardStyle] = useState<LiveCardStyle>("video");
  const [eventStage, setEventStage] = useState<EventStage>("upcoming");
  const [hasLivestreams, setHasLivestreams] = useState(true);
  return (
    <FeedDemoContext.Provider value={{ liveCardStyle, setLiveCardStyle, eventStage, setEventStage, hasLivestreams, setHasLivestreams }}>
      {children}
    </FeedDemoContext.Provider>
  );
}

export const useFeedDemo = () => useContext(FeedDemoContext);
