import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { B2BView, ModalId } from "./B2BData";
import B2BUserDrawerV2, { type UserDetailV2, type CohortEntry, type SessionEntry } from "./B2BUserDrawerV2";
import coachImg1 from "../../assets/profile photos/pic-1.png";
import coachImg2 from "../../assets/profile photos/pic-2.png";
import coachImg3 from "../../assets/profile photos/pic-3.png";
import userImg1 from "../../assets/profile photos/pic-4.png";
import userImg2 from "../../assets/profile photos/pic-5.png";
import userImg3 from "../../assets/profile photos/pic-6.png";
import userImg4 from "../../assets/profile photos/pic-7.png";
import userImg5 from "../../assets/profile photos/pic-8.png";
import usersIcon from "../../assets/icons/user-community.svg";
import settingsIcon from "../../assets/icons/settings.svg";

interface Props {
  onNavigate: (view: B2BView) => void;
  onSetUtilFilter: (filter: string) => void;
  onOpenModal: (m: ModalId) => void;
  onNavigateSettings?: () => void;
  partnerModel: "per-seat" | "a-la-carte";
  onSetPartnerModel: (m: "per-seat" | "a-la-carte") => void;
}

const activity = [
  { type: "session", coachImg: coachImg1, name: "Sarah Kim", action: "booked a coaching session with", target: "Jordan Lee", time: "2h ago", category: "Investment Banking" },
  { type: "review", coachImg: coachImg2, name: "Raj Patel", action: "left a 5-star review for", target: "Priya N.", time: "Yesterday", category: "Career Strategy" },
  { type: "enrollment", name: "Mia Chen", action: "enrolled in", target: "Spring '26 IB Cohort", time: "2d ago", category: "Live courses" },
  { type: "session", coachImg: coachImg3, name: "Evan Torres", action: "booked a session with", target: "Alex Morgan", time: "3d ago", category: "Private Equity" },
];

const CONTRACT_COHORTS = [
  { key: "ib", label: "Spring '26 IB Recruiting Bootcamp" },
  { key: "pe", label: "Private Equity Recruiting Bootcamp" },
  { key: "ai", label: "AI for Finance Professionals" },
] as const;

const COHORT_META: Record<CohortKey, { label: string; image: string; startDate: string; endDate: string }> = {
  ib: { label: "Spring '26 IB Recruiting Bootcamp", image: "https://leland.imgix.net/bootcamps/6841f40a18fcbc7406208084.png", startDate: "Jan 15, 2026", endDate: "Mar 20, 2026" },
  pe: { label: "Private Equity Recruiting Bootcamp", image: "https://leland.imgix.net/bootcamps/6841c0c4dde9ed55e539fe5f.png", startDate: "Apr 7, 2026", endDate: "May 9, 2026" },
  ai: { label: "AI for Finance Professionals", image: "https://leland.imgix.net/bootcamps/6841f40a18fcbc7406208084.png", startDate: "Mar 1, 2026", endDate: "Mar 29, 2026" },
};

function cohortEntry(key: CohortKey, status: CohortEntry["status"], extra?: Partial<CohortEntry>): CohortEntry {
  const m = COHORT_META[key];
  return { name: m.label, image: m.image, startDate: m.startDate, endDate: m.endDate, status, ...extra };
}

function tableRowToUserDetailV2(row: typeof users[number]): UserDetailV2 {
  const sessionsGranted = row.sessionsTotal ?? 0;
  const sessionsCompleted = row.sessions ?? 0;
  const entries: SessionEntry[] = [];
  for (let i = 0; i < sessionsCompleted; i++) entries.push({ date: "—", status: "completed" });
  for (let i = sessionsCompleted; i < sessionsGranted; i++) entries.push({ date: "—", status: "unbooked" });
  const cohorts: CohortEntry[] = CONTRACT_COHORTS
    .filter((c) => row.cohortStatuses[c.key])
    .map((c) => cohortEntry(c.key, row.cohortStatuses[c.key]!));
  const plus: UserDetailV2["plus"] = row.plus !== "—" && row.plusExpiry
    ? { status: row.plus === "Expired" ? "expired" : "active", expiry: row.plusExpiry }
    : undefined;
  return {
    name: row.name, email: row.email, initials: row.initials, dateAdded: row.dateAdded,
    sessions: sessionsGranted > 0 ? { granted: sessionsGranted, entries } : undefined,
    cohorts: cohorts.length > 0 ? cohorts : undefined,
    plus,
  };
}

type CohortKey = typeof CONTRACT_COHORTS[number]["key"];
type CohortStatus = "invited" | "enrolled" | "completed";

