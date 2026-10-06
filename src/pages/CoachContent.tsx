import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { ConfigModal, ListConfigModal, CollectionCover, collectionThumbs, collectionCountLabel, CONTENT_LIBRARY, formatViews, defaultConfigFor, type OfferingItem } from "./CoachProductNew";
import { useCollections, upsertCollection, deleteCollection, newCollectionId, type Collection } from "../lib/collections";
import { RESOURCES, type Resource } from "../lib/resources";
import AnalyticsCard, { type AnalyticsMetric } from "../components/AnalyticsCard";
import CoachContentResourceSheet from "./CoachContentResourceSheet";
import ConfirmModal from "../components/ConfirmModal";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import stackIcon from "../assets/icons/stack.svg";
import trashIcon from "../assets/icons/trash.svg";
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

// ── Collections — named buckets of uploaded content, shown alongside the raw
// resources. Created / edited here via the same builder the offering flow uses
// (ListConfigModal); the shared store keeps both surfaces in sync. Three admin-
// selectable display modes: cards (default), interwoven into the content list,
// and a minimal horizontal carousel. ──
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

// One-line metadata for a collection, e.g. "4 resources · 8.5k views".
function collectionMeta(c: Collection): string {
  return `${collectionCountLabel(c.items.length)} · ${formatViews(collectionTotalViews(c.items))} views`;
}

// Editor state + modals for creating / editing / deleting collections. Shared
// across every display mode so a collection can be opened from anywhere on the
// page (cards, carousel, or a row in the interwoven content list).
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
        upsertCollection({
          id: it.config.collectionId,
          title: it.config.title || "Untitled collection",
          description: it.config.description || "",
          items: (it.items ?? []).map((r) => ({ id: r.id, config: { ...r.config } })),
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

type CollectionViewProps = {
  collections: Collection[];
  onNew: () => void;
  onOpen: (c: Collection) => void;
  onDelete: (c: Collection) => void;
};

// Shared section title block.
function CollectionsTitle() {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-gray-dark">Collections</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">Bundle your content into buckets you can add to an offering.</p>
    </div>
  );
}

// V1 — grid of cards with cover, title, description, and item count.
function CollectionCardsView({ collections, onNew, onOpen, onDelete }: CollectionViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <CollectionsTitle />
        <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={onNew}>
          {PLUS_ICON}
          New collection
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div
            key={c.id}
            onClick={() => onOpen(c)}
            className="group relative flex cursor-pointer flex-col rounded-2xl border border-gray-stroke bg-white p-4 text-left shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(c); }}
              aria-label={`Delete ${c.title}`}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-light opacity-0 shadow-[0_1px_3px_rgba(16,24,40,0.15)] transition-all hover:text-[#E5484D] focus-visible:opacity-100 group-hover:opacity-100"
            >
              <MaskIcon src={trashIcon} className="h-[16px] w-[16px]" />
            </button>
            <CollectionCover thumbs={collectionThumbs(c.items)} className="h-16 w-24" />
            <p className="mt-3.5 text-[15px] font-semibold leading-tight text-gray-dark">{c.title}</p>
            <p className="mt-1.5 line-clamp-2 flex-1 text-[14px] leading-snug text-gray-light">{c.description}</p>
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#222222]/5 px-2.5 py-1 text-[12px] font-medium text-gray-light">
              <MaskIcon src={stackIcon} className="h-3.5 w-3.5" />
              {collectionCountLabel(c.items.length)}
            </span>
          </div>
        ))}

        {/* Create tile — dashed, always the last cell */}
        <button
          type="button"
          onClick={onNew}
          className="flex min-h-[172px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-stroke text-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222222]/5">{PLUS_ICON}</span>
          <span className="text-[14px] font-semibold">New collection</span>
        </button>
      </div>
    </div>
  );
}

// V3 — minimal horizontal carousel: a larger thumbnail stack, title, and a bit
// of metadata. Prev/next chevrons that fade out at the scroll extents.
function CollectionCarouselView({ collections, onNew, onOpen }: CollectionViewProps) {
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
  }, [collections.length]);

  const scrollByCards = (dir: 1 | -1) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  const chevron = "flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] text-gray-dark transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <CollectionsTitle />
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => scrollByCards(-1)} disabled={atStart} aria-label="Previous collections" className={chevron}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollByCards(1)} disabled={atEnd} aria-label="More collections" className={chevron}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <Button size="sm" variant="dark" rounded="rounded-full" className="ml-1 shrink-0 font-semibold" onClick={onNew}>
            {PLUS_ICON}
            New
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide mt-5 flex items-stretch gap-4 overflow-x-auto pb-2">
        {collections.map((c) => (
          <button
            key={c.id}
            onClick={() => onOpen(c)}
            className="group flex w-[240px] shrink-0 flex-col rounded-2xl border border-gray-stroke bg-white p-3 text-left shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]"
          >
            <CollectionCover thumbs={collectionThumbs(c.items)} className="h-36 w-full" />
            <p className="mt-3.5 truncate text-[15px] font-semibold text-gray-dark">{c.title}</p>
            <p className="mt-1 truncate text-[13px] text-gray-light">{collectionMeta(c)}</p>
          </button>
        ))}

        {/* Create card — dashed, at the end of the row */}
        <button
          type="button"
          onClick={onNew}
          className="flex w-[240px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-stroke text-gray-light transition-colors hover:border-gray-dark hover:text-gray-dark"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222222]/5">{PLUS_ICON}</span>
          <span className="text-[14px] font-semibold">New collection</span>
        </button>
      </div>
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

const RESOURCE_TABS = [
  { key: "all", label: "All" },
  { key: "leland", label: "Added to Leland+" },
] as const;

