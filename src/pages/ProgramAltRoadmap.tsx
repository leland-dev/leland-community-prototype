import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { CalendarIcon } from "../components/SessionCard";
import { CategoryPicker } from "../components/CategoryPicker";
import { IconChevronDown } from "../components/leland";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import imgPrompts from "../assets/img/builds/prompt-library.svg";
import imgInvoice from "../assets/img/builds/invoice-reconciliation.svg";
import imgNotes from "../assets/img/builds/meeting-notes.svg";
import imgOnboarding from "../assets/img/builds/onboarding-bot.svg";
import imgCrm from "../assets/img/builds/crm-cleanup.svg";
import imgCallCoach from "../assets/img/builds/sales-call-coach.svg";

// My Roadmap (alt) — a build roadmap the learner curates and checks off like a
// to-do list, plus a browse surface to add more builds, organized by Function
// (primary) → Focus area (secondary).

type Build = {
  id: string;
  title: string;
  description: string;
  fn: string; // Function
  fa: string; // Focus area
};

// Function order (drives the top pill row).
const FUNCTIONS = ["Marketing", "Sales", "Customer Success", "Finance", "Operations", "People", "Product"];

const BUILDS: Build[] = [
  // ── Marketing ──
  { id: "mk1", fn: "Marketing", fa: "Brand & Content", title: "Automated Meme Monday content for LinkedIn", description: "Generate a week of on-brand meme posts for LinkedIn, ready to schedule." },
  { id: "mk2", fn: "Marketing", fa: "Brand & Content", title: "Brand voice guardrails checker", description: "Flag copy that drifts from your brand voice before it ships." },
  { id: "mk3", fn: "Marketing", fa: "Brand & Content", title: "Repurpose a post into five channels", description: "Turn one blog post into tailored posts for every channel you run." },
  { id: "mk4", fn: "Marketing", fa: "Brand & Content", title: "On-brand image caption generator", description: "Draft captions that match your tone for a batch of images." },
  { id: "mk5", fn: "Marketing", fa: "Brand & Content", title: "Content calendar from a campaign brief", description: "Turn a brief into a dated, channel-by-channel content calendar." },
  { id: "mk6", fn: "Marketing", fa: "Research & Insight", title: "Competitor move tracker", description: "Keep a running brief on competitors' launches and messaging." },
  { id: "mk7", fn: "Marketing", fa: "Research & Insight", title: "Audience persona builder", description: "Build a detailed persona with pains, motivations, and language." },
  { id: "mk8", fn: "Marketing", fa: "Research & Insight", title: "Review-mining for messaging angles", description: "Pull recurring themes and quotes from reviews into angles." },
  { id: "mk9", fn: "Marketing", fa: "Campaigns", title: "Multi-touch campaign sequencer", description: "Design a timed, multi-channel campaign with escalation logic." },
  { id: "mk10", fn: "Marketing", fa: "Campaigns", title: "Landing page variant writer", description: "Generate headline and body variants to A/B on a landing page." },
  { id: "mk11", fn: "Marketing", fa: "Demand Gen", title: "Lead magnet idea generator", description: "Spin up lead-magnet concepts matched to your ICP's pains." },
  { id: "mk12", fn: "Marketing", fa: "Demand Gen", title: "Webinar follow-up nurture", description: "Draft a follow-up nurture sequence from a webinar's attendees." },
  { id: "mk13", fn: "Marketing", fa: "Search Visibility", title: "SEO brief from a keyword", description: "Turn a target keyword into a structured, rankable content brief." },
  { id: "mk14", fn: "Marketing", fa: "Search Visibility", title: "Metadata + schema generator", description: "Produce titles, descriptions, and schema for a batch of pages." },
  { id: "mk15", fn: "Marketing", fa: "Analytics", title: "Weekly marketing metrics digest", description: "Pull your channels into one Monday digest of what moved." },
  { id: "mk16", fn: "Marketing", fa: "Analytics", title: "A/B test readout writer", description: "Turn test results into a plain-language readout with a next step." },
  { id: "mk17", fn: "Marketing", fa: "Analytics", title: "Attribution summary explainer", description: "Explain which channels drove pipeline, in plain English." },

  // ── Sales ──
  { id: "sl1", fn: "Sales", fa: "Prospecting", title: "ICP lead sourcer", description: "Source verified leads straight from your ICP and score them." },
  { id: "sl2", fn: "Sales", fa: "Prospecting", title: "One-page account brief", description: "Build a prospect brief with pains, talking points, and questions." },
  { id: "sl3", fn: "Sales", fa: "Prospecting", title: "Trigger mapping", description: "Map prospect events to the right outreach angle and timing." },
  { id: "sl4", fn: "Sales", fa: "Outreach", title: "Cold outbound email agent", description: "Research prospects and queue personalized first-touch emails." },
  { id: "sl5", fn: "Sales", fa: "Outreach", title: "Personalization engine", description: "Turn a template into personalized variants from recipient signals." },
  { id: "sl6", fn: "Sales", fa: "Outreach", title: "Follow-up email from a call", description: "Turn a call transcript into a ready-to-send follow-up with next steps." },
  { id: "sl7", fn: "Sales", fa: "Deal Management", title: "Meeting notes to CRM", description: "Turn a transcript into clean follow-ups and CRM-ready fields." },
  { id: "sl8", fn: "Sales", fa: "Deal Management", title: "CRM cleanup agent", description: "Dedupe, standardize, and flag stale records in your CRM." },
  { id: "sl9", fn: "Sales", fa: "Forecasting", title: "Pipeline change digest", description: "Snapshot the pipeline weekly and surface what meaningfully moved." },
  { id: "sl10", fn: "Sales", fa: "Forecasting", title: "QBR generator", description: "Build a quarterly review of revenue, coverage, and deal risk." },

  // ── Customer Success ──
  { id: "cs1", fn: "Customer Success", fa: "Onboarding", title: "New customer welcome plan", description: "Draft a tailored first-30-days plan for each new customer." },
  { id: "cs2", fn: "Customer Success", fa: "Onboarding", title: "Onboarding checklist bot", description: "Walk customers through onboarding day by day and track progress." },
  { id: "cs3", fn: "Customer Success", fa: "Retention", title: "Churn-risk health scorer", description: "Score account health and flag the ones trending toward churn." },
  { id: "cs4", fn: "Customer Success", fa: "Retention", title: "Renewal reminder memo", description: "Draft a renewal memo before each contract deadline slips." },
  { id: "cs5", fn: "Customer Success", fa: "Support", title: "Support ticket triage agent", description: "Tag urgency and draft a first response for each incoming ticket." },
  { id: "cs6", fn: "Customer Success", fa: "Support", title: "Docs Q&A bot", description: "Answer questions from your own help docs, citing the source." },

  // ── Finance ──
  { id: "fn1", fn: "Finance", fa: "Reporting", title: "Investor revenue report", description: "Turn pipeline and revenue data into a board-ready report." },
  { id: "fn2", fn: "Finance", fa: "Reporting", title: "Recurring report automator", description: "Pull the numbers, compare to last period, and draft the write-up." },
  { id: "fn3", fn: "Finance", fa: "Forecasting", title: "Rolling cash flow forecast", description: "Turn bank, AR, and AP data into a weekly rolling forecast." },
  { id: "fn4", fn: "Finance", fa: "Forecasting", title: "Runway tracker", description: "Turn revenue and expenses into a burn-rate and runway model." },
  { id: "fn5", fn: "Finance", fa: "Bookkeeping", title: "Invoice bookkeeping agent", description: "Read each vendor invoice and draft a journal entry to approve." },
  { id: "fn6", fn: "Finance", fa: "Bookkeeping", title: "Invoice & PO data entry", description: "Pull vendor, amount, and line items off invoices into your tracker." },
  { id: "fn7", fn: "Finance", fa: "Compliance", title: "Audit evidence collector", description: "Gather evidence and map it to the control it satisfies before an audit." },

  // ── Operations ──
  { id: "op1", fn: "Operations", fa: "Automation", title: "Approval routing agent", description: "Route requests to the right approver and chase the stragglers." },
  { id: "op2", fn: "Operations", fa: "Automation", title: "Where-work-gets-stuck finder", description: "Read your tracker's timestamps and rank your slowest stages." },
  { id: "op3", fn: "Operations", fa: "SOPs", title: "SOP creator", description: "Turn a process description into a clean, numbered SOP." },
  { id: "op4", fn: "Operations", fa: "SOPs", title: "Interactive checklist", description: "Turn a process into a shareable page with a checkbox per step." },
  { id: "op5", fn: "Operations", fa: "Data Ops", title: "Spreadsheet data cleaner", description: "Dedupe, standardize, and flag what looks wrong — no formulas." },
  { id: "op6", fn: "Operations", fa: "Data Ops", title: "Internal docs Q&A bot", description: "Answer the team's questions from your SOPs, citing the doc." },

  // ── People ──
  { id: "pe1", fn: "People", fa: "Recruiting", title: "Resume screening agent", description: "Score resumes against your criteria, then rerun blinded for bias." },
  { id: "pe2", fn: "People", fa: "Recruiting", title: "Interview scheduling", description: "Check availability across a panel and lock a confirmed schedule." },
  { id: "pe3", fn: "People", fa: "Onboarding", title: "New hire welcome page", description: "Build a first-week page with people, links, and a short FAQ." },
  { id: "pe4", fn: "People", fa: "Performance", title: "1:1 prep assistant", description: "Pull prior notes, goals, and open items into a short 1:1 brief." },
  { id: "pe5", fn: "People", fa: "Performance", title: "Interview debrief summaries", description: "Turn raw interviewer notes into a structured, scorecard-keyed debrief." },

  // ── Product ──
  { id: "pr1", fn: "Product", fa: "Research", title: "Customer interview analyzer", description: "Keep a running doc of validated pains, objections, and quotes." },
  { id: "pr2", fn: "Product", fa: "Research", title: "Feedback theme tracker", description: "Cluster tickets, reviews, and surveys into ranked themes." },
  { id: "pr3", fn: "Product", fa: "Roadmapping", title: "Decision matrix agent", description: "Interview you for your criteria, then pressure-test the call." },
  { id: "pr4", fn: "Product", fa: "Launch", title: "Feature launch page", description: "Turn a PRD into a one-page what-changed, who-for, and what's-next." },
  { id: "pr5", fn: "Product", fa: "Launch", title: "Launch readout writer", description: "Turn launch metrics into a plain-language readout for the team." },
];

