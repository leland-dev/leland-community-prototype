import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/Button";
import { useSetLeftSidebar } from "../components/LeftSidebarContext";
import { useSetRightSidebar } from "../components/RightSidebarContext";
import { HomeSidebar, HomeFeedFooter } from "./Home";
import {
  NotificationItem,
  ReferenceCard,
  ThumbImage,
  ThumbIcon,
  ThumbCalendar,
  StatusPill,
  Rating,
  OutcomeChip,
} from "../components/Notification";
import settingsIcon from "../assets/icons/settings.svg";
import checkIcon from "../assets/icons/check.svg";
import documentIcon from "../assets/icons/document.svg";

// Avatars
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";

// Reference thumbnails
import eventThumb from "../assets/placeholder post assets/LinkedIn-8png.jpg";
import coverThumb from "../assets/img/cover-images/cover-image-3.png";

// Outcome logos
import logoGoogle from "../assets/org-logos/google.png";
import logoOpenAI from "../assets/org-logos/openai.png";
import logoMorgan from "../assets/org-logos/morgan-stanley.png";

const EVENT_META = "Apr 5 at 7:30 PM · 30m";

const noop = () => {};

/* ── Tabs ─────────────────────────────────────────────────────────────────── */

type TabKey = "all" | "jobs" | "myposts" | "mentions";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "jobs", label: "Jobs" },
  { key: "myposts", label: "My posts" },
  { key: "mentions", label: "Mentions" },
];

/* ── Notification data ────────────────────────────────────────────────────── */
// `tabs` lists the filter tabs (besides "All") an entry shows up in. Coaching
// and transactional notifications have no specific tab, so they only appear
// under "All". Order top-to-bottom is the chronological feed order.

