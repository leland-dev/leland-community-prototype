import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { RoundArrow, useCardCarousel, sectionTitle } from "./ProgramHub";
import {
  PageStep, ProductPreview, SingleProductSetupStep, SessionsSetupStep, V2Context,
  newPageSection, newCohort, defaultConfigFor, isConfigComplete, productListPrice,
  INCLUDED_SECTION_ID, CONTENT_LIBRARY,
  type PageSection, type PageSectionKind, type OfferingItem, type CollectionItem, type BuilderCohort,
} from "./CoachProductNew";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";
import storeIcon from "../assets/icons/store.svg";
import moneyIcon from "../assets/icons/money.svg";
import writeIcon from "../assets/icons/write.svg";
import eyeIcon from "../assets/icons/eye.svg";
import labelTagIcon from "../assets/icons/label-tag.svg";
import repostIcon from "../assets/icons/repost-2.svg";
import globeIcon from "../assets/icons/globe.svg";
import lockOutlineIcon from "../assets/icons/lock-outline.svg";
import stackIcon from "../assets/icons/stack.svg";
import layoutGridIcon from "../assets/icons/layout-grid.svg";
import aiIcon from "../assets/icons/ai.svg";

// Guided offering creation — an alternate to CoachProductTypeSelect + CoachProductNew.
//
// Instead of asking the coach to pick a product *type* (where "Bundle" and
// "Subscription" sit awkwardly next to the things they're made of), this flow
// asks what they want to *include*, and a persistent sidebar (styled like the
// My Leland nav) lists just the sections those pieces need, ending with the
// customer-facing page builder borrowed from the existing flow. Sections can be filled in any order, products can
// be added or removed at any point, and the offering can be published once every
// section is complete. Bundle vs. single product and one-time vs. subscription
// fall out of the answers rather than being chosen up front.

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Completed-section checkmarks in the section nav — hidden for now.
const SHOW_NAV_CHECKS = false;

const CATEGORY_NAMES: Record<string, string> = {
  "product-management": "Product Management",
  "management-consulting": "Management Consulting",
  mba: "MBA",
  college: "College",
};

type ComponentId = "coaching" | "content" | "collection" | "live" | "course";
type SectionId = "select" | ComponentId | "price" | "details" | "page";

// Tabs every offering has; product tabs live in their own sidebar module.
const FIXED_SECTIONS: SectionId[] = ["select", "price", "details", "page"];

const SECTION_ICONS: Record<SectionId, string> = {
  select: storeIcon,
  coaching: hourglassIcon,
  content: bookOpenIcon,
  collection: stackIcon,
  live: videoIcon,
  course: myCoursesIcon,
  price: moneyIcon,
  details: writeIcon,
  page: eyeIcon,
};

const SECTION_LABELS: Record<SectionId, string> = {
  select: "Select products",
  coaching: "1:1 coaching",
  content: "Content",
  collection: "Collection",
  live: "Live sessions",
  course: "Course",
  price: "Pricing",
  details: "Name & headline",
  page: "Customer page",
};

const COMPONENTS: { id: ComponentId; name: string; blurb: string; icon: string; ready: boolean }[] = [
  { id: "coaching", name: "1:1 coaching", blurb: "Live time with you, sold by the hour.", icon: hourglassIcon, ready: true },
  { id: "content", name: "Content", blurb: "A guide, template, video, or other resource.", icon: bookOpenIcon, ready: true },
  { id: "collection", name: "Collection", blurb: "Several resources bundled together.", icon: stackIcon, ready: true },
  { id: "live", name: "Live sessions", blurb: "A workshop, or a series of sessions you teach to a group.", icon: videoIcon, ready: true },
  { id: "course", name: "Course", blurb: "A structured, multi-lesson course.", icon: myCoursesIcon, ready: true },
];

type Course = { id: number; title: string; lessons: number; price: number };
const COURSES: Course[] = [
  { id: 1, title: "The Complete Application Playbook", lessons: 12, price: 299 },
  { id: 2, title: "Interview Mastery", lessons: 8, price: 199 },
];
const NEW_COURSE = 0;

