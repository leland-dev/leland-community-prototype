import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { Button } from "../components/Button";
import { type CoachProfileCardData } from "../components/ProfileCard";
import { SmallRow } from "../components/StorefrontCards";
import { itemsByKind, type StorefrontItem } from "../lib/storefrontSections";
import { SubNavContext } from "../components/SubNavContext";
import SubNavItem from "../components/SubNavItem";

import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";

import hbsLogo from "../assets/org-logos/hbs.png";
import bainLogo from "../assets/org-logos/bain.png";
import whartonLogo from "../assets/org-logos/wharton.png";
import bcgLogo from "../assets/org-logos/bcg.png";
import columbiaLogo from "../assets/org-logos/columbia.png";
import deloitteLogo from "../assets/org-logos/deloitte.png";

import verifiedIcon from "../assets/icons/verified-new.svg";
import starIcon from "../assets/icons/star.svg";
import mbaIcon from "../assets/icons/category-icons/mba.svg";
import consultingIcon from "../assets/icons/category-icons/consulting.svg";
import productManagementIcon from "../assets/icons/category-icons/product-management.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

import bootcamp2 from "../assets/placeholder images/bootcamp-2.webp";
import bootcamp3 from "../assets/placeholder images/bootcamp-3.webp";
import programImg3 from "../assets/placeholder images/placeholder-event-01.png";
import programImg4 from "../assets/placeholder images/placeholder-event-02.png";
import programImg5 from "../assets/placeholder images/placeholder-event-03.png";
import offeringCover1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import offeringCover2 from "../assets/placeholder images/leland-plus-images/b9669ad2-4b6f-4c32-83e1-d1370dbf9484.webp";
import offeringCover3 from "../assets/placeholder images/leland-plus-images/db2eb673-d212-41d5-8df9-6fa6de57bc23.webp";

// ─── Search Results ────────────────────────────────────
// Demo of Leland's unified search. The engineer's first pass rendered every
// result type as the same list row; this version gives each index (Categories,
// Experts, Offerings, Programs, Livestreams) its own native treatment so the
// page reads with hierarchy and feels consistent with the rest of the product.

const QUERY = "harvard";

// ─── Result data ───────────────────────────────────────

// Categories lead the page as a horizontal carousel, reusing the exact category
// buttons (outline icon + label + chevron) from the expert's high-level profile.
const categories = [
  { name: "MBA", icon: mbaIcon },
  { name: "Management Consulting", icon: consultingIcon },
  { name: "Product Management", icon: productManagementIcon },
];

const experts: CoachProfileCardData[] = [
  {
    variant: "coach",
    name: "Rothsaida Sylvaince",
    avatar: pic1,
    headline: "Hired or interviewed candidates at Harvard Alumni Association",
    credentials: [
      { logo: hbsLogo, label: "Harvard Business School" },
      { logo: bainLogo, label: "Bain & Company" },
    ],
    rating: 4.9,
    reviews: 128,
    followers: 2410,
    sessions: 312,
  },
  {
    variant: "coach",
    name: "Asli Pisano",
    avatar: pic2,
    headline: "Admissions committee at Harvard School of Dental Medicine",
    credentials: [
      { logo: hbsLogo, label: "Harvard" },
      { logo: columbiaLogo, label: "Columbia" },
    ],
    rating: 5.0,
    reviews: 74,
    followers: 1860,
    sessions: 201,
  },
  {
    variant: "coach",
    name: "Daniel Khalessi",
    avatar: pic3,
    headline: "Hired or interviewed candidates at Harvard Kennedy School",
    credentials: [
      { logo: hbsLogo, label: "Harvard Kennedy School" },
      { logo: bcgLogo, label: "BCG" },
    ],
    rating: 4.8,
    reviews: 156,
    followers: 3120,
    sessions: 408,
  },
  {
    variant: "coach",
    name: "Jenna Zhu",
    avatar: pic4,
    headline: "Admissions committee at Harvard School of Dental Medicine",
    credentials: [
      { logo: hbsLogo, label: "Harvard" },
      { logo: whartonLogo, label: "Wharton" },
    ],
    rating: 4.95,
    reviews: 63,
    followers: 1440,
    sessions: 178,
  },
  {
    variant: "coach",
    name: "Aric Flemming",
    avatar: pic5,
    headline: "Admissions committee at Harvard Business School",
    credentials: [
      { logo: hbsLogo, label: "Harvard Business School" },
      { logo: deloitteLogo, label: "Deloitte" },
    ],
    rating: 5.0,
    reviews: 92,
    followers: 2680,
    sessions: 356,
  },
  {
    variant: "coach",
    name: "Michael Torres",
    avatar: pic6,
    headline: "Former financial aid officer at Harvard College",
    credentials: [
      { logo: hbsLogo, label: "Harvard" },
      { logo: bainLogo, label: "Bain & Company" },
    ],
    rating: 4.9,
    reviews: 110,
    followers: 1990,
    sessions: 264,
  },
  {
    variant: "coach",
    name: "Sophia Nguyen",
    avatar: pic7,
    headline: "Research fellow at Harvard Medical School",
    credentials: [
      { logo: hbsLogo, label: "Harvard Medical School" },
      { logo: columbiaLogo, label: "Columbia" },
    ],
    rating: 4.97,
    reviews: 88,
    followers: 2130,
    sessions: 290,
  },
  {
    variant: "coach",
    name: "Omar Haddad",
    avatar: pic8,
    headline: "Interviewed candidates at Harvard Law School",
    credentials: [
      { logo: hbsLogo, label: "Harvard Law School" },
      { logo: bcgLogo, label: "BCG" },
    ],
    rating: 4.85,
    reviews: 141,
    followers: 2890,
    sessions: 377,
  },
  {
    variant: "coach",
    name: "Grace Park",
    avatar: pic9,
    headline: "Former admissions reader at Harvard College",
    credentials: [
      { logo: hbsLogo, label: "Harvard" },
      { logo: whartonLogo, label: "Wharton" },
    ],
    rating: 5.0,
    reviews: 69,
    followers: 1570,
    sessions: 188,
  },
];

