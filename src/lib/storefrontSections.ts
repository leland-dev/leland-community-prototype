// Shared model for the composable "storefront" that an expert arranges on the
// category management page (v6 builder) and a visitor sees on the profile
// Offerings tab. Both sides read the SAME config so the builder genuinely drives
// the public page — persisted to localStorage so a demo survives a reload and
// carries across the two routes.
import { OFFERINGS, type Offering } from "./offerings";
import { SUBSCRIPTIONS } from "./subscriptions";
import sessionImg1 from "../assets/placeholder images/placeholder-event-01.png";
import sessionImg2 from "../assets/placeholder images/placeholder-event-02.png";
import sessionImg3 from "../assets/placeholder images/placeholder-event-03.png";
import sessionImg4 from "../assets/placeholder images/bootcamp-2.webp";

export type CardSize = "small" | "medium" | "large";
export type StorefrontKind = "group-session" | "membership" | "package" | "content";

// The one shape every card speaks. Any catalog entry maps into this, so a single
// section can freely mix kinds and still render through one consistent card.
export type StorefrontItem = {
  id: string;
  kind: StorefrontKind;
  title: string;
  image?: string;
  meta: string;
  price: string;
  priceSuffix?: string;
  // Secondary line under the price in the small (row) style, e.g. "12 going".
  priceSub?: string;
  startingAt?: boolean;
  origPrice?: string;
  savePct?: number;
  href?: string;
  // Scheduled items (group sessions, workshops) carry a calendar chip.
  calendarDay?: string;
  calendarMonth?: string;
  // Overrides the customer-facing CTA label on the small (row) card, e.g.
  // "Register" for a free livestream instead of the default "Details".
  ctaLabel?: string;
};

export type SectionConfig = {
  id: string;
  title: string;
  cardSize: CardSize;
  itemIds: string[];
};

export const KIND_LABELS: Record<StorefrontKind, string> = {
  "group-session": "Group sessions",
  membership: "Memberships",
  package: "Packages",
  content: "Content",
};

