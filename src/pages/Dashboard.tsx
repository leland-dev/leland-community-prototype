import { useMemo, useRef, useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Link, useNavigate } from "react-router-dom";
import { useSetLayoutVariant } from "../components/LayoutVariantContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import SessionCard from "../components/SessionCard";
import OfferingCard, { type OfferingType } from "../components/OfferingCard";
import { Button, LinkButton } from "../components/Button";
import {
  AppPromoCallout,
  AppPromoTakeover,
  AppPromoPushToast,
  AppPromoToast,
  PromoToggleList,
} from "../components/promo/AppPromo";
import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic2 from "../assets/profile photos/pic-2.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import eventImg1 from "../assets/placeholder images/placeholder-event-01.png";
import eventImg2 from "../assets/placeholder images/placeholder-event-02.png";
import eventImg3 from "../assets/placeholder images/placeholder-event-03.png";
import lelandPlusImg1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";
import aibpImg from "../assets/placeholder images/courses/AIBP.png";
import samWielenImg from "../assets/placeholder images/courses/HERO-Sam-Vander-Wielen-case-study-scaled.avif";
import automationsImg from "../assets/placeholder images/courses/HERO-10-automations-scaled.avif";
import courseImg4 from "../assets/placeholder images/courses/c10-hero-1920x1280.webp";
import airplaneIcon from "../assets/icons/airplane.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";
import starIcon from "../assets/icons/star.svg";
import editIcon from "../assets/icons/edit.svg";
import { GoalTile, NewGoalTile } from "../components/GoalTile";
import { useGoals } from "../contexts/GoalsContext";
import { GoalTile as FullGoalTile, NewGoalTile as FullNewGoalTile } from "../full/components/GoalTile";
import { useGoals as useFullGoals } from "../full/contexts/GoalsContext";
import { useGoalsVersion } from "../contexts/GoalsVersionContext";
import AdminToggle from "../components/AdminToggle";

const HERO_BG = "#F3F1E6";

// Break an element out to the full window width regardless of its container.
const fullBleed = { marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" };

const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

const upcomingEvents = [
  { title: "1:1 Session with Jessica", dateTime: "Monday, Mar 30 at 2:00 PM", duration: "45m", image: pic6, type: "coach" as const, status: "live" as const, day: 30 },
  { title: "MBA Strategy Live", dateTime: "Monday, Mar 30 at 4:00 PM", duration: "45m", image: eventImg1, type: "event" as const, status: "upcoming" as const, startsIn: "2h", day: 30 },
  { title: "Intro Call with Samantha", dateTime: "Wednesday, Apr 1 at 11:00 AM", duration: "30m", image: pic8, type: "coach" as const, status: "upcoming" as const, startsIn: "2d", day: 1 },
];

// Sessions scheduled for the current day (Mar 30 in this prototype) — drives
// the "You have X sessions today" note in the hero.
const TODAY_DAY = 30;
const todaySessionCount = upcomingEvents.filter((e) => e.day === TODAY_DAY).length;

interface ContentItem {
  title: string;
  subtitle: ReactNode;
  image: string;
  type: OfferingType;
  href?: string;
}

const myContent: ContentItem[] = [
  {
    type: "content",
    title: "How I Got Into Stanford GSB",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic1} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Marcus Thomas <span className="text-[#9B9B9B]">· 251 views</span></span>,
    image: lelandPlusImg1,
  },
  {
    type: "content",
    title: "MBA Essay Framework",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic6} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Jessica Lin <span className="text-[#9B9B9B]">· 1.2k views</span></span>,
    image: eventImg2,
  },
  {
    type: "content",
    title: "Consulting Case Prep Guide",
    subtitle: <span className="flex items-center gap-1.5"><img src={pic8} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />Samantha Parker <span className="text-[#9B9B9B]">· 890 views</span></span>,
    image: eventImg3,
  },
];

