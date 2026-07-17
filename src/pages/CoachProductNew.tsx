import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import crownIcon from "../assets/icons/crown-membership.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import aiIcon from "../assets/icons/ai.svg";
import moneyIcon from "../assets/icons/money.svg";
import browseIcon from "../assets/icons/nav-icons/browse-inactive.svg";
import storeIcon from "../assets/icons/store.svg";
import freeIcon from "../assets/icons/free.svg";
import coverImage9 from "../assets/img/cover-images/cover-image-9.png";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import labelTagIcon from "../assets/icons/label-tag.svg";
import uploadIcon from "../assets/icons/upload.svg";
import attachIcon from "../assets/icons/attach.svg";
import trashIcon from "../assets/icons/trash.svg";
import editIcon from "../assets/icons/edit.svg";

type StepKey = "product" | "offerings" | "page";

const STEPS: { key: StepKey; label: string; icon: string }[] = [
  { key: "product", label: "Product", icon: moneyIcon },
  { key: "offerings", label: "Offerings", icon: browseIcon },
  { key: "page", label: "Page", icon: storeIcon },
];

// Mask-tinted icon so it follows the surrounding text color (bg-current).
function MaskIcon({ src, className = "h-[18px] w-[18px]" }: { src: string; className?: string }) {
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

// Offering types the coach can bundle into a product. Reuses the existing
// product-type icons.
const offeringTypes = [
  { slug: "coaching-time", label: "Coaching time", blurb: "Book 1:1 sessions with you", icon: hourglassIcon },
  { slug: "content", label: "Content", blurb: "Guides, templates, videos", icon: bookOpenIcon },
  { slug: "collection", label: "Collection", blurb: "Group products into a bundle", icon: stackIcon },
  { slug: "course", label: "Course", blurb: "Structured multi-lesson course", icon: myCoursesIcon },
  { slug: "paid-livestream", label: "Paid Livestream", blurb: "Host a paid live session", icon: lteSignalIcon },
  { slug: "agent", label: "Agent", blurb: "An AI assistant trained on you", icon: aiIcon },
  { slug: "membership", label: "Private group", blurb: "A private community for members", icon: crownIcon },
];
const offeringBySlug = Object.fromEntries(offeringTypes.map((o) => [o.slug, o]));

// A course section — placeholder builder for now (just a name).
type CourseSection = { id: number; name: string };

// An item inside a list offering. Collections use `config` as content config;
// courses use `config` for a lesson's name/description and `sections` for its
// ordered sections.
type CollectionItem = { id: number; config: Record<string, string>; sections?: CourseSection[] };

// What's selected in the course modal sidebar.
type CourseSelection = { type: "general" } | { type: "lesson"; lessonId: number } | { type: "section"; lessonId: number; sectionId: number };

// A configured offering added to the product. `config` holds the type-specific
// settings (shape owned by each type's fields component); `configured` flips to
// true once setup is saved. `items` is used by collections (resources) and
// courses (lessons).
type OfferingItem = { id: number; slug: string; config: Record<string, string>; configured: boolean; items?: CollectionItem[] };

// Ids are derived from the existing list (max + 1) so they can't collide — even
// if module state resets under HMR.
const newCollectionItem = (existing: CollectionItem[]): CollectionItem => ({
  id: existing.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  config: defaultConfigFor("content"),
});
const newCourseLesson = (existing: CollectionItem[]): CollectionItem => ({
  id: existing.reduce((max, r) => Math.max(max, r.id), 0) + 1,
  config: { title: "", description: "" },
  sections: [],
});
const newCourseSection = (existing: CourseSection[]): CourseSection => ({
  id: existing.reduce((max, s) => Math.max(max, s.id), 0) + 1,
  name: "",
});

// Per-type default config. A slug present here is "configurable": its added row
// gets a CTA that opens the config modal (see OfferingConfigFields). Add an
// entry to give another offering type its own configuration.
const configDefaults: Record<string, Record<string, string>> = {
  "coaching-time": { mode: "set", hours: "", minutes: "", minHours: "", maxHours: "" },
  content: { assetName: "", title: "", description: "", downloadable: "false", attachFile: "false", attachmentName: "", resourceType: "guide", lelandPlus: "false", anonymous: "false" },
  collection: { title: "", description: "" },
  course: { title: "", description: "" },
  "paid-livestream": { name: "", description: "", subcategories: "", lelandPlus: "false", duration: "30", date: "", time: "", coverName: "" },
  // Placeholder offerings — configuration TBD, so their config is empty and
  // they're always "complete" (see isConfigComplete's default).
  agent: {},
  membership: {},
};

// "List" offerings use the sidebar + content-pane modal (a General tab plus an
// ordered list of content items). Each defines its modal heading and the noun
// for its items.
const listOfferingCopy: Record<string, { heading: string; noun: string }> = {
  collection: { heading: "Collection", noun: "resource" },
  course: { heading: "Course", noun: "lesson" },
};
const isListOffering = (slug: string) => slug in listOfferingCopy;
const defaultConfigFor = (slug: string): Record<string, string> => ({ ...(configDefaults[slug] ?? {}) });
const isConfigurable = (slug: string) => slug in configDefaults;

// Subheadline shown under the modal title for each configurable type.
const configPrompts: Record<string, string> = {
  "coaching-time": "How much time do you want to include?",
  content: "Upload your file and add the details.",
  "paid-livestream": "Schedule and set up your livestream.",
};

// Unfinished-state CTA (label + optional icon) shown on the added row. The
// finished state always uses a gray "Edit" button.
const configCTA: Record<string, { label: string; icon?: string }> = {
  "coaching-time": { label: "Configure" },
  content: { label: "Configure" },
  collection: { label: "Configure" },
  course: { label: "Configure" },
  "paid-livestream": { label: "Configure" },
  agent: { label: "Configure" },
  membership: { label: "Configure" },
};

// Unfinished-state subtext for the added row (falls back to a generic nudge).
const configUnfinishedText: Record<string, string> = {
  collection: "Group a bundle of related content",
};

const RESOURCE_TYPES = [
  { value: "guide", label: "Guide" },
  { value: "example", label: "Example" },
  { value: "template", label: "Template" },
  { value: "practice", label: "Practice" },
  { value: "tool", label: "Tool" },
];

// MBA subcategories a livestream can be tagged with (maps to Leland categories).
const MBA_SUBCATEGORIES = ["Deferred MBA", "Executive MBA", "JD/MBA", "Online MBA", "Part-Time MBA", "Traditional Full-Time MBA"];

const LIVESTREAM_DURATIONS = [
  { value: "30", label: "30 minutes — Most popular" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "75", label: "1 hour 15 minutes" },
  { value: "90", label: "1 hour 30 minutes" },
  { value: "105", label: "1 hour 45 minutes" },
  { value: "120", label: "2 hours" },
];

// Whether a configurable offering has enough filled in to be saved as finished.
function isConfigComplete(item: OfferingItem): boolean {
  const c = item.config;
  if (item.slug === "coaching-time") {
    return c.mode === "range" ? Boolean(c.minHours && c.maxHours) : Boolean(c.hours || c.minutes);
  }
  if (item.slug === "content") {
    return Boolean(c.assetName && c.title);
  }
  if (item.slug === "paid-livestream") {
    return Boolean(c.name && c.date && c.time);
  }
  if (isListOffering(item.slug)) {
    return Boolean(c.title) && (item.items?.length ?? 0) > 0;
  }
  return true;
}

// One-line summary of a finished offering's config, shown under its title.
function configSummary(item: OfferingItem): string {
  const c = item.config;
  if (item.slug === "coaching-time") {
    if (c.mode === "range") return `${c.minHours}–${c.maxHours} hours of coaching`;
    const parts: string[] = [];
    if (c.hours) parts.push(`${c.hours} hr`);
    if (c.minutes && c.minutes !== "0") parts.push(`${c.minutes} min`);
    return `${parts.join(" ") || "0 min"} of coaching`;
  }
  if (item.slug === "content") {
    return c.assetName;
  }
  if (item.slug === "paid-livestream") {
    return c.name;
  }
  if (isListOffering(item.slug)) {
    const n = item.items?.length ?? 0;
    const noun = listOfferingCopy[item.slug].noun;
    return `${n} ${n === 1 ? noun : `${noun}s`}`;
  }
  if (item.slug === "agent" || item.slug === "membership") {
    return offeringBySlug[item.slug].blurb;
  }
  return "";
}

// Optional leading icon shown before a finished offering's summary text.
const configSummaryIcon: Record<string, string> = {
  content: attachIcon,
};

// Subtle fade + slide: up on enter, downward on exit.
const stepMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
};

