import { useEffect, useRef, useState } from "react";
import {
  Plus,
  MoreVertical,
  Share2,
  ChevronRight,
  Copy,
  Pencil,
  Trash2,
  Send,
  ImageIcon,
  Store,
} from "lucide-react";
import { Button } from "../components/Button";
import MaskIcon from "../components/MaskIcon";
import AddToOfferingModal from "../components/AddToOfferingModal";
import infoFilled from "../assets/icons/info-filled.svg";
import profilePhoto from "../assets/profile photos/profile photo.png";
import coachPhoto from "../assets/profile photos/pic-2.png";
import eventThumb01 from "../assets/placeholder images/placeholder-event-01.png";
import eventThumb02 from "../assets/placeholder images/placeholder-event-02.png";
import eventThumb03 from "../assets/placeholder images/placeholder-event-03.png";
import bootcamp1 from "../assets/placeholder images/bootcamp-1.webp";
import bootcamp2 from "../assets/placeholder images/bootcamp-2.webp";
import courseC10 from "../assets/placeholder images/courses/c10-hero-1920x1280.webp";
import coursePe from "../assets/placeholder images/courses/pe-recruiting-bootcamp.png";
import courseSystems from "../assets/placeholder images/courses/HERO-5-systems-that-turn-your-expertise-min.avif";

// A workshop is a paid livestream, so every event here carries a price. The data
// shape mirrors CoachLivestreams' EventItem minus the free/paid union — plus the
// set of offering slugs the workshop has been added to (empty = profile-only).
type HostPerson = { name: string; avatar: string };
type Host = { kind: "people"; people: HostPerson[] } | { kind: "leland" };

type Status = { kind: "draft" } | { kind: "enrolled"; count: number };

type WorkshopItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: string;
  price: string;
  thumb?: string;
  host: Host;
  status: Status;
  offerings: string[]; // offering slugs this workshop is attached to
  joinable?: boolean; // upcoming: show "Join now" instead of the countdown
  startsIn?: string; // upcoming: label for the disabled countdown button
};

const YOU: HostPerson = { name: "Jane Doe", avatar: profilePhoto };

const upcoming: WorkshopItem[] = [
  {
    id: "case-math-intensive",
    title: "Case Math Intensive: Mental Math Drills for the Case Interview",
    date: "Oct 28, 2025",
    startTime: "11:30 AM PST",
    duration: "1 hr 30 min",
    price: "$79",
    thumb: courseSystems,
    host: { kind: "people", people: [YOU] },
    status: { kind: "enrolled", count: 18 },
    offerings: ["interview-prep-package"],
    startsIn: "7d",
  },
  {
    id: "essay-teardown",
    title: "Live Essay Teardown: Rewriting Real MBA Essays Together",
    date: "Oct 24, 2025",
    startTime: "4:00 PM PST",
    duration: "1 hr",
    price: "$49",
    thumb: eventThumb02,
    host: { kind: "people", people: [YOU, { name: "Marcus Lee", avatar: coachPhoto }] },
    status: { kind: "enrolled", count: 31 },
    offerings: [],
    joinable: true,
  },
  {
    id: "pm-portfolio-draft",
    title: "Build Your PM Portfolio: A Hands-On Working Session",
    date: "Nov 3, 2025",
    startTime: "9:00 AM PST",
    duration: "2 hours",
    price: "$99",
    thumb: eventThumb01,
    host: { kind: "people", people: [YOU] },
    status: { kind: "draft" },
    offerings: [],
    startsIn: "13d",
  },
];

// Upcoming workshops are shown soonest-first, so whatever is live/next (the
// "Join now" row) sits at the top.
const upcomingSorted = [...upcoming].sort(
  (a, b) => Date.parse(`${a.date} ${a.startTime}`) - Date.parse(`${b.date} ${b.startTime}`),
);

const pastThumbs = [bootcamp1, coursePe, eventThumb03, bootcamp2, courseC10];
const pastPrices = ["$49", "$99", "$59", "$149", "$49"];
const pastTitles = [
  "Behavioral Interview Bootcamp: Building Your Story Bank",
  "From Analyst to Associate: A Live PE Recruiting Workshop",
  "Essays That Get You In: A Hands-On Writing Session",
  "GSB Interview Simulation: Live Mock + Group Feedback",
  "Recommendation Strategy: Briefing Your Recommenders",
];