const myExperts = [
  { name: "Jessica", photo: pic6, timeLeft: "45m left", outOfTime: false },
  { name: "Marcus", photo: pic9, timeLeft: "Out of time", outOfTime: true },
  { name: "Priya", photo: pic7, timeLeft: "1h 20m left", outOfTime: false },
  { name: "Samantha", photo: pic8, timeLeft: "2h left", outOfTime: false },
  { name: "David", photo: pic2, timeLeft: "30m left", outOfTime: false },
  { name: "Elena", photo: pic3, timeLeft: "3h left", outOfTime: false },
  { name: "Michael", photo: pic4, timeLeft: "Out of time", outOfTime: true },
  { name: "Sarah", photo: pic5, timeLeft: "1h left", outOfTime: false },
  { name: "James", photo: pic10, timeLeft: "15m left", outOfTime: false },
  { name: "Aisha", photo: pic11, timeLeft: "2h 30m left", outOfTime: false },
];

// Shared width wrapper — hero content and the card grid use the same one so
// their content edges align exactly.
const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-6";

function DashCard({ title, to, linkLabel = "See all", badge, hideHeader, children }: { title: string; to?: string; linkLabel?: string; badge?: ReactNode; hideHeader?: boolean; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 sm:p-6">
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">{title}</h2>
            {badge}
          </div>
          {to && (
            <Link to={to} className="shrink-0 self-start text-[14px] font-medium leading-none text-gray-extra-light transition-opacity hover:opacity-70">
              {linkLabel}
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

interface Course {
  title: string;
  meta: string;
  progress: string;
  image: string;
  href?: string;
}

const myCourses: Course[] = [
  { title: "AI Builder Program: Level 1", meta: "Leland · 12 lessons", progress: "60% complete", image: aibpImg, href: "/course/1" },
  { title: "MBA Application Masterclass", meta: "Sam Wielen · 8 lessons", progress: "25% complete", image: samWielenImg },
  { title: "Consulting Case Interview Prep", meta: "Jessica Lin · 15 lessons", progress: "Not started", image: automationsImg },
  { title: "Product Management Foundations", meta: "David Kim · 10 lessons", progress: "90% complete", image: courseImg4 },
];

// Parse a "60% complete" / "Not started" progress label into a 0–100 number.
function coursePct(progress: string): number {
  const m = progress.match(/(\d+)\s*%/);
  return m ? Number(m[1]) : 0;
}

function CourseCard({ course }: { course: Course }) {
  const pct = coursePct(course.progress);
  const [author] = course.meta.split(" · ");
  return (
    <div className="group relative w-[232px] shrink-0 snap-start">
      <div className="overflow-hidden rounded-xl">
        <div className="relative">
          <img src={course.image} alt="" className="aspect-[1.91/1] w-full object-cover" />
          {/* Hover: darken the thumbnail and reveal a Resume/Start CTA. The
              overlay is non-interactive; the stretched link below handles clicks. */}
          {/* Hover: darken the thumbnail + reveal a Resume/Start CTA that
              slides up on enter and down on exit. The button stays mounted
              (animated via opacity), and will-change/GPU keep the backdrop-blur
              layer warm so it doesn't pop in a frame late. */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="translate-y-2 opacity-0 transition-[transform,opacity] duration-200 ease-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100">
                <Button size="md" variant="glass" rounded="rounded-full" className="transform-gpu [will-change:backdrop-filter]">
                  {pct > 0 ? "Resume" : "Start"}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-3 truncate text-[16px] font-semibold leading-snug text-gray-dark">{course.title}</h3>
      <p className="mt-1 truncate text-[14px] leading-tight text-gray-light">
        {author} · <span className="text-gray-extra-light">{course.progress}</span>
      </p>
      {/* Stretched link makes the whole card clickable (keyboard-accessible). */}
      <Link to={course.href ?? "/courses"} className="absolute inset-0" aria-label={course.title} />
    </div>
  );
}

// Shared horizontal-carousel section shell: title + prev/next chevrons, an
// edge-to-edge scroll track with faded edges, and a footer "see all" button.
function CardCarousel({ title, seeAllLabel, seeAllTo, headerLinkTo, gapClass = "gap-4", children }: { title: string; seeAllLabel?: string; seeAllTo?: string; headerLinkTo?: string; gapClass?: string; children: ReactNode }) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth || 1;
      setPage(Math.round(el.scrollLeft / w));
      setPages(Math.max(1, Math.ceil(el.scrollWidth / w)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">{title}</h2>
        <div className="flex shrink-0 items-center gap-3 text-gray-dark">
          {headerLinkTo && (
            <Link to={headerLinkTo} className="text-[14px] font-medium leading-none text-gray-extra-light transition-opacity hover:opacity-70">
              See all
            </Link>
          )}
          <div className="flex items-center gap-2">
          <button onClick={() => scrollByPage(-1)} disabled={page <= 0} aria-label="Previous" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => scrollByPage(1)} disabled={page >= pages - 1} aria-label="Next" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#222222]/[0.12] transition-colors hover:bg-[#222222]/5 disabled:opacity-30 disabled:hover:bg-transparent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          </div>
        </div>
      </div>
      {/* Carousel breaks out of the section padding to run edge-to-edge; the
          inner track's padding keeps the first/last cards aligned with the
          content at rest, and the gradient overlays fade cards at both edges. */}
      <div className="relative -mx-5 sm:-mx-6">
        <div ref={scrollRef} className="scrollbar-hide snap-x snap-mandatory scroll-pl-5 overflow-x-auto py-1 sm:scroll-pl-6">
          <div className={`flex w-max items-start ${gapClass} px-5 sm:px-6`}>
            {children}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />
      </div>
      {seeAllTo && (
        <Button onClick={() => navigate(seeAllTo)} size="md" variant="secondary" className="mt-4 font-semibold">
          {seeAllLabel}
        </Button>
      )}
    </section>
  );
}

function MyCourses() {
  const navigate = useNavigate();
  return (
    <CardCarousel title="My programs" seeAllLabel="See all programs" seeAllTo="/my-programs">
      {myCourses.slice(0, 3).map((c) => (
        <CourseCard key={c.title} course={c} />
      ))}
      {/* Always-present CTA — dashed tile matching the "My goals" add card */}
      <button onClick={() => navigate("/courses")} className="group w-[232px] shrink-0 snap-start text-left">
        <div className="flex aspect-[1.91/1] w-full items-center justify-center rounded-xl bg-[#F5F5F5] transition-colors group-hover:bg-[#EEEEEE]" style={dashedBorderStyle}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 8v16M8 16h16" stroke="#9B9B9B" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="mt-3 truncate text-[16px] font-semibold leading-snug text-gray-dark">Take the next step</h3>
        <p className="mt-1 truncate text-[14px] leading-tight text-gray-light">Browse all programs</p>
      </button>
    </CardCarousel>
  );
}

function ExpertCard({ expert }: { expert: (typeof myExperts)[number] }) {
  const navigate = useNavigate();
  return (
    <div className="flex w-[164px] shrink-0 snap-start flex-col items-center rounded-2xl p-4 text-center transition-colors hover:bg-gray-hover">
      <img src={expert.photo} alt={expert.name} className="h-[88px] w-[88px] rounded-full object-cover" />
      <p className="mt-3 w-full truncate text-[16px] font-semibold leading-tight text-gray-dark">{expert.name}</p>
      <p className={`mt-1 w-full truncate text-[14px] leading-tight ${expert.outOfTime ? "text-gray-extra-light" : "text-gray-light"}`}>{expert.timeLeft}</p>
      <Button onClick={() => navigate("/messages")} size="md" variant="secondary" className="mt-4 w-full font-semibold">Message</Button>
    </div>
  );
}

function MyExperts({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <CardCarousel title={title} gapClass="gap-2" headerLinkTo="/messages">
      {myExperts.slice(0, 8).map((e) => (
        <ExpertCard key={e.name} expert={e} />
      ))}
      {/* Trailing "see all" card with a centered right-arrow */}
      <button
        onClick={() => navigate("/messages")}
        aria-label="See all experts"
        className="flex w-[164px] shrink-0 snap-start flex-col items-center justify-center self-stretch rounded-2xl p-4 ring-1 ring-[#222222]/10 text-gray-dark transition-colors hover:bg-gray-hover"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#222222]/5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </button>
    </CardCarousel>
  );
}

function GetHelp() {
  return (
    <section className="mt-6">
      <h2 className="mb-4 text-[19px] font-semibold leading-tight text-gray-dark">Get help</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Chat with our team */}
        <button className="group flex w-full items-center gap-4 rounded-xl bg-[#222222]/5 px-6 py-8 text-left transition-colors hover:bg-[#222222]/[0.08]">
          <div className="flex shrink-0 -space-x-2">
            {[pic1, pic6, pic8].map((p, i) => (
              <img key={i} src={p} alt="" className="h-11 w-11 rounded-full border-2 border-gray-hover object-cover" />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-tight text-gray-dark">Chat with our team</p>
            <p className="mt-1 text-[14px] leading-tight text-gray-light">Usually replies in minutes</p>
          </div>
          <span
            aria-hidden
            className="h-8 w-8 shrink-0 bg-gray-dark"
            style={{
              maskImage: `url("${chevronRightIcon}")`,
              WebkitMaskImage: `url("${chevronRightIcon}")`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </button>

        {/* Submit a support ticket */}
        <button className="group flex w-full items-center gap-4 rounded-xl bg-[#222222]/5 px-6 py-8 text-left transition-colors hover:bg-[#222222]/[0.08]">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-dark">
            <span
              aria-hidden
              className="h-7 w-7 bg-current"
              style={{
                maskImage: `url("${airplaneIcon}")`,
                WebkitMaskImage: `url("${airplaneIcon}")`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-tight text-gray-dark">Submit a support ticket</p>
            <p className="mt-1 text-[14px] leading-tight text-gray-light">We'll reply by email</p>
          </div>
          <span
            aria-hidden
            className="h-8 w-8 shrink-0 bg-gray-dark"
            style={{
              maskImage: `url("${chevronRightIcon}")`,
              WebkitMaskImage: `url("${chevronRightIcon}")`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </button>
      </div>
    </section>
  );
}

function GoalsEmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl bg-[#F3F1E6] p-6">
      <div className="flex max-w-[520px] flex-col gap-1.5">
        <div className="text-[16px] font-semibold leading-[1.2] text-gray-dark">Name the thing you're working toward.</div>
        <p className="text-[14px] leading-[1.5] text-gray-light">
          A seat at business school, a new role, a skill you want by spring. Pick a template and we'll lay out a starter milestone list — your expert can add to it too.
        </p>
      </div>
      <Button onClick={() => navigate("/goals/new")} size="md" variant="primary" className="font-medium">
        Set a goal
      </Button>
    </div>
  );
}

// Pre-feature "My goals" card — skeleton tiles and a dashed add button, no
// real data. Shown when the "Goals & tasks" admin toggle is off, so the
// dashboard reads the same as it does with the feature disabled rather than
// losing the section entirely.
function GoalsPlaceholderCard() {
  return (
    <DashCard title="My goals">
      <p className="-mt-2 mb-4 text-[15px] text-[#707070]">Track your progress toward what matters most.</p>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
        {[0, 1].map((i) => (
          <div key={i} className="h-[100px] w-[200px] shrink-0 rounded-xl bg-[#F5F5F5]" style={dashedBorderStyle} />
        ))}
        <button className="flex h-[100px] w-[200px] shrink-0 cursor-pointer items-center justify-center rounded-xl border-none bg-[#F5F5F5] transition-colors hover:bg-[#EEEEEE]" style={dashedBorderStyle}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 8v16M8 16h16" stroke="#9B9B9B" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </DashCard>
  );
}

function GoalsCard() {
  const { goals } = useGoals();
  return (
    <DashCard title="My goals" to={goals.length > 0 ? "/goals" : undefined}>
      <p className="-mt-2 mb-4 text-[15px] text-[#707070]">Track your progress toward what matters most.</p>
      {goals.length > 0 ? (
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          {goals.map((goal) => (
            <GoalTile key={goal.id} goal={goal} />
          ))}
          <NewGoalTile />
        </div>
      ) : (
        <GoalsEmptyState />
      )}
    </DashCard>
  );
}

// Same card, wired to the complete original feature set (routines, board,
// master list) instead of the MVP data — see GoalsVersionContext.
function FullGoalsCard() {
  const { goals } = useFullGoals();
  return (
    <DashCard title="My goals" to={goals.length > 0 ? "/goals" : undefined}>
      <p className="-mt-2 mb-4 text-[15px] text-[#707070]">Track your progress toward what matters most.</p>
      {goals.length > 0 ? (
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          {goals.map((goal) => (
            <FullGoalTile key={goal.id} goal={goal} />
          ))}
          <FullNewGoalTile />
        </div>
      ) : (
        <GoalsEmptyState />
      )}
    </DashCard>
  );
}

function GoalsCardSwitch({ enabled }: { enabled: boolean }) {
  const { version } = useGoalsVersion();
  if (!enabled) return <GoalsPlaceholderCard />;
  return version === "full" ? <FullGoalsCard /> : <GoalsCard />;
}

// ─── Expert-only sections ──────────────────────────────────────────────────

// Order requests the coach needs to accept or decline.
const pendingOrders = [
  { photo: pic6, order: "Interview Prep Package", name: "Jessica Lin", price: "$400" },
  { photo: pic1, order: "1h 30m of coaching", name: "Marcus Chen", price: "$150" },
  { photo: pic7, order: "Resume Review", name: "Priya Patel", price: "$75" },
];

function PendingOrders() {
  const shown = pendingOrders.slice(0, 2);
  return (
    <DashCard
      title="Pending orders"
      badge={
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F3392C] px-1.5 text-[12px] font-semibold text-white">
          {shown.length}
        </span>
      }
    >
      <div className="-mx-2 flex flex-col gap-1">
        {shown.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[#F5F5F5]">
            <div className="relative shrink-0">
              <img src={item.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#F3392C] ring-2 ring-white" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
              <p className="truncate text-[16px] font-semibold leading-[1.2] text-gray-dark">{item.order}</p>
              <p className="truncate text-[14px] leading-[1.4]">
                <span className="text-gray-light">{item.name}</span>
                <span className="text-gray-extra-light"> · You will earn {item.price}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="md" variant="primary" rounded="rounded-full" className="font-semibold">Accept</Button>
              <Button size="md" variant="secondary" rounded="rounded-full" className="font-semibold">Decline</Button>
            </div>
          </div>
        ))}
      </div>
    </DashCard>
  );
}

// Profile-view data per time range: total, daily bars, and axis end labels.
type ViewsRange = "Week" | "Month" | "YTD" | "All";
const VIEWS_RANGES: ViewsRange[] = ["Week", "Month", "YTD", "All"];
const VIEWS_DATA: Record<ViewsRange, { total: string; bars: number[]; start: string; end: string }> = {
  Week: { total: "312", bars: [18, 12, 26, 9, 40, 55, 92], start: "Mon", end: "Sun" },
  Month: { total: "1,240", bars: [12, 20, 8, 30, 15, 45, 22, 60, 18, 80, 35, 55, 90, 40, 110, 70, 130, 95, 160, 120, 210, 150, 180, 240, 200, 300], start: "May 12", end: "Jun 10" },
  YTD: { total: "6,480", bars: [8, 12, 10, 15, 8, 60, 6, 10, 4, 3, 8, 12, 6, 100, 15, 8, 120, 25, 270, 45, 20, 10, 300, 150, 8, 410], start: "1 Jan", end: "10 Jun" },
  All: { total: "12,940", bars: [30, 45, 20, 60, 80, 40, 120, 90, 150, 110, 200, 170, 140, 260, 220, 300, 280, 360, 330, 410, 380, 300, 420, 390, 440, 460], start: "2023", end: "Now" },
};

// Round a value up to a clean axis maximum (1/2/5 × 10ⁿ).
function niceMax(v: number) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const norm = v / pow;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * pow;
}

// Per-bar timeframe labels (for tooltips) for a given range.
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function rangeLabels(range: ViewsRange, count: number): string[] {
  if (range === "Week") return DAY_NAMES.slice(0, count);
  const cfg: Record<"Month" | "YTD" | "All", { end: [number, number, number]; stepDays: number; opts: Intl.DateTimeFormatOptions }> = {
    Month: { end: [2026, 5, 10], stepDays: 1, opts: { month: "short", day: "numeric" } },
    YTD: { end: [2026, 5, 10], stepDays: 7, opts: { month: "short", day: "numeric" } },
    All: { end: [2026, 7, 1], stepDays: 30, opts: { month: "short", year: "numeric" } },
  };
  const { end, stepDays, opts } = cfg[range];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end[0], end[1], end[2]);
    d.setDate(d.getDate() - (count - 1 - i) * stepDays);
    return d.toLocaleDateString("en-US", opts);
  });
}

// Bar chart with dashed gridlines (labels only on the primary lines) and a
// per-bar hover tooltip; non-hovered bars dim to 10% opacity.
function BarChart({ bars, labels }: { bars: number[]; labels: string[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const top = niceMax(Math.max(...bars));
  const gridlines = [
    { v: top, label: true },
    { v: top * 0.75, label: false },
    { v: top / 2, label: true },
    { v: top * 0.25, label: false },
    { v: 0, label: true },
  ];
  return (
    <div className="relative h-40">
      {gridlines.map(({ v }, idx) => (
        <div key={idx} className="absolute inset-x-0 border-t border-dashed border-[#222222]/15" style={{ bottom: `${(v / top) * 100}%` }} />
      ))}
      <div className="absolute inset-y-0 left-0 right-0 flex items-end gap-[3px]">
        {bars.map((v, i) => (
          <div
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`relative flex-1 rounded-[4px] bg-gray-dark transition-opacity duration-150 ${hover !== null && hover !== i ? "opacity-20" : ""}`}
            style={{ height: `${Math.max((v / top) * 100, 1.5)}%` }}
          >
            {hover === i && (
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-dark px-2.5 py-1.5 text-center shadow-lg">
                <p className="text-[11px] leading-tight text-white/60">{labels[i]}</p>
                <p className="mt-0.5 text-[13px] font-semibold leading-tight text-white">{v.toLocaleString()} views</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Instagram-style split: high-level numbers on the left (~30%), a profile-views
// bar chart on the right, with time-range controls in the footer.
function AnalyticsPreview() {
  const navigate = useNavigate();
  const [range, setRange] = useState<ViewsRange>("Month");
  const data = VIEWS_DATA[range];
  const secondaryMetrics: [string, string][] = [
    ["New leads", "18"],
    ["New bookings", "6"],
    ["Conversion rate", "33%"],
  ];
  return (
    <DashCard title="Analytics" hideHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[30%_1fr]">
        {/* Left — high-level numbers */}
        <div>
          <p className="text-[34px] font-bold leading-none tracking-tight text-gray-dark">{data.total}</p>
          <p className="mt-1.5 text-[14px] leading-tight text-gray-light">Profile views</p>
          <div className="mt-4 flex flex-col gap-2.5 border-t border-[#222222]/10 pt-4">
            {secondaryMetrics.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="text-[14px] leading-tight text-gray-light">{label}</span>
                <span className="text-[14px] font-semibold leading-tight text-gray-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right — profile views over time */}
        <div className="sm:border-l sm:border-[#222222]/10 sm:pl-6">
          <BarChart bars={data.bars} labels={rangeLabels(range, data.bars.length)} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Button onClick={() => navigate("/coach/earnings")} size="md" variant="secondary" className="font-semibold">
          See all analytics
        </Button>
        <div className="hidden items-center gap-1 rounded-full bg-gray-hover p-1 sm:flex">
          {VIEWS_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                range === r ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-gray-light hover:text-gray-dark"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </DashCard>
  );
}

// Alt analytics: 3–4 high-level metrics, each with a mini area-chart preview.
const SPARK_COLOR = "#94370C";
const ALT_METRICS = [
  { key: "views", label: "Profile views", value: "1.2k", data: [40, 45, 50, 48, 55, 60, 58, 66, 70, 68, 75, 80, 78, 85, 90, 95] },
  { key: "leads", label: "New leads", value: "18", data: [1, 0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7] },
  { key: "bookings", label: "Bookings", value: "$1.8k", data: [100, 150, 120, 200, 250, 220, 300, 350, 320, 400, 450, 420, 500, 550, 600, 650] },
  { key: "conversion", label: "Conversion rate", value: "33%", data: [20, 25, 22, 28, 30, 27, 33, 31, 29, 34, 32, 35, 33, 36, 34, 38] },
];

function Sparkline({ id, data }: { id: string; data: number[] }) {
  const w = 100;
  const h = 36;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const line = data
    .map((v, i) => `${((i / (data.length - 1)) * w).toFixed(2)},${(h - ((v - min) / range) * h).toFixed(2)}`)
    .join(" ");
  const gid = `spark-${id}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-24">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SPARK_COLOR} stopOpacity="0.22" />
          <stop offset="100%" stopColor={SPARK_COLOR} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={SPARK_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AltAnalyticsPreview() {
  return (
    <DashCard title="Analytics" to="/coach/earnings">
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {ALT_METRICS.map((m, i) => (
          <div key={m.key} className={`text-center ${i > 0 ? "sm:border-l sm:border-[#222222]/10 sm:pl-6" : ""}`}>
            <p className="text-[13px] font-semibold leading-tight text-gray-extra-light">{m.label}</p>
            <p className="mt-3 text-[24px] font-bold leading-none text-gray-dark">{m.value}</p>
            <div className="mt-4 flex justify-center">
              <Sparkline id={m.key} data={m.data} />
            </div>
          </div>
        ))}
      </div>
    </DashCard>
  );
}

// Left-column profile card — mirrors the profile template hero, differentiated
// by whether the user is an expert (credentials, reviews, expert mins) or a
// customer (bio + followers).
function ProfileCard({ expert }: { expert: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.06)] ring-1 ring-[#222222]/10">
      <img src={profilePhoto} alt="Alex Rivera" className="h-[72px] w-[72px] rounded-full object-cover" />
      <h2 className="mt-4 font-serif text-[26px] font-medium leading-tight text-gray-dark">Alex Rivera</h2>

      {/* Reviews — experts only */}
      {expert && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex items-center gap-[1px]">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={starIcon} alt="" className="h-[15px] w-[15px]" />
            ))}
          </div>
          <span className="text-[14px] font-semibold leading-none text-gray-dark">4.9</span>
          <span className="text-[14px] leading-none text-[#707070]">52 Reviews</span>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
        {expert && (
          <div className="flex flex-col gap-[2px]">
            <span className="text-[16px] font-semibold leading-none text-gray-dark">6.6k</span>
            <span className="text-[13px] leading-tight text-[#707070]">Expert mins</span>
          </div>
        )}
        <div className="flex flex-col gap-[2px]">
          <span className="text-[16px] font-semibold leading-none text-gray-dark">84</span>
          <span className="text-[13px] leading-tight text-[#707070]">Followers</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[16px] font-semibold leading-none text-gray-dark">112</span>
          <span className="text-[13px] leading-tight text-[#707070]">Following</span>
        </div>
      </div>

      <LinkButton
        href="/coach-profile"
        size="sm"
        variant="secondary"
        className="mt-5 w-full text-[15px] font-semibold"
      >
        <img src={editIcon} alt="" className="h-[18px] w-[18px]" />
        Edit profile
      </LinkButton>
    </div>
  );
}


export default function Dashboard() {
  useSetLayoutVariant("standard");
  useEffect(() => { document.title = "Dashboard"; }, []);
  const navigate = useNavigate();
  const { dark: darkMode } = useDarkMode();
  const heroBg = darkMode ? "#5E6E79" : HERO_BG;
  const navTheme = useMemo(() => ({ bg: heroBg, light: darkMode, hideWordmark: false, scrollReveal: true }), [heroBg, darkMode]);
  useSetNavTheme(navTheme);

  // Admin menu (bottom-right) — matches the profile template's 3-dot control.
  const [adminOpen, setAdminOpen] = useState(false);
  const [expert, setExpert] = useState(false);
  const [altAnalytics, setAltAnalytics] = useState(false);
  const [goalsFeature, setGoalsFeature] = useState(true);
  const { version: goalsVersion, setVersion: setGoalsVersion } = useGoalsVersion();
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [adminOpen]);

  return (
    <div className="pb-[180px]">
      {/* In-flow app-promo banner; bottom margin absorbs the hero's negative
          top margin so it isn't overlapped. */}
      <AppPromoPushToast className="mb-[72px] md:mb-10" />
      {/* Hero — full-window beige band with a headline + help link */}
      <div
        className="-mt-[72px] pb-32 pt-[120px] md:-mt-10 md:pb-36 md:pt-16"
        style={{ backgroundColor: heroBg, ...fullBleed }}
      >
        <motion.div
          className={`${WRAP} text-center md:text-left`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark md:text-[40px]">
            Good morning, Alex
          </h1>
          {todaySessionCount > 0 && (
            <p className="mt-2 text-[16px] text-gray-dark md:text-[17px]">
              You have {todaySessionCount} session{todaySessionCount === 1 ? "" : "s"} today.
            </p>
          )}
        </motion.div>
      </div>

      {/* Content — 2-col grid pulled up to overlap the hero. No WRAP here: it
          already sits inside PageShell's padded container, so it aligns with the
          hero's inner wrapper without re-adding max-width/padding. */}
      <motion.div
        className="relative z-10 -mt-20 md:-mt-28"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left — profile preview (hidden on mobile; mirrors the profile
              template hero, differentiated by expert vs customer) */}
          <aside className="hidden self-start lg:block lg:sticky lg:top-[92px]">
            <ProfileCard expert={expert} />
          </aside>

          {/* Right — stacked section cards */}
          <div className="flex min-w-0 flex-col gap-5">
            {/* App promo: inline callout */}
            <AppPromoCallout variant="card" />

            {/* 1. Upcoming sessions */}
            <DashCard title="Upcoming sessions">
              <div className="-mx-2 flex flex-col gap-1">
                {upcomingEvents.map((event, i) => (
                  <SessionCard key={i} size="auto" {...event} />
                ))}
              </div>
              <Button onClick={() => navigate("/calendar")} size="md" variant="secondary" className="mt-4 font-semibold">
                See full calendar
              </Button>
            </DashCard>

            {/* Expert-only: pending orders + analytics roll-up */}
            {expert && <PendingOrders />}
            {expert && (altAnalytics ? <AnalyticsPreview /> : <AltAnalyticsPreview />)}

            {/* My programs — hidden for experts */}
            {!expert && <MyCourses />}

            {/* Conversations */}
            <MyExperts title="Conversations" />

            {/* My content — hidden for experts */}
            {!expert && (
              <DashCard title="My content">
                <div className="-mx-2 flex flex-col gap-1">
                  {myContent.map((item) => (
                    <OfferingCard
                      key={item.title}
                      type={item.type}
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.image}
                      href={item.href}
                      purchased
                      size="small"
                    />
                  ))}
                </div>
                <Button onClick={() => navigate("/courses")} size="md" variant="secondary" className="mt-4 font-semibold">
                  See all
                </Button>
              </DashCard>
            )}

            {/* My goals — hidden for experts */}
            {!expert && <GoalsCardSwitch enabled={goalsFeature} />}

            {/* 6. Get help */}
            <GetHelp />
          </div>
        </div>
      </motion.div>

      {/* App promo demo: toggle panel + overlays */}
      <AppPromoTakeover />
      <AppPromoToast />

      {/* Admin tool — 3-dot menu matching the profile template (hidden inside
          the takeover's mini phone iframe) */}
      {!new URLSearchParams(window.location.search).has("mini") && (
      <div
        ref={adminRef}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+72px)] right-4 z-40 md:bottom-6 md:right-6"
      >
        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2 w-[220px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
            >
              <AdminToggle label="Expert" checked={expert} onChange={() => setExpert((v) => !v)} />
              {expert && <AdminToggle label="Alt Analytics" checked={altAnalytics} onChange={() => setAltAnalytics((v) => !v)} />}
              {!expert && (
                <AdminToggle label="Goals & tasks" checked={goalsFeature} onChange={() => setGoalsFeature((v) => !v)} />
              )}
              {!expert && goalsFeature && (
                <AdminToggle
                  label="Goals: Full version"
                  checked={goalsVersion === "full"}
                  onChange={() => setGoalsVersion(goalsVersion === "full" ? "mvp" : "full")}
                />
              )}
              <div className="mt-1 border-t border-gray-stroke/60 px-2 pb-1 pt-2">
                <p className="pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-light">App promo</p>
                <PromoToggleList options={["modal", "toast", "push", "callout"]} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-opacity ${adminOpen ? "opacity-100" : "opacity-20 hover:opacity-100"}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#222222" />
            <circle cx="8" cy="8" r="1.5" fill="#222222" />
            <circle cx="13" cy="8" r="1.5" fill="#222222" />
          </svg>
        </button>
      </div>
      )}
    </div>
  );
}