const BUILDS_BY_ID = Object.fromEntries(BUILDS.map((b) => [b.id, b]));

// The five program levels — each groups its builds in the roadmap and has an
// associated upcoming live session.
type LevelSession = { title: string; dateTime: string; duration: string; day: string; short: string; soon?: boolean };
type Level = { n: number; title: string; session: LevelSession };

const LEVELS: Level[] = [
  { n: 1, title: "AI Foundations", session: { title: "Kickoff: your AI foundations", dateTime: "Today at 6:00 PM", duration: "60 min", day: "18", short: "Today · 6:00 PM", soon: true } },
  { n: 2, title: "10x Your Impact with AI", session: { title: "Build your Agentic Operating System", dateTime: "Thu, May 29 at 1:00 PM", duration: "60 min", day: "29", short: "May 29" } },
  { n: 3, title: "Build Complex Agentic Workflows", session: { title: "Chaining tools into one workflow", dateTime: "Tue, Jun 3 at 8:00 AM", duration: "60 min", day: "3", short: "Jun 3" } },
  { n: 4, title: "Create Autonomous Agents", session: { title: "Agents that run on a schedule", dateTime: "Mon, Jun 9 at 11:00 AM", duration: "90 min", day: "9", short: "Jun 9" } },
  { n: 5, title: "Build Your Agent Workforce", session: { title: "Orchestrating a team of agents + Demo Day", dateTime: "Fri, Jun 13 at 10:00 AM", duration: "90 min", day: "13", short: "Jun 13" } },
];

