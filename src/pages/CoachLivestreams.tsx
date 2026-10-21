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
} from "lucide-react";
import { Button } from "../components/Button";
import MaskIcon from "../components/MaskIcon";
import infoFilled from "../assets/icons/info-filled.svg";
import lelandBadge from "../assets/logos/Leland Profile Image Logo Icon White on black.png";
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

type HostPerson = { name: string; avatar: string };
type Host = { kind: "people"; people: HostPerson[] } | { kind: "leland" };

type Status = { kind: "draft" } | { kind: "enrolled"; count: number };

type Pricing = { kind: "free" } | { kind: "paid"; price: string };

type EventItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: string;
  pricing: Pricing;
  thumb?: string;
  host: Host;
  status: Status;
  joinable?: boolean; // upcoming: show "Join now" instead of the countdown
  startsIn?: string; // upcoming: label for the disabled countdown button
};

const YOU: HostPerson = { name: "Jane Doe", avatar: profilePhoto };

const upcoming: EventItem[] = [
  {
    id: "test-event",
    title: "This is a Test Event: Title TBD",
    date: "Oct 20, 2025",
    startTime: "11:30 AM PST",
    duration: "1 hr",
    pricing: { kind: "free" },
    host: { kind: "people", people: [YOU] },
    status: { kind: "draft" },
    startsIn: "5d",
  },
  {
    id: "rec-advantage",
    title: "The Recommendation Advantage: Turning Letters Into Game-Changers",
    date: "Oct 20, 2025",
    startTime: "11:30 AM PST",
    duration: "1 hr",
    pricing: { kind: "free" },
    thumb: eventThumb02,
    host: { kind: "leland" },
    status: { kind: "enrolled", count: 64 },
    startsIn: "2d",
  },
  {
    id: "case-interview",
    title: "Cracking the Case Interview: Acing the Behavioral Questions",
    date: "Oct 20, 2025",
    startTime: "11:30 AM PST",
    duration: "1 hr",
    pricing: { kind: "paid", price: "$49" },
    thumb: courseSystems,
    host: { kind: "people", people: [YOU, { name: "Marcus Lee", avatar: coachPhoto }] },
    status: { kind: "enrolled", count: 64 },
    joinable: true,
  },
];

const pastThumbs = [bootcamp1, eventThumb01, coursePe, eventThumb03, bootcamp2, courseC10];
const pastPricing: Pricing[] = [
  { kind: "free" },
  { kind: "paid", price: "$29" },
  { kind: "free" },
  { kind: "paid", price: "$99" },
  { kind: "free" },
  { kind: "paid", price: "$49" },
];
const pastTitles = [
  "Navigating Dual/Concurrent Degrees: MBA + Policy, Education, and STEM",
  "From Analyst to Associate: Breaking Into Private Equity",
  "Essays That Get You In: Lessons from Past Admits",
  "What You Need to Know for the GSB Interview",
  "Recommendation Letters for a Standout Application",
  "Mastering the Behavioral Interview at Top Firms",
];

const past: EventItem[] = pastTitles.map((title, i) => ({
  id: `past-${i}`,
  title,
  date: "Oct 20, 2025",
  startTime: "11:30 AM PST",
  duration: "1 hr",
  pricing: pastPricing[i],
  thumb: pastThumbs[i],
  host: { kind: "people", people: [YOU] },
  status: { kind: "enrolled", count: 64 },
}));

type MenuItem = { label: string; icon: React.ReactNode; disabled?: boolean };

const upcomingMenu: MenuItem[] = [
  { label: "Edit", icon: <Pencil size={18} /> },
  { label: "Duplicate", icon: <Copy size={18} /> },
  { label: "Share", icon: <Share2 size={18} /> },
  { label: "Delete", icon: <Trash2 size={18} />, disabled: true },
  { label: "Message all attendees", icon: <Send size={18} />, disabled: true },
];

const pastMenu: MenuItem[] = [
  { label: "Share", icon: <Share2 size={18} /> },
  { label: "Duplicate", icon: <Copy size={18} /> },
];

function Thumbnail({ item }: { item: EventItem }) {
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
      {host.kind === "leland" ? (
        <HostAvatar src={lelandBadge} name="Leland" />
      ) : (
        <div className="flex -space-x-2">
          {host.people.map((p) => (
            <HostAvatar key={p.name} src={p.avatar} name={p.name} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusCell({ status }: { status: Status }) {
  return (
    <div className="hidden w-[110px] shrink-0 md:block">
      {status.kind === "draft" ? (
        <span className="inline-flex rounded-full bg-[#222222]/5 px-3 py-1 text-[14px] font-medium text-gray-light">
          Draft
        </span>
      ) : (
        <span className="text-[14px] text-gray-light">{status.count} enrolled</span>
      )}
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
              onClick={() => !item.disabled && setOpen(false)}
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

function ActionCell({ item, past }: { item: EventItem; past: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 lg:w-[240px]">
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
      <RowMenu items={past ? pastMenu : upcomingMenu} />
    </div>
  );
}

function EventRow({ item, past = false }: { item: EventItem; past?: boolean }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Thumbnail item={item} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-gray-dark">{item.title}</h3>
          <p className="mt-0.5 truncate text-[14px] text-gray-light">
            {item.date} · {item.startTime} · {item.duration}
          </p>
        </div>
      </div>
      <HostCell host={item.host} />
      <StatusCell status={item.status} />
      <ActionCell item={item} past={past} />
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
        <div className="hidden w-[110px] shrink-0 md:block">Status</div>
        <div className="text-right lg:w-[240px]">Actions</div>
      </div>
      <div className="divide-y divide-gray-stroke">{children}</div>
    </div>
  );
}

export default function CoachLivestreams() {
  useEffect(() => {
    document.title = "Leland Prototype | My Livestreams";
  }, []);

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">
            My Free Livestreams
          </h1>
          <p className="mt-2 text-[15px] text-gray-light">
            Coaches who host regular livestreams earn 7x more than coaches who don't.
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
        <SectionCard label="Upcoming livestreams">
          {upcoming.map((item) => (
            <EventRow key={item.id} item={item} />
          ))}
        </SectionCard>
      </div>

      {/* FAQs link */}
      <button className="mt-5 flex items-center gap-2 text-[15px] font-medium text-gray-light transition-colors hover:text-gray-dark">
        <MaskIcon src={infoFilled} className="h-5 w-5 text-gray-extra-light" />
        <span>FAQs for hosting a livestream</span>
        <ChevronRight size={18} />
      </button>

      {/* Past */}
      <div className="mt-10">
        <SectionCard label="Past livestreams">
          {past.map((item) => (
            <EventRow key={item.id} item={item} past />
          ))}
        </SectionCard>
      </div>
    </div>
  );
}
