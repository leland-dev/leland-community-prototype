import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { useCourses, type BuilderCourse } from "../lib/courses";
import { ConfigModal, ListConfigModal, CollectionCover, collectionThumbs, CONTENT_LIBRARY, formatViews, defaultConfigFor, type OfferingItem } from "./CoachProductNew";
import { useCollections, getCollection, upsertCollection, deleteCollection, newCollectionId, type Collection } from "../lib/collections";
import { RESOURCES, type Resource } from "../lib/resources";
import AnalyticsCard, { type AnalyticsMetric } from "../components/AnalyticsCard";
import CoachContentResourceSheet from "./CoachContentResourceSheet";
import CoachContentCollectionSheet from "./CoachContentCollectionSheet";
import CoachContentCourseSheet from "./CoachContentCourseSheet";
import ConfirmModal from "../components/ConfirmModal";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import stackIcon from "../assets/icons/stack.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import documentIcon from "../assets/icons/document.svg";
import playVideoIcon from "../assets/icons/play-video.svg";
import lightBulbIcon from "../assets/icons/light-bulb.svg";
import toolsIcon from "../assets/icons/tools-wrench-ruler.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";

// Icons ship with hardcoded fills, so tint them via CSS mask + bg-current to
// follow the surrounding text color. MaskIcon renders an inline span — its
// parent must be a flex container for h/w classes to size it.
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

// ── Collections — named buckets of uploaded content, shown as rows in the
// unified "Your content" list alongside courses and single resources. Created /
// edited here via the same builder the offering flow uses (ListConfigModal);
// the shared store keeps both surfaces in sync. ──
function collectionToItem(c: Collection): OfferingItem {
  return {
    id: Date.now(),
    slug: "collection",
    config: { title: c.title, description: c.description, collectionId: c.id },
    configured: true,
    items: c.items.map((it) => ({ id: it.id, config: { ...it.config } })),
  };
}

// Total views across a collection's items, summed from the shared library.
function collectionTotalViews(items: Collection["items"]): number {
  return items.reduce((sum, it) => sum + (CONTENT_LIBRARY.find((l) => l.id === it.config.libraryId)?.views ?? 0), 0);
}


// Editor state + modals for creating / editing / deleting collections, opened
// from a collection row in the "Your content" list.
function useCollectionEditor() {
  // The collection currently open in the builder (null = closed). Carries a
  // `collectionId` in config so save knows which bucket to write back.
  const [editItem, setEditItem] = useState<OfferingItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Collection | null>(null);

  const openNew = () =>
    setEditItem({ id: Date.now(), slug: "collection", config: { title: "", description: "", collectionId: newCollectionId() }, configured: false, items: [] });
  const openEdit = (c: Collection) => setEditItem(collectionToItem(c));
  const requestDelete = (c: Collection) => setConfirmDelete(c);

  const patchGeneral = (patch: Record<string, string>) =>
    setEditItem((it) => (it ? { ...it, config: { ...it.config, ...patch } } : it));
  const setItems = (items: OfferingItem["items"]) =>
    setEditItem((it) => (it ? { ...it, items } : it));
  const save = () => {
    setEditItem((it) => {
      if (it) {
        // Preserve monetization status (Leland+ / offerings) across edits — the
        // builder modal doesn't manage those fields, so carry them forward.
        const existing = getCollection(it.config.collectionId);
        upsertCollection({
          id: it.config.collectionId,
          title: it.config.title || "Untitled collection",
          description: it.config.description || "",
          items: (it.items ?? []).map((r) => ({ id: r.id, config: { ...r.config } })),
          lelandPlus: existing?.lelandPlus,
          offerings: existing?.offerings,
        });
      }
      return null;
    });
  };

  const modals = (
    <>
      <ListConfigModal
        item={editItem}
        onGeneralChange={patchGeneral}
        onItemsChange={setItems}
        onSave={save}
        onClose={() => setEditItem(null)}
        saveLabel="Save collection"
      />
      <ConfirmModal
        open={!!confirmDelete}
        title={`Delete “${confirmDelete?.title ?? ""}”?`}
        body="This removes the collection. The content inside it stays in your library — only the bucket goes away."
        confirmLabel="Delete collection"
        onConfirm={() => { if (confirmDelete) deleteCollection(confirmDelete.id); setConfirmDelete(null); }}
        onClose={() => setConfirmDelete(null)}
      />
    </>
  );

  return { openNew, openEdit, requestDelete, modals };
}

