/* ─────────────────────────────────────────────────────────────────────────
 * Onboarding — static content for the opener (Screen 1).
 * Mirrors the joinleland.com homepage hero (the design source of truth).
 * Goal/flow config lives in `goalConfig.ts` (added in build step 3).
 * ──────────────────────────────────────────────────────────────────────── */

/** Remote cloud hero video — the opener background. Autoplay / muted / looped. */
export const CLOUDS_VIDEO = "https://lebrain.joinleland.com/files/clouds-shortened";

/** AI Builder gradient background video — same asset the site uses. */
export const AI_GRADIENT_VIDEO =
  "https://lebrain.joinleland.com/files/ai-builder-program-gradient-background-video";

/** Shared "liquid glass" pill — opener goal buttons + interstitial Next.
 *  Real glass: transparent, only a whisper of blur, a specular top edge and a
 *  subtle sheen gradient — no frosted fog, no hard outline. */
export const GLASS_PILL =
  "flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-white/25 to-white/[0.06] py-3.5 text-[16px] font-medium text-white backdrop-blur-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(255,255,255,0.12),0_6px_20px_rgba(0,0,0,0.14)] transition-all hover:from-white/35 hover:to-white/[0.1]";

/** The three goal families surfaced as the branch point on Screen 1. */
export type Branch = "build-with-ai" | "grow-career" | "get-into-school";

export const HERO_COPY = {
  headline: "Own your future",
  subhead: "What would you like to do?",
  expertLink: "Become an expert",
  teamsLink: "Teams",
  teamsHref: "https://leland.ai",
};

export const REVIEW_STATS = {
  reviews: 31149,
  avg: 4.99,
  lastMonth: 2025,
};

/** Real org-logo SVGs served from joinleland.com — natural color, shown at
 *  50% opacity over the scrim, per-logo heights (matches the homepage bar). */
const ORG_LOGO_DEFS = [
  { name: "accenture", height: 24 },
  { name: "atlassian", height: 15 },
  { name: "bain", height: 20 },
  { name: "bcg", height: 18 },
  { name: "capital-one", height: 28 },
  { name: "coinbase", height: 18 },
  { name: "deloitte", height: 18 },
  { name: "ey", height: 28 },
  { name: "google", height: 20 },
  { name: "kearney", height: 14 },
  { name: "lek", height: 18 },
  { name: "linkedin", height: 22 },
  { name: "mckinsey", height: 21 },
  { name: "meta", height: 18 },
  { name: "salesforce", height: 30 },
  { name: "uber", height: 18 },
  { name: "yahoo", height: 18 },
] as const;

export const ORG_LOGOS = ORG_LOGO_DEFS.map(({ name, height }) => ({
  name,
  height,
  src: `https://www.joinleland.com/images/homepage/org-logos/${name}.svg`,
}));