const NOTIFICATIONS: { id: string; tabs: TabKey[]; el: ReactNode }[] = [
  // ── Community activity ──
  {
    id: "like-1",
    tabs: ["myposts"],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Justin S.", avatar: pic1 }}
        action="liked your post"
        timestamp="52m"
        read={false}
        onClick={noop}
      >
        <ReferenceCard
          excerpt="I've noticed a shift in the conversations I'm having with leaders as we head into 2026. Six months ago, everyone wanted to talk about…"
          footer="14 likes · 2 comments"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "like-2",
    tabs: ["myposts"],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Emily L.", avatar: pic2 }}
        action="liked your post"
        timestamp="1h"
        read={false}
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbImage src={coverThumb} />}
          excerpt="I've noticed a shift in the conversations I'm having with leaders as we head into 2026. Six months ago…"
          footer="14 likes · 2 comments"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "comment-1",
    tabs: ["myposts", "mentions"],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Emily L.", avatar: pic2 }}
        action="commented on your post"
        timestamp="2h"
        onClick={noop}
      >
        <p className="text-[14px] leading-[1.45] text-gray-extra-light">
          "Oh, I finished de-bugging the phones, but the system's compiling for eighteen minutes, so some
          minor systems may go down…"
        </p>
        <ReferenceCard
          excerpt="I've noticed a shift in the conversations I'm having with leaders as we head into 2026. Six months ago…"
          footer="14 likes · 2 comments"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "agg-likes",
    tabs: ["myposts"],
    el: (
      <NotificationItem
        source={{ kind: "group", label: "Justin S. and 12 others", avatars: [pic1, pic3] }}
        action="liked your post"
        timestamp="2h"
        onClick={noop}
      >
        <ReferenceCard
          excerpt="I've noticed a shift in the conversations I'm having with leaders as we head into 2026. Six months ago…"
          footer="14 likes · 2 comments"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "repost",
    tabs: ["myposts"],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Emily L.", avatar: pic2 }}
        action="reposted your post"
        timestamp="6h"
        onClick={noop}
      >
        <ReferenceCard
          excerpt="I've noticed a shift in the conversations I'm having with leaders as we head into 2026. Six months ago…"
          footer="27 likes · 4 comments · 2 reposts"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "follow-req",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "szachbagley", avatar: pic4 }}
        action="requested to message you"
        timestamp="1d"
        trailing={
          <div className="flex gap-2">
            <Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold text-[13px]">Confirm</Button>
            <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold text-[13px]">Delete</Button>
          </div>
        }
      />
    ),
  },
  {
    id: "follow-back",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "kbuzby", avatar: pic5 }}
        action="started following you"
        timestamp="2d"
        trailing={<Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold text-[13px]">Follow back</Button>}
      />
    ),
  },

  // ── Followed coaches (Coaching) ──
  {
    id: "coach-event",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Polina T.", avatar: pic6 }}
        action="scheduled a free livestream"
        timestamp="6m"
        read={false}
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbImage src={eventThumb} />}
          title="Level-Up on LinkedIn"
          subtitle={EVENT_META}
          trailing={<Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold text-[13px]">Register</Button>}
        />
      </NotificationItem>
    ),
  },
  {
    id: "coach-resource",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Polina T.", avatar: pic6 }}
        action={<>contributed a new resource to <span className="font-medium text-gray-dark">Leland+</span></>}
        timestamp="6m"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbIcon src={documentIcon} />}
          title="GSB Recommender Packet — Strategy, Examples, and School Fit"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "coach-post",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Polina T.", avatar: pic6 }}
        action="posted in the community"
        timestamp="8h"
        onClick={noop}
      >
        <ReferenceCard
          excerpt="Getting into product is tougher than it's ever been. Now more than ever, it's important to be as prepared and educated as…"
          footer="14 likes · 2 comments"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },

  // ── Coach-specific (Coaching) ──
  {
    id: "new-relationship",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "leland" }}
        action={<>You have a new relationship with <span className="font-semibold text-gray-dark">James A.</span></>}
        timestamp="6m"
        read={false}
      >
        <div>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold text-[13px]">View in Inbox</Button>
        </div>
      </NotificationItem>
    ),
  },
  {
    id: "new-order",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "James A.", avatar: pic3 }}
        action="placed a new order with you"
        timestamp="1h"
        onClick={noop}
      >
        <ReferenceCard title="Stanford Essay Prep Package" subtitle="$1,400 · 15h" onClick={noop} />
      </NotificationItem>
    ),
  },
  {
    id: "review",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Justin S.", avatar: pic1 }}
        action="left you a review"
        timestamp="3h"
        onClick={noop}
      >
        <ReferenceCard
          title={<Rating value={5.0} />}
          excerpt="Alex is phenomenal at his craft. He took the time to understand my situation and then systematically worked wi…"
          footer={<OutcomeChip logos={[logoGoogle, logoOpenAI, logoMorgan]}>Landed roles at Google, OpenAI, and 1 more</OutcomeChip>}
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "payout",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "leland" }}
        action="Your payout has been processed"
        timestamp="1d"
        onClick={noop}
      >
        <ReferenceCard
          title={<span className="text-[16px]">$319.45</span>}
          subtitle="Reaching your bank account in 3-5 business days"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "opportunity",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "leland" }}
        action="Leland sent you a new opportunity"
        timestamp="1d"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<img src={pic5} alt="" className="h-11 w-11 rounded-full object-cover" />}
          title="Chad S."
          subtitle="Requested an intro call · Hasn't purchased yet"
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "agg-registrations",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "group", label: "Justin S. and 12 others", avatars: [pic1, pic4] }}
        action="registered for your livestream"
        timestamp="2d"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbImage src={eventThumb} />}
          title="Level-Up on LinkedIn"
          subtitle={EVENT_META}
          trailing={<StatusPill>Starts in 2d 4h</StatusPill>}
        />
      </NotificationItem>
    ),
  },

  // ── Transactional ──
  {
    id: "session-live",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "James A.", avatar: pic3 }}
        action="scheduled a session with you"
        timestamp="6m"
        read={false}
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbCalendar day={5} />}
          title="Resume review"
          subtitle={EVENT_META}
          trailing={<Button size="sm" variant="dark" rounded="rounded-full" className="font-semibold text-[13px]">Join session</Button>}
        />
      </NotificationItem>
    ),
  },
  {
    id: "session-scheduled",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "James A.", avatar: pic3 }}
        action="scheduled a session with you"
        timestamp="2h"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbCalendar day={5} />}
          title="Resume review"
          subtitle={EVENT_META}
          trailing={<StatusPill>Starts in 2d 4h</StatusPill>}
        />
      </NotificationItem>
    ),
  },
  {
    id: "session-rescheduled",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "James A.", avatar: pic3 }}
        action="rescheduled a session with you"
        timestamp="4h"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbCalendar day={5} />}
          title="Resume review"
          subtitle={
            <>
              {EVENT_META}
              <br />
              <span className="text-gray-xlight line-through">Apr 4 at 4:45 PM · 15m</span>
            </>
          }
          trailing={<StatusPill>Starts in 2d 4h</StatusPill>}
        />
      </NotificationItem>
    ),
  },
  {
    id: "session-cancelled",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Firas A.", avatar: pic7 }}
        action="cancelled your session"
        timestamp="6h"
        onClick={noop}
      >
        <ReferenceCard
          thumbnail={<ThumbCalendar day={4} cancelled />}
          title="Resume review"
          subtitle="Apr 4 at 4:45 PM · 15m"
          chevron={false}
        />
      </NotificationItem>
    ),
  },
  {
    id: "logged-time",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Emily L.", avatar: pic2 }}
        action="logged 30 minutes of coaching"
        timestamp="1d"
        onClick={noop}
      >
        <ReferenceCard title="Reviewing essay and planning next-steps" chevron={false} />
      </NotificationItem>
    ),
  },
  {
    id: "recommended-offering",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "user", name: "Firas A.", avatar: pic7 }}
        action="recommended a coaching offering"
        timestamp="1d"
        onClick={noop}
      >
        <ReferenceCard
          title="Stanford Essay Prep Package"
          subtitle={<>$1,400 · 15h · <span className="font-medium text-leland-success">Save $45</span></>}
          onClick={noop}
        />
      </NotificationItem>
    ),
  },
  {
    id: "credit",
    tabs: [],
    el: (
      <NotificationItem
        source={{ kind: "leland" }}
        action="Leland has granted you $10 of coaching credit!"
        timestamp="2d"
      >
        <div>
          <Button size="sm" variant="secondary" rounded="rounded-full" className="font-semibold text-[13px]">View credit balance</Button>
        </div>
      </NotificationItem>
    ),
  },
];

