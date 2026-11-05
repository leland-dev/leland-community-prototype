import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { Button } from "../components/Button";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import stackIcon from "../assets/icons/stack.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import lteSignalIcon from "../assets/icons/lte-signal.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";
import packageBoxOpenIcon from "../assets/icons/package-box-open.svg";
import repostIcon from "../assets/icons/repost-2.svg";

// Entrance animation — the left column fades its blocks up in sequence, with the
// type-card grid staggering its cards; the right preview scales in alongside.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const pageContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};
const cardStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// Mask-tinted icon so it follows the surrounding text color (bg-current).
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

// The kinds of product a coach can create. Only "package" has a builder today;
// the rest are selectable but not yet wired to a creation flow.
type ProductType = {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  description: string;
  features: string[];
  ready: boolean;
};

const PRODUCT_TYPES: ProductType[] = [
  {
    id: "hourly",
    name: "Hourly coaching",
    icon: hourglassIcon,
    blurb: "Sell one-on-one time by the hour.",
    description: "Offer direct 1:1 time, priced from your hourly rate. Clients book and you meet live — the simplest way to start coaching.",
    features: ["1:1 live sessions", "Priced from your hourly rate", "Set or ranged hours", "Flexible booking"],
    ready: true,
  },
  {
    id: "async",
    name: "Content",
    icon: bookOpenIcon,
    blurb: "Content, courses, and collections.",
    description: "Share self-serve resources clients work through on their own time — guides and templates, multi-lesson courses, and curated collections.",
    features: ["Guides & templates", "Multi-lesson courses", "Resource collections", "Downloadable files"],
    ready: true,
  },
  {
    id: "collection",
    name: "Collection",
    icon: stackIcon,
    blurb: "A curated set of resources.",
    description: "Bundle related guides, templates, and videos into one collection clients can work through together.",
    features: ["Group related content", "Curated set of resources", "One price", "Downloadable files"],
    ready: true,
  },
  {
    id: "course",
    name: "Course",
    icon: myCoursesIcon,
    blurb: "A structured, multi-lesson course.",
    description: "Build a structured course with lessons and sections clients progress through at their own pace.",
    features: ["Multi-lesson structure", "Organized into sections", "Self-paced learning", "Track progress"],
    ready: true,
  },
  {
    id: "livestream",
    name: "Free livestream",
    icon: lteSignalIcon,
    blurb: "Host a free live event to grow your audience.",
    description: "Go live for free to reach new leads and showcase your expertise. Schedule it, promote it, and optionally share the recording with Leland+ afterward.",
    features: ["Free to attend", "Scheduled live event", "Grows your audience", "Optional Leland+ recording"],
    ready: true,
  },
  {
    id: "live",
    name: "Group Session",
    icon: videoIcon,
    blurb: "Paid live sessions — one-off or a cohort-based program.",
    description: "Teach live in real time. Run a single paid group session, or build a full program of several sessions — then open one or more cohorts so people can join on their own schedule.",
    features: ["One-off or multi-session", "Cohort-based programs", "Paid group sessions", "Session recordings"],
    ready: true,
  },
  {
    id: "package",
    name: "Bundle",
    icon: packageBoxOpenIcon,
    blurb: "Bundle products into one offering.",
    description: "Combine coaching time, content, and live sessions into a single offering with its own page and price. Add tiers so buyers can choose.",
    features: ["Mix any product types", "Multiple pricing tiers", "One checkout", "Custom offering page"],
    ready: true,
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: repostIcon,
    blurb: "Recurring membership access.",
    description: "Charge members on a recurring basis for ongoing access to your content, community, and live sessions — billed monthly or annually.",
    features: ["Monthly or annual billing", "Ongoing member access", "Rolling live schedule", "Members-only content"],
    ready: true,
  },
];