// Admin-selectable ways to display collections on this page.
const COLLECTION_VIEWS = [
  { key: "cards", label: "Cards" },
  { key: "interwoven", label: "In content list" },
  { key: "carousel", label: "Carousel" },
] as const;
type CollectionView = (typeof COLLECTION_VIEWS)[number]["key"];

export default function CoachContent() {
  const [resourceTab, setResourceTab] = useState<(typeof RESOURCE_TABS)[number]["key"]>("all");
  // Which collections display mode is active (toggled via the admin 3-dot menu).
  const [collectionsView, setCollectionsView] = useState<CollectionView>("cards");
  const collections = useCollections();
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

  // The resource whose details sheet is open (null = closed).
  const [openResource, setOpenResource] = useState<Resource | null>(null);
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
          <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold" onClick={openSubmit}>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Upload content
          </Button>
        </div>
      </div>

      {/* ── Analytics ── */}
      <div className="mt-8">
        <AnalyticsCard title="Your Leland+ stats" metrics={CONTENT_METRICS} collapsible />
      </div>

      {/* ── Collections (cards / carousel views; the interwoven view folds them
          into the resources list below instead) ── */}
      {collectionsView !== "interwoven" && (
        <div className="mt-12">
          {collectionsView === "carousel" ? (
            <CollectionCarouselView collections={collections} onNew={editor.openNew} onOpen={editor.openEdit} onDelete={editor.requestDelete} />
          ) : (
            <CollectionCardsView collections={collections} onNew={editor.openNew} onOpen={editor.openEdit} onDelete={editor.requestDelete} />
          )}
        </div>
      )}

      {/* ── Your resources (simplified — styled like the offering builder's
          product list) ── */}
      <div className="mt-12">
        <h2 className="text-[22px] font-semibold text-gray-dark">{collectionsView === "interwoven" ? "Your content" : "Your resources"}</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-gray-hover p-1">
            {RESOURCE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setResourceTab(t.key)}
                className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors ${resourceTab === t.key ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {collectionsView === "interwoven" && (
              <Button size="sm" variant="dark" rounded="rounded-full" className="shrink-0 font-semibold" onClick={editor.openNew}>
                {PLUS_ICON}
                New collection
              </Button>
            )}
            <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold">
              Sort by
              <MaskIcon src={chevronDownIcon} className="h-4 w-4 text-gray-light" />
            </Button>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-stroke bg-white px-6">
          {/* Interwoven view: collection rows lead the list, then standalone
              content. Each collection opens the builder; the stacked cover and
              "Collection" tag set them apart from single resources. */}
          {collectionsView === "interwoven" && collections.map((c) => (
            <div key={c.id} className="flex items-center gap-3 border-b border-gray-stroke">
              <button onClick={() => editor.openEdit(c)} className="flex min-w-0 flex-1 items-center gap-3 py-4 text-left">
                <CollectionCover thumbs={collectionThumbs(c.items)} className="h-10 w-[60px]" />
                <span className="min-w-0 flex-1">
                  <span className="inline-block max-w-full truncate align-top text-[15px] font-semibold text-gray-dark hover:underline">{c.title}</span>
                  <span className="mt-0.5 block truncate text-[15px] text-gray-light">{collectionMeta(c)}</span>
                </span>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#222222]/5 px-2 py-0.5 text-[12px] font-medium text-gray-light">
                  <MaskIcon src={stackIcon} className="h-3.5 w-3.5" />
                  Collection
                </span>
              </div>
              <button onClick={() => editor.openEdit(c)} aria-label={`Edit ${c.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          ))}
          {(resourceTab === "leland" ? RESOURCES.filter((r) => r.lelandPlus) : RESOURCES).map((r, i, list) => {
            const views = r.views < 1000 ? String(r.views) : `${(r.views / 1000).toFixed(1).replace(/\.0$/, "")}k`;
            const offeringsText = `${r.offerings.length} offering${r.offerings.length === 1 ? "" : "s"}`;
            return (
              <div key={r.id} className={`flex items-center gap-3 ${i < list.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                <button onClick={() => setOpenResource(r)} className="flex min-w-0 flex-1 items-center gap-3 py-4 text-left">
                  <img src={r.cover} alt="" className="h-10 w-[60px] shrink-0 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="inline-block max-w-full truncate align-top text-[15px] font-semibold text-gray-dark hover:underline">{r.title}</span>
                    <span className="mt-0.5 block truncate text-[15px] text-gray-light">{r.fileType} · {views} views</span>
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  {r.offerings.length > 0 && <span className="rounded-full bg-[#222222]/5 px-2 py-0.5 text-[12px] font-medium text-gray-light">{offeringsText}</span>}
                  {r.lelandPlus && <span className="rounded-full bg-[#F1ECFB] px-2 py-0.5 text-[12px] font-medium text-[#6B4BB8]">Leland+</span>}
                </div>
                <button onClick={() => setOpenResource(r)} aria-label={`View details for ${r.title}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            );
          })}
          {/* Footer — upload content, part of the card like the offering
              builder's "Add product" button */}
          <button onClick={openSubmit} className="-mx-6 flex w-[calc(100%+3rem)] items-center justify-center gap-2 border-t border-gray-stroke px-6 py-4 text-[15px] font-semibold text-gray-dark transition-colors hover:bg-gray-hover">
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

      {/* Collection builder + delete confirm — rendered once, shared by every
          display mode so a collection opens from cards, carousel, or the list */}
      {editor.modals}

      {/* Admin tool — 3-dot menu (bottom-right) to switch how collections show */}
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
              <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-light">Collections display</p>
              {COLLECTION_VIEWS.map((v) => {
                const active = collectionsView === v.key;
                return (
                  <button
                    key={v.key}
                    onClick={() => setCollectionsView(v.key)}
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
