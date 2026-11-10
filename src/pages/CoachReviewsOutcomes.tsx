import { useEffect, useState } from "react";
import { ReviewsSummary } from "./CoachReviews";
import { IconStar } from "../components/leland/svg/icons";
import { Button } from "../components/Button";
import starOutlineIcon from "../assets/icons/star-icon.svg";
import targetIcon from "../assets/icons/Target.1.svg";

import abhiPhoto from "../assets/profile photos/pic-2.png";
import neilPhoto from "../assets/profile photos/pic-9.png";
import priyaPhoto from "../assets/profile photos/pic-1.png";
import danielPhoto from "../assets/profile photos/pic-3.png";
import sophiaPhoto from "../assets/profile photos/pic-7.png";
import elenaPhoto from "../assets/profile photos/pic-11.png";

import gsbLogo from "../assets/logos/gsb.png";
import kelloggLogo from "../assets/org-logos/kellogg.png";
import mitSloanLogo from "../assets/org-logos/mit-sloan.png";
import hbsLogo from "../assets/org-logos/hbs.png";
import mckinseyLogo from "../assets/logos/mckinsey.png";

// ---------------------------------------------------------------------------
// A client may have a review, an outcome, both, or neither. Each client is an
// accordion row that expands to reveal both — with empty states where missing.
// ---------------------------------------------------------------------------
type ClientReview = { rating: number; title?: string; body?: string; date: string };
type ClientOutcome = { label: string; logo?: string; date: string };
type Client = { id: string; name: string; avatar?: string; review?: ClientReview; outcome?: ClientOutcome };

const CLIENTS: Client[] = [
  {
    id: "zack",
    name: "Zack G.",
    review: { rating: 5, title: "Stop searching — Ben will get you admitted.", body: "Specific, tactical feedback and no bullshit. His superpower is essay writing, but he ties the whole application into one cohesive story.", date: "Apr 2025" },
    outcome: { label: "Admitted to Stanford GSB", logo: gsbLogo, date: "Apr 2025" },
  },
  {
    id: "abhi",
    name: "Abhi V.",
    avatar: abhiPhoto,
    review: { rating: 5, title: "Life-changing MBA coach", body: "Ben helped me articulate my experiences in a way that felt authentic and compelling. Landed one of my dream programs.", date: "Dec 2025" },
    outcome: { label: "Admitted to Kellogg", logo: kelloggLogo, date: "Dec 2025" },
  },
  {
    id: "priya",
    name: "Priya S.",
    avatar: priyaPhoto,
    review: { rating: 5, title: "Pointed, personalised advice", body: "Reworked my resume two days before deadlines and made it spectacular. Managed my expectations the whole way.", date: "Mar 2026" },
    // No outcome logged yet.
  },
  {
    id: "daniel",
    name: "Daniel K.",
    avatar: danielPhoto,
    // No review left yet.
    outcome: { label: "Offer from McKinsey & Company", logo: mckinseyLogo, date: "Feb 2026" },
  },
  {
    id: "neil",
    name: "Neil T.",
    avatar: neilPhoto,
    review: { rating: 2, title: "Great essay feedback, lighter on strategy", body: "Excellent at line-by-line editing. I felt less supported on holistic strategy — school selection and positioning.", date: "May 2026" },
    outcome: { label: "Admitted to MIT Sloan", logo: mitSloanLogo, date: "May 2026" },
  },
  {
    id: "sophia",
    name: "Sophia L.",
    avatar: sophiaPhoto,
    // Review requested but not left.
    outcome: { label: "Admitted to Harvard Business School", logo: hbsLogo, date: "Jan 2026" },
  },
  {
    id: "marcus",
    name: "Marcus T.",
    review: { rating: 5, title: "10/10 experience", body: "Detailed feedback across six programs. He understands what each school is looking for and tailors accordingly.", date: "Nov 2025" },
    // No outcome logged yet.
  },
  {
    id: "elena",
    name: "Elena R.",
    avatar: elenaPhoto,
    // Neither — the all-empty case.
  },
];

const INITIALS_COLORS = ["#B85A2B", "#869AA6", "#1F5340", "#9685A8", "#80ACED"];
function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  if (avatar) return <img src={avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />;
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: colorFor(name) }}>
      {initialsFor(name)}
    </div>
  );
}

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar key={i} className={`${className} ${i < rating ? "text-[#FDB022]" : "text-gray-stroke"}`} />
      ))}
    </div>
  );
}