// Browser-framed preview of what the selected type produces (illustrative).
function TypePreview({ type }: { type: ProductType }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_8px_32px_rgba(16,24,40,0.10)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 bg-gray-hover px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-stroke" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-stroke" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-stroke" />
      </div>
      {/* Nav skeleton */}
      <div className="flex items-center gap-3 border-b border-gray-stroke px-4 py-3.5">
        <div className="h-2.5 w-28 rounded-full bg-gray-stroke" />
        <div className="ml-auto flex gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-2 w-10 rounded-full bg-[#ECECEC]" />
          ))}
        </div>
      </div>
      {/* Hero */}
      <div className="border-b border-gray-stroke bg-[#F7F7F7] px-8 py-12 text-center">
        <p className="text-[18px] font-semibold text-gray-dark">{type.name}</p>
        <p className="mx-auto mt-1 max-w-[320px] text-[14px] leading-snug text-gray-light">{type.blurb}</p>
        <div className="mx-auto mt-4 h-7 w-28 rounded-full bg-gray-stroke" />
      </div>
      {/* Content skeleton */}
      <div className="grid grid-cols-3 gap-5 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="aspect-[4/3] rounded-lg bg-[#F2F2F2]" />
            <div className="h-2.5 w-4/5 rounded-full bg-[#ECECEC]" />
            <div className="h-2.5 w-3/5 rounded-full bg-[#F2F2F2]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// The coach's categories (slug + display name), mirroring CoachCategoryEdit's
// categoryData. The switcher below the heading lets the coach retarget the new
// product at a different category without leaving this page.
const CATEGORIES = [
  { slug: "product-management", name: "Product Management" },
  { slug: "management-consulting", name: "Management Consulting" },
  { slug: "mba", name: "MBA" },
  { slug: "college", name: "College" },
];

export default function CoachProductTypeSelect() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("package");
  const selected = PRODUCT_TYPES.find((t) => t.id === selectedId) ?? PRODUCT_TYPES[0];

  // Category switcher dropdown (the subtext under the heading).
  const currentCategory = CATEGORIES.find((c) => c.slug === category) ?? CATEGORIES[0];
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: MouseEvent) => { if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [catOpen]);

  useEffect(() => {
    document.title = "Leland Prototype | New product";
  }, []);

  const close = () => navigate(`/my-leland/manage/${category}`);
  const start = () => {
    if (selected.ready) navigate(`/my-leland/manage/${category}/new-product/${selected.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-stroke bg-white px-4 py-3 sm:px-6"
      >
        <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Button>
        <span className="hidden text-[15px] font-semibold text-gray-dark sm:inline">New product</span>
      </motion.header>

      {/* Two equal halves; left content is vertically centered. */}
      <div className="grid flex-1 lg:grid-cols-2">
        {/* Left — choose a type + its detail (vertically centered) */}
        <div className="flex items-center px-4 py-10 sm:px-6 lg:px-12 xl:px-16">
          <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto w-full max-w-[520px] min-w-0">
            <motion.h1 variants={fadeUp} className="text-[24px] font-semibold text-gray-dark">Add something new to your profile</motion.h1>

            {/* Category switcher — a subtext line naming the current category
                with a chevron that opens a dropdown of the coach's categories. */}
            <motion.div variants={fadeUp} ref={catRef} className="relative mt-2 text-[15px] text-gray-light">
              Adding to{" "}
              <button
                type="button"
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
                className={`inline-flex items-center gap-1 font-medium transition-colors hover:text-gray-dark ${catOpen ? "text-gray-dark" : "text-gray-light"}`}
              >
                <span className="underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">{currentCategory.name}</span>
                <svg className={`h-4 w-4 shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              {catOpen && (
                <div className="absolute left-0 top-full z-30 mt-1.5 min-w-[220px] rounded-xl border border-gray-stroke bg-white p-1.5 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
                  {CATEGORIES.map((c) => {
                    const active = c.slug === category;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => { setCatOpen(false); if (!active) navigate(`/my-leland/manage/${c.slug}/new`); }}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${active ? "font-semibold text-gray-dark" : "font-medium text-gray-dark hover:bg-gray-hover"}`}
                      >
                        {c.name}
                        {active && (
                          <svg className="h-[18px] w-[18px] shrink-0 text-gray-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div variants={cardStagger} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PRODUCT_TYPES.map((t) => {
                const active = t.id === selectedId;
                return (
                  <motion.button
                    key={t.id}
                    variants={cardItem}
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className={`flex items-center gap-3 rounded-2xl border-[1.5px] bg-white p-4 text-left transition-colors ${active ? "border-gray-dark" : "border-gray-stroke hover:border-[#c9c9c9]"}`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-hover text-gray-dark">
                      <MaskIcon src={t.icon} className="h-[22px] w-[22px]" />
                    </span>
                    <span className="min-w-0 text-[16px] font-semibold text-gray-dark">{t.name}</span>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Selected-type detail */}
            <motion.div variants={fadeUp} className="mt-8">
              <h2 className="text-[20px] font-semibold text-gray-dark">{selected.name}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-gray-light">{selected.description}</p>

              <p className="mt-5 text-[14px] font-semibold text-gray-dark">What's included</p>
              <div className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {selected.features.map((f) => (
                  <span key={f} className="flex items-center gap-2 text-[14px] text-gray-dark">
                    <img src={checkmarkFilledIcon} alt="" className="h-[18px] w-[18px] shrink-0" />
                    {f}
                  </span>
                ))}
              </div>

              <Button
                size="lg"
                variant="primary"
                rounded="rounded-full"
                className="mt-7 w-full text-[15px] font-semibold"
                disabled={!selected.ready}
                onClick={start}
              >
                {selected.ready ? "Get started" : "Coming soon"}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — preview of the result (vertically centered on a subtle panel) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="hidden items-center justify-center border-l border-gray-stroke bg-gray-hover px-10 py-10 lg:flex xl:px-16"
        >
          <div className="w-full max-w-[560px]">
            <TypePreview type={selected} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