const users = [
  { initials: "ZP", name: "Zoe Park", email: "zoe.park@kellogg.edu", sessions: 1, sessionsTotal: 3, cohortStatuses: { ib: "enrolled", pe: "invited" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Aug 15, 2026", lastActive: "1d ago", lastActiveDays: 1, dateAdded: "Jan 5, 2026", daysAdded: 99 },
  { initials: "SK", name: "Sarah Kim", email: "sarah.kim@kellogg.edu", sessions: 2, sessionsTotal: 4, cohortStatuses: { ib: "enrolled", pe: "invited" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 10, 2026", lastActive: "2h ago", lastActiveDays: 0.08, dateAdded: "Jan 10, 2026", daysAdded: 94 },
  { initials: "RP", name: "Raj Patel", email: "raj.patel@kellogg.edu", sessions: 1, sessionsTotal: 3, cohortStatuses: { ib: "invited" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 10, 2026", lastActive: "Yesterday", lastActiveDays: 1, dateAdded: "Jan 10, 2026", daysAdded: 94 },
  { initials: "MC", name: "Mia Chen", email: "mia.chen@kellogg.edu", sessions: null, sessionsTotal: null, cohortStatuses: { ib: "enrolled", ai: "enrolled" } as Partial<Record<CohortKey, CohortStatus>>, plus: "—", plusExpiry: null, lastActive: "2d ago", lastActiveDays: 2, dateAdded: "Jan 15, 2026", daysAdded: 89 },
  { initials: "ET", name: "Evan Torres", email: "evan.torres@kellogg.edu", sessions: 2, sessionsTotal: 4, cohortStatuses: {} as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 15, 2026", lastActive: "3d ago", lastActiveDays: 3, dateAdded: "Jan 15, 2026", daysAdded: 89 },
  { initials: "AL", name: "Aisha Lee", email: "aisha.lee@kellogg.edu", sessions: 0, sessionsTotal: 3, cohortStatuses: {} as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Aug 1, 2026", lastActive: "—", lastActiveDays: 999, dateAdded: "Feb 1, 2026", daysAdded: 72 },
  { initials: "JL", name: "Jordan Lee", email: "jordan.lee@kellogg.edu", sessions: 2, sessionsTotal: 3, cohortStatuses: { pe: "completed" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 20, 2026", lastActive: "4d ago", lastActiveDays: 4, dateAdded: "Jan 20, 2026", daysAdded: 84 },
  { initials: "PM", name: "Priya Mehta", email: "priya.mehta@kellogg.edu", sessions: 1, sessionsTotal: 2, cohortStatuses: {} as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 20, 2026", lastActive: "5d ago", lastActiveDays: 5, dateAdded: "Jan 20, 2026", daysAdded: 84 },
  { initials: "DW", name: "Daniel Wu", email: "daniel.wu@kellogg.edu", sessions: null, sessionsTotal: null, cohortStatuses: { ib: "enrolled" } as Partial<Record<CohortKey, CohortStatus>>, plus: "—", plusExpiry: null, lastActive: "1w ago", lastActiveDays: 7, dateAdded: "Feb 3, 2026", daysAdded: 70 },
  { initials: "NB", name: "Nina Brooks", email: "nina.brooks@kellogg.edu", sessions: 3, sessionsTotal: 4, cohortStatuses: {} as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Jul 25, 2026", lastActive: "1w ago", lastActiveDays: 7, dateAdded: "Jan 25, 2026", daysAdded: 79 },
  { initials: "CR", name: "Carlos Rivera", email: "carlos.rivera@kellogg.edu", sessions: null, sessionsTotal: null, cohortStatuses: {} as Partial<Record<CohortKey, CohortStatus>>, plus: "Expired", plusExpiry: "Apr 10, 2026", lastActive: "—", lastActiveDays: 999, dateAdded: "Feb 10, 2026", daysAdded: 63 },
  { initials: "HS", name: "Hannah Seo", email: "hannah.seo@kellogg.edu", sessions: 1, sessionsTotal: 2, cohortStatuses: { pe: "completed" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted", plusExpiry: "Aug 15, 2026", lastActive: "2w ago", lastActiveDays: 14, dateAdded: "Feb 15, 2026", daysAdded: 58 },
  { initials: "TO", name: "Tunde Okafor", email: "tunde.okafor@kellogg.edu", sessions: 2, sessionsTotal: 3, cohortStatuses: { ai: "invited" } as Partial<Record<CohortKey, CohortStatus>>, plus: "—", plusExpiry: null, lastActive: "2w ago", lastActiveDays: 14, dateAdded: "Mar 1, 2026", daysAdded: 44 },
];

const PAGE_SIZE = 25;

const userDetailsV2: Record<string, UserDetailV2> = {
  "zoe.park@kellogg.edu": {
    name: "Zoe Park", email: "zoe.park@kellogg.edu", initials: "ZP", dateAdded: "Jan 5, 2026",
    sessions: {
      granted: 3,
      entries: [
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Feb 10, 2026", status: "completed", review: { rating: 5, text: "Jordan gave me a completely fresh perspective on how to structure my IB story. Specific, actionable, and incredibly well-prepared." } },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Apr 25, 2026", status: "scheduled" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("ib", "enrolled", { review: { rating: 5, text: "Incredibly well-structured and the coaches had real recruiting experience. I felt prepared going into every interview." } }),
      cohortEntry("pe", "invited", { inviteSent: "Mar 25, 2026" }),
    ],
    plus: { status: "active", grantedDate: "Feb 15, 2026", expiry: "Aug 15, 2026" },
  },
  "sarah.kim@kellogg.edu": {
    name: "Sarah Kim", email: "sarah.kim@kellogg.edu", initials: "SK", image: userImg1, dateAdded: "Jan 10, 2026",
    sessions: {
      granted: 4,
      entries: [
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Mar 28, 2026", status: "completed", review: { rating: 5, text: "Jordan was incredibly well-prepared and gave me concrete feedback I could act on immediately. Every suggestion was specific, actionable, and calibrated to exactly where I am in the process." } },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Feb 14, 2026", status: "completed" },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Apr 18, 2026", status: "scheduled" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("ib", "enrolled", { review: { rating: 5, text: "Exactly what I needed — structured, fast-paced, and the instructors had real deal experience." } }),
      cohortEntry("pe", "invited", { inviteSent: "Mar 25, 2026" }),
    ],
    plus: { status: "active", expiry: "Jul 10, 2026" },
  },
  "raj.patel@kellogg.edu": {
    name: "Raj Patel", email: "raj.patel@kellogg.edu", initials: "RP", image: userImg2, dateAdded: "Jan 10, 2026",
    sessions: {
      granted: 3,
      entries: [
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Mar 15, 2026", status: "completed", review: { rating: 5, text: "Priya gave me a completely different perspective on how to frame my background. Game-changer." } },
        { date: "—", status: "unbooked" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("ib", "invited", { inviteSent: "Mar 20, 2026" }),
    ],
    plus: { status: "active", expiry: "Jul 10, 2026" },
  },
  "mia.chen@kellogg.edu": {
    name: "Mia Chen", email: "mia.chen@kellogg.edu", initials: "MC", image: userImg4, dateAdded: "Jan 15, 2026",
    cohorts: [
      cohortEntry("ib", "enrolled"),
      cohortEntry("ai", "enrolled", { review: { rating: 4, text: "Great content, though I wished there was more time for hands-on exercises." } }),
    ],
  },
  "evan.torres@kellogg.edu": {
    name: "Evan Torres", email: "evan.torres@kellogg.edu", initials: "ET", image: userImg5, dateAdded: "Jan 15, 2026",
    sessions: {
      granted: 4,
      entries: [
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Mar 22, 2026", status: "completed", review: { rating: 4, text: "Very thorough session. Alex clearly knows the PE recruiting process inside out." } },
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Feb 5, 2026", status: "completed" },
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Apr 28, 2026", status: "scheduled" },
        { date: "—", status: "unbooked" },
      ],
    },
    plus: { status: "active", expiry: "Jul 15, 2026" },
  },
  "aisha.lee@kellogg.edu": {
    name: "Aisha Lee", email: "aisha.lee@kellogg.edu", initials: "AL", image: userImg3, dateAdded: "Feb 1, 2026",
    sessions: {
      granted: 3,
      entries: [
        { date: "—", status: "unbooked" },
        { date: "—", status: "unbooked" },
        { date: "—", status: "unbooked" },
      ],
    },
    plus: { status: "active", expiry: "Aug 1, 2026" },
  },
  "jordan.lee@kellogg.edu": {
    name: "Jordan Lee", email: "jordan.lee@kellogg.edu", initials: "JL", dateAdded: "Jan 20, 2026",
    sessions: {
      granted: 3,
      entries: [
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Mar 5, 2026", status: "completed", review: { rating: 5, text: "Helped me see exactly how to position my background for on-cycle PE recruiting. Really valuable." } },
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Feb 3, 2026", status: "completed" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("pe", "completed"),
    ],
    plus: { status: "active", expiry: "Jul 20, 2026" },
  },
  "priya.mehta@kellogg.edu": {
    name: "Priya Mehta", email: "priya.mehta@kellogg.edu", initials: "PM", dateAdded: "Jan 20, 2026",
    sessions: {
      granted: 2,
      entries: [
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Mar 12, 2026", status: "completed" },
        { date: "—", status: "unbooked" },
      ],
    },
    plus: { status: "active", expiry: "Jul 20, 2026" },
  },
  "daniel.wu@kellogg.edu": {
    name: "Daniel Wu", email: "daniel.wu@kellogg.edu", initials: "DW", dateAdded: "Feb 3, 2026",
    cohorts: [
      cohortEntry("ib", "enrolled"),
    ],
  },
  "nina.brooks@kellogg.edu": {
    name: "Nina Brooks", email: "nina.brooks@kellogg.edu", initials: "NB", dateAdded: "Jan 25, 2026",
    sessions: {
      granted: 4,
      entries: [
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Apr 2, 2026", status: "completed", review: { rating: 5, text: "Incredibly insightful. Left with a completely clear action plan and more confidence going into interviews." } },
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Mar 14, 2026", status: "completed" },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Feb 20, 2026", status: "completed" },
        { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Apr 22, 2026", status: "scheduled" },
      ],
    },
    plus: { status: "active", expiry: "Jul 25, 2026" },
  },
  "carlos.rivera@kellogg.edu": {
    name: "Carlos Rivera", email: "carlos.rivera@kellogg.edu", initials: "CR", dateAdded: "Feb 10, 2026",
    plus: { status: "expired", expiry: "Apr 10, 2026" },
  },
  "hannah.seo@kellogg.edu": {
    name: "Hannah Seo", email: "hannah.seo@kellogg.edu", initials: "HS", dateAdded: "Feb 15, 2026",
    sessions: {
      granted: 2,
      entries: [
        { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Feb 28, 2026", status: "completed" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("pe", "completed"),
    ],
    plus: { status: "active", expiry: "Aug 15, 2026" },
  },
  "tunde.okafor@kellogg.edu": {
    name: "Tunde Okafor", email: "tunde.okafor@kellogg.edu", initials: "TO", dateAdded: "Mar 1, 2026",
    sessions: {
      granted: 3,
      entries: [
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Apr 8, 2026", status: "completed" },
        { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Mar 3, 2026", status: "completed" },
        { date: "—", status: "unbooked" },
      ],
    },
    cohorts: [
      cohortEntry("ai", "invited", { inviteSent: "Apr 1, 2026" }),
    ],
  },
};

// Shared Verizon cohort invites for all users
const verizonCohorts: CohortEntry[] = [
  cohortEntry("ib", "invited", { inviteSent: "Jun 5, 2026" }),
  cohortEntry("pe", "invited", { inviteSent: "Jun 5, 2026" }),
];

const verizonUserDetailsV2: Record<string, UserDetailV2> = {
  "zoe.park@kellogg.edu": {
    name: "Zoe Park", email: "zoe.park@kellogg.edu", initials: "ZP", dateAdded: "Jan 5, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 8, 2026", status: "completed" },
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 22, 2026", status: "scheduled" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "sarah.kim@kellogg.edu": {
    name: "Sarah Kim", email: "sarah.kim@kellogg.edu", initials: "SK", image: userImg1, dateAdded: "Jan 10, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Jul 10, 2026", status: "completed" },
      { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Jul 24, 2026", status: "scheduled" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "raj.patel@kellogg.edu": {
    name: "Raj Patel", email: "raj.patel@kellogg.edu", initials: "RP", image: userImg2, dateAdded: "Jan 10, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Jul 14, 2026", status: "completed" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "mia.chen@kellogg.edu": {
    name: "Mia Chen", email: "mia.chen@kellogg.edu", initials: "MC", image: userImg4, dateAdded: "Jan 15, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 29, 2026", status: "scheduled" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "evan.torres@kellogg.edu": {
    name: "Evan Torres", email: "evan.torres@kellogg.edu", initials: "ET", image: userImg5, dateAdded: "Jan 15, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Jul 9, 2026", status: "completed" },
      { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Jul 21, 2026", status: "completed" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "aisha.lee@kellogg.edu": {
    name: "Aisha Lee", email: "aisha.lee@kellogg.edu", initials: "AL", image: userImg3, dateAdded: "Feb 1, 2026",
    sessions: { granted: 2, entries: [
      { date: "—", status: "unbooked" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "jordan.lee@kellogg.edu": {
    name: "Jordan Lee", email: "jordan.lee@kellogg.edu", initials: "JL", dateAdded: "Jan 20, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Jul 11, 2026", status: "completed" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "priya.mehta@kellogg.edu": {
    name: "Priya Mehta", email: "priya.mehta@kellogg.edu", initials: "PM", dateAdded: "Jan 20, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 15, 2026", status: "completed" },
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 28, 2026", status: "scheduled" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "daniel.wu@kellogg.edu": {
    name: "Daniel Wu", email: "daniel.wu@kellogg.edu", initials: "DW", dateAdded: "Feb 3, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Jul 30, 2026", status: "scheduled" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "nina.brooks@kellogg.edu": {
    name: "Nina Brooks", email: "nina.brooks@kellogg.edu", initials: "NB", dateAdded: "Jan 25, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 7, 2026", status: "completed" },
      { coach: "Jordan Lee", coachImg: coachImg1, coachHeadline: "Ex-Goldman Sachs IB · Wharton MBA", date: "Jul 18, 2026", status: "completed" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "carlos.rivera@kellogg.edu": {
    name: "Carlos Rivera", email: "carlos.rivera@kellogg.edu", initials: "CR", dateAdded: "Feb 10, 2026",
    sessions: { granted: 2, entries: [
      { date: "—", status: "unbooked" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "hannah.seo@kellogg.edu": {
    name: "Hannah Seo", email: "hannah.seo@kellogg.edu", initials: "HS", dateAdded: "Feb 15, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Priya N.", coachImg: coachImg2, coachHeadline: "Ex-McKinsey · KKR Portfolio Ops", date: "Jul 16, 2026", status: "completed" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
  "tunde.okafor@kellogg.edu": {
    name: "Tunde Okafor", email: "tunde.okafor@kellogg.edu", initials: "TO", dateAdded: "Mar 1, 2026",
    sessions: { granted: 2, entries: [
      { coach: "Alex Morgan", coachImg: coachImg3, coachHeadline: "Ex-Blackstone PE · Harvard MBA", date: "Jul 31, 2026", status: "scheduled" },
      { date: "—", status: "unbooked" },
    ]},
    cohorts: verizonCohorts,
    plus: { status: "active", expiry: "Dec 31, 2026" },
  },
};

export default function B2BOverviewV2({ onNavigate, onOpenModal, onNavigateSettings, partnerModel, onSetPartnerModel }: Props) {
  const showVerizon = partnerModel === "per-seat";
  const [page, setPage] = useState(0);
  const [selectedUserV2, setSelectedUserV2] = useState<UserDetailV2 | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [adminOpen, setAdminOpen] = useState(false);
  const [showNonMvp, setShowNonMvp] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const adminRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderVisible(entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [filter, setFilter] = useState<"all" | "active" | "invited">("all");
  const [sort] = useState<"last-active" | "date-added">("date-added");

  const isActive = (u: typeof users[number]) =>
    (u.sessions != null && u.sessions > 0) ||
    Object.values(u.cohortStatuses).some((s) => s === "enrolled" || s === "completed");

  const hasInvitePending = (u: typeof users[number]) =>
    Object.values(u.cohortStatuses).some((s) => s === "invited") ||
    (u.sessionsTotal != null && (u.sessions === 0 || u.sessions === null));

  const filteredUsers = users.filter((u) => {
    if (filter === "active") return isActive(u);
    if (filter === "invited") return hasInvitePending(u);
    return true;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sort === "last-active") return a.lastActiveDays - b.lastActiveDays;
    return a.daysAdded - b.daysAdded;
  });

  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE);
  const pagedUsers = sortedUsers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const visibleUsers = pagedUsers.map((u) => {
    if (!showVerizon) return u;
    const vz = verizonUserDetailsV2[u.email];
    const completedCount = vz?.sessions?.entries.filter((e) => e.status === "completed").length ?? 0;
    return { ...u, sessions: completedCount, sessionsTotal: 2, cohortStatuses: { ib: "invited", pe: "invited" } as Partial<Record<CohortKey, CohortStatus>>, plus: "Granted" as const, plusExpiry: "Dec 31, 2026" };
  });

  const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);
  const [openTooltip, setOpenTooltip] = useState<"sessions" | "cohorts" | "seats" | "active" | null>(null);

  const handleFilter = (f: "all" | "active" | "invited") => { setFilter(f); setPage(0); };

  return (
    <div className="leading-[1.2]">
      {openTooltip && <div className="fixed inset-0 z-40" onClick={() => setOpenTooltip(null)} />}
      {/* Page header + desktop sticky button */}
      <div className="mb-4 flex items-start justify-between sm:mb-8">
        <div ref={headerRef}>
          <h1 className="text-[40px] font-medium leading-[1.5] text-gray-dark">Overview</h1>
          <p className="mt-1 text-[18px] text-[#707070]">{showVerizon ? "Verizon" : "Kellogg School of Management"} &middot; Contract {showVerizon ? "Jul 2026 \u2013 Dec 2026" : "Jan 2025 \u2013 Jun 2026"}</p>
        </div>
        <div className="sticky hidden items-center gap-2 self-start sm:flex" style={{ top: "28px" }}>
          <button
            onClick={onNavigateSettings}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-hover px-4 py-3 text-[16px] font-medium text-gray-dark hover:bg-gray-stroke"
          >
            <img src={settingsIcon} alt="" className="h-4 w-4" />
            Admin Settings
          </button>
          <button
            onClick={() => onOpenModal("invite")}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#038561] px-4 py-3 text-[16px] font-medium text-white shadow-md"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            {partnerModel === "a-la-carte" ? "Grant access" : "Add users"}
          </button>
        </div>
      </div>

      {/* Mobile full-width button — below header, hidden once scrolled */}
      <button
        onClick={() => onOpenModal("invite")}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#038561] px-4 py-3 text-[16px] font-medium text-white shadow-md sm:hidden"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        {partnerModel === "a-la-carte" ? "Grant access" : "Add users"}
      </button>

      {/* Mobile corner button — appears when header scrolls out of view */}
      <AnimatePresence>
        {!headerVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            onClick={() => onOpenModal("invite")}
            className="fixed right-4 top-[72px] z-30 flex items-center gap-2 rounded-lg bg-[#038561] px-4 py-3 text-[16px] font-medium text-white shadow-md sm:hidden"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            {partnerModel === "a-la-carte" ? "Grant access" : "Add users"}
          </motion.button>
        )}
      </AnimatePresence>


      {/* Offering usage + Recent activity — À la Carte */}
      {partnerModel === "a-la-carte" && (() => {
        const offerings = [
          { label: "1:1 Sessions", description: "Personalized coaching with an expert matched to each user's recruiting track.", purchased: 140, used: 102 },
          { label: "Live Course Seats", description: "Instructor-led group programs covering recruiting strategy, technical skills, and more.", purchased: 80, used: 64 },
          { label: "Leland+ Licenses", description: "Unlimited access to Leland's full library of guides, templates, and video content.", purchased: 30, used: 18 },
        ];
        return (
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.8fr] lg:gap-x-col-gap">
            {/* Left: combined stats card */}
            <div className="flex flex-col justify-start gap-5 rounded-lg border border-gray-stroke bg-white p-5">
              <div>
                <div className="mb-2 text-[18px] font-normal text-gray-light">Users added</div>
                <span className="text-[24px] font-medium leading-[1.2] text-gray-dark">64</span>
              </div>
              <div className="border-t border-gray-stroke" />
              <div>
                <div className="mb-2 text-[18px] font-normal text-gray-light">Average rating</div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span className="text-[24px] font-medium leading-[1.2] text-gray-dark">4.8</span>
                  </div>
                  <span className="text-[14px] leading-[1.5] text-gray-light">(112)</span>
                </div>
              </div>
            </div>
            {/* Right: offering utilization */}
            <div>
              <div className="overflow-hidden rounded-lg border border-gray-stroke bg-white">
                {offerings.map(({ label, description, purchased, used }, i) => {
                  const remaining = purchased - used;
                  const remainingCls = "text-gray-light";
                  return (
                    <div key={label}>
                    {i > 0 && <div className="mx-5 border-t border-gray-stroke" />}
                    <div className="flex items-center justify-between gap-6 px-5 py-4">
                      <div className="min-w-0">
                        <div className="text-[16px] font-medium text-gray-dark">{label}</div>
                        <div className="mt-0.5 text-[14px] text-gray-light">{description}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[16px] font-medium text-gray-dark">{used} <span className="font-normal text-gray-light">used</span></div>
                        <div className={`text-[14px] ${remainingCls}`}>{remaining} remaining</div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stats row — Per Seat */}
      {partnerModel === "per-seat" && <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-x-5">
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 flex items-center gap-1.5 text-[18px] font-normal text-gray-light">
            Seats redeemed
            <div className="group relative flex items-center">
              <svg onClick={() => setOpenTooltip(openTooltip === "active" ? null : "active")} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer text-gray-xlight">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div className={`pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[240px] -translate-x-1/2 rounded-lg bg-gray-dark px-3 py-2 text-[13px] font-normal leading-[1.4] text-white shadow-lg transition-opacity group-hover:opacity-100 ${openTooltip === "active" ? "opacity-100" : "opacity-0"}`}>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-dark" />
                Users who completed a session, enrolled in a cohort, or viewed resources in Leland+
              </div>
            </div>
          </div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[30px] font-medium leading-none text-gray-dark">289</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Seats left</div>
          <div className="flex items-baseline gap-[6px] sm:block">
            <div className="text-[30px] font-medium leading-none text-gray-dark">75</div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-stroke bg-white p-5">
          <div className="mb-2 text-[18px] font-normal text-gray-light">Average rating</div>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span className="text-[24px] font-medium leading-[1.2] text-gray-dark">4.8</span>
            </div>
            <span className="text-[14px] leading-[1.5] text-gray-light">(112)</span>
          </div>
        </div>
      </div>}

      {/* Users table */}
      <div className="mt-8">
        <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Users</h2>
        <div className="rounded-lg border border-gray-stroke bg-white shadow-card">
          {/* Bulk action bar — a la carte only */}
          {partnerModel === "a-la-carte" && selectedEmails.size > 0 && (
            <div className="flex items-center gap-3 rounded-t-lg border-b border-gray-stroke bg-white px-4 py-3">
              <button onClick={() => setSelectedEmails(new Set())} className="flex h-11 items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 text-[16px] font-medium text-gray-dark hover:bg-gray-hover">
                {selectedEmails.size} selected
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => { onOpenModal("invite"); }}
                  className="flex h-11 items-center gap-2 rounded-lg bg-[#f5f5f5] px-4 text-[16px] font-medium text-gray-dark hover:bg-[#ebebeb]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Grant access
                </button>
              </div>
            </div>
          )}
          {/* Toolbar */}
          {(partnerModel !== "a-la-carte" || selectedEmails.size === 0) && <div className="flex flex-wrap items-center gap-3 rounded-t-lg border-b border-gray-stroke bg-white px-4 py-3">
            <div className="flex w-full items-center gap-2 rounded-lg border border-gray-stroke px-4 py-3 sm:max-w-[280px] sm:flex-1 sm:w-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="flex-1 border-none bg-transparent text-[16px] text-gray-dark outline-none placeholder:text-gray-xlight"
                placeholder="Search by name or email"
              />
            </div>
            {/* Filter pills + Resend invite — scrollable row */}
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto sm:flex-none">
              {(["all", "active", "invited"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`shrink-0 cursor-pointer rounded-full bg-[#f5f5f5] px-[14px] py-[6px] text-[14px] font-medium text-[#222222] border-[1.5px] transition-colors ${
                    filter === f
                      ? "border-[#222222]"
                      : "border-transparent hover:bg-[#ebebeb]"
                  }`}
                >
                  {f === "invited" ? "Invite pending" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              {filter === "invited" && (
                <button
                  onClick={() => {}}
                  className="ml-2 flex shrink-0 items-center gap-1.5 py-[6px] text-[14px] font-medium text-gray-dark hover:opacity-70"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                  </svg>
                  Resend invite
                </button>
              )}
            </div>
          </div>}
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-stroke">
                  {partnerModel === "a-la-carte" && <th className="bg-[#fafafa] px-4 py-3 text-left">
                    <label className="relative flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-[#CCCCCC]"
                      style={visibleUsers.length > 0 && visibleUsers.every((u) => selectedEmails.has(u.email)) ? { backgroundColor: "#038561", borderColor: "#038561" } : undefined}>
                      <input
                        type="checkbox"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        checked={visibleUsers.length > 0 && visibleUsers.every((u) => selectedEmails.has(u.email))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEmails((prev) => new Set([...prev, ...visibleUsers.map((u) => u.email)]));
                          } else {
                            setSelectedEmails((prev) => { const next = new Set(prev); visibleUsers.forEach((u) => next.delete(u.email)); return next; });
                          }
                        }}
                      />
                      {visibleUsers.length > 0 && visibleUsers.every((u) => selectedEmails.has(u.email)) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </label>
                  </th>}
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark"><div className="max-w-[140px] truncate">User</div></th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">
                    <div className="flex items-center gap-1.5">
                      <span className="max-w-[120px] truncate">1:1 Sessions</span>
                      <div className="group relative flex items-center">
                        <svg onClick={() => setOpenTooltip(openTooltip === "sessions" ? null : "sessions")} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-xlight cursor-pointer">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        <div className={`pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-[220px] -translate-x-1/2 rounded-lg bg-gray-dark px-3 py-2 text-[13px] font-normal leading-[1.4] text-white shadow-lg transition-opacity group-hover:opacity-100 ${openTooltip === "sessions" ? "opacity-100" : "opacity-0"}`}>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-dark" />
                          Sessions used (scheduled or completed) out of total sessions granted
                        </div>
                      </div>
                    </div>
                  </th>
                  {CONTRACT_COHORTS.map((c) => (
                    <th key={c.key} className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark">
                      <div className="group relative max-w-[140px] cursor-default">
                        <div className="truncate">{c.label}</div>
                        <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden whitespace-nowrap rounded-lg bg-gray-dark px-3 py-2 text-[13px] font-normal text-white shadow-lg group-hover:block">
                          {c.label}
                        </div>
                      </div>
                    </th>
                  ))}
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark"><div className="max-w-[140px] truncate">Leland+ Access</div></th>
                  <th className="bg-[#fafafa] px-4 py-3 text-left text-[16px] font-medium leading-[1.2] text-gray-dark"><div className="max-w-[120px] truncate">Date added</div></th>
                  <th className="bg-[#fafafa] px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visibleUsers.map((user, i) => (
                  <tr
                    key={i}
                    className={`cursor-pointer hover:bg-[#fafafa] ${i < visibleUsers.length - 1 ? "border-b border-gray-stroke" : ""}`}
                    onClick={() => {
                      setSelectedUserV2(showVerizon ? (verizonUserDetailsV2[user.email] ?? tableRowToUserDetailV2(user)) : (userDetailsV2[user.email] ?? tableRowToUserDetailV2(user)));
                    }}
                  >
                    {partnerModel === "a-la-carte" && <td className="px-4 py-[14px]" onClick={(e) => e.stopPropagation()}>
                      <label className="relative flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-[#CCCCCC]"
                        style={selectedEmails.has(user.email) ? { backgroundColor: "#038561", borderColor: "#038561" } : undefined}>
                        <input
                          type="checkbox"
                          className="absolute inset-0 cursor-pointer opacity-0"
                          checked={selectedEmails.has(user.email)}
                          onChange={(e) => {
                            setSelectedEmails((prev) => {
                              const next = new Set(prev);
                              e.target.checked ? next.add(user.email) : next.delete(user.email);
                              return next;
                            });
                          }}
                        />
                        {selectedEmails.has(user.email) && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </label>
                    </td>}
                    <td className="px-4 py-[14px]">
                      <div className="flex items-center gap-[10px]">
                        {userDetailsV2[user.email]?.image ? (
                          <img src={userDetailsV2[user.email].image} alt={user.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-xlight text-[14px] font-semibold text-dark-green">
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <div className="text-[16px] font-medium text-gray-dark">{user.name}</div>
                          <div className="text-[14px] text-gray-light">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-[14px]">
                      {user.sessions != null ? (
                        <div>
                          <div className="text-[16px] font-medium text-gray-dark">{user.sessions} <span className="font-normal text-gray-light">/ {user.sessionsTotal}</span></div>
                        </div>
                      ) : <span className="text-[16px] text-gray-light">—</span>}
                    </td>
                    {CONTRACT_COHORTS.map((c) => {
                      const status = user.cohortStatuses[c.key];
                      return (
                        <td key={c.key} className="px-4 py-[14px] text-[16px]">
                          {status === "completed" && <span className="text-gray-dark">Completed</span>}
                          {status === "enrolled" && <span className="text-gray-dark">Enrolled</span>}
                          {status === "invited" && <span className="text-gray-xlight">Invited</span>}
                          {!status && <span className="text-gray-light">—</span>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-[14px]">
                      {user.plus === "Granted" && user.plusExpiry && (
                        <span className="text-[16px] text-gray-dark">
                          Expires {user.plusExpiry.replace(/,\s*\d{4}$/, "")}
                        </span>
                      )}
                      {user.plus === "Expired" && <span className="text-[16px] text-gray-xlight">Expired</span>}
                      {user.plus === "—" && <span className="text-[16px] text-gray-light">—</span>}
                    </td>
                    <td className="px-4 py-[14px] text-[16px] text-gray-light">{user.dateAdded}</td>
                    <td className="px-2 py-2">
                      <div className="relative flex justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(openMenuEmail === user.email ? null : user.email); }}
                          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-xlight hover:bg-gray-hover hover:text-gray-dark"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                        {openMenuEmail === user.email && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuEmail(null)} />
                            <div className="absolute right-0 top-8 z-20 min-w-[152px] overflow-hidden rounded-lg border border-gray-stroke bg-white shadow-card">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(null); }}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-gray-dark hover:bg-gray-hover"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Grant access
                              </button>
                              {hasInvitePending(user) && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpenMenuEmail(null); }}
                                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-gray-dark hover:bg-gray-hover"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
                                  </svg>
                                  Resend invite
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-stroke px-4 py-3">
            <span className="text-[14px] text-gray-light">
              {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedUsers.length)} of {sortedUsers.length} users
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-stroke bg-white text-gray-dark hover:bg-gray-hover disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column: Offerings + Activity */}
      {showNonMvp && <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-x-col-gap">
        {/* Offerings */}
        <div>
          <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Utilization</h2>
          <div className="rounded-lg border border-gray-stroke bg-white p-2 shadow-card">
            {/* 1:1 Coaching */}
            <div
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("utilization")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">1:1 Coaching</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(102/140)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">102 / 140 sessions used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">Individual coach matching for personalized guidance</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Live courses */}
            <div
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("live-courses")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Live courses</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-red" style={{ width: `${(64/66)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">64 / 66 seats used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">Cohort-based programs with live instruction and feedback</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Leland+ */}
            <div
              className="flex cursor-pointer items-center justify-between gap-6 rounded-lg p-3 hover:bg-gray-hover"
              onClick={() => onNavigate("leland-plus")}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-[16px] font-medium text-gray-dark">Leland+</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(6/30)*100}%` }} />
                  </div>
                  <span className="shrink-0 text-[14px] text-gray-light">6 / 30 licenses used</span>
                </div>
                <div className="text-[14px] text-gray-xlight">On-demand access to courses, examples, and tools</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenModal("invite"); }}
                className="shrink-0 p-1 text-gray-dark"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="mb-4 text-[20px] font-medium text-gray-dark">Recent activity</h2>
          <div className="flex flex-col">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-hover">
                {/* Icon */}
                <div className="relative shrink-0">
                  {item.type === "enrollment" ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-hover text-gray-xlight">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                  ) : (
                    <>
                      <img
                        src={(item as { coachImg: string }).coachImg}
                        alt={item.target}
                        className="h-12 w-12 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                      />
                      {item.type === "review" && (
                        <div className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <div className="truncate text-[16px]">
                    <span className="font-medium">{item.name}</span> {item.action}{" "}
                    <span className="font-medium">{item.target}</span>
                  </div>
                  <div className="text-[14px] text-gray-light">{item.time} &middot; {item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>}

      <div className="h-[120px] shrink-0" />

      <B2BUserDrawerV2 user={selectedUserV2} onClose={() => setSelectedUserV2(null)} />

      {/* Prototype toggle */}
      <div ref={adminRef} className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[260px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              <div className="p-2">
              <div className="px-2 pb-2 pt-1 text-[14px] font-medium uppercase tracking-wider text-[#9b9b9b]">Partner model</div>
              <div className="mx-2 mb-1 flex rounded-lg bg-[#f5f5f5] p-[3px]">
                {(["per-seat", "a-la-carte"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onSetPartnerModel(opt)}
                    className={`flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[14px] font-medium transition-colors ${partnerModel === opt ? "bg-white text-gray-dark shadow-sm" : "text-[#707070]"}`}
                  >
                    <span className="whitespace-nowrap">{opt === "per-seat" ? "Per Seat" : "À la Carte"}</span>
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
                <span className="text-[16px] font-medium text-gray-dark">Non-MVP content</span>
                <div className="relative">
                  <input type="checkbox" checked={showNonMvp} onChange={() => setShowNonMvp(!showNonMvp)} className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-[#038561]" />
                  <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#707070" />
            <circle cx="8" cy="8" r="1.5" fill="#707070" />
            <circle cx="13" cy="8" r="1.5" fill="#707070" />
          </svg>
        </button>
      </div>
    </div>
  );
}