// Height/opacity transition for the "Added" list. Rows animate their own
// height, so everything below reflows smoothly in normal document flow.
const offeringTransition = { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] as const };

// Matches the toggle used in the top-nav profile dropdown.
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

function CharField({
  label,
  required,
  value,
  onChange,
  placeholder,
  max,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  max: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] font-medium text-gray-light">
        {label}
        {required && <span className="text-[#E5484D]"> *</span>}
      </label>
      <input
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />
      <p className="mt-1 text-right text-[12px] text-[#999999]">{value.length} / {max}</p>
    </div>
  );
}

// Collapsible settings block used for "Plan settings" / "Product settings".
function Collapsible({ title, subtitle, defaultOpen = false, children }: { title: string; subtitle?: string; defaultOpen?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={subtitle ? "border-b border-gray-stroke pb-6" : "rounded-xl bg-[#F7F7F7]"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between ${subtitle ? "" : "px-4 py-3"}`}
      >
        <span className="text-left">
          <span className={`block ${subtitle ? "text-[22px] font-semibold" : "text-[15px] font-medium"} text-gray-dark`}>{title}</span>
          {subtitle && <span className="mt-0.5 block text-[15px] text-gray-light">{subtitle}</span>}
        </span>
        <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }} className="overflow-hidden">
            <div className={subtitle ? "pt-4" : "px-4 pb-4"}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Controlled checkbox.
function CheckBox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
        {checked && (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        )}
      </span>
      {label}
    </button>
  );
}

// Custom select — a trigger with a chevron and a menu that opens below.
function Select({ value, onChange, options, className = "" }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Menu is portaled to the body so it isn't clipped by any overflow-hidden
  // ancestor (e.g. the collapsing "Product settings" panel). Position is
  // measured from the trigger each time the menu opens.
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 });
  const selected = options.find((o) => o.value === value);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ left: r.left, top: r.bottom + 6, width: r.width });
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-stroke bg-white py-2.5 pl-3.5 pr-3 text-left text-[14px] text-gray-dark transition-colors hover:border-[#c9c9c9]"
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <svg className={`h-4 w-4 shrink-0 text-gray-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && createPortal(
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-[100] cursor-default" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[110] max-h-[280px] overflow-auto rounded-xl border border-gray-stroke bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
            style={{ left: pos.left, top: pos.top, width: pos.width }}
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] transition-colors hover:bg-gray-hover ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-dark"}`}
                >
                  {o.label}
                  {active && <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              );
            })}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

// Toggle row used in the floating admin tool.
function AdminToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-hover">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

