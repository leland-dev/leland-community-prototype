import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useExpertMode } from "../contexts/ExpertModeContext";
import { useSetNavTheme } from "../components/NavThemeContext";
import PageShell from "../components/PageShell";
import { Button } from "../components/Button";
import SessionCard from "../components/SessionCard";
import profilePhoto from "../assets/profile photos/profile photo.png";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic4 from "../assets/profile photos/pic-4.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import calendarPageIcon from "../assets/icons/calendar-page.svg";
import textIcon from "../assets/icons/text.svg";

const HERO_BG = "#F3F1E6";

// Break an element out to the full window width regardless of its container.
const fullBleed = { marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" };

// Shared width wrapper — matches the Dashboard so the hero content edges align.
const WRAP = "mx-auto w-full max-w-[1280px] px-4 sm:px-6";

// Render an SVG icon as a mask so it inherits the button's text color
// (active = white, inactive = gray) rather than the SVG's baked-in stroke.
const maskStyle = (icon: string) => ({
  maskImage: `url("${icon}")`,
  WebkitMaskImage: `url("${icon}")`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
});

const VIEWS = [
  { key: "list" as const, icon: textIcon, label: "List view" },
  { key: "calendar" as const, icon: calendarPageIcon, label: "Calendar view" },
];

type SessionKind = "coaching" | "event";

interface Session {
  id: number;
  month: number; // 3 = March, 4 = April, 5 = May
  date: number;
  day: string;
  title: string;
  dateTime: string;
  duration: string;
  image: string;
  kind: SessionKind;
  isNow: boolean;
  joinHref?: string;
}

// Upcoming sessions. The weekdays line up on a month where April 1 is a
// Wednesday (Mar 30 = Mon), which the calendar grid below is built around.
const sessions: Session[] = [
  { id: 1, month: 3, date: 30, day: "MON", title: "1:1 Session with Jessica", dateTime: "March 30 at 2:00 PM", duration: "45 minutes", image: profilePhoto, kind: "coaching", isNow: true },
  { id: 2, month: 3, date: 30, day: "MON", title: "AIBP: Building Your First AI Agent", dateTime: "Today at 2:45 PM", duration: "90 minutes", image: pic3, kind: "event", isNow: true, joinHref: "/program/session/mock-live" },
  { id: 3, month: 4, date: 1, day: "WED", title: "Intro Call with Samantha", dateTime: "April 1 at 11:00 AM", duration: "30 minutes", image: pic1, kind: "coaching", isNow: false },
  { id: 4, month: 4, date: 2, day: "THU", title: "GMAT Exam Prep Bootcamp", dateTime: "April 2 at 6:00 PM", duration: "60 minutes", image: pic4, kind: "event", isNow: false },
  { id: 5, month: 4, date: 4, day: "SAT", title: "MBA Strategy Live", dateTime: "April 4 at 10:00 AM", duration: "45 minutes", image: pic5, kind: "event", isNow: false },
  { id: 6, month: 4, date: 7, day: "TUE", title: "Deferred MBA Application Bootcamp", dateTime: "April 7 at 3:00 PM", duration: "90 minutes", image: pic6, kind: "event", isNow: false },
];

const pastEvents = [
  { title: "1:1 Session with Marcus", dateTime: "March 28 at 10:00 AM", duration: "45 minutes", image: pic3, hasRecording: false },
  { title: "Resume Review Workshop", dateTime: "March 27 at 3:00 PM", duration: "60 minutes", image: pic4, hasRecording: true },
  { title: "1:1 Session with Jessica", dateTime: "March 26 at 2:00 PM", duration: "45 minutes", image: profilePhoto, hasRecording: false },
  { title: "MBA Admissions Strategy", dateTime: "March 25 at 1:00 PM", duration: "45 minutes", image: pic5, hasRecording: true },
  { title: "Intro Call with David", dateTime: "March 24 at 11:00 AM", duration: "30 minutes", image: pic1, hasRecording: false },
  { title: "GMAT Prep Live Session", dateTime: "March 21 at 4:00 PM", duration: "60 minutes", image: pic6, hasRecording: true },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABEL = "April 2027";

// 35-cell (5-week) grid starting Sun Mar 29 → Sat May 2, with April as the
// current month. Matches the weekdays baked into the session data above.
const gridCells = [
  ...[29, 30, 31].map((date) => ({ month: 3, date, current: false })),
  ...Array.from({ length: 30 }, (_, i) => ({ month: 4, date: i + 1, current: true })),
  ...[1, 2].map((date) => ({ month: 5, date, current: false })),
];

// Days the coach has blocked off as unavailable — rendered with a diagonal
// hatch. Adjacent-month days (outside April) with no sessions are treated as
// unavailable too. Every day is either blocked-off or available.
const blockedDates = new Set(["4-21", "4-22", "4-23", "4-24"]);

// Faint diagonal hatch for blocked/unavailable days. Semi-transparent gray so
// it reads on both the white card (light) and the dark card (dark mode).
const hatchStyle = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, rgba(120,120,120,0.28) 0, rgba(120,120,120,0.28) 1px, transparent 1px, transparent 7px)",
};