const past: WorkshopItem[] = pastTitles.map((title, i) => ({
  id: `past-${i}`,
  title,
  date: "Sep 20, 2025",
  startTime: "11:30 AM PST",
  duration: "1 hr",
  price: pastPrices[i],
  thumb: pastThumbs[i],
  host: { kind: "people", people: [YOU] },
  status: { kind: "enrolled", count: 42 },
  offerings: [],
}));

type MenuItem = { label: string; icon: React.ReactNode; disabled?: boolean; onClick?: () => void };

function Thumbnail({ item }: { item: WorkshopItem }) {
  if (!item.thumb) {
    return (
      <div className="flex h-[60px] w-[100px] shrink-0 items-center justify-center rounded-md bg-[#D9D9D9] text-white">
        <ImageIcon size={22} strokeWidth={1.75} />
      </div>
    );
  }
  return (
    <img src={item.thumb} alt="" className="h-[60px] w-[100px] shrink-0 rounded-md object-cover" />
  );
}

function PriceTag({ price }: { price: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[#FBEFC9] px-2.5 py-0.5 text-[12px] font-semibold text-[#7A5E00]">
      {price}
    </span>
  );
}

// Small indicator that a workshop is already included in one or more offerings.
function OfferingTag({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="hidden shrink-0 items-center gap-1 rounded-full bg-[#EEF4FB] px-2.5 py-0.5 text-[12px] font-semibold text-[#35506E] sm:inline-flex">
      <Store size={12} />
      In {count} offering{count === 1 ? "" : "s"}
    </span>
  );
}

function HostAvatar({ src, name }: { src: string; name: string }) {
  return (
    <span className="group/avatar relative inline-flex">
      <img src={src} alt={name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-dark px-2 py-1 text-[12px] font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/avatar:opacity-100">
        {name}
      </span>
    </span>
  );
}

function HostCell({ host }: { host: Host }) {
  return (
    <div className="hidden w-[140px] shrink-0 items-center justify-center lg:flex">
      {host.kind === "people" && (
        <div className="flex -space-x-2">
          {host.people.map((p) => (
            <HostAvatar key={p.name} src={p.avatar} name={p.name} />
          ))}
        </div>
      )}
    </div>
  );
}

const parsePrice = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;

// Earnings column: amount earned from this workshop (price × enrolled) stacked
// over the enrolled count. A draft hasn't earned anything yet.
function EarningsCell({ item }: { item: WorkshopItem }) {
  const enrolled = item.status.kind === "enrolled" ? item.status.count : 0;
  const earned = parsePrice(item.price) * enrolled;
  return (
    <div className="hidden w-[110px] shrink-0 md:block">
      <div className="text-[15px] font-semibold text-gray-dark">${earned.toLocaleString()}</div>
      <div className="text-[13px] text-gray-light">{enrolled} enrolled</div>
    </div>
  );
}

function RowMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="More actions"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
          open ? "bg-gray-hover text-gray-dark" : "text-gray-xlight hover:bg-gray-hover hover:text-gray-dark"
        }`}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-60 rounded-xl border border-gray-stroke bg-white p-2 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                setOpen(false);
                item.onClick?.();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-medium transition-colors ${
                item.disabled
                  ? "cursor-default text-gray-xlight"
                  : "text-gray-dark hover:bg-gray-hover"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionCell({ item, past, onAddToOffering }: { item: WorkshopItem; past: boolean; onAddToOffering: () => void }) {
  const menu: MenuItem[] = past
    ? [
        { label: "Add to an offering", icon: <Store size={18} />, onClick: onAddToOffering },
        { label: "Share", icon: <Share2 size={18} /> },
        { label: "Duplicate", icon: <Copy size={18} /> },
      ]
    : [
        { label: "Add to an offering", icon: <Store size={18} />, onClick: onAddToOffering },
        { label: "Edit", icon: <Pencil size={18} /> },
        { label: "Duplicate", icon: <Copy size={18} /> },
        { label: "Share", icon: <Share2 size={18} /> },
        { label: "Delete", icon: <Trash2 size={18} />, disabled: true },
        { label: "Message all attendees", icon: <Send size={18} />, disabled: true },
      ];

  return (
    <div className="flex shrink-0 items-center justify-end gap-2 lg:w-[260px]">
      {past ? (
        <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold">
          Details
        </Button>
      ) : item.joinable ? (
        <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">
          Join now
        </Button>
      ) : (
        <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold" disabled>
          Starts in {item.startsIn}
        </Button>
      )}
      <RowMenu items={menu} />
    </div>
  );
}

function WorkshopRow({ item, past = false, onAddToOffering }: { item: WorkshopItem; past?: boolean; onAddToOffering: () => void }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Thumbnail item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-gray-dark">{item.title}</h3>
            <PriceTag price={item.price} />
            <OfferingTag count={item.offerings.length} />
          </div>
          <p className="mt-0.5 truncate text-[14px] text-gray-light">
            {item.date} · {item.startTime} · {item.duration}
          </p>
        </div>
      </div>
      <HostCell host={item.host} />
      <EarningsCell item={item} />
      <ActionCell item={item} past={past} onAddToOffering={onAddToOffering} />
    </div>
  );
}

function SectionCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-stroke">
      {/* Column header */}
      <div className="flex items-center gap-4 rounded-t-xl border-b border-gray-stroke bg-[#F7F7F7] px-5 py-3 text-[14px] font-medium text-gray-light">
        <div className="flex-1">{label}</div>
        <div className="hidden w-[140px] shrink-0 text-center lg:block">Host</div>
        <div className="hidden w-[110px] shrink-0 md:block">Earnings</div>
        <div className="text-right lg:w-[260px]">Actions</div>
      </div>
      <div className="divide-y divide-gray-stroke">{children}</div>
    </div>
  );
}

export default function CoachWorkshops() {
  useEffect(() => {
    document.title = "Leland Prototype | My Workshops";
  }, []);

  // Offering attachment is editable, so it lives in state (seeded from the mock
  // data). Keyed by workshop id → offering slugs.
  const [offeringsById, setOfferingsById] = useState<Record<string, string[]>>(() =>
    Object.fromEntries([...upcoming, ...past].map((w) => [w.id, w.offerings])),
  );
  // The workshop whose "add to offering" modal is open (null = closed).
  const [offeringModalId, setOfferingModalId] = useState<string | null>(null);

  const allById = Object.fromEntries([...upcoming, ...past].map((w) => [w.id, w]));
  const modalWorkshop = offeringModalId ? allById[offeringModalId] : null;

  // Merge live offering state back onto each row for rendering.
  const withOfferings = (item: WorkshopItem): WorkshopItem => ({ ...item, offerings: offeringsById[item.id] ?? [] });

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">
            My Workshops
          </h1>
          <p className="mt-2 text-[15px] text-gray-light">
            Live classes you charge for. Host one on its own or bundle it into an offering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="md" variant="dark">
            <Plus size={16} />
            Schedule
          </Button>
          <button
            aria-label="More actions"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-xlight transition-colors hover:bg-gray-hover hover:text-gray-dark"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-8">
        <SectionCard label="Upcoming workshops">
          {upcomingSorted.map((item) => (
            <WorkshopRow key={item.id} item={withOfferings(item)} onAddToOffering={() => setOfferingModalId(item.id)} />
          ))}
        </SectionCard>
      </div>

      {/* FAQs link */}
      <button className="mt-5 flex items-center gap-2 text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark">
        <MaskIcon src={infoFilled} className="h-5 w-5 text-gray-extra-light" />
        <span>FAQs for hosting a paid workshop</span>
        <ChevronRight size={18} />
      </button>

      {/* Past */}
      <div className="mt-10">
        <SectionCard label="Past workshops">
          {past.map((item) => (
            <WorkshopRow key={item.id} item={withOfferings(item)} past onAddToOffering={() => setOfferingModalId(item.id)} />
          ))}
        </SectionCard>
      </div>

      {/* Add-to-offering modal. The workshop's price is the suggested price the
          coach can either absorb into an offering or stack on top of it. */}
      <AddToOfferingModal
        open={!!modalWorkshop}
        title={modalWorkshop?.title ?? ""}
        suggestedPrice={modalWorkshop?.price ?? null}
        offerings={modalWorkshop ? offeringsById[modalWorkshop.id] ?? [] : []}
        onClose={() => setOfferingModalId(null)}
        onSave={(slugs) => {
          if (offeringModalId) setOfferingsById((m) => ({ ...m, [offeringModalId]: slugs }));
          setOfferingModalId(null);
        }}
      />
    </div>
  );
}
