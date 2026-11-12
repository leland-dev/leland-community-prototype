import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button, LinkButton } from "../components/Button";
import MaskIcon from "../components/MaskIcon";
import { Pivot, type PivotTab } from "../components/Pivot";
import { UpcomingEventRow, type UpcomingEvent } from "./CoachCategoryEdit";
import {
  ConfigModal,
  ListConfigModal,
  CollectionPickerModal,
  defaultConfigFor,
  configSummary,
  productListPrice,
  type OfferingItem,
} from "./CoachProductNew";
import ConfirmModal from "../components/ConfirmModal";
import { upsertCollection, newCollectionId, type Collection } from "../lib/collections";
import { getSubscriptionBySlug } from "../lib/subscriptions";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import dotsVerticalIcon from "../assets/icons/dots-vertical.svg";
import dotsHorizontalIcon from "../assets/icons/dots-horizontal.svg";
import eyeIcon from "../assets/icons/eye.svg";
import editIcon from "../assets/icons/edit.svg";
import trashIcon from "../assets/icons/trash.svg";
import shareIcon from "../assets/icons/share-arrow.svg";
import paperStackIllustration from "../assets/illustrations/paper-stack.svg";
import eventPlaceholder1 from "../assets/placeholder images/placeholder-event-01.png";
import eventPlaceholder2 from "../assets/placeholder images/placeholder-event-02.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic7 from "../assets/profile photos/pic-7.png";

const card = "rounded-[20px] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10";

type Tab = "membership" | "members" | "earnings" | "calendar" | "settings";

// Deterministic mock roster for the Members section.
const ROSTER = [
  { name: "Jordan Patel", avatar: pic1, plan: "Annual", joined: "Mar 2026" },
  { name: "Mia Chen", avatar: pic2, plan: "Monthly", joined: "Apr 2026" },
  { name: "Andre Williams", avatar: pic3, plan: "Monthly", joined: "Apr 2026" },
  { name: "Sofia Rossi", avatar: pic4, plan: "Annual", joined: "Feb 2026" },
  { name: "Daniel Okafor", avatar: pic5, plan: "Monthly", joined: "May 2026" },
  { name: "Priya Nair", avatar: pic7, plan: "Annual", joined: "Jan 2026" },
];

// Products bundled into the membership — mirrors the offering builder's
// "Build your offering" product list (icon, title, detail, standalone price).
const INCLUDED_PRODUCTS = [
  { icon: hourglassIcon, title: "Monthly group coaching", detail: "2 sessions / month · 60 min", price: "$150" },
  { icon: bookOpenIcon, title: "MBA Essay Framework", detail: "PDF · 4.2k views", price: "$18" },
  { icon: stackIcon, title: "Members-only resource library", detail: "12 resources", price: "$0" },
];

// Upcoming paid group sessions for the Calendar tab (November 2026).
const CALENDAR_EVENTS = [
  { date: 12, weekday: "Thu", time: "5:00 PM", title: "Live member Q&A", attendees: "Open to all members", duration: "45 min" },
  { date: 17, weekday: "Tue", time: "6:00 PM", title: "Essay teardown: live edits", attendees: "32 going", duration: "60 min" },
  { date: 26, weekday: "Thu", time: "5:00 PM", title: "Live member Q&A", attendees: "Open to all members", duration: "45 min" },
];
// Early-December sessions shown in the upcoming list beneath the calendar.
const UPCOMING_NEXT_MONTH = [
  { label: "Dec 1", weekday: "Tue", time: "6:00 PM", title: "Monthly group coaching call", attendees: "128 invited", duration: "60 min" },
];

// The coach's existing upcoming group sessions, offered in the "Add an existing
// session" step so they can be attached to this membership.
const MY_GROUP_SESSIONS: UpcomingEvent[] = [
  { id: "gs-teardown", title: "Essay teardown: live edits", dateTime: "Nov 17 · 6:00 PM", duration: "60 min", thumb: eventPlaceholder1, free: false, price: "$25", enrolled: 32, joinable: false },
  { id: "gs-interview", title: "Mock interview workshop", dateTime: "Nov 20 · 5:30 PM", duration: "45 min", thumb: eventPlaceholder2, free: false, price: "$40", enrolled: 18, joinable: false },
  { id: "gs-resume", title: "Resume clinic", dateTime: "Dec 3 · 6:00 PM", duration: "30 min", thumb: eventPlaceholder1, free: false, price: "$20", enrolled: 11, joinable: false },
  { id: "gs-networking", title: "Networking strategy AMA", dateTime: "Dec 9 · 5:00 PM", duration: "45 min", thumb: eventPlaceholder2, free: true, price: "Free", enrolled: 54, joinable: false },
];

