import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import verifiedIcon from "../assets/icons/verified.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic13 from "../assets/profile photos/pic-13.png";

/* ── "People to follow" suggestions ─────────────────────────────────────────
   The same card carousel as the feed's People-to-follow section, surfaced at
   the bottom of the profile hero after you tap Follow. The feed's "See all"
   link is replaced here by an X that collapses the whole section. ── */

type FollowPerson = { name: string; avatar: string; verified: boolean; subtitle: string };

const people: FollowPerson[] = [
  { name: "Julie Zhuo", avatar: pic7, verified: true, subtitle: "The Looking Glass" },
  { name: "Dylan Allen", avatar: pic1, verified: false, subtitle: "techocarrott" },
  { name: "Nina Kowalski", avatar: pic5, verified: true, subtitle: "McKinsey & Company" },
  { name: "Claire Vo", avatar: pic13, verified: false, subtitle: "Claire's Substack" },
  { name: "Molly Baz", avatar: pic2, verified: false, subtitle: "mollybaz" },
  { name: "Jordan Allen", avatar: pic8, verified: false, subtitle: "jordanallen1" },
  { name: "Garry Tan", avatar: pic10, verified: false, subtitle: "Garry Tan" },
  { name: "Dwarkesh Patel", avatar: pic4, verified: true, subtitle: "Dwarkesh Podcast" },
  { name: "Michael Brandley", avatar: pic6, verified: false, subtitle: "Followed by Austin Winfield" },
];

const VerifiedBadge = ({ className = "" }: { className?: string }) => (
  <img src={verifiedIcon} alt="" aria-hidden className={className} />
);

// A small round X — used both to dismiss a single card and to collapse the section.
function DismissButton({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover hover:text-gray-dark ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

function FollowToggle({ className = "" }: { className?: string }) {
  const [following, setFollowing] = useState(false);
  return (
    <Button
      size="sm"
      variant={following ? "secondary" : "dark"}
      rounded="rounded-lg"
      onClick={() => setFollowing((f) => !f)}
      className={`font-semibold ${className}`}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}

function PersonToFollowCard({ person, onDismiss }: { person: FollowPerson; onDismiss: () => void }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center rounded-2xl border border-gray-stroke bg-white px-4 pb-4 pt-8" style={{ width: 200, minWidth: 200 }}>
      <DismissButton label={`Dismiss ${person.name}`} onClick={onDismiss} className="absolute right-2 top-2" />
      <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
        <img src={person.avatar} alt={person.name} className="h-full w-full rounded-full object-cover" style={{ objectPosition: "50% 15%" }} />
        {person.verified ? <VerifiedBadge className="absolute -bottom-0.5 -right-0.5 h-6 w-6" /> : null}
      </div>
      <p className="mt-3 max-w-full truncate text-center text-[15px] font-semibold text-gray-dark">{person.name}</p>
      <p className="mt-0.5 max-w-full truncate text-center text-[13px] text-gray-light">{person.subtitle}</p>
      <FollowToggle className="mt-4 w-full" />
    </div>
  );
}

export function FollowSuggestions({ onClose }: { onClose: () => void }) {
  const [remaining, setRemaining] = useState(people);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Which edges have more content scrolled out of view → show a fade there.
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setEdges({
        left: scrollLeft > 1,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [remaining.length]);

  if (remaining.length === 0) return null;
  return (
    <div className="py-5">
      <div className="flex items-center justify-between">
        <p className="text-[19px] font-semibold text-gray-dark">People to follow</p>
        <button
          onClick={onClose}
          className="text-[14px] font-medium text-gray-light underline decoration-dotted decoration-[1.5px] underline-offset-[3px] transition-opacity hover:opacity-70"
        >
          Dismiss
        </button>
      </div>
      {/* Cards align to the hero content and scroll within it (the animated
          wrapper is overflow-hidden, so no full-bleed negative margins here).
          Edge fades appear on whichever side has more cards out of view. */}
      <div className="relative mt-4">
        <div ref={scrollRef} className="scrollbar-hide flex gap-3 overflow-x-auto">
          {remaining.map((p) => (
            <PersonToFollowCard key={p.name} person={p} onDismiss={() => setRemaining((prev) => prev.filter((x) => x.name !== p.name))} />
          ))}
        </div>
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 ${edges.left ? "opacity-100" : "opacity-0"}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 ${edges.right ? "opacity-100" : "opacity-0"}`} />
      </div>
    </div>
  );
}