const PLUS_ICON = <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>;

// Small cover thumbnail for a course row in the unified content list — mirrors
// the collection cover / resource thumbnail dimensions (h-10 × 60px).
function CourseRowCover({ course }: { course: BuilderCourse }) {
  if (course.coverImage) {
    return <img src={course.coverImage} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />;
  }
  return (
    <div className="flex h-10 w-[60px] shrink-0 items-center justify-center rounded-lg bg-gray-hover">
      <MaskIcon src={myCoursesIcon} className="h-4 w-4 text-gray-extra-light" />
    </div>
  );
}

// Content-page analytics — same figures as before, now shown in the shared
// Analytics card (label + value + sparkline).
const CONTENT_METRICS: AnalyticsMetric[] = [
  { key: "earnings", label: "Total earnings", value: "$1,984.55", data: [100, 150, 120, 200, 250, 220, 300, 350, 320, 400, 450, 420, 500, 550, 600, 650] },
  { key: "views", label: "Views", value: "8.5k", data: [40, 45, 50, 48, 55, 60, 58, 66, 70, 68, 75, 80, 78, 85, 90, 95] },
  { key: "likes", label: "Likes", value: "251", data: [3, 2, 5, 4, 7, 6, 9, 8, 12, 10, 15, 13, 18, 16, 22, 20] },
];

// ── "Types of content" cards — icon-box style, matching the category page's
// "Start from a template" carousel ──
type ContentType = { title: string; desc: string; icon: string };

const CONTENT_TYPES: ContentType[] = [
  { title: "Guides", desc: "Educational content like videos, slide decks, or PDFs.", icon: playVideoIcon },
  { title: "PDFs", desc: "Real-world examples like resumes, essays, or recordings.", icon: documentIcon },
  { title: "Templates", desc: "Ready-to-use starting points, like email or model templates.", icon: bookOpenIcon },
  { title: "Practice Exercises", desc: "Hands-on ways to apply learning, like question sets.", icon: lightBulbIcon },
  { title: "Tools", desc: "Utilities that support goal progress, like trackers.", icon: toolsIcon },
  { title: "Courses", desc: "Structured, multi-step paths that help users learn.", icon: myCoursesIcon },
];

// Horizontal, scrollable row of content-type cards — modeled on the category
// page's "Start from a template" carousel (icon box + title + blurb, with
// prev/next chevrons that fade out at the scroll extents).
function ContentTypesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  const scrollByCards = (dir: 1 | -1) => scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  const chevron = "flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] text-gray-dark transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-semibold text-gray-dark">Types of content you can submit</h2>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scrollByCards(-1)} disabled={atStart} aria-label="Previous content types" className={chevron}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollByCards(1)} disabled={atEnd} aria-label="More content types" className={chevron}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide mt-6 flex gap-4 overflow-x-auto pb-2">
        {CONTENT_TYPES.map((c) => (
          <button
            key={c.title}
            className="group flex w-[240px] shrink-0 flex-col rounded-2xl border border-gray-stroke bg-white p-4 text-left shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#222222]/5">
              <img src={c.icon} alt="" className="h-5 w-5" />
            </div>
            <p className="mt-3 text-[15px] font-semibold leading-tight text-gray-dark">{c.title}</p>
            <p className="mt-1 text-[14px] leading-snug text-gray-light">{c.desc}</p>
            <span className="mt-3 inline-block text-[14px] font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">See examples</span>
          </button>
        ))}
      </div>

      <a href="#" className="mt-4 inline-flex items-center gap-1 text-[14px] text-gray-extra-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">
        See our content creation guidelines
        <span className="flex">{EXTERNAL_ARROW}</span>
      </a>
    </div>
  );
}