function StatCard({ label, value, delta, positive = true, onClick }: { label: string; value: string; delta?: string; positive?: boolean; onClick?: () => void }) {
  // Arrow direction follows the delta's sign; color follows sentiment (positive).
  const down = delta?.trim().startsWith("-");
  return (
    <div
      className={`${card} ${onClick ? "cursor-pointer text-left transition-shadow hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]" : ""}`}
      {...(onClick ? { role: "button", tabIndex: 0, onClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } } : {})}
    >
      <p className="text-[14px] font-medium text-gray-light">{label}</p>
      <p className="mt-2 font-serif text-[30px] leading-none text-gray-dark">{value}</p>
      {delta && (
        <p className={`mt-2 flex items-center gap-1 text-[13px] font-medium ${positive ? "text-[#1B8A54]" : "text-[#DC2B23]"}`}>
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {down ? <path d="M7 7l10 10M17 17H9M17 17V9" /> : <path d="M7 17L17 7M17 7H9M17 7V15" />}
          </svg>
          {delta}
        </p>
      )}
    </div>
  );
}

// Right-rail helper card on the Membership tab — orients the coach toward
// building a strong membership with a few playbook links.
const LEARN_TIPS = [
  { title: "Price it to renew", desc: "Set a monthly price members happily keep paying.", href: "#" },
  { title: "Give members a reason to stay", desc: "Mix live sessions, fresh content, and community.", href: "#" },
  { title: "Reduce churn", desc: "Nudge annual plans and win back lapsed members.", href: "#" },
];

function LearnMoreCard() {
  return (
    <section className={card}>
      <div className="flex flex-col gap-3">
        <img src={paperStackIllustration} alt="" className="h-14 w-14" />
        <h2 className="text-[18px] font-semibold text-gray-dark">Build a membership people keep</h2>
      </div>
      <div className="mt-4 flex flex-col">
        {LEARN_TIPS.map((t) => (
          <a key={t.title} href={t.href} className="group -mx-3 flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-hover">
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-gray-dark">{t.title}</span>
              <span className="block text-[13px] leading-snug text-gray-light">{t.desc}</span>
            </span>
            <svg className="h-[18px] w-[18px] shrink-0 text-gray-extra-light transition-colors group-hover:text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </a>
        ))}
      </div>
      <div className="mt-4">
        <LinkButton size="md" variant="secondary" rounded="rounded-full" href="#" className="w-full font-semibold">
          Visit the expert guide
        </LinkButton>
      </div>
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[18px] font-semibold text-gray-dark">{title}</h2>
      {action}
    </div>
  );
}

// Product types a coach can add to the membership — mirrors the offering
// builder's "Add product" dropdown (CoachProductNew's AddProductMenu).
// Group sessions are handled in the dedicated "Live sessions" section, so
// they're intentionally omitted here.
const ADD_PRODUCT_TYPES = [
  { slug: "coaching-time", label: "Coaching time", icon: hourglassIcon },
  { slug: "content", label: "Content", icon: bookOpenIcon },
  { slug: "collection", label: "Collection", icon: stackIcon },
];
const ADD_PRODUCT_ICON: Record<string, string> = Object.fromEntries(ADD_PRODUCT_TYPES.map((t) => [t.slug, t.icon]));

// A product row rendered in "What's included". Seeded rows are static mock data;
// rows built from the add-product modals derive their display from the saved
// OfferingItem via the builder's own helpers so they read the same way.
type IncludedRow = { icon: string; title: string; detail: string; price: string };

function includedFromItem(item: OfferingItem): IncludedRow {
  const price = `$${productListPrice(item).toLocaleString()}`;
  switch (item.slug) {
    case "coaching-time":
      return { icon: ADD_PRODUCT_ICON[item.slug], title: "Coaching time", detail: configSummary(item) || "Live sessions", price };
    case "content":
      return { icon: ADD_PRODUCT_ICON[item.slug], title: configSummary(item) || "Content", detail: item.config.resourceType || "Resource", price };
    case "collection":
      return { icon: ADD_PRODUCT_ICON[item.slug], title: item.config.title || "Collection", detail: configSummary(item), price };
    case "workshop":
      return { icon: ADD_PRODUCT_ICON[item.slug], title: item.config.name || "Group Session", detail: "Group session", price };
    default:
      return { icon: ADD_PRODUCT_ICON[item.slug] ?? bookOpenIcon, title: configSummary(item) || "Product", detail: "", price };
  }
}

