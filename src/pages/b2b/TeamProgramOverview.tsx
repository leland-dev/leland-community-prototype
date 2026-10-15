import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../components/Button";
import { FilterDropdown } from "./B2BOverviewV2";
import { Tag, TagColor, TagSize } from "../../components/leland";
import { useTeam } from "../../contexts/TeamContext";
import { PaymentMethodForm, TermsLinks } from "../../components/PaymentMethodForm";
import { useTeamPrototype } from "../../contexts/TeamPrototypeContext";
import { CohortPickerView, type CohortOption } from "./B2BModals";
import { CoachingCategoryPicker } from "../../components/CoachingCategoryPicker";
import usersGroupIcon from "../../assets/icons/users-group.svg";
import bookOpenIcon from "../../assets/icons/book-open.svg";
import lelandMark from "../../assets/leland-mark.svg";
import userIcon from "../../assets/icons/user.svg";
import settingsIcon from "../../assets/icons/settings.svg";
import pic1 from "../../assets/profile photos/pic-1.png";
import pic3 from "../../assets/profile photos/pic-3.png";
import pic5 from "../../assets/profile photos/pic-5.png";
import pic9 from "../../assets/profile photos/pic-9.png";
import pic11 from "../../assets/profile photos/pic-11.png";
import pic13 from "../../assets/profile photos/pic-13.png";
// Sample build screenshots
import build_triage_agent from "../../assets/img/builds/triage-agent.svg";
import build_metrics_digest from "../../assets/img/builds/metrics-digest.svg";
import build_prompt_library from "../../assets/img/builds/prompt-library.svg";
import build_invoice_reconciliation from "../../assets/img/builds/invoice-reconciliation.svg";
import build_meeting_notes from "../../assets/img/builds/meeting-notes.svg";
import build_onboarding_bot from "../../assets/img/builds/onboarding-bot.svg";
import build_crm_cleanup from "../../assets/img/builds/crm-cleanup.svg";
import build_sales_call_coach from "../../assets/img/builds/sales-call-coach.svg";
import build_lead_brief from "../../assets/img/builds/lead-brief.svg";
import coachPic2 from "../../assets/profile photos/pic-2.png";
import coachPic4 from "../../assets/profile photos/pic-4.png";
import coachPic6 from "../../assets/profile photos/pic-6.png";
import coachPic7 from "../../assets/profile photos/pic-7.png";

// Team overview for the AI Builder Program: seats, engagement, assessments and
// output, plus a team table where each person is at their own point in the program.

// Seats are bought as people are invited, charged to the card on file.
// AI Builder Program seat pricing (sample): live vs async, and limited-time vs extended (annual) access.
type ProgramFormat = "live" | "async";
type ProgramAccess = "limited" | "extended";
const SESSION_PRICE = 200; // 1:1 coaching, per 1-hour session (sample)
const SEAT_PRICES: Record<ProgramFormat, Record<ProgramAccess, number>> = {
  live: { limited: 899, extended: 899 },
  async: { limited: 199, extended: 199 },
};
// Extended access starts after the 3 months included with a seat, and renews until canceled.
type ExtendedBilling = "yearly" | "monthly";
const EXTENDED_PRICES: Record<ExtendedBilling, number> = { yearly: 119, monthly: 29 };
const extendedLabel = (b: ExtendedBilling) => `${usd(EXTENDED_PRICES[b])} / ${b === "yearly" ? "year" : "month"}`;
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
const SESSION_PRICE_LABEL = `${usd(SESSION_PRICE)} / 1-hr session`;
const LEVELS = [1, 2, 3, 4] as const;
type Level = (typeof LEVELS)[number];

type Skill = { name: string; before: number; after?: number };
type Assessment = { level: Level; score: number; date: string; skills: Skill[] };
// After each build, participants answer two free-response questions.
const REFLECTION_QUESTIONS = { learned: "What did you learn?", apply: "How will you apply this in your work?" };
type Reflection = { learned: string; apply: string };
type Submission = { title: string; description: string; date: string; recordingLength: string; link?: string; image?: string; reflection?: Reflection };

type Program =
  | { status: "no-cohort" } // seat assigned, but they haven't picked a cohort yet
  | { status: "not-started"; startDate: string }
  | { status: "in-progress"; startDate: string; level: Level }
  | { status: "completed"; startDate: string };

// A booked 1:1 session: who it is with, when, and (once it is done) a short summary of what was covered.
type CoachSession = { coach: string; coachImg: string; coachHeadline: string; date: string; status: "completed" | "scheduled"; summary?: string };

const COACHES = {
  jordan: { coach: "Jordan Lee", coachImg: coachPic2, coachHeadline: "Ex-Google PM · AI product lead" },
  alex: { coach: "Alex Morgan", coachImg: coachPic4, coachHeadline: "Operator · Chief of Staff, AI strategy" },
  nina: { coach: "Nina Okoye", coachImg: coachPic6, coachHeadline: "Ex-Stripe · Head of Ops automation" },
  sam: { coach: "Sam Reyes", coachImg: coachPic7, coachHeadline: "Career coach · Ex-McKinsey" },
};

type Person = {
  name: string;
  email: string;
  initials: string;
  image?: string; // profile photo; about half the sample people have one
  program: Program | null; // null = no program seat (e.g. coaching only)
  coaching: { granted: number; used: number; lastSession?: string; nextSession?: string; category?: string; sessions?: CoachSession[] } | null;
  lelandPlus?: { expires: string } | null; // Leland+ subscription (sample data)
  plan?: { format: ProgramFormat; access: ProgramAccess; billing?: ExtendedBilling; renewsOn?: string; renewalCanceled?: boolean }; // how the program seat was purchased; extended access renews yearly until canceled
  isAdmin?: boolean; // a team admin (may not have been granted any access yet)
  isYou?: boolean; // the signed-in admin
  programHours?: number; // hours spent in the AI Builder Program (lessons, live sessions, builds); sample data
  lastActive: string; // display text
  lastActiveDays: number | null; // null = hasn't logged in yet
  assessments: Assessment[];
  submissions: Submission[];
};

// Skills aren't tied to one level: a skill can be assessed at several (e.g. Prompting at L1 and L2).
const SKILLS_BY_LEVEL: Record<Level, string[]> = {
  1: ["Prompting", "Evaluating outputs"],
  2: ["Prompting", "Workflow automation", "Tool use"],
  3: ["Workflow automation", "Building agents", "Data connections"],
  4: ["Building agents", "Shipping to teammates", "Measuring impact"],
};

function assess(level: Level, score: number, date: string, withAfter = true): Assessment {
  return {
    level,
    score,
    date,
    skills: SKILLS_BY_LEVEL[level].map((name, i) => ({
      name,
      before: Math.max(20, score - 28 - i * 4),
      after: withAfter ? Math.min(98, score + (i === 0 ? 4 : -3)) : undefined,
    })),
  };
}

// More sample builds on top of each person's originals, so the team has 24 in all.
const EXTRA_BUILDS: Record<string, Submission[]> = {
  "dana.whitfield@flybreeze.com": [
    { title: "Customer health score dashboard", description: "Rolls usage, tickets and NPS into one health score per account.", date: "Aug 20, 2026", recordingLength: "3:22", image: build_metrics_digest },
    { title: "Vendor contract summarizer", description: "Pulls renewal dates, fees and exit terms out of vendor contracts.", date: "Sep 2, 2026", recordingLength: "2:45", image: build_meeting_notes },
    { title: "Quarterly business review builder", description: "Drafts the QBR deck from the dashboard numbers.", date: "Sep 22, 2026", recordingLength: "4:05", image: build_metrics_digest },
    { title: "Slack standup digest", description: "Turns the daily standup thread into a short summary.", date: "Oct 6, 2026", recordingLength: "2:10", image: build_meeting_notes },
  ],
  "marcus.ellery@flybreeze.com": [
    { title: "Expense policy checker", description: "Flags expenses that break policy before they reach finance.", date: "Sep 12, 2026", recordingLength: "3:30", image: build_invoice_reconciliation },
    { title: "Purchase order tracker", description: "Tracks every PO from request to delivery.", date: "Sep 20, 2026", recordingLength: "2:58", image: build_invoice_reconciliation },
    { title: "Vendor risk scorecard", description: "Scores vendors on delivery, cost and concentration risk.", date: "Oct 8, 2026", recordingLength: "3:40", image: build_crm_cleanup },
  ],
  "priya.raman@flybreeze.com": [
    { title: "Interview question generator", description: "Writes structured interview questions for each role.", date: "Sep 24, 2026", recordingLength: "2:34", image: build_prompt_library },
    { title: "New hire FAQ assistant", description: "Answers first-week questions from the onboarding docs.", date: "Oct 7, 2026", recordingLength: "3:05", image: build_onboarding_bot },
  ],
  "lena.okafor@flybreeze.com": [
    { title: "Lead dedupe checker", description: "Catches duplicate leads before they hit the CRM.", date: "Aug 28, 2026", recordingLength: "2:50", image: build_crm_cleanup },
    { title: "Territory assignment helper", description: "Assigns new accounts to reps by territory and load.", date: "Sep 5, 2026", recordingLength: "3:12", image: build_lead_brief },
  ],
  "jonah.bishop@flybreeze.com": [
    { title: "Objection handling trainer", description: "Role-plays common objections and scores the replies.", date: "Sep 29, 2026", recordingLength: "4:15", image: build_sales_call_coach },
    { title: "Pipeline forecast summarizer", description: "Writes the weekly forecast note from CRM data.", date: "Oct 9, 2026", recordingLength: "2:40", image: build_metrics_digest },
  ],
};
const EXTRA_BUILDS_ME: Submission[] = [
  { title: "Team AI usage tracker", description: "Shows how the team is using AI tools week to week.", date: "Oct 2, 2026", recordingLength: "3:18", image: build_metrics_digest },
  { title: "Weekly leadership update writer", description: "Drafts the Friday update from weekly notes.", date: "Oct 10, 2026", recordingLength: "2:26", image: build_meeting_notes },
];

const BASE_PEOPLE: Person[] = [
  {
    name: "Dana Whitfield", programHours: 18, email: "dana.whitfield@flybreeze.com", initials: "DW", image: pic9,
    plan: { format: "live", access: "extended", billing: "yearly", renewsOn: "Jun 2, 2027" }, program: { status: "completed", startDate: "Jun 2, 2026" }, lelandPlus: { expires: "Dec 31, 2026" }, coaching: { granted: 4, used: 3, lastSession: "Sep 22, 2026", nextSession: "Oct 20, 2026", sessions: [
        { ...COACHES.jordan, date: "Jul 8, 2026", status: "completed", summary: "Mapped where AI could take over the weekly reporting grind. Agreed on three candidate workflows and a simple way to measure the time saved. Next step: prototype the metrics digest." },
        { ...COACHES.jordan, date: "Aug 12, 2026", status: "completed", summary: "Reviewed the first prototype and tightened the prompt structure. Talked through how to hand it to the ops team without it becoming a one-person side project." },
        { ...COACHES.alex, date: "Sep 22, 2026", status: "completed", summary: "Planned the rollout of the support triage agent: who reviews what, how to handle edge cases, and what to report back to leadership after the first month." },
        { ...COACHES.alex, date: "Oct 20, 2026", status: "scheduled" },
      ] },
    lastActive: "2h ago", lastActiveDays: 0,
    assessments: [assess(1, 84, "Jun 23, 2026"), assess(2, 79, "Jul 21, 2026"), assess(3, 88, "Aug 18, 2026"), assess(4, 91, "Sep 15, 2026")],
    submissions: [
      { title: "Support ticket triage agent", image: build_triage_agent, description: "Routes inbound tickets by urgency and drafts first replies for the team to review.", date: "Sep 14, 2026", recordingLength: "4:12", link: "https://example.com/triage", reflection: { learned: "How much of triage is really pattern recognition. Once I wrote down what \"urgent\" means for us, the agent got it right most of the time.", apply: "Rolling it out to the support team next month, with a human review step for anything the agent marks as urgent." } },
      { title: "Weekly metrics digest", image: build_metrics_digest, description: "Pulls the dashboard numbers each Monday and writes the exec summary.", date: "Aug 6, 2026", recordingLength: "3:40", reflection: { learned: "That a good summary starts with deciding which three numbers actually matter. The model was the easy part.", apply: "The digest now goes to leadership every Monday, so I no longer pull those numbers by hand." } },
      { title: "Prompt library", image: build_prompt_library, description: "A shared set of tested prompts for the ops team.", date: "Jul 2, 2026", recordingLength: "2:58", reflection: { learned: "Small, tested prompts beat long clever ones, and writing down what worked saves everyone time.", apply: "Sharing the library with the ops team and asking each person to add one prompt a week." } },
    ],
  },
  {
    name: "Marcus Ellery", programHours: 12, email: "marcus.ellery@flybreeze.com", initials: "ME",
    plan: { format: "live", access: "limited" }, program: { status: "in-progress", startDate: "Aug 11, 2026", level: 3 }, coaching: null,
    lastActive: "Yesterday", lastActiveDays: 1,
    assessments: [assess(1, 76, "Sep 1, 2026"), assess(2, 72, "Sep 29, 2026")],
    submissions: [
      { title: "Invoice reconciliation helper", image: build_invoice_reconciliation, description: "Matches invoices to POs and flags mismatches.", date: "Sep 29, 2026", recordingLength: "5:03", link: "https://example.com/invoices", reflection: { learned: "Matching is the easy part. Handling the weird exceptions is where the time goes, so I built the flagging first.", apply: "Finance will use it on next month's close, starting with our three largest vendors." } },
      { title: "Meeting notes summarizer", image: build_meeting_notes, description: "Turns call transcripts into action items.", date: "Sep 1, 2026", recordingLength: "2:31", reflection: { learned: "Asking for action items with owners gives much better notes than asking for a summary.", apply: "Using it on all of our weekly client calls so follow-ups stop slipping." } },
    ],
  },
  {
    name: "Priya Raman", programHours: 9, email: "priya.raman@flybreeze.com", initials: "PR", image: pic3,
    plan: { format: "live", access: "extended", billing: "yearly", renewsOn: "Sep 8, 2027" }, program: { status: "in-progress", startDate: "Sep 8, 2026", level: 2 }, coaching: { granted: 3, used: 1, lastSession: "Sep 30, 2026", nextSession: "Oct 14, 2026", sessions: [
        { ...COACHES.nina, date: "Sep 30, 2026", status: "completed", summary: "Broke the onboarding process into steps an assistant can follow, and decided which checks should stay with a person. Left with a first draft of the checklist bot." },
        { ...COACHES.nina, date: "Oct 14, 2026", status: "scheduled" },
      ] },
    lastActive: "3d ago", lastActiveDays: 3,
    assessments: [assess(1, 81, "Sep 29, 2026")],
    submissions: [
      { title: "Onboarding checklist bot", image: build_onboarding_bot, description: "Walks new hires through their first-week tasks.", date: "Oct 1, 2026", recordingLength: "3:18", reflection: { learned: "How to break a messy process into steps an assistant can follow one at a time.", apply: "Piloting it with the two people who start in November, then adjusting from their feedback." } },
    ],
  },
  {
    name: "Tomás Herrera", programHours: 3, email: "tomas.herrera@flybreeze.com", initials: "TH",
    program: { status: "in-progress", startDate: "Sep 22, 2026", level: 1 }, coaching: null,
    lastActive: "5d ago", lastActiveDays: 5, assessments: [], submissions: [],
  },
  {
    name: "Lena Okafor", programHours: 8, email: "lena.okafor@flybreeze.com", initials: "LO",
    program: { status: "in-progress", startDate: "Jul 14, 2026", level: 3 }, coaching: null,
    lastActive: "3w ago", lastActiveDays: 21,
    assessments: [assess(1, 69, "Aug 4, 2026"), assess(2, 64, "Sep 1, 2026")],
    submissions: [
      { title: "CRM cleanup script", image: build_crm_cleanup, description: "Finds and merges duplicate accounts.", date: "Aug 20, 2026", recordingLength: "3:55", reflection: { learned: "Duplicate detection needs a clear rule for which record wins. I had skipped that at first.", apply: "Running it quarterly on our CRM and sharing the merge rules with sales ops." } },
    ],
  },
  {
    name: "Jonah Bishop", programHours: 12, email: "jonah.bishop@flybreeze.com", initials: "JB", image: pic13,
    plan: { format: "async", access: "extended", billing: "yearly", renewsOn: "Aug 25, 2027" }, program: { status: "in-progress", startDate: "Aug 25, 2026", level: 2 }, coaching: { granted: 2, used: 2, lastSession: "Oct 3, 2026", sessions: [
        { ...COACHES.sam, date: "Sep 12, 2026", status: "completed", summary: "Talked through using the sales call coach in weekly 1:1s and how to give reps feedback without it feeling like surveillance." },
        { ...COACHES.sam, date: "Oct 3, 2026", status: "completed", summary: "Refined the scoring rubric against the team playbook and picked two calls per rep to review each week." },
      ] },
    lastActive: "1d ago", lastActiveDays: 1,
    assessments: [assess(1, 88, "Sep 15, 2026")],
    submissions: [
      { title: "Sales call coach", image: build_sales_call_coach, description: "Scores call recordings against our playbook.", date: "Sep 25, 2026", recordingLength: "4:40", link: "https://example.com/call-coach", reflection: { learned: "Scoring against our own playbook works far better than a generic rubric.", apply: "Using it in weekly 1:1s with reps to pick one call to review together." } },
      { title: "Lead research brief", image: build_lead_brief, description: "Builds a one-page brief for each new lead.", date: "Sep 10, 2026", recordingLength: "2:47", reflection: { learned: "Giving the model a template for the brief matters more than giving it more sources.", apply: "Every new lead gets a brief before the first call, which saves about 20 minutes each." } },
    ],
  },
  {
    name: "Aiko Tanaka", email: "aiko.tanaka@flybreeze.com", initials: "AT", image: pic11,
    program: { status: "not-started", startDate: "Nov 3, 2026" }, coaching: null,
    lastActive: "—", lastActiveDays: null, assessments: [], submissions: [],
  },
  {
    name: "Noah Pierce", email: "noah.pierce@flybreeze.com", initials: "NP",
    program: { status: "no-cohort" }, coaching: null,
    lastActive: "—", lastActiveDays: null, assessments: [], submissions: [],
  },
  {
    name: "Sam Delgado", email: "sam.delgado@flybreeze.com", initials: "SD", image: pic5,
    program: { status: "not-started", startDate: "Oct 12, 2026" }, coaching: { granted: 3, used: 0 },
    lastActive: "—", lastActiveDays: null, assessments: [], submissions: [],
  },
  {
    name: "Renee Castillo", email: "renee.castillo@flybreeze.com", initials: "RC", isAdmin: true,
    program: { status: "in-progress", startDate: "Sep 22, 2026", level: 1 }, coaching: null,
    lastActive: "2d ago", lastActiveDays: 2, assessments: [], submissions: [],
  },
  {
    name: "Rachel Moore", email: "rachel.moore@flybreeze.com", initials: "RM", image: pic1,
    program: null, lelandPlus: { expires: "Dec 31, 2026" }, coaching: { granted: 6, used: 4, lastSession: "Oct 6, 2026", nextSession: "Oct 15, 2026", sessions: [
        { ...COACHES.jordan, date: "Aug 4, 2026", status: "completed", summary: "Set goals for the quarter and sorted which parts of the current role are worth automating first." },
        { ...COACHES.alex, date: "Aug 25, 2026", status: "completed", summary: "Walked through a stakeholder update that had grown too long, and cut it to what each reader actually needs." },
        { ...COACHES.alex, date: "Sep 15, 2026", status: "completed", summary: "Practiced presenting the automation plan to leadership and prepared answers for the likely objections about cost and risk." },
        { ...COACHES.alex, date: "Oct 6, 2026", status: "completed", summary: "Reviewed feedback from the presentation and agreed the next three pilots. Discussed how to staff them without adding headcount." },
        { ...COACHES.alex, date: "Oct 15, 2026", status: "scheduled" },
      ] },
    lastActive: "4d ago", lastActiveDays: 4, assessments: [], submissions: [],
  },
  {
    name: "Victor Nnamdi", email: "victor.nnamdi@flybreeze.com", initials: "VN",
    program: null, coaching: { granted: 4, used: 0 },
    lastActive: "—", lastActiveDays: null, assessments: [], submissions: [],
  },
];
const INITIAL_PEOPLE: Person[] = BASE_PEOPLE.map((p) => ({ ...p, submissions: [...p.submissions, ...(EXTRA_BUILDS[p.email] ?? [])] }));