// The products configured with the existing builder's own setup UI. Each is an
// OfferingItem in that builder's shape, keyed by the builder's product slug.
type ProductId = "coaching" | "content" | "collection";
const PRODUCT_SLUGS: Record<ProductId, string> = { coaching: "coaching-time", content: "content", collection: "collection" };
const PRODUCT_IDS: Record<ProductId, number> = { coaching: 1, content: 2, collection: 3 };
const isProductId = (id: string): id is ProductId => id in PRODUCT_SLUGS;
const blankProduct = (id: ProductId): OfferingItem => ({ id: PRODUCT_IDS[id], slug: PRODUCT_SLUGS[id], config: defaultConfigFor(PRODUCT_SLUGS[id]), configured: false });
const blankProducts = (): Record<ProductId, OfferingItem> => ({ coaching: blankProduct("coaching"), content: blankProduct("content"), collection: blankProduct("collection") });
// Live sessions are workshops in the builder's shape; ids start high so they never collide with products.
const FIRST_SESSION_ID = 100;
const blankSession = (id: number, name = ""): OfferingItem => ({ id, slug: "workshop", config: { ...defaultConfigFor("workshop"), name }, configured: false });
// A library item reused inside the builder's content config.
const reuseConfig = (i: number): Record<string, string> => {
  const c = CONTENT_LIBRARY[i % CONTENT_LIBRARY.length];
  return { ...defaultConfigFor("content"), source: "reuse", libraryId: c.id, r_assetName: c.name, r_title: c.title, r_description: c.description, r_resourceType: c.resourceType, price: c.price.toFixed(2) };
};

type Template = {
  id: string;
  name: string;
  summary: string;
  components: ComponentId[];
  hours?: number;
  // Number of library resources: one fills Content, several fill a Collection.
  resources?: number;
  collectionTitle?: string;
  sessions?: string[];
  courseId?: number;
  billing: "one-time" | "recurring";
  price: string;
  headline: string;
};

const TEMPLATES: Template[] = [
  {
    id: "bootcamp",
    name: "Application Bootcamp",
    summary: "10 hrs coaching · 3 resources · 4 live sessions",
    components: ["coaching", "collection", "live"],
    hours: 10,
    resources: 3,
    collectionTitle: "Application toolkit",
    sessions: ["Kickoff & strategy", "Essay workshop", "Interview prep", "Final review"],
    billing: "one-time",
    price: "1500",
    headline: "Everything you need to go from first draft to submitted.",
  },
  {
    id: "membership",
    name: "Monthly Membership",
    summary: "Group office hours · resource library · billed monthly",
    components: ["collection", "live"],
    resources: 4,
    collectionTitle: "Member library",
    sessions: ["Monthly office hours", "Monthly AMA"],
    billing: "recurring",
    price: "79",
    headline: "Ongoing access to my resources and live group sessions.",
  },
  {
    id: "review-sprint",
    name: "Essay Review Sprint",
    summary: "3 hrs coaching · essay guide",
    components: ["coaching", "content"],
    hours: 3,
    resources: 1,
    billing: "one-time",
    price: "425",
    headline: "Fast, focused feedback on your essays.",
  },
  {
    id: "course-coaching",
    name: "Course + Coaching",
    summary: "Self-paced course · 2 hrs coaching",
    components: ["coaching", "course"],
    hours: 2,
    courseId: 1,
    billing: "one-time",
    price: "549",
    headline: "Learn at your own pace, with 1:1 help when you need it.",
  },
  {
    id: "workshop",
    name: "One-off Workshop",
    summary: "A single paid live session",
    components: ["live"],
    sessions: ["Workshop"],
    billing: "one-time",
    price: "50",
    headline: "A live, interactive group workshop.",
  },
];

const money = (n: number) => `$${n.toLocaleString()}`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
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