/* ── Overflow menu ────────────────────────────────────────────────────────── */

function OverflowMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <Button iconOnly size="md" variant="secondary" onClick={() => setOpen(!open)} aria-label="Notification options">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="10" r="1.5" fill="#333333" />
          <circle cx="10" cy="10" r="1.5" fill="#333333" />
          <circle cx="16" cy="10" r="1.5" fill="#333333" />
        </svg>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-[240px] overflow-hidden rounded-xl border border-gray-stroke bg-white shadow-lg"
          >
            <div className="px-2 py-2">
              <button
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
              >
                <img src={checkIcon} alt="" className="h-6 w-6 shrink-0" />
                Mark all as read
              </button>
              <Link
                to="/settings?tab=notifications"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-[10px] rounded-lg p-3 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover"
              >
                <img src={settingsIcon} alt="" className="h-6 w-6 shrink-0" />
                Notification settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function Notifications() {
  // Same 3-column frame as the home feed: home left rail (minus the Goals card)
  // and a right rail that's just the footer.
  useSetLeftSidebar(<HomeSidebar onCreatePost={noop} hideGoals />);
  useSetRightSidebar(
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-[81px]">
        <HomeFeedFooter />
      </div>
    </div>,
  );

  const [tab, setTab] = useState<TabKey>("all");
  const items = tab === "all" ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.tabs.includes(tab));

  return (
    <div className="flex flex-col gap-0 md:gap-3">
      {/* Tabs — full-bleed on mobile, boxed card at md+ (matches the home feed) */}
      <div className="-mx-4 flex items-center justify-between gap-3 rounded-none border border-x-0 border-b-0 border-[#222222]/[0.12] bg-white p-3 sm:-mx-6 md:mx-0 md:rounded-xl md:border-x md:border-b">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Button
              key={t.key}
              size="md"
              variant={t.key === tab ? "dark" : "secondary"}
              rounded="rounded-full"
              onClick={() => setTab(t.key)}
              className="font-semibold"
            >
              {t.label}
            </Button>
          ))}
        </div>
        <OverflowMenu />
      </div>

      {/* Notifications list — full-bleed on mobile, boxed card at md+ */}
      <div className="-mx-4 overflow-hidden rounded-none border border-x-0 border-[#222222]/[0.12] bg-white sm:-mx-6 md:mx-0 md:rounded-xl md:border-x">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-stroke/70">
            {items.map((n) => (
              <div key={n.id}>{n.el}</div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-16 text-center text-[15px] text-gray-extra-light">
            Nothing here yet.
          </p>
        )}
      </div>
    </div>
  );
}