const initialsOf = (name: string) => name.split(/\s+/).map((p) => p[0]?.toUpperCase()).filter(Boolean).slice(0, 2).join("");

function levelReached(p: Person): Level | 0 {
  if (!p.program) return 0;
  if (p.program.status === "completed") return 4;
  if (p.program.status === "in-progress") return p.program.level;
  return 0;
}

// ── Small pieces ──

const cardCls = "rounded-[12px] border border-gray-stroke bg-white p-5";

function Avatar({ initials, image, size = 36 }: { initials: string; image?: string; size?: number }) {
  if (image) return <img src={image} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-gray-hover text-[12px] font-medium text-gray-dark" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}

function StatusPill({ program }: { program: Program }) {
  const map = {
    "no-cohort": { label: "No cohort selected", color: TagColor.YELLOW },
    "not-started": { label: "Not started", color: TagColor.BLUE },
    "in-progress": { label: "In progress", color: TagColor.GREEN },
    completed: { label: "Completed", color: TagColor.GRAY },
  } as const;
  const m = map[program.status];
  return <Tag text={m.label} tagColor={m.color} size={TagSize.SMALL} />;
}

// A program that is underway or finished (as opposed to waiting on a cohort or start date).
const hasStarted = (p: Person) => p.program?.status === "in-progress" || p.program?.status === "completed";

function programDetail(p: Person): string {
  if (!p.program || p.program.status === "no-cohort") return "";
  if (p.program.status === "not-started") return `Starts ${p.program.startDate}`;
  const lvl = p.program.status === "completed" ? "All 4 levels" : `Level ${p.program.level} of 4`;
  return lvl;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-hover">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}


// ── Grant access modal ──

// Upcoming AI Builder Program cohorts a team can place someone in (sample data).
const TEAM_COHORTS: CohortOption[] = [
  { key: "aibp", label: "AI Builder Program", startDate: "Nov 3, 2026", endDate: "Dec 22, 2026", sessionCount: 8, scheduleDays: ["Tuesdays, 6–7:30 PM ET", "Thursdays, 6–7:30 PM ET"], duration: "90-minute sessions" },
  { key: "aibp", label: "AI Builder Program", startDate: "Jan 12, 2027", endDate: "Mar 2, 2027", sessionCount: 8, scheduleDays: ["Tuesdays, 6–7:30 PM ET", "Thursdays, 6–7:30 PM ET"], duration: "90-minute sessions" },
  { key: "aibp", label: "AI Builder Program", startDate: "Feb 9, 2027", endDate: "Mar 30, 2027", sessionCount: 8, scheduleDays: ["Wednesdays, 6–7:30 PM ET"], duration: "90-minute sessions" },
];
// null = they pick their own cohort from the invite email
type Cohort = { startDate: string; endDate?: string } | null;

type Recipient = { name: string; email: string };
// What the add-team-members dialog can do for the people being added, in any combination: make them admins (no charge),
// and grant an AI Builder Program seat and/or 1:1 coaching. Each checked item gets its own section on the details step.
type GrantOffering = "program" | "coaching" | "admin";
type GrantResult = { recipients: Recipient[]; offerings: GrantOffering[]; format: ProgramFormat; access: ProgramAccess; billing: ExtendedBilling; cohort: Cohort; sessions: number; category: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEPARATORS = /[\s,;]+/;
// first.last@company.com -> "First Last" (people can update their name when they accept).
const nameFromEmail = (email: string) =>
  email.split("@")[0].split(/[._-]+/).filter(Boolean).slice(0, 3).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || email;

type EmailStatus = "ok" | "invalid" | "existing" | "duplicate";

// Several addresses at once: type or paste them, separated by commas, spaces or new lines.
function EmailChipsInput({ emails, draft, statuses, onEmails, onDraft }: {
  emails: string[];
  draft: string;
  statuses: EmailStatus[];
  onEmails: (e: string[]) => void;
  onDraft: (d: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const add = (tokens: string[]) => { const t = tokens.map((x) => x.trim().toLowerCase()).filter(Boolean); if (t.length) onEmails([...emails, ...t]); };
  const commitDraft = () => { if (draft.trim()) { add([draft]); onDraft(""); } };
  const reason: Record<Exclude<EmailStatus, "ok">, string> = { invalid: "Not a valid email address", existing: "Already on your team", duplicate: "Entered more than once" };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[48px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-[8px] border border-gray-stroke bg-white px-2.5 py-2 focus-within:border-primary"
    >
      {emails.map((e, i) => (
        <span
          key={`${e}-${i}`}
          title={statuses[i] !== "ok" ? reason[statuses[i] as Exclude<EmailStatus, "ok">] : undefined}
          className={`inline-flex max-w-full items-center gap-1 rounded-full py-1 pl-3 pr-1.5 text-[14px] ${statuses[i] === "ok" ? "bg-gray-hover text-gray-dark" : "bg-[#FEF3F2] text-[#B42318]"}`}
        >
          <span className="truncate">{e}</span>
          <button
            type="button"
            aria-label={`Remove ${e}`}
            onClick={(ev) => { ev.stopPropagation(); onEmails(emails.filter((_, k) => k !== i)); }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full hover:bg-[#222222]/10"
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" /></svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        inputMode="email"
        autoComplete="off"
        value={draft}
        placeholder={emails.length === 0 ? "name@company.com" : ""}
        aria-label="Email addresses"
        onChange={(ev) => {
          const v = ev.target.value;
          if (!/[\s,;]/.test(v)) return onDraft(v);
          const parts = v.split(SEPARATORS);
          const rest = /[\s,;]$/.test(v) ? "" : (parts.pop() ?? "");
          add(parts);
          onDraft(rest);
        }}
        onPaste={(ev) => {
          const text = ev.clipboardData.getData("text");
          if (!SEPARATORS.test(text.trim())) return; // a single address pastes as normal
          ev.preventDefault();
          add([draft, ...text.split(SEPARATORS)]);
          onDraft("");
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === ",") { if (draft.trim()) { ev.preventDefault(); commitDraft(); } }
          else if (ev.key === "Backspace" && draft === "" && emails.length) onEmails(emails.slice(0, -1));
        }}
        onBlur={commitDraft}
        className="min-w-[160px] flex-1 border-none bg-transparent px-1.5 py-1 text-[14px] text-gray-dark outline-none placeholder:text-gray-xlight"
      />
    </div>
  );
}

// One choice in step one of the add-team-members dialog. All options share this layout so they read as a set.
// A selectable card (several can be checked). An option can put a looping video behind its icon tile, with a white logo mark on top.
function AccessOption({ icon, title, description = "", price, checked, onToggle, videoSrc, markSrc, disabled }: { icon: string; title: string; description?: string; disabled?: boolean; /** leads the subtext, so it's clear which choices cost money */ price?: string; checked: boolean; onToggle: () => void; videoSrc?: string; markSrc?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      className={`flex w-full items-center gap-3 rounded-[12px] border bg-white p-4 text-left transition-colors ${disabled ? "cursor-default opacity-60" : "cursor-pointer hover:bg-gray-hover"} ${checked ? "border-gray-dark" : "border-gray-stroke"}`}
    >
      <span className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] ${videoSrc ? "bg-[#1e2130]" : "bg-gray-hover"}`}>
        {videoSrc && (
          <video src={videoSrc} aria-hidden autoPlay muted loop playsInline preload="auto" className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden" />
        )}
        {markSrc ? (
          <span
            aria-hidden
            className="relative h-6 w-6 bg-white"
            style={{ maskImage: `url("${markSrc}")`, WebkitMaskImage: `url("${markSrc}")`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
          />
        ) : (
          <img src={icon} alt="" className="relative h-6 w-6" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-gray-dark">{title}</span>
        <span className="block text-[14px] text-gray-light">
          {price && <span className="text-gray-dark">{price}</span>}
          {price && description && " · "}
          {description}
        </span>
      </span>
      <span
        aria-hidden
        className="ml-1 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px] border"
        style={checked ? { backgroundColor: "#222222", borderColor: "#222222" } : { borderColor: "#CCCCCC" }}
      >
        {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
    </button>
  );
}

function GrantAccessModal({ open, person, preset, existingEmails, onClose, onGrant }: {
  preset?: GrantOffering[]; // offerings ticked when the dialog opens (e.g. "New admin")
  open: boolean;
  person: Person | null; // set when editing an existing team member
  existingEmails: string[];
  onClose: () => void;
  onGrant: (r: GrantResult) => void;
}) {
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [cohort, setCohort] = useState<Cohort>(null);
  const [picking, setPicking] = useState(false);
  // Three steps: who (emails), what they get, then those options with a confirmation. Granting more to an existing member skips the first.
  const [step, setStep] = useState<"emails" | "type" | "details">("emails");
  const [selected, setSelected] = useState<GrantOffering[]>([]);
  const [sessions, setSessions] = useState(1);
  const [category, setCategory] = useState("");
  const [format, setFormat] = useState<ProgramFormat>("live");
  const [access, setAccess] = useState<ProgramAccess>("limited");
  const [billing, setBilling] = useState<ExtendedBilling>("yearly");
  const [done, setDone] = useState<GrantResult | null>(null);
  const { team, updateTeam } = useTeam();
  const card = team?.card;
  // The card form opens from "Add a card" / "Change". Sending is disabled until a card is on file, so a card is always saved first.
  const [cardStep, setCardStep] = useState(false);
  const [paid, setPaid] = useState<{ card: string; amount: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    setDone(null);
    setEmails([]); setDraft("");
    setCohort(person?.program?.status === "not-started" ? { startDate: person.program.startDate } : null);
    setPicking(false);
    setCardStep(false);
    setPaid(null);
    setStep(person ? "type" : "emails");
    setSelected(preset ?? []);
    setSessions(person?.coaching?.granted ?? 1);
    setCategory(person?.coaching?.category ?? "");
    setFormat(person?.plan?.format ?? "live");
    setAccess(person?.plan?.access ?? "limited");
    setBilling(person?.plan?.billing ?? "yearly");
  }, [open, person, preset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { if (cardStep) setCardStep(false); else if (picking) setPicking(false); else onClose(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, picking, cardStep]);

  // Each typed address is checked; only "ok" ones are invited. A complete address still in the box counts.
  const draftToken = draft.trim().toLowerCase();
  const all = [...emails, ...(EMAIL_RE.test(draftToken) ? [draftToken] : [])];
  const statuses: EmailStatus[] = all.map((e, i) =>
    !EMAIL_RE.test(e) ? "invalid" : existingEmails.includes(e) ? "existing" : all.indexOf(e) !== i ? "duplicate" : "ok",
  );
  const recipients: Recipient[] = person
    ? [{ name: person.name, email: person.email }]
    : all.filter((_, i) => statuses[i] === "ok").map((e) => ({ name: nameFromEmail(e), email: e }));
  const problems = statuses.slice(0, emails.length).filter((st) => st !== "ok");
  const incompleteDraft = draft.trim() !== "" && !EMAIL_RE.test(draftToken);

  // Everyone invited gets the same access; the charge is per person.
  const count = Math.max(1, recipients.length);
  const wantsProgram = selected.includes("program");
  const wantsCoaching = selected.includes("coaching");
  const wantsAdmin = selected.includes("admin");
  const toggle = (o: GrantOffering) => setSelected((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  const needsSeat = wantsProgram && !person?.program;
  const newSessions = wantsCoaching ? Math.max(0, sessions - (person?.coaching?.granted ?? 0)) : 0;
  const seatPrice = SEAT_PRICES[format][access];
  const programPer = needsSeat ? seatPrice : 0;
  const coachingPer = newSessions * SESSION_PRICE;
  const perPerson = programPer + coachingPer;
  const charge = perPerson * count;
  const valid = selected.length > 0 && recipients.length > 0 && problems.length === 0 && !incompleteDraft;
  // No card on file yet: collect one first, then charge and send in one step.
  const needsCard = charge > 0 && !card;

  const submit = () => {
    const c = card;
    const r: GrantResult = { recipients, offerings: selected, format, access, billing, cohort, sessions, category };
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const stamp = Date.now();
    // One purchase per paid item, for Billing history.
    const purchases = [
      ...(programPer > 0
        ? [{ id: `p-${stamp}-a`, date: today, description: "AI Builder Program", detail: `${count} ${count === 1 ? "seat" : "seats"} · ${format === "live" ? "Live" : "Async"} · ${access === "limited" ? "3 months" : `extended access, then ${extendedLabel(billing)}`}`, amount: programPer * count }]
        : []),
      ...(coachingPer > 0
        ? [{ id: `p-${stamp}-b`, date: today, description: "1:1 coaching", detail: `${count * newSessions} sessions${category ? ` · ${category}` : ""}`, amount: coachingPer * count }]
        : []),
    ];
    // Admins need no seat or payment: they're added to the team with the Admin role.
    const newAdmins = wantsAdmin && !person?.isAdmin ? recipients.map((rec, i) => ({ id: `m-${stamp}-${i}`, name: rec.name, email: rec.email, role: "Admin" as const, access: ["All programs"] })) : [];
    if (wantsProgram || wantsCoaching) onGrant(r);
    // One team update for everything, so nothing overwrites anything else.
    if (newAdmins.length > 0 || purchases.length > 0) {
      updateTeam({
        ...(newAdmins.length > 0 ? { members: [...(team?.members ?? []), ...newAdmins] } : {}),
        ...(purchases.length > 0 ? { purchases: [...purchases, ...(team?.purchases ?? [])] } : {}),
      });
    }
    setPaid(charge > 0 && c ? { card: `${c.brand} ending in ${c.last4}`, amount: charge } : null);
    setDone(r);
  };
  const first = recipients[0];
  const recipientsLine = first ? (recipients.length === 1 ? first.email : `${first.email} and ${recipients.length - 1} other${recipients.length === 2 ? "" : "s"}`) : "";
  const sendLabel = person ? "Save access" : recipients.length > 1 ? `Send ${recipients.length} invites` : "Send invite";
  const offeringName = (o: GrantOffering) => (o === "program" ? "AI Builder Program" : o === "coaching" ? "1:1 coaching" : "Team admin");
  const offeringTitle = selected.length === 1 ? offeringName(selected[0]) : "Review details";

  const inputCls = "h-[48px] w-full rounded-[8px] border border-gray-stroke bg-white px-4 text-[14px] text-gray-dark outline-none focus:border-primary disabled:bg-gray-hover disabled:text-gray-light";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1010] flex items-end justify-center bg-black/40 sm:items-center"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:max-h-[90dvh] sm:w-[520px] sm:max-w-[95vw] sm:rounded-2xl">
            <button onClick={onClose} className="absolute right-0 top-0 z-20 p-2" aria-label="Close">
              <div className="flex items-center justify-center rounded-full border border-gray-stroke bg-white p-[10px] text-gray-dark hover:bg-gray-hover">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" /></svg>
              </div>
            </button>
            {cardStep ? (
              <>
                <div className="relative flex min-h-[56px] shrink-0 items-center justify-center border-b border-gray-stroke px-12">
                  <button type="button" aria-label="Back" onClick={() => setCardStep(false)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-hover">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="text-[16px] font-medium text-gray-dark">{card ? "Update card" : "Add a card"}</span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <PaymentMethodForm
                    initialBilling={team?.billing}
                    initialName={team?.card?.name ?? ""}
                    submitLabel="Save card"
                    terms={
                      <>
                        By saving this card, you authorize Leland to charge it each time you add seats or other purchases to your team.
                        {" "}Extended access renews at the price shown at purchase until you cancel, and we’ll email you before each renewal.
                        {" "}Taxes, if any, are calculated from your billing address. Purchases are subject to our <TermsLinks />.
                      </>
                    }
                    onSubmit={(c, b) => {
                      updateTeam({ card: c, billing: b });
                      setCardStep(false);
                    }}
                  />
                </div>
              </>
            ) : picking ? (
              <CohortPickerView
                cohorts={TEAM_COHORTS}
                isSelected={(c) => cohort?.startDate === c.startDate}
                onPick={(c) => { setCohort(c ? { startDate: c.startDate, endDate: c.endDate } : null); setPicking(false); }}
                onBack={() => setPicking(false)}
                onClose={onClose}
              />
            ) : done ? (
              <>
                <div className="flex flex-col items-center px-6 pb-8 pt-12 text-center">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5]">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#038561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <h3 className="mb-3 font-serif text-[28px] font-medium text-gray-dark">{person ? "Access updated" : done.recipients.length > 1 ? "Invites sent" : "Invite sent"}</h3>
                  <p className="text-[16px] leading-[1.5] text-gray-light">
                    {person
                      ? `${done.recipients[0].name}'s access has been updated.`
                      : done.recipients.length > 1
                        ? `Emails have been sent to ${done.recipients.length} people.`
                        : `An email has been sent to ${done.recipients[0].email}.`}
                  </p>
                  {paid && <p className="mt-2 text-[14px] text-gray-light">We charged {usd(paid.amount)} to your {paid.card}.</p>}
                </div>
                <div className="border-t border-gray-stroke px-6 py-[14px]">
                  <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" onClick={onClose}>Sounds good</Button>
                </div>
              </>
            ) : step === "emails" && !person ? (
              <>
                <div className="px-6 pb-5 pt-6">
                  {/* A small face pile as an example of the people being added */}
                  <div className="mb-4 flex items-center" aria-hidden>
                    {[pic5, pic9, pic3, pic13].map((src, i) => (
                      <img key={i} src={src} alt="" className={`h-10 w-10 rounded-full object-cover ring-2 ring-white ${i > 0 ? "-ml-3" : ""}`} />
                    ))}
                    <span className="-ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f4f4] ring-2 ring-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </span>
                  </div>
                  <h3 className="font-serif text-[28px] font-medium text-gray-dark">Add team members</h3>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <label className="mb-[6px] block text-[14px] text-gray-dark">Email addresses</label>
                  <EmailChipsInput emails={emails} draft={draft} statuses={statuses} onEmails={setEmails} onDraft={setDraft} />
                  {problems.length > 0 && (
                    <p className="mt-[6px] text-[12px] text-[#B42318]">
                      {problems.length === 1 ? "1 address can't be added" : `${problems.length} addresses can't be added`}: invalid, repeated, or already on your team. Remove them to continue.
                    </p>
                  )}
                </div>
                <div className="border-t border-gray-stroke px-6 py-[14px]">
                  <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={recipients.length === 0 || problems.length > 0 || incompleteDraft} onClick={() => setStep("type")}>
                    Continue
                  </Button>
                </div>
              </>
            ) : step === "type" ? (
              <>
                <div className="relative flex min-h-[56px] shrink-0 items-center justify-center border-b border-gray-stroke px-12">
                  {!person && (
                    <button type="button" aria-label="Back" onClick={() => setStep("emails")} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-hover">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                  )}
                  <span className="max-w-full truncate text-[16px] font-medium text-gray-dark">{recipientsLine}</span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
                  <h3 className="mb-5 font-serif text-[28px] font-medium leading-[1.2] text-gray-dark">Grant access</h3>
                  <AccessOption
                    icon={settingsIcon}
                    title="Team admin"
                    description={person?.isAdmin ? "Already a team admin" : "Manage team access and billing"}
                    checked={wantsAdmin || !!person?.isAdmin}
                    disabled={!!person?.isAdmin}
                    onToggle={() => toggle("admin")}
                  />
                  <div className="my-5 flex items-center gap-3 text-[14px] text-gray-light">
                    <span className="h-px flex-1 bg-gray-stroke" />
                    and/or
                    <span className="h-px flex-1 bg-gray-stroke" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <AccessOption
                      icon={bookOpenIcon}
                      title="AI Builder Program"
                      price={person?.program ? undefined : `From ${usd(Math.min(...Object.values(SEAT_PRICES).flatMap((a) => Object.values(a))))} / seat`}
                      description={person?.program ? "Already has a seat" : ""}
                      videoSrc="/videos/animated-gradient-06.mp4"
                      markSrc={lelandMark}
                      checked={wantsProgram || !!person?.program}
                      disabled={!!person?.program}
                      onToggle={() => toggle("program")}
                    />
                    <AccessOption
                      icon={userIcon}
                      title="1:1 coaching"
                      price={SESSION_PRICE_LABEL}
                      description={person?.coaching ? `${person.coaching.granted} ${person.coaching.granted === 1 ? "session" : "sessions"} granted` : ""}
                      checked={wantsCoaching}
                      onToggle={() => toggle("coaching")}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-stroke px-6 py-[14px]">
                  <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={selected.length === 0} onClick={() => setStep("details")}>
                    Continue
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex min-h-[56px] shrink-0 items-center justify-center border-b border-gray-stroke px-12">
                  <button type="button" aria-label="Back" onClick={() => setStep("type")} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-hover">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <span className="text-[16px] font-medium text-gray-dark">{offeringTitle}</span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
                  <p className="mb-5 text-[14px] text-gray-light">
                    For <span className="text-gray-dark">{recipientsLine}</span>
                    {!person && (
                      <>{" "}<button type="button" onClick={() => setStep("emails")} className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px] hover:text-gray-dark">Edit</button></>
                    )}
                  </p>
                  <div className="flex flex-col gap-3">
                  {wantsProgram && (
                  <div className="rounded-[10px] border border-gray-stroke p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[14px] font-medium text-gray-dark">AI Builder Program seat</span>
                        <span className="shrink-0 text-[14px] text-gray-light">
                          {person?.program ? "Already has a seat" : `${usd(seatPrice)} / seat`}
                        </span>
                      </div>
                      {!(person && hasStarted(person)) && (
                        <>
                          {/* Format and access were paid for with the seat, so only a new seat can choose them */}
                          {!person?.program && (<>
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                            <span className="text-[14px] text-gray-dark">Format</span>
                            <FilterDropdown
                              plain underline small alignRight
                              label="Format"
                              value={format}
                              options={[
                                { value: "live", label: "Live", hint: usd(SEAT_PRICES.live[access]) },
                                { value: "async", label: "Async", hint: usd(SEAT_PRICES.async[access]) },
                              ]}
                              onChange={(v) => setFormat(v as ProgramFormat)}
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                            <span className="text-[14px] text-gray-dark">Access</span>
                            <FilterDropdown
                              plain underline small alignRight
                              label="Access"
                              value={access}
                              options={[
                                { value: "limited", label: "Limited time (3 months)", hint: "Included" },
                                { value: "extended", label: "Extended access (renews)", hint: `Then ${extendedLabel(billing)}` },
                              ]}
                              onChange={(v) => setAccess(v as ProgramAccess)}
                            />
                          </div>
                          {access === "extended" && (
                            <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                              <span className="text-[14px] text-gray-dark">Billing after 3 months</span>
                              <FilterDropdown
                                plain underline small alignRight
                                label="Billing"
                                value={billing}
                                options={[
                                  { value: "yearly", label: "Yearly", hint: extendedLabel("yearly") },
                                  { value: "monthly", label: "Monthly", hint: extendedLabel("monthly") },
                                ]}
                                onChange={(v) => setBilling(v as ExtendedBilling)}
                              />
                            </div>
                          )}
                          </>)}
                          {/* Live programs run in cohorts; async is self-paced, so there's no cohort to pick */}
                          {format === "live" && (
                            <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                              <span className="min-w-0 text-[14px] text-gray-dark">
                                {cohort ? `${cohort.startDate}${cohort.endDate ? ` – ${cohort.endDate}` : ""}` : <span className="text-[12px] text-gray-light">Cohort not selected</span>}
                              </span>
                              <Button type="button" size="sm" variant="secondary" rounded="rounded-full" className="shrink-0" onClick={() => setPicking(true)}>
                                {cohort ? "Change cohort" : "Select a cohort"}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                  )}

                  {wantsCoaching && (
                    <div className="rounded-[10px] border border-gray-stroke p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[14px] font-medium text-gray-dark">1:1 coaching</span>
                        <span className="shrink-0 text-[14px] text-gray-light">{SESSION_PRICE_LABEL}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                        <span className="text-[14px] text-gray-dark">Category</span>
                        <CoachingCategoryPicker value={category} onChange={setCategory} />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-stroke pt-3">
                        <span className="text-[14px] text-gray-dark">Sessions</span>
                        <span className="flex items-center overflow-hidden rounded-lg border border-gray-stroke">
                          <button type="button" aria-label="Fewer sessions" onClick={() => setSessions((n) => Math.max(person?.coaching?.granted || 1, n - 1))} className="h-9 w-9 text-[16px] text-gray-dark hover:bg-gray-hover">−</button>
                          <span className="w-9 text-center text-[14px] font-medium text-gray-dark">{sessions}</span>
                          <button type="button" aria-label="More sessions" onClick={() => setSessions((n) => Math.min(12, n + 1))} className="h-9 w-9 text-[16px] text-gray-dark hover:bg-gray-hover">+</button>
                        </span>
                      </div>
                    </div>
                  )}

                  {wantsAdmin && (
                    <p className="text-[14px] leading-[1.5] text-gray-light">
                      {wantsProgram || wantsCoaching
                        ? "They’ll also be added as admins, so they can manage team members, access and billing."
                        : "Admins can manage team members, grant or revoke their access, make others admins, and manage billing details."}
                    </p>
                  )}
                  </div>

                  {charge > 0 && (
                    <>
                    <p className="mb-3 mt-6 text-[16px] font-semibold text-gray-dark">Review</p>
                    <div className={`flex flex-col gap-1.5 rounded-[10px] bg-gray-hover px-4 text-[14px] ${card ? "py-3" : "pb-4 pt-3"}`}>
                      {(count > 1 || (programPer > 0 && coachingPer > 0)) && (
                        <>
                          {programPer > 0 && (
                            <div className="flex items-center justify-between text-gray-light"><span>AI Builder Program · {count} {count === 1 ? "seat" : "seats"}</span><span>{usd(programPer * count)}</span></div>
                          )}
                          {coachingPer > 0 && (
                            <div className="flex items-center justify-between text-gray-light"><span>1:1 coaching · {count * newSessions} {count * newSessions === 1 ? "session" : "sessions"}</span><span>{usd(coachingPer * count)}</span></div>
                          )}
                        </>
                      )}
                      {card && (
                        <div className="flex items-center justify-between text-gray-light">
                          <span>Card</span>
                          <span className="flex items-center gap-2">
                            {card.brand} ending in {card.last4}
                            <button type="button" onClick={() => setCardStep(true)} className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px] hover:text-gray-dark">Change</button>
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between font-medium text-gray-dark"><span>Charged today</span><span>{usd(charge)}</span></div>
                      {programPer > 0 && access === "extended" && (
                        <div className="flex items-center justify-between text-[12px] text-gray-light"><span>Extended access after 3 months, until canceled</span><span>{extendedLabel(billing)}</span></div>
                      )}
                      {/* No card yet: hide the card row and offer a full-width button below the numbers, with room above it */}
                      {!card && (
                        <Button type="button" size="md" variant="dark" rounded="rounded-full" className="mt-4 w-full" onClick={() => setCardStep(true)}>
                          Add a card
                        </Button>
                      )}
                    </div>
                    </>
                  )}
                </div>
                <div className="border-t border-gray-stroke px-6 py-[14px]">
                  <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!valid || needsCard} onClick={() => submit()}>
                    {sendLabel}
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ── Person drawer ──

function ScoreBar({ label, before, after }: { label: string; before: number; after?: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="text-gray-dark">{label}</span>
        <span className="text-gray-light">{before}%{after !== undefined ? ` → ${after}%` : ""}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-[#222222]/[0.08]">
        {after !== undefined && <div className="absolute inset-y-0 left-0 rounded-full bg-gray-dark" style={{ width: `${after}%` }} />}
        <div className={`absolute inset-y-0 left-0 rounded-full ${after !== undefined ? "bg-gray-xlight" : "bg-gray-dark"}`} style={{ width: `${before}%` }} />
      </div>
    </div>
  );
}

// Same card as the partner dashboard's user details: a gray title strip, then the content.
function DrawerSection({ title, pill, children }: { title: string; pill?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-gray-stroke">
      <div className="flex items-center justify-between gap-4 overflow-hidden rounded-t-[11px] border-b border-gray-stroke bg-gray-hover px-4 py-2.5">
        <div className="shrink-0 text-[12px] font-medium text-gray-light">{title}</div>
        {pill && <div className="shrink-0">{pill}</div>}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function DrawerRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-stroke py-3 first:pt-0 last:border-0 last:pb-0">
      <span className="text-[14px] text-gray-light">{label}</span>
      <span className="text-right text-[14px] text-gray-dark">{children}</span>
    </div>
  );
}

function ReflectionAnswers({ r, className = "", clamp }: { r: Reflection; className?: string; clamp?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {(["learned", "apply"] as const).map((k) => (
        <div key={k}>
          {/* Preview cards sit under "What the team is learning", which introduces the first answer */}
          {clamp ? (k === "apply" && <div className="text-[12px] font-medium text-gray-light">How they'll apply it</div>) : <div className="text-[12px] font-medium text-gray-light">{REFLECTION_QUESTIONS[k]}</div>}
          <p className={`${clamp && k === "learned" ? "" : "mt-1"} text-[14px] font-medium leading-[1.4] text-gray-dark ${clamp ? "line-clamp-2" : ""}`}>{r[k]}</p>
        </div>
      ))}
    </div>
  );
}

function SubmissionItem({ sub, by, flat }: { sub: Submission; by?: string; flat?: boolean }) {
  return (
    <div className={flat ? "border-b border-gray-stroke py-4 first:pt-0 last:border-0 last:pb-0" : "rounded-[10px] border border-gray-stroke p-4"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-medium text-gray-dark">{sub.title}</div>
          {by && <div className="mt-0.5 text-[12px] text-gray-light">by {by}</div>}
        </div>
        <div className="shrink-0 text-[12px] text-gray-light">{sub.date}</div>
      </div>
      <p className="mt-1 text-[14px] leading-[1.4] text-gray-light">{sub.description}</p>
      {sub.reflection && <ReflectionAnswers r={sub.reflection} className="mt-3 border-t border-gray-stroke pt-3" />}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-gray-hover px-3 py-1.5 text-[12px] font-medium text-gray-dark hover:bg-[#222222]/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
          Screen recording · {sub.recordingLength}
        </button>
        {sub.link && (
          <a href={sub.link} onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-dark underline">Build link</a>
        )}
      </div>
    </div>
  );
}

function SessionRow({ s, onOpen }: { s: CoachSession; onOpen: () => void }) {
  const name = `${s.coach.split(" ")[0]} ${s.coach.split(" ")[1]?.[0] ?? ""}.`;
  return (
    <div className="border-b border-gray-stroke py-3 first:pt-0 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <img src={s.coachImg} alt={s.coach} className="h-9 w-9 rounded-full object-cover" />
            {s.status === "completed" && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3" /></svg>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="truncate text-[14px] font-medium leading-[1.2] text-gray-dark">With {name}</div>
            <div className="truncate text-[12px] leading-[1.2] text-gray-light">{s.coachHeadline}</div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5 text-right">
          <div className="text-[14px] leading-[1.2] text-gray-dark">{s.status === "completed" ? "Completed" : "Scheduled"}</div>
          <div className="text-[12px] leading-[1.2] text-gray-light">{s.date}</div>
        </div>
      </div>
      {s.summary && (
        <button type="button" onClick={onOpen} className="group mt-3 flex w-full cursor-pointer items-start gap-3 rounded-lg bg-gray-hover px-3 py-2.5 text-left transition-colors hover:bg-[#222222]/[0.07]">
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-medium text-gray-light">Session summary</span>
            <span className="mt-1 line-clamp-2 text-[14px] leading-[1.4] text-gray-dark">{s.summary}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-3 shrink-0 text-gray-xlight group-hover:text-gray-dark"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}
    </div>
  );
}

// A build in the list: a thumbnail (its image, or a play tile for the screen recording), title, short description and date.
function BuildRow({ sub, onOpen }: { sub: Submission; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group flex w-full cursor-pointer items-center gap-3 border-b border-gray-stroke py-3 text-left first:pt-0 last:border-0 last:pb-0">
      <BuildThumb sub={sub} className="w-[96px]" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-gray-dark">{sub.title}</span>
        <span className="mt-0.5 line-clamp-2 text-[14px] leading-[1.4] text-gray-light">{sub.description}</span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-xlight group-hover:text-gray-dark"><polyline points="9 18 15 12 9 6" /></svg>
    </button>
  );
}

// Featured image for a build (a screenshot or thumbnail, always 1.91:1). Without one, a quiet placeholder.
function BuildThumb({ sub, className = "" }: { sub: Submission; className?: string }) {
  return (
    <span className={`relative flex aspect-[1200/630] shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-gray-hover ${className}`}>
      {sub.image ? (
        <img src={sub.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-gray-xlight" aria-hidden><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M21 16l-5-5-8 8" /></svg>
      )}
    </span>
  );
}

function PersonDrawer({ person, onClose, onEdit, onCohort, onRenewal }: { person: Person | null; onClose: () => void; onEdit: (p: Person) => void; onCohort: (email: string, cohort: Cohort) => void; onRenewal: (email: string, canceled: boolean) => void }) {
  const [pickingCohort, setPickingCohort] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  // A child screen inside the modal: the full details of one build or one coaching session.
  const [child, setChild] = useState<{ kind: "build"; sub: Submission } | { kind: "session"; s: CoachSession } | null>(null);
  useEffect(() => { setPickingCohort(false); setConfirmingCancel(false); setChild(null); }, [person?.email]);
  // A live seat that hasn't started can still get (or change) its cohort; it's set here, not in the access flow.
  const canPickCohort = !!person?.program && (person.program.status === "no-cohort" || person.program.status === "not-started") && person.plan?.format !== "async";
  const { showSkills } = useTeamPrototype();
  const { team, updateMember } = useTeam();
  const revokeAdmin = (p: Person) => {
    const m = team?.members.find((x) => x.role === "Admin" && x.email.toLowerCase() === p.email.toLowerCase());
    if (m) updateMember(m.id, { role: "Member" });
    onClose();
  };
  useEffect(() => {
    if (!person) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [person, onClose]);

  return createPortal(
    <AnimatePresence>
      {person && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:h-[75dvh] sm:w-[560px] sm:max-w-[95vw] sm:rounded-2xl">
              {child && person ? (
                <>
                  <div className="relative flex min-h-12 shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
                    <button type="button" aria-label="Back" onClick={() => setChild(null)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-hover">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <span className="text-[16px] font-medium text-gray-dark">{child.kind === "build" ? "Build details" : "Session summary"}</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2"><CloseButton onClick={onClose} /></div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6">
                    {child.kind === "build" ? (
                      <>
                        <BuildThumb sub={child.sub} className="mb-5 w-full !rounded-[12px]" />
                        <h3 className="font-serif text-[28px] font-medium leading-[1.2] text-gray-dark">{child.sub.title}</h3>
                        <div className="mt-1 text-[14px] text-gray-light">by {person.name} · {child.sub.date}</div>
                        <p className="mt-4 text-[16px] leading-[1.5] text-gray-dark">{child.sub.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button size="md" variant="secondary" rounded="rounded-full" className="border border-gray-stroke bg-white hover:bg-gray-hover">Watch screen recording · {child.sub.recordingLength}</Button>
                          {child.sub.link && (
                            <Button size="md" variant="secondary" rounded="rounded-full" className="border border-gray-stroke bg-white hover:bg-gray-hover" onClick={() => window.open(child.sub.link, "_blank")}>Open build</Button>
                          )}
                        </div>
                        {child.sub.reflection && (
                          <div className="mt-6 rounded-[12px] border border-gray-stroke">
                            <div className="overflow-hidden rounded-t-[11px] border-b border-gray-stroke bg-gray-hover px-4 py-2.5 text-[12px] font-medium text-gray-light">Reflection</div>
                            <ReflectionAnswers r={child.sub.reflection} className="px-4 py-4" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <img src={child.s.coachImg} alt={child.s.coach} className="h-12 w-12 rounded-full object-cover" />
                          <div className="min-w-0">
                            <div className="font-serif text-[24px] font-medium leading-[1.2] text-gray-dark">With {child.s.coach}</div>
                            <div className="truncate text-[14px] text-gray-light">{child.s.coachHeadline}</div>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-col rounded-[12px] border border-gray-stroke px-4 py-4">
                          <DrawerRow label="Client">{person.name}</DrawerRow>
                          <DrawerRow label="Date">{child.s.date}</DrawerRow>
                          <DrawerRow label="Status">{child.s.status === "completed" ? "Completed" : "Scheduled"}</DrawerRow>
                        </div>
                        <div className="mt-6 rounded-[12px] border border-gray-stroke">
                          <div className="overflow-hidden rounded-t-[11px] border-b border-gray-stroke bg-gray-hover px-4 py-2.5 text-[12px] font-medium text-gray-light">Summary</div>
                          <p className="px-4 py-4 text-[16px] leading-[1.5] text-gray-dark">{child.s.summary}</p>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : confirmingCancel && person ? (
                <>
                  <div className="relative flex min-h-12 shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
                    <button type="button" aria-label="Back" onClick={() => setConfirmingCancel(false)} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-hover">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <span className="text-[16px] font-medium text-gray-dark">Cancel subscription</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2"><CloseButton onClick={onClose} /></div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6 sm:px-6">
                    <h3 className="mb-3 font-serif text-[28px] font-medium leading-[1.2] text-gray-dark">Cancel {person.name.split(" ")[0]}'s subscription?</h3>
                    <p className="text-[16px] leading-[1.5] text-gray-light">
                      Their extended access won't renew. They keep access until {person.plan?.renewsOn}, and you won't be charged again. You can resume it before then.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-gray-stroke px-4 py-[14px] sm:px-6">
                    <Button size="lg" variant="dark" rounded="rounded-full" className="w-full" onClick={() => { onRenewal(person.email, true); setConfirmingCancel(false); }}>Cancel subscription</Button>
                    <Button size="lg" variant="secondary" rounded="rounded-full" className="w-full" onClick={() => setConfirmingCancel(false)}>Keep subscription</Button>
                  </div>
                </>
              ) : pickingCohort ? (
                <CohortPickerView
                  cohorts={TEAM_COHORTS}
                  isSelected={(c) => person.program?.status === "not-started" && person.program.startDate === c.startDate}
                  onPick={(c) => { onCohort(person.email, c ? { startDate: c.startDate, endDate: c.endDate } : null); setPickingCohort(false); }}
                  onBack={() => setPickingCohort(false)}
                  onClose={onClose}
                />
              ) : (<>
              <div className="relative flex min-h-12 shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
                <span className="text-[16px] font-medium text-gray-dark">{person.name}</span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><CloseButton onClick={onClose} /></div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 pb-2 pt-5 sm:px-6">
                  <div className="font-serif text-[28px] font-medium text-gray-dark">Member details</div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-gray-light">
                    <span>{person.email}</span>
                    {person.isAdmin && <Tag text="Admin" tagColor={TagColor.BLUE} size={TagSize.XS} />}
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Button size="md" variant="secondary" onClick={() => onEdit(person)} className="flex-1 justify-center border border-gray-stroke bg-white hover:bg-gray-hover">Grant additional access</Button>
                  </div>
                </div>

                <div className="flex flex-col gap-5 px-4 pb-10 pt-4 sm:px-6">
                  {person.isAdmin && (
                    <DrawerSection title="Team admin">
                      <p className="text-[14px] leading-[1.4] text-gray-light">Can manage team members, grant or revoke their access, make others admins, and manage billing details.</p>
                      {!person.isYou && <Button size="sm" variant="secondary" rounded="rounded-full" className="mt-3" onClick={() => revokeAdmin(person)}>Revoke admin access</Button>}
                    </DrawerSection>
                  )}

                  {person.program && (
                    <DrawerSection title="AI Builder Program">
                      <div className="flex flex-col">
                        <DrawerRow label="Status"><StatusPill program={person.program} /></DrawerRow>
                        {programDetail(person) && <DrawerRow label="Progress">{programDetail(person)}</DrawerRow>}
                        {person.plan && <DrawerRow label="Plan">{person.plan.format === "live" ? "Live" : "Async"} · {person.plan.access === "limited" ? "3 months" : `Extended${person.plan.billing ? ` · ${extendedLabel(person.plan.billing)}` : ""}`}</DrawerRow>}
                        {/* 3-month access doesn't renew: just show when it ends once they've started */}
                        {person.plan?.access === "limited" && hasStarted(person) && (() => {
                          const end = new Date((person.program as { startDate: string }).startDate);
                          end.setMonth(end.getMonth() + 3);
                          return <DrawerRow label="Access ends">{end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</DrawerRow>;
                        })()}
                        {person.plan?.access === "extended" && person.plan.renewsOn && (
                          <DrawerRow label="Subscription">
                            {person.plan.renewalCanceled ? `Ends ${person.plan.renewsOn}` : `Renews automatically ${person.plan.renewsOn}`}
                            {" · "}
                            <button
                              onClick={() => (person.plan!.renewalCanceled ? onRenewal(person.email, false) : setConfirmingCancel(true))}
                              className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px] hover:text-gray-light"
                            >
                              {person.plan.renewalCanceled ? "Resume" : "Cancel"}
                            </button>
                          </DrawerRow>
                        )}
                        {person.plan?.format === "async" ? (
                          <DrawerRow label="Started">{person.program.status === "no-cohort" ? "Not started" : person.program.startDate}</DrawerRow>
                        ) : (
                          // Live seats run in cohorts: a button to pick or change it while that's still possible, greyed out once it's under way
                          <DrawerRow label="Cohort">
                            <Button
                              size="sm" variant="secondary" rounded="rounded-full"
                              disabled={!canPickCohort}
                              onClick={() => setPickingCohort(true)}
                            >
                              {person.program.status === "no-cohort" ? "Select cohort" : person.program.startDate}
                            </Button>
                          </DrawerRow>
                        )}
                        {person.lastActiveDays !== null && <DrawerRow label="Last active">{person.lastActive}</DrawerRow>}
                      </div>
                    </DrawerSection>
                  )}

                  {person.program && showSkills && (
                    <DrawerSection title="Assessments & skills">
                      {person.assessments.length === 0 ? (
                        <p className="text-[14px] text-gray-light">No assessments completed yet. One is taken after each level.</p>
                      ) : (
                        <div className="flex flex-col gap-5">
                          {person.assessments.map((a) => (
                            <div key={a.level}>
                              <div className="mb-2 flex items-baseline justify-between">
                                <span className="text-[14px] font-medium text-gray-dark">Level {a.level} assessment · Completed</span>
                                <span className="text-[12px] text-gray-light">{a.score}% avg</span>
                              </div>
                              <div className="flex flex-col gap-3">
                                {a.skills.map((s) => <ScoreBar key={s.name} label={s.name} before={s.before} after={s.after} />)}
                              </div>
                            </div>
                          ))}
                          <p className="text-[12px] text-gray-light">Skill results from each assessment. Where a before and after score exist, the bar shows both.</p>
                        </div>
                      )}
                    </DrawerSection>
                  )}

                  {person.program && (
                    <DrawerSection title={`Builds${person.submissions.length ? ` · ${person.submissions.length}` : ""}`}>
                      {person.submissions.length === 0 ? (
                        <p className="text-[14px] text-gray-light">No builds shared yet.</p>
                      ) : (
                        <div className="flex flex-col">
                          {person.submissions.map((sub) => <BuildRow key={sub.title} sub={sub} onOpen={() => setChild({ kind: "build", sub })} />)}
                        </div>
                      )}
                    </DrawerSection>
                  )}

                  {person.coaching && (() => {
                    const c = person.coaching;
                    const done = c.sessions ? c.sessions.filter((x) => x.status === "completed").length : c.used;
                    return (
                      <DrawerSection title="1:1 coaching">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-stroke">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(done / c.granted) * 100}%` }} />
                          </div>
                          <span className="shrink-0 text-[12px] leading-none text-gray-light">{done} of {c.granted} completed</span>
                        </div>
                        {c.sessions && c.sessions.length > 0 ? (
                          <div className="flex flex-col">{c.sessions.map((x, i) => <SessionRow key={i} s={x} onOpen={() => setChild({ kind: "session", s: x })} />)}</div>
                        ) : (
                          <p className="text-[14px] text-gray-light">No sessions booked yet.</p>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-stroke pt-3">
                          <span className="text-[14px] text-gray-light">Category</span>
                          <span className="text-[14px] text-gray-dark">{c.category ?? "Not set"}</span>
                        </div>
                      </DrawerSection>
                    );
                  })()}

                  {person.lelandPlus && (
                    <DrawerSection title="Leland+">
                      <div className="flex flex-col">
                        <DrawerRow label="Status">Active</DrawerRow>
                        <DrawerRow label="Expires">{person.lelandPlus.expires}</DrawerRow>
                      </div>
                    </DrawerSection>
                  )}

                  {!person.program && !person.coaching && !person.lelandPlus && !person.isAdmin && (
                    <p className="text-[14px] text-gray-light">No offerings granted yet. Use Edit access to give {person.name.split(" ")[0]} the AI Builder Program or 1:1 coaching.</p>
                  )}
                </div>
              </div>
              </>)}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Team skill results. Skills aren't tied to one level, so each is listed once: the
// benchmark is a person's first (pre-program) score and "current" their most recent
// result, averaged across the team.
type SkillSummary = {
  name: string;
  assessedAt: Level[];
  benchmark: number | null;
  current: number | null;
  gain: number | null;
  assessed: number; // people with results for this skill
  smallestGains: { name: string; gain: number }[];
};

function computeSkills(people: Person[]): SkillSummary[] {
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((t, x) => t + x, 0) / xs.length) : null);
  const names = [...new Set(LEVELS.flatMap((l) => SKILLS_BY_LEVEL[l]))];
  return names.map((name) => {
    const perPerson = people
      .map((p) => ({ name: p.name, results: p.assessments.flatMap((a) => a.skills.filter((sk) => sk.name === name)) }))
      .filter((r) => r.results.length > 0);
    const withLatest = perPerson
      .map((r) => ({ name: r.name, before: r.results[0].before, after: [...r.results].reverse().find((x) => x.after !== undefined)?.after }))
      .filter((r): r is { name: string; before: number; after: number } => r.after !== undefined);
    const benchmark = avg(perPerson.map((r) => r.results[0].before));
    const current = avg(withLatest.map((r) => r.after));
    return {
      name,
      assessedAt: LEVELS.filter((l) => SKILLS_BY_LEVEL[l].includes(name)),
      benchmark,
      current,
      gain: benchmark !== null && current !== null ? current - benchmark : null,
      assessed: perPerson.length,
      smallestGains: withLatest.map((r) => ({ name: r.name, gain: r.after - r.before })).sort((x, y) => x.gain - y.gain).slice(0, 2),
    };
  });
}

// Headline result: the average improvement across skills that have a post-assessment. It becomes the
// page title, so it's null (and the title falls back to "Overview") until at least one skill has a
// post-score, which keeps it from overstating what the data shows.
function averageSkillGain(people: Person[]): number | null {
  const measured = computeSkills(people).filter((s) => s.gain !== null);
  if (measured.length === 0) return null;
  return Math.round(measured.reduce((t, s) => t + s.gain!, 0) / measured.length);
}

function SkillRow({ skill, open, onToggle }: { skill: SkillSummary; open: boolean; onToggle: () => void }) {
  const measured = skill.current !== null && skill.benchmark !== null;
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} aria-expanded={open} className="block w-full rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-gray-hover">
        <div className="mb-1.5 flex items-center justify-between gap-3 text-[14px]">
          <span className="min-w-0 truncate text-gray-dark">{skill.name}</span>
          {measured ? (
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-[12px] text-gray-light">{skill.benchmark}% → {skill.current}%</span>
              <span className="rounded-full bg-rust/10 px-2 py-1 text-[12px] font-medium leading-none text-rust">{skill.gain! >= 0 ? "+" : ""}{skill.gain}</span>
            </span>
          ) : (
            <span className="shrink-0 text-[12px] text-gray-light">{skill.benchmark === null ? "No results yet" : `Started at ${skill.benchmark}%`}</span>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#222222]/[0.08]">
          {(skill.current ?? skill.benchmark) !== null && (
            <div className={`h-full rounded-full ${measured ? "bg-rust" : "bg-gray-xlight"}`} style={{ width: `${skill.current ?? skill.benchmark}%` }} />
          )}
        </div>
      </button>
      {open && (
        <div className="absolute left-2 top-full z-50 mt-1 w-[260px] max-w-[calc(100%-16px)] rounded-xl border border-gray-stroke bg-white p-4 text-[14px] shadow-lg">
          <div className="font-medium text-gray-dark">{skill.name}</div>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[12px]">
            <dt className="text-gray-light">Started at</dt><dd className="text-right text-gray-dark">{skill.benchmark !== null ? `${skill.benchmark}%` : "—"}</dd>
            <dt className="text-gray-light">Now</dt><dd className="text-right text-gray-dark">{skill.current !== null ? `${skill.current}%` : "—"}</dd>
            <dt className="text-gray-light">Assessed in</dt><dd className="text-right text-gray-dark">{skill.assessedAt.map((l) => `Level ${l}`).join(", ")}</dd>
            <dt className="text-gray-light">People assessed</dt><dd className="text-right text-gray-dark">{skill.assessed}</dd>
          </dl>
          {skill.smallestGains.length > 0 && (
            <div className="mt-3 border-t border-gray-stroke pt-3">
              <div className="mb-1 text-[12px] text-gray-light">Smallest gains</div>
              {skill.smallestGains.map((g) => (
                <div key={g.name} className="flex justify-between text-[12px] text-gray-dark"><span>{g.name}</span><span>{g.gain >= 0 ? "+" : ""}{g.gain}</span></div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Assessment completion (per level) next to the team's skill results.
function TeamSkills({ people }: { people: Person[] }) {
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const levels = LEVELS.map((level) => {
    const reached = people.filter((p) => levelReached(p) >= level).length;
    const taken = people.filter((p) => levelReached(p) >= level && p.assessments.some((a) => a.level === level)).length;
    return { level, reached, taken };
  });
  // Biggest improvements first; skills without a post-score yet go last.
  const skills = computeSkills(people).sort((a, b) => (b.gain ?? -Infinity) - (a.gain ?? -Infinity));
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={cardCls}>
        <h2 className="mb-4 text-[16px] font-semibold text-gray-dark">Assessments completed</h2>
        <div className="flex flex-col gap-4">
          {levels.map((l) => (
            <div key={l.level}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[14px]">
                <span className="text-gray-dark">Level {l.level}</span>
                <span className="text-[12px] text-gray-light">{l.reached === 0 ? "Not reached yet" : `${l.taken} of ${l.reached}`}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#222222]/[0.08]">
                {l.reached > 0 && <div className="h-full rounded-full bg-gray-dark" style={{ width: `${(l.taken / l.reached) * 100}%` }} />}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-gray-xlight">Of people who have reached each level</p>
      </div>

      <div className={`${cardCls} lg:col-span-2`}>
        <h2 className="mb-3 text-[16px] font-semibold text-gray-dark">Skills</h2>
        {openSkill && <div className="fixed inset-0 z-40" onClick={() => setOpenSkill(null)} />}
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 md:grid-cols-2">
          {skills.map((sk) => (
            <SkillRow key={sk.name} skill={sk} open={openSkill === sk.name} onToggle={() => setOpenSkill(openSkill === sk.name ? null : sk.name)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Engagement over time ──

// Running totals of levels completed and builds shared (they only go up), plotted by
// week over an adjustable time window.
const DAY = 86400000;
const startOfWeek = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d.getTime();
};

// Time window options for the chart; 6 months is the default.
const RANGES = [
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "3m", label: "Last 3 months", days: 91 },
  { value: "6m", label: "Last 6 months", days: 182 },
  { value: "12m", label: "Last 12 months", days: 365 },
  { value: "all", label: "All time", days: null },
] as const;
type RangeValue = (typeof RANGES)[number]["value"];

function ActivityChart({ people }: { people: Person[] }) {
  const [range, setRange] = useState<RangeValue>("6m");
  const [hover, setHover] = useState<number | null>(null);

  const { weeks, hours, builds } = useMemo(() => {
    const empty = { weeks: [] as number[], hours: [] as number[], builds: [] as number[] };
    // Hands-on building hours are spread evenly from the week someone started the program to the week they were last active.
    const spans = people
      .filter((p) => (p.programHours ?? 0) > 0 && p.program && "startDate" in p.program && p.lastActiveDays !== null)
      .map((p) => ({ hours: p.programHours as number, from: new Date((p.program as { startDate: string }).startDate).getTime(), to: Date.now() - (p.lastActiveDays as number) * DAY }));
    const levelTimes = spans.map((sp) => sp.from);
    const buildTimes = people.flatMap((p) => p.submissions.map((sub) => new Date(sub.date).getTime()));
    const all = [...levelTimes, ...buildTimes];
    if (all.length === 0) return empty;
    const first = startOfWeek(Math.min(...all));
    const total = Math.round((startOfWeek(Date.now()) - first) / (7 * DAY)) + 1;
    const hourBuckets = () => {
      const out = new Array(total).fill(0);
      spans.forEach((sp) => {
        const i0 = Math.max(0, Math.round((startOfWeek(sp.from) - first) / (7 * DAY)));
        const i1 = Math.min(total - 1, Math.max(i0, Math.round((startOfWeek(sp.to) - first) / (7 * DAY))));
        for (let i = i0; i <= i1; i++) out[i] += sp.hours / (i1 - i0 + 1);
      });
      return out;
    };
    const bucket = (times: number[]) => {
      const out = new Array(total).fill(0);
      times.forEach((t) => { const i = Math.round((startOfWeek(t) - first) / (7 * DAY)); if (i >= 0 && i < total) out[i] += 1; });
      return out;
    };
    const cum = (xs: number[]) => xs.reduce<number[]>((acc, x) => [...acc, (acc[acc.length - 1] ?? 0) + x], []);
    const days = RANGES.find((r) => r.value === range)!.days;
    const from = days === null ? 0 : Math.max(0, Math.round((startOfWeek(Date.now() - days * DAY) - first) / (7 * DAY)));
    // Running totals are computed over the full history, then cut to the window, so a
    // shorter window still starts from what the team had already achieved.
    return {
      weeks: Array.from({ length: total }, (_, i) => first + i * 7 * DAY).slice(from),
      hours: cum(hourBuckets()).slice(from),
      builds: cum(bucket(buildTimes)).slice(from),
    };
  }, [people, range]);

  if (weeks.length < 2) return null;

  const W = 800, H = 220, padL = 30, padR = 30, padT = 12, padB = 26;
  const n = weeks.length;
  const step = (W - padL - padR) / (n - 1);
  const x = (i: number) => padL + i * step;
  // Hours and builds have different units, so each gets its own axis: hours on the left, builds on the right.
  const niceMax = (v: number) => Math.max(4, Math.ceil(v / 4) * 4);
  const maxH = niceMax(Math.max(...hours));
  const maxB = niceMax(Math.max(...builds));
  const yH = (v: number) => padT + (1 - v / maxH) * (H - padT - padB);
  const yB = (v: number) => padT + (1 - v / maxB) * (H - padT - padB);
  const lineOf = (xs: number[], yf: (v: number) => number) => xs.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yf(v).toFixed(1)}`).join(" ");
  const areaOf = (xs: number[], yf: (v: number) => number) => `${lineOf(xs, yf)} L${x(n - 1).toFixed(1)},${yf(0)} L${x(0).toFixed(1)},${yf(0)} Z`;
  const fmt = (t: number) => new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  // Month ticks; January (and the first tick) carry the year once the window crosses a year boundary.
  const crossesYear = new Date(weeks[0]).getFullYear() !== new Date(weeks[n - 1]).getFullYear();
  const monthTicks = weeks
    .map((t, i) => {
      const d = new Date(t);
      const withYear = crossesYear && (i === 0 || d.getMonth() === 0);
      return { i, m: d.getMonth(), label: d.toLocaleDateString("en-US", withYear ? { month: "short", year: "2-digit" } : { month: "short" }) };
    })
    // Skip ticks that would sit on top of the previous one (short windows, many weeks).
    .filter((t, k, arr) => k === 0 || t.m !== arr[k - 1].m)
    .filter((t, k, arr) => k === 0 || (t.i - arr[k - 1].i) * step >= 36);
  const LEVEL_COLOR = "var(--color-rust)";
  const BUILD_COLOR = "var(--color-gray-dark)";
  const h = hover;

  return (
    <div className={`${cardCls} mb-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <h2 className="text-[16px] font-semibold text-gray-dark">Engagement over time</h2>
          <div className="flex items-center gap-4 text-[12px] text-gray-light">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: LEVEL_COLOR }} />Hours building · {Math.round(hours[n - 1])}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: BUILD_COLOR }} />Builds shared · {builds[n - 1]}</span>
          </div>
        </div>
        <FilterDropdown
          plain underline small alignRight
          label="Time window"
          value={range}
          options={RANGES.map((r) => ({ value: r.value, label: r.label }))}
          onChange={(v) => { setRange(v as RangeValue); setHover(null); }}
        />
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Cumulative hours building and builds shared by week"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            setHover(Math.max(0, Math.min(n - 1, Math.round((px - padL) / step))));
          }}
          onMouseLeave={() => setHover(null)}
        >
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={padL} x2={W - padR} y1={yH(maxH * f)} y2={yH(maxH * f)} stroke="#e5e5e5" strokeWidth="1" />
              <text x={padL - 8} y={yH(maxH * f) + 4} textAnchor="end" fontSize="11" fill="#767676">{Math.round(maxH * f)}</text>
              <text x={W - padR + 8} y={yH(maxH * f) + 4} textAnchor="start" fontSize="11" fill="#767676">{Math.round(maxB * f)}</text>
            </g>
          ))}
          {monthTicks.map((t) => (
            <text key={t.i} x={x(t.i)} y={H - 6} textAnchor={t.i === 0 ? "start" : "middle"} fontSize="11" fill="#767676">{t.label}</text>
          ))}
          <path d={areaOf(hours, yH)} fill={LEVEL_COLOR} opacity="0.08" />
          <path d={lineOf(builds, yB)} fill="none" stroke={BUILD_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={lineOf(hours, yH)} fill="none" stroke={LEVEL_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {h !== null && (
            <>
              <line x1={x(h)} x2={x(h)} y1={padT} y2={H - padB} stroke="#a3a3a3" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={x(h)} cy={yB(builds[h])} r="4" fill="white" stroke={BUILD_COLOR} strokeWidth="2" />
              <circle cx={x(h)} cy={yH(hours[h])} r="4" fill="white" stroke={LEVEL_COLOR} strokeWidth="2" />
            </>
          )}
        </svg>

        {h !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-[170px] rounded-lg border border-gray-stroke bg-white px-3 py-2 text-[12px] shadow-lg"
            style={{ left: `${(x(h) / W) * 100}%`, transform: `translateX(${x(h) / W > 0.7 ? "calc(-100% - 12px)" : "12px"})` }}
          >
            <div className="mb-1 font-medium text-gray-dark">{fmt(weeks[h])}</div>
            <div className="flex justify-between text-gray-light"><span>Hours building</span><span className="text-gray-dark">{Math.round(hours[h])}</span></div>
            <div className="flex justify-between text-gray-light"><span>Builds shared</span><span className="text-gray-dark">{builds[h]}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Headline card details ──

function DetailDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[1010] flex items-end justify-center bg-black/40 sm:items-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div role="dialog" aria-label={title} className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:h-auto sm:max-h-[80dvh] sm:w-[560px] sm:max-w-[95vw] sm:rounded-2xl">
        <div className="relative flex min-h-12 shrink-0 items-center justify-center border-b border-gray-stroke px-12 py-2">
          <span className="text-[16px] font-medium text-gray-dark">{title}</span>
          <div className="absolute right-3 top-1/2 -translate-y-1/2"><CloseButton onClick={onClose} /></div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
      </div>
    </motion.div>,
    document.body,
  );
}

// Sample reviews for the ratings dialog (placeholder content for the prototype).
const SAMPLE_REVIEWS = [
  { name: "Dana W.", date: "Sep 16, 2026", rating: 5, text: "I went from using AI occasionally to building tools my whole team relies on. The builds made it real." },
  { name: "Jonah B.", date: "Sep 16, 2026", rating: 5, text: "Practical from day one. The call coach I built is already part of our weekly routine." },
  { name: "Marcus E.", date: "Sep 2, 2026", rating: 5, text: "Clear structure, great feedback on my submissions. I wish it ran longer." },
  { name: "Lena O.", date: "Aug 5, 2026", rating: 4, text: "Strong content. I fell behind for a few weeks but picking back up was easy." },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= n ? "#ffcb47" : "#e5e5e5"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      ))}
    </span>
  );
}

function BuildsDetail({ people }: { people: Person[] }) {
  const all = people
    .flatMap((p) => p.submissions.map((sub) => ({ sub, by: p.name })))
    .sort((a, b) => new Date(b.sub.date).getTime() - new Date(a.sub.date).getTime());
  if (all.length === 0) return <p className="text-[14px] text-gray-light">Builds will appear here as people submit them.</p>;
  return <div className="flex flex-col gap-3">{all.map(({ sub, by }) => <SubmissionItem key={`${by}-${sub.title}`} sub={sub} by={by} />)}</div>;
}

function allReflections(people: Person[]) {
  return people
    .flatMap((p) => p.submissions.filter((sub) => sub.reflection).map((sub) => ({ sub, p })))
    .sort((a, b) => new Date(b.sub.date).getTime() - new Date(a.sub.date).getTime());
}

function ReflectionCard({ p, sub, onOpen }: { p: Person; sub: Submission; onOpen?: () => void }) {
  // With onOpen: a preview that opens the full answers. Without: shown in full, with the date.
  return (
    <div
      {...(onOpen ? {
        role: "button", tabIndex: 0, onClick: onOpen,
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } },
      } : {})}
      className={`flex flex-col justify-between overflow-hidden rounded-[12px] border border-gray-stroke transition-colors ${onOpen ? "cursor-pointer bg-gray-hover hover:border-gray-xlight" : "bg-white"}`}
    >
      <div className="p-5">
        <ReflectionAnswers r={sub.reflection!} clamp={!!onOpen} />
      </div>
      <div className={`flex min-w-0 items-center gap-2 border-t border-gray-stroke px-5 py-3 ${onOpen ? "bg-white" : "bg-cream/50"}`}>
        <span className="min-w-0 flex-1 truncate text-[12px] text-gray-light"><span className="font-semibold text-gray-dark">{p.name}</span> · {sub.title}</span>
        {!onOpen && <span className="shrink-0 text-[12px] text-gray-light">{sub.date}</span>}
      </div>
    </div>
  );
}

function ReflectionsDetail({ people }: { people: Person[] }) {
  const all = allReflections(people);
  if (all.length === 0) return <p className="text-[14px] text-gray-light">Reflections will appear here as people share builds.</p>;
  return <div className="flex flex-col gap-3">{all.map(({ sub, p }) => <ReflectionCard key={`${p.email}-${sub.title}`} p={p} sub={sub} />)}</div>;
}

// The team's latest builds, laid out like the "My programs" carousel on My Leland: a title with prev/next buttons,
// a track of 1.91:1 cards that pages with the buttons (it only free-scrolls by touch), and a "See all" button below.
function TeamBuilds({ people, onSeeAll }: { people: Person[]; onSeeAll: () => void }) {
  const all = people
    .flatMap((p) => p.submissions.map((sub) => ({ p, sub })))
    .sort((a, b) => new Date(b.sub.date).getTime() - new Date(a.sub.date).getTime());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil((el.scrollWidth - 8) / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [all.length]);

  if (all.length === 0) return null;
  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };
  const navBtn = "flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] text-gray-dark transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="mb-5 rounded-[12px] border border-gray-stroke bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-gray-dark">What the team is building</h2>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scrollByPage(-1)} disabled={page <= 0} aria-label="Previous" className={navBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollByPage(1)} disabled={page >= pages - 1} aria-label="Next" className={navBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
      {/* The track runs out to the card edges; its padding keeps the first card aligned with the heading, and the fades soften the cut-off cards. */}
      <div className="relative -mx-5 sm:-mx-6">
        <div ref={scrollRef} className="snap-x snap-mandatory scroll-pl-5 overflow-x-auto py-1 [scrollbar-width:none] sm:scroll-pl-6 sm:overflow-x-hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-start gap-4 px-5 sm:px-6">
            {all.slice(0, 8).map(({ p, sub }) => (
              <div key={`${p.email}-${sub.title}`} onClick={onSeeAll} className="group w-[232px] shrink-0 cursor-pointer snap-start">
                <BuildThumb sub={sub} className="w-full !rounded-[12px] border border-gray-stroke" />
                <h3 className="mt-3 text-[16px] font-semibold leading-snug text-gray-dark">{sub.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-[14px] leading-tight text-gray-light">
                  <Avatar initials={p.initials} image={p.image} size={20} />
                  <span className="truncate">{p.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
      </div>
      <Button size="md" variant="secondary" className="mt-4 font-semibold" onClick={onSeeAll}>
        See all {all.length} {all.length === 1 ? "build" : "builds"}
      </Button>
    </div>
  );
}

function TeamReflections({ people, onSeeAll, onOpen }: { people: Person[]; onSeeAll: () => void; onOpen: (p: Person, sub: Submission) => void }) {
  const all = allReflections(people);
  if (all.length === 0) return null;
  return (
    <div className="mb-5 rounded-[12px] border border-gray-stroke bg-white p-5 sm:p-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-gray-dark">What the team is learning</h2>
      </div>
      <p className="mb-5 text-[14px] text-gray-light">After each build, participants share what they learned and how they'll apply it at work.</p>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {all.slice(0, 3).map(({ sub, p }) => <ReflectionCard key={`${p.email}-${sub.title}`} p={p} sub={sub} onOpen={() => onOpen(p, sub)} />)}
      </div>
      <Button size="md" variant="secondary" className="mt-4 font-semibold" onClick={onSeeAll}>
        See all {all.length} {all.length === 1 ? "response" : "responses"}
      </Button>
    </div>
  );
}

function LevelsDetail({ people }: { people: Person[] }) {
  const rows = people
    .filter((p) => hasStarted(p))
    .sort((a, b) => b.assessments.length - a.assessments.length);
  return (
    <div className="flex flex-col divide-y divide-gray-stroke">
      {rows.map((p) => {
        const last = p.assessments[p.assessments.length - 1];
        return (
          <div key={p.email} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <Avatar initials={p.initials} image={p.image} />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium text-gray-dark">{p.name}</div>
              <div className="text-[12px] text-gray-light">{last ? `Last completed ${last.date}` : "No levels completed yet"}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="flex gap-1" aria-hidden>
                {LEVELS.map((l) => (
                  <span key={l} className={`h-1.5 w-5 rounded-full ${p.assessments.some((a) => a.level === l) ? "bg-gray-dark" : "bg-[#222222]/[0.08]"}`} />
                ))}
              </span>
              <span className="min-w-[40px] whitespace-nowrap text-right text-[12px] text-gray-light">{p.assessments.length} of {LEVELS.length}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Reviews of the coaches your team worked with (not of the program).
const SAMPLE_COACHING_REVIEWS = [
  { name: "Dana W.", coach: "Alex M.", date: "Sep 23, 2026", rating: 5, text: "Alex helped me plan the rollout of the support agent. Practical, specific and exactly what I needed." },
  { name: "Priya R.", coach: "Nina O.", date: "Oct 1, 2026", rating: 5, text: "Nina broke my messy onboarding process into steps I could actually build. I left with a first draft." },
  { name: "Jonah B.", coach: "Sam R.", date: "Oct 4, 2026", rating: 5, text: "Sam gave great advice on getting reps to use the call coach without it feeling like surveillance." },
  { name: "Rachel M.", coach: "Jordan L.", date: "Oct 7, 2026", rating: 4, text: "Helpful and well prepared. I'd like a little more time per session." },
];

function RatingsDetail({ kind = "program" }: { kind?: "program" | "coaching" }) {
  const coaching = kind === "coaching";
  const reviews: { name: string; date: string; rating: number; text: string; coach?: string }[] = coaching ? SAMPLE_COACHING_REVIEWS : SAMPLE_REVIEWS;
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Stars n={5} />
        <span className="text-[16px] font-semibold text-gray-dark">{coaching ? "4.8" : "4.9"}</span>
        <span className="text-[14px] text-gray-light">({coaching ? 6 : 9} team members) · {coaching ? "Average rating of your team's coaches" : "Average team rating of the program"}</span>
      </div>
      <div className="flex flex-col divide-y divide-gray-stroke">
        {reviews.map((r) => (
          <div key={r.name + r.date} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><span className="text-[14px] font-medium text-gray-dark">{r.name}</span><Stars n={r.rating} />{r.coach && <span className="text-[12px] text-gray-light">on {r.coach}</span>}</div>
              <span className="text-[12px] text-gray-light">{r.date}</span>
            </div>
            <p className="mt-1 text-[14px] leading-[1.4] text-gray-light">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──

// People, plus the add/edit access dialog and the person drawer, are shared by the Overview
// and Team members pages; the provider lives in the team layout so state survives navigation.
type PeopleCtx = {
  people: Person[];
  openGrant: (p: Person | null, preset?: GrantOffering[]) => void;
  openPerson: (p: Person) => void;
};
const PeopleContext = createContext<PeopleCtx | null>(null);

function usePeople() {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error("usePeople must be used inside TeamPeopleProvider");
  return ctx;
}

// The signed-in admin's own access in the sample data.
function sampleMe(name: string, email: string): Person {
  return {
    name, email, initials: initialsOf(name), isAdmin: true, isYou: true,
    plan: { format: "live", access: "limited" },
    program: { status: "in-progress", startDate: "Sep 8, 2026", level: 2 },
    coaching: {
      granted: 3, used: 1, lastSession: "Sep 30, 2026", nextSession: "Oct 21, 2026", category: "Product Management",
      sessions: [
        { ...COACHES.jordan, date: "Sep 30, 2026", status: "completed", summary: "Set goals for rolling AI into the team's workflows. Agreed on a first pilot, who owns it, and how to report results after a month." },
        { ...COACHES.jordan, date: "Oct 21, 2026", status: "scheduled" },
      ],
    },
    programHours: 8, lastActive: "Today", lastActiveDays: 0, assessments: [], submissions: EXTRA_BUILDS_ME,
  };
}

export function TeamPeopleProvider({ children }: { children: ReactNode }) {
  const { emptyTeam } = useTeamPrototype();
  const { team } = useTeam();
  // The signed-in admin has the AI Builder Program and coaching themselves. The prototype's "Empty team" switch leaves only them.
  const me = team?.members.find((m) => m.id === "me");
  const startingPeople = (): Person[] => [...(me ? [sampleMe(me.name, me.email)] : []), ...(emptyTeam ? [] : INITIAL_PEOPLE)];
  const [people, setPeople] = useState<Person[]>(startingPeople);
  useEffect(() => { setPeople(startingPeople()); }, [emptyTeam, me?.email]); // eslint-disable-line react-hooks/exhaustive-deps
  const [grantOpen, setGrantOpen] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [preset, setPreset] = useState<GrantOffering[] | undefined>(undefined);
  const [selected, setSelected] = useState<Person | null>(null);

  const openGrant = (p: Person | null, pre?: GrantOffering[]) => { setEditing(p); setPreset(pre); setGrantOpen(true); };

  const setCohortFor = (email: string, c: Cohort) => {
    const upd = (p: Person): Person => {
      if (p.email !== email || !p.program) return p;
      const program: Program = !c ? { status: "no-cohort" } : new Date(c.startDate).getTime() <= Date.now() ? { status: "in-progress", startDate: c.startDate, level: 1 } : { status: "not-started", startDate: c.startDate };
      return { ...p, program };
    };
    setPeople((prev) => prev.map(upd));
    setSelected((sel) => (sel ? upd(sel) : sel));
  };

  const setRenewalCanceled = (email: string, canceled: boolean) => {
    const upd = (p: Person) => (p.email === email && p.plan ? { ...p, plan: { ...p.plan, renewalCanceled: canceled } } : p);
    setPeople((prev) => prev.map(upd));
    setSelected((sel) => (sel ? upd(sel) : sel));
  };

  const handleGrant = (r: GrantResult) => {
    const updatedByEmail = new Map<string, Person>();
    const created: Person[] = [];
    for (const rec of r.recipients) {
      const existing = people.find((p) => p.email === rec.email);
      const cur = existing?.program;
      // Only the chosen offering changes; anything else they already have is left alone.
      // Program: keep a started one as-is; otherwise a live seat goes in the chosen cohort (or waits for them to pick),
      // and an async seat is self-paced, so it starts right away.
      const program: Program | null =
        !r.offerings.includes("program")
          ? cur ?? null
          : cur && (cur.status === "in-progress" || cur.status === "completed")
            ? cur
            : r.format === "async"
              ? { status: "in-progress", startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), level: 1 }
              : !r.cohort
                ? { status: "no-cohort" }
                : new Date(r.cohort.startDate).getTime() <= Date.now()
                  ? { status: "in-progress", startDate: r.cohort.startDate, level: 1 }
                  : { status: "not-started", startDate: r.cohort.startDate };
      const coaching: Person["coaching"] =
        !r.offerings.includes("coaching")
          ? existing?.coaching ?? null
          : { ...existing?.coaching, granted: r.sessions, used: Math.min(existing?.coaching?.used ?? 0, r.sessions), category: r.category || undefined };
      const afterIncluded = new Date(); afterIncluded.setMonth(afterIncluded.getMonth() + 3);
      const plan = r.offerings.includes("program") && !cur
        ? { format: r.format, access: r.access, ...(r.access === "extended" ? { billing: r.billing, renewsOn: afterIncluded.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : {}) }
        : existing?.plan;
      if (existing) {
        updatedByEmail.set(rec.email, { ...existing, program, coaching, plan });
      } else {
        created.push({
          name: rec.name, email: rec.email, initials: initialsOf(rec.name),
          program, coaching,
          plan,
          lastActive: "—", lastActiveDays: null, assessments: [], submissions: [],
        });
      }
    }
    setPeople((prev) => [...created, ...prev.map((p) => updatedByEmail.get(p.email) ?? p)]);
    setSelected((sel) => (sel ? updatedByEmail.get(sel.email) ?? sel : sel));
  };

  return (
    <PeopleContext.Provider value={{ people, openGrant, openPerson: setSelected }}>
      {children}
      <PersonDrawer person={selected} onClose={() => setSelected(null)} onEdit={(p) => { setSelected(null); openGrant(p); }} onCohort={setCohortFor} onRenewal={setRenewalCanceled} />
      <GrantAccessModal open={grantOpen} person={editing} preset={preset} existingEmails={[...people.map((p) => p.email), ...(team?.members.map((m) => m.email) ?? [])].map((e) => e.toLowerCase())} onClose={() => setGrantOpen(false)} onGrant={handleGrant} />
    </PeopleContext.Provider>
  );
}

// Engagement, framed as momentum: how many people practiced recently, how much hands-on time that adds up to per person,
// and what it produced. Program hours are sample data (time in lessons, live sessions and builds).
// The average rating for an offering, shown top right of its section; opens the reviews behind it.
function RatingLink({ rating, count, label, onClick }: { rating: string; count: number; label: string; onClick: () => void }) {
  // No hover box: the number gets our dotted underline when you point at the rating.
  const underline = "group-hover:underline group-hover:decoration-dotted group-hover:decoration-[1.5px] group-hover:underline-offset-[3px]";
  return (
    <button type="button" onClick={onClick} aria-label={label} className="group flex shrink-0 cursor-pointer items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffcb47" stroke="#ffcb47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
      <span className={`text-[14px] font-semibold text-gray-dark ${underline}`}>{rating}</span>
      <span className="text-[14px] text-gray-light">
        {/* Just the number on tablet and mobile; the full wording from desktop up */}
        <span className="lg:hidden">({count})</span>
        <span className="hidden lg:inline">({count} team {count === 1 ? "member" : "members"})</span>
      </span>
    </button>
  );
}

// The part of a figure's caption that opens the detail behind it: our inline text link style.
function FigureLink({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  // A span, not a <button>: buttons are atomic inline boxes, so a link that wraps onto a second line would move as one
  // centered block. A span wraps with the surrounding text and keeps the underline on each line.
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="cursor-pointer text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-light focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-gray-dark/30"
    >
      {children}
    </span>
  );
}

const figureCls = "font-serif text-[28px] font-medium leading-[1.1] text-gray-dark";
const figureLabelCls = "mt-2 text-[14px] leading-[1.4] text-gray-light";

// Engagement, framed as momentum: who is active, how much hands-on time that adds up to per person, and what it produced.
// Program hours are sample data (time in lessons, live sessions and builds).
function TeamPractice({ people, onOpen }: { people: Person[]; onOpen: (k: "active" | "hours" | "builds" | "ratings") => void }) {
  const team = people.filter((p) => p.program || p.coaching);
  const recent = team.filter((p) => p.lastActiveDays !== null && p.lastActiveDays <= 30);
  const practicing = people.filter((p) => (p.programHours ?? 0) > 0);
  const avgHours = practicing.length ? Math.round(practicing.reduce((t, p) => t + (p.programHours ?? 0), 0) / practicing.length) : 0;
  const builds = people.reduce((t, p) => t + p.submissions.length, 0);
  if (team.length === 0 || recent.length === 0) return null;

  return (
    <div className="mb-5 rounded-[12px] border border-gray-stroke bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-gray-dark">AI Transformation</h2>
        <RatingLink rating="4.9" count={9} label="See your team's program reviews" onClick={() => onOpen("ratings")} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-gray-stroke">
        <div className="sm:pr-6">
          <p className={figureCls}>{recent.length} <span className="text-[18px] text-gray-light">of {team.length}</span></p>
          <p className={figureLabelCls}><FigureLink label="See who was active in the last 30 days" onClick={() => onOpen("active")}>active</FigureLink> in the last 30 days</p>
        </div>
        {avgHours > 0 && (
          <div className="sm:px-6">
            <p className={figureCls}>{avgHours} <span className="text-[18px] text-gray-light">{avgHours === 1 ? "hour" : "hours"}</span></p>
            <p className={figureLabelCls}><FigureLink label="See hands-on building hours by person" onClick={() => onOpen("hours")}>hands-on building</FigureLink> per person</p>
          </div>
        )}
        <div className="sm:pl-6">
          <p className={figureCls}>{builds}</p>
          <p className={figureLabelCls}><FigureLink label="See all builds shared" onClick={() => onOpen("builds")}>{builds === 1 ? "build" : "builds"} shared</FigureLink> with the team</p>
        </div>
      </div>
    </div>
  );
}

// 1:1 coaching on its own: sessions completed and booked across the team, and how many people are being coached.
function TeamCoaching({ people, onOpen }: { people: Person[]; onOpen: (k: "coaching" | "coachingRatings") => void }) {
  const coached = people.filter((p) => p.coaching);
  const done = coached.reduce((t, p) => t + p.coaching!.used, 0);
  const booked = coached.reduce((t, p) => t + (p.coaching!.sessions ? p.coaching!.sessions.filter((x) => x.status === "scheduled").length : p.coaching!.nextSession ? 1 : 0), 0);
  if (coached.length === 0 || (done === 0 && booked === 0)) return null;
  return (
    <div className="mb-5 rounded-[12px] border border-gray-stroke bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-gray-dark">1:1 coaching</h2>
        <RatingLink rating="4.8" count={6} label="See your team's reviews of their coaches" onClick={() => onOpen("coachingRatings")} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-gray-stroke">
        <div className="sm:pr-6">
          <p className={figureCls}>{done}</p>
          <p className={figureLabelCls}><FigureLink label="See coaching sessions by person" onClick={() => onOpen("coaching")}>{done === 1 ? "session" : "sessions"} completed</FigureLink></p>
        </div>
        <div className="sm:px-6">
          <p className={figureCls}>{booked}</p>
          <p className={figureLabelCls}><FigureLink label="See coaching sessions by person" onClick={() => onOpen("coaching")}>{booked === 1 ? "session" : "sessions"} booked</FigureLink></p>
        </div>
        <div className="sm:pl-6">
          <p className={figureCls}>{coached.length}</p>
          <p className={figureLabelCls}><FigureLink label="See who is being coached" onClick={() => onOpen("coaching")}>{coached.length === 1 ? "person" : "people"} being coached</FigureLink></p>
        </div>
      </div>
    </div>
  );
}

// ── Details behind the figures ──

function PersonLine({ p, right, sub }: { p: Person; right: ReactNode; sub?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <Avatar initials={p.initials} image={p.image} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-gray-dark">{p.name}</div>
        {sub && <div className="truncate text-[12px] text-gray-light">{sub}</div>}
      </div>
      <div className="shrink-0 text-right text-[14px] text-gray-dark">{right}</div>
    </div>
  );
}

function ActiveDetail({ people }: { people: Person[] }) {
  const rows = people
    .filter((p) => p.program || p.coaching)
    .sort((a, b) => (a.lastActiveDays ?? 999) - (b.lastActiveDays ?? 999));
  return (
    <div className="flex flex-col divide-y divide-gray-stroke">
      {rows.map((p) => (
        <PersonLine key={p.email} p={p} sub={p.lastActiveDays === null ? "Hasn't accepted their invite yet" : activeNote(p)}
          right={p.lastActiveDays === null ? <span className="text-gray-light">Not active yet</span> : <span className={p.lastActiveDays <= 30 ? "" : "text-gray-light"}>Active {p.lastActive}</span>} />
      ))}
    </div>
  );
}

function HoursDetail({ people }: { people: Person[] }) {
  const rows = people.filter((p) => (p.programHours ?? 0) > 0).sort((a, b) => (b.programHours ?? 0) - (a.programHours ?? 0));
  const max = Math.max(1, ...rows.map((p) => p.programHours ?? 0));
  return (
    <div className="flex flex-col divide-y divide-gray-stroke">
      {rows.map((p) => (
        <PersonLine key={p.email} p={p}
          right={
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[#222222]/[0.08]"><span className="block h-full rounded-full bg-gray-dark" style={{ width: `${((p.programHours ?? 0) / max) * 100}%` }} /></span>
              <span className="w-[64px] whitespace-nowrap">{p.programHours} {p.programHours === 1 ? "hour" : "hours"}</span>
            </span>
          } />
      ))}
    </div>
  );
}

function CoachingDetail({ people }: { people: Person[] }) {
  const rows = people.filter((p) => p.coaching).sort((a, b) => b.coaching!.used - a.coaching!.used);
  return (
    <div className="flex flex-col divide-y divide-gray-stroke">
      {rows.map((p) => {
        const c = p.coaching!;
        const next = c.sessions?.find((x) => x.status === "scheduled")?.date ?? c.nextSession;
        return (
          <PersonLine key={p.email} p={p} sub={next ? `Next session ${next}` : c.used >= c.granted ? "All sessions used" : "Nothing booked"}
            right={<span>{c.used} <span className="text-gray-light">of {c.granted} sessions</span></span>} />
        );
      })}
    </div>
  );
}

// Who on the team has accepted their invite and who still needs a nudge. "Invited" = hasn't logged in yet; "Accepted" = has.
// What each person sees next comes from what they've been granted (program and/or coaching).
function invitedNote(p: Person): string {
  if (p.program?.status === "no-cohort") return "Needs to pick a cohort";
  if (p.program?.status === "not-started") return `Program starts ${p.program.startDate}`;
  if (p.coaching && !p.program) return "Hasn't booked a coaching session";
  return "Hasn't joined yet";
}

function activeNote(p: Person): string {
  const parts: string[] = [];
  if (p.program) parts.push(p.program.status === "completed" ? "Program completed" : programDetail(p) ? `Program · ${programDetail(p)}` : "Program");
  if (p.coaching) parts.push(`Coaching · ${p.coaching.used} of ${p.coaching.granted} sessions`);
  return parts.join("  ·  ");
}

function TeamStatus({ people }: { people: Person[] }) {
  const navigate = useNavigate();
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const team = people.filter((p) => !p.isYou && (p.program || p.coaching));
  const invited = team.filter((p) => p.lastActiveDays === null);
  const active = team.filter((p) => p.lastActiveDays !== null);
  if (team.length === 0) return null;

  const remind = (emails: string[]) => setReminded((prev) => new Set([...prev, ...emails]));
  const groupTitle = "text-[14px] font-semibold leading-[1.35] text-gray-dark";

  const Row = ({ p, invitedRow }: { p: Person; invitedRow?: boolean }) => (
    <div className="flex items-center gap-3 border-b border-gray-stroke py-3 first:pt-0 last:border-0 last:pb-0">
      <Avatar initials={p.initials} image={p.image} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-medium text-gray-dark">{p.name}</div>
        <div className="truncate text-[12px] text-gray-light">{invitedRow ? invitedNote(p) : activeNote(p)}</div>
      </div>
      {invitedRow ? (
        <Button
          size="sm"
          variant="secondary"
          rounded="rounded-full"
          className="shrink-0 font-semibold"
          disabled={reminded.has(p.email)}
          onClick={() => remind([p.email])}
        >
          {reminded.has(p.email) ? "Invite sent" : "Resend invite"}
        </Button>
      ) : (
        <span className="hidden shrink-0 text-[12px] text-gray-light sm:inline">Active {p.lastActive}</span>
      )}
    </div>
  );

  return (
    <div className="mb-5 rounded-[12px] border border-gray-stroke bg-white p-5 sm:p-6">
      <h2 className="mb-5 text-[18px] font-semibold text-gray-dark">Your team</h2>

      {/* Invited and accepted sit side by side on desktop, stacked on mobile */}
      <div className={`grid gap-8 ${invited.length > 0 && active.length > 0 ? "lg:grid-cols-2 lg:gap-10" : ""}`}>
      {invited.length > 0 && (
        <div>
          <p className={`${groupTitle} border-b border-gray-stroke pb-3`}>Pending invites <span className="font-normal text-gray-light">{invited.length}</span></p>
          <div className="flex flex-col pt-3">{invited.slice(0, 3).map((p) => <Row key={p.email} p={p} invitedRow />)}</div>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <p className={`${groupTitle} border-b border-gray-stroke pb-3`}>Accepted <span className="font-normal text-gray-light">{active.length}</span></p>
          <div className="flex flex-col pt-3">{active.slice(0, 3).map((p) => <Row key={p.email} p={p} />)}</div>
        </div>
      )}
      </div>

      <Button size="md" variant="secondary" className="mt-5 font-semibold" onClick={() => navigate("/team/members")}>
        See all {team.length} {team.length === 1 ? "member" : "members"}
      </Button>
    </div>
  );
}

// Overview: is the program working? Results, activity and skills; the people live on Team members.
export default function TeamProgramOverview() {
  const { people } = usePeople();
  const navigate = useNavigate();
  const { showSkills } = useTeamPrototype();
  const [openReflection, setOpenReflection] = useState<{ p: Person; sub: Submission } | null>(null);
  const [detail, setDetail] = useState<"builds" | "levels" | "ratings" | "reflections" | "active" | "hours" | "coaching" | "coachingRatings" | null>(null);

  return (
    <div className="leading-[1.2]">
      <h1 className="mb-6 font-serif text-[30px] font-medium leading-[1.15] text-gray-dark sm:mb-8 sm:text-[38px]">Overview</h1>

      <TeamPractice people={people} onOpen={setDetail} />

      <TeamCoaching people={people} onOpen={setDetail} />

      <ActivityChart people={people} />

      <TeamBuilds people={people} onSeeAll={() => setDetail("builds")} />

      {showSkills ? <TeamSkills people={people} /> : <TeamReflections people={people} onSeeAll={() => setDetail("reflections")} onOpen={(p, sub) => setOpenReflection({ p, sub })} />}

      <TeamStatus people={people} />

      <div className="mb-5 text-center sm:text-left">
        <h2 className="leland-heading-base mb-2 font-semibold text-gray-dark">Support</h2>
        <p className="mx-auto max-w-[560px] text-[14px] leading-[1.5] text-gray-light sm:mx-0">
          Need help with your account? Reach out to your Leland success team at{" "}
          <a href="mailto:partnerships@joinleland.com" className="whitespace-nowrap text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-dark">partnerships@joinleland.com</a>
          {" "}or{" "}
          <a href="https://intercom.help/leland-help-center/en/articles/11181753-how-to-submit-a-support-ticket" target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-dark">submit a support ticket</a>.
        </p>
      </div>
      <div className="h-[80px] shrink-0" />

      <AnimatePresence>
        {detail && (
          <DetailDialog
            key={detail}
            title={detail === "builds" ? "Builds shared" : detail === "levels" ? "Levels completed" : detail === "reflections" ? "What the team is learning" : detail === "active" ? "Active in the last 30 days" : detail === "hours" ? "Hands-on building by person" : detail === "coaching" ? "1:1 coaching by person" : detail === "coachingRatings" ? "Reviews of your team's coaches" : "Program reviews from your team"}
            onClose={() => setDetail(null)}
          >
            {detail === "builds" ? <BuildsDetail people={people} /> : detail === "active" ? <ActiveDetail people={people} /> : detail === "hours" ? <HoursDetail people={people} /> : detail === "coaching" ? <CoachingDetail people={people} /> : detail === "reflections" ? <ReflectionsDetail people={people} /> : detail === "levels" ? <LevelsDetail people={people} /> : <RatingsDetail kind={detail === "coachingRatings" ? "coaching" : "program"} />}
          </DetailDialog>
        )}
        {openReflection && (
          <DetailDialog key="reflection" title={openReflection.sub.title} onClose={() => setOpenReflection(null)}>
            <div className="mb-4 flex items-center gap-2.5">
              <Avatar initials={openReflection.p.initials} image={openReflection.p.image} size={28} />
              <div className="min-w-0 flex-1 text-[14px] font-medium text-gray-dark">{openReflection.p.name}</div>
              <div className="shrink-0 text-[12px] text-gray-light">{openReflection.sub.date}</div>
            </div>
            <ReflectionAnswers r={openReflection.sub.reflection!} />
          </DetailDialog>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Team members ──

type Offering = "everyone" | "program" | "coaching" | "plus" | "admins";
const OFFERING_LABEL: Record<Offering, string> = { everyone: "All", program: "AI Builder Program", coaching: "1:1 coaching", plus: "Leland+", admins: "Admins" };

// Everything a person has access to, as tags. Outlined (white) tags so they don't read as a status.
function AccessTags({ p }: { p: Person }) {
  const tags = [p.isAdmin && "Admin", p.program && "AI Builder Program", p.coaching && "Coaching", p.lelandPlus && "Leland+"].filter(Boolean) as string[];
  if (tags.length === 0) return <span className="text-[14px] text-gray-light">—</span>;
  return <div className="flex flex-wrap gap-1">{tags.map((t) => <Tag key={t} text={t} tagColor={t === "Admin" ? TagColor.BLUE : TagColor.WHITE} size={TagSize.XS} />)}</div>;
}

const Dash = () => <span className="text-[14px] text-gray-light">—</span>;
const Plain = ({ children }: { children: ReactNode }) => <span className="whitespace-nowrap text-[14px] text-gray-dark">{children}</span>;

type Col = { key: string; header: string; cell: (p: Person) => ReactNode };

const PROGRAM_COLS: Record<string, Col> = {
  progress: {
    key: "progress", header: "Progress",
    cell: (p) => p.program ? (
      <div className="flex items-center gap-2">
        <StatusPill program={p.program} />
        {programDetail(p) && <span className="whitespace-nowrap text-[14px] text-gray-dark">{programDetail(p)}</span>}
      </div>
    ) : <Dash />,
  },
  started: { key: "started", header: "Started", cell: (p) => (hasStarted(p) ? <Plain>{(p.program as { startDate: string }).startDate}</Plain> : <Dash />) },
  lastActive: { key: "lastActive", header: "Last active", cell: (p) => (p.lastActiveDays === null ? <Dash /> : <Plain>{p.lastActive}</Plain>) },
  assessments: {
    key: "assessments", header: "Assessments",
    cell: (p) => (hasStarted(p) ? <Plain>{p.assessments.length} <span className="text-gray-light">of {LEVELS.length}</span></Plain> : <Dash />),
  },
  // Anyone with a build has been active, but not everyone active has a build, so activity leads
  // and the build count is lighter subtext after it.
  activity: {
    key: "activity", header: "Last active",
    cell: (p) => p.lastActiveDays === null ? <Dash /> : (
      <span className="whitespace-nowrap text-[14px] text-gray-dark">
        {p.lastActive}
        {p.submissions.length > 0 && <span className="text-[12px] text-gray-light"> · {p.submissions.length} {p.submissions.length === 1 ? "build" : "builds"}</span>}
      </span>
    ),
  },
  submissions: { key: "submissions", header: "Submissions", cell: (p) => (p.submissions.length ? <Plain>{p.submissions.length}</Plain> : <Dash />) },
};

const COACHING_USED_COL: Col = {
  key: "sessions", header: "Sessions used",
  cell: (p) => p.coaching ? (
    <div className="flex items-center gap-3">
      <Plain>{p.coaching.used} <span className="text-gray-light">of {p.coaching.granted}</span></Plain>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#222222]/[0.08]">
        <div className="h-full rounded-full bg-gray-dark" style={{ width: `${(p.coaching.used / p.coaching.granted) * 100}%` }} />
      </div>
    </div>
  ) : <Dash />,
};

// Columns for each way of slicing the team. "combined" shows program and coaching side by side.
const COLUMNS: Record<Offering | "combined", Col[]> = {
  program: [PROGRAM_COLS.progress, PROGRAM_COLS.started, PROGRAM_COLS.activity],
  coaching: [
    COACHING_USED_COL,
    { key: "last", header: "Last session", cell: (p) => (p.coaching?.lastSession ? <Plain>{p.coaching.lastSession}</Plain> : <Dash />) },
    { key: "next", header: "Next session", cell: (p) => (p.coaching?.nextSession ? <Plain>{p.coaching.nextSession}</Plain> : <Dash />) },
  ],
  plus: [
    { key: "status", header: "Status", cell: (p) => (p.lelandPlus ? <Tag text="Active" tagColor={TagColor.GREEN} size={TagSize.SMALL} /> : <Dash />) },
    { key: "expires", header: "Expires", cell: (p) => (p.lelandPlus ? <Plain>{p.lelandPlus.expires}</Plain> : <Dash />) },
  ],
  everyone: [PROGRAM_COLS.lastActive],
  admins: [PROGRAM_COLS.lastActive],
  combined: [], // built per team below: one column per offering anyone has

};

const ACCESS_COL: Col = { key: "access", header: "Access", cell: (p) => <AccessTags p={p} /> };

// Team members: manage people. The prototype menu switches how offerings are split up.
export function TeamMembersPage() {
  const { people: granted, openGrant, openPerson } = usePeople();
  // "Invite your team" calls to action elsewhere in the product link here with ?invite=1 to open the add-members flow.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("invite") !== "1") return;
    openGrant(null);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const { team } = useTeam();
  const { membersLayout, showAccessColumn, emptyTeam } = useTeamPrototype();
  const [offeringChoice, setOfferingChoice] = useState<Offering | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  // Admins show up in the full roster even before they've been granted anything, but only in "All":
  // they appear in the program and coaching views once they actually have that access. You, the signed-in admin, are always listed first.
  // The prototype's "Empty team" switch lists nobody but you.
  const admins = (team?.members ?? []).filter((m) => m.role === "Admin" && (!emptyTeam || m.id === "me"));
  const adminEmails = new Set(admins.map((m) => m.email.toLowerCase()));
  const myEmail = team?.members.find((m) => m.id === "me")?.email.toLowerCase();
  const adminOnly: Person[] = admins
    .filter((a) => !granted.some((p) => p.email.toLowerCase() === a.email.toLowerCase()))
    .map((a) => ({ name: a.name, email: a.email, initials: initialsOf(a.name), program: null, coaching: null, lastActive: "—", lastActiveDays: null, assessments: [], submissions: [], isAdmin: true, isYou: a.email.toLowerCase() === myEmail }));
  const roster: Person[] = [...granted.map((p) => ({ ...p, ...(adminEmails.has(p.email.toLowerCase()) ? { isAdmin: true } : {}), isYou: p.email.toLowerCase() === myEmail })), ...adminOnly];
  const people: Person[] = [...roster.filter((p) => p.isYou), ...roster.filter((p) => !p.isYou)];
  // Nobody else has been given the program or coaching yet (you and other admins don't count): nudge the admin to add people.
  const nobodyGranted = people.filter((p) => !p.isYou).every((p) => !p.program && !p.coaching && !p.lelandPlus);
  // You're the only one on the team: a bigger empty state inside the table replaces the header button.
  const onlyYou = people.length === 1 && !!people[0].isYou;
  const programPeople = people.filter((p) => p.program);
  const coachingPeople = people.filter((p) => p.coaching);
  const plusPeople = people.filter((p) => p.lelandPlus);
  const adminPeople = people.filter((p) => p.isAdmin);
  const counts: Record<Offering, number> = { everyone: people.length, program: programPeople.length, coaching: coachingPeople.length, plus: plusPeople.length, admins: adminPeople.length };
  // Leland+ isn't a tab or filter choice for now (the Access tags and the one-table layout still show it).
  const offerings: Offering[] = ["everyone", "program", "coaching", "admins"];

  const combined = membersLayout === "combined";
  // Until a tab is picked: the program view, or the full roster when nobody has been granted anything yet.
  const defaultOffering: Offering = nobodyGranted ? "everyone" : "program";
  // With only you on the team there is nothing to pivot between: always the full roster, no tabs.
  const offering: Offering = combined || onlyYou ? "everyone" : offeringChoice && offerings.includes(offeringChoice) ? offeringChoice : defaultOffering;
  const colKey: Offering | "combined" = combined ? "combined" : offering;
  const showEmptyState = onlyYou;
  // An offering-specific view already implies what access people have, so the Access column only
  // shows on "All". The one-table layout has a column per offering, which makes it redundant there too.
  const hideAccess = combined || (offering !== "everyone" && offering !== "admins");
  // One table: a single column per offering that someone on the team has. The rest of each
  // person's detail (assessments, submissions, session dates...) is in their drawer.
  const combinedCols: Col[] = [
    ...(counts.program > 0 ? [{ ...PROGRAM_COLS.progress, header: "AI Builder Program" }] : []),
    ...(counts.coaching > 0 ? [{ ...COACHING_USED_COL, header: "1:1 coaching" }] : []),
    ...(counts.plus > 0 ? [{ ...COLUMNS.plus[0], header: "Leland+" }] : []),
  ];
  const cols = [...(showAccessColumn && !hideAccess ? [ACCESS_COL] : []), ...(combined ? combinedCols : COLUMNS[colKey])];
  const changeOffering = (o: Offering) => { setOfferingChoice(o); setFilter("all"); setQuery(""); };

  const base = offering === "program" ? programPeople : offering === "coaching" ? coachingPeople : offering === "plus" ? plusPeople : offering === "admins" ? adminPeople : people;
  const rows = base.filter((p) => {
    if (query && !onlyYou && !`${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (offering === "program") {
      if (filter === "in-progress") return p.program!.status === "in-progress";
      if (filter === "no-cohort") return p.program!.status === "no-cohort";
      if (filter === "not-started") return p.program!.status === "not-started";
      if (filter === "completed") return p.program!.status === "completed";
      if (filter === "quiet") return p.program!.status === "in-progress" && (p.lastActiveDays ?? 99) > 14;
    } else if (offering === "coaching") {
      if (filter === "sessions-left") return p.coaching!.used < p.coaching!.granted;
      if (filter === "all-used") return p.coaching!.used >= p.coaching!.granted;
      if (filter === "unused") return p.coaching!.used === 0;
    } else if (offering === "everyone") {
      if (filter === "program-only") return !!p.program && !p.coaching;
      if (filter === "coaching-only") return !p.program && !!p.coaching;
      if (filter === "both") return !!p.program && !!p.coaching;
      if (filter === "admins") return !!p.isAdmin;
    }
    return true;
  });

  const statusOptions =
    offering === "program"
      ? [
          { value: "all", label: "Everyone" },
          { value: "in-progress", label: "In progress" },
          { value: "no-cohort", label: "No cohort selected" },
          { value: "not-started", label: "Not started" },
          { value: "completed", label: "Completed" },
          { value: "quiet", label: "Gone quiet" },
        ]
      : offering === "coaching"
        ? [
            { value: "all", label: "Everyone" },
            { value: "sessions-left", label: "Sessions left" },
            { value: "all-used", label: "All sessions used" },
            { value: "unused", label: "Haven't started" },
          ]
        : offering === "everyone"
          ? [
              { value: "all", label: "Everyone" },
              { value: "program-only", label: "Program only" },
              { value: "coaching-only", label: "Coaching only" },
              { value: "both", label: "Program + coaching" },
              ...(combined ? [{ value: "admins", label: "Admins" }] : []),
            ]
          : null;

  // Nobody on the team yet: one clear next step instead of an empty table.
  return (
    <div className="leading-[1.2]">
      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <h1 className="font-serif text-[30px] font-medium text-gray-dark sm:text-[38px]">Team members</h1>
        {/* Desktop button; the full-width one below is for mobile. The wrapper hides it, since the Button's own display would override a hidden class. */}
        <div className={`hidden shrink-0 ${showEmptyState ? "" : "sm:block"}`}>
          <Button size="lg" variant="primary" rounded="rounded-full" onClick={() => openGrant(null)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Add a team member
          </Button>
        </div>
      </div>
      {!showEmptyState && <Button size="lg" variant="primary" rounded="rounded-full" className="mb-6 w-full sm:hidden" onClick={() => openGrant(null)}>Add a team member</Button>}

      {membersLayout === "tabs" && !onlyYou && (
        // The tabs scroll sideways on narrow screens instead of wrapping. The rule under them is a pseudo-element so the
        // scroll container doesn't clip the active tab's underline.
        <div className="relative mb-4 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-stroke">
          <div className="relative z-10 flex flex-nowrap gap-x-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Offering">
            {offerings.map((o) => (
              <button
                key={o}
                role="tab"
                aria-selected={offering === o}
                onClick={() => changeOffering(o)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-[14px] font-medium transition-colors ${offering === o ? "border-gray-dark text-gray-dark" : "border-transparent text-gray-light hover:text-gray-dark"}`}
              >
                {OFFERING_LABEL[o]}
                <span className="text-[12px] font-normal text-gray-light">{counts[o]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {offering === "admins" && (
        <div className="mb-6 mt-2 flex flex-col gap-4 rounded-[12px] border border-gray-stroke bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-gray-dark">Team admins</h2>
            <p className="mt-1 text-[14px] leading-[1.4] text-gray-light">Admins can manage team members, grant or revoke their access, make others admins, and manage billing details.</p>
          </div>
          <Button size="md" variant="secondary" rounded="rounded-full" className="shrink-0 self-start sm:self-auto" onClick={() => openGrant(null, ["admin"])}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            New admin
          </Button>
        </div>
      )}

      {/* While the empty state shows there is nothing to search, filter or pivot. */}
      {!showEmptyState && <div className="mb-3 flex flex-wrap items-center gap-3">
        {membersLayout === "filter" && (
          <FilterDropdown
            label="Offering"
            value={offering}
            options={offerings.map((o) => ({ value: o, label: `${OFFERING_LABEL[o]} (${counts[o]})` }))}
            onChange={(v) => changeOffering(v as Offering)}
          />
        )}
        {!showEmptyState && <div className="flex w-full items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3 sm:w-auto sm:max-w-[280px] sm:flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 border-none bg-transparent text-[14px] leading-[1.2] text-gray-dark outline-none placeholder:text-gray-xlight" placeholder="Search by name or email" />
        </div>}
        {statusOptions && !showEmptyState && <FilterDropdown label="Show" value={filter} options={statusOptions} onChange={setFilter} />}
      </div>}

      <div className="overflow-hidden rounded-[12px] border border-gray-stroke bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 220 + cols.length * 140 }}>
            <thead>
              <tr className="border-b border-gray-stroke bg-gray-hover text-left text-[14px] font-medium text-gray-dark">
                <th className="px-4 py-3">Member</th>
                {cols.map((c) => <th key={c.key} className="px-4 py-3">{c.header}</th>)}
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.email} onClick={() => openPerson(p)} className={`cursor-pointer hover:bg-gray-hover ${i < rows.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                  <td className="px-4 py-[14px]">
                    <div className="flex items-center gap-[10px]">
                      <Avatar initials={p.initials} image={p.image} />
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-gray-dark">{p.name}{p.isYou && <span className="ml-1.5 text-[12px] font-normal text-gray-light">(You)</span>}</div>
                        <div className="text-[12px] text-gray-light">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  {cols.map((c) => <td key={c.key} className="px-4 py-[14px]">{c.cell(p)}</td>)}
                  <td className="px-4 py-[14px] text-gray-xlight">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={cols.length + 2} className="px-4 py-10 text-center text-[14px] text-gray-light">
                    {base.length === 0 && (offering === "program" || offering === "coaching") ? (
                      <div className="flex flex-col items-center gap-3">
                        <span>No one has {offering === "program" ? "the AI Builder Program" : "1:1 coaching"} yet.</span>
                        <Button size="sm" variant="secondary" rounded="rounded-full" onClick={() => openGrant(null, [offering])}>Add a team member</Button>
                      </div>
                    ) : "No one matches this filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showEmptyState && (
          <div className="flex flex-col items-center border-t border-gray-stroke px-6 py-14 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-hover">
              <img src={usersGroupIcon} alt="" className="h-6 w-6 opacity-70" />
            </div>
            <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-gray-dark">Add your team</h2>
            <p className="mt-2 max-w-[440px] text-[16px] leading-[1.5] text-gray-light">
              Give teammates access to the AI Builder Program or 1:1 coaching, and see their progress here.
            </p>
            <Button size="lg" variant="primary" rounded="rounded-full" className="mt-6" onClick={() => openGrant(null)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Add a team member
            </Button>
          </div>
        )}
        <div className="border-t border-gray-stroke px-4 py-3 text-[12px] text-gray-light">
          {rows.length} {rows.length === 1 ? "person" : "people"}
        </div>
      </div>
      {nobodyGranted && !onlyYou && (offering === "everyone" || offering === "admins") && !query && (
        <div className="mt-4 flex flex-col gap-4 rounded-[12px] border border-gray-stroke bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-gray-dark">Add your team</h2>
            <p className="mt-1 text-[14px] leading-[1.4] text-gray-light">Give teammates access to the AI Builder Program or 1:1 coaching, and see their progress here.</p>
          </div>
          <Button size="md" variant="primary" rounded="rounded-full" className="shrink-0 self-start sm:self-auto" onClick={() => openGrant(null)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Add a team member
          </Button>
        </div>
      )}
      <div className="h-[120px] shrink-0" />
    </div>
  );
}
