export type SessionState = "pre-session" | "live" | "just-ended" | "idle";

export type Chapter = {
  id: string;
  title: string;
  startOffsetSec: number;
};

export type Coach = {
  name: string;
  avatarUrl: string;
  role?: string;
};

export type Session = {
  urn: string;
  programUrn: string;
  title: string;
  number: number; // e.g. session 3 of 10
  startsAt: string; // ISO
  endsAt: string; // ISO
  coach: Coach;
  chapters: Chapter[];
  currentChapterId?: string; // mock; later from coach broadcast
  materialsUrl?: string;
  recordingUrl?: string;
};

export type ProgramSessionSummary = {
  urn: string;
  number: number;
  title: string;
  status: "done" | "current" | "upcoming";
  progressPct?: number;
};
