import type { Chapter, ProgramSessionSummary, Session, SessionState } from "./_types";
import pic1 from "../../../assets/profile photos/pic-1.png";

const COACH = {
  name: "Tanner Helin",
  avatarUrl: pic1 as string,
  role: "AIBP Lead Instructor",
};

const SHARED_CHAPTERS: Chapter[] = [
  { id: "c1", title: "Intro & framing", startOffsetSec: 0 },
  { id: "c2", title: "Live build: agent skeleton", startOffsetSec: 600 },
  { id: "c3", title: "Peer breakout", startOffsetSec: 2400 },
  { id: "c4", title: "Group debrief", startOffsetSec: 4200 },
  { id: "c5", title: "Q&A", startOffsetSec: 5100 },
];

const NOW = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const mockSessions: Record<string, Session> = {
  "mock-pre": {
    urn: "mock-pre",
    programUrn: "aibp-spring-2026",
    title: "Building Your First AI Agent",
    number: 3,
    startsAt: new Date(NOW + 2 * DAY).toISOString(),
    endsAt: new Date(NOW + 2 * DAY + 90 * MIN).toISOString(),
    coach: COACH,
    chapters: SHARED_CHAPTERS,
  },
  "mock-live": {
    urn: "mock-live",
    programUrn: "aibp-spring-2026",
    title: "Building Your First AI Agent",
    number: 3,
    startsAt: new Date(NOW - 12 * MIN).toISOString(),
    endsAt: new Date(NOW + 78 * MIN).toISOString(),
    coach: COACH,
    chapters: SHARED_CHAPTERS,
    currentChapterId: "c2",
  },
  "mock-ended": {
    urn: "mock-ended",
    programUrn: "aibp-spring-2026",
    title: "Building Your First AI Agent",
    number: 3,
    startsAt: new Date(NOW - 3 * HOUR).toISOString(),
    endsAt: new Date(NOW - 90 * MIN).toISOString(),
    coach: COACH,
    chapters: SHARED_CHAPTERS,
    recordingUrl: "#",
  },
  "mock-idle": {
    urn: "mock-idle",
    programUrn: "aibp-spring-2026",
    title: "Tools & Memory Patterns",
    number: 4,
    startsAt: new Date(NOW + 10 * DAY).toISOString(),
    endsAt: new Date(NOW + 10 * DAY + 90 * MIN).toISOString(),
    coach: COACH,
    chapters: SHARED_CHAPTERS,
  },
};

export const programSessions: ProgramSessionSummary[] = [
  { urn: "s-1", number: 1, title: "Foundations of agentic AI", status: "done", progressPct: 100 },
  { urn: "s-2", number: 2, title: "Tools & workflows", status: "done", progressPct: 100 },
  { urn: "mock-live", number: 3, title: "Building Your First AI Agent", status: "current", progressPct: 35 },
  { urn: "mock-idle", number: 4, title: "Tools & Memory Patterns", status: "upcoming" },
  { urn: "s-5", number: 5, title: "Multi-agent orchestration", status: "upcoming" },
  { urn: "s-6", number: 6, title: "Production deploy & monitoring", status: "upcoming" },
];

export function computeState(session: Session): SessionState {
  const now = Date.now();
  const startsAt = new Date(session.startsAt).getTime();
  const endsAt = new Date(session.endsAt).getTime();
  if (now < startsAt - 7 * DAY) return "idle";
  if (now < startsAt - 15 * MIN) return "pre-session";
  if (now < endsAt) return "live";
  if (now < endsAt + 24 * HOUR) return "just-ended";
  return "idle";
}

export function resolveSession(urn: string | undefined): {
  session: Session;
  state: SessionState;
} {
  // Mock URN prefix routing — deterministic for prototype testing
  if (urn === "mock-pre") return { session: mockSessions["mock-pre"], state: "pre-session" };
  if (urn === "mock-live") return { session: mockSessions["mock-live"], state: "live" };
  if (urn === "mock-ended") return { session: mockSessions["mock-ended"], state: "just-ended" };
  if (urn === "mock-idle") return { session: mockSessions["mock-idle"], state: "idle" };
  // Fallback: treat as a live-state session so demo entry points always land somewhere reasonable
  const session = mockSessions["mock-live"];
  return { session, state: computeState(session) };
}

export function nextUpcomingSession(): ProgramSessionSummary | undefined {
  return programSessions.find((s) => s.status === "upcoming" || s.status === "current");
}