function CalendarView() {
  const eventsByKey = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of sessions) {
      const key = `${s.month}-${s.date}`;
      const list = map.get(key) ?? [];
      list.push(s);
      map.set(key, list);
    }
    return map;
  }, []);

  return (
    <div>
      <h3 className="mb-4 text-[15px] font-semibold leading-tight text-gray-dark">{MONTH_LABEL}</h3>

      <div className="overflow-hidden rounded-xl border-l border-t border-gray-stroke">
        <div className="grid grid-cols-7">
          {/* Weekday header */}
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="border-b border-r border-gray-stroke py-2 pl-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-light"
            >
              <span className="sm:hidden">{w[0]}</span>
              <span className="hidden sm:inline">{w}</span>
            </div>
          ))}

          {/* Day cells */}
          {gridCells.map((cell) => {
            const key = `${cell.month}-${cell.date}`;
            const events = eventsByKey.get(key) ?? [];
            // A day is either available or blocked-off. Blocked = an explicit
            // block, or an adjacent-month day — but never a day with sessions.
            const isBlocked = (!cell.current || blockedDates.has(key)) && events.length === 0;
            const [first, ...rest] = events;
            const numberColor = isBlocked ? "text-gray-extra-light" : "text-gray-dark";
            return (
              <div
                key={key}
                className={`flex min-h-[92px] flex-col gap-1 border-b border-r border-gray-stroke p-2 sm:min-h-[124px] ${isBlocked ? "bg-gray-hover" : ""}`}
                style={isBlocked ? hatchStyle : undefined}
              >
                {/* Date number + first event pill inline (desktop) */}
                <div className="flex items-start gap-1.5">
                  <span className={`w-6 shrink-0 text-[16px] leading-6 ${numberColor}`}>{cell.date}</span>
                  {first && (
                    <span className="hidden min-w-0 flex-1 truncate rounded-[4px] bg-[#222222]/[0.06] px-2 py-1 text-[12px] leading-tight text-gray-dark sm:block">
                      {first.title}
                    </span>
                  )}
                </div>

                {/* Remaining events collapse to a "+N more" line (desktop) */}
                {rest.length > 0 && (
                  <span className="hidden pl-[30px] text-[12px] font-medium text-gray-light sm:block">+{rest.length} more</span>
                )}

                {/* Mobile — events shown as compact dots */}
                {events.length > 0 && (
                  <div className="flex flex-wrap gap-1 pl-1 sm:hidden">
                    {events.map((s) => (
                      <span key={s.id} className="h-1.5 w-1.5 rounded-full bg-gray-light" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ListView() {
  const [pastOpen, setPastOpen] = useState(false);

  return (
    <div>
      <div className="-mx-2 flex flex-col gap-1">
        {sessions.map((s) => (
          <SessionCard
            key={s.id}
            size="auto"
            title={s.title}
            dateTime={s.dateTime}
            duration={s.duration}
            image={s.image}
            day={s.date}
            type={s.kind === "coaching" ? "coach" : "event"}
            status={s.isNow ? "live" : "upcoming"}
            joinHref={s.joinHref}
          />
        ))}
      </div>

      {/* View past sessions */}
      <button
        onClick={() => setPastOpen(!pastOpen)}
        className="my-4 flex cursor-pointer items-center gap-2 rounded-lg bg-[#222222]/5 px-4 py-2.5 text-[14px] font-medium text-gray-dark transition-colors hover:bg-[#222222]/[0.08]"
      >
        {pastOpen ? "Hide past sessions" : "View past sessions"}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${pastOpen ? "rotate-180" : ""}`}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {pastOpen && (
        <div className="-mx-2 flex flex-col gap-1">
          {pastEvents.map((event, i) => (
            <SessionCard
              key={i}
              size="auto"
              title={event.title}
              dateTime={event.dateTime}
              duration={event.duration}
              image={event.image}
              status="past"
              hasRecording={event.hasRecording}
              type={event.hasRecording ? "event" : "coach"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Admin toggle row — mirrors the profile template / dashboard admin controls.
function AdminToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#f5f5f5]">
      <span className="text-[14px] font-medium text-gray-dark">{label}</span>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-[#d4d4d4] transition-colors peer-checked:bg-gray-dark" />
        <div className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

// `shell` renders the calendar bare (no PageShell / beige hero) so it can be
// embedded inside the "My Leland" store shell as its Calendar tab.
export default function Calendar({ shell = false }: { shell?: boolean }) {
  const navigate = useNavigate();
  const { dark: darkMode } = useDarkMode();
  const heroBg = darkMode ? "#5E6E79" : HERO_BG;
  // The shell (store) has no beige-driven top navbar, so keep the nav plain white.
  const navTheme = useMemo(
    () => shell
      ? { bg: "#ffffff", light: false, hideWordmark: false, scrollReveal: false }
      : { bg: heroBg, light: darkMode, hideWordmark: false, scrollReveal: true },
    [shell, heroBg, darkMode],
  );
  useSetNavTheme(navTheme);

  const [view, setView] = useState<"calendar" | "list">("list");

  // Admin menu (bottom-right) — matches the dashboard's 3-dot control. In the
  // store shell the Expert state mirrors the global (top-nav) toggle.
  const [adminOpen, setAdminOpen] = useState(false);
  const { expert: globalExpert } = useExpertMode();
  const [localExpert, setLocalExpert] = useState(false);
  const expert = shell ? globalExpert : localExpert;
  const adminRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!adminOpen) return;
    const onClick = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) setAdminOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [adminOpen]);

  // Upcoming-sessions card — shared by the standalone page and the store shell.
  const sessionsSection = (
    <section className="rounded-2xl border border-[#222222]/[0.10] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[19px] font-semibold leading-tight text-gray-dark">Upcoming sessions</h2>
        {/* Experts get an availability shortcut across from the header */}
        {expert && (
          <Button size="md" variant="secondary" onClick={() => navigate(shell ? "/my-leland/calendar" : "/coach/calendar")} className="shrink-0 font-semibold">
            Edit availability
          </Button>
        )}
        {/* View toggle — hidden for now */}
        <div className="hidden shrink-0 items-center gap-1 rounded-full bg-gray-hover p-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              aria-label={v.label}
              aria-pressed={view === v.key}
              className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
                view === v.key
                  ? "bg-white text-gray-dark shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                  : "text-gray-extra-light hover:text-gray-light"
              }`}
            >
              <span aria-hidden className="h-[18px] w-[18px] bg-current" style={maskStyle(v.icon)} />
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? <CalendarView /> : <ListView />}
    </section>
  );

  // Store shell: bare content (heading + sessions), no PageShell / beige hero.
  if (shell) {
    return (
      <div className="pb-6">
        <h1 className="font-serif text-[30px] font-medium leading-[1.1] text-gray-dark md:text-[38px]">Calendar</h1>
        <div className="mt-6">{sessionsSection}</div>
      </div>
    );
  }

  return (
    <PageShell
      variant="standard"
    >
      <div className="pb-[180px]">
        {/* Hero — a full-window beige band tucked under the top nav. */}
        <div
          className="-mt-[72px] pb-28 pt-[150px] md:-mt-10 md:pb-36 md:pt-16"
          style={{ backgroundColor: heroBg, ...fullBleed }}
        >
          <motion.div
            className={`${WRAP} flex items-start justify-between gap-4`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-serif text-[32px] font-medium leading-[1.1] text-gray-dark md:text-[40px]">Calendar</h1>
            <Button
              size="md"
              variant="secondary"
              iconOnly
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
              className="mt-1 shrink-0"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Button>
          </motion.div>
        </div>

        {/* Content — single column pulled up to overlap the hero */}
        <motion.div
          className="relative z-10 -mt-20 md:-mt-28"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {sessionsSection}
        </motion.div>
      </div>

      {/* Admin tool — 3-dot menu matching the dashboard */}
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
              <AdminToggle label="Expert" checked={expert} onChange={() => setLocalExpert((v) => !v)} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAdminOpen((o) => !o)}
          aria-label="Admin controls"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[#B1B1B1]/20 backdrop-blur-[12px] transition-colors hover:bg-[#B1B1B1]/30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="8" r="1.5" fill="#222222" />
            <circle cx="8" cy="8" r="1.5" fill="#222222" />
            <circle cx="13" cy="8" r="1.5" fill="#222222" />
          </svg>
        </button>
      </div>
    </PageShell>
  );
}
