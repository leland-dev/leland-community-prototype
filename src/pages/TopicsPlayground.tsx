import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import topicHash from "../assets/img/topic-hash.svg";
import verifiedIcon from "../assets/icons/verified-new.svg";
import pic1 from "../assets/profile photos/pic-1.png";

// ─── Topic / Community Treatments Playground ───────────
// A focused sandbox for exploring how a post surfaces the topic(s) — or, in the
// newer framing, the community/communities — it was posted into, especially on
// mobile and especially when there are MULTIPLE. Today the product shows this
// two ways (a blue inline topic in the header; muted "#Tag" chips under the
// body) and neither holds up past one. This page stress-tests a spread of
// directions against 1–5 communities and short vs. long names.

// ─── Sample data ───────────────────────────────────────
// Communities carry a brand color so color-coded treatments can lean on it.

interface Community {
  name: string;
  longName: string;
  color: string;
}

const COMMUNITIES: Community[] = [
  { name: "Breaking into Product", longName: "Breaking into Product Management", color: "#3963D7" },
  { name: "Career Growth", longName: "Early-Career Growth & Promotions", color: "#1F8A5B" },
  { name: "Interview Prep", longName: "Behavioral Interview Preparation", color: "#C2603A" },
  { name: "Resume Review", longName: "Resume & Portfolio Teardowns", color: "#7A4BC4" },
  { name: "Networking", longName: "Networking for Introverts", color: "#0E8FA8" },
];

const SAMPLE = {
  author: "Alex Rivera",
  avatar: pic1,
  time: "18m",
  verified: true,
  headline: "PM at Figma · Ex-Stripe",
  body:
    'The thing nobody tells you about breaking into PM: your "case study" is worth more than your resume. I got three first-round interviews off a 4-page teardown of a product I loved — zero off my polished one-pager. Show them how you think, don\'t just tell them where you worked.',
  likes: 156,
  comments: 27,
  reposts: 14,
};

// ─── Helpers ───────────────────────────────────────────

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const nameOf = (c: Community, long: boolean) => (long ? c.longName : c.name);
// Append a 2-digit hex alpha to a #RRGGBB color (e.g. tint("#3963D7", "14")).
const tint = (hex: string, alpha: string) => `${hex}${alpha}`;

// ─── Primitives ────────────────────────────────────────