// Checkbox (multi) or radio (single) indicator for a choice card.
function Mark({ active, multi }: { active: boolean; multi: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors ${multi ? "rounded-md" : "rounded-full"} ${active ? "border-[1.5px] border-gray-dark bg-gray-dark" : "border-[1.5px] border-gray-stroke bg-white"}`}
    >
      {active &&
        (multi ? (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
    </span>
  );
}

// A selectable card — the whole card is the control, so this is a card, not a button.
// `large` is the product-picker treatment: bigger icon and 15px description.
function ChoiceCard({ active, multi = false, disabled = false, large = false, icon, title, desc, tag, onClick }: { active: boolean; multi?: boolean; disabled?: boolean; large?: boolean; icon?: string; title: string; desc?: string; tag?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-2xl border-[1.5px] p-4 text-left transition-colors ${disabled ? "cursor-default border-transparent bg-gray-hover" : active ? "border-gray-dark bg-white" : "border-gray-stroke bg-white hover:border-[#c9c9c9]"}`}
    >
      {icon && (
        <span className={`flex ${large ? "h-12 w-12" : "h-11 w-11"} shrink-0 items-center justify-center rounded-xl ${disabled ? "bg-white text-gray-extra-light" : "bg-gray-hover text-gray-dark"}`}>
          <MaskIcon src={icon} className={large ? "h-[26px] w-[26px]" : "h-[22px] w-[22px]"} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block text-[16px] font-semibold ${disabled ? "text-gray-extra-light" : "text-gray-dark"}`}>{title}</span>
        {desc && <span className={`mt-0.5 block ${large ? "text-[15px]" : "text-[14px]"} leading-snug ${disabled ? "text-gray-extra-light" : "text-gray-light"}`}>{desc}</span>}
      </span>
      {tag ? (
        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-gray-light">{tag}</span>
      ) : (
        <Mark active={active} multi={multi} />
      )}
    </button>
  );
}

// Horizontal either/or toggle — the icon-over-label cards used across the
// existing builder (e.g. "Choose a time format" in Configure coaching time).
// A `locked` option is dimmed and unclickable; its reason shows as a tooltip on
// hover and as a note under the toggle.
type ToggleOption<T extends string> = { value: T; label: string; sub: string; icon: string; locked?: string };
function ToggleCards<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: ToggleOption<T>[]; label: string }) {
  const lockedOption = options.find((o) => o.locked);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const active = value === opt.value;
          const disabled = !!opt.locked;
          return (
            <div key={opt.value} className="group relative">
              <button
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                onClick={() => onChange(opt.value)}
                className={`flex h-full w-full flex-col items-center gap-2 rounded-xl border-[1.5px] bg-white px-4 py-5 text-center transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"} ${disabled ? "pointer-events-none cursor-not-allowed opacity-40" : ""}`}
              >
                <MaskIcon src={opt.icon} className="h-[26px] w-[26px] text-gray-dark" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-gray-dark">{opt.label}</span>
                  <span className="text-[14px] leading-snug text-gray-light">{opt.sub}</span>
                </span>
              </button>
              {disabled && (
                <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-gray-dark px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-[0_4px_16px_rgba(16,24,40,0.18)] group-hover:block">
                  {opt.locked}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {lockedOption && (
        <p className="mt-2.5 flex items-start gap-2 text-[13px] leading-snug text-gray-light">
          <MaskIcon src={lockOutlineIcon} className="mt-px h-4 w-4 shrink-0" />
          {lockedOption.locked}
        </p>
      )}
    </div>
  );
}

// Template carousel — mirrors RecommendedBuilds ("Your next build") on the
// program hub: bordered card, serif title, a paged row of thumbnail cards with
// floating arrows. Cards use the hub's gradient "skill" thumbnail, badged with
// the icon of each component the template includes.
const TEMPLATE_GRADIENTS = [
  "bg-gradient-to-tr from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-r from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-tr from-leland-slate/20 via-leland-tan-light to-leland-yellow/35",
];

function TemplateCarousel({ onPick }: { onPick: (t: Template) => void }) {
  const carousel = useCardCarousel(TEMPLATES);
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
      <p className={sectionTitle}>Start from a template</p>
      <div className="relative">
        <div ref={carousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className="w-[240px] shrink-0 sm:w-[calc((100%-20px)/2)]">
              <button type="button" onClick={() => onPick(t)} className="group block w-full min-w-[200px] cursor-pointer overflow-hidden text-left">
                <div className="aspect-[120/63] w-full overflow-hidden rounded-lg border border-gray-stroke bg-gray-hover">
                  <div className={`flex h-full w-full items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-[1.02] ${TEMPLATE_GRADIENTS[i % TEMPLATE_GRADIENTS.length]}`}>
                    {COMPONENTS.filter((c) => t.components.includes(c.id)).map((c) => (
                      <span key={c.id} className="flex size-8 items-center justify-center rounded-full bg-white text-gray-dark shadow-md">
                        <MaskIcon src={c.icon} className="size-[18px]" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pt-2">
                  <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{t.name}</p>
                  <span className="truncate text-[12px] text-gray-light">{t.summary}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
        {carousel.page > 0 ? (
          <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="left" floating onClick={() => carousel.scrollByPage(-1)} />
          </div>
        ) : null}
        {carousel.page < carousel.pages - 1 ? (
          <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="right" floating onClick={() => carousel.scrollByPage(1)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark";

function Question({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.06em] text-gray-extra-light">{eyebrow}</p>}
      <h1 className="text-[26px] font-semibold leading-tight text-gray-dark">{title}</h1>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-gray-light">{sub}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[15px] font-semibold text-gray-dark">{label}</p>
      {hint && <p className="mt-1 text-[14px] leading-relaxed text-gray-light">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function CoachOfferingGuided() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const categoryName = CATEGORY_NAMES[category ?? ""] ?? "your category";

  const [view, setView] = useState<SectionId>("select");
  // Sections the coach has been through. Leaving a section marks it visited; it
  // counts as complete once it's visited *and* its fields are filled in.
  const [confirmed, setConfirmed] = useState<SectionId[]>([]);
  // Set when Publish is pressed with sections still incomplete — only then do
  // the unfinished ones get flagged in the sidebar.
  const [publishAttempted, setPublishAttempted] = useState(false);
  const [done, setDone] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const [selected, setSelected] = useState<ComponentId[]>([]);
  // Coaching, content and collection — configured by the existing builder's setup step.
  const [products, setProducts] = useState<Record<ProductId, OfferingItem>>(blankProducts);
  // Live sessions — the existing builder's sessions step (sessions + the cohorts that date them).
  const [sessionMode, setSessionMode] = useState<"single" | "multi">("single");
  const [sessions, setSessions] = useState<OfferingItem[]>(() => [blankSession(FIRST_SESSION_ID)]);
  const [cohorts, setCohorts] = useState<BuilderCohort[]>(() => [newCohort(0)]);
  const [multiCohorts, setMultiCohorts] = useState(false);
  const [activeCohortId, setActiveCohortId] = useState(0);
  const nextSessionId = useRef(FIRST_SESSION_ID + 1);
  const nextCohortId = useRef(1);
  const [courseId, setCourseId] = useState<number>(COURSES[0].id);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [billingChoice, setBillingChoice] = useState<"one-time" | "recurring">("one-time");
  const [price, setPrice] = useState("");
  const [annual, setAnnual] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  // Customer-facing page — same state shape as the existing builder's Page step.
  const [description, setDescription] = useState("");
  const [pageSections, setPageSections] = useState<PageSection[]>(() => [newPageSection("included", INCLUDED_SECTION_ID)]);
  const nextPageSectionId = useRef(0);

  useEffect(() => {
    document.title = "Leland Prototype | New offering (guided)";
  }, []);

  const has = (id: ComponentId) => selected.includes(id);
  // A subscription and range-of-hours coaching are mutually exclusive: whichever
  // is chosen first locks the other. The coaching setup locks its own "Range of
  // hours" option under a subscription; here we lock "Subscription" under a range.
  const recurring = billingChoice === "recurring";
  const coachingIsRange = products.coaching.config.mode === "range";
  const subscriptionLocked = !recurring && has("coaching") && coachingIsRange;
  const patchProduct = (id: number, change: (item: OfferingItem) => OfferingItem) => {
    setProducts((ps) => {
      const key = (Object.keys(ps) as ProductId[]).find((k) => ps[k].id === id);
      return key ? { ...ps, [key]: change(ps[key]) } : ps;
    });
    setSessions((ss) => (ss.some((x) => x.id === id) ? ss.map((x) => (x.id === id ? change(x) : x)) : ss));
  };
  const onConfigChange = (id: number, patch: Record<string, string>) => patchProduct(id, (it) => ({ ...it, config: { ...it.config, ...patch } }));
  const onItemsChange = (id: number, items: CollectionItem[]) => patchProduct(id, (it) => ({ ...it, items }));
  const onConfigured = (id: number) => patchProduct(id, (it) => (it.configured ? it : { ...it, configured: true }));
  const chooseSubscription = () => {
    if (coachingIsRange) onConfigChange(products.coaching.id, { mode: "set" });
    setBillingChoice("recurring");
  };
  const course = COURSES.find((c) => c.id === courseId);
  const courseTitle = course ? course.title : newCourseTitle.trim() || "New course";

  // The sidebar: only the sections that apply to what was picked.
  // Pricing (billing model + price) comes after the products it's priced from.
  const sections = useMemo<SectionId[]>(() => {
    // The fixed tabs, then one per selected product (the "Configure products" module below them).
    return [...FIXED_SECTIONS, ...COMPONENTS.filter((c) => selected.includes(c.id)).map((c) => c.id)];
  }, [selected]);

  // What the answers add up to — the label the old flow made coaches choose first.
  const offeringType = recurring
    ? "Subscription"
    : selected.length > 1
      ? "Bundle"
      : has("coaching")
        ? "Hourly coaching"
        : has("content")
          ? "Content"
          : has("collection")
            ? "Collection"
            : has("live")
              ? sessionMode === "multi" ? "Program" : "Workshop"
            : has("course")
              ? "Course"
              : "Offering";

  // What each selected product would cost separately — the builder's own per-product
  // list prices. Live sessions carry no price of their own; they're priced with the offering.
  const productValue = (id: ProductId) => productListPrice({ ...products[id], configured: true });
  const valueLines = [
    ...(Object.keys(PRODUCT_SLUGS) as ProductId[]).filter(has).map((id) => ({ label: SECTION_LABELS[id], value: productValue(id) })),
    ...(has("course") && course ? [{ label: course.title, value: course.price }] : []),
  ];
  const fixedValue = valueLines.reduce((sum, l) => sum + l.value, 0);
  const effectivePrice = price !== "" ? Number(price) : fixedValue;
  const savings = !recurring && fixedValue > 0 && effectivePrice < fixedValue ? Math.round((1 - effectivePrice / fixedValue) * 100) : 0;

  const suggestedName = `${categoryName} ${offeringType === "Offering" ? "Offering" : offeringType}`;

  const priceLabel = `${money(effectivePrice)}${recurring ? "/mo" : ""}`;

  const isValid = (id: SectionId) => {
    switch (id) {
      case "select": return selected.length > 0;
      case "page": return true;
      case "coaching":
      case "content":
      case "collection": return isConfigComplete(products[id], true);
      case "live": return sessionMode === "single" || sessions.every((s) => s.config.name.trim() !== "");
      case "course": return courseId !== NEW_COURSE || newCourseTitle.trim() !== "";
      case "price": return effectivePrice > 0;
      case "details": return name.trim() !== "";
    }
  };
  const isComplete = (id: SectionId, saved: SectionId[] = confirmed) => saved.includes(id) && isValid(id);

  const withCurrent = (saved: SectionId[]) => (saved.includes(view) ? saved : [...saved, view]);
  // Moving anywhere marks the section being left as visited.
  const openSection = (id: SectionId) => {
    if (id === view) return;
    if (id === "details" && name.trim() === "") setName(suggestedName);
    setConfirmed(withCurrent);
    setView(id);
  };
  // First unfinished section after `from` (wrapping round), if any.
  const nextIncomplete = (saved: SectionId[], from: number) =>
    [...sections.slice(from + 1), ...sections.slice(0, from + 1)].find((s) => !isComplete(s, saved));

  // Back / Next step through the tabs in sidebar order.
  const viewIndex = sections.indexOf(view);
  const isLast = viewIndex === sections.length - 1;
  const goBack = () => { if (viewIndex > 0) openSection(sections[viewIndex - 1]); };
  const goNext = () => { if (!isLast) openSection(sections[viewIndex + 1]); };
  // The section on screen counts as visited for publishing purposes.
  const readyToPublish = sections.every((s) => isComplete(s, withCurrent(confirmed)));
  const publish = () => {
    if (readyToPublish) { setDone(true); return; }
    const saved = withCurrent(confirmed);
    setConfirmed(saved);
    setPublishAttempted(true);
    const target = nextIncomplete(saved, -1);
    if (target && target !== view) {
      if (target === "details" && name.trim() === "") setName(suggestedName);
      setView(target);
    }
  };
  const close = () => navigate(`/my-leland/manage/${category}`);

  // Enter moves to the next section (unless focus is on a control that uses Enter itself).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Only on the short tabs — the product and page builders have their own fields and modals.
      if (e.key !== "Enter" || done || !(view === "select" || view === "price" || view === "details")) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "TEXTAREA" || tag === "SELECT" || tag === "A") return;
      e.preventDefault();
      goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toggleComponent = (id: ComponentId) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : COMPONENTS.filter((c) => c.id === id || s.includes(c.id)).map((c) => c.id)));
  // Live sessions: session and cohort handlers for the builder's sessions step.
  const addSession = () => setSessions((ss) => [...ss, blankSession(nextSessionId.current++)]);
  const removeSession = (id: number) => setSessions((ss) => ss.filter((x) => x.id !== id));
  const toggleMultiCohorts = () => {
    if (multiCohorts) {
      setCohorts((cs) => cs.slice(0, 1));
      setActiveCohortId(cohorts[0]?.id ?? 0);
    }
    setMultiCohorts((m) => !m);
  };
  const addCohort = () => setCohorts((cs) => [...cs, newCohort(nextCohortId.current++)]);
  const removeCohort = (id: number) => setCohorts((cs) => cs.filter((c) => c.id !== id));
  const updateCohort = (id: number, patch: Partial<BuilderCohort>) => setCohorts((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const pagePrice = effectivePrice.toLocaleString();
  const addPageSection = (kind: PageSectionKind) => setPageSections((s) => [...s, newPageSection(kind, nextPageSectionId.current++)]);
  const removePageSection = (id: number) => { if (id !== INCLUDED_SECTION_ID) setPageSections((s) => s.filter((sec) => sec.id !== id)); };
  const updatePageSection = (next: PageSection) => setPageSections((s) => s.map((sec) => (sec.id === next.id ? next : sec)));

  // A template fills in and saves every section except the customer page, which opens next.
  const applyTemplate = (t: Template) => {
    setSelected(t.components);
    const next = blankProducts();
    if (t.hours) next.coaching = { ...next.coaching, configured: true, config: { ...next.coaching.config, mode: "set", hours: String(t.hours), minutes: "0", delivery: "live", priceMode: "sync" } };
    const resources = Array.from({ length: t.resources ?? 0 }, (_, i) => reuseConfig(i));
    if (t.components.includes("content") && resources[0]) next.content = { ...next.content, configured: true, config: resources[0] };
    if (t.components.includes("collection")) {
      next.collection = {
        ...next.collection,
        configured: true,
        config: { ...next.collection.config, title: t.collectionTitle ?? "Resources", price: resources.reduce((sum, c) => sum + Number(c.price), 0).toFixed(2) },
        items: resources.map((config, i) => ({ id: i + 1, config })),
      };
    }
    setProducts(next);
    const titles = t.sessions ?? [""];
    setSessionMode(titles.length > 1 ? "multi" : "single");
    setSessions(titles.map((title, i) => ({ ...blankSession(FIRST_SESSION_ID + i, title), configured: true })));
    nextSessionId.current = FIRST_SESSION_ID + titles.length;
    setCohorts([newCohort(0)]); setMultiCohorts(false); setActiveCohortId(0);
    setCourseId(t.courseId ?? COURSES[0].id);
    setBillingChoice(t.billing);
    setPrice(t.price);
    setAnnual(false);
    setName(t.name);
    setHeadline(t.headline);
    setConfirmed(["select", ...t.components, "price", "details"]);
    setView("page");
  };

  const reset = () => {
    setSelected([]); setProducts(blankProducts());
    setSessionMode("single"); setSessions([blankSession(FIRST_SESSION_ID)]); nextSessionId.current = FIRST_SESSION_ID + 1;
    setCohorts([newCohort(0)]); setMultiCohorts(false); setActiveCohortId(0);
    setCourseId(COURSES[0].id); setNewCourseTitle("");
    setBillingChoice("one-time"); setPrice(""); setAnnual(false); setName(""); setHeadline("");
    setVisibility("public"); setDescription(""); setPageSections([newPageSection("included", INCLUDED_SECTION_ID)]);
    setDone(false); setConfirmed([]); setPublishAttempted(false); setView("select");
  };

  const renderSection = () => {
    switch (view) {
      case "select":
        return (
          <Question title="Select products" sub={`Choose everything you want to include in this offering for ${categoryName}. Each product adds its own section to the sidebar.`}>
            <div className="mb-5 flex flex-wrap gap-2">
              <Button size="md" variant="secondary" rounded="rounded-full" className="gap-2 font-semibold" onClick={() => setShowTemplates((v) => !v)}>
                <MaskIcon src={layoutGridIcon} className="h-[18px] w-[18px]" />
                Start from a template
              </Button>
              <Button size="md" variant="secondary" rounded="rounded-full" className="gap-2 font-semibold">
                <MaskIcon src={aiIcon} className="h-[18px] w-[18px]" />
                Build with an agent
              </Button>
            </div>
            {showTemplates && (
              <div className="mb-6">
                <TemplateCarousel onPick={applyTemplate} />
              </div>
            )}
            <div className="grid gap-3">
              {COMPONENTS.map((c) => (
                <ChoiceCard key={c.id} multi large icon={c.icon} title={c.name} desc={c.blurb} active={has(c.id)} disabled={!c.ready} tag={c.ready ? undefined : "Coming soon"} onClick={() => toggleComponent(c.id)} />
              ))}
            </div>
          </Question>
        );

      // Coaching, content and collection use the existing builder's setup step as-is
      // (it renders its own heading, and opens the collection modal itself).
      case "coaching":
      case "content":
      case "collection":
        return (
          <SingleProductSetupStep
            key={view}
            item={products[view]}
            billingModel={billingChoice}
            showCoachingDeliveryExpiration
            onConfigChange={onConfigChange}
            onItemsChange={onItemsChange}
            onConfigured={onConfigured}
          />
        );

      // Live sessions use the existing builder's sessions step (single vs. multiple, cohorts, dates).
      case "live":
        return (
          <SessionsSetupStep
            mode={sessionMode}
            onChangeMode={setSessionMode}
            sessions={sessions}
            cohorts={cohorts}
            multiCohorts={multiCohorts}
            onToggleMultiCohorts={toggleMultiCohorts}
            activeCohortId={activeCohortId}
            onSelectCohort={setActiveCohortId}
            onAddSession={addSession}
            onRemoveSession={removeSession}
            onConfigChange={onConfigChange}
            onConfigured={onConfigured}
            onAddCohort={addCohort}
            onRemoveCohort={removeCohort}
            onUpdateCohort={updateCohort}
          />
        );

      case "course":
        return (
          <Question title="Course" sub="Pick one you've already built, or start a new one.">
            <div className="grid gap-3" role="radiogroup">
              {COURSES.map((c) => (
                <ChoiceCard key={c.id} title={c.title} desc={`${plural(c.lessons, "lesson")} · ${money(c.price)}`} active={courseId === c.id} onClick={() => setCourseId(c.id)} />
              ))}
              <ChoiceCard title="A new course" desc="Name it now and build the lessons after you publish." active={courseId === NEW_COURSE} onClick={() => setCourseId(NEW_COURSE)} />
            </div>
            {courseId === NEW_COURSE && (
              <input autoFocus value={newCourseTitle} maxLength={80} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Course title" aria-label="Course title" className={`mt-3 ${INPUT}`} />
            )}
          </Question>
        );

      case "price":
        return (
          <Question title="Pricing" sub="How clients pay, and how much.">
            <Field label="Is this a one-time purchase or a subscription?">
              <ToggleCards
                label="Is this a one-time purchase or a subscription?"
                value={billingChoice}
                onChange={(v) => (v === "recurring" ? chooseSubscription() : setBillingChoice("one-time"))}
                options={[
                  { value: "one-time", label: "One-time purchase", sub: "Clients pay once", icon: labelTagIcon },
                  { value: "recurring", label: "Subscription", sub: "Clients pay monthly", icon: repostIcon, locked: subscriptionLocked ? "A subscription isn't available with a range of coaching hours. Switch 1:1 coaching to a set amount of hours to unlock it." : undefined },
                ]}
              />
            </Field>
            <div className="mt-8">
              <Field label={recurring ? "Monthly price" : "Price"}>
                <div className="flex items-center rounded-lg border border-gray-stroke bg-white px-4 transition-colors focus-within:border-gray-dark">
                  <span className="text-[20px] text-gray-light">$</span>
                  <input
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder={String(fixedValue)}
                    aria-label="Price"
                    className="w-full bg-transparent py-3.5 pl-2 text-[20px] font-semibold text-gray-dark outline-none placeholder:font-normal placeholder:text-[#B1B1B1]"
                  />
                  {recurring && <span className="shrink-0 text-[15px] text-gray-light">/ month</span>}
                </div>
                {fixedValue > 0 && (
                  <div className="mt-3 rounded-xl bg-gray-hover p-4 text-[14px] text-gray-light">
                    <p>
                      <span className="font-semibold text-gray-dark">{money(fixedValue)}</span> is what these would cost separately{recurring ? " each month" : ""}
                      {price === "" ? " — we'll use that unless you enter your own." : savings > 0 ? ` — clients save ${savings}%.` : "."}
                    </p>
                    <ul className="mt-2 grid gap-1">
                      {valueLines.map((l) => <li key={l.label}>{l.label} = {money(l.value)}</li>)}
                      {has("live") && <li>Live sessions — included in the offering price</li>}
                      {has("course") && !course && <li>{courseTitle} — new, not priced yet</li>}
                    </ul>
                  </div>
                )}
                {recurring && (
                  <div className="mt-3">
                    <ChoiceCard multi title="Also offer annual billing" desc={`Members can pay ${money(Math.round(effectivePrice * 12 * 0.8))}/yr — 20% off.`} active={annual} onClick={() => setAnnual((a) => !a)} />
                  </div>
                )}
              </Field>
            </div>
          </Question>
        );

      case "page":
        return (
          <PageStep
            name={name}
            headline={headline}
            pricingMode="paid"
            paidType={recurring ? "recurring" : "one-time"}
            interval="1 month"
            price={pagePrice}
            description={description}
            setDescription={setDescription}
            sections={pageSections}
            onAddSection={addPageSection}
            onUpdateSection={updatePageSection}
            onRemoveSection={removePageSection}
            onReorderSections={setPageSections}
          />
        );

      case "details":
        return (
          <Question title="Name & headline" sub="This is what clients see on your profile.">
            <label className="mb-2 block text-[14px] font-semibold text-gray-dark" htmlFor="guided-name">Name</label>
            <input id="guided-name" autoFocus value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder={suggestedName} className={INPUT} />
            <label className="mb-2 mt-5 block text-[14px] font-semibold text-gray-dark" htmlFor="guided-headline">Headline <span className="font-normal text-gray-extra-light">(optional)</span></label>
            <input id="guided-headline" value={headline} maxLength={120} onChange={(e) => setHeadline(e.target.value)} placeholder="One line on who it's for and what they get" className={INPUT} />
            <p className="mb-2.5 mt-5 text-[14px] font-semibold text-gray-dark">Visibility</p>
            <ToggleCards
              label="Visibility"
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "public", label: "Public", sub: "Appears in search and on your profile", icon: globeIcon },
                { value: "private", label: "Private", sub: "Only reachable with a direct link", icon: lockOutlineIcon },
              ]}
            />
          </Question>
        );
    }
  };

  // One sidebar row. Rows animate open/closed as products are added and removed.
  const navRow = (id: SectionId) => {
    const active = view === id;
    const complete = isComplete(id);
    const needsFix = publishAttempted && !complete;
    return (
      <motion.div
        key={id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="overflow-hidden [&:not(:first-child)]:pt-1"
      >
      <button
        type="button"
        aria-current={active ? "step" : undefined}
        onClick={() => openSection(id)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-left text-[15px] transition-colors ${active ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"}`}
      >
        <MaskIcon src={SECTION_ICONS[id]} className="h-[22px] w-[22px] shrink-0" />
        <span className="min-w-0 flex-1 truncate">{SECTION_LABELS[id]}</span>
        {SHOW_NAV_CHECKS && complete && (
          <span aria-label="Complete" className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#DDF3E4]">
            <svg className="h-2.5 w-2.5 text-[#15803D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </span>
        )}
        {needsFix && <span aria-label="Needs attention" className="h-2 w-2 shrink-0 rounded-full bg-[#F3392C]" />}
      </button>
      </motion.div>
    );
  };

  const productSections = sections.filter((id) => !FIXED_SECTIONS.includes(id));
  const NAV_CARD = "rounded-[12px] border border-[#222222]/[0.12] bg-white shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]";

  // Back to the category page + title — sits above the sidebar (and above the tab strip on small screens).
  const titleBar = (
    <div className="flex items-center gap-2.5 px-1">
      <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label={`Back to ${categoryName}`}>
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </Button>
      <span className="text-[17px] font-semibold text-gray-dark">New offering</span>
    </div>
  );

  return (
    // The existing builder's components read this context; "v2" is that builder's current default.
    <V2Context.Provider value={true}>
    <div className="flex min-h-screen flex-col bg-white">
      {done ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <img src={checkmarkFilledIcon} alt="" className="h-12 w-12" />
          <h1 className="mt-5 text-[26px] font-semibold text-gray-dark">{name || suggestedName} is published</h1>
          <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-gray-light">
            We set it up as a {offeringType.toLowerCase()} at {priceLabel}. It's now on your {categoryName} page.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" variant="primary" rounded="rounded-full" onClick={close}>Go to {categoryName}</Button>
            <Button size="lg" variant="secondary" rounded="rounded-full" onClick={reset}>Create another</Button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-1">
          {/* Persistent section nav — same floating-card treatment as the My Leland sidebar,
              with a checkmark on the right of each completed section. */}
          <aside className="hidden w-[264px] shrink-0 md:block">
            <div className="sticky top-0 flex flex-col gap-4 px-4 pb-4 pt-5">
              {titleBar}
              <div className={`shrink-0 p-2 ${NAV_CARD}`}>
                <nav aria-label="Offering sections" className="flex flex-col">
                  <AnimatePresence initial={false}>{FIXED_SECTIONS.map(navRow)}</AnimatePresence>
                </nav>
              </div>

              {/* Product tabs get their own module with a header, like "Expert tools" on My Leland.
                  It slides in with the first product and out with the last. */}
              <AnimatePresence initial={false}>
                {productSections.length > 0 && (
                  <motion.div
                    key="products"
                    initial={{ height: 0, opacity: 0, marginTop: -16 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                    exit={{ height: 0, opacity: 0, marginTop: -16 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="-mx-2 -mb-2 shrink-0 overflow-hidden px-2 pb-2"
                  >
                    <div className={`overflow-hidden ${NAV_CARD}`}>
                      <p className="bg-gray-hover px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Configure products</p>
                      <nav aria-label="Configure products" className="flex flex-col p-2">
                        <AnimatePresence initial={false}>{productSections.map(navRow)}</AnimatePresence>
                      </nav>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button size="lg" variant="primary" rounded="rounded-full" className="w-full font-semibold" onClick={publish}>Publish</Button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:py-12">
            {/* The customer page mirrors the existing builder: wider column plus the live preview card on the right. */}
            <div className={`mx-auto w-full ${view === "page" ? "max-w-[1080px]" : isProductId(view) || view === "live" ? "max-w-[660px]" : "max-w-[560px]"}`}>
              {/* Small screens: the title and the same nav as a scrollable strip. */}
              <div className="mb-4 md:hidden">{titleBar}</div>
              <div className="mb-7 flex gap-2 overflow-x-auto [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
                {sections.map((id) => (
                  <Button key={id} size="tag" variant={view === id ? "dark" : "outline"} rounded="rounded-full" className="shrink-0" onClick={() => openSection(id)}>
                    {SECTION_LABELS[id]}
                    {SHOW_NAV_CHECKS && isComplete(id) && <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                  </Button>
                ))}
              </div>

              <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
              <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22, ease: EASE }}>
                  {renderSection()}
                </motion.div>
              </AnimatePresence>

              {/* Step controls: Back on the left, Next on the right. Publish lives under the sidebar; on small
                  screens, where the sidebar is hidden, it takes Next's place on the last tab. */}
              <div className="mt-10 flex items-center justify-between gap-3">
                {viewIndex > 0 ? (
                  <Button size="lg" variant="secondary" className="font-semibold" onClick={goBack}>Back</Button>
                ) : (
                  <span />
                )}
                {isLast ? (
                  <Button size="lg" variant="primary" className="font-semibold md:hidden" onClick={publish}>Publish</Button>
                ) : (
                  <Button size="lg" variant="dark" className="font-semibold" onClick={goNext}>Next</Button>
                )}
              </div>
              </div>
              {view === "page" && (
                <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease: EASE }} className="w-full xl:sticky xl:top-12 xl:h-fit xl:w-[320px] xl:shrink-0">
                  <ProductPreview
                    name={name}
                    headline={headline}
                    pricingMode="paid"
                    paidType={recurring ? "recurring" : "one-time"}
                    interval="1 month"
                    price={String(effectivePrice)}
                    cover={null}
                    multiOption={false}
                    joinLabel="Purchase"
                  />
                </motion.aside>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </V2Context.Provider>
  );
}