// The first three catalog packages share near-identical cover art, so swap in
// more varied images for a less repetitive row.
const OFFERING_COVERS = [offeringCover1, offeringCover2, offeringCover3];
const offerings = itemsByKind("package").slice(0, 6).map((item, i) =>
  i < OFFERING_COVERS.length ? { ...item, image: OFFERING_COVERS[i] } : item
);

// The expert attached to each offering (shown in the card's footer row).
const offeringExperts = [
  { name: "Rothsaida Sylvaince", avatar: pic1, rating: 4.9, reviews: 128 },
  { name: "Daniel Khalessi", avatar: pic3, rating: 4.8, reviews: 156 },
  { name: "Aric Flemming", avatar: pic5, rating: 5.0, reviews: 92 },
  { name: "Jenna Zhu", avatar: pic4, rating: 4.95, reviews: 63 },
  { name: "Asli Pisano", avatar: pic2, rating: 5.0, reviews: 74 },
  { name: "Michael Torres", avatar: pic6, rating: 4.9, reviews: 110 },
];

// Programs render in the Livestreams row style (SmallRow → StorefrontItem).
const programs: StorefrontItem[] = [
  { id: "prog1", kind: "content", title: "HBS 2+2 Deferred Admissions Bootcamp", image: bootcamp2, meta: "Live cohort · Starts Apr 14 · 6 sessions", price: "$1,200" },
  { id: "prog2", kind: "content", title: "Cracking the Harvard Kennedy School Application", image: bootcamp3, meta: "Self-paced · 12 lessons · 4.5 hrs", price: "$450" },
  { id: "prog3", kind: "content", title: "Harvard MBA Essay Intensive", image: programImg3, meta: "Live cohort · Starts May 2 · 4 sessions", price: "$900" },
  { id: "prog4", kind: "content", title: "Harvard Medical Secondary Sprint", image: programImg4, meta: "Self-paced · 8 lessons · 3 hrs", price: "$350" },
];

