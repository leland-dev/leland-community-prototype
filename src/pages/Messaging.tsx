import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import calendarIcon from "../assets/icons/calendar.svg";
import airplaneIcon from "../assets/icons/airplane.svg";
import hbsLogo from "../assets/org-logos/hbs.png";
import whartonLogo from "../assets/org-logos/wharton.png";
import gsbLogo from "../assets/logos/gsb.png";
import openaiLogo from "../assets/org-logos/openai.png";
import anthropicLogo from "../assets/org-logos/Anthropic.jpg";
import perplexityLogo from "../assets/org-logos/perplexity.svg";
import targetIcon from "../assets/icons/Target.1.svg";

/* ─────────────────────────── Icons ─────────────────────────── */

// sort.svg from /assets/icons — inlined with currentColor so it inherits the
// ghost button's gray-light → gray-dark hover color like the sibling icons.
function IconSort({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 8L7 5L4 8" />
      <path d="M7 19V5" />
      <path d="M14 16L17 19L20 16" />
      <path d="M17 5V19" />
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function IconKebab({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconCalendar({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

function IconPaperclip({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L10 17.6a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />
    </svg>
  );
}

function IconEmoji({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5a4 4 0 0 0 7 0" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </svg>
  );
}

function IconSend({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function IconClose({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function IconBan({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}

/* ─────────────────────── Small building blocks ─────────────────────── */

function Monogram({ initials, size = 40, className = "" }: { initials: string; size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#9E2B5C] font-medium text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/** A ghost icon control — toolbar-style, no button fill. */
function IconGhost({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark"
    >
      {children}
    </button>
  );
}

/* ─────────────────────── Conversation list (left) ─────────────────────── */

function ConversationListHeader({ tab, setTab }: { tab: "all" | "clients"; setTab: (t: "all" | "clients") => void }) {
  return (
    <div className="shrink-0 border-b border-gray-stroke px-5 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[30px] font-medium leading-none text-gray-dark">Messages</h1>
        <div className="flex items-center gap-0.5">
          <IconGhost label="Sort conversations"><IconSort /></IconGhost>
          <IconGhost label="Search conversations"><IconSearch /></IconGhost>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex">
        {([
          { key: "all", label: "All" },
          { key: "clients", label: "My Clients" },
        ] as const).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative flex-1 pb-3 text-center text-[14px] transition-colors ${
              tab === t.key ? "font-medium text-gray-dark" : "text-gray-light hover:text-gray-dark"
            }`}
          >
            {t.label}
            {tab === t.key && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-gray-dark" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterRow() {
  return (
    <div className="flex shrink-0 items-center gap-2 px-5 py-3">
      <Button size="sm" variant="dark" rounded="rounded-full" className="gap-1">
        All clients <IconChevronDown />
      </Button>
      <Button size="sm" variant="outline" rounded="rounded-full" className="gap-1">
        More <IconChevronDown />
      </Button>
    </div>
  );
}

/** Placeholder conversation rows — skeleton boxes, per spec. */
function ConversationPlaceholders() {
  const rows = Array.from({ length: 9 });
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
      {rows.map((_, i) => {
        const active = i === 0;
        return (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl px-2 py-3 ${active ? "bg-gray-hover" : "hover:bg-gray-hover/60"}`}
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-gray-stroke" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 rounded bg-gray-stroke" style={{ width: `${45 + ((i * 7) % 30)}%` }} />
                <div className="h-2.5 w-7 rounded bg-gray-stroke/70" />
              </div>
              <div className="mt-2 h-2.5 rounded bg-gray-stroke/70" style={{ width: `${60 + ((i * 11) % 30)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConversationList() {
  const [tab, setTab] = useState<"all" | "clients">("clients");
  return (
    <div className="flex h-full min-h-0 w-full flex-col md:w-[360px] md:shrink-0 md:border-r md:border-gray-stroke">
      <ConversationListHeader tab={tab} setTab={setTab} />
      <FilterRow />
      <ConversationPlaceholders />
    </div>
  );
}

/* ─────────────────────── Conversation history (center) ─────────────────────── */

function DateSeparator({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-stroke/70" />
      <span className="relative rounded-full border border-gray-stroke bg-white px-3 py-1 text-[12px] text-gray-light">
        {children}
      </span>
    </div>
  );
}

function TheirBubble({ children, time }: { children: React.ReactNode; time?: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="max-w-[75%] rounded-2xl rounded-tl-md bg-[#F1F1F1] px-4 py-2.5 text-[14px] text-gray-dark">
        {children}
      </div>
      {time && <span className="mt-1 text-[12px] text-gray-xlight">{time}</span>}
    </div>
  );
}

function MyBubble({ children, time }: { children: React.ReactNode; time?: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-[#DCE4FA] px-4 py-2.5 text-[14px] text-gray-dark">
        {children}
      </div>
      {time && <span className="mt-1 text-[12px] text-gray-xlight">{time}</span>}
    </div>
  );
}

function SessionCanceledCard() {
  return (
    <div className="flex flex-col items-end">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        <div className="flex items-center gap-2 border-b border-gray-stroke bg-gray-hover px-4 py-2.5 text-gray-light">
          <IconBan />
          <span className="text-[11px] font-semibold uppercase tracking-wide">Session canceled</span>
        </div>
        <div className="p-4">
          <div className="text-[18px] font-medium text-gray-dark">Session canceled</div>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-stroke p-3">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-gray-stroke text-center leading-none">
              <span className="text-[10px] font-semibold uppercase text-gray-xlight">Aug</span>
              <span className="text-[18px] font-medium text-gray-dark">5</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-[14px] text-gray-light line-through">Tanner &lt;&gt; Mike (Leland Coaching Session)</div>
              <div className="truncate text-[13px] text-gray-xlight line-through">Wednesday, Aug 5 at 3:30 PM · 1 hour</div>
            </div>
          </div>
        </div>
      </div>
      <span className="mt-1 text-[12px] text-gray-xlight">3:29 PM</span>
    </div>
  );
}

function ConversationThread({ extras }: { extras: NudgeThreadItem[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-8">
      <div className="flex flex-col gap-3">
        <DateSeparator>Jan 31, 2024</DateSeparator>
        <TheirBubble time="10:08 AM">test</TheirBubble>
        <MyBubble time="10:15 AM">Declined</MyBubble>

        <DateSeparator>Feb 2, 2024</DateSeparator>
        <MyBubble>test</MyBubble>
        <MyBubble time="10:14 AM">test</MyBubble>

        <DateSeparator>May 27</DateSeparator>
        <MyBubble time="9:35 AM">
          Hi Mike! Excited to work together. You can schedule our kickoff session through the Upcoming
          Sessions tab on the right of your inbox. Feel free to share any details / goals you would like
          before our first meeting. Talk to you soon!
        </MyBubble>

        <DateSeparator>August 4</DateSeparator>
        <MyBubble>Testing! Disregard this message.</MyBubble>
        <SessionCanceledCard />

        {extras.length > 0 && <DateSeparator>Today</DateSeparator>}
        {extras.map((x) => (
          <Fragment key={x.id}>
            <MyBubble time="Just now">{x.message}</MyBubble>
            <OutcomeRequestCard goalLabel={x.goalLabel} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="shrink-0 px-5 pb-5 pt-2 sm:px-8">
      <div className="rounded-2xl border border-gray-stroke bg-white px-4 py-3 focus-within:border-gray-dark">
        <input
          type="text"
          placeholder="Write a message…"
          className="w-full bg-transparent text-[15px] text-gray-dark outline-none placeholder:text-gray-xlight"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button size="sm" variant="dark" iconOnly aria-label="Add">
              <IconPlus />
            </Button>
            <IconGhost label="Attach file"><IconPaperclip /></IconGhost>
            <button type="button" aria-label="Formatting" className="flex h-9 items-center justify-center rounded-full px-2 text-[15px] font-medium text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
              Aa
            </button>
            <IconGhost label="Emoji"><IconEmoji /></IconGhost>
          </div>
          <IconGhost label="Send"><IconSend /></IconGhost>
        </div>
      </div>
    </div>
  );
}

/** Center-column header — only shown when the right column is collapsed. */
function ThreadHeader({ onOpenDetails }: { onOpenDetails: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gray-stroke px-5 py-3 sm:px-8">
      <div className="flex items-center gap-3">
        <Monogram initials="MM" size={40} />
        <span className="text-[16px] font-medium text-gray-dark">Mike M.</span>
      </div>
      <Button size="sm" variant="secondary" onClick={onOpenDetails}>
        Details
      </Button>
    </div>
  );
}

function ConversationPane({ onOpenDetails, extras }: { onOpenDetails: () => void; extras: NudgeThreadItem[] }) {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {/* Header appears only below the 3-column breakpoint */}
      <div className="xl:hidden">
        <ThreadHeader onOpenDetails={onOpenDetails} />
      </div>
      <ConversationThread extras={extras} />
      <Composer />
    </div>
  );
}

/* ─────────────────────── Relationship details (right) ─────────────────────── */

function IconQuestionCircle({ className = "" }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 9.3a2.7 2.7 0 0 1 5.2 1c0 1.8-2.7 2.7-2.7 2.7" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function IconLock({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

// A white module card bounded by gray-stroke hairlines. The panel's gray-hover
// background shows between modules as the 12px gap. The first module drops its
// top border so it sits flush under the conversation header.
function Module({ children, first = false, className = "" }: { children: React.ReactNode; first?: boolean; className?: string }) {
  return (
    <div className={`border-b border-gray-stroke bg-white px-5 py-5 ${first ? "" : "border-t"} ${className}`}>
      {children}
    </div>
  );
}

// Section header — 20px / weight 600, with an optional trailing action.
function SectionHeader({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[20px] font-semibold text-gray-dark">{children}</h3>
      {action}
    </div>
  );
}

// Icon + title + subtitle action row (Schedule a session, Recommend an offering).
// A full-width button with a gray-hover state; the negative inset lets the hover
// fill extend to the module's padding edges.
function ActionRow({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      className="-mx-3 flex w-[calc(100%+1.5rem)] items-start gap-3 rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-gray-hover"
    >
      <img src={icon} alt="" className="mt-0.5 h-6 w-6 shrink-0" />
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-gray-dark">{title}</span>
        <span className="block text-[14px] leading-snug text-gray-light">{subtitle}</span>
      </span>
    </button>
  );
}

/* ─────────────────────────── Goals & outcomes ───────────────────────────
 * A customer can hold several goals (CustomerGoal). Each goal is fulfilled by
 * at most one Outcome — the achieved result. The sidebar lists every goal; for
 * each, the coach either sees the logged outcome or can add / request one.
 * The Outcome payload mirrors the backend `outcomes` table: one of three types
 * (test score, school admission, job offer). No backend wiring. */

type OutcomePayload =
  | { type: "test"; testName: string; score: number; target?: number }
  // school_admission_status only has ADMITTED today — no rejected/waitlisted state.
  | { type: "school"; school: string; status: "ADMITTED"; logo?: string }
  | {
      type: "job";
      company: string;
      jobTitle: string;
      payAmountCents: number;
      payCurrency: string;
      payFrequency: "HOURLY" | "WEEKLY" | "MONTHLY" | "YEARLY";
      logo?: string;
    };

type Outcome = OutcomePayload & {
  /** Who reported it — the coach, or the customer via a request. */
  loggedBy: "coach" | "customer";
  date: string;
};

// A target organization the customer is aiming for (school or company).
// `logo` is an image asset; when absent, a tinted monogram tile is shown.
type Target = { name: string; logo?: string; tint?: string };

// One of the customer's goals. `targets` are the orgs they're aiming for;
// `outcome` is null until a result is logged.
type Goal = { id: string; label: string; category: string; targets: Target[]; outcome: Outcome | null };

// Sample outcomes — attach one to a goal's `outcome` (in clientGoals) to preview
// the achieved state.
const SAMPLE_SCHOOL: Outcome = { type: "school", status: "ADMITTED", school: "Harvard Business School", logo: hbsLogo, loggedBy: "customer", date: "Jan 2026" };
const SAMPLE_TEST: Outcome = { type: "test", testName: "GMAT", score: 750, target: 740, loggedBy: "coach", date: "Dec 2025" };
const SAMPLE_JOB: Outcome = { type: "job", company: "Perplexity", jobTitle: "Product Manager", payAmountCents: 18_000_000, payCurrency: "USD", payFrequency: "YEARLY", loggedBy: "customer", date: "Feb 2026" };

// The achieved-outcome phrase, by payload type. `entity` (school/company) is
// rendered as a dotted-underline link; test scores have no linked entity.
function outcomePhrase(o: Outcome): { before: string; entity?: string } {
  switch (o.type) {
    case "school":
      return { before: "Admitted to ", entity: o.school };
    case "test":
      return { before: `Scored ${o.score} on the ${o.testName}` };
    case "job":
      return { before: "Landed a role at ", entity: o.company };
  }
}

// Custom dashed outline used by the pending-outcome block — matches the
// "Sell on Leland" empty state: 3px dashes in gray-dark (#222222) at 30%,
// drawn as an SVG background since border-dashed can't control dash length.
const DASHED_OUTLINE =
  "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")";

// A single 30px target logo — rounded tile with a 1.5px white border and two
// drop shadows (per the design spec).
function LogoTile({ target }: { target: Target }) {
  return (
    <div
      className="h-[30px] w-[30px] overflow-hidden rounded-[2px] border-[1.5px] border-white bg-white"
      style={{
        boxShadow:
          "0px 8.3px 11.06px -2.77px rgba(16,24,40,0.08), 0px 2.77px 4.15px -1.38px rgba(16,24,40,0.03)",
      }}
    >
      {target.logo ? (
        <img src={target.logo} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white" style={{ backgroundColor: target.tint ?? "#20808D" }}>
          {target.name[0]}
        </div>
      )}
    </div>
  );
}

// Overlapping stack of up to 3 target-org logos, left-aligned, each slightly
// offset (tilted) from the next.
function LogoStack({ targets }: { targets: Target[] }) {
  const items = targets.slice(0, 3);
  if (items.length === 0) return null;
  return (
    <div className="flex items-end">
      {items.map((t, i) => {
        // Raise (and bring forward) every other tile, starting with the second.
        const raised = i % 2 === 1;
        const tilt = items.length === 1 ? "" : i === 0 ? "-rotate-[6deg]" : i === items.length - 1 ? "rotate-[6deg]" : "rotate-0";
        return (
          <div key={t.name} className={`relative ${i > 0 ? "-ml-2" : ""} ${raised ? "z-10 -translate-y-1.5" : "z-0"} ${tilt}`}>
            <LogoTile target={t} />
          </div>
        );
      })}
    </div>
  );
}

// The outcome block inside a goal card — dotted empty state, or the logged result.
function OutcomeBlock({ goal, firstName, onNudge, onAddOutcome }: { goal: Goal; firstName: string; onNudge: (g: Goal) => void; onAddOutcome: (g: Goal) => void }) {
  const outcome = goal.outcome;
  if (!outcome) {
    return (
      <div className="rounded-[12px] bg-[#222222]/[0.04] p-4 text-center" style={{ backgroundImage: DASHED_OUTLINE }}>
        <p className="text-[14px] text-gray-light">{firstName} hasn't logged an outcome yet</p>
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
          <button type="button" onClick={() => onNudge(goal)} className="text-[14px] font-normal text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">
            Nudge {firstName}
          </button>
          <button type="button" onClick={() => onAddOutcome(goal)} className="text-[14px] font-normal text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">
            Add it myself
          </button>
        </div>
      </div>
    );
  }

  const { before, entity } = outcomePhrase(outcome);
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#E6F4EC] px-3.5 py-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1F7A47] text-white">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <p className="text-[14px] font-medium leading-snug text-[#176B46]">
        {before}
        {entity && (
          <span className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">{entity}</span>
        )}
      </p>
    </div>
  );
}

// The org tied to a logged outcome (the company they joined / school they got
// into), matched back to one of the goal's targets. Falls back to the first.
function primaryTarget(goal: Goal): Target | null {
  const o = goal.outcome;
  if (!o) return null;
  const name = o.type === "job" ? o.company : o.type === "school" ? o.school : null;
  if (name) {
    const match = goal.targets.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (match) return match;
  }
  return goal.targets[0] ?? null;
}

// A goal card: target logos, the goal, then its outcome block. Once an outcome
// is logged, only the primary org's logo is shown instead of the full stack.
function GoalCard({ goal, firstName, onNudge, onAddOutcome }: { goal: Goal; firstName: string; onNudge: (g: Goal) => void; onAddOutcome: (g: Goal) => void }) {
  const primary = primaryTarget(goal);
  return (
    <div className="rounded-[22px] border border-gray-stroke p-4 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
      {goal.outcome ? (
        primary && <LogoTile target={primary} />
      ) : (
        <LogoStack targets={goal.targets} />
      )}
      <h4 className="mt-3 font-serif text-[20px] font-medium leading-[1.15] text-gray-dark">{goal.label}</h4>
      <p className="mt-1 text-[14px] text-gray-light">{goal.category}</p>
      <div className="mt-4">
        <OutcomeBlock goal={goal} firstName={firstName} onNudge={onNudge} onAddOutcome={onAddOutcome} />
      </div>
    </div>
  );
}

function OutcomesSection({ goals, firstName, onNudge, onAddOutcome }: { goals: Goal[]; firstName: string; onNudge: (g: Goal) => void; onAddOutcome: (g: Goal) => void }) {
  return (
    <Module>
      <SectionHeader>Goals</SectionHeader>
      {goals.length === 0 ? (
        <p className="mt-3 text-[13px] text-gray-light">{firstName} hasn't set any goals on Leland yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} firstName={firstName} onNudge={onNudge} onAddOutcome={onAddOutcome} />
          ))}
        </div>
      )}
    </Module>
  );
}

// The customer's goals. Set a goal's `outcome` to SAMPLE_SCHOOL / SAMPLE_TEST /
// SAMPLE_JOB to preview the achieved state.
const INITIAL_GOALS: Goal[] = [
  {
    id: "mba",
    label: "Get accepted to a top MBA program",
    category: "MBA Admissions",
    targets: [
      { name: "Harvard Business School", logo: hbsLogo },
      { name: "Stanford GSB", logo: gsbLogo },
      { name: "The Wharton School", logo: whartonLogo },
    ],
    outcome: null,
  },
  {
    id: "pm",
    label: "Break into Product Management",
    category: "Product Management",
    targets: [
      { name: "Perplexity", logo: perplexityLogo },
      { name: "Anthropic", logo: anthropicLogo },
      { name: "OpenAI", logo: openaiLogo },
    ],
    outcome: SAMPLE_JOB,
  },
];

type DetailsPanelProps = {
  onClose?: () => void;
  goals: Goal[];
  firstName: string;
  onNudge: (g: Goal) => void;
  onAddOutcome: (g: Goal) => void;
};

function DetailsPanel({ onClose, goals, firstName, onNudge, onAddOutcome }: DetailsPanelProps) {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto bg-gray-hover">
      {/* Header + time balance + actions */}
      <Module first>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Monogram initials="MM" size={44} />
            <div>
              <div className="text-[18px] font-semibold leading-tight text-gray-dark">Mike M.</div>
              <div className="text-[14px] text-gray-light">Active Client</div>
            </div>
          </div>
          {onClose ? (
            <IconGhost label="Close details" onClick={onClose}><IconClose /></IconGhost>
          ) : (
            <IconGhost label="More options"><IconKebab /></IconGhost>
          )}
        </div>

        <div className="mt-5 border-t border-gray-stroke pt-5">
          <div className="text-[14px] text-gray-light">Time balance</div>
          <div className="mt-1 text-[24px] font-semibold text-gray-dark">0h 0m</div>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <ActionRow
            icon={calendarIcon}
            title="Schedule a session"
            subtitle="Get your next meeting on the calendar"
          />
          <ActionRow
            icon={airplaneIcon}
            title="Recommend an offering"
            subtitle="Send your client a request to purchase"
          />
        </div>
      </Module>

      {/* Upcoming sessions */}
      <Module>
        <SectionHeader action={<IconGhost label="Schedule a session"><IconPlus /></IconGhost>}>
          Upcoming Sessions
        </SectionHeader>
        <div
          className="mt-3 rounded-[12px] bg-[#222222]/[0.04] p-5"
          style={{
            // Matches the Outcome / "Sell on Leland" empty state: 3px dashes in
            // gray-dark (#222222) at 30% opacity, drawn as an SVG background.
            backgroundImage:
              "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")",
          }}
        >
          <h4 className="text-[15px] font-bold leading-tight text-gray-dark">No upcoming sessions</h4>
          <p className="mt-2 text-[15px] leading-snug text-gray-light">
            You don't have any sessions scheduled with this client yet.
          </p>
          <button
            type="button"
            className="mt-6 text-[15px] font-semibold text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70"
          >
            Schedule a session
          </button>
        </div>
      </Module>

      {/* Goals — one card per goal */}
      <OutcomesSection goals={goals} firstName={firstName} onNudge={onNudge} onAddOutcome={onAddOutcome} />

      {/* Client info */}
      <Module>
        <SectionHeader>Client Info</SectionHeader>
        <div className="mt-4 flex items-center gap-3">
          <Monogram initials="MM" size={44} />
          <div className="text-[16px] font-medium text-gray-dark">Mike M.</div>
        </div>

        <div className="mt-4 border-t border-gray-stroke pt-4">
          <div className="text-[15px] font-medium text-gray-dark">Career Coaching</div>
          <div className="mt-0.5 text-[14px] text-gray-light">Category: Career Coaching</div>
        </div>
      </Module>

      {/* Tags */}
      <Module>
        <SectionHeader
          action={
            <button type="button" className="text-[14px] font-semibold text-gray-dark transition-colors hover:text-gray-light">
              Edit
            </button>
          }
        >
          Tags
        </SectionHeader>
        <div className="mt-3 flex flex-wrap gap-2">
          {["A longer tag", "Client type here", "Even longer tag"].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#222222]/5 px-3.5 py-1.5 text-[13px] font-medium text-gray-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </Module>

      {/* Notes */}
      <Module>
        <SectionHeader
          action={
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#222222]/5 px-2.5 py-1.5 text-[13px] font-medium text-gray-dark">
              <IconLock />
              Private
            </span>
          }
        >
          Notes
        </SectionHeader>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-light">
          These notes are private to you and cannot be seen by your client.
        </p>
        <textarea
          rows={4}
          placeholder="Write your notes here"
          className="mt-3 w-full resize-none rounded-xl border border-gray-stroke px-4 py-3 text-[14px] text-gray-dark outline-none transition-colors placeholder:text-gray-xlight focus:border-gray-dark"
        />
      </Module>

      {/* Order history */}
      <Module>
        <SectionHeader>Order History</SectionHeader>
        <div className="mt-4 flex items-center justify-between text-[14px]">
          <span className="text-gray-dark">Total earned</span>
          <span className="font-medium text-gray-dark">$0.00</span>
        </div>
        <div className="my-3.5 border-t border-gray-stroke" />
        <div className="flex items-center justify-between text-[14px]">
          <span className="text-gray-dark">Total orders</span>
          <span className="font-medium text-gray-dark">3</span>
        </div>
        <Button size="md" variant="outline" rounded="rounded-lg" className="mt-4 !font-semibold">
          View Earnings Dashboard
        </Button>
        <button
          type="button"
          className="mt-4 flex items-center gap-1 text-[15px] font-semibold text-gray-dark"
        >
          <span className="underline decoration-dotted underline-offset-[5px]">Show full order history</span>
          <IconChevronDown className="text-gray-light" />
        </button>
      </Module>

      {/* Support */}
      <Module>
        <SectionHeader>Get Support Anytime</SectionHeader>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-light">
          The Leland team is always available to sort out any issues.
        </p>
        <button
          type="button"
          className="-mx-3 mt-4 flex w-[calc(100%+1.5rem)] items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-hover"
        >
          <IconQuestionCircle className="shrink-0 text-gray-dark" />
          <span className="flex-1 text-[14px] font-semibold text-gray-dark">Visit the Coach Support Hub</span>
          <IconChevronRight className="shrink-0 text-gray-light" />
        </button>
      </Module>
    </div>
  );
}

/* ─────────────────────── Details slide-over (small screens) ─────────────────────── */

function DetailsSheet({ open, onClose, panelProps }: { open: boolean; onClose: () => void; panelProps: Omit<DetailsPanelProps, "onClose"> }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 right-0 w-[380px] max-w-[88%] border-l border-gray-stroke bg-white shadow-2xl"
          >
            <DetailsPanel onClose={onClose} {...panelProps} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────── Nudge + outcome flows ─────────────────────── */

// A nudge appended to the chat: the coach's message + an interactive request card.
type NudgeThreadItem = { id: string; goalLabel: string; message: string };

// The ~29-exam enum trimmed to the common ones (test_name on the Outcome).
const TEST_NAMES = ["SAT", "ACT", "GRE", "GMAT", "LSAT", "MCAT", "USMLE", "BAR", "CFA", "TOEFL", "IELTS", "AP", "IB"];

function IconOutcomeBadge({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

function IconInfo({ className = "" }: { className?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <rect x="11" y="10.5" width="2" height="6" rx="1" fill="#fff" />
      <circle cx="12" cy="8" r="1.1" fill="#fff" />
    </svg>
  );
}

// Circular close button pinned to the modal's top-right corner.
function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#222222]/5 text-gray-dark transition-colors hover:bg-[#222222]/10"
    >
      <IconClose />
    </button>
  );
}

// Centered modal shell — backdrop click + Escape close.
function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex max-h-[85vh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl bg-white shadow-card-large"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>,
    document.body
  );
}

// Pre-written nudge message referencing the goal.
function defaultNudgeMessage(goal: Goal, firstName: string) {
  const g = goal.label.charAt(0).toLowerCase() + goal.label.slice(1);
  return `Hi ${firstName}! When you get a chance, could you share how things turned out with your goal to ${g}? I'd love to log the outcome so your win is on record. Congrats again — excited to hear how it went!`;
}

// Modal 1 — edit the pre-written message, then send it to the chat.
function NudgeModal({ goal, firstName, onClose, onSend }: { goal: Goal; firstName: string; onClose: () => void; onSend: (goal: Goal, message: string) => void }) {
  const [message, setMessage] = useState(() => defaultNudgeMessage(goal, firstName));
  return (
    <ModalShell onClose={onClose}>
      <div className="relative px-7 pb-7 pt-7 sm:px-8 sm:pb-8">
        <ModalClose onClose={onClose} />

        <h2 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark">Nudge {firstName}</h2>
        <p className="mt-2 text-[16px] leading-snug text-gray-light">
          Ask {firstName} to log how their goal turned out. They'll get this in chat.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Write your message…"
          className="mt-5 w-full resize-none rounded-2xl border border-gray-stroke px-4 py-3.5 text-[15px] leading-relaxed text-gray-dark outline-none transition-colors placeholder:text-gray-xlight focus:border-gray-dark"
        />

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[14px] text-gray-light">
          <span className="text-gray-xlight"><IconInfo /></span>
          We'll send this in your chat with {firstName}
        </p>

        <Button
          size="lg"
          variant="primary"
          rounded="rounded-full"
          disabled={!message.trim()}
          onClick={() => onSend(goal, message.trim())}
          className="mt-3 w-full !py-4 !text-[16px]"
        >
          <img src={airplaneIcon} alt="" className="h-5 w-5" />
          Send nudge
        </Button>
      </div>
    </ModalShell>
  );
}

// The interactive card dropped into the chat when a nudge is sent (mirrors the
// review-request card — colored header band, serif prompt, a CTA for the client).
function OutcomeRequestCard({ goalLabel }: { goalLabel: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-gray-stroke bg-white">
        <div className="flex items-center justify-center gap-2 bg-[#FFF5DC] px-4 py-2.5 text-[#94370C]">
          <span
            className="h-4 w-4 bg-current"
            style={{
              // Quote the URL — Vite inlines small SVGs as data URIs whose
              // payload breaks an unquoted CSS url(), silently failing the mask
              // and rendering a solid square (see NavIcon in CoachLayout).
              maskImage: `url("${targetIcon}")`,
              WebkitMaskImage: `url("${targetIcon}")`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wide">Outcome update</span>
        </div>
        <div className="px-6 py-6 text-center">
          <p className="font-serif text-[22px] font-medium leading-tight text-gray-dark">How did “{goalLabel}” turn out?</p>
          <p className="mt-2 text-[14px] text-gray-light">Log your outcome · Requested by Tanner</p>
          <div className="mt-4 flex justify-center">
            <Button size="md" variant="outline" rounded="rounded-full" className="!font-semibold">Log your outcome</Button>
          </div>
        </div>
      </div>
      <span className="mt-1 text-[12px] text-gray-xlight">Just now</span>
    </div>
  );
}

// Icon-on-top selectable card — matches the "Configure coaching time" modal.
function ChoiceCard({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-5 text-center transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"}`}
    >
      <span className="text-gray-dark">{icon}</span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-gray-dark">{label}</span>
        <span className="text-[14px] leading-snug text-gray-light">{sub}</span>
      </span>
    </button>
  );
}

const outcomeFieldClass =
  "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";
const outcomeSectionHeader = "mb-2.5 block text-[15px] font-semibold text-gray-dark";

// Modal 2 — the coach logs the outcome themselves. Mirrors the "Configure
// coaching time" modal: 24px shell, serif header, choice cards, floating save.
function AddOutcomeModal({ goal, firstName, onClose, onSave }: { goal: Goal; firstName: string; onClose: () => void; onSave: (goalId: string, outcome: Outcome) => void }) {
  const [choice, setChoice] = useState<"yes" | "not-yet" | "na" | null>(null);
  // The outcome type is inferred from the goal's category — no need to ask.
  const type: OutcomePayload["type"] = /mba|admission|school|college|grad/i.test(goal.category)
    ? "school"
    : /product|consult|manage|recruit|job|career|engineer|market/i.test(goal.category)
      ? "job"
      : "test";

  const [testName, setTestName] = useState(TEST_NAMES[0]);
  const [score, setScore] = useState("");
  const [school, setSchool] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("USD");
  const [payFrequency, setPayFrequency] = useState<Extract<OutcomePayload, { type: "job" }>["payFrequency"]>("YEARLY");

  const canSave =
    type === "test" ? score.trim() !== "" : type === "school" ? school.trim() !== "" : company.trim() !== "" && jobTitle.trim() !== "";

  const handleSave = () => {
    let outcome: Outcome;
    if (type === "test") {
      outcome = { type: "test", testName, score: parseFloat(score) || 0, loggedBy: "coach", date: "Just now" };
    } else if (type === "school") {
      outcome = { type: "school", school: school.trim(), status: "ADMITTED", loggedBy: "coach", date: "Just now" };
    } else {
      const amount = payAmount.trim() ? Math.round((parseFloat(payAmount) || 0) * 100) : 0;
      outcome = { type: "job", company: company.trim(), jobTitle: jobTitle.trim(), payAmountCents: amount, payCurrency, payFrequency, loggedBy: "coach", date: "Just now" };
    }
    onSave(goal.id, outcome);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{ borderRadius: 24 }}
        className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col overflow-hidden bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
      >
        {/* Close — circular gray, top-right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {/* Scrollable content (extra pb clears the floating button when shown) */}
        <div className={`flex-1 overflow-y-auto px-7 ${choice === null ? "pb-8" : "pb-28"}`}>
          <div className="pt-8">
            <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">Log an outcome</h2>
            <p className="mt-1.5 text-[15px] text-gray-light">Record the result {firstName} reached for this goal.</p>
          </div>

          {/* Goal context — mirrors the Inbox goal card (gray bg, no border/shadow) */}
          <div className="mt-5 rounded-[22px] bg-gray-hover p-5">
            <LogoStack targets={goal.targets} />
            <p className="mt-3 font-serif text-[20px] font-medium leading-[1.15] text-gray-dark">{goal.label}</p>
            <p className="mt-1 text-[14px] text-gray-light">{goal.category}</p>
          </div>

          {/* Completed? — icon-on-top choice cards */}
          <div className="mt-6">
            <h3 className={outcomeSectionHeader}>Did {firstName} reach this goal?</h3>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceCard
                active={choice === "yes"}
                onClick={() => setChoice((c) => (c === "yes" ? null : "yes"))}
                label="Yes"
                sub="Log the result"
                icon={
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EC] text-[#1F7A47]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                }
              />
              <ChoiceCard
                active={choice === "not-yet"}
                onClick={() => setChoice((c) => (c === "not-yet" ? null : "not-yet"))}
                label="No"
                sub="Goal not reached"
                icon={
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBEAEA] text-[#C0362C]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </span>
                }
              />
            </div>
            {/* Not applicable — hidden once Yes / Not yet is chosen */}
            {(choice === null || choice === "na") && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setChoice((c) => (c === "na" ? null : "na"))}
                  className={`text-[16px] underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70 ${choice === "na" ? "font-medium text-gray-dark" : "text-gray-light"}`}
                >
                  Not applicable
                </button>
              </div>
            )}
          </div>

          {choice === "not-yet" && (
            <p className="mt-4 text-[14px] leading-relaxed text-gray-light">
              No problem — you can nudge {firstName} or log it whenever the result comes in.
            </p>
          )}

          {choice === "na" && (
            <p className="mt-4 text-[14px] leading-relaxed text-gray-light">
              This goal won't be tracked as an outcome.
            </p>
          )}

          {choice === "yes" && (
            <div className="mt-6 flex flex-col gap-5">
              {type === "school" && (
                <div>
                  <label className={outcomeSectionHeader}>Where was {firstName} accepted?</label>
                  <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Search for a school" className={outcomeFieldClass} />
                </div>
              )}
              {type === "job" && (
                <>
                  <div>
                    <label className={outcomeSectionHeader}>Company</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Search for a company" className={outcomeFieldClass} />
                  </div>
                  <div>
                    <label className={outcomeSectionHeader}>Job title</label>
                    <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Product Manager" className={outcomeFieldClass} />
                  </div>
                  <div>
                    <label className={outcomeSectionHeader}>Compensation <span className="font-normal text-gray-light">(optional)</span></label>
                    <div className="flex gap-3">
                      <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} inputMode="numeric" placeholder="Amount" className={`${outcomeFieldClass} flex-1`} />
                      <select value={payCurrency} onChange={(e) => setPayCurrency(e.target.value)} className={`${outcomeFieldClass} w-auto`}>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                      <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value as typeof payFrequency)} className={`${outcomeFieldClass} w-auto`}>
                        <option value="YEARLY">/ yr</option>
                        <option value="MONTHLY">/ mo</option>
                        <option value="WEEKLY">/ wk</option>
                        <option value="HOURLY">/ hr</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {type === "test" && (
                <>
                  <div>
                    <label className={outcomeSectionHeader}>Exam</label>
                    <select value={testName} onChange={(e) => setTestName(e.target.value)} className={outcomeFieldClass}>
                      {TEST_NAMES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={outcomeSectionHeader}>Score</label>
                    <input value={score} onChange={(e) => setScore(e.target.value)} inputMode="decimal" placeholder="e.g. 750" className={outcomeFieldClass} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Soft fade so content dissolves under the floating button */}
        {choice !== null && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-white via-white/85 to-transparent" />
        )}

        {/* Floating action button — hidden until an option is chosen */}
        {choice !== null && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-7 pb-7">
            {choice === "yes" ? (
              <Button size="lg" variant="primary" rounded="rounded-full" disabled={!canSave} onClick={handleSave} className="pointer-events-auto w-full !py-[18px] font-semibold shadow-[0_6px_16px_rgba(16,24,40,0.10)]">
                Save outcome
              </Button>
            ) : (
              <Button size="lg" variant="primary" rounded="rounded-full" onClick={onClose} className="pointer-events-auto w-full !py-[18px] font-semibold shadow-[0_6px_16px_rgba(16,24,40,0.10)]">
                Done
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function Messaging() {
  const firstName = "Mike";
  const [sheetOpen, setSheetOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [extras, setExtras] = useState<NudgeThreadItem[]>([]);
  const [modal, setModal] = useState<{ kind: "nudge" | "add"; goal: Goal } | null>(null);

  const panelProps = {
    goals,
    firstName,
    onNudge: (g: Goal) => setModal({ kind: "nudge", goal: g }),
    onAddOutcome: (g: Goal) => setModal({ kind: "add", goal: g }),
  };

  const sendNudge = (goal: Goal, message: string) => {
    setExtras((e) => [...e, { id: `${goal.id}-${e.length}`, goalLabel: goal.label, message }]);
    setModal(null);
  };
  const saveOutcome = (goalId: string, outcome: Outcome) => {
    setGoals((gs) => gs.map((g) => (g.id === goalId ? { ...g, outcome } : g)));
    setModal(null);
  };

  return (
    <div className="flex md:h-[calc(100vh-61px)] md:overflow-hidden">
      {/* Left — conversation list */}
      <ConversationList />

      {/* Center — history + composer (hidden on mobile, which shows the list) */}
      <div className="hidden min-w-0 flex-1 md:flex">
        <ConversationPane onOpenDetails={() => setSheetOpen(true)} extras={extras} />
      </div>

      {/* Right — relationship details (3-column breakpoint) */}
      <aside className="hidden w-[340px] shrink-0 border-l border-gray-stroke xl:block">
        <DetailsPanel {...panelProps} />
      </aside>

      {/* Slide-over details for < xl */}
      <DetailsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} panelProps={panelProps} />

      {modal?.kind === "nudge" && (
        <NudgeModal goal={modal.goal} firstName={firstName} onClose={() => setModal(null)} onSend={sendNudge} />
      )}
      {modal?.kind === "add" && (
        <AddOutcomeModal goal={modal.goal} firstName={firstName} onClose={() => setModal(null)} onSave={saveOutcome} />
      )}
    </div>
  );
}
