import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { getOfferingBySlug, OFFERINGS, type Offering } from "../lib/offerings";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";
import airplaneIcon from "../assets/icons/airplane.svg";
import starIcon from "../assets/icons/star.svg";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import samanthaPhoto from "../assets/profile photos/pic-6.png";
import reviewerPhoto from "../assets/profile photos/pic-3.png";
import samanthaVideo from "../assets/img/samantha-video.png";
import yaleLogo from "../assets/logos/yale.png";
import harvardLogo from "../assets/logos/harvard.png";
import stanfordLogo from "../assets/logos/stanford.png";
import boothLogo from "../assets/logos/booth.png";

// Customer-facing offering page — the published counterpart of the coach's
// "Page" setup tab. Two-column layout: content sections on the left, a sticky
// purchase card on the right. Linked from each offering card on the profile.

// Sample page content. Offerings don't carry real page-section data yet, so we
// synthesize a plausible set of sections keyed off the offering itself.
// The coach behind this offering. Offerings don't carry coach data yet, so this
// is synthesized to match Samantha's profile.
const COACH = {
  name: "Samantha Parker",
  slug: "samantha-parker",
  headline: "MBA Admissions Coach | Stanford GSB | 100+ M7 Admits",
  rating: 4.9,
  reviewCount: 214,
  bio: `I help ambitious professionals break into top MBA programs and land PM roles at leading tech companies. With eight-plus years in product at LinkedIn and Meta, plus my own Stanford GSB journey, I bring firsthand experience to every coaching session — from the first brainstorm to the final decision.

I've worked with clients admitted to every M7 program, as well as folks who pivoted into product from consulting, banking, and engineering. Whatever your background, my job is to help you translate it into a narrative admissions committees can't ignore.`,
  stats: [
    { value: "6.6k", label: "Min coached" },
    { value: "84", label: "Followers" },
    { value: "10 yrs", label: "Experience" },
  ],
};

// Text section body — a plain multi-paragraph block (truncated with a
// "Read more" toggle, matching the profile's About/bio pattern).
const ADDITIONAL_DETAILS = [
  "This package is built for people who want consistent, high-touch support rather than a one-off session. Across ten hours, we'll work through whatever matters most to your goals — and adapt as your priorities shift along the way.",
  "Most clients spend their hours across application strategy, essay edits, mock interviews, and school selection. You decide how to use them, and I'll help you make every session count.",
  "We'll kick off with a short intake so I can understand your background, target schools, and timeline before our first working session. From there, every hour is tailored — no generic templates, no filler. If your priorities change midway through, we change direction with them.",
  "You'll leave each session with a clear, written set of next steps so you always know exactly what to do before we meet again. And because the hours are bundled, you're locking in a rate that's meaningfully better than booking sessions individually — while keeping the flexibility to use them whenever you need them most.",
];

// "$1,200" → 1200
const parseMoney = (s?: string) => Number((s ?? "").replace(/[^0-9.]/g, "")) || 0;
const formatMoney = (n: number) => `$${n.toLocaleString("en-US")}`;

// Multiple pricing options (admin "Enable tiers" preview). Each tier is a
// different amount of coaching time at the same $150/hr, bundled at a discount.
const TIERS = [
  { name: "5 hours", coaching: "5h of coaching", subtotal: 750, total: 650 },
  { name: "10 hours", coaching: "10h of coaching", subtotal: 1500, total: 1200 },
  { name: "20 hours", coaching: "20h of coaching", subtotal: 3000, total: 2400 },
];

const CHECKLIST_ITEMS = [
  "One-on-one time directly with Samantha",
  "Personalized feedback tailored to your goals",
  "A clear, actionable plan after every session",
  "Access to Samantha's templates and resources",
];