// Which level each build belongs to (its home accordion in the roadmap). The
// browse surface stays organized by Function → Focus area; this is a separate,
// complexity-based grouping for the learning path.
const BUILD_LEVEL: Record<string, number> = {
  mk1: 1, mk2: 2, mk3: 1, mk4: 1, mk5: 2, mk6: 4, mk7: 1, mk8: 2, mk9: 3, mk10: 2, mk11: 1, mk12: 3, mk13: 2, mk14: 3, mk15: 4, mk16: 2, mk17: 4,
  sl1: 4, sl2: 1, sl3: 3, sl4: 4, sl5: 3, sl6: 1, sl7: 2, sl8: 3, sl9: 5, sl10: 5,
  cs1: 1, cs2: 3, cs3: 5, cs4: 2, cs5: 3, cs6: 3,
  fn1: 5, fn2: 4, fn3: 4, fn4: 2, fn5: 3, fn6: 5, fn7: 5,
  op1: 4, op2: 5, op3: 1, op4: 1, op5: 2, op6: 4,
  pe1: 4, pe2: 5, pe3: 1, pe4: 2, pe5: 5,
  pr1: 2, pr2: 5, pr3: 3, pr4: 1, pr5: 4,
};
const levelOf = (id: string) => BUILD_LEVEL[id] ?? 1;