// Livestreams render as rich cover cards (host + rating + registrants).
type LivestreamCardData = {
  id: string;
  title: string;
  image: string;
  date: string;
  host: { name: string; avatar: string; rating: number };
  registered: number;
  registrants: string[];
};
const livestreams: LivestreamCardData[] = [
  { id: "ls1", title: "Inside an M7 Admit Decision", image: programImg5, date: "Dec 1 at 6:00 PM", host: { name: "Priya S.", avatar: pic2, rating: 5.0 }, registered: 312, registrants: [pic1, pic3, pic4, pic6] },
  { id: "ls2", title: "Round 2 Essay Strategy, Live Q&A", image: programImg4, date: "Dec 4 at 5:00 PM", host: { name: "Daniel K.", avatar: pic3, rating: 4.9 }, registered: 148, registrants: [pic5, pic7, pic8, pic1] },
  { id: "ls3", title: "Ask Me Anything: MBA Interviews", image: programImg3, date: "Dec 9 at 4:00 PM", host: { name: "Aric F.", avatar: pic5, rating: 4.8 }, registered: 97, registrants: [pic6, pic4, pic9, pic2] },
  { id: "ls4", title: "Behavioral Interview Masterclass", image: bootcamp3, date: "Dec 12 at 3:00 PM", host: { name: "Jenna Z.", avatar: pic4, rating: 5.0 }, registered: 206, registrants: [pic1, pic2, pic7, pic8] },
];

// Experts show two rows (a 3-col grid → 6 cards) before the "See more" reveal.
const EXPERTS_COLLAPSED = 6;

// ─── Result-type filter model ──────────────────────────

const TYPES = [
  { key: "categories", label: "Categories", count: 3 },
  { key: "offerings", label: "Offerings", count: 17 },
  { key: "experts", label: "Experts", count: 258 },
  { key: "programs", label: "Programs", count: 28 },
  { key: "livestreams", label: "Livestreams", count: 12 },
] as const;
type TypeKey = (typeof TYPES)[number]["key"];

const SUBNAV = ["Popular", "General", "AI", "School Admissions", "Test Prep", "Business", "Finance & Accounting", "Product", "Technology", "Health & Medicine", "Law & Public Service", "Arts, Media, and Entertainment", "More"];

// ─── Primitives ────────────────────────────────────────

