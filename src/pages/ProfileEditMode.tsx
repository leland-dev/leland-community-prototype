import { useState, useRef, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useExpertMode } from "../contexts/ExpertModeContext";
import coverImage from "../assets/img/cover-image-2.png";
import profilePhoto from "../assets/profile photos/profile photo.png";
import verifiedIcon from "../assets/icons/verified-new.svg";
import editIcon from "../assets/icons/edit.svg";
import addPlusIcon from "../assets/icons/add-plus.svg";
import eyeIcon from "../assets/icons/eye.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";
import videoThumbnail from "../assets/img/Video-Thumbnail.png";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import starOutlineIcon from "../assets/icons/star-icon.svg";
import trashIcon from "../assets/icons/trash.svg";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";
import gsbLogo from "../assets/logos/gsb.png";
import yaleLogo from "../assets/logos/yale.png";
import metaLogo from "../assets/logos/meta.png";
import googleLogo from "../assets/logos/google.png";
import linkedinLogo from "../assets/org-logos/linkedin-logo.png";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import pmIcon from "../assets/icons/category-icons/product-management.svg";
import bookBookmarkIcon from "../assets/icons/book-bookmark.svg";
import piggyBankIcon from "../assets/icons/Piggy bank, Coin.1.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import supportivenessIcon from "../assets/icons/supportiveness.svg";
import { LogoStrip, initialOutcomes, initialSchools } from "./CoachReviews";

/* ─────────────────────────────────────────────────────────────────────────
   My Leland → Profile — "Edit mode"

   A beige, card-based editor that mirrors the Dashboard tab's treatment: each
   profile section sits in its own white card. Shared cards (Hero, About,
   Education, Experience) show for everyone; coaching cards (Categories, Profile
   video, Why I coach, Reviews) show only for experts.
   ───────────────────────────────────────────────────────────────────────── */

// Dashboard-style white card.
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

// Card heading row: title with an action on the right.
function CardHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[20px] font-semibold text-gray-dark">{title}</h2>
      {action}
    </div>
  );
}

// An icon rendered as a mask so it inherits the current text color (bg-current).
function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

// Filled version of star-icon.svg (same path, filled with currentColor) — the
// active/featured state of the outline star used elsewhere.
function StarFilled({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7.7328 20.829H7.7328C6.9984 21.2123 6.09229 20.9277 5.70895 20.1933C5.5556 19.8996 5.50386 19.5633 5.5618 19.237L6.3708 14.6L2.9648 11.336V11.336C2.36528 10.7642 2.34276 9.81477 2.91448 9.21526C3.14782 8.97058 3.45697 8.81191 3.7918 8.76498L8.5208 8.08898L10.6558 3.82998V3.82998C11.0237 3.08771 11.9236 2.78419 12.6659 3.15206C12.9599 3.29779 13.1981 3.53593 13.3438 3.82998L15.4788 8.08898L20.2078 8.76498V8.76498C21.0282 8.87997 21.6001 9.63826 21.4851 10.4587C21.4381 10.7935 21.2795 11.1026 21.0348 11.336L17.6288 14.6L18.4378 19.238V19.238C18.5826 20.0536 18.0388 20.8323 17.2232 20.9771C16.8969 21.0351 16.5606 20.9833 16.2668 20.83L11.9998 18.625L7.7328 20.829Z" />
    </svg>
  );
}

function EditButton({ label = "Edit", icon = editIcon, onClick }: { label?: string; icon?: string; onClick?: () => void }) {
  return (
    <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 text-[14px] font-semibold" onClick={onClick}>
      <img src={icon} alt="" className="h-[16px] w-[16px]" />
      {label}
    </Button>
  );
}

// Save / Cancel action row shared by every card's edit state: Cancel (left) and
// Save (right, gray-dark) pushed to opposite ends. Large, square-cornered, 600.
function SaveCancelRow({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <Button size="lg" variant="secondary" className="font-semibold" onClick={onCancel}>Cancel</Button>
      <Button size="lg" variant="dark" className="font-semibold" onClick={onSave}>Save</Button>
    </div>
  );
}