function Chevron() {
  return (
    <svg className="shrink-0 text-gray-xlight" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// The muted hash glyph (defaults to the product's #869AA6; tintable per community).
function HashGlyph({ size = 15, color = "#869AA6" }: { size?: number; color?: string }) {
  return (
    <span
      aria-hidden
      className="shrink-0"
      style={{
        height: size,
        width: size,
        backgroundColor: color,
        maskImage: `url("${topicHash}")`,
        WebkitMaskImage: `url("${topicHash}")`,
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

function Dot({ color, size = 7 }: { color: string; size?: number }) {
  return <span aria-hidden className="inline-block shrink-0 rounded-full" style={{ height: size, width: size, backgroundColor: color }} />;
}

// A community-colored pill.
function ColorPill({ c, long }: { c: Community; long: boolean }) {
  return (
    <Link
      to={`/topic/${slug(c.name)}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex shrink-0 items-center gap-[5px] rounded-full px-[9px] py-[4px] text-[12.5px] font-medium leading-none transition-opacity hover:opacity-80"
      style={{ backgroundColor: tint(c.color, "14"), color: c.color }}
    >
      <Dot color={c.color} size={6} />
      <span className="whitespace-nowrap">{nameOf(c, long)}</span>
    </Link>
  );
}

// A reusable outlined pill (brand-neutral), optionally filled blue.
function OutlinePill({ name, filled }: { name: string; filled?: boolean }) {
  return (
    <Link
      to={`/topic/${slug(name)}`}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex shrink-0 items-center gap-[4px] rounded-full px-[9px] py-[3px] text-[12.5px] font-medium leading-none transition-colors ${
        filled ? "bg-[#EEF2FC] text-[#3963D7] hover:bg-[#E3EAFB]" : "border border-gray-stroke text-[#5E6E79] hover:bg-gray-hover"
      }`}
    >
      <HashGlyph size={13} />
      <span className="whitespace-nowrap">{name}</span>
    </Link>
  );
}

// The grid glyph — the consistent "communities" icon used for both the single
// and multiple states of the smart banner.
function CommunitiesIcon({ size = 14 }: { size?: number }) {
  return (
    <svg className="shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
  );
}

// The smart-summary banner, relocated INTO the content column so it inherits
// the post's content padding (aligned to the author name, not full-bleed).
// One community → its name; multiple → "Posted in N communities". The leading
// icon is the same double chat-bubble in both states.
//   fill  "tint"    — soft community-tinted fill
//         "outline" — white with a hairline community border
function SmartBanner({ cs, long, fill }: { cs: Community[]; long: boolean; fill: "tint" | "outline" }) {
  const primary = cs[0];
  const color = primary.color;
  const multi = cs.length > 1;
  const style =
    fill === "tint"
      ? { backgroundColor: tint(color, "12"), color }
      : { backgroundColor: "#fff", color, boxShadow: `inset 0 0 0 1px ${tint(color, "3D")}` };
  return (
    <button
      onClick={(e) => e.stopPropagation()}
      className="inline-flex max-w-full items-center gap-2 rounded-[10px] px-[11px] py-[7px] text-[13px] font-semibold leading-none transition-opacity hover:opacity-80"
      style={style}
    >
      <CommunitiesIcon size={14} />
      <span className="truncate">{multi ? `Posted in ${cs.length} communities` : nameOf(primary, long)}</span>
      {multi && <Chevron />}
    </button>
  );
}

// The same "Posted in N communities" summary, but as integrated text rather
// than a contained banner — no fill, no border, reads like post metadata.
//   mode  "count" — "Posted in 3 communities" (single → the name)
//         "named" — "Posted in A, B +1", names as color-keyed links
//   icon         — lead with the muted grid glyph
function IntegratedText({ cs, long, mode, icon, chevron }: { cs: Community[]; long: boolean; mode: "count" | "named"; icon?: boolean; chevron?: boolean }) {
  const multi = cs.length > 1;
  if (mode === "named") {
    const shown = cs.slice(0, 2);
    const extra = cs.length - shown.length;
    return (
      <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium leading-tight text-[#3963D7]">
        {icon && <CommunitiesIcon size={13} />}
        <span className="truncate">
          Posted in{" "}
          {shown.map((c, i) => (
            <span key={c.name}>
              {i > 0 && ", "}
              <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="hover:underline">{nameOf(c, long)}</Link>
            </span>
          ))}
          {extra > 0 && ` +${extra}`}
        </span>
      </span>
    );
  }
  const dynamic = multi ? `${cs.length} communities` : nameOf(cs[0], long);
  return (
    <button onClick={(e) => e.stopPropagation()} className="group flex min-w-0 items-center gap-1.5 text-[13px] font-medium leading-tight text-[#3963D7]">
      {icon && <CommunitiesIcon size={13} />}
      <span className="truncate group-hover:underline">Posted in {dynamic}</span>
      {chevron && (
        <svg className="-ml-1 shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      )}
    </button>
  );
}

function ActionRow() {
  const items = [
    { label: "Like", count: SAMPLE.likes, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
    ) },
    { label: "Comment", count: SAMPLE.comments, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" /></svg>
    ) },
    { label: "Repost", count: SAMPLE.reposts, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
    ) },
    { label: "Share", count: null, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
    ) },
  ];
  return (
    <div className="mt-2 flex items-center gap-6 text-gray-light">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5 text-[13px]">
          {it.icon}
          {it.count != null && <span>{it.count}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Treatments ────────────────────────────────────────
// `slot` says where the treatment draws:
//   inline  — grafts into the end of the name row (above body)
//   subline — a line under the author, above the body
//   banner  — a full-width strip above the author/avatar row
//   footer  — below the body, by the action row
// `accentRail` additionally tints the card's left edge with the primary color.

type Slot = "inline" | "subline" | "banner" | "footer";
type Group = "smart" | "text" | "today" | "new";

interface Treatment {
  id: string;
  name: string;
  group: Group;
  slot: Slot;
  accentRail?: boolean;
  note: string;
  render: (cs: Community[], long: boolean) => React.ReactNode;
}

const slotLabel: Record<Slot, string> = {
  inline: "In name row",
  subline: "Under name",
  banner: "Full-width banner",
  footer: "Below body",
};

const TREATMENTS: Treatment[] = [
  // ─── Smart summary, hug-content, in the content column ───
  // The two open questions laid out as a 2×2: filled vs. outlined, above vs.
  // below the body. All hug their text and sit inside the content padding.
  {
    id: "smart-filled-above",
    name: "Filled · above body",
    group: "smart",
    slot: "subline",
    note: "Soft community-tinted fill, just under the author. The most present of the four — clearly a distinct element, branded to the community color.",
    render: (cs, long) => <div className="mt-2"><SmartBanner cs={cs} long={long} fill="tint" /></div>,
  },
  {
    id: "smart-outlined-above",
    name: "Outlined · above body",
    group: "smart",
    slot: "subline",
    note: "White with a hairline community-colored border, just under the author. Quieter than the fill while still color-keyed; the border does the separating.",
    render: (cs, long) => <div className="mt-2"><SmartBanner cs={cs} long={long} fill="outline" /></div>,
  },
  {
    id: "smart-filled-below",
    name: "Filled · below body",
    group: "smart",
    slot: "footer",
    note: "The tinted fill dropped below the body, just above the actions — reads as a footer “where this lives” tag rather than a header.",
    render: (cs, long) => <SmartBanner cs={cs} long={long} fill="tint" />,
  },
  {
    id: "smart-outlined-below",
    name: "Outlined · below body",
    group: "smart",
    slot: "footer",
    note: "The outlined variant below the body — the lightest-touch of the four, sitting with the action row as quiet metadata.",
    render: (cs, long) => <SmartBanner cs={cs} long={long} fill="outline" />,
  },

  // ─── Integrated text (no banner) ───
  {
    id: "text-count-above",
    name: "Count · under author",
    group: "text",
    slot: "subline",
    note: "“Posted in 3 communities” as a plain muted sub-line under the author, with a trailing chevron to signal it's tappable. No box; reads as post metadata, like a byline detail.",
    render: (cs, long) => <div className="mt-0.5"><IntegratedText cs={cs} long={long} mode="count" chevron /></div>,
  },
  {
    id: "text-count-icon-above",
    name: "Count · grid icon · under author",
    group: "text",
    slot: "subline",
    note: "Same integrated line, but led by the muted grid glyph — keeps the icon from the banner versions while losing the container. Icon tints to the text gray, not a community color.",
    render: (cs, long) => <div className="mt-0.5"><IntegratedText cs={cs} long={long} mode="count" icon /></div>,
  },
  {
    id: "text-named-above",
    name: "Named · colored · under author",
    group: "text",
    slot: "subline",
    note: "“Posted in Breaking into Product, Career Growth +1” — the names themselves are the color-keyed links. Most descriptive; names stay visible until it overflows to “+N”.",
    render: (cs, long) => <div className="mt-0.5"><IntegratedText cs={cs} long={long} mode="named" /></div>,
  },
  {
    id: "text-count-below",
    name: "Count · below body",
    group: "text",
    slot: "footer",
    note: "The plain “Posted in 3 communities” line dropped below the body, sitting with the action row as quiet metadata rather than a header detail.",
    render: (cs, long) => <IntegratedText cs={cs} long={long} mode="count" />,
  },
  {
    id: "text-count-icon-below",
    name: "Count · grid icon · below body",
    group: "text",
    slot: "footer",
    note: "The blue count line below the body, led by the grid icon — the icon + below-body combination, bridging the integrated text with the icon from the banner versions.",
    render: (cs, long) => <IntegratedText cs={cs} long={long} mode="count" icon />,
  },

  // ─── Today & refinements ───
  {
    id: "inline-primary",
    name: "Inline primary + overflow",
    group: "today",
    slot: "inline",
    note: "Today's blue inline topic, evolved: only the first sits inline; the rest collapse into a tappable “+N”. One clean line at any count — but hides all but one.",
    render: (cs) => {
      const [first, ...rest] = cs;
      return (
        <span className="flex min-w-0 items-center gap-2">
          <Chevron />
          <Link to={`/topic/${slug(first.name)}`} onClick={(e) => e.stopPropagation()} className="truncate text-[15px] font-semibold leading-tight text-[#3963D7] hover:underline">
            {first.name}
          </Link>
          {rest.length > 0 && (
            <span className="shrink-0 rounded-full bg-[#EEF2FC] px-[7px] py-[2px] text-[12px] font-semibold leading-none text-[#3963D7]">+{rest.length}</span>
          )}
        </span>
      );
    },
  },
  {
    id: "meta-line",
    name: "Meta line under name",
    group: "today",
    slot: "subline",
    note: "A muted “in A · B · C” line under the author, truncated with an ellipsis. Reads like metadata, never wraps — but competes with the headline for the sub-line.",
    render: (cs, long) => (
      <span className="mt-0.5 flex min-w-0 items-center gap-1 text-[13px] leading-tight text-[#5E6E79]">
        <span className="shrink-0 text-gray-xlight">in</span>
        <span className="truncate">
          {cs.map((c, i) => (
            <span key={c.name}>
              {i > 0 && <span className="text-gray-xlight"> · </span>}
              <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="font-medium text-[#3963D7] hover:underline">{nameOf(c, long)}</Link>
            </span>
          ))}
        </span>
      </span>
    ),
  },
  {
    id: "chips-wrap",
    name: "Chips — wrap (today)",
    group: "today",
    slot: "footer",
    note: "Today's footer treatment: muted #chips that wrap to as many rows as needed. Shows everything, but 3+ long names grow the card and muddy the action row.",
    render: (cs, long) => (
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {cs.map((c) => (
          <Link key={c.name} to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="group inline-flex items-center gap-[4px] text-[14px] font-medium text-[#5E6E79]">
            <HashGlyph />
            <span className="group-hover:underline">{nameOf(c, long)}</span>
          </Link>
        ))}
      </div>
    ),
  },
  {
    id: "chips-scroll",
    name: "Chips — one-line scroll",
    group: "today",
    slot: "footer",
    note: "Chips on a single horizontally-scrolling row with an edge fade. Fixed height at any count; everything stays reachable by swipe — but off-screen topics are easy to miss.",
    render: (cs, long) => (
      <div className="relative -mx-1">
        <div className="flex gap-2 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cs.map((c) => <OutlinePill key={c.name} name={nameOf(c, long)} />)}
          <span className="shrink-0 pr-3" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </div>
    ),
  },
  {
    id: "pills-cap",
    name: "Pills — capped + more",
    group: "today",
    slot: "footer",
    note: "Up to two pills, then a “+N more” that could open a sheet. Guarantees one row at any count and keeps the primary communities visible.",
    render: (cs, long) => {
      const shown = cs.slice(0, 2);
      const extra = cs.length - shown.length;
      return (
        <div className="flex flex-wrap items-center gap-2">
          {shown.map((c) => <OutlinePill key={c.name} name={nameOf(c, long)} filled />)}
          {extra > 0 && (
            <button onClick={(e) => e.stopPropagation()} className="inline-flex shrink-0 items-center rounded-full border border-gray-stroke px-[9px] py-[4px] text-[12.5px] font-medium leading-none text-[#5E6E79] transition-colors hover:bg-gray-hover">+{extra} more</button>
          )}
        </div>
      );
    },
  },

  // ─── New directions ───
  {
    id: "banner-summary",
    name: "Banner — smart summary",
    group: "new",
    slot: "banner",
    note: "The original full-bleed placement — a strip across the whole card top. Great in isolation, but in a feed of many posts it reads as a stack of colored bars. Superseded by the in-content version in the first section.",
    render: (cs, long) => {
      if (cs.length === 1) {
        const c = cs[0];
        return (
          <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: tint(c.color, "12"), color: c.color }}>
            <HashGlyph size={14} color={c.color} />
            <span className="truncate">{nameOf(c, long)}</span>
          </Link>
        );
      }
      const primary = cs[0];
      return (
        <button onClick={(e) => e.stopPropagation()} className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: tint(primary.color, "12"), color: primary.color }}>
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
            Posted in {cs.length} communities
          </span>
          <Chevron />
        </button>
      );
    },
  },
  {
    id: "banner-chips",
    name: "Banner — community chips",
    group: "new",
    slot: "banner",
    note: "A full-width strip above the author holding color-coded community pills on one scrolling row. Separates “where this lives” from “who posted it,” and color keys each community.",
    render: (cs, long) => (
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-stroke/70 bg-[#FAFBFC] px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cs.map((c) => <ColorPill key={c.name} c={c} long={long} />)}
        <span className="shrink-0 pr-2" />
      </div>
    ),
  },
  {
    id: "gradient-spine",
    name: "Gradient spine",
    group: "new",
    slot: "banner",
    note: "A hairline bar at the very top: solid color for one community, a gradient blending each community's color for many — multiplicity encoded with zero text. A quiet name line sits under it.",
    render: (cs, long) => (
      <div>
        <div className="h-[3px] w-full" style={{ background: cs.length === 1 ? cs[0].color : `linear-gradient(90deg, ${cs.map((c) => c.color).join(", ")})` }} />
        <div className="flex items-center gap-1.5 px-4 pt-2 text-[13px]">
          <span className="truncate">
            {cs.map((c, i) => (
              <span key={c.name}>
                {i > 0 && <span className="text-gray-xlight"> · </span>}
                <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline" style={{ color: c.color }}>{nameOf(c, long)}</Link>
              </span>
            ))}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "accent-rail",
    name: "Left accent rail",
    group: "new",
    slot: "subline",
    accentRail: true,
    note: "The card's left edge is tinted to the primary community's color, with a small label row below the author. Color does the heavy lifting; the label stays short even with many.",
    render: (cs, long) => (
      <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] leading-tight">
        <span className="truncate font-medium" style={{ color: cs[0].color }}>{nameOf(cs[0], long)}</span>
        {cs.length > 1 && <span className="shrink-0 text-gray-xlight">+{cs.length - 1} more</span>}
      </span>
    ),
  },
  {
    id: "stacked-badges",
    name: "Stacked community badges",
    group: "new",
    slot: "subline",
    note: "Overlapping color badges (one initial each) under the author, then the primary name + “+N”. Scannable, visual, and it scales by simply adding another badge.",
    render: (cs, long) => (
      <div className="mt-1 flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {cs.map((c) => (
            <span key={c.name} className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-[1.5px] border-white text-[10px] font-semibold text-white" style={{ backgroundColor: c.color }}>
              {c.name[0]}
            </span>
          ))}
        </div>
        <span className="truncate text-[13px] text-[#5E6E79]">
          {nameOf(cs[0], long)}
          {cs.length > 1 && <span className="text-gray-xlight"> +{cs.length - 1}</span>}
        </span>
      </div>
    ),
  },
  {
    id: "crosspost",
    name: "Crosspost line",
    group: "new",
    slot: "subline",
    note: "Reddit-style framing: “also posted in …”. One community reads “in X”; many read as a crosspost. Feels native to anyone who's used community platforms.",
    render: (cs, long) => {
      const verb = cs.length === 1 ? "in" : "also in";
      return (
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] leading-tight text-[#5E6E79]">
          <svg className="shrink-0 text-gray-xlight" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
          <span className="shrink-0 text-gray-xlight">{verb}</span>
          <span className="truncate">
            {cs.map((c, i) => (
              <span key={c.name}>
                {i > 0 && <span className="text-gray-xlight">, </span>}
                <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="font-medium text-gray-dark hover:underline">{nameOf(c, long)}</Link>
              </span>
            ))}
          </span>
        </span>
      );
    },
  },
  {
    id: "shared-to",
    name: "Footer — “Shared to”",
    group: "new",
    slot: "footer",
    note: "A quiet footer line: colored dots + “Shared to A, B +1”. Lives with the action row as metadata, color-keys each community, and collapses past two names.",
    render: (cs, long) => {
      const shown = cs.slice(0, 2);
      const extra = cs.length - shown.length;
      return (
        <div className="flex items-center gap-2 text-[13px] text-[#5E6E79]">
          <span className="shrink-0 text-gray-xlight">Shared to</span>
          <span className="flex min-w-0 items-center gap-1 truncate">
            {shown.map((c, i) => (
              <span key={c.name} className="inline-flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-xlight">·</span>}
                <Dot color={c.color} />
                <Link to={`/topic/${slug(c.name)}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline">{nameOf(c, long)}</Link>
              </span>
            ))}
            {extra > 0 && <span className="shrink-0 text-gray-xlight">+{extra} more</span>}
          </span>
        </div>
      );
    },
  },
];

// ─── Post card ─────────────────────────────────────────

function PostCard({ treatment, communities, long }: { treatment: Treatment; communities: Community[]; long: boolean }) {
  const { slot } = treatment;
  const accent = treatment.accentRail ? communities[0].color : undefined;
  return (
    <div className="bg-white" style={accent ? { borderLeft: `3px solid ${accent}` } : undefined}>
      {slot === "banner" && treatment.render(communities, long)}
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-3">
          <img src={SAMPLE.avatar} alt={SAMPLE.author} className="h-10 w-10 shrink-0 rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-[15px] font-semibold leading-tight text-gray-dark">{SAMPLE.author}</span>
              {SAMPLE.verified && <img src={verifiedIcon} alt="" className="h-[15px] w-[15px] shrink-0" />}
              {slot === "inline" && treatment.render(communities, long)}
              <span className="shrink-0 text-[15px] leading-tight text-gray-extra-light">{SAMPLE.time}</span>
            </div>
            <p className="mt-0.5 truncate text-[13px] leading-tight text-[#707070]">{SAMPLE.headline}</p>
            {slot === "subline" && treatment.render(communities, long)}
            <p className="mt-1.5 text-[15px] leading-[1.45] text-gray-dark">{SAMPLE.body}</p>
            {slot === "footer" && <div className="mt-2.5">{treatment.render(communities, long)}</div>}
            <ActionRow />
          </div>
        </div>
      </div>
    </div>
  );
}

// A 390px-wide phone column so every treatment is judged at real mobile width.
function PhoneFrame({ treatment, communities, long }: { treatment: Treatment; communities: Community[]; long: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-gray-dark">{treatment.name}</h3>
        <span className="shrink-0 rounded-full bg-[#F0F2F1] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#5E6E79]">{slotLabel[treatment.slot]}</span>
      </div>
      <div className="w-[390px] max-w-full overflow-hidden rounded-[20px] border border-gray-stroke bg-white shadow-[0_12px_28px_-10px_rgba(16,24,40,0.12)]">
        <PostCard treatment={treatment} communities={communities} long={long} />
      </div>
      <p className="mt-2.5 w-[390px] max-w-full text-[13px] leading-[1.45] text-[#707070]">{treatment.note}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────

const SECTIONS: { group: Group; title: string; blurb: string }[] = [
  { group: "smart", title: "Smart summary — hug content, in the content column", blurb: "The chosen direction. Two open calls laid out as a 2×2: filled vs. outlined, above vs. below the body. All hug their text, sit inside the content padding, and lead with the grid icon in both the single and multi-community states." },
  { group: "text", title: "Integrated text — no banner", blurb: "The same “Posted in N communities” summary, but as plain post metadata instead of a contained element — no fill or border. Explores count vs. named communities, with/without the grid icon, above vs. below the body." },
  { group: "today", title: "Today & refinements", blurb: "What's live now, plus tighter variants that keep the same slot." },
  { group: "new", title: "Other directions", blurb: "The rest of the earlier explorations for reference — including the original full-bleed banner, kept to contrast against the in-content version above." },
];

export default function TopicsPlayground() {
  useEffect(() => { document.title = "Playground: Communities on a post"; }, []);
  const [count, setCount] = useState(3);
  const [long, setLong] = useState(false);

  const communities = COMMUNITIES.slice(0, count);

  return (
    <PageShell variant="thin">
      <Link to="/components" className="inline-block rounded-[4px] border border-[#E5E5E5] bg-[#F5F5F5] px-2 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#707070] transition-colors hover:bg-[#EBEBEB]">&lt;PLAYGROUND&gt;</Link>
      <h1 className="mt-1 text-[38px] font-medium text-gray-dark" style={{ fontWeight: 500 }}>Communities on a post</h1>
      <p className="mt-1 max-w-[640px] text-[16px] text-[#707070]">
        A post can be filed into several communities at once. We've landed on the smart-summary banner — one community shows its name, multiple collapse to “Posted in N communities” — and relocated it into the post's content column so it never sits as a full-bleed bar across the card top. Dial the controls to compare placement and weight.
      </p>

      {/* Controls */}
      <div className="sticky top-0 z-10 mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[16px] border border-gray-stroke bg-white/90 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-dark">Communities on post</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setCount(n)} className={`h-8 w-8 cursor-pointer rounded-full text-[13px] font-medium transition-colors ${count === n ? "bg-[#222222] text-white" : "bg-[#f5f5f5] text-[#222222] hover:bg-[#ebebeb]"}`}>{n}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-dark">Names</span>
          <div className="flex rounded-full bg-[#f5f5f5] p-0.5">
            {[{ k: false, label: "Short" }, { k: true, label: "Long" }].map((o) => (
              <button key={o.label} onClick={() => setLong(o.k)} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${long === o.k ? "bg-white text-[#222222] shadow-sm" : "text-[#707070] hover:text-[#222222]"}`}>{o.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery, grouped */}
      {SECTIONS.map((section) => (
        <section key={section.group} className="mt-12">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9A9A9A]">{section.title}</h2>
          <p className="mt-1 max-w-[560px] text-[14px] text-[#707070]">{section.blurb}</p>
          <div className="mt-7 flex flex-wrap gap-x-10 gap-y-12">
            {TREATMENTS.filter((t) => t.group === section.group).map((t) => (
              <PhoneFrame key={t.id} treatment={t} communities={communities} long={long} />
            ))}
          </div>
        </section>
      ))}

      <div className="h-20" />
    </PageShell>
  );
}