function Checkbox({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count: number }) {
  return (
    <button onClick={onChange} className="flex w-full items-center py-[7px] text-left">
      <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${checked ? "border-[#1a1a1a] bg-[#1a1a1a]" : "border-gray-stroke bg-white"}`}>
        {checked && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </span>
      <span className="ml-2.5 text-[14px] text-gray-dark">{label}</span>
      <span className="ml-1.5 text-[13px] tabular-nums text-gray-xlight">{count}</span>
    </button>
  );
}

function SectionHeader({ title, seeAll, onSeeAll }: { title: string; seeAll?: string; onSeeAll?: () => void }) {
  const linkClass = "text-[14px] font-medium text-gray-light transition-colors hover:text-gray-dark";
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[20px] font-semibold text-gray-dark">{title}</h2>
      {seeAll && (onSeeAll
        ? <button onClick={onSeeAll} className={linkClass}>{seeAll}</button>
        : <Link to="#" className={linkClass}>{seeAll}</Link>
      )}
    </div>
  );
}

// A horizontally-scrolling rail used by the Categories and Offerings treatments.
function Rail({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide [-webkit-overflow-scrolling:touch]">{children}</div>;
}

// Offering card variant with an expert footer: cover + title + price, then a
// bordered row showing the expert (photo + name) on the left and their rating
// on the right. Mirrors the shared LargeCard shell so it reads as native.
function OfferingCard({ item, expert }: { item: StorefrontItem; expert: { name: string; avatar: string; rating: number; reviews: number } }) {
  return (
    <Link to={item.href ?? "#"} className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white no-underline shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(16,24,40,0.12)]">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1.91 / 1" }}>
        {item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-hover" />}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-semibold leading-tight text-gray-dark">{item.title}</p>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-gray-light">{item.meta}</p>
        <div className="mt-auto pt-3">
          {item.startingAt && <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-extra-light">Starting at</p>}
          <p className="flex items-baseline gap-x-1 whitespace-nowrap text-[14px] font-semibold text-gray-dark">
            <span>{item.price}{item.priceSuffix && <span className="text-[13px] font-normal text-gray-light">{item.priceSuffix}</span>}</span>
            {item.origPrice && <span className="font-normal text-gray-extra-light line-through">{item.origPrice}</span>}
            {item.savePct != null && <span className="ml-auto text-[12px] font-medium text-[#1B8A54]">Save {item.savePct}%</span>}
          </p>
        </div>
      </div>
      {/* Expert footer — photo + name left, rating right. The divider insets to
          the card's horizontal padding rather than running full-bleed. */}
      <div className="px-4">
        <div className="flex items-center justify-between gap-3 border-t border-gray-stroke py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <img src={expert.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            <span className="truncate text-[13px] font-medium text-gray-dark">{expert.name}</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[13px] text-gray-dark">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="#FFCB47" className="shrink-0"><path d="M7 1l1.8 3.65L13 5.3l-3 2.84.7 4.02L7 10.36 3.3 12.16l.7-4.02-3-2.84 4.2-.65L7 1z" /></svg>
            {expert.rating.toFixed(1)}
            <span className="text-gray-xlight">({expert.reviews})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// Expert card: no banner, no avatar shadow, Season-serif name, credential row,
// and a 5-star rating footer (mirroring the expert profile) in place of stats.
function ExpertCard({ card }: { card: CoachProfileCardData }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4">
      {/* Avatar left, single-star rating top-right. */}
      <div className="flex items-start justify-between gap-2">
        <img src={card.avatar} alt={card.name} className="h-[72px] w-[72px] rounded-full object-cover" />
        <span className="flex items-center gap-1 text-[14px] leading-none">
          <img src={starIcon} alt="" className="h-[15px] w-[15px] shrink-0" />
          <span className="font-semibold text-gray-dark">{card.rating.toFixed(1)}</span>
          <span className="text-gray-light">({card.reviews})</span>
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <p className="font-serif text-[20px] font-medium leading-tight text-gray-dark">{card.name}</p>
        <img src={verifiedIcon} alt="Verified" className="h-[16px] w-[16px] shrink-0" />
      </div>
      <p className="mt-1 text-[14px] leading-snug text-gray-light">{card.headline}</p>
      {card.credentials.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-1">
          {card.credentials.map((c) => (
            <div key={c.label} className="flex items-center gap-1.5 text-[14px] text-gray-extra-light">
              <img src={c.logo} alt={c.label} className="h-[16px] w-[16px] rounded object-contain" />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-auto pt-4">
        <Button size="md" variant="secondary" rounded="rounded-full" className="w-full">Free intro call</Button>
      </div>
    </div>
  );
}

// Livestream card: big cover, title + Register, date, then a host (photo · name
// · rating) / "N registered" + registrant avatars footer.
function LivestreamCard({ ls }: { ls: LivestreamCardData }) {
  return (
    <div>
      <img src={ls.image} alt="" className="aspect-[1.91/1] w-full rounded-[6px] object-cover" />
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[18px] font-semibold text-gray-dark">{ls.title}</h3>
          <p className="mt-0.5 text-[15px] text-gray-light">{ls.date}</p>
        </div>
        <Button size="md" variant="dark" rounded="rounded-xl" className="shrink-0">Register</Button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[14px] text-gray-dark">
          <img src={ls.host.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
          <span className="truncate">{ls.host.name}</span>
          <span className="h-3.5 w-px shrink-0 bg-gray-stroke" />
          <span className="flex shrink-0 items-center gap-1">
            <img src={starIcon} alt="" className="h-[14px] w-[14px]" />
            {ls.host.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[14px] text-gray-light">
          <span className="whitespace-nowrap">{ls.registered} registered</span>
          <div className="flex -space-x-2">
            {ls.registrants.slice(0, 4).map((src, i) => (
              <img key={i} src={src} alt="" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────

export default function SearchResults() {
  useEffect(() => { document.title = `Leland Prototype | Results for "${QUERY}"`; }, []);
  const [enabled, setEnabled] = useState<Set<TypeKey>>(new Set(TYPES.map((t) => t.key)));
  const [activeNav, setActiveNav] = useState("Popular");
  const [showAllExperts, setShowAllExperts] = useState(false);
  const toggle = (k: TypeKey) => setEnabled((prev) => {
    const next = new Set(prev);
    next.has(k) ? next.delete(k) : next.add(k);
    return next;
  });

  // Feed the shared full-width category sub-nav bar (rendered by the Layout).
  const { setContent } = useContext(SubNavContext);
  useEffect(() => {
    setContent(
      <>
        {SUBNAV.map((label) => (
          <SubNavItem key={label} label={label} isActive={activeNav === label} onClick={() => setActiveNav(label)} textSizeClass="text-[14px]" />
        ))}
      </>
    );
    return () => setContent(null);
  }, [activeNav, setContent]);

  const visibleExperts = showAllExperts ? experts : experts.slice(0, EXPERTS_COLLAPSED);

  const filters = (
    <div className="pt-1">
      <h2 className="text-[18px] font-semibold text-gray-dark">Filters</h2>

      {/* Type */}
      <div className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-xlight">Type</p>
        <div className="mt-1.5">
          {TYPES.map((t) => (
            <Checkbox key={t.key} checked={enabled.has(t.key)} onChange={() => toggle(t.key)} label={t.label} count={t.count} />
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-xlight">Category</p>
        <div className="relative mt-2">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-xlight" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input placeholder="Search categories" className="w-full rounded-[10px] border border-gray-stroke bg-white py-2.5 pl-9 pr-3 text-[14px] outline-none placeholder:text-gray-xlight focus:border-gray-xlight" />
        </div>
      </div>

      {/* Price */}
      <div className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-xlight">Price</p>
        <div className="mt-2 flex items-center gap-2">
          <input placeholder="$ Min" className="w-full rounded-[10px] border border-gray-stroke bg-white px-3 py-2.5 text-[14px] outline-none placeholder:text-gray-xlight focus:border-gray-xlight" />
          <span className="text-gray-xlight">–</span>
          <input placeholder="$ Max" className="w-full rounded-[10px] border border-gray-stroke bg-white px-3 py-2.5 text-[14px] outline-none placeholder:text-gray-xlight focus:border-gray-xlight" />
        </div>
        <Button size="md" variant="primary" className="mt-3 w-full">Apply</Button>
      </div>
    </div>
  );

  return (
    <PageShell leftSidebar={filters} leftSidebarWidth={260} contentMaxWidth={860} columnGap={48}>
      <div className="pb-16">
        <h1 className="font-serif text-[34px] font-medium leading-[1.1] text-gray-dark">Results for &ldquo;{QUERY}&rdquo;</h1>
        <div className="mt-8 flex flex-col gap-11">
        {/* Categories — a horizontal carousel of icon buttons. */}
        {enabled.has("categories") && (
          <section>
            <SectionHeader title="Categories" />
            <Rail>
              {categories.map((c) => (
                <button key={c.name} className="flex shrink-0 items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-5 py-4 text-left transition-colors hover:bg-gray-hover">
                  <img src={c.icon} alt="" className="h-7 w-7 shrink-0" />
                  <span className="whitespace-nowrap text-[16px] font-semibold text-gray-dark">{c.name}</span>
                  <img src={chevronRightIcon} alt="" className="h-5 w-5 shrink-0" />
                </button>
              ))}
            </Rail>
          </section>
        )}

        {/* Offerings — a rail of cover cards, each with an expert footer row. */}
        {enabled.has("offerings") && (
          <section>
            <SectionHeader title="Offerings" seeAll="See all 17" />
            <Rail>
              {offerings.map((item, i) => (
                <div key={item.id} className="w-[270px] shrink-0">
                  <OfferingCard item={item} expert={offeringExperts[i % offeringExperts.length]} />
                </div>
              ))}
            </Rail>
          </section>
        )}

        {/* Experts — a 3-column grid; two rows, then a "See more" reveal. */}
        {enabled.has("experts") && (
          <section>
            <SectionHeader
              title="Experts"
              seeAll={experts.length > EXPERTS_COLLAPSED ? (showAllExperts ? "See less" : "See more") : undefined}
              onSeeAll={() => setShowAllExperts((v) => !v)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleExperts.map((card) => (
                <ExpertCard key={card.name} card={card} />
              ))}
            </div>
          </section>
        )}

        {/* Programs — the Livestreams row style (thumbnail + title + meta + price). */}
        {enabled.has("programs") && (
          <section>
            <SectionHeader title="Programs" seeAll="See all 28" />
            <div className="flex flex-col">
              {programs.map((item) => (
                <div key={item.id} className="py-1">
                  <SmallRow item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Livestreams — a horizontal carousel of rich cover cards (≈2.5 per view). */}
        {enabled.has("livestreams") && (
          <section>
            <SectionHeader title="Livestreams" seeAll="See all 12" />
            <Rail>
              {livestreams.map((ls) => (
                <div key={ls.id} className="w-[330px] shrink-0">
                  <LivestreamCard ls={ls} />
                </div>
              ))}
            </Rail>
          </section>
        )}
        </div>
      </div>
    </PageShell>
  );
}