const REVIEWS = [
  {
    name: "Tarari K.",
    initials: "TK",
    color: "#6D4AAE",
    photo: reviewerPhoto,
    date: "August 2026",
    rating: 5,
    headline: "Can't recommend Samantha enough!",
    category: "MBA",
    text: "What made Samantha an outstanding coach was not just her broad & in-depth knowledge of programs, her surgical feedback process or her structured approach to application planning — it was her encouragement. It was infused into every part of the process. She's a coach who believes in her clients and will support them in achieving their goals!",
    accepted: [
      { name: "Yale School of Management", logo: yaleLogo },
      { name: "Harvard Business School", logo: harvardLogo },
    ],
  },
  {
    name: "Priya N.",
    initials: "PN",
    color: "#1F7A5A",
    photo: undefined,
    date: "April 2026",
    rating: 5,
    headline: "Realistic mocks that made every interview easy",
    category: "Interview Prep",
    text: "The mock interviews were incredibly realistic. We did multiple rounds and she gave sharp, specific feedback each time. I walked into every real interview feeling calm and prepared.",
    accepted: [
      { name: "Stanford GSB", logo: stanfordLogo },
      { name: "Booth", logo: boothLogo },
    ],
  },
];

const FAQS = [
  { q: "How does scheduling work?", a: "After you purchase, you'll get a link to book your sessions at times that work for you. Samantha keeps a flexible calendar and will do her best to accommodate your timeline." },
  { q: "What happens right after I purchase?", a: "You'll receive a confirmation email with next steps, an intake form so Samantha can prepare, and access to any included resources." },
  { q: "Is this a good fit if I'm just getting started?", a: "Absolutely. Samantha tailors every engagement to where you are — whether you're just exploring or deep into your applications." },
];

function StarRow({ rating, starClassName = "h-4 w-4" }: { rating: number; starClassName?: string }) {
  return (
    <div className="flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className={`${starClassName} bg-gray-dark ${i < rating ? "" : "opacity-30"}`}
          style={{
            maskImage: `url("${starIcon}")`,
            WebkitMaskImage: `url("${starIcon}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
      ))}
    </div>
  );
}

type Review = (typeof REVIEWS)[number];

// A single client review — a soft card with the rating + headline up top, the
// body in the middle, and a footer that identifies the reviewer, the coaching
// context, and the schools they were accepted to.
function ReviewCard({ review }: { review: Review }) {
  // "August 2026" → "Aug 2026"
  const shortDate = review.date.replace(/^(\w{3})\S*/, "$1");
  return (
    <article className="rounded-2xl border border-gray-stroke bg-white p-6">
      {/* Stars + headline */}
      <div className="flex items-center gap-2">
        <StarRow rating={review.rating} starClassName="h-[15px] w-[15px]" />
        <h3 className="text-[15px] font-semibold leading-snug text-gray-dark">{review.headline}</h3>
      </div>
      <p className="mt-2 text-[15px] leading-[1.6] text-gray-light">{review.text}</p>

      {/* Reviewer + outcome. The date sits on the name row so the outcome text
          can span the full width below. */}
      <div className="mt-5 flex items-center gap-3 border-t border-gray-stroke pt-5">
        {review.photo ? (
          <img src={review.photo} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
        ) : (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
            style={{ backgroundColor: review.color }}
          >
            {review.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-semibold leading-snug text-gray-dark">{review.name}</p>
            <span className="shrink-0 text-[14px] text-gray-extra-light">{shortDate}</span>
          </div>
          {review.accepted.length > 0 && (
            <p className="text-[14px] leading-snug text-gray-light">
              Accepted to{" "}
              {review.accepted.map((s, i) => (
                <span key={s.name}>
                  {i > 0 && (i === review.accepted.length - 1 ? " and " : ", ")}
                  <span className="whitespace-nowrap">
                    <img src={s.logo} alt="" className="mr-1 inline-block h-4 w-4 rounded-[4px] object-cover align-middle" />
                    <span>{s.name}</span>
                  </span>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function PriceRow({ offering, className = "" }: { offering: Offering; className?: string }) {
  return (
    <div className={className}>
      {offering.startingAt && (
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>
      )}
      <p className="flex items-baseline gap-x-1 text-[15px] font-semibold text-gray-dark">
        <span>{offering.price}</span>
        {offering.origPrice && <span className="font-normal text-gray-extra-light line-through">{offering.origPrice}</span>}
        {offering.savePct != null && <span className="ml-auto text-[12px] font-medium text-[#1B8A54]">Save {offering.savePct}%</span>}
      </p>
    </div>
  );
}

// The sticky purchase card on the right — the customer-facing counterpart of the
// coach builder's live preview card.
function PurchaseCard({ offering, ctaLabel }: { offering: Offering; ctaLabel: string }) {
  return (
    <div className="overflow-hidden lg:rounded-2xl lg:border lg:border-gray-stroke lg:bg-white lg:shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <img src={offering.image} alt="" className="aspect-[1200/630] w-full rounded-2xl object-cover lg:rounded-none" />
      {/* Card body — desktop only. On mobile the name/headline are dropped and
          the price + CTAs move beneath the description instead. */}
      <div className="hidden p-4 lg:block">
        <p className="text-[16px] font-semibold leading-tight text-gray-dark">{offering.title}</p>
        <p className="mt-1 text-[14px] leading-snug text-gray-light">{offering.headline}</p>
        <PriceRow offering={offering} className="mt-3" />
        <Button size="lg" variant="primary" rounded="rounded-full" className="mt-4 w-full text-[15px]">
          {ctaLabel}
        </Button>
        <Button size="lg" variant="secondary" rounded="rounded-full" className="mt-2 w-full text-[15px]">
          Free intro call
        </Button>
      </div>
    </div>
  );
}

// Single expandable FAQ row. Uses a grid-rows 0fr→1fr transition so the answer
// animates open/closed without measuring heights (matches CoachContent's FAQ).
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-stroke last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[16px] font-semibold text-gray-dark">{q}</span>
        <svg className={`h-5 w-5 shrink-0 text-gray-light transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="pb-4 text-[15px] leading-relaxed text-gray-light">{a}</p>
        </div>
      </div>
    </div>
  );
}

// Multi-paragraph text collapsed to ~4 lines with a "Read more" toggle — mirrors
// the About/bio expand/collapse on the profile (height animation + gradient fade
// + gray Read more button with a rotating chevron).
function ReadMoreText({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 192 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden"
      >
        <div className="flex flex-col gap-4 text-[16px] leading-[1.6] text-gray-dark">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.35, ease: [0.42, 0, 0.58, 1] }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3.2em] bg-gradient-to-t from-white to-transparent"
        />
      </motion.div>
      <Button size="md" variant="secondary" className="mt-3 font-semibold" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Read less" : "Read more"}
        <svg className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>
    </>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="mb-4 text-[20px] font-semibold text-gray-dark">{heading}</h2>
      {children}
    </section>
  );
}