// ── FAQ data — split across two columns in the accordion below ──
const FAQS: { q: string; a: React.ReactNode }[] = [
  { q: "What is Leland+?", a: "Leland+ is a collection of expert resources and tools from vetted Leland coaches like you. Coaches contribute examples, templates, guides, courses, and more — and earn money as users engage with that content." },
  { q: "How do Leland+ payouts work?", a: "Each month, 50% of Leland+ revenue is paid out to contributors based on engagement. The more time users spend viewing your resources, the more you earn. Payouts are issued on the first day of each month." },
  { q: "Will I retain ownership of my content?", a: <>Yes. Coaches are owners of the content they create, package, and sell on Leland. This means that Leland expects coaches to have the rights to distribute any content they submit. Read the full terms <a href="#" className="text-gray-dark underline">here</a>.</> },
  { q: "When will my resource go live?", a: "Most resources are reviewed within a few business days. Once approved, they appear on your listing and become eligible for Leland+ right away." },
  { q: "Can I submit resources for any category?", a: "Yes! Leland+ is available in dozens of categories today and we’re always introducing more. Being an early contributor to an emerging category is a great way to get your resources seen." },
  { q: "Can I edit or remove a resource after submitting?", a: "Absolutely. You can update the details, swap the file, or unlist a resource at any time from your content dashboard." },
  { q: "Do coaches get access to Leland+?", a: "When you contribute your first resource, you’ll also unlock Leland+ access yourself to learn from other top experts on the platform." },
  { q: "Is there a limit to how much I can submit?", a: "No — submit as much high-quality content as you like. More resources mean more ways for users to discover and engage with your expertise." },
];

