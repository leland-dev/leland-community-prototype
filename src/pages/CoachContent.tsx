import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { ConfigModal, defaultConfigFor, type OfferingItem } from "./CoachProductNew";
import { RESOURCES, type Resource } from "../lib/resources";
import AnalyticsCard, { type AnalyticsMetric } from "../components/AnalyticsCard";
import CoachContentResourceSheet from "./CoachContentResourceSheet";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
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

export default function CoachContent() {
  const [resourceTab, setResourceTab] = useState<(typeof RESOURCE_TABS)[number]["key"]>("all");
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

      {/* ── Your resources (simplified — styled like the offering builder's
          product list) ── */}
      <div className="mt-12">
        <h2 className="text-[22px] font-semibold text-gray-dark">Your resources</h2>
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
          <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 font-semibold">
            Sort by
            <MaskIcon src={chevronDownIcon} className="h-4 w-4 text-gray-light" />
          </Button>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-stroke bg-white px-6">
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
    </div>
  );
}
