import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";

/* ─────────────────────────── Icons ─────────────────────────── */

function IconSort({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 4v16M7 20l-3-3M7 4l3 3M17 20V4M17 4l3 3M17 20l-3-3" />
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
      <Button size="sm" variant="dark" className="gap-1">
        All clients <IconChevronDown />
      </Button>
      <Button size="sm" variant="outline" className="gap-1">
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

function ConversationThread() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-8">
      <div className="mx-auto flex max-w-[820px] flex-col gap-3">
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
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="shrink-0 px-5 pb-5 pt-2 sm:px-8">
      <div className="mx-auto max-w-[820px] rounded-2xl border border-gray-stroke bg-white px-4 py-3 focus-within:border-gray-dark">
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

function ConversationPane({ onOpenDetails }: { onOpenDetails: () => void }) {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {/* Header appears only below the 3-column breakpoint */}
      <div className="xl:hidden">
        <ThreadHeader onOpenDetails={onOpenDetails} />
      </div>
      <ConversationThread />
      <Composer />
    </div>
  );
}

/* ─────────────────────── Relationship details (right) ─────────────────────── */

function DetailsSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-b border-gray-stroke px-5 py-5 ${className}`}>{children}</div>;
}

function DetailsPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between border-b border-gray-stroke px-5 py-4">
        <div className="flex items-center gap-3">
          <Monogram initials="MM" size={44} />
          <div>
            <div className="text-[16px] font-medium text-gray-dark">Mike M.</div>
            <div className="text-[13px] text-gray-light">Lead</div>
          </div>
        </div>
        {onClose ? (
          <IconGhost label="Close details" onClick={onClose}><IconClose /></IconGhost>
        ) : (
          <IconGhost label="More options"><IconKebab /></IconGhost>
        )}
      </div>

      {/* Purchase prompt + CTA */}
      <DetailsSection>
        <p className="text-[14px] leading-relaxed text-gray-light">
          This client has not purchased with you yet. Recommend an offering to get things started.
        </p>
        <Button size="md" variant="dark" className="mt-4 w-full">
          Recommend an offering
        </Button>
      </DetailsSection>

      {/* Upcoming sessions */}
      <DetailsSection>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-gray-dark">Upcoming Sessions</h3>
          <IconGhost label="Schedule a session"><IconPlus /></IconGhost>
        </div>
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-dashed border-gray-stroke p-4 text-gray-light">
          <IconCalendar className="mt-0.5 shrink-0 text-gray-xlight" />
          <p className="text-[13px] leading-relaxed">
            You don't have any upcoming sessions scheduled with this client.
          </p>
        </div>
      </DetailsSection>

      {/* Tags */}
      <DetailsSection>
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-medium text-gray-dark">Tags</h3>
          <button type="button" className="text-[13px] font-medium text-gray-light transition-colors hover:text-gray-dark">
            Edit
          </button>
        </div>
        <p className="mt-3 text-[13px] text-gray-xlight">No tags yet.</p>
      </DetailsSection>

      {/* Client info — kept intentionally light / wireframe */}
      <DetailsSection className="border-b-0">
        <h3 className="text-[15px] font-medium text-gray-dark">Client Info</h3>
        <div className="mt-4 flex items-center gap-3">
          <Monogram initials="MM" size={40} />
          <div>
            <div className="text-[15px] font-medium text-gray-dark">Mike M.</div>
            <div className="text-[13px] text-gray-light">He/Him</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[13px] font-medium text-gray-dark">Bio</div>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-light">
            Thoughtful bio about me and what I'm trying to do.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {[
            { title: "AI Productivity & Tooling", cat: "Build with AI" },
            { title: "Product Management", cat: "Product Management" },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-[14px] font-medium text-gray-dark">{item.title}</div>
              <div className="text-[13px] text-gray-light">Category: {item.cat}</div>
            </div>
          ))}
        </div>
      </DetailsSection>
    </div>
  );
}

/* ─────────────────────── Details slide-over (small screens) ─────────────────────── */

function DetailsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            <DetailsPanel onClose={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function Messaging() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex md:h-[calc(100vh-61px)] md:overflow-hidden">
      {/* Left — conversation list */}
      <ConversationList />

      {/* Center — history + composer (hidden on mobile, which shows the list) */}
      <div className="hidden min-w-0 flex-1 md:flex">
        <ConversationPane onOpenDetails={() => setSheetOpen(true)} />
      </div>

      {/* Right — relationship details (3-column breakpoint) */}
      <aside className="hidden w-[340px] shrink-0 border-l border-gray-stroke xl:block">
        <DetailsPanel />
      </aside>

      {/* Slide-over details for < xl */}
      <DetailsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