// Custom dashed outline — mirrors the Inbox goal card's empty-outcome state.
const DASHED_OUTLINE =
  "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")";

// A logged outcome — green pill matching the Inbox goal card.
function OutcomePanel({ outcome }: { outcome: ClientOutcome }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#E6F4EC] px-4 py-3.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1F7A47] text-white">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </span>
      <p className="text-[14px] font-medium text-[#176B46]">{outcome.label}</p>
    </div>
  );
}

// Empty-outcome state below a review — icon + text left, CTA right.
function EmptyOutcome({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[12px] bg-[#222222]/[0.04] px-5 py-4" style={{ backgroundImage: DASHED_OUTLINE }}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="h-5 w-5 shrink-0 bg-current text-gray-light"
          style={{
            maskImage: `url("${targetIcon}")`,
            WebkitMaskImage: `url("${targetIcon}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
        <p className="text-[14px] text-gray-light">{firstName} hasn't logged an outcome yet</p>
      </div>
      <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 !font-semibold">
        Add an outcome
      </Button>
    </div>
  );
}

// Empty-review state — icon + text left, CTA right.
function EmptyReview({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-[12px] bg-[#222222]/[0.04] px-5 py-4" style={{ backgroundImage: DASHED_OUTLINE }}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="h-5 w-5 shrink-0 bg-current text-gray-light"
          style={{
            maskImage: `url("${starOutlineIcon}")`,
            WebkitMaskImage: `url("${starOutlineIcon}")`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        />
        <p className="text-[14px] text-gray-light">{firstName} hasn't left a review yet</p>
      </div>
      <Button size="sm" variant="secondary" rounded="rounded-full" className="shrink-0 !font-semibold">
        Request a review
      </Button>
    </div>
  );
}

// One client — their review (or empty-review prompt) and outcome (or empty).
function ClientCard({ client }: { client: Client }) {
  const firstName = client.name.split(/\s+/)[0];
  return (
    <div className="border-b border-gray-stroke py-7">
      <div className="flex items-center gap-3">
        <Avatar name={client.name} avatar={client.avatar} />
        <p className="text-[16px] font-medium text-gray-dark">{client.name}</p>
      </div>

      {/* Review */}
      <div className="mt-4">
        {client.review ? (
          <>
            <div className="flex items-center gap-2.5">
              <Stars rating={client.review.rating} className="h-[18px] w-[18px]" />
              <span className="text-[13px] text-gray-light">{client.review.date}</span>
            </div>
            {client.review.title && <p className="mt-2.5 text-[16px] font-semibold leading-snug text-gray-dark">{client.review.title}</p>}
            {client.review.body && <p className="mt-1.5 text-[15px] leading-relaxed text-gray-dark">{client.review.body}</p>}
          </>
        ) : (
          <EmptyReview firstName={firstName} />
        )}
      </div>

      {/* Outcome */}
      <div className="mt-4">
        {client.outcome ? <OutcomePanel outcome={client.outcome} /> : <EmptyOutcome firstName={firstName} />}
      </div>
    </div>
  );
}

type FilterKey = "all" | "no-review" | "no-outcome";
const FILTERS: { key: FilterKey; label: string; match: (c: Client) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "no-review", label: "Haven't reviewed", match: (c) => !c.review },
  { key: "no-outcome", label: "No outcome", match: (c) => !c.outcome },
];

export default function CoachReviewsOutcomes() {
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    document.title = "Leland Prototype | Reviews & Outcomes";
  }, []);

  const active = FILTERS.find((f) => f.key === filter)!;
  const visible = CLIENTS.filter(active.match);

  return (
    <div className="mx-auto max-w-[1080px]">
      {/* Aggregate review + outcome summary — shared with the Reviews page. */}
      <ReviewsSummary />

      {/* Pivot filter bar */}
      <div className="mt-10 border-b border-gray-stroke">
        <div className="flex gap-8">
          {FILTERS.map((f) => {
            const count = CLIENTS.filter(f.match).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-[16px] transition-colors ${
                  filter === f.key ? "border-gray-dark font-medium text-gray-dark" : "border-transparent font-medium text-gray-light hover:text-gray-dark"
                }`}
              >
                {f.label}
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-hover px-1.5 text-[12px] font-medium text-gray-extra-light">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client list */}
      <div>
        {visible.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        {visible.length === 0 && <div className="py-16 text-center text-[16px] text-gray-light">No clients here.</div>}
      </div>
    </div>
  );
}