export const CARD_SIZES: { value: CardSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

// ── Catalog ──────────────────────────────────────────────────────────────────

// Packages carry a bundled discount (origPrice); the cheap standalone guides
// don't — that split maps cleanly onto "Packages" vs "Content".
const PACKAGES: Offering[] = OFFERINGS.filter((o) => Boolean(o.origPrice));
const CONTENT: Offering[] = OFFERINGS.filter((o) => !o.origPrice);

const SESSION_ITEMS: StorefrontItem[] = [
  { id: "gs1", kind: "group-session", title: "MBA Strategy Live: R1 Game Plan", image: sessionImg1, meta: "Tue, Nov 18 · 5:00 PM PT · 1 hr", price: "$45", priceSub: "12 going", calendarDay: "18", calendarMonth: "Nov" },
  { id: "gs2", kind: "group-session", title: "Essay Teardown Workshop", image: sessionImg2, meta: "Thu, Nov 20 · 4:00 PM PT · 1.5 hr", price: "$60", priceSub: "8 going", calendarDay: "20", calendarMonth: "Nov" },
  { id: "gs3", kind: "group-session", title: "Mock Interview Group Session", image: sessionImg3, meta: "Mon, Nov 24 · 3:00 PM PT · 1 hr", price: "$75", priceSub: "18 going", calendarDay: "24", calendarMonth: "Nov" },
  { id: "gs4", kind: "group-session", title: "GMAT Quant Office Hours", image: sessionImg4, meta: "Wed, Nov 26 · 6:00 PM PT · 45 min", price: "$35", priceSub: "22 going", calendarDay: "26", calendarMonth: "Nov" },
  { id: "gs5", kind: "group-session", title: "Free Livestream: Inside an M7 Admit Decision", image: sessionImg2, meta: "Mon, Dec 1 · 6:00 PM PT · 1 hr", price: "Free", priceSub: "312 registered", calendarDay: "1", calendarMonth: "Dec" },
];

// Featured free livestreams — surfaced in a dedicated, locked section (not part
// of the expert-arranged sections). It pulls from the expert's scheduled
// livestreams, so the builder can reorder it but can't drop other offerings in.
// Always priced "Free" with a "Register" CTA.
export const FREE_LIVESTREAMS_SECTION_ID = "__free_livestreams__";
export const FREE_LIVESTREAMS_TITLE = "Free livestreams";
export const FREE_LIVESTREAMS: StorefrontItem[] = [
  { id: "ls1", kind: "group-session", title: "Inside an M7 Admit Decision", image: sessionImg2, meta: "Mon, Dec 1 · 6:00 PM PT · 1 hr", price: "Free", priceSub: "312 registered", ctaLabel: "Register", calendarDay: "1", calendarMonth: "Dec" },
  { id: "ls2", kind: "group-session", title: "Round 2 Essay Strategy, Live Q&A", image: sessionImg1, meta: "Thu, Dec 4 · 5:00 PM PT · 45 min", price: "Free", priceSub: "148 registered", ctaLabel: "Register", calendarDay: "4", calendarMonth: "Dec" },
  { id: "ls3", kind: "group-session", title: "Ask Me Anything: MBA Interviews", image: sessionImg3, meta: "Tue, Dec 9 · 4:00 PM PT · 1 hr", price: "Free", priceSub: "97 registered", ctaLabel: "Register", calendarDay: "9", calendarMonth: "Dec" },
];

const MEMBERSHIP_ITEMS: StorefrontItem[] = SUBSCRIPTIONS.map((p) => ({
  id: p.slug,
  kind: "membership" as const,
  title: p.title,
  image: p.image,
  meta: p.headline,
  price: `$${p.monthly}`,
  priceSuffix: "/mo",
  priceSub: `${p.members} members`,
}));

function offeringToItem(o: Offering, kind: StorefrontKind): StorefrontItem {
  return {
    id: o.slug,
    kind,
    title: o.title,
    image: o.image,
    meta: o.headline,
    price: o.price,
    priceSub: o.savePct != null ? `Save ${o.savePct}%` : undefined,
    startingAt: o.startingAt,
    origPrice: o.origPrice,
    savePct: o.savePct,
    href: `/offering/${o.slug}`,
  };
}

const PACKAGE_ITEMS: StorefrontItem[] = PACKAGES.map((o) => offeringToItem(o, "package"));
const CONTENT_ITEMS: StorefrontItem[] = CONTENT.map((o) => offeringToItem(o, "content"));

// Every item an expert can drop into a section, in picker order.
export const STOREFRONT_ITEMS: StorefrontItem[] = [
  ...SESSION_ITEMS,
  ...MEMBERSHIP_ITEMS,
  ...PACKAGE_ITEMS,
  ...CONTENT_ITEMS,
];

const BY_ID = new Map(STOREFRONT_ITEMS.map((i) => [i.id, i]));

export function getStorefrontItem(id: string): StorefrontItem | undefined {
  return BY_ID.get(id);
}

export function resolveItems(ids: string[]): StorefrontItem[] {
  return ids.map((id) => BY_ID.get(id)).filter((i): i is StorefrontItem => Boolean(i));
}

export function itemsByKind(kind: StorefrontKind): StorefrontItem[] {
  return STOREFRONT_ITEMS.filter((i) => i.kind === kind);
}

// Catch-all: every catalog item not explicitly placed in a section. Shown as a
// trailing "All offerings" section so nothing is ever lost — on the builder (so
// the expert can see what's unplaced) and on the public profile.
export const CATCH_ALL_TITLE = "All offerings";
export const CATCH_ALL_SIZE: CardSize = "large";

export function getUnassignedItems(sections: SectionConfig[]): StorefrontItem[] {
  const assigned = new Set(sections.flatMap((s) => s.itemIds));
  return STOREFRONT_ITEMS.filter((i) => !assigned.has(i.id));
}

// ── Default config + persistence ─────────────────────────────────────────────

// MBA ships a journey-based storefront — sections organized by where an
// applicant is in the process ("Essay help", "Interview prep") rather than by
// product type. It mixes all three card sizes, and deliberately leaves a few
// items unplaced so the "All offerings" catch-all is exercised.
const MBA_SECTIONS: SectionConfig[] = [
  { id: "mentorship", title: "Ongoing mentorship", cardSize: "medium", itemIds: ["mba-insider-membership", "premium-mentorship"] },
  { id: "guides", title: "Start with a guide", cardSize: "small", itemIds: ["how-i-got-into-stanford-gsb", "gmat-study-plan", "crafting-your-mba-resume"] },
  { id: "application", title: "Build your application", cardSize: "large", itemIds: ["mba-application-package", "essay-review-package", "school-selection-strategy", "10-hour-coaching-package"] },
  { id: "prep", title: "Interview & test prep", cardSize: "medium", itemIds: ["interview-prep-package", "gmat-exam-prep-bootcamp", "gs3", "gs4"] },
  { id: "live", title: "Live sessions & more", cardSize: "small", itemIds: ["gs1", "gs2", "gs5", "resume-cover-letter-package", "5-hour-quick-start-package", "consulting-recruiting-timeline"] },
];

// Generic fallback for categories without a bespoke storefront — organized by
// product type, showcasing all three card sizes.
const GENERIC_SECTIONS: SectionConfig[] = [
  { id: "group-sessions", title: "Upcoming group sessions", cardSize: "small", itemIds: SESSION_ITEMS.map((i) => i.id) },
  { id: "memberships", title: "Memberships", cardSize: "medium", itemIds: MEMBERSHIP_ITEMS.map((i) => i.id) },
  { id: "packages", title: "Packages", cardSize: "large", itemIds: PACKAGE_ITEMS.map((i) => i.id) },
  { id: "content", title: "Content", cardSize: "medium", itemIds: CONTENT_ITEMS.map((i) => i.id) },
];

// Per-category defaults. Management Consulting intentionally ships with NO
// sections, so every offering falls into the "All offerings" catch-all.
const DEFAULTS_BY_CATEGORY: Record<string, SectionConfig[]> = {
  mba: MBA_SECTIONS,
  "management-consulting": [],
};

export function getDefaultSections(category?: string): SectionConfig[] {
  if (category && category in DEFAULTS_BY_CATEGORY) return DEFAULTS_BY_CATEGORY[category];
  return GENERIC_SECTIONS;
}

// Back-compat alias — the generic, product-type defaults.
export const DEFAULT_SECTIONS = GENERIC_SECTIONS;

// Sections persist per category so each category keeps its own storefront.
const STORAGE_KEY = "storefrontSections";
const storageKey = (category?: string) => (category ? `${STORAGE_KEY}:${category}` : STORAGE_KEY);

function isSection(x: unknown): x is SectionConfig {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.title === "string" &&
    (s.cardSize === "small" || s.cardSize === "medium" || s.cardSize === "large") &&
    Array.isArray(s.itemIds) &&
    s.itemIds.every((id) => typeof id === "string")
  );
}

