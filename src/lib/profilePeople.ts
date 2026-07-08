import { posts } from "../pages/Home";
import { COACH_CONFIGS } from "../pages/ProfileV2";
import { nameToSlug } from "./profileSlug";
import cover1 from "../assets/img/cover-images/cover-image-1.avif";
import cover2 from "../assets/img/cover-images/cover-image-2.png";
import cover3 from "../assets/img/cover-images/cover-image-3.png";
import cover4 from "../assets/img/cover-images/cover-image-4.png";
import cover5 from "../assets/img/cover-images/cover-image-5.png";
import cover6 from "../assets/img/cover-images/cover-image-6.png";
import cover7 from "../assets/img/cover-images/cover-image-7.png";
import cover8 from "../assets/img/cover-images/cover-image-8.png";
import cover9 from "../assets/img/cover-images/cover-image-9.png";
import cover10 from "../assets/img/cover-images/cover-image-10.png";

const COVERS = [cover1, cover2, cover3, cover4, cover5, cover6, cover7, cover8, cover9, cover10];

// Deterministic per-slug cover pick so a given person always gets the same
// (but effectively randomized across people) cover image.
function coverForSlug(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return COVERS[h % COVERS.length];
}

// Slugs that map to a full coach config (rich offerings/reviews content).
const SLUG_TO_COACH: Record<string, string> = {
  "samantha-parker": "samantha",
  "john-koelliker": "john",
};

export type ProfilePerson = {
  slug: string;
  name: string;
  avatar: string;
  headline?: string;
  /** Verified expert — defaults the template's Expert (coach) toggle on. */
  expert: boolean;
  /** Present when this person has a full coach config. */
  coachId?: string;
  cover: string;
};

const registry: Record<string, ProfilePerson> = {};

function add(name: string, avatar: string, headline: string | undefined, expert: boolean) {
  const slug = nameToSlug(name);
  if (!slug || registry[slug]) return;
  registry[slug] = {
    slug,
    name,
    avatar,
    headline,
    expert,
    coachId: SLUG_TO_COACH[slug],
    cover: coverForSlug(slug),
  };
}

// Build from the feed: each distinct author (and group poster) becomes a
// profile, carrying their verified status through as the Expert default.
for (const p of posts) {
  add(p.author, p.avatar, p.headline, Boolean(p.verified));
  if (p.groupPoster) add(p.groupPoster.name, p.groupPoster.avatar, p.groupPoster.headline, false);
}

// Ensure both full coach configs resolve (and are marked expert), even if they
// don't appear in the feed.
for (const [slug, coachId] of Object.entries(SLUG_TO_COACH)) {
  const c = COACH_CONFIGS[coachId];
  if (!registry[slug]) {
    registry[slug] = { slug, name: c.name, avatar: c.photo, expert: true, coachId, cover: coverForSlug(slug) };
  } else {
    registry[slug].coachId = coachId;
    registry[slug].expert = true;
  }
}

export function getProfilePerson(slug: string | undefined): ProfilePerson | undefined {
  return slug ? registry[slug] : undefined;
}