export default function CoachProductNew() {
  const { category } = useParams<{ category: string; type?: string }>();
  const navigate = useNavigate();

  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const [step, setStep] = useState<StepKey>("product");

  // Shared product-in-progress state, reflected live in the preview.
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [pricingMode, setPricingMode] = useState<"free" | "paid">("free");
  const [paidType, setPaidType] = useState<"recurring" | "one-time">("one-time");
  const [price, setPrice] = useState("29.99");
  const [added, setAdded] = useState<OfferingItem[]>([]);
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("Purchase");
  const nextOfferingId = useRef(0);

  // Admin tool — MVP on shows the full feature set; off hides not-yet-built bits.
  const [mvp, setMvp] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onDown = (e: MouseEvent) => { if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [adminOpen]);

  useEffect(() => {
    document.title = "Leland Prototype | Add product";
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isLast = stepIndex === STEPS.length - 1;

  const close = () => setPendingNav(`/coach/manage/${category}`);
  const next = () => {
    if (isLast) close();
    else setStep(STEPS[stepIndex + 1].key);
  };

  const addOffering = (slug: string) => setAdded((a) => [...a, { id: nextOfferingId.current++, slug, config: defaultConfigFor(slug), configured: false, ...(isListOffering(slug) ? { items: [] } : {}) }]);
  const removeOffering = (id: number) => setAdded((a) => a.filter((item) => item.id !== id));
  const updateOfferingConfig = (id: number, patch: Record<string, string>) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, config: { ...item.config, ...patch } } : item)));
  const setOfferingItems = (id: number, items: CollectionItem[]) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, items } : item)));
  const markOfferingConfigured = (id: number) =>
    setAdded((a) => a.map((item) => (item.id === id ? { ...item, configured: true } : item)));

  return (
    <div className="min-h-screen bg-white">
      {/* Flow header — close, title, step breadcrumb, next */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-stroke bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Button>
          <span className="hidden text-[15px] font-semibold text-gray-dark sm:inline">Add product</span>
        </div>

        {/* Breadcrumb — click a step to jump to it */}
        <nav className="flex items-center gap-1.5">
          {STEPS.map((s, i) => {
            const active = s.key === step;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-4 w-4 text-[#CFCFCF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
                <button
                  onClick={() => setStep(s.key)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[14px] transition-colors ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"}`}
                >
                  <MaskIcon src={s.icon} />
                  {s.label}
                </button>
              </div>
            );
          })}
        </nav>

        <Button size="sm" variant="dark" rounded="rounded-full" className="text-[14px] font-semibold" onClick={next}>
          {isLast ? "Publish" : "Next"}
          {!isLast && (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          )}
        </Button>
      </header>

      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:gap-14">
        {/* Step content */}
        <main className="min-w-0 flex-1 pb-[120px]">
          <AnimatePresence mode="wait" onExitComplete={() => pendingNav && navigate(pendingNav)}>
            {!pendingNav && (
              <motion.div key={step} {...stepMotion}>
                {step === "product" && (
                  <ProductStep
                    name={name} setName={setName}
                    headline={headline} setHeadline={setHeadline}
                    pricingMode={pricingMode} setPricingMode={setPricingMode}
                    paidType={paidType} setPaidType={setPaidType}
                    price={price} setPrice={setPrice}
                    buttonText={buttonText} setButtonText={setButtonText}
                    mvp={mvp}
                  />
                )}
                {step === "offerings" && (
                  <OfferingsStep added={added} onAdd={addOffering} onRemove={removeOffering} onConfigChange={updateOfferingConfig} onItemsChange={setOfferingItems} onConfigured={markOfferingConfigured} mvp={mvp} />
                )}
                {step === "page" && (
                  <PageStep
                    name={name}
                    headline={headline}
                    pricingMode={pricingMode}
                    paidType={paidType}
                    price={price}
                    description={description}
                    setDescription={setDescription}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Live preview — persists across steps */}
        <aside className="w-full lg:sticky lg:top-[88px] lg:h-fit lg:w-[320px] lg:shrink-0">
          <ProductPreview
            name={name}
            headline={headline}
            pricingMode={pricingMode}
            paidType={paidType}
            price={price}
            added={added}
            joinLabel={buttonText}
          />
        </aside>
      </div>

      {/* Admin tool — bottom-right, mirrors the profile template */}
      <div ref={adminRef} className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[200px] rounded-xl border border-gray-stroke bg-white p-2 shadow-[0_4px_16px_rgba(16,24,40,0.12)]"
            >
              <AdminToggle label="MVP" checked={mvp} onChange={() => setMvp((v) => !v)} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-colors hover:bg-[#B1B1B1]/30"
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

/* ---------- Step 1: Product details + pricing ---------- */

function ProductStep({
  name, setName, headline, setHeadline,
  pricingMode, setPricingMode, paidType, setPaidType, price, setPrice,
  buttonText, setButtonText, mvp,
}: {
  name: string; setName: (v: string) => void;
  headline: string; setHeadline: (v: string) => void;
  pricingMode: "free" | "paid"; setPricingMode: (v: "free" | "paid") => void;
  paidType: "recurring" | "one-time"; setPaidType: (v: "recurring" | "one-time") => void;
  price: string; setPrice: (v: string) => void;
  buttonText: string; setButtonText: (v: string) => void;
  mvp: boolean;
}) {
  const pricingOptions = [
    { key: "free" as const, label: "Free access", desc: "Anyone can access this for free.", icon: freeIcon },
    { key: "paid" as const, label: "Paid access", desc: "Charge a one-time or recurring price.", icon: moneyIcon },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Product details</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Describe your product offering.</p>
        <div className="mt-5 flex flex-col gap-5">
          <CharField label="Name" required value={name} onChange={setName} placeholder="My product name" max={80} />
          <CharField label="Headline" value={headline} onChange={setHeadline} placeholder="A short subheadline for my product here." max={80} />
        </div>
      </section>

      <div className="border-t border-gray-stroke" />

      <section>
        <h2 className="text-[22px] font-semibold text-gray-dark">Pricing</h2>
        <p className="mt-0.5 text-[15px] text-gray-light">Choose how people access this product.</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {pricingOptions.map((opt) => {
            const active = pricingMode === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setPricingMode(opt.key)}
                className={`flex flex-col items-center rounded-xl px-4 py-6 text-center transition-colors ${active ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke hover:border-[#c9c9c9]"}`}
              >
                <MaskIcon src={opt.icon} className={`h-7 w-7 ${active ? "text-gray-dark" : "text-gray-extra-light"}`} />
                <span className="mt-3 text-[16px] font-semibold text-gray-dark">{opt.label}</span>
                <span className="mt-1 text-[14px] leading-snug text-gray-light">{opt.desc}</span>
              </button>
            );
          })}
        </div>

        {pricingMode === "paid" && (
          <div className="mt-3">
            <PaidPricingCard paidType={paidType} setPaidType={setPaidType} price={price} setPrice={setPrice} />
          </div>
        )}
      </section>

      <div className="border-t border-gray-stroke" />

      <Collapsible title="Product settings" subtitle="URL, taxes, affiliates, and more.">
        <ProductSettings buttonText={buttonText} setButtonText={setButtonText} mvp={mvp} />
      </Collapsible>
    </div>
  );
}

/* ---------- Paid pricing (recurring / one-time) ---------- */

// Secondary text beneath the price — a dropdown link toggling one-time / monthly.
function CadenceLink({ recurring, onChange }: { recurring: boolean; onChange: (recurring: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const options = [
    { recurring: false, label: "one-time" },
    { recurring: true, label: "per month" },
  ];
  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex items-center gap-1 text-[17px] text-gray-light transition-colors hover:text-gray-dark">
        {recurring ? "per month" : "one-time"}
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <>
          <button aria-hidden tabIndex={-1} className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[150px] overflow-hidden rounded-xl border border-gray-stroke bg-white p-1 shadow-[0_4px_16px_rgba(16,24,40,0.12)]">
            {options.map((opt) => {
              const active = opt.recurring === recurring;
              return (
                <button key={opt.label} type="button" onClick={() => { onChange(opt.recurring); setOpen(false); }} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] text-gray-dark transition-colors hover:bg-gray-hover ${active ? "font-semibold" : "font-medium"}`}>
                  {opt.label}
                  {active && <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function PaidPricingCard({ paidType, setPaidType, price, setPrice }: { paidType: "recurring" | "one-time"; setPaidType: (v: "recurring" | "one-time") => void; price: string; setPrice: (v: string) => void }) {
  const recurring = paidType === "recurring";
  const [freeTrial, setFreeTrial] = useState(false);
  const [trialLength, setTrialLength] = useState("7");

  // Size the input to its content (treat "." as narrow) so the cadence link
  // tucks right up against the number.
  const priceDisplay = price || "0";
  const priceWidthCh = [...priceDisplay].reduce((w, c) => w + (c === "." ? 0.45 : 1), 0);
  const formatPrice = () => { if (price !== "" && !Number.isNaN(Number(price))) setPrice(Number(price).toFixed(2)); };

  return (
    <div className="rounded-xl border border-gray-stroke transition-colors focus-within:border-gray-dark">
      {/* Big price field: left-aligned number with the cadence beside it */}
      <div className="flex items-end gap-2 px-5 py-6">
        <div className="flex items-center gap-1">
          <span className="text-[36px] font-medium leading-none text-gray-dark">$</span>
          <input
            inputMode="decimal"
            value={price}
            placeholder="0"
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
            onBlur={formatPrice}
            style={{ width: `${priceWidthCh}ch` }}
            className="min-w-0 bg-transparent text-left text-[36px] font-medium leading-none text-gray-dark underline decoration-gray-dark decoration-dotted decoration-2 underline-offset-[6px] outline-none placeholder:text-gray-dark"
          />
        </div>
        <div className="pb-1">
          <CadenceLink recurring={recurring} onChange={(r) => setPaidType(r ? "recurring" : "one-time")} />
        </div>
      </div>

      {recurring && (
        <div className="border-t border-gray-stroke px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2.5 text-[14px] font-medium text-gray-dark">
              <svg className="h-[18px] w-[18px] text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7ZM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></svg>
              Include a free trial
              <span className="rounded bg-[#EEF1FF] px-1.5 py-0.5 text-[12px] font-semibold text-[#4666E5]">Recommended</span>
            </span>
            <Toggle checked={freeTrial} onChange={() => setFreeTrial((v) => !v)} />
          </div>
          {freeTrial && (
            <>
              <Select
                value={trialLength}
                onChange={setTrialLength}
                className="mt-3"
                options={[
                  { value: "3", label: "3 days" },
                  { value: "7", label: "7 days" },
                  { value: "30", label: "30 days" },
                  { value: "custom", label: "After other # of days…" },
                ]}
              />
              {trialLength === "custom" && (
                <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
                  <input placeholder="Number of days" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1]" />
                  <span className="text-[14px] text-gray-light">days</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Product settings (URL, taxes, affiliates) ---------- */

function ProductSettings({ buttonText, setButtonText, mvp }: { buttonText: string; setButtonText: (v: string) => void; mvp: boolean }) {
  const [affiliate, setAffiliate] = useState(false);
  const [storeVisible, setStoreVisible] = useState(true);

  const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

  return (
    <div className="flex flex-col gap-5">
      {!mvp && (
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Stock</label>
          <input placeholder="Unlimited" className={inputClass} />
        </div>
      )}

      {!mvp && <AskQuestions />}

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Purchase button text</label>
        <Select
          value={buttonText}
          onChange={setButtonText}
          options={["Purchase", "Join", "Join now", "Get access", "Subscribe", "Buy now"].map((v) => ({ value: v, label: v }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Product URL</label>
        <input defaultValue="leland.com/samantha-parker/new-product" className={inputClass} />
      </div>

      {!mvp && (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-gray-dark">Add affiliate rate</span>
            <Toggle checked={affiliate} onChange={() => setAffiliate((v) => !v)} />
          </div>
          {affiliate && (
            <div className="mt-2 flex items-center rounded-lg border border-gray-stroke bg-white px-3.5 focus-within:border-gray-dark">
              <input defaultValue="30" className="w-full bg-transparent py-2.5 text-[14px] text-gray-dark outline-none" />
              <span className="text-[14px] text-gray-light">%</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-gray-dark">Visible on your store page</span>
        <Toggle checked={storeVisible} onChange={() => setStoreVisible((v) => !v)} />
      </div>
    </div>
  );
}

/* ---------- Ask questions before checkout ---------- */

function AskQuestions() {
  const [enabled, setEnabled] = useState(false);
  const [questions, setQuestions] = useState<{ title: string; placeholder: string; optional: boolean }[]>([
    { title: "", placeholder: "", optional: false },
  ]);

  const update = (i: number, patch: Partial<{ title: string; placeholder: string; optional: boolean }>) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const remove = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  const add = () => setQuestions((qs) => [...qs, { title: "", placeholder: "", optional: false }]);

  const inputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[14px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

  return (
    <div>
      <CheckBox checked={enabled} onChange={() => setEnabled((v) => !v)} label="Ask questions before checkout" />
      {enabled && (
        <div className="relative mt-4 flex flex-col gap-6">
          {/* Dashed connector linking the question numbers */}
          <span className="pointer-events-none absolute bottom-[13px] left-[13px] top-[13px] w-px border-l border-dashed border-[#D4D4D4]" />

          {questions.map((q, i) => (
            <div key={i} className="relative pl-10">
              <span className="absolute left-0 top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-gray-stroke bg-white text-[13px] font-medium text-gray-light">{i + 1}</span>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-gray-dark">Question {i + 1}</span>
                <button onClick={() => remove(i)} aria-label="Remove question" className="text-[#E5484D] transition-opacity hover:opacity-70">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" /></svg>
                </button>
              </div>
              <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Question title</label>
              <input value={q.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="What do you want to do?" className={inputClass} />
              <label className="mb-1.5 mt-3 block text-[14px] font-medium text-gray-light">Question placeholder</label>
              <input value={q.placeholder} onChange={(e) => update(i, { placeholder: e.target.value })} placeholder="Stocks, crypto, forex" className={inputClass} />
              <div className="mt-3">
                <CheckBox checked={q.optional} onChange={() => update(i, { optional: !q.optional })} label="Optional" />
              </div>
            </div>
          ))}

          <button onClick={add} className="relative flex items-center pl-10 text-left">
            <span className="absolute left-0 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#EEF1FF] text-[#4666E5]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span className="text-[15px] font-semibold text-[#4666E5]">Add another question</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2: Included offerings ---------- */

function OfferingsStep({ added, onAdd, onRemove, onConfigChange, onItemsChange, onConfigured, mvp }: { added: OfferingItem[]; onAdd: (slug: string) => void; onRemove: (id: number) => void; onConfigChange: (id: number, patch: Record<string, string>) => void; onItemsChange: (id: number, items: CollectionItem[]) => void; onConfigured: (id: number) => void; mvp: boolean }) {
  // One of each: an offering leaves the "Add" grid once it's been added.
  // When MVP is on, hide the not-yet-built Agent / Private group options.
  const available = offeringTypes.filter((o) => !added.some((a) => a.slug === o.slug) && (!mvp || (o.slug !== "agent" && o.slug !== "membership")));
  const [configuringId, setConfiguringId] = useState<number | null>(null);
  const configuring = added.find((item) => item.id === configuringId) ?? null;

  return (
    <div>
      <h2 className="text-[22px] font-semibold text-gray-dark">Included offerings</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">Choose the offerings you want to include with this product.</p>

      {/* Animated top gap for the added list (collapses smoothly when empty). */}
      <AnimatePresence initial={false}>
        {added.length > 0 && (
          <motion.div key="added-spacer" initial={{ height: 0 }} animate={{ height: 24 }} exit={{ height: 0 }} transition={offeringTransition} />
        )}
      </AnimatePresence>

      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {added.map((item) => (
            <motion.div
              key={item.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={offeringTransition}
              className="overflow-hidden"
            >
              <AddedOfferingRow
                item={item}
                onRemove={() => onRemove(item.id)}
                onConfigure={() => setConfiguringId(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {available.length > 0 && (
        <p className="mb-2 mt-8 text-[14px] font-medium text-gray-light">Add offering</p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* popLayout pops an added card out of flow so the rest reflow to fill. */}
        <AnimatePresence initial={false} mode="popLayout">
          {available.map((o) => (
            <motion.button
              key={o.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={offeringTransition}
              onClick={() => onAdd(o.slug)}
              className="group flex items-center justify-between rounded-xl bg-gray-hover px-3 py-2.5 text-left transition-colors hover:bg-[#ececec]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[8px]">
                  <img src={o.icon} alt="" className="h-5 w-5" />
                </span>
                <span className="text-[15px] font-semibold text-gray-dark">{o.label}</span>
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-light transition-colors group-hover:text-gray-dark">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <ConfigModal
        item={configuring && !isListOffering(configuring.slug) ? configuring : null}
        onChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
      <ListConfigModal
        item={configuring && configuring.slug === "collection" ? configuring : null}
        onGeneralChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onItemsChange={(items) => configuring && onItemsChange(configuring.id, items)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
      <CourseModal
        item={configuring && configuring.slug === "course" ? configuring : null}
        onGeneralChange={(patch) => configuring && onConfigChange(configuring.id, patch)}
        onItemsChange={(items) => configuring && onItemsChange(configuring.id, items)}
        onSave={() => { if (configuring) { onConfigured(configuring.id); setConfiguringId(null); } }}
        onClose={() => setConfiguringId(null)}
      />
    </div>
  );
}

/* ---------- Added offering row ---------- */

function AddedOfferingRow({ item, onRemove, onConfigure }: { item: OfferingItem; onRemove: () => void; onConfigure: () => void }) {
  const o = offeringBySlug[item.slug];
  const configurable = isConfigurable(item.slug);
  const finished = !configurable || item.configured;

  // Subtext: unfinished offerings nudge toward setup; finished ones summarize
  // their config; non-configurable ones just show their blurb.
  const subtext = !configurable
    ? o.blurb
    : finished
      ? configSummary(item)
      : (configUnfinishedText[item.slug] ?? "Needs to be configured");
  const subtextIcon = configurable && finished ? configSummaryIcon[item.slug] : undefined;
  const cta = configCTA[item.slug] ?? { label: "Configure" };

  return (
    <div className="flex items-center gap-3 border-b border-gray-stroke bg-white py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#f5f5f5]">
        <img src={o.icon} alt="" className="h-[22px] w-[22px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-gray-dark">{o.label}</span>
        <span className={`flex items-center gap-1.5 text-[15px] ${finished ? "text-gray-light" : "text-gray-extra-light"}`}>
          {subtextIcon && <MaskIcon src={subtextIcon} className="h-4 w-4 shrink-0" />}
          <span className="truncate">{subtext}</span>
        </span>
      </span>

      <div className="flex shrink-0 items-center gap-1">
        {configurable && (
          finished ? (
            <button onClick={onConfigure} aria-label={`Edit ${o.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
              <MaskIcon src={editIcon} className="h-[18px] w-[18px]" />
            </button>
          ) : (
            <Button size="md" variant="dark" onClick={onConfigure} className="mr-1">
              {cta.icon && <MaskIcon src={cta.icon} className="h-[18px] w-[18px]" />}
              {cta.label}
            </Button>
          )
        )}
        <button onClick={onRemove} aria-label={`Remove ${o.label}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

/* ---------- Configuration modal ---------- */

function ConfigModal({ item, onChange, onSave, onClose }: { item: OfferingItem | null; onChange: (patch: Record<string, string>) => void; onSave: () => void; onClose: () => void }) {
  const o = item ? offeringBySlug[item.slug] : null;
  const complete = item ? isConfigComplete(item) : false;
  const prompt = item ? configPrompts[item.slug] : undefined;

  return createPortal(
    <AnimatePresence>
      {item && o && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-[500px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Close — circular gray, top-right */}
            <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 pb-2 pt-8">
              {/* Left-aligned header */}
              <h2 className="pr-10 font-serif text-[28px] leading-tight text-gray-dark">Configure {o.label.toLowerCase()}</h2>
              {prompt && <p className="mt-1.5 text-[15px] text-gray-light">{prompt}</p>}

              {/* Fields */}
              <div className="mt-6">
                <OfferingConfigFields slug={item.slug} config={item.config} onChange={onChange} />
              </div>
            </div>

            {/* Actions */}
            <div className="px-7 pb-7 pt-4">
              <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                Save offering
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Dispatches to the fields component for the offering type. Add a case here
// alongside a configDefaults entry to configure another type.
function OfferingConfigFields({ slug, config, onChange }: { slug: string; config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  if (slug === "coaching-time") return <CoachingTimeFields config={config} onChange={onChange} />;
  if (slug === "content") return <ContentFields config={config} onChange={onChange} />;
  if (slug === "paid-livestream") return <PaidLivestreamFields config={config} onChange={onChange} />;
  return <PlaceholderFields label={offeringBySlug[slug]?.label ?? "This offering"} />;
}

/* ---------- Paid livestream config ---------- */

function PaidLivestreamFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  const selectedSubs = (config.subcategories ?? "").split(",").filter(Boolean);
  const toggleSub = (s: string) => {
    const set = new Set(selectedSubs);
    if (set.has(s)) set.delete(s); else set.add(s);
    onChange({ subcategories: [...set].join(",") });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Name</label>
        <input value={config.name ?? ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="Name your livestream" autoComplete="off" className={configInputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="What will you cover?" autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Duration</label>
        <Select value={config.duration ?? "30"} onChange={(v) => onChange({ duration: v })} options={LIVESTREAM_DURATIONS} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Date</label>
          <input type="date" value={config.date ?? ""} onChange={(e) => onChange({ date: e.target.value })} className={configInputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Time</label>
          <input type="time" value={config.time ?? ""} onChange={(e) => onChange({ time: e.target.value })} className={configInputClass} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Cover photo</label>
        <UploadField value={config.coverName ?? ""} onChange={(name) => onChange({ coverName: name })} hint="Recommended 1200 × 630" />
      </div>

      <div>
        <label className="mb-2 block text-[14px] font-medium text-gray-light">Subcategories</label>
        <div className="flex flex-wrap gap-2">
          {MBA_SUBCATEGORIES.map((s) => {
            const active = selectedSubs.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSub(s)}
                className={`rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${active ? "border-gray-dark bg-gray-dark text-white" : "border-gray-stroke text-gray-dark hover:border-[#c9c9c9]"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <ToggleRow
        label="Upload recording to Leland+"
        desc="Reach new leads and earn passive income by sharing your recording with Leland+ subscribers. You keep full rights to your content."
        checked={config.lelandPlus === "true"}
        onChange={() => onChange({ lelandPlus: config.lelandPlus === "true" ? "false" : "true" })}
      />
    </div>
  );
}

// Stand-in for offering types whose configuration isn't designed yet.
function PlaceholderFields({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-stroke bg-[#FAFAFA] px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-hover text-gray-extra-light">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.41 1.41M6.34 17.66l-1.41 1.41m12.14 0-1.41-1.41M6.34 6.34 4.93 4.93" /><circle cx="12" cy="12" r="4" /></svg>
      </span>
      <p className="mt-4 text-[16px] font-semibold text-gray-dark">{label} setup is coming soon</p>
      <p className="mt-1.5 text-[14px] leading-snug text-gray-light">We're still designing the configuration for this offering. For now you can add it to your product as a placeholder.</p>
    </div>
  );
}

/* ---------- List-offering modal (sidebar + content pane) ---------- */

// Overall settings shown on the "General" tab of a list offering.
function ListGeneralFields({ config, onChange, heading }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void; heading: string }) {
  const lower = heading.toLowerCase();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">{heading} title</label>
        <input value={config.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} placeholder={`Name your ${lower}`} autoComplete="off" className={configInputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder={`Describe this ${lower}…`} autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>
    </div>
  );
}

// Shared by Collection and Course — a sidebar list of content items (with a
// General tab) plus a content-editing pane. Copy (heading, item noun) comes
// from the offering's slug via listOfferingCopy.
function ListConfigModal({ item, onGeneralChange, onItemsChange, onSave, onClose }: { item: OfferingItem | null; onGeneralChange: (patch: Record<string, string>) => void; onItemsChange: (items: CollectionItem[]) => void; onSave: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<number | "general">("general");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Reset to the General tab each time the modal is opened.
  useEffect(() => { if (item) setSelected("general"); }, [item?.id]);

  const copy = item ? listOfferingCopy[item.slug] : null;
  const items = item?.items ?? [];
  const complete = item ? isConfigComplete(item) : false;
  const selectedItem = typeof selected === "number" ? items.find((r) => r.id === selected) ?? null : null;
  const showGeneral = selected === "general" || !selectedItem;

  const addItem = () => {
    const created = newCollectionItem(items);
    onItemsChange([...items, created]);
    setSelected(created.id);
  };
  const removeItem = (id: number) => {
    onItemsChange(items.filter((r) => r.id !== id));
    if (selected === id) setSelected("general");
  };
  const updateItem = (id: number, patch: Record<string, string>) =>
    onItemsChange(items.map((r) => (r.id === id ? { ...r, config: { ...r.config, ...patch } } : r)));
  const reorder = (from: number, to: number) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onItemsChange(next);
  };

  return createPortal(
    <AnimatePresence>
      {item && copy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[750px] max-h-[85vh] w-full max-w-[860px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Sidebar */}
            <div className="flex w-[264px] shrink-0 flex-col border-r border-gray-stroke bg-[#FAFAFA]">
              <p className="px-5 pb-3 pt-6 font-serif text-[28px] text-gray-dark">{copy.heading}</p>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <button
                  type="button"
                  onClick={() => setSelected("general")}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${showGeneral ? "bg-white font-medium text-gray-dark shadow-[0_1px_2px_rgba(16,24,40,0.08)]" : "text-gray-light hover:bg-black/[0.03]"}`}
                >
                  General
                </button>

                {items.map((r, i) => {
                  const active = selected === r.id;
                  return (
                    <div
                      key={r.id}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragEnter={() => { if (dragIndex !== null && dragIndex !== i) { reorder(dragIndex, i); setDragIndex(i); } }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={() => setDragIndex(null)}
                      onClick={() => setSelected(r.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${active ? "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)]" : "hover:bg-black/[0.03]"}`}
                    >
                      <span className={`min-w-0 flex-1 truncate text-[14px] ${active ? "font-medium text-gray-dark" : "text-gray-light"}`}>{r.config.title || `Untitled ${copy.noun}`}</span>
                      <svg className="h-4 w-4 shrink-0 cursor-grab text-[#C4C4C4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addItem}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Add {copy.noun}
                </button>
              </div>
            </div>

            {/* Main pane */}
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-gray-stroke py-4 pl-7 pr-5">
                <h2 className="min-w-0 truncate font-serif text-[22px] text-gray-dark">
                  {showGeneral ? "General" : (selectedItem!.config.title || `Untitled ${copy.noun}`)}
                </h2>
                <div className="flex shrink-0 items-center gap-2">
                  {!showGeneral && (
                    <button onClick={() => removeItem(selectedItem!.id)} aria-label={`Remove ${copy.noun}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {showGeneral ? (
                  <ListGeneralFields config={item.config} onChange={onGeneralChange} heading={copy.heading} />
                ) : (
                  <ContentFields key={selectedItem!.id} config={selectedItem!.config} onChange={(patch) => updateItem(selectedItem!.id, patch)} />
                )}
              </div>

              <div className="border-t border-gray-stroke px-7 py-4">
                <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                  Save {copy.heading.toLowerCase()}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Course modal (lessons → sections) ---------- */

// A course lesson's own settings (name + description).
function LessonFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Lesson name</label>
        <input value={config.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} placeholder="Name your lesson" autoComplete="off" className={configInputClass} />
      </div>
      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="Describe this lesson…" autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>
    </div>
  );
}

const courseNavActive = "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.08)]";
const dragHandle = <svg className="h-4 w-4 shrink-0 cursor-grab text-[#C4C4C4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>;
const plusIcon = <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>;

function CourseModal({ item, onGeneralChange, onItemsChange, onSave, onClose }: { item: OfferingItem | null; onGeneralChange: (patch: Record<string, string>) => void; onItemsChange: (items: CollectionItem[]) => void; onSave: () => void; onClose: () => void }) {
  const [selected, setSelected] = useState<CourseSelection>({ type: "general" });
  const [dragLesson, setDragLesson] = useState<number | null>(null);
  const [dragSection, setDragSection] = useState<{ lessonId: number; index: number } | null>(null);

  useEffect(() => { if (item) setSelected({ type: "general" }); }, [item?.id]);

  const lessons = item?.items ?? [];
  const complete = item ? isConfigComplete(item) : false;
  const lessonId = selected.type === "general" ? null : selected.lessonId;
  const selLesson = lessonId !== null ? lessons.find((l) => l.id === lessonId) ?? null : null;
  const selSection = selected.type === "section" && selLesson ? (selLesson.sections ?? []).find((s) => s.id === selected.sectionId) ?? null : null;
  const view: "general" | "lesson" | "section" = !selLesson ? "general" : selected.type === "section" && selSection ? "section" : "lesson";

  const addLesson = () => {
    const l = newCourseLesson(lessons);
    onItemsChange([...lessons, l]);
    setSelected({ type: "lesson", lessonId: l.id });
  };
  const removeLesson = (id: number) => {
    onItemsChange(lessons.filter((l) => l.id !== id));
    setSelected({ type: "general" });
  };
  const updateLesson = (id: number, patch: Record<string, string>) =>
    onItemsChange(lessons.map((l) => (l.id === id ? { ...l, config: { ...l.config, ...patch } } : l)));
  const reorderLessons = (from: number, to: number) => {
    const next = [...lessons];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onItemsChange(next);
  };
  const addSection = (lid: number) => {
    const lesson = lessons.find((l) => l.id === lid);
    if (!lesson) return;
    const secs = lesson.sections ?? [];
    const created = newCourseSection(secs);
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: [...secs, created] } : l)));
    setSelected({ type: "section", lessonId: lid, sectionId: created.id });
  };
  const removeSection = (lid: number, sid: number) => {
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: (l.sections ?? []).filter((s) => s.id !== sid) } : l)));
    setSelected({ type: "lesson", lessonId: lid });
  };
  const updateSection = (lid: number, sid: number, name: string) =>
    onItemsChange(lessons.map((l) => (l.id === lid ? { ...l, sections: (l.sections ?? []).map((s) => (s.id === sid ? { ...s, name } : s)) } : l)));
  const reorderSections = (lid: number, from: number, to: number) =>
    onItemsChange(lessons.map((l) => {
      if (l.id !== lid) return l;
      const secs = [...(l.sections ?? [])];
      const [m] = secs.splice(from, 1);
      secs.splice(to, 0, m);
      return { ...l, sections: secs };
    }));

  const headerTitle = view === "general" ? "General" : view === "lesson" ? (selLesson!.config.title || "Untitled lesson") : (selSection!.name || "Untitled section");

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 32 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[750px] max-h-[85vh] w-full max-w-[860px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.28)]"
          >
            {/* Sidebar */}
            <div className="flex w-[264px] shrink-0 flex-col border-r border-gray-stroke bg-[#FAFAFA]">
              <p className="px-5 pb-3 pt-6 font-serif text-[28px] text-gray-dark">Course</p>
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                <button
                  type="button"
                  onClick={() => setSelected({ type: "general" })}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${view === "general" ? `${courseNavActive} font-medium text-gray-dark` : "text-gray-light hover:bg-black/[0.03]"}`}
                >
                  General
                </button>

                {lessons.map((lesson, li) => {
                  const lessonActive = selected.type === "lesson" && selected.lessonId === lesson.id;
                  const secs = lesson.sections ?? [];
                  return (
                    <div key={lesson.id} className="mt-1">
                      <div
                        draggable
                        onDragStart={() => setDragLesson(li)}
                        onDragEnter={() => { if (dragLesson !== null && dragLesson !== li) { reorderLessons(dragLesson, li); setDragLesson(li); } }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={() => setDragLesson(null)}
                        onClick={() => setSelected({ type: "lesson", lessonId: lesson.id })}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${lessonActive ? courseNavActive : "hover:bg-black/[0.03]"}`}
                      >
                        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-gray-dark">{lesson.config.title || "Untitled lesson"}</span>
                        {dragHandle}
                      </div>

                      <div className="mt-0.5 flex flex-col gap-0.5">
                        {secs.map((sec, si) => {
                          const secActive = selected.type === "section" && selected.sectionId === sec.id;
                          return (
                            <div
                              key={sec.id}
                              draggable
                              onDragStart={(e) => { e.stopPropagation(); setDragSection({ lessonId: lesson.id, index: si }); }}
                              onDragEnter={() => { if (dragSection && dragSection.lessonId === lesson.id && dragSection.index !== si) { reorderSections(lesson.id, dragSection.index, si); setDragSection({ lessonId: lesson.id, index: si }); } }}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnd={() => setDragSection(null)}
                              onClick={() => setSelected({ type: "section", lessonId: lesson.id, sectionId: sec.id })}
                              className={`flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 pr-3 transition-colors ${secActive ? courseNavActive : "hover:bg-black/[0.03]"}`}
                            >
                              <span className={`min-w-0 flex-1 truncate text-[14px] ${secActive ? "font-medium text-gray-dark" : "text-gray-light"}`}>{sec.name || "Untitled section"}</span>
                              {dragHandle}
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => addSection(lesson.id)}
                          className="flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 pr-3 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                        >
                          {plusIcon}
                          Add section
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addLesson}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[14px] font-medium text-gray-light transition-colors hover:bg-black/[0.03]"
                >
                  {plusIcon}
                  Add lesson
                </button>
              </div>
            </div>

            {/* Main pane */}
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-gray-stroke py-4 pl-7 pr-5">
                <h2 className="min-w-0 truncate font-serif text-[22px] text-gray-dark">{headerTitle}</h2>
                <div className="flex shrink-0 items-center gap-2">
                  {view === "lesson" && (
                    <button onClick={() => removeLesson(selLesson!.id)} aria-label="Remove lesson" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  {view === "section" && (
                    <button onClick={() => removeSection(selLesson!.id, selSection!.id)} aria-label="Remove section" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5484D]/10 text-[#E5484D] transition-colors hover:bg-[#E5484D]/20">
                      <MaskIcon src={trashIcon} className="h-[18px] w-[18px]" />
                    </button>
                  )}
                  <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-hover text-gray-dark transition-colors hover:bg-[#ebebeb]">
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
                {view === "general" && <ListGeneralFields config={item.config} onChange={onGeneralChange} heading="Course" />}
                {view === "lesson" && selLesson && <LessonFields key={selLesson.id} config={selLesson.config} onChange={(patch) => updateLesson(selLesson.id, patch)} />}
                {view === "section" && selLesson && selSection && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Section name</label>
                      <input value={selSection.name} onChange={(e) => updateSection(selLesson.id, selSection.id, e.target.value)} placeholder="Name this section" autoComplete="off" className={configInputClass} />
                    </div>
                    <PlaceholderFields label="Section builder" />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-stroke px-7 py-4">
                <Button size="lg" variant="primary" rounded="rounded-full" className="w-full" disabled={!complete} onClick={onSave}>
                  Save course
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ---------- Shared config field bits ---------- */

const configInputClass = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark";

// A leading checkbox with a label + description — the standard settings row.
function ToggleRow({ label, desc, checked, onChange, className = "" }: { label: string; desc?: string; checked: boolean; onChange: () => void; className?: string }) {
  return (
    <button type="button" onClick={onChange} className={`flex w-full items-start gap-3 text-left ${className}`}>
      <span className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-gray-dark bg-gray-dark" : "border-gray-stroke bg-white"}`}>
        {checked && <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium text-gray-dark">{label}</span>
        {desc && <span className="mt-0.5 block text-[13px] leading-snug text-gray-light">{desc}</span>}
      </span>
    </button>
  );
}

// Click-to-pick file control. No real upload — captures the chosen file's name
// so the prototype can reflect a "finished" state.
function UploadField({ value, onChange, hint }: { value: string; onChange: (name: string) => void; hint: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-stroke bg-[#FAFAFA] px-4 py-6 text-center transition-colors hover:border-[#c9c9c9]">
      <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f.name); }} />
      <MaskIcon src={uploadIcon} className={`h-6 w-6 ${value ? "text-gray-dark" : "text-gray-light"}`} />
      <span className="text-[15px] font-medium text-gray-dark">{value || "Upload a file"}</span>
      <span className="text-[13px] text-gray-light">{value ? "Click to replace" : hint}</span>
    </label>
  );
}

/* ---------- Content config ---------- */

function ContentFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  const on = (k: string) => config[k] === "true";
  const toggle = (k: string) => onChange({ [k]: on(k) ? "false" : "true" });
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <UploadField value={config.assetName ?? ""} onChange={(name) => onChange({ assetName: name })} hint="PDF, video, image, or doc" />

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Title</label>
        <input value={config.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} placeholder="Give your content a title" autoComplete="off" className={configInputClass} />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Description</label>
        <textarea value={config.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="Describe what this is…" autoComplete="off" className={`${configInputClass} resize-none`} />
      </div>

      <div>
        <label className="mb-1.5 block text-[14px] font-medium text-gray-light">Resource type</label>
        <Select value={config.resourceType ?? "guide"} onChange={(v) => onChange({ resourceType: v })} options={RESOURCE_TYPES} />
      </div>

      {/* Advanced settings — collapsed by default */}
      <div className="border-t border-gray-stroke pt-2">
        <button type="button" onClick={() => setAdvancedOpen((v) => !v)} className="flex w-full items-center justify-between py-2 text-left">
          <span className="text-[17px] font-semibold text-gray-dark">Advanced settings</span>
          <svg className={`h-5 w-5 shrink-0 text-gray-dark transition-transform ${advancedOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <AnimatePresence initial={false}>
          {advancedOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={offeringTransition} className="overflow-hidden">
              <div className="flex flex-col gap-5 pt-4">
                <ToggleRow label="Allow downloads" desc="Let members download this asset." checked={on("downloadable")} onChange={() => toggle("downloadable")} />

                <div>
                  <ToggleRow label="Attach a separate, downloadable file" checked={on("attachFile")} onChange={() => toggle("attachFile")} />
                  {on("attachFile") && (
                    <div className="mt-3">
                      <UploadField value={config.attachmentName ?? ""} onChange={(name) => onChange({ attachmentName: name })} hint="The file members can download" />
                    </div>
                  )}
                </div>

                <div>
                  <ToggleRow
                    label="Add to the Leland+ library"
                    desc="Anyone with a Leland+ subscription can access it. You’ll get paid based on usage."
                    checked={on("lelandPlus")}
                    onChange={() => toggle("lelandPlus")}
                  />
                  {on("lelandPlus") && (
                    <ToggleRow className="mt-4" label="Submit anonymously" checked={on("anonymous")} onChange={() => toggle("anonymous")} />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Coaching time config ---------- */

// Large, weighty numeric field: a big centered number with a dotted underline
// over a unit label, inside a tall bordered card.
function TimeField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border border-gray-stroke px-4 py-7 transition-colors focus-within:border-gray-dark">
      <input
        inputMode="numeric"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="w-full min-w-0 bg-transparent text-center text-[40px] font-medium leading-none text-gray-dark underline decoration-gray-dark decoration-dotted decoration-2 underline-offset-[6px] outline-none placeholder:text-gray-dark"
      />
      <span className="mt-3 text-[17px] text-gray-light">{label}</span>
    </div>
  );
}

function CoachingTimeFields({ config, onChange }: { config: Record<string, string>; onChange: (patch: Record<string, string>) => void }) {
  const mode = config.mode === "range" ? "range" : "set";
  const modes = [
    { value: "set", label: "Set amount of hours" },
    { value: "range", label: "Range of hours" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {modes.map((opt) => {
          const active = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ mode: opt.value })}
              className={`flex items-center justify-between gap-2 rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"}`}
            >
              <span className="text-[15px] font-semibold text-gray-dark">{opt.label}</span>
              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${active ? "border-gray-dark" : "border-[#CFCFCF]"}`}>
                {active && <span className="h-2.5 w-2.5 rounded-full bg-gray-dark" />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mb-3 mt-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-gray-extra-light">
        {mode === "set" ? "Enter an amount of time" : "Enter a range of time"}
      </p>
      {mode === "set" ? (
        <div className="grid grid-cols-2 gap-4">
          <TimeField value={config.hours ?? ""} onChange={(v) => onChange({ hours: v })} label="hours" />
          <TimeField value={config.minutes ?? ""} onChange={(v) => onChange({ minutes: v })} label="minutes" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <TimeField value={config.minHours ?? ""} onChange={(v) => onChange({ minHours: v })} label="min hours" />
          <TimeField value={config.maxHours ?? ""} onChange={(v) => onChange({ maxHours: v })} label="max hours" />
        </div>
      )}
    </div>
  );
}

/* ---------- Step 3: Customer-facing page ---------- */

function PageStep({ name, headline, pricingMode, paidType, price, description, setDescription }: { name: string; headline: string; pricingMode: "free" | "paid"; paidType: "recurring" | "one-time"; price: string; description: string; setDescription: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-[22px] font-semibold text-gray-dark">Page</h2>
      <p className="mt-0.5 text-[15px] text-gray-light">Configure the customer-facing page for this product.</p>

      {/* Media dropzone */}
      <div className="mt-5 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[#F5F5F5] text-center">
        <MaskIcon src={uploadIcon} className="h-8 w-8 text-gray-dark" />
        <p className="text-[15px] font-semibold text-gray-dark">Add a video or photo</p>
        <p className="text-[14px] text-gray-light">Pages with videos convert 4x better.</p>
      </div>

      {/* Price + author bar */}
      <div className="mt-4 flex items-center rounded-xl border border-gray-stroke">
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <MaskIcon src={labelTagIcon} className="h-4 w-4 text-gray-light" />
          {pricingMode === "free" ? "Free" : `$${price}${paidType === "recurring" ? " / month" : ""}`}
        </div>
        <div className="h-6 w-px bg-gray-stroke" />
        <div className="flex flex-1 items-center justify-center gap-2 py-3 text-[15px] font-medium text-gray-dark">
          <img src={samanthaPhoto} alt="" className="h-5 w-5 rounded-full object-cover" />
          By Samantha Parker
        </div>
      </div>

      {/* Headline + description */}
      <h3 className="mt-8 text-[28px] font-semibold leading-tight text-gray-dark">
        {headline || <span className="text-[#B1B1B1]">Write a headline…</span>}
      </h3>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={6}
        placeholder="Describe what customers get with this product…"
        className="mt-3 w-full resize-none rounded-xl border border-gray-stroke bg-white px-3.5 py-3 text-[15px] leading-relaxed text-gray-dark outline-none placeholder:text-[#B1B1B1] focus:border-gray-dark"
      />

      <button className="mt-4 flex w-full items-center justify-between border-t border-gray-stroke pt-4 text-[15px] font-medium text-gray-dark">
        Add FAQ
        <svg className="h-[18px] w-[18px] text-gray-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <span className="sr-only">{name}</span>
    </div>
  );
}

/* ---------- Live preview card ---------- */

function ProductPreview({ name, headline, pricingMode, paidType, price, added, joinLabel }: { name: string; headline: string; pricingMode: "free" | "paid"; paidType: "recurring" | "one-time"; price: string; added: OfferingItem[]; joinLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img src={coverImage9} alt="" className="aspect-[1200/630] w-full object-cover opacity-25" />
      <div className="p-4">
        <p className="text-[17px] font-semibold leading-tight text-gray-dark">{name || "Product name"}</p>
        {headline ? (
          <p className="mt-1 text-[15px] leading-snug text-gray-light">{headline}</p>
        ) : (
          <p className="mt-1 text-[15px] leading-snug text-[#C4C4C4]">Your headline appears here</p>
        )}

        {added.length > 0 && (
          <div className="mt-3 flex flex-col gap-2.5 text-[15px] font-normal text-gray-light">
            {added.map((item) => {
              const o = offeringBySlug[item.slug];
              const label = item.slug === "coaching-time" && item.configured
                ? configSummary(item)
                : o.label;
              return (
                <div key={item.id} className="flex items-center gap-2.5">
                  <MaskIcon src={o.icon} className="h-[17px] w-[17px] shrink-0" />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {pricingMode === "paid" && (
          <p className="mt-3 text-[15px] font-semibold text-gray-dark">
            ${price} <span className="font-normal text-gray-light">{paidType === "recurring" ? "/ month" : "one-time"}</span>
          </p>
        )}

        <Button size="lg" variant="primary" rounded="rounded-full" className="mt-3 w-full text-[15px]">
          {joinLabel}
        </Button>
      </div>
    </div>
  );
}