export function loadSections(category?: string): SectionConfig[] {
  try {
    const raw = localStorage.getItem(storageKey(category));
    if (raw == null) return getDefaultSections(category);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isSection)) return parsed as SectionConfig[];
  } catch {
    // fall through to defaults
  }
  return getDefaultSections(category);
}

export function saveSections(sections: SectionConfig[], category?: string): void {
  try {
    localStorage.setItem(storageKey(category), JSON.stringify(sections));
  } catch {
    // ignore (private mode / quota)
  }
}

export function resetSections(category?: string): void {
  try {
    localStorage.removeItem(storageKey(category));
  } catch {
    // ignore
  }
}

// The locked "Free livestreams" section isn't a real SectionConfig (its items
// aren't expert-arranged), so its slot among the sections is tracked on its own:
// an index into the sections list (0 = above the first section). Persisted per
// category like the sections themselves so a reordered demo survives a reload.
const LIVESTREAMS_POS_KEY = "storefrontLivestreamsPos";
const livestreamsPosKey = (category?: string) => (category ? `${LIVESTREAMS_POS_KEY}:${category}` : LIVESTREAMS_POS_KEY);

export function loadLivestreamsPos(category?: string): number {
  try {
    const raw = localStorage.getItem(livestreamsPosKey(category));
    if (raw != null) {
      const n = Number.parseInt(raw, 10);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  } catch {
    // fall through to default
  }
  return 0; // default: top of the storefront
}

export function saveLivestreamsPos(pos: number, category?: string): void {
  try {
    localStorage.setItem(livestreamsPosKey(category), String(pos));
  } catch {
    // ignore (private mode / quota)
  }
}