// Deterministic thumbnail per build so cards look varied but stable.
const IMG_POOL = [imgTriage, imgMetrics, imgPrompts, imgInvoice, imgNotes, imgOnboarding, imgCrm, imgCallCoach];
function imageFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return IMG_POOL[hash % IMG_POOL.length];
}

// ── Persisted roadmap state ──────────────────────────────────────────────────
const ADDED_KEY = "program-alt-roadmap-added-v3";
const DONE_KEY = "program-alt-roadmap-done-v3";
// Seed so the demo isn't empty on first load — ~8-10 builds per level, with a
// handful left un-added per level so Browse still has things to add.
const SEED_ADDED = [
  // Level 1
  "mk1", "mk3", "mk4", "mk7", "mk11", "sl2", "sl6", "cs1", "op3", "op4",
  // Level 2
  "mk2", "mk5", "mk8", "mk10", "mk13", "mk16", "sl7", "cs4", "fn4", "op5",
  // Level 3
  "mk9", "mk12", "mk14", "sl3", "sl5", "sl8", "cs2", "cs5", "cs6",
  // Level 4
  "mk6", "mk15", "mk17", "sl1", "sl4", "fn2", "fn3", "op1", "op6",
  // Level 5
  "sl9", "sl10", "cs3", "fn1", "fn6", "fn7", "op2", "pe2",
];
// Level 1 (AI Foundations) is fully complete; a few others partially done.
const SEED_DONE = ["mk1", "mk3", "mk4", "mk7", "mk11", "sl2", "sl6", "cs1", "op3", "op4", "mk5", "sl8", "fn3"];

function loadSet(key: string, fallback: string[]): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function useRoadmap() {
  const [added, setAdded] = useState<string[]>(() => loadSet(ADDED_KEY, SEED_ADDED));
  const [done, setDone] = useState<string[]>(() => loadSet(DONE_KEY, SEED_DONE));

  const persist = (key: string, next: string[]) => localStorage.setItem(key, JSON.stringify(next));

  const toggleAdded = (id: string) =>
    setAdded((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persist(ADDED_KEY, next);
      // Removing a build from the roadmap also clears its done state.
      if (!next.includes(id)) setDone((d) => { const nd = d.filter((x) => x !== id); persist(DONE_KEY, nd); return nd; });
      return next;
    });

  const toggleDone = (id: string) =>
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persist(DONE_KEY, next);
      return next;
    });

  return { added, done, toggleAdded, toggleDone };
}

// ── Pieces ───────────────────────────────────────────────────────────────────
function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
        checked ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke bg-white text-transparent hover:border-gray-light"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12l5 5L20 7" />
      </svg>
    </button>
  );
}