// "Add product" button with a portaled dropdown of product types — styled like
// the "Add session" button. Portaled so no overflow ancestor can clip the menu.
function AddProductMenu({ onAdd }: { onAdd: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6 });
  }, [open]);

  return (
    <div ref={triggerRef} className="inline-flex">
      <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setOpen((o) => !o)}>
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        Add product
      </Button>
      {createPortal(
        <>
          {open && <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: "fixed", left: pos.left, top: pos.top, width: 240 }}
                className="z-[101] rounded-2xl border border-gray-stroke bg-white shadow-lg"
              >
                <div className="px-2 py-2">
                  {ADD_PRODUCT_TYPES.map((o) => (
                    <button
                      key={o.slug}
                      type="button"
                      onClick={() => { onAdd(o.slug); setOpen(false); }}
                      className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                    >
                      <img src={o.icon} alt="" className="h-6 w-6 shrink-0" />
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}

// A product row's "⋮" menu with Edit / Remove actions. Portaled and right-
// aligned under the trigger so it escapes the row's clipping.
function RowActionsMenu({ onEdit, onRemove, label }: { onEdit: () => void; onRemove: () => void; label: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ right: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ right: window.innerWidth - r.right, top: r.bottom + 6 });
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Actions for ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-extra-light transition-colors hover:text-gray-light"
      >
        <MaskIcon src={dotsVerticalIcon} className="h-4 w-4" />
      </button>
      {createPortal(
        <>
          {open && <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: "fixed", right: pos.right, top: pos.top, minWidth: 160 }}
                className="z-[101] rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => { onRemove(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-[#E5484D] transition-colors hover:bg-gray-hover"
                >
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                  Remove
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}

// Top-bar "⋯" menu holding the membership-level Edit / Delete actions.
function MembershipActionsMenu({ onEdit, onShare, onDelete }: { onEdit: () => void; onShare: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ right: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ right: window.innerWidth - r.right, top: r.bottom + 6 });
  }, [open]);

  return (
    <div ref={triggerRef} className="inline-flex">
      <Button size="md" variant="secondary" iconOnly rounded="rounded-full" aria-label="More actions" onClick={() => setOpen((o) => !o)}>
        <MaskIcon src={dotsHorizontalIcon} className="h-[18px] w-[18px]" />
      </Button>
      {createPortal(
        <>
          {open && <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ position: "fixed", right: pos.right, top: pos.top, minWidth: 200 }}
                className="z-[101] rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={editIcon} className="h-[18px] w-[18px]" />
                  Edit membership
                </button>
                <button
                  type="button"
                  onClick={() => { onShare(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={shareIcon} className="h-[18px] w-[18px]" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => { onDelete(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 rounded-lg p-3 text-[14px] font-semibold text-[#E5484D] transition-colors hover:bg-gray-hover"
                >
                  <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                  Delete membership
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}

// Pill switch used in the Settings tab.
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={onClick}>
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
    {label}
  </Button>
);

// Visibility choices for the Settings tab.
const VISIBILITY_OPTIONS: { id: "public" | "unlisted" | "private"; label: string; desc: string }[] = [
  { id: "public", label: "Public", desc: "Anyone can find this membership on your profile and join." },
  { id: "unlisted", label: "Unlisted", desc: "Hidden from your profile — only people with the link can join." },
  { id: "private", label: "Private", desc: "Closed to new members. Existing members keep their access." },
];

const sessionInputClass = "h-11 w-full rounded-xl border border-gray-stroke bg-white px-3.5 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-gray-extra-light focus:border-gray-dark";
const SESSION_DURATIONS = ["30 min", "45 min", "60 min", "90 min"];

// Format a date input (YYYY-MM-DD) + time input (HH:MM) into "Nov 20 · 6:00 PM".
function formatSessionWhen(date: string, time: string): string {
  const parts: string[] = [];
  if (date) parts.push(new Date(`${date}T00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  if (time) parts.push(new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  return parts.join(" · ");
}

// Add-session modal: first a choice between scheduling a new session or adding
// an existing one — "new" opens an inline scheduling form (no pricing, since the
// session is bundled into the membership), "existing" a picker of the coach's
// upcoming group sessions. `taken` hides sessions already on this membership.
function AddSessionModal({ open, sessions, taken, onAdd, onClose }: {
  open: boolean;
  sessions: UpcomingEvent[];
  taken: Set<string>;
  onAdd: (ev: UpcomingEvent) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"choose" | "new" | "existing">("choose");
  // New-session form fields.
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(SESSION_DURATIONS[2]);

  // Always reopen on the choice step with a cleared form.
  useEffect(() => {
    if (open) {
      setStep("choose");
      setName("");
      setDate("");
      setTime("");
      setDuration(SESSION_DURATIONS[2]);
    }
  }, [open]);

  const available = sessions.filter((s) => !taken.has(s.id));
  const canSchedule = Boolean(name.trim() && date && time);
  const scheduleNew = () => {
    if (!canSchedule) return;
    onAdd({
      id: `gs-new-${Date.now()}`,
      title: name.trim(),
      dateTime: formatSessionWhen(date, time),
      duration,
      thumb: eventPlaceholder1,
      free: false,
      price: "",
      enrolled: 0,
      joinable: false,
    });
  };

  const headerCopy = {
    choose: { title: "Add a live session", subtitle: "Include a recurring group session in this membership." },
    new: { title: "Schedule a new session", subtitle: "Set a time and details — it's included with this membership." },
    existing: { title: "Add an existing session", subtitle: "Choose one of your upcoming group sessions to include." },
  }[step];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-7 pb-4 pt-7">
              <div className="flex min-w-0 items-start gap-2">
                {step === "existing" && (
                  <button onClick={() => setStep("choose")} aria-label="Back" className="-ml-1 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                )}
                <div className="min-w-0">
                  <h2 className="font-serif text-[30px] leading-tight text-gray-dark">{headerCopy.title}</h2>
                  <p className="mt-1.5 text-[15px] text-gray-light">{headerCopy.subtitle}</p>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {step === "choose" && (
              <div className="flex flex-col gap-3 px-7 pb-7">
                <button
                  onClick={() => setStep("new")}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-stroke bg-white p-4 text-left transition-colors hover:border-gray-dark"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold text-gray-dark">Schedule a new session</span>
                    <span className="block text-[14px] text-gray-light">Set a date, time, and details from scratch.</span>
                  </span>
                  <svg className="h-5 w-5 shrink-0 text-gray-extra-light transition-colors group-hover:text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                <button
                  onClick={() => setStep("existing")}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-stroke bg-white p-4 text-left transition-colors hover:border-gray-dark"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark">
                    <MaskIcon src={stackIcon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold text-gray-dark">Add an existing session</span>
                    <span className="block text-[14px] text-gray-light">Pick from your upcoming group sessions.</span>
                  </span>
                  <svg className="h-5 w-5 shrink-0 text-gray-extra-light transition-colors group-hover:text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}

            {step === "new" && (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-2">
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[14px] font-semibold text-gray-dark">Session name</span>
                      <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly member Q&A" className={sessionInputClass} />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-[14px] font-semibold text-gray-dark">Date</span>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={sessionInputClass} />
                      </label>
                      <label className="flex flex-col gap-1.5">
                        <span className="text-[14px] font-semibold text-gray-dark">Time</span>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={sessionInputClass} />
                      </label>
                    </div>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[14px] font-semibold text-gray-dark">Duration</span>
                      <select value={duration} onChange={(e) => setDuration(e.target.value)} className={sessionInputClass}>
                        {SESSION_DURATIONS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
                <div className="px-7 py-5">
                  <Button size="lg" variant="primary" rounded="rounded-full" className="w-full font-semibold" disabled={!canSchedule} onClick={scheduleNew}>Schedule session</Button>
                </div>
              </>
            )}

            {step === "existing" && (
              <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-7">
                {available.length === 0 ? (
                  <p className="rounded-2xl bg-gray-hover px-4 py-6 text-center text-[14px] text-gray-light">
                    All of your upcoming group sessions are already part of this membership.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {available.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => onAdd(ev)}
                        className="group flex items-center gap-3 rounded-2xl border border-gray-stroke bg-white p-2.5 pr-4 text-left transition-colors hover:border-gray-dark"
                      >
                        <img src={ev.thumb} alt="" className="h-[52px] w-[88px] shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold text-gray-dark">{ev.title}</span>
                          <span className="block truncate text-[13px] text-gray-light">{ev.dateTime} · {ev.duration} · {ev.enrolled} RSVPs</span>
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors group-hover:bg-gray-dark group-hover:text-white">
                          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function CoachMembershipDetails() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const plan = getSubscriptionBySlug(slug);
  const [tab, setTab] = useState<Tab>("membership");
  // Products added via the "Add product" dropdown, configured in-place through
  // the builder's own modals. `draft` drives the config/list modals; `picking`
  // drives the collection reuse-first picker.
  const [added, setAdded] = useState<OfferingItem[]>([]);
  const [draft, setDraft] = useState<OfferingItem | null>(null);
  const [picking, setPicking] = useState<OfferingItem | null>(null);
  // Seeded mock products, held in state so they can be removed from the list.
  const [seedProducts, setSeedProducts] = useState(INCLUDED_PRODUCTS);
  // Live sessions attached via the "Add session" modal, plus whether it's open.
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [addedSessions, setAddedSessions] = useState<UpcomingEvent[]>([]);
  // Settings tab — pricing + visibility controls.
  const [monthlyPrice, setMonthlyPrice] = useState(String(plan?.monthly ?? ""));
  const [annualDiscountOn, setAnnualDiscountOn] = useState(true);
  const [annualDiscountPct, setAnnualDiscountPct] = useState("20");
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    document.title = `Leland Prototype | ${plan?.title ?? "Membership"}`;
  }, [plan?.title]);

  if (!plan) {
    return (
      <div className="max-w-[720px]">
        <h1 className="text-[30px] font-medium text-gray-dark md:text-[38px]">Membership not found</h1>
        <p className="mt-2 text-[14px] text-[#707070]">
          <Link to={`/my-leland/manage/${category}`} className="text-gray-dark underline">Back to category</Link>
        </p>
      </div>
    );
  }

  const mrr = plan.monthly * plan.members;
  const newMembers = Math.max(3, Math.round(plan.members * 0.09));
  const annualCount = Math.round(plan.members * 0.3);
  const monthlyCount = plan.members - annualCount;
  const arpu = Math.round(mrr / plan.members);
  // Settings — annual price derived from the monthly price and discount.
  const annualPrice = Math.round(Number(monthlyPrice || 0) * 12 * (1 - Number(annualDiscountPct || 0) / 100));

  const editBuilder = () => navigate(`/my-leland/manage/${category}/new-product/subscription`);
  const addSession = () => navigate(`/my-leland/manage/${category}/new-event`);

  // Add-product flow — mirrors the offering builder's OfferingsStep, but the
  // modals open directly on this page instead of routing into the builder.
  const addProduct = (slug: string) => {
    const item: OfferingItem = { id: Date.now(), slug, config: defaultConfigFor(slug), configured: false };
    // Collections open the reuse-first picker; everything else goes straight
    // to its config modal.
    if (slug === "collection") setPicking(item);
    else setDraft(item);
  };
  const patchDraft = (patch: Record<string, string>) => setDraft((d) => (d ? { ...d, config: { ...d.config, ...patch } } : d));
  const commit = (item: OfferingItem) =>
    setAdded((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i === -1) return [...prev, item];
      const next = prev.slice();
      next[i] = item;
      return next;
    });
  // Attach an existing collection from the Content library to the membership.
  const attachCollection = (item: OfferingItem, c: Collection) => {
    commit({
      ...item,
      config: { ...item.config, collectionId: c.id, title: c.title, description: c.description },
      items: c.items.map((it) => ({ id: it.id, config: { ...it.config } })),
      configured: true,
    });
    setPicking(null);
  };
  // Save a collection built (or edited) in the list modal; persist it to the
  // shared Content store so it shows up elsewhere too.
  const saveCollection = () => {
    if (!draft) return;
    const id = draft.config.collectionId || newCollectionId();
    upsertCollection({
      id,
      title: draft.config.title || "Untitled collection",
      description: draft.config.description || "",
      items: (draft.items ?? []).map((it) => ({ id: it.id, config: { ...it.config } })),
    });
    commit({ ...draft, config: { ...draft.config, collectionId: id }, configured: true });
    setDraft(null);
  };
  // Re-open an added product's modal to edit it (collections edit their contents
  // directly rather than reopening the picker).
  const openEdit = (item: OfferingItem) => setDraft(item);

  // Seeded mock rows + rows for products added in-session.
  const includedRows = [
    ...seedProducts.map((p) => ({
      key: p.title,
      ...p,
      onEdit: editBuilder,
      onRemove: () => setSeedProducts((prev) => prev.filter((x) => x !== p)),
    })),
    ...added.map((item) => ({
      key: `item-${item.id}`,
      ...includedFromItem(item),
      onEdit: () => openEdit(item),
      onRemove: () => setAdded((prev) => prev.filter((x) => x.id !== item.id)),
    })),
  ];

  // Included live sessions — recurring sessions bundled into the membership,
  // rendered with the same event row used on the category management page.
  const liveSessionRows: UpcomingEvent[] = [
    { id: "coaching", title: "Monthly group coaching call", dateTime: "First Tuesday", duration: "60 min", thumb: eventPlaceholder1, free: false, price: "", enrolled: plan.members, joinable: false },
    { id: "qa", title: "Live member Q&A", dateTime: "Every other Thursday", duration: "45 min", thumb: eventPlaceholder2, free: false, price: "", enrolled: plan.members, joinable: false },
  ];

  const TABS: PivotTab<Tab>[] = [
    { id: "membership", label: "Membership" },
    { id: "members", label: "Members" },
    { id: "earnings", label: "Earnings" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="pb-16">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button size="md" variant="secondary" iconOnly onClick={() => navigate(`/my-leland/manage/${category}`)} aria-label="Back">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Button>
        <div className="flex items-center gap-2">
          <LinkButton size="md" variant="secondary" rounded="rounded-full" href={`/offering/${plan.slug}`} className="font-semibold">
            <MaskIcon src={eyeIcon} className="h-[18px] w-[18px]" />
            Preview
          </LinkButton>
          <MembershipActionsMenu onEdit={editBuilder} onShare={() => navigate(`/offering/${plan.slug}`)} onDelete={() => setConfirmDelete(true)} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        {plan.image && <img src={plan.image} alt="" className="hidden h-[72px] w-[100px] shrink-0 rounded-xl object-cover sm:block" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[34px] leading-[1.1] text-gray-dark md:text-[40px]">{plan.title}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E3F2E9] px-2.5 py-1 text-[12px] font-semibold text-[#1B8A54]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1B8A54]" />
              Active
            </span>
          </div>
          <p className="mt-2 max-w-[640px] text-[16px] leading-relaxed text-gray-light">{plan.headline}</p>
        </div>
      </div>

      {/* Pivot tabs — shared component mirroring the profile template's tab bar. */}
      <Pivot className="mt-8" fill={false} tabs={TABS} active={tab} onChange={setTab} />

      {/* Membership — what's included & recurring sessions */}
      {tab === "membership" && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-5">
            <section className={card}>
              <SectionHeader title="What's included" />
              {/* Products listed directly in the card as hover rows (mirrors the
                  Live sessions section below), with the "Add product" button at
                  the bottom. */}
              <div className="-mx-3 flex flex-col gap-1">
                {includedRows.map((p) => (
                  <div key={p.key} className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F7F7F7]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <img src={p.icon} alt="" className="h-[26px] w-[26px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-gray-dark">{p.title}</span>
                      <span className="flex items-center gap-1.5 text-[15px] text-gray-light">
                        <span className="truncate">{p.detail}</span>
                      </span>
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[15px] text-gray-dark">{p.price}</span>
                      <RowActionsMenu onEdit={p.onEdit} onRemove={p.onRemove} label={p.title} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex">
                <AddProductMenu onAdd={addProduct} />
              </div>
            </section>

            <section className={card}>
              <SectionHeader title="Live sessions" />
              <p className="-mt-3 mb-3 text-[15px] text-gray-light">Live, online group sessions your members get access to.</p>
              <div className="-mx-3 flex flex-col gap-1">
                {[...liveSessionRows, ...addedSessions].map((ev) => (
                  <UpcomingEventRow key={ev.id} ev={ev} onJoin={addSession} onDetails={addSession} showPrice={false} enrolledNoun="RSVPs" />
                ))}
              </div>
              <div className="mt-4 flex">
                <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold" onClick={() => setSessionModalOpen(true)}>
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add session
                </Button>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-5">
            <LearnMoreCard />
          </div>
        </div>
      )}

      {/* Members */}
      {tab === "members" && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard label="Active members" value={plan.members.toLocaleString()} delta={`+${newMembers} this month`} />
            <StatCard label="Churn rate" value="2.1%" delta="-0.4% vs last month" />
          </div>

          <section className={card}>
            <SectionHeader
              title="Members"
              action={<Link to="/my-leland/messages" className="text-[14px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70">Message all</Link>}
            />
            <div className="-mx-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse">
                <thead>
                  <tr className="border-y border-gray-stroke text-left text-[13px] font-medium text-gray-light">
                    <th className="py-2.5 pl-6 pr-3 font-medium">Member</th>
                    <th className="px-3 py-2.5 font-medium">Plan</th>
                    <th className="px-3 py-2.5 font-medium">Joined</th>
                    <th className="py-2.5 pl-3 pr-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ROSTER.map((m) => (
                    <tr key={m.name} className="border-b border-gray-stroke last:border-0">
                      <td className="py-3 pl-6 pr-3">
                        <div className="flex items-center gap-2.5">
                          <img src={m.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                          <span className="text-[14px] font-medium text-gray-dark">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[14px] text-gray-light">{m.plan}</td>
                      <td className="px-3 py-3 text-[14px] text-gray-light">{m.joined}</td>
                      <td className="py-3 pl-3 pr-6">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1B8A54]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1B8A54]" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-gray-light">Showing {ROSTER.length} of {plan.members} members</p>
          </section>
        </div>
      )}

      {/* Earnings */}
      {tab === "earnings" && (
        <div className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Monthly recurring revenue" value={`$${mrr.toLocaleString()}`} delta="+8% vs last month" />
            <StatCard label="Avg. revenue / member" value={`$${arpu}`} delta="+$3 vs last month" />
            <StatCard label="Lifetime revenue" value={`$${(mrr * 11).toLocaleString()}`} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className={`${card} flex flex-col`}>
              <SectionHeader title="Revenue over time" />
              <RevenueChart mrr={mrr} />
            </section>

            <div className="flex flex-col gap-5">
              <section className={card}>
                <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Revenue by plan</h2>
                <div className="flex flex-col gap-4">
                  <RevenueRow label="Monthly" value={plan.monthly * monthlyCount} total={mrr} color="bg-[#80ACED]" />
                  <RevenueRow label="Annual (monthly equiv.)" value={Math.round((plan.annual / 12) * annualCount)} total={mrr} color="bg-[#94370C]" />
                </div>
              </section>

              <section className={card}>
                <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Plan mix</h2>
                <div className="flex justify-center py-2">
                  <DonutChart
                    segments={[
                      { label: "Monthly", value: monthlyCount, color: "#80ACED" },
                      { label: "Annual", value: annualCount, color: "#94370C" },
                    ]}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 text-gray-dark"><span className="h-2.5 w-2.5 rounded-full bg-[#80ACED]" />Monthly</span>
                    <span className="font-semibold text-gray-dark">{monthlyCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="flex items-center gap-2 text-gray-dark"><span className="h-2.5 w-2.5 rounded-full bg-[#94370C]" />Annual</span>
                    <span className="font-semibold text-gray-dark">{annualCount}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="my-6 flex justify-center">
            <LinkButton size="md" variant="secondary" rounded="rounded-full" href="/my-leland/earnings" className="font-semibold">
              View all earnings
            </LinkButton>
          </div>
        </div>
      )}

      {/* Calendar */}
      {tab === "calendar" && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className={card}>
            <SectionHeader title="November 2026" action={<AddButton label="Add session" onClick={addSession} />} />
            <CalendarGrid />
          </section>

          <section className={card}>
            <h2 className="mb-4 text-[18px] font-semibold text-gray-dark">Upcoming sessions</h2>
            <div className="flex flex-col divide-y divide-gray-stroke">
              {CALENDAR_EVENTS.map((e) => (
                <UpcomingRow key={`${e.date}-${e.title}`} month="Nov" day={String(e.date)} weekday={e.weekday} time={e.time} title={e.title} attendees={e.attendees} duration={e.duration} onManage={addSession} />
              ))}
              {UPCOMING_NEXT_MONTH.map((e) => (
                <UpcomingRow key={`${e.label}-${e.title}`} month="Dec" day={e.label.replace("Dec ", "")} weekday={e.weekday} time={e.time} title={e.title} attendees={e.attendees} duration={e.duration} onManage={addSession} />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Settings */}
      {tab === "settings" && (
        <div className="mt-6 flex flex-col gap-5">
          {/* Pricing */}
          <section className={card}>
            <h2 className="text-[18px] font-semibold text-gray-dark">Pricing</h2>
            <p className="mt-1 text-[14px] text-gray-light">What members pay to join this membership.</p>

            <div className="mt-5 flex flex-col gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-[14px] font-semibold text-gray-dark">Monthly price</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-gray-light">$</span>
                  <input
                    type="number"
                    min="0"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-stroke bg-white pl-7 pr-16 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-gray-extra-light focus:border-gray-dark"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[14px] text-gray-light">/ month</span>
                </div>
              </label>

              <div className="border-t border-gray-stroke pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-gray-dark">Offer an annual plan</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-gray-light">Let members pay yearly at a discount — great for reducing churn.</p>
                  </div>
                  <Toggle checked={annualDiscountOn} onChange={() => setAnnualDiscountOn((v) => !v)} />
                </div>

                {annualDiscountOn && (
                  <div className="mt-4 flex flex-col gap-3 rounded-xl bg-gray-hover p-4">
                    <label className="flex items-center justify-between gap-4">
                      <span className="text-[14px] font-medium text-gray-dark">Annual discount</span>
                      <span className="relative w-24">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={annualDiscountPct}
                          onChange={(e) => setAnnualDiscountPct(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-stroke bg-white pl-3 pr-8 text-[15px] text-gray-dark outline-none transition-colors focus:border-gray-dark"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-light">%</span>
                      </span>
                    </label>
                    <div className="flex items-center justify-between border-t border-gray-stroke pt-3 text-[14px]">
                      <span className="text-gray-light">Members pay</span>
                      <span className="font-semibold text-gray-dark">
                        ${annualPrice.toLocaleString()}<span className="font-normal text-gray-light">/yr</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Visibility */}
          <section className={card}>
            <h2 className="text-[18px] font-semibold text-gray-dark">Visibility</h2>
            <p className="mt-1 text-[14px] text-gray-light">Control who can find and join this membership.</p>

            <div className="mt-4 flex flex-col gap-2.5">
              {VISIBILITY_OPTIONS.map((o) => {
                const active = visibility === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setVisibility(o.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${active ? "border-gray-dark bg-gray-hover/50" : "border-gray-stroke hover:bg-gray-hover"}`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-gray-dark" : "border-gray-stroke"}`}>
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-gray-dark" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-gray-dark">{o.label}</span>
                      <span className="block text-[13px] leading-snug text-gray-light">{o.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Danger zone */}
          <section className={card}>
            <h2 className="text-[18px] font-semibold text-gray-dark">Delete membership</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-gray-light">
              Permanently remove this membership. Existing members will lose access and recurring billing will stop. This can't be undone.
            </p>
            <div className="mt-4">
              <Button size="md" variant="danger" rounded="rounded-full" className="font-semibold" onClick={() => setConfirmDelete(true)}>
                <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                Delete membership
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Add-product modals — the builder's own config/list/picker modals, driven
          in-place so adding a product never leaves this page. */}
      <ConfigModal
        item={draft && (draft.slug === "coaching-time" || draft.slug === "content" || draft.slug === "workshop") ? draft : null}
        lockedCoachingMode={draft?.slug === "coaching-time" ? "set" : null}
        lockedCoachingReason="subscription"
        onChange={patchDraft}
        onSave={() => { if (draft) { commit({ ...draft, configured: true }); setDraft(null); } }}
        onClose={() => setDraft(null)}
      />
      <CollectionPickerModal
        open={!!picking}
        onPick={(c) => { if (picking) attachCollection(picking, c); }}
        onCreateNew={() => { if (picking) { setDraft(picking); setPicking(null); } }}
        onClose={() => setPicking(null)}
      />
      <ListConfigModal
        item={draft && draft.slug === "collection" ? draft : null}
        onGeneralChange={patchDraft}
        onItemsChange={(items) => setDraft((d) => (d ? { ...d, items } : d))}
        onSave={saveCollection}
        onClose={() => setDraft(null)}
      />
      <AddSessionModal
        open={sessionModalOpen}
        sessions={MY_GROUP_SESSIONS}
        taken={new Set(addedSessions.map((s) => s.id))}
        onAdd={(ev) => { setAddedSessions((prev) => [...prev, ev]); setSessionModalOpen(false); }}
        onClose={() => setSessionModalOpen(false)}
      />
      <ConfirmModal
        open={confirmDelete}
        title={`Delete ${plan.title}?`}
        body="Existing members will lose access and recurring billing will stop. This can't be undone."
        confirmLabel="Delete membership"
        onConfirm={() => { setConfirmDelete(false); navigate(`/my-leland/manage/${category}`); }}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}

// Two-segment donut (plan mix). Segments are drawn clockwise from 12 o'clock
// with a small gap between them.
function DonutChart({ segments, size = 168, thickness = 26, gap = 3 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  gap?: number;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {segments.map((seg) => {
        const len = (seg.value / total) * c;
        const dash = Math.max(len - gap, 0);
        const circle = (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return circle;
      })}
    </svg>
  );
}

// Last six months of MRR, ramping up to the current value.
function RevenueChart({ mrr }: { mrr: number }) {
  // Trailing 12 months ending in November; revenue ramps from ~55% to today.
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const factors = [0.55, 0.59, 0.63, 0.67, 0.71, 0.75, 0.79, 0.83, 0.87, 0.91, 0.95, 1];
  const values = factors.map((f) => Math.round(mrr * f));
  const max = Math.max(...values);
  return (
    // Fills the card: the plot area flexes to take all available height so the
    // bars grow with the container instead of leaving whitespace below.
    <div className="flex min-h-[220px] flex-1 flex-col">
      {/* Plot area — columns are full-height so the bars' percentage heights
          resolve; bars cap at 85% to leave headroom for the value labels. */}
      <div className="flex flex-1 items-end gap-1.5">
        {values.map((v, i) => (
          <div key={months[i]} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1.5 text-[11px] font-medium text-gray-dark">${(v / 1000).toFixed(1)}k</span>
            <div
              className="w-full rounded-t-md bg-[#80ACED]"
              style={{ height: `${(v / max) * 85}%` }}
            />
          </div>
        ))}
      </div>
      {/* Month axis */}
      <div className="mt-2 flex gap-1.5">
        {months.map((m) => (
          <span key={m} className="flex-1 text-center text-[11px] text-gray-light">{m}</span>
        ))}
      </div>
    </div>
  );
}

function RevenueRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[14px]">
        <span className="text-gray-dark">{label}</span>
        <span className="font-semibold text-gray-dark">${value.toLocaleString()}/mo</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-hover">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// November 2026 starts on a Sunday; today is the 10th.
function CalendarGrid() {
  const eventDays = new Set(CALENDAR_EVENTS.map((e) => e.date));
  const today = 10;
  const cells: (number | null)[] = [];
  // Nov 1, 2026 is a Sunday → no leading blanks.
  for (let d = 1; d <= 30; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium text-gray-light">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`b-${i}`} />;
          const hasEvent = eventDays.has(d);
          const isToday = d === today;
          return (
            <div
              key={d}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-[13px] ${
                isToday ? "bg-gray-dark font-semibold text-white" : hasEvent ? "bg-[#80ACED]/20 font-medium text-gray-dark" : "text-gray-dark"
              }`}
            >
              {d}
              {hasEvent && !isToday && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#80ACED]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingRow({ month, day, weekday, time, title, attendees, duration, onManage }: { month: string; day: string; weekday: string; time: string; title: string; attendees: string; duration: string; onManage: () => void }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-hover">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-light">{month}</span>
        <span className="text-[16px] font-bold leading-none text-gray-dark">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-gray-dark">{title}</p>
        <p className="mt-0.5 text-[13px] text-gray-light">{weekday} · {time} · {duration} · {attendees}</p>
      </div>
      <button onClick={onManage} className="shrink-0 text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark">Manage</button>
    </div>
  );
}