// Single expandable FAQ row. Uses a grid-rows 0fr→1fr transition so the answer
// animates open/closed without measuring heights.
function FaqItem({ q, a }: { q: string; a: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-stroke">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[16px] font-semibold text-gray-dark">{q}</span>
        <svg className={`h-5 w-5 shrink-0 text-gray-light transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="pb-5 text-[15px] leading-relaxed text-gray-light">{a}</p>
        </div>
      </div>
    </div>
  );
}

const EXTERNAL_ARROW = (
  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H8M17 7v9" />
  </svg>
);

// Type filter for the unified "Your content" list.
const CONTENT_FILTERS = [
  { key: "all", label: "All types" },
  { key: "resources", label: "Resources" },
  { key: "collections", label: "Collections" },
  { key: "courses", label: "Courses" },
] as const;
type ContentFilter = (typeof CONTENT_FILTERS)[number]["key"];

// Status filter — a single monetization/state dimension.
const STATUS_FILTERS = [
  { key: "any", label: "Any status" },
  { key: "leland", label: "Added to Leland+" },
  { key: "offering", label: "Added to an offering" },
  { key: "draft", label: "Draft" },
  { key: "none", label: "No status" },
] as const;

// Category filter — "All" plus the distinct resource categories.
const CATEGORY_FILTERS = [
  { key: "all", label: "All categories" },
  ...Array.from(new Set(RESOURCES.map((r) => r.category).filter(Boolean))).map((c) => ({ key: c, label: c })),
] as const;

// A single row in the unified content list — a collection, a course, or a
// standalone resource. The `kind` discriminates cover, meta, tag, and click.
type ContentRow =
  | { kind: "collection"; key: string; data: Collection }
  | { kind: "course"; key: string; data: BuilderCourse }
  | { kind: "resource"; key: string; data: Resource };

// Admin-selectable versions of the "Your content" table rows (switched via the
// 3-dot admin menu). v1 is the current layout; v2 and v3 are variants to iterate
// on and currently render the same as v1.
const ROW_VERSIONS = [
  { key: "v1", label: "v1" },
  { key: "v2", label: "v2" },
  { key: "v3", label: "v3" },
  { key: "v4", label: "v4" },
] as const;
type RowVersion = (typeof ROW_VERSIONS)[number]["key"];

// Display props for a single content row, derived from a ContentRow by kind.
type RowDisplay = {
  cover: React.ReactNode;
  title: string;
  meta: string;
  lelandPlus: boolean;
  views: string | null;
  offerings: number;
  onClick: () => void;
  ariaLabel: string;
};

// Left subtitle: type, then Leland+ status and views when on Leland+ (views
// track Leland+ engagement), joined inline — e.g. "Course · Added to Leland+ · 2.2k views".
function rowSubtitle(d: RowDisplay): string {
  return [d.meta, d.lelandPlus ? "Added to Leland+" : null, d.lelandPlus ? d.views : null].filter(Boolean).join(" · ");
}

// Right-hand offering status, shared across row versions: the "Added to N
// offerings / View offerings" stack, or the "Not sold on your profile / Add to
// an offering" stack.
function OfferingStatus({ offerings, onClick }: { offerings: number; onClick: () => void }) {
  if (offerings > 0) {
    return (
      <>
        <span className="text-[14px] font-semibold leading-tight text-gray-dark">Added to {offerings} offering{offerings === 1 ? "" : "s"}</span>
        <button type="button" onClick={onClick} className="text-[14px] font-medium leading-tight text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-dark">
          View offerings
        </button>
      </>
    );
  }
  return (
    <>
      <span className="text-[14px] font-semibold leading-tight text-gray-extra-light">Not sold on your profile</span>
      <button type="button" onClick={onClick} className="text-[14px] font-medium leading-tight text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-dark">
        Add to an offering
      </button>
    </>
  );
}

const ROW_CHEVRON = (
  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);

// ── v3 — cover + title/metadata on the left, a right-aligned offering-status
// stack, and a chevron. ──
function ContentRowV3({ d, isLast }: { d: RowDisplay; isLast: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${isLast ? "" : "border-b border-gray-stroke"}`}>
      <button onClick={d.onClick} className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left">
        {d.cover}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-semibold leading-tight text-gray-dark hover:underline">{d.title}</span>
          <span className="truncate text-[14px] leading-tight text-gray-light">{rowSubtitle(d)}</span>
        </span>
      </button>
      <div className="flex shrink-0 flex-col items-end text-right">
        <OfferingStatus offerings={d.offerings} onClick={d.onClick} />
      </div>
      <button onClick={d.onClick} aria-label={d.ariaLabel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
        {ROW_CHEVRON}
      </button>
    </div>
  );
}

// ── v2 — status chips: the subtitle is just the type, and the two statuses read
// as compact pills on the right. Leland+ membership carries its view count; the
// offering state is a neutral count pill, or an outline CTA when not yet sold. ──
function ContentRowV2({ d, isLast }: { d: RowDisplay; isLast: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${isLast ? "" : "border-b border-gray-stroke"}`}>
      <button onClick={d.onClick} className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left">
        {d.cover}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-semibold leading-tight text-gray-dark hover:underline">{d.title}</span>
          <span className="truncate text-[14px] leading-tight text-gray-light">{d.meta}</span>
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-2">
        {d.lelandPlus && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F1ECFB] px-2.5 py-1 text-[13px] font-medium text-[#6B4BB8]">
            Leland+{d.views ? ` · ${d.views}` : ""}
          </span>
        )}
        {d.offerings > 0 ? (
          <span className="inline-flex items-center rounded-full bg-[#222222]/5 px-2.5 py-1 text-[13px] font-medium text-gray-light">
            {d.offerings} offering{d.offerings === 1 ? "" : "s"}
          </span>
        ) : (
          <Button size="sm" variant="outline" onClick={d.onClick}>
            Add to an offering
          </Button>
        )}
      </div>
      <button onClick={d.onClick} aria-label={d.ariaLabel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
        {ROW_CHEVRON}
      </button>
    </div>
  );
}

// Shared table-header-column row for v3/v4. The only difference: v4 renders the
// not-sold CTA as a white button; v3 keeps it as a dotted text link matching the
// offerings-count link. Labels live in ContentTableHeader; fully monochromatic.
const OFFERING_LINK_CLASS = "text-[14px] font-medium leading-tight text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-light";
function TableRow({ d, isLast, ctaAsButton, offeringsAlign }: { d: RowDisplay; isLast: boolean; ctaAsButton: boolean; offeringsAlign: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-6 ${isLast ? "" : "border-b border-gray-stroke"}`}>
      <button onClick={d.onClick} className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left">
        {d.cover}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-semibold leading-tight text-gray-dark hover:underline">{d.title}</span>
          <span className="truncate text-[14px] leading-tight text-gray-light">{d.meta}</span>
        </span>
      </button>
      {/* Leland+ value (label lives in the header) */}
      <div className="hidden w-28 shrink-0 sm:block">
        <span className={`text-[14px] leading-tight ${d.lelandPlus ? "text-gray-dark" : "text-gray-extra-light"}`}>
          {d.lelandPlus ? (d.views ?? "Enrolled") : "—"}
        </span>
      </div>
      {/* Offerings value / CTA (label lives in the header) — fixed width (keeps
          the Leland+ column from shifting); aligned per version */}
      <div className={`flex w-48 shrink-0 ${offeringsAlign === "left" ? "justify-start" : "justify-end"}`}>
        {d.offerings > 0 ? (
          <button type="button" onClick={d.onClick} className={OFFERING_LINK_CLASS}>
            {d.offerings} offering{d.offerings === 1 ? "" : "s"}
          </button>
        ) : ctaAsButton ? (
          <Button size="md" variant="outline" onClick={d.onClick}>Add to offering</Button>
        ) : (
          <button type="button" onClick={d.onClick} className={OFFERING_LINK_CLASS}>Add to offering</button>
        )}
      </div>
      <button onClick={d.onClick} aria-label={d.ariaLabel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
        {ROW_CHEVRON}
      </button>
    </div>
  );
}

// ── v1 (default) — table-header columns, left-aligned. Muted treatment:
// Leland+ and Offerings values are gray-light medium text; a not-sold item reads
// as a plain "Not sold on your profile" status in gray-extra-light. ──
function ContentRowV1({ d, isLast }: { d: RowDisplay; isLast: boolean }) {
  return (
    <div className={`flex items-center gap-6 ${isLast ? "" : "border-b border-gray-stroke"}`}>
      <button onClick={d.onClick} className="flex min-w-0 flex-1 items-center gap-4 py-4 text-left">
        {d.cover}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-semibold leading-tight text-gray-dark hover:underline">{d.title}</span>
          <span className="truncate text-[14px] leading-tight text-gray-light">{d.meta}</span>
        </span>
      </button>
      {/* Leland+ value (label lives in the header) */}
      <div className="hidden w-28 shrink-0 sm:block">
        <span className="text-[14px] font-medium leading-tight text-gray-light">
          {d.lelandPlus ? (d.views ?? "Enrolled") : "—"}
        </span>
      </div>
      {/* Offerings value / status (label lives in the header) */}
      <div className="flex w-48 shrink-0 justify-start">
        {d.offerings > 0 ? (
          <button type="button" onClick={d.onClick} className="text-[14px] font-medium leading-tight text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-gray-dark">
            {d.offerings} offering{d.offerings === 1 ? "" : "s"}
          </button>
        ) : (
          <span className="whitespace-nowrap text-[14px] font-medium leading-tight text-gray-extra-light">Not sold on your profile</span>
        )}
      </div>
      <button onClick={d.onClick} aria-label={d.ariaLabel} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
        {ROW_CHEVRON}
      </button>
    </div>
  );
}

// ── v4 — table-header columns, right-aligned offerings, not-sold CTA as a white
// button. ──
function ContentRowV4({ d, isLast }: { d: RowDisplay; isLast: boolean }) {
  return <TableRow d={d} isLast={isLast} ctaAsButton={true} offeringsAlign="right" />;
}

// Table header for v3/v4 — gray-hover band with small gray-light labels. Columns
// mirror the row layout (flex-1 title, w-28 Leland+, auto Offerings, w-8 chevron
// spacer) so the labels sit above their values. Bleeds to the card edges with
// -mx-6, then re-pads so the content aligns with the rows.
function ContentTableHeader({ offeringsAlign }: { offeringsAlign: "left" | "right" }) {
  return (
    <div className="-mx-6 flex items-center gap-6 bg-gray-hover px-6 py-1.5">
      <span className="min-w-0 flex-1 text-[14px] font-medium text-gray-light">Content</span>
      <span className="hidden w-28 shrink-0 text-[14px] font-medium text-gray-light sm:block">Leland+</span>
      <span className={`w-48 shrink-0 text-[14px] font-medium text-gray-light ${offeringsAlign === "left" ? "text-left" : "text-right"}`}>Offerings</span>
      <span className="h-8 w-8 shrink-0" aria-hidden />
    </div>
  );
}

// Picks the row component for the active admin version.
function VersionedRow({ version, d, isLast }: { version: RowVersion; d: RowDisplay; isLast: boolean }) {
  if (version === "v2") return <ContentRowV2 d={d} isLast={isLast} />;
  if (version === "v3") return <ContentRowV3 d={d} isLast={isLast} />;
  if (version === "v4") return <ContentRowV4 d={d} isLast={isLast} />;
  return <ContentRowV1 d={d} isLast={isLast} />;
}

// Header "New" action — a pill button that opens a dropdown for creating any of
// the three content kinds that live on this page. Closes on outside click.
function NewMenu({ onNewResource, onNewCollection, onNewCourse }: { onNewResource: () => void; onNewCollection: () => void; onNewCourse: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const items = [
    { icon: documentIcon, label: "Resource", desc: "Upload a video, PDF, or doc", onClick: onNewResource },
    { icon: stackIcon, label: "Collection", desc: "Bundle content into a set", onClick: onNewCollection },
    { icon: myCoursesIcon, label: "Course", desc: "Build a multi-module course", onClick: onNewCourse },
  ];

  return (
    <div ref={ref} className="relative">
      <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold" onClick={() => setOpen((o) => !o)}>
        {PLUS_ICON}
        New
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setOpen(false); }}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-hover"
              >
                <MaskIcon src={item.icon} className="h-6 w-6 shrink-0 text-gray-dark" />
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-gray-dark">{item.label}</span>
                  <span className="block text-[13px] text-gray-light">{item.desc}</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// A medium, round dropdown button for a single-select filter. Shows the current
// selection as its label; closes on outside click. Mirrors the "Sort by" pill.
function FilterDropdown({ options, value, onChange, menuWidth = "w-56" }: { options: readonly { key: string; label: string }[]; value: string; onChange: (v: string) => void; menuWidth?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  const current = options.find((o) => o.key === value) ?? options[0];
  return (
    <div ref={ref} className="relative">
      <Button size="sm" variant="outline" rounded="rounded-full" className="font-semibold" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {current.label}
        <MaskIcon src={chevronDownIcon} className={`h-4 w-4 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className={`absolute left-0 z-50 mt-2 ${menuWidth} rounded-2xl border border-gray-stroke bg-white p-2 shadow-lg`}
          >
            {options.map((o) => {
              const active = o.key === value;
              return (
                <button key={o.key} onClick={() => { onChange(o.key); setOpen(false); }} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-hover">
                  <span className={`text-[14px] font-medium ${active ? "text-gray-dark" : "text-gray-light"}`}>{o.label}</span>
                  {active && <svg className="h-4 w-4 shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flattened attributes used by the Status / Category filters, across kinds.
function rowAttrs(row: ContentRow): { lelandPlus: boolean; offerings: number; draft: boolean; category: string | null } {
  switch (row.kind) {
    case "resource":
      return { lelandPlus: row.data.lelandPlus, offerings: row.data.offerings.length, draft: false, category: row.data.category };
    case "collection":
      return { lelandPlus: row.data.lelandPlus ?? false, offerings: (row.data.offerings ?? []).length, draft: false, category: null };
    case "course":
      return { lelandPlus: row.data.lelandPlus ?? false, offerings: (row.data.offerings ?? []).length, draft: row.data.status === "draft", category: null };
  }
}

// Does a row pass the active Status filter?
function matchesStatus(row: ContentRow, status: string): boolean {
  if (status === "any") return true;
  const a = rowAttrs(row);
  switch (status) {
    case "leland": return a.lelandPlus;
    case "offering": return a.offerings > 0;
    case "draft": return a.draft;
    case "none": return !a.lelandPlus && a.offerings === 0;
    default: return true;
  }
}

export default function CoachContent() {
  const navigate = useNavigate();
  // Type / Status / Category filters for the unified content list.
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("any");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  // Which "Your content" row layout is active (toggled via the admin 3-dot menu).
  const [rowVersion, setRowVersion] = useState<RowVersion>("v1");
  const collections = useCollections();
  const courses = useCourses();
  const editor = useCollectionEditor();

  // Admin 3-dot menu (bottom-right) — closes on outside click.
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [adminOpen]);

  // The item whose details sheet is open (null = closed). Each content type has
  // its own sheet; the footer CTA in each hands off to that type's editor.
  const [openResource, setOpenResource] = useState<Resource | null>(null);
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [openCourse, setOpenCourse] = useState<BuilderCourse | null>(null);
  // "Submit a resource" opens the content upload/configure modal (the same one
  // used in the offering builder), started in its upload-new flow.
  const [uploadItem, setUploadItem] = useState<OfferingItem | null>(null);
  const openSubmit = () =>
    setUploadItem({ id: 1, slug: "content", configured: false, config: { ...defaultConfigFor("content"), source: "upload" } });
  const patchUpload = (patch: Record<string, string>) =>
    setUploadItem((it) => (it ? { ...it, config: { ...it.config, ...patch } } : it));

  useEffect(() => {
    document.title = "Leland Prototype | Content";
  }, []);

  // Build the unified list from the three sources (collections lead, then
  // courses, then single resources), filtered by Type, then narrowed by the
  // Status and Category filters. Category only applies to resources (the only
  // kind with a category), so a specific category hides collections/courses.
  const showType = (t: ContentFilter) => contentFilter === "all" || contentFilter === t;
  let rows: ContentRow[] = [];
  if (showType("collections"))
    rows.push(...collections.map((c): ContentRow => ({ kind: "collection", key: `col-${c.id}`, data: c })));
  if (showType("courses"))
    rows.push(...courses.map((c): ContentRow => ({ kind: "course", key: `course-${c.id}`, data: c })));
  if (showType("resources"))
    rows.push(...RESOURCES.map((r): ContentRow => ({ kind: "resource", key: `res-${r.id}`, data: r })));
  rows = rows.filter((row) => matchesStatus(row, statusFilter) && (categoryFilter === "all" || rowAttrs(row).category === categoryFilter));

  // Per-row display props, branched on the row kind. The active row version
  // (v1/v2/v3) decides how these are laid out.
  const rowDisplay = (row: ContentRow): RowDisplay => {
    switch (row.kind) {
      case "collection": {
        const c = row.data;
        return {
          cover: <CollectionCover thumbs={collectionThumbs(c.items)} className="h-10 w-[60px]" />,
          title: c.title,
          meta: "Collection",
          lelandPlus: c.lelandPlus ?? false,
          views: `${formatViews(collectionTotalViews(c.items))} views`,
          offerings: (c.offerings ?? []).length,
          onClick: () => setOpenCollection(c),
          ariaLabel: `View details for ${c.title}`,
        };
      }
      case "course": {
        const c = row.data;
        return {
          cover: <CourseRowCover course={c} />,
          title: c.title || "Untitled course",
          meta: "Course",
          lelandPlus: c.lelandPlus ?? false,
          views: c.views != null ? `${formatViews(c.views)} views` : null,
          offerings: (c.offerings ?? []).length,
          onClick: () => setOpenCourse(c),
          ariaLabel: `View details for ${c.title || "course"}`,
        };
      }
      case "resource": {
        const r = row.data;
        return {
          cover: <img src={r.cover} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />,
          title: r.title,
          meta: r.fileType,
          lelandPlus: r.lelandPlus,
          views: `${formatViews(r.views)} views`,
          offerings: r.offerings.length,
          onClick: () => setOpenResource(r),
          ariaLabel: `View details for ${r.title}`,
        };
      }
    }
  };

  return (
    <div className="pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-[42px] leading-[1.05] text-gray-dark md:text-[48px]">My content</h1>
          <p className="mt-2 text-[18px] font-normal text-gray-light">
            Upload content and earn passive income.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <NewMenu
            onNewResource={openSubmit}
            onNewCollection={editor.openNew}
            onNewCourse={() => navigate("/coach/content/course/new")}
          />
        </div>
      </div>

      {/* ── Analytics ── */}
      <div className="mt-8">
        <AnalyticsCard title="Your Leland+ stats" metrics={CONTENT_METRICS} collapsible />
      </div>

      {/* ── Your content — unified list of collections, courses, and single
          resources, styled like the offering builder's product list ── */}
      <div className="mt-12">
        <h2 className="text-[22px] font-semibold text-gray-dark">Your content</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown options={CONTENT_FILTERS} value={contentFilter} onChange={(v) => setContentFilter(v as ContentFilter)} />
            <FilterDropdown options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} menuWidth="w-60" />
            <FilterDropdown options={CATEGORY_FILTERS} value={categoryFilter} onChange={setCategoryFilter} />
          </div>
          <Button size="sm" variant="outline" rounded="rounded-full" className="shrink-0 font-semibold">
            Sort by
            <MaskIcon src={chevronDownIcon} className="h-4 w-4 text-gray-light" />
          </Button>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-stroke bg-white px-6">
          {/* Unified list — collections, then courses, then single resources.
              Each row's cover, meta, tag, and click target are branched on kind
              (see rowDisplay). Collections open the builder, courses open the
              course editor, resources open the details sheet. */}
          {rows.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-gray-light">No content here yet.</p>
          ) : (
            <>
              {(rowVersion === "v1" || rowVersion === "v4") && <ContentTableHeader offeringsAlign={rowVersion === "v1" ? "left" : "right"} />}
              {rows.map((row, i) => (
                <VersionedRow key={row.key} version={rowVersion} d={rowDisplay(row)} isLast={i === rows.length - 1} />
              ))}
            </>
          )}
          {/* Footer — upload content, part of the card like the offering
              builder's "Add product" button */}
          <button onClick={openSubmit} className="-mx-6 flex w-[calc(100%+3rem)] items-center justify-center gap-2 border-t border-gray-stroke px-6 py-4 text-[14px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Upload content
          </button>
        </div>
      </div>

      {/* ── Types of content ── */}
      <div className="mt-16">
        <ContentTypesCarousel />
      </div>

      {/* ── FAQ ── */}
      <div className="mt-16">
        <h2 className="text-[22px] font-semibold text-gray-dark">Frequently asked questions</h2>
        <div className="mt-6 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          {[FAQS.slice(0, Math.ceil(FAQS.length / 2)), FAQS.slice(Math.ceil(FAQS.length / 2))].map((col, i) => (
            <div key={i} className="border-t border-gray-stroke">
              {col.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <ConfigModal
        item={uploadItem}
        uploadOnly
        saveLabel="Submit resource"
        onChange={patchUpload}
        onSave={() => setUploadItem(null)}
        onClose={() => setUploadItem(null)}
      />

      <CoachContentResourceSheet resource={openResource} onClose={() => setOpenResource(null)} />

      <CoachContentCollectionSheet
        collection={openCollection}
        onClose={() => setOpenCollection(null)}
        onEdit={() => { if (openCollection) editor.openEdit(openCollection); setOpenCollection(null); }}
      />

      <CoachContentCourseSheet
        course={openCourse}
        onClose={() => setOpenCourse(null)}
        onEdit={() => { if (openCourse) navigate(`/coach/content/course/${openCourse.id}`); setOpenCourse(null); }}
      />

      {/* Collection builder + delete confirm — rendered once, opened from a
          collection row in the list */}
      {editor.modals}

      {/* Admin tool — 3-dot menu (bottom-right) to switch the content-row layout */}
      <div ref={adminRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-light">Resources table rows</p>
              {ROW_VERSIONS.map((v) => {
                const active = rowVersion === v.key;
                return (
                  <button
                    key={v.key}
                    onClick={() => setRowVersion(v.key)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#f5f5f5]"
                  >
                    <span className={`text-[14px] font-medium ${active ? "text-gray-dark" : "text-gray-light"}`}>{v.label}</span>
                    {active && (
                      <svg className="h-4 w-4 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-opacity ${adminOpen ? "opacity-100" : "opacity-20 hover:opacity-100"}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#222222" />
            <circle cx="8" cy="8" r="1.5" fill="#222222" />
            <circle cx="13" cy="8" r="1.5" fill="#222222" />
          </svg>
        </button>
      </div>
    </div>
  );
}