// A card for a long editable text field (About, Why I coach). The Edit button
// lives in the card header (like the other cards); the view state clamps to 6
// lines with a Read more / Read less toggle that animates its height (matching
// the public profile template), and the view/edit states crossfade.
const COLLAPSED_TEXT_HEIGHT = 154; // ~6 lines at 16px / 1.6 line-height

function EditableTextCard({ title, value, onChange }: { title: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  // Only show the Read more toggle when the text actually exceeds 6 lines.
  useEffect(() => {
    const el = pRef.current;
    if (el) setOverflow(el.scrollHeight > COLLAPSED_TEXT_HEIGHT + 4);
  }, [value, editing]);

  const transition = { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const };

  return (
    <Card>
      <CardHead
        title={title}
        action={editing ? undefined : <EditButton onClick={() => { setDraft(value); setEditing(true); }} />}
      />
      <AnimatePresence mode="wait" initial={false}>
        {editing ? (
          <motion.div key="edit" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={transition}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              rows={8}
              className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3.5 text-[16px] leading-[1.6] text-[#4C4C4C] outline-none focus:border-gray-dark"
            />
            <div className="mt-3">
              <SaveCancelRow
                onSave={() => { onChange(draft); setEditing(false); }}
                onCancel={() => { setDraft(value); setEditing(false); }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="view" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={transition}>
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : COLLAPSED_TEXT_HEIGHT }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative overflow-hidden"
            >
              <p ref={pRef} className="whitespace-pre-line text-[16px] leading-[1.6] text-[#4C4C4C]">{value}</p>
              {overflow && (
                <motion.div
                  initial={false}
                  animate={{ opacity: expanded ? 0 : 1 }}
                  transition={{ duration: 0.35, ease: [0.42, 0, 0.58, 1] }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[3.2em] bg-gradient-to-t from-white to-transparent"
                />
              )}
            </motion.div>
            {overflow && (
              <Button size="md" variant="secondary" className="mt-3 font-semibold" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "Read less" : "Read more"}
                <img src={chevronDownIcon} alt="" className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function OrgTile({ label, color, logo }: { label: string; color: string; logo?: string }) {
  if (logo) {
    return (
      <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[4px]">
        <img src={logo} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[4px] text-[16px] font-semibold text-white" style={{ backgroundColor: color }}>
      {label}
    </div>
  );
}

type Credential = { id: string; tileLabel: string; tileColor: string; title: string; subtitle: string; org: string; logo?: string; featured?: boolean };

// Small colored org square (mirrors the credential tiles at 18px).
function OrgSquare({ tileLabel, tileColor, logo }: { tileLabel: string; tileColor: string; logo?: string }) {
  if (logo) {
    return <img src={logo} alt="" className="h-[18px] w-[18px] shrink-0 rounded-[3px] object-cover" />;
  }
  return (
    <span
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] text-[9px] font-semibold leading-none text-white"
      style={{ backgroundColor: tileColor }}
    >
      {tileLabel}
    </span>
  );
}

// Compact org tag used in the hero's "featured experience" row.
function FeaturedTag({ tileLabel, tileColor, org, logo }: { tileLabel: string; tileColor: string; org: string; logo?: string }) {
  return (
    <div className="flex items-center gap-[6px]">
      <OrgSquare tileLabel={tileLabel} tileColor={tileColor} logo={logo} />
      <span>{org}</span>
    </div>
  );
}

// Custom dropdown for picking a featured experience/education entry — shows the
// org's colored square to the left of its name (native <select> can't render
// images).
function FeaturedSelect({ value, options, onChange }: { value: string; options: Credential[]; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const selected = options.find((o) => o.id === value);
  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-left text-[16px] text-gray-dark outline-none transition-colors focus:border-gray-dark ${open ? "border-gray-dark" : "border-gray-300"}`}
      >
        {selected && <OrgSquare tileLabel={selected.tileLabel} tileColor={selected.tileColor} logo={selected.logo} />}
        <span className="flex-1 truncate">{selected?.org ?? "Select"}</span>
        <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className={`shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border border-gray-stroke bg-white p-1 shadow-lg">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => { onChange(o.id); setOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[16px] text-gray-dark transition-colors hover:bg-gray-hover ${o.id === value ? "bg-gray-hover" : ""}`}
            >
              <OrgSquare tileLabel={o.tileLabel} tileColor={o.tileColor} logo={o.logo} />
              <span className="flex-1 truncate">{o.org}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Medium reveal icon button (matches the Intro Video banner actions).
function IconAction({ onClick, label, children }: { onClick?: () => void; label: string; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex shrink-0 items-center justify-center rounded-full p-3 text-gray-dark transition-colors hover:bg-gray-hover">
      {children}
    </button>
  );
}

// Reveal-on-hover buttons fade + scale in. No `layout` — the persistent featured
// star is a plain inline button, so it moves with the section instantly (e.g. on
// the Expert toggle) rather than animating separately.
const revealAnim = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
};

function CredentialRow({ item, onRemove, onToggleFeatured }: { item: Credential; onRemove: () => void; onToggleFeatured: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-2 py-2 transition-colors hover:bg-[#fafafa]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <OrgTile label={item.tileLabel} color={item.tileColor} logo={item.logo} />
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-medium text-gray-dark">{item.title}</p>
        <p className="mt-[2px] text-[14px] text-[#707070]">{item.subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center justify-end">
        {/* Featured star — persistent inline button; slides left smoothly as the
            reveal group expands on hover (the group's own width animates, so the
            page reflowing on the Expert toggle never triggers it). */}
        {item.featured && (
          <IconAction label="Unfeature" onClick={onToggleFeatured}>
            <StarFilled className="h-[18px] w-[18px]" />
          </IconAction>
        )}
        {/* Reveal on hover: outline star (when not featured) + edit + delete. */}
        <AnimatePresence initial={false}>
          {hovered && (
            <motion.div
              key="reveal"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center overflow-hidden"
            >
              {!item.featured && (
                <IconAction label="Feature" onClick={onToggleFeatured}>
                  <MaskIcon src={starOutlineIcon} className="h-[18px] w-[18px]" />
                </IconAction>
              )}
              <IconAction label="Edit"><MaskIcon src={editIcon} className="h-[18px] w-[18px]" /></IconAction>
              <IconAction label="Delete" onClick={onRemove}><MaskIcon src={trashIcon} className="h-[18px] w-[18px]" /></IconAction>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const categoryListings = [
  { slug: "mba", category: "MBA", headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits", icon: mbaIcon },
  { slug: "management-consulting", category: "Management Consulting", headline: "Ex-McKinsey Consultant | Wharton MBA | Case Prep Pro", icon: consultingIcon },
  { slug: "product-management", category: "Product Management", headline: "Senior PM at LinkedIn | Ex-Meta | Breaking Into Tech", icon: pmIcon },
];

export default function ProfileEditMode({ publicProfileBanner = true, introVideoCard = true, afterHero }: { publicProfileBanner?: boolean; introVideoCard?: boolean; afterHero?: ReactNode } = {}) {
  const { expert } = useExpertMode();
  const navigate = useNavigate();
  const visibleOutcomes = [...initialOutcomes, ...initialSchools].filter((o) => !o.hidden);

  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Rivera");
  const name = `${firstName} ${lastName}`;

  const [headline, setHeadline] = useState(
    expert
      ? "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits"
      : "Building products that matter. Passionate about AI, design, and helping others break into tech.",
  );

  const [about, setAbout] = useState(
    "I help ambitious professionals break into top MBA programs and land PM roles at leading tech companies. With 8+ years in product at LinkedIn and Meta, plus my own Stanford GSB journey, I bring firsthand experience to every conversation. Over the years I've reviewed thousands of applications, sat on both sides of the admissions and hiring table, and developed a repeatable framework for helping people tell the story only they can tell. My approach is direct but supportive: we start by getting crystal clear on your goals, then work backwards to a plan that fits your timeline, your background, and the specific programs or companies you're targeting. I care less about polishing a generic profile and more about surfacing the moments that actually make you memorable. Whether you're staring at a blank essay doc, prepping for a case interview, or trying to figure out whether an MBA is even the right move, I'll meet you where you are. Expect candid feedback, a lot of questions, and a partner who's genuinely invested in the outcome. The applicants I work with don't just get in — they leave the process knowing themselves better and telling a sharper story about where they're headed next.",
  );
  const [whyCoach, setWhyCoach] = useState(
    "I remember how overwhelming the application process felt, and how much a great mentor changed my trajectory. Coaching is my way of paying that forward — helping people tell their most honest, compelling story. When I was applying, I almost talked myself out of it entirely; I didn't think my background was impressive enough, and I had no idea how to translate what I'd done into something an admissions committee would care about. One conversation with the right person changed everything, and it wasn't about gaming the system — it was about helping me see my own experience clearly. That's the feeling I try to recreate for every person I work with. I coach because I love the moment when someone realizes their story is stronger than they thought, and because I've seen how much a single acceptance can change the shape of a career and a life. It's the most rewarding work I do, and I don't take the trust that comes with it lightly.",
  );

  const [experiences, setExperiences] = useState<Credential[]>([
    { id: "e1", tileLabel: "in", tileColor: "#0A66C2", title: "Senior Product Manager", subtitle: "LinkedIn · 2019 – Present", org: "LinkedIn", logo: linkedinLogo, featured: true },
    { id: "e2", tileLabel: "M", tileColor: "#1877F2", title: "Product Manager", subtitle: "Meta · 2016 – 2019", org: "Meta", logo: metaLogo },
    { id: "e3", tileLabel: "G", tileColor: "#0F9D58", title: "Associate Product Manager", subtitle: "Google · 2012 – 2015", org: "Google", logo: googleLogo },
  ]);
  const [education, setEducation] = useState<Credential[]>([
    { id: "d1", tileLabel: "S", tileColor: "#8C1515", title: "Stanford Graduate School of Business", subtitle: "MBA · 2016 – 2018", org: "Stanford GSB", logo: gsbLogo, featured: true },
    { id: "d2", tileLabel: "Y", tileColor: "#00356B", title: "Yale University", subtitle: "BA, Economics · 2008 – 2012", org: "Yale University", logo: yaleLogo },
  ]);

  // Featured hero slots derive from the single-select `featured` flag on each
  // section's items, so the star buttons and the hero dropdowns share one state.
  const featuredExpItem = experiences.find((e) => e.featured);
  const featuredEduItem = education.find((e) => e.featured);

  // Hero edit state + drafts (name, headline, featured slots).
  const [editingHero, setEditingHero] = useState(false);
  const [firstDraft, setFirstDraft] = useState(firstName);
  const [lastDraft, setLastDraft] = useState(lastName);
  const [headlineDraft, setHeadlineDraft] = useState(headline);
  const [featuredExpDraft, setFeaturedExpDraft] = useState(featuredExpItem?.id ?? "");
  const [featuredEduDraft, setFeaturedEduDraft] = useState(featuredEduItem?.id ?? "");

  const startEditHero = () => {
    setFirstDraft(firstName);
    setLastDraft(lastName);
    setHeadlineDraft(headline);
    setFeaturedExpDraft(featuredExpItem?.id ?? "");
    setFeaturedEduDraft(featuredEduItem?.id ?? "");
    setEditingHero(true);
  };
  const saveHero = () => {
    setFirstName(firstDraft);
    setLastName(lastDraft);
    setHeadline(headlineDraft);
    setExperiences((prev) => prev.map((e) => ({ ...e, featured: e.id === featuredExpDraft })));
    setEducation((prev) => prev.map((e) => ({ ...e, featured: e.id === featuredEduDraft })));
    setEditingHero(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Banner — links to the public-facing profile (wired later). Hidden on
          Edit mode 2, which surfaces the public profile in its right rail. */}
      {publicProfileBanner && (
        <button
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-xl bg-gray-hover px-4 py-3.5 text-left text-gray-dark transition-colors hover:bg-[rgba(34,34,34,0.1)]"
        >
          <MaskIcon src={eyeIcon} className="h-[18px] w-[18px]" />
          <span className="flex-1 text-[15px] font-medium">View your public profile</span>
          <MaskIcon src={chevronRightIcon} className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      {/* Hero — cover is full-bleed to the card edges (own section, not the
          padded Card wrapper) and taller. */}
      <section className="rounded-2xl bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10">
        <div className="group/cover relative overflow-hidden rounded-t-2xl">
          <img src={coverImage} alt="Cover" className="aspect-[4/1] w-full object-cover" />
          <button className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[#222222]/25 px-3 py-1.5 text-[13px] font-semibold text-white opacity-0 backdrop-blur-[12px] transition-all hover:bg-[#222222]/35 group-hover/cover:opacity-100">
            <img src={editIcon} alt="" className="h-[14px] w-[14px] brightness-0 invert" />
            Edit cover
          </button>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          {/* Photo + Edit — Edit sits across from the photo, bottom-aligned with
              it (like the Follow button on the public profile template). */}
          <div className="flex items-end justify-between">
            {/* Hover: darken the photo + reveal a centered Edit pill (mirrors the
                Dashboard program cards). */}
            <button type="button" aria-label="Edit photo" className="group/avatar relative -mt-14 shrink-0">
              <img src={profilePhoto} alt={name} className="h-28 w-28 rounded-full border-4 border-white object-cover" />
              <span className="pointer-events-none absolute inset-1 overflow-hidden rounded-full">
                <span className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover/avatar:opacity-100" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex translate-y-1 items-center gap-1 rounded-full bg-[#222222]/25 px-3 py-1.5 text-[13px] font-semibold text-white opacity-0 backdrop-blur-[12px] transition-[transform,opacity] duration-200 ease-out group-hover/avatar:translate-y-0 group-hover/avatar:opacity-100">
                    <img src={editIcon} alt="" className="h-[13px] w-[13px] brightness-0 invert" />
                    Edit
                  </span>
                </span>
              </span>
            </button>
            {!editingHero && <EditButton label="Edit" onClick={startEditHero} />}
          </div>

          <AnimatePresence mode="wait" initial={false}>
          {editingHero ? (
            /* ── Edit state — name, headline, and featured experience ── */
            <motion.div key="hero-edit" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }} className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="mb-1 block text-[13px] font-medium text-gray-light">First name</span>
                  <input value={firstDraft} onChange={(e) => setFirstDraft(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[16px] text-gray-dark outline-none focus:border-gray-dark" />
                </label>
                <label className="flex-1">
                  <span className="mb-1 block text-[13px] font-medium text-gray-light">Last name</span>
                  <input value={lastDraft} onChange={(e) => setLastDraft(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[16px] text-gray-dark outline-none focus:border-gray-dark" />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-gray-light">Headline</span>
                <input value={headlineDraft} onChange={(e) => setHeadlineDraft(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[16px] text-gray-dark outline-none focus:border-gray-dark" />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <span className="mb-1 block text-[13px] font-medium text-gray-light">Featured experience</span>
                  <FeaturedSelect value={featuredExpDraft} options={experiences} onChange={setFeaturedExpDraft} />
                </div>
                <div className="flex-1">
                  <span className="mb-1 block text-[13px] font-medium text-gray-light">Featured education</span>
                  <FeaturedSelect value={featuredEduDraft} options={education} onChange={setFeaturedEduDraft} />
                </div>
              </div>

              <SaveCancelRow onSave={saveHero} onCancel={() => setEditingHero(false)} />
            </motion.div>
          ) : (
            /* ── View state ── */
            <motion.div key="hero-view" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }} className="mt-3">
              {/* Name — large serif for everyone; experts also show the verified
                  badge + Top Expert next to it. */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="font-serif text-[26px] leading-tight text-gray-dark">{name}</h2>
                <AnimatePresence>
                  {expert && (
                    <motion.span
                      key="expert-badges"
                      className="inline-flex items-center gap-x-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <img src={verifiedIcon} alt="Verified" className="h-[19px] w-[19px]" />
                      <span className="text-[16px] text-[#999999]">·</span>
                      <span className="text-[16px] text-gray-light"><span className="text-[14px]">🏆</span> Top Expert</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Headline */}
              <p className="mt-1.5 text-[16px] leading-[1.45] text-gray-light">{headline}</p>

              {/* Featured experience (+ successful clients for experts) */}
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] leading-tight text-gray-light">
                {[featuredExpItem, featuredEduItem].map((c) =>
                  c ? <FeaturedTag key={c.id} tileLabel={c.tileLabel} tileColor={c.tileColor} org={c.org} logo={c.logo} /> : null,
                )}
                <AnimatePresence>
                  {expert && (
                    <motion.div
                      key="clients"
                      className="hidden items-center gap-[6px] sm:flex"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span>Successful clients at</span>
                      <div className="flex items-center -space-x-[2px]">
                        <img src={clientLogo1} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                        <img src={clientLogo2} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                        <img src={clientLogo3} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                        <img src={clientLogo4} alt="" className="h-[18px] w-[18px] rounded border border-white" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </section>

      {/* Slot rendered directly under the hero — used by Edit mode 2 to place
          its rail cards here on mobile (where the right rail is hidden). */}
      {afterHero}

      {/* Categories — experts only, directly under the Hero */}
      {expert && (
        <Card>
          <CardHead title="Categories" action={<EditButton label="Add category" icon={addPlusIcon} />} />
          <div className="flex flex-col gap-1">
            {categoryListings.map(({ slug, category, headline: h, icon }) => (
              <Link key={category} to={`/my-leland/manage/${slug}`} className="group flex items-center gap-3 rounded-xl px-2 py-3 no-underline transition-colors hover:bg-gray-hover">
                <div className="icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#f5f5f5]">
                  <img src={icon} alt="" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-tight text-gray-dark">{category}</p>
                  <p className="mt-[2px] truncate text-[15px] leading-tight text-[#707070]">{h}</p>
                </div>
                <img src={chevronRightIcon} alt="" className="h-6 w-6 shrink-0 opacity-60" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* About */}
      <EditableTextCard title="About" value={about} onChange={setAbout} />

      {/* Intro Video — experts only; compact horizontal banner (thumbnail +
          name/link + duration + actions) rather than a full-width player.
          Hidden on Edit mode 2, which relocates it to the right rail. */}
      {expert && introVideoCard && (
        <Card>
          <CardHead title="Intro Video" />
          <div className="flex items-center gap-3.5 rounded-xl bg-gray-hover p-3">
            {/* Thumbnail with play + duration */}
            <div className="relative h-16 w-[112px] shrink-0 overflow-hidden rounded-lg bg-black">
              <img src={videoThumbnail} alt="" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#222222"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-[1px] text-[11px] font-medium leading-none text-white">1:24</span>
            </div>

            {/* Name + link */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-gray-dark">Intro video</p>
              <a
                href="https://youtu.be/dQw4w9WgXcQ"
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block truncate text-[13px] text-gray-light transition-colors hover:text-gray-dark hover:underline"
              >
                https://youtu.be/dQw4w9WgXcQ
              </a>
            </div>

            {/* Actions — reveal style: no fill at rest, gray-hover on hover */}
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" aria-label="Edit" className="flex items-center justify-center rounded-full p-3 text-gray-dark transition-colors hover:bg-gray-hover">
                <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="More" className="flex items-center justify-center rounded-full p-3 text-gray-dark transition-colors hover:bg-gray-hover">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="13" cy="8" r="1.5" /></svg>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Why I coach — experts only */}
      {expert && <EditableTextCard title="Why I coach" value={whyCoach} onChange={setWhyCoach} />}

      {/* Education */}
      <Card>
        <CardHead title="Education" action={<EditButton label="Add" icon={addPlusIcon} />} />
        <div className="flex flex-col gap-1">
          {education.map((item) => (
            <CredentialRow
              key={item.id}
              item={item}
              onRemove={() => setEducation((p) => p.filter((e) => e.id !== item.id))}
              onToggleFeatured={() => setEducation((p) => p.map((e) => (e.id === item.id ? { ...e, featured: !e.featured } : { ...e, featured: false })))}
            />
          ))}
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <CardHead title="Experience" action={<EditButton label="Add" icon={addPlusIcon} />} />
        <div className="flex flex-col gap-1">
          {experiences.map((item) => (
            <CredentialRow
              key={item.id}
              item={item}
              onRemove={() => setExperiences((p) => p.filter((e) => e.id !== item.id))}
              onToggleFeatured={() => setExperiences((p) => p.map((e) => (e.id === item.id ? { ...e, featured: !e.featured } : { ...e, featured: false })))}
            />
          ))}
        </div>
      </Card>

      {/* Reviews — experts only; mirrors the top of the Reviews tab (summary +
          rating breakdown + outcomes), with a "See all reviews" link. */}
      {expert && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold text-gray-dark">37 reviews</h2>
              <div className="mt-2 flex items-center gap-2.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#222222">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[18px] font-normal text-gray-light">4.9 avg</span>
              </div>
            </div>
            <Button size="md" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold" onClick={() => navigate("/my-leland/reviews")}>
              See all reviews
            </Button>
          </div>

          <div className="my-5 border-t border-gray-200" />

          {/* Rating breakdown — overall distribution + category scores */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
            <div className="md:col-span-1">
              <p className="mb-1 text-[14px] font-medium text-gray-light">Overall rating</p>
              <div className="flex flex-col gap-1">
                {[
                  { star: 5, count: 3 },
                  { star: 4, count: 0 },
                  { star: 3, count: 0 },
                  { star: 2, count: 0 },
                  { star: 1, count: 0 },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-1.5">
                    <span className="w-[10px] shrink-0 text-[10px] text-[#707070]">{row.star}</span>
                    <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
                      <div className="h-full rounded-full bg-gray-dark" style={{ width: `${(row.count / 3) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="-mx-4 scrollbar-hide col-span-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:contents md:px-0">
              {[
                { label: "Knowledge", score: 5.0, icon: bookBookmarkIcon },
                { label: "Value", score: 5.0, icon: piggyBankIcon },
                { label: "Responsiveness", score: 5.0, icon: stopwatchIcon },
                { label: "Supportiveness", score: 5.0, icon: supportivenessIcon },
              ].map((item) => (
                <div key={item.label} className="flex w-[60vw] shrink-0 flex-col justify-between rounded-lg border border-gray-200 p-4 md:w-auto md:shrink md:rounded-none md:border-0 md:border-l md:p-0 md:pl-4">
                  <div>
                    <p className="text-[14px] font-medium text-gray-light">{item.label}</p>
                    <p className="text-[22px] font-semibold text-gray-dark">{item.score.toFixed(1)}</p>
                  </div>
                  <div className="mt-3 text-gray-dark"><img src={item.icon} alt="" className="h-[32px] w-[32px]" /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200" />

          {/* Outcomes from your reviews */}
          <div className="mt-6">
            <p className="mb-3 text-[14px] font-medium text-gray-light">Outcomes from your reviews</p>
            <LogoStrip outcomes={visibleOutcomes} />
          </div>
        </Card>
      )}
    </div>
  );
}