function RoadmapRow({ build, done, onToggleDone, onRemove }: { build: Build; done: boolean; onToggleDone: () => void; onRemove: () => void }) {
  return (
    <div className="group flex items-center gap-3 py-3">
      <Checkbox checked={done} onClick={onToggleDone} />
      <div className="h-11 w-[68px] shrink-0 overflow-hidden rounded-md border border-gray-stroke bg-gray-hover">
        <img src={imageFor(build.id)} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={`truncate text-[15px] font-semibold leading-[1.3] ${done ? "text-gray-extra-light line-through" : "text-gray-dark"}`}>
          <span className="cursor-pointer hover:underline">{build.title}</span>
        </p>
        <p className="truncate text-[13px] text-gray-light">{build.fn} · {build.fa}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from roadmap"
          className="rounded-full p-1.5 text-gray-extra-light opacity-0 transition-opacity hover:bg-black/5 hover:text-gray-dark group-hover:opacity-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

function BrowseCard({ build, added, onToggle }: { build: Build; added: boolean; onToggle: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-stroke bg-white">
      <div className="aspect-[120/63] w-full shrink-0 overflow-hidden bg-gray-hover">
        <img src={imageFor(build.id)} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <p className="line-clamp-2 text-[16px] font-semibold leading-[1.3] text-gray-dark">{build.title}</p>
          <p className="line-clamp-2 text-[14px] leading-[1.35] text-gray-light">{build.description}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[12px] text-gray-extra-light">{build.fa}</span>
          <Button
            size="sm"
            variant={added ? "secondary" : "dark"}
            rounded="rounded-full"
            className={`shrink-0 !gap-1.5 font-semibold ${added ? "!bg-black/5" : ""}`}
            onClick={onToggle}
          >
            {added ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
                Added
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// A level's upcoming live session, highlighted at the top of its accordion.
function LevelSessionHighlight({ session }: { session: LevelSession }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#CFE0F7] bg-[#EEF4FC] p-3">
      <CalendarIcon day={session.day} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2c5fd0]">
          {session.soon && <span className="h-1.5 w-1.5 rounded-full bg-[#E01E5A]" />}
          Upcoming live session
        </p>
        <p className="truncate text-[15px] font-semibold leading-[1.3] text-gray-dark">{session.title}</p>
        <p className="truncate text-[13px] text-gray-light">{session.dateTime} · {session.duration}</p>
      </div>
      <Button
        size="sm"
        variant={session.soon ? "dark" : "secondary"}
        rounded="rounded-full"
        className={`shrink-0 font-semibold ${session.soon ? "" : "!bg-black/5"}`}
      >
        {session.soon ? "Join" : "Add to calendar"}
      </Button>
    </div>
  );
}

function LevelAccordion({
  level,
  builds,
  done,
  open,
  onToggleOpen,
  onToggleDone,
  onRemove,
}: {
  level: Level;
  builds: Build[];
  done: string[];
  open: boolean;
  onToggleOpen: () => void;
  onToggleDone: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const doneCount = builds.filter((b) => done.includes(b.id)).length;
  const pct = builds.length ? Math.round((doneCount / builds.length) * 100) : 0;
  const complete = builds.length > 0 && doneCount === builds.length;
  const [showAll, setShowAll] = useState(false);
  // Completed builds sorted to the top within the section (stable otherwise).
  const sortedBuilds = [...builds].sort((a, b) => Number(done.includes(b.id)) - Number(done.includes(a.id)));
  const firstBuilds = sortedBuilds.slice(0, 6);
  const extraBuilds = sortedBuilds.slice(6);
  const row = (b: Build) => (
    <RoadmapRow key={b.id} build={b} done={done.includes(b.id)} onToggleDone={() => onToggleDone(b.id)} onRemove={() => onRemove(b.id)} />
  );
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
      <button type="button" onClick={onToggleOpen} className="flex w-full items-center gap-4 p-5 text-left">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F1E6] text-[15px] font-semibold text-gray-dark">
          {level.n}
          {complete && (
            <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#2E7D4F] text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
            </span>
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-[17px] font-semibold leading-[1.3] text-gray-dark">{level.title}</p>
          <p className="text-[13px] text-gray-light">Level {level.n - 1}</p>
        </div>
        {/* Per-level completion — a green "Complete" tag when done, else a progress bar */}
        {complete ? (
          <span className="hidden items-center gap-1.5 rounded-full bg-[#E8F3EC] px-3 py-1.5 text-[13px] font-semibold text-[#2E7D4F] sm:inline-flex">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
            Complete
          </span>
        ) : builds.length > 0 ? (
          <div className="hidden items-center gap-2.5 sm:flex">
            <span className="whitespace-nowrap text-[12px] text-gray-extra-light">{doneCount} of {builds.length} complete</span>
            <div className="h-2 w-[110px] overflow-hidden rounded-full bg-gray-stroke">
              <div className="h-full rounded-full bg-gray-dark transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ) : null}
        <svg
          className={`shrink-0 text-gray-light transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-5 pb-5">
              <LevelSessionHighlight session={level.session} />
              {builds.length ? (
                <div className="flex flex-col">
                  <div className="flex flex-col divide-y divide-gray-stroke">{firstBuilds.map(row)}</div>
                  <AnimatePresence initial={false}>
                    {showAll && extraBuilds.length > 0 && (
                      <motion.div
                        key="more"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col divide-y divide-gray-stroke border-t border-gray-stroke">{extraBuilds.map(row)}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-gray-stroke bg-[#F9F8F3]/60 px-5 py-6 text-center text-[14px] text-gray-light">
                  No builds yet — add some from Browse below.
                </p>
              )}
              <div className="flex items-center gap-3">
                {builds.length > 6 && (
                  <Button
                    size="md"
                    variant="secondary"
                    className="!gap-1.5 border border-gray-stroke !bg-white font-semibold"
                    onClick={() => setShowAll((v) => !v)}
                  >
                    {showAll ? "See less" : `See ${builds.length - 6} more`}
                    <svg
                      className={`transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </Button>
                )}
                <Button
                  size="md"
                  variant="secondary"
                  className="ml-auto !gap-1.5 !bg-black/5 font-semibold"
                  onClick={() => document.getElementById("browse-builds")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                  Add a build
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ProgramAltRoadmap() {
  const { added, done, toggleAdded, toggleDone } = useRoadmap();
  const [fn, setFn] = useState<string>("all");
  const [fa, setFa] = useState<string>("all");
  const [openLevels, setOpenLevels] = useState<Set<number>>(() => new Set([2]));
  const toggleLevel = (n: number) =>
    setOpenLevels((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  // Focus areas for the active role (empty when "All roles"), first-seen order.
  const focusAreas = useMemo(() => {
    if (fn === "all") return [] as string[];
    const order: string[] = [];
    for (const b of BUILDS) {
      if (b.fn === fn && !order.includes(b.fa)) order.push(b.fa);
    }
    return order;
  }, [fn]);

  const browseResults = useMemo(() => {
    const list = BUILDS.filter((b) => (fn === "all" || b.fn === fn) && (fa === "all" || b.fa === fa));
    // Not-added first, then added (stable sort preserves catalog order within each).
    return [...list].sort((a, b) => Number(added.includes(a.id)) - Number(added.includes(b.id)));
  }, [fn, fa, added]);

  // Roadmap list, in the order builds were added.
  const roadmapBuilds = added.map((id) => BUILDS_BY_ID[id]).filter(Boolean) as Build[];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-10 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">My Roadmap</h1>
        <p className="text-[16px] leading-[1.5] text-gray-light">Curate the builds you want to tackle, then check them off as you go.</p>
      </div>

      {/* Your roadmap — grouped into the five levels, each an accordion */}
      <div className="flex flex-col gap-3">
        {LEVELS.map((level) => (
          <LevelAccordion
            key={level.n}
            level={level}
            builds={roadmapBuilds.filter((b) => levelOf(b.id) === level.n)}
            done={done}
            open={openLevels.has(level.n)}
            onToggleOpen={() => toggleLevel(level.n)}
            onToggleDone={toggleDone}
            onRemove={toggleAdded}
          />
        ))}
      </div>

      {/* Divider between the roadmap accordions and Browse builds */}
      <hr className="my-6 border-t border-gray-stroke" />

      {/* Browse builds — Role → Focus area */}
      <section id="browse-builds" className="flex flex-col gap-6 scroll-mt-20">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-[28px] font-medium leading-[1.2] text-gray-dark">Browse builds</h2>
          <p className="text-[16px] leading-[1.5] text-gray-light">Find builds by role, then narrow to a focus area, and add them to your roadmap.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Role stays a dropdown, outside the horizontal scroll */}
          <CategoryPicker
            value={fn === "all" ? null : fn}
            onChange={(v) => { setFn(v ?? "all"); setFa("all"); }}
            options={FUNCTIONS}
            allLabel="All roles"
            searchPlaceholder="Search roles"
            trigger={({ onClick, ref, open }) => (
              <button ref={ref} type="button" onClick={onClick} className="flex shrink-0 items-center gap-2 rounded-full border border-gray-stroke bg-white px-4 py-2.5 text-[15px] font-semibold text-gray-dark hover:bg-gray-hover">
                <span>{fn === "all" ? "All roles" : fn}</span>
                <IconChevronDown className={`size-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            )}
          />
          {/* Focus areas — horizontally scrolling, toggleable pills */}
          <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto">
            {focusAreas.map((name) => {
              const selected = fa === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFa(selected ? "all" : name)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] bg-black/5 px-4 py-2.5 text-[15px] font-semibold text-gray-dark transition-colors ${
                    selected ? "border-gray-dark" : "border-transparent hover:bg-black/[0.08]"
                  }`}
                >
                  {selected && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
                  )}
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {browseResults.map((b) => (
            <BrowseCard key={b.id} build={b} added={added.includes(b.id)} onToggle={() => toggleAdded(b.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
