import { useMemo } from "react";

import FollowList, { type FollowItem } from "./FollowList";
import { SharpStar } from "./flowUI";

/* ─────────────────────────────────────────────────────────────────────────
 * ExpertSuggestions (v2) — follow individual experts. Cells mirror the coach
 * card: avatar, name, role · company, and a stats line (rating · reviews ·
 * people helped). Built on FollowList.
 * ──────────────────────────────────────────────────────────────────────── */

const PHOTOS = import.meta.glob("../../../assets/profile photos/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function photoFor(pic: string): string | undefined {
  return PHOTOS[`../../../assets/profile photos/${pic}.png`];
}

type Expert = {
  name: string;
  tagline: string;
  pic: string;
  rating: number;
  reviews: number;
  helped: number;
};

const EXPERTS: Expert[] = [
  { name: "Priya Sharma", tagline: "HBS MBA · ex-McKinsey", pic: "pic-1", rating: 5.0, reviews: 214, helped: 480 },
  { name: "Marcus Chen", tagline: "PM at Google · Career Coach", pic: "pic-2", rating: 4.9, reviews: 168, helped: 350 },
  { name: "Elena Rodriguez", tagline: "Stanford GSB · VC at Sequoia", pic: "pic-3", rating: 5.0, reviews: 132, helped: 290 },
  { name: "David Okafor", tagline: "Ex-Goldman · IB interview coach", pic: "pic-4", rating: 4.8, reviews: 201, helped: 410 },
  { name: "Sarah Kim", tagline: "Product Lead at Stripe", pic: "pic-5", rating: 4.9, reviews: 97, helped: 220 },
  { name: "James Wilson", tagline: "Wharton MBA · Consulting", pic: "pic-6", rating: 5.0, reviews: 156, helped: 330 },
  { name: "Aisha Patel", tagline: "AI Engineer at OpenAI", pic: "pic-7", rating: 4.9, reviews: 88, helped: 190 },
  { name: "Michael Brown", tagline: "Med school advisor · Johns Hopkins", pic: "pic-8", rating: 4.8, reviews: 143, helped: 260 },
  { name: "Nina Alvarez", tagline: "Yale Law · BigLaw coach", pic: "pic-9", rating: 5.0, reviews: 119, helped: 240 },
  { name: "Tom Becker", tagline: "Founder · Y Combinator alum", pic: "pic-10", rating: 4.9, reviews: 76, helped: 160 },
  { name: "Grace Liu", tagline: "Growth Lead at Meta", pic: "pic-11", rating: 4.9, reviews: 134, helped: 300 },
  { name: "Omar Haddad", tagline: "Booth MBA · PE at KKR", pic: "pic-12", rating: 5.0, reviews: 108, helped: 230 },
];

function Avatar({ name, pic }: { name: string; pic: string }) {
  const url = photoFor(pic);
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-black/[0.06]"
      />
    );
  }
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[16px] font-semibold text-gray-dark ring-1 ring-black/[0.06]">
      {name.charAt(0)}
    </span>
  );
}

function ExpertMeta({ e }: { e: Expert }) {
  return (
    <>
      <span className="block truncate">{e.tagline}</span>
      <span className="mt-1 flex items-center gap-1.5 text-[13px]">
        <SharpStar size={12} className="text-yellow" />
        <span className="font-semibold text-gray-dark">{e.rating.toFixed(1)}</span>
        <span className="text-gray-light">({e.reviews})</span>
        <span className="text-gray-xlight">·</span>
        <span className="text-gray-light">{e.helped}+ helped</span>
      </span>
    </>
  );
}

export default function ExpertSuggestions(props: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}) {
  const items = useMemo<FollowItem[]>(
    () =>
      EXPERTS.map((e) => ({
        id: e.name,
        title: e.name,
        subtitle: <ExpertMeta e={e} />,
        media: <Avatar name={e.name} pic={e.pic} />,
      })),
    [],
  );

  return (
    <FollowList
      title="Experts to follow"
      purpose="fill your feed with their advice"
      doneText="Nice — you'll see their posts in your feed."
      searchPlaceholder="Search experts"
      items={items}
      {...props}
    />
  );
}