// Small switch, matching the offering builder's Toggle.
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-[#222222]" : "bg-[#d9d9d9]"}`}
    >
      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

// Prototype-only admin menu — a 3-dot button pinned to the bottom-right that
// toggles the "Enable tiers" preview (multiple pricing options).
function AdminMenu({ tiersEnabled, onToggleTiers }: { tiersEnabled: boolean; onToggleTiers: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 z-10 mb-2 w-56 rounded-xl border border-gray-stroke bg-white p-1 shadow-lg">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-light">Admin</p>
            <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2">
              <span className="text-[14px] font-medium text-gray-dark">Enable tiers</span>
              <Toggle checked={tiersEnabled} onChange={onToggleTiers} />
            </div>
          </div>
        </>
      )}
      <button
        type="button"
        aria-label="Admin menu"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-stroke bg-white shadow-lg transition-colors ${open ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  );
}

export default function OfferingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const offering = getOfferingBySlug(slug);

  useEffect(() => {
    document.title = offering ? `Leland | ${offering.title}` : "Leland | Offering";
    window.scrollTo(0, 0);
  }, [offering]);

  // Admin "Enable tiers" preview — shows the page with multiple pricing options.
  const [tiersEnabled, setTiersEnabled] = useState<boolean>(() => localStorage.getItem("offering-tiers-enabled") === "1");
  const [activeTier, setActiveTier] = useState(0);
  const toggleTiers = () =>
    setTiersEnabled((v) => {
      const next = !v;
      localStorage.setItem("offering-tiers-enabled", next ? "1" : "0");
      return next;
    });
  const primaryCta = tiersEnabled ? "Select an option" : "Purchase";

  // Mobile sticky nav — appears once the hero sentinel scrolls above the
  // viewport, matching the profile page's scroll-in bar. (Same observer logic:
  // only show when the sentinel is ABOVE the fold, not merely below it.)
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroSentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sentinel = heroSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStickyVisible(false);
        else setStickyVisible(entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!offering) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <p className="text-[18px] font-semibold text-gray-dark">Offering not found</p>
        <Link to="/profile/samantha-parker" className="text-[15px] font-medium text-gray-light underline">Back to profile</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:py-12 lg:px-16">
        {/* On mobile the aside (preview card + CTAs) stacks first via
            flex-col-reverse; on desktop it returns to left-main / right-aside. */}
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-start lg:gap-10">
          {/* Left: content — capped to match the profile template's 800px column */}
          <main className="min-w-0 flex-1 lg:max-w-[800px]">
            <h1 className="font-serif text-[36px] leading-tight text-gray-dark md:text-[44px]">{offering.title}</h1>
            <p className="mt-2 text-[18px] leading-tight text-gray-extra-light">{offering.headline}</p>

            {/* Coach highlight — same card chrome + text size as the "What's
                included" product card. The name links out to the full profile. */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-stroke px-4">
              <div className="flex items-center gap-3 py-4">
                <img src={samanthaPhoto} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <Link to={`/profile/${COACH.slug}`} className="text-[15px] font-semibold text-gray-dark underline-offset-2 hover:underline">
                      By {COACH.name}
                    </Link>
                    <span className="flex items-center gap-1.5 text-[13px] text-gray-light">
                      <img src={starIcon} alt="" className="h-4 w-4" />
                      <span className="font-semibold text-gray-dark">{COACH.rating.toFixed(1)}</span>
                      <span>· {COACH.reviewCount} reviews</span>
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[15px] leading-snug text-gray-light">{COACH.headline}</p>
                </div>
              </div>
            </div>

            {offering.description && (
              <p className="mt-6 text-[16px] leading-relaxed text-gray-dark">{offering.description}</p>
            )}

            {/* Mobile-only price + CTAs — the card's actions live here below the
                description instead of in the (image-only) card at the top. */}
            <div className="mt-6 lg:hidden">
              <PriceRow offering={offering} />
              <Button size="lg" variant="primary" rounded="rounded-full" className="mt-4 w-full text-[15px]">
                {primaryCta}
              </Button>
              <Button size="lg" variant="secondary" rounded="rounded-full" className="mt-2 w-full text-[15px]">
                Free intro call
              </Button>
            </div>

            {/* Hero sentinel — the mobile sticky nav appears once this scrolls above the fold */}
            <div ref={heroSentinelRef} aria-hidden className="h-0" />

            {/* Checklist */}
            <Section heading="What we'll cover">
              <ul className="flex flex-col gap-3">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <img src={checkmarkFilledIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
                    <span className="text-[16px] leading-snug text-gray-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Text section — truncated with a "Read more" toggle */}
            <Section heading="Additional details">
              <ReadMoreText paragraphs={ADDITIONAL_DETAILS} />
            </Section>

            {/* What's included — the offering's products + a total, mirroring the
                offering builder's product list and price rollup. Products use the
                builder's real types (Coaching time, Content). */}
            {(() => {
              // With tiers enabled, the active tier drives the breakdown;
              // otherwise it's the single offering price.
              const tier = tiersEnabled ? TIERS[activeTier] : null;
              const total = tier ? tier.total : parseMoney(offering.price);
              const subtotal = tier ? tier.subtotal : parseMoney(offering.origPrice) || total;
              const savings = Math.max(0, subtotal - total);
              // Products in this offering, matching the builder's types. The
              // priced coaching time carries the subtotal; the content item is
              // bundled in for free.
              const products = [
                {
                  icon: hourglassIcon,
                  title: tier ? tier.coaching : "10h of coaching",
                  // Rate + delivery format, matching the builder ("$150/hr · Live
                  // Sessions") with the delivery in a lighter gray.
                  detail: (
                    <>
                      $150/hr<span className="text-gray-extra-light"> · Live Sessions</span>
                    </>
                  ),
                  price: subtotal,
                  free: false,
                },
                { icon: bookOpenIcon, title: "MBA Essay Playbook", detail: "Guide", price: 99, free: true },
              ];
              return (
                <Section heading="What's included">
                  {/* Tier tab bar — swap between pricing options when enabled */}
                  {tiersEnabled && (
                    <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-gray-stroke">
                      {TIERS.map((t, i) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => setActiveTier(i)}
                          className={`shrink-0 border-b-2 px-3 py-2.5 text-[15px] transition-colors ${
                            i === activeTier
                              ? "border-gray-dark font-semibold text-gray-dark"
                              : "border-transparent font-medium text-gray-light hover:text-gray-dark"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product list */}
                  <div className="overflow-hidden rounded-2xl border border-gray-stroke px-4">
                    {products.map((p, i) => (
                      <div key={p.title} className={`flex items-center gap-3 py-4 ${i < products.length - 1 ? "border-b border-gray-stroke" : ""}`}>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                          <img src={p.icon} alt="" className="h-[26px] w-[26px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-gray-dark">{p.title}</span>
                          <span className="block text-[15px] text-gray-light">{p.detail}</span>
                        </span>
                        {p.free ? (
                          <span className="flex shrink-0 items-center gap-1.5 text-[15px]">
                            <span className="text-gray-extra-light line-through decoration-1 opacity-60">{formatMoney(p.price)}</span>
                            <span className="text-gray-light">Free</span>
                          </span>
                        ) : (
                          <span className="shrink-0 text-[15px] text-gray-dark">{formatMoney(p.price)}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Total — with the pre-discount subtotal struck through beside it */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[16px] font-semibold text-gray-dark">Total</span>
                    <span className="flex items-baseline gap-2">
                      {savings > 0 && (
                        <span className="text-[16px] text-gray-extra-light line-through decoration-1">{formatMoney(subtotal)}</span>
                      )}
                      <span className="text-[18px] font-semibold text-gray-dark">{formatMoney(total)}</span>
                    </span>
                  </div>
                </Section>
              );
            })()}

            {/* Media section — a video-style block */}
            <Section heading="A look inside">
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-stroke">
                <img src={samanthaVideo} alt="" className="aspect-video w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-[14px] transition-transform duration-200 group-hover:scale-105">
                    <svg className="h-5 w-5 translate-x-[2px] text-white" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            </Section>

            {/* Reviews */}
            <Section heading="What clients are saying">
              <div className="flex flex-col gap-4">
                {REVIEWS.map((r) => (
                  <ReviewCard key={r.name} review={r} />
                ))}
              </div>
              <Button
                size="md"
                variant="secondary"
                className="mt-4 font-semibold"
                onClick={() => navigate(`/profile/${COACH.slug}?section=reviews`)}
              >
                See all reviews
              </Button>
            </Section>

            {/* FAQs */}
            <Section heading="Frequently asked questions">
              <div className="flex flex-col">
                {FAQS.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </Section>

            {/* Meet your expert — a high-level coach highlight at the bottom of
                the content column, with a CTA out to the full profile. */}
            <section className="mt-16">
              <h2 className="mb-4 text-[20px] font-semibold text-gray-dark">Meet your expert</h2>

              <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                {/* Avatar */}
                <img src={samanthaPhoto} alt="" className="h-[160px] w-[160px] shrink-0 rounded-full object-cover" />

                {/* Name, headline, stats, bio, CTA */}
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[24px] font-medium leading-[1.3] text-gray-dark">{COACH.name}</p>
                  <p className="mt-0.5 text-[15px] font-medium text-gray-light">{COACH.headline}</p>

                  {/* Stats */}
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex flex-col gap-[2px]">
                      <span className="flex items-center gap-1">
                        <span className="text-[16px] font-semibold leading-none text-gray-dark">{COACH.rating.toFixed(1)}</span>
                        <span
                          aria-hidden
                          className="h-4 w-4 shrink-0 bg-gray-dark"
                          style={{
                            maskImage: `url("${starIcon}")`,
                            WebkitMaskImage: `url("${starIcon}")`,
                            maskSize: "contain",
                            WebkitMaskSize: "contain",
                            maskRepeat: "no-repeat",
                            WebkitMaskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMaskPosition: "center",
                          }}
                        />
                      </span>
                      <span className="text-[13px] leading-tight text-gray-light">{COACH.reviewCount} reviews</span>
                    </div>
                    {COACH.stats.map((s) => (
                      <div key={s.label} className="flex flex-col gap-[2px]">
                        <span className="text-[16px] font-semibold leading-none text-gray-dark">{s.value}</span>
                        <span className="text-[13px] leading-tight text-gray-light">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 whitespace-pre-line text-[15px] font-medium leading-relaxed text-gray-light">{COACH.bio}</p>

                  {/* CTA to the full profile — spans the description column only */}
                  <Button
                    size="lg"
                    variant="secondary"
                    rounded="rounded-full"
                    className="mt-6 w-full text-[15px] font-semibold"
                    onClick={() => navigate(`/profile/${COACH.slug}`)}
                  >
                    View {COACH.name.split(" ")[0]}'s full profile
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </section>
          </main>

          {/* Right: sticky purchase card */}
          <aside className="w-full lg:sticky lg:top-[81px] lg:h-fit lg:w-[340px] lg:shrink-0">
            <PurchaseCard offering={offering} ctaLabel={primaryCta} />

            {/* Questions? — mirrors the coach profile sidebar's message prompt. Desktop only. */}
            <div className="hidden gap-3 pt-6 lg:flex">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-[#f5f5f5] icon-tile">
                <img src={airplaneIcon} alt="" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-dark">Questions?</p>
                <p className="mt-0.5 text-[14px] leading-snug text-gray-light">
                  You can start chatting with {COACH.name.split(" ")[0]} before you get started. <span className="cursor-pointer font-medium text-gray-dark underline decoration-dotted decoration-[1.5px] underline-offset-[3px]">Send a message</span>
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* More packages from this coach — surfaces their other offerings. */}
        {(() => {
          const more = OFFERINGS.filter((o) => o.slug !== offering.slug).slice(0, 3);
          if (more.length === 0) return null;
          return (
            <section className="mt-16 border-t border-gray-stroke pt-10">
              <h2 className="mb-5 text-[24px] font-semibold text-gray-dark">More packages from {COACH.name.split(" ")[0]}</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((o) => (
                  <Link
                    key={o.slug}
                    to={`/offering/${o.slug}`}
                    className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white no-underline shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]"
                  >
                    <img src={o.image} alt="" className="aspect-[1200/630] w-full object-cover" />
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[15px] font-semibold leading-tight text-gray-dark">{o.title}</p>
                      <p className="mt-1 text-[14px] leading-snug text-gray-light">{o.headline}</p>
                      <PriceRow offering={o} className="mt-auto pt-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

      </div>

      {/* Mobile sticky nav — slides in after the hero, with a Purchase CTA.
          Same treatment as the profile page's scroll-in bar. Portaled to body so
          it escapes the page's stacking context. */}
      {createPortal(
        <AnimatePresence>
          {stickyVisible && (
            <motion.div
              key="offering-sticky"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed left-0 right-0 top-0 z-30 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] lg:hidden"
            >
              {/* Tapping the bar (outside the CTA) scrolls back to top. */}
              <div
                className="flex h-14 cursor-pointer items-center gap-4 px-4"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="flex min-w-0 shrink items-center gap-2.5">
                  <img src={offering.image} alt="" className="h-10 w-10 shrink-0 rounded-[8px] object-cover" />
                  <span className="truncate text-[16px] font-medium text-gray-dark">{offering.title}</span>
                </div>
                <div className="min-w-0 flex-1" />
                <Button
                  size="md"
                  variant="primary"
                  rounded="rounded-full"
                  className="shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {primaryCta}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <AdminMenu tiersEnabled={tiersEnabled} onToggleTiers={toggleTiers} />
    </div>
  );
}
