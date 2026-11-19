import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { sectionTitle } from "./ProgramHub";
import ProgramAltRoadmap from "./ProgramAltRoadmap";
import ProgramAltLiveSessions from "./ProgramAltLiveSessions";
import ProgramAltResources from "./ProgramAltResources";
import ProgramAltCommunity from "./ProgramAltCommunity";
import YourLevelCard, { type LevelDimension } from "../components/YourLevelCard";
import RecommendedBuilds from "../components/RecommendedBuilds";
import SessionCard from "../components/SessionCard";
import { Button } from "../components/Button";
import homeIcon from "../assets/icons/nav-icons/home-inactive.svg";
import roadmapIcon from "../assets/icons/Arrow, Location, Direction.svg";
import signalIcon from "../assets/icons/lte-signal.svg";
import bookIcon from "../assets/icons/book-open.svg";
import communityIcon from "../assets/icons/chat-inactive-bold.svg";
import settingsIcon from "../assets/icons/settings.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";

// Alternate AI Builder Program experience: the same hub content, but reframed
// inside a My Leland-style left sidebar (floating white card of nav rows) with
// the program split across tabs, each its own route under
// /program/ai-builder-alt. "Home" (the index) is a roll-up of the other
// sections; "My Roadmap" (/roadmap) is the existing hub; the rest are
// placeholders for now.

// Base path for the alt experience. Sidebar/Home links are built as absolute
// paths off this — relative links don't resolve correctly from inside a splat
// (/*) route once a sub-tab's segment is in the URL.
const BASE = "/program/ai-builder-alt";

const TABS: { to: string; end?: boolean; label: string; icon: string }[] = [
  { to: BASE, end: true, label: "Home", icon: homeIcon },
  { to: `${BASE}/roadmap`, label: "My Roadmap", icon: roadmapIcon },
  { to: `${BASE}/live-sessions`, label: "Live Sessions", icon: signalIcon },
  { to: `${BASE}/resources`, label: "Resources", icon: bookIcon },
  { to: `${BASE}/community`, label: "Community", icon: communityIcon },
  { to: `${BASE}/settings`, label: "Settings", icon: settingsIcon },
];

// Icons are tinted via CSS mask + bg-current so they follow the row's text
// color (gray-light when inactive, gray-dark when active) — mirrors the My
// Leland sidebar's NavIcon, since the source SVGs have hardcoded colors.
function NavIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="h-[22px] w-[22px] shrink-0 bg-current"
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
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

// Decorative avatar cluster for the community banner — echoes the reference's
// "bleeding faces" on the right edge.
const BANNER_AVATARS: { src: string; size: number; top: number; right: number }[] = [
  { src: pic9, size: 72, top: 4, right: 10 },
  { src: pic1, size: 60, top: 78, right: 54 },
  { src: pic6, size: 52, top: 16, right: 96 },
  { src: pic8, size: 64, top: 86, right: 142 },
  { src: pic5, size: 46, top: 40, right: 206 },
];

// Home — a roll-up of the program's sections. A primary "continue your
// roadmap" card over a grid of links into the other tabs.
function Home() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col gap-8 px-4 pb-[100px] pt-16 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">AI Builder Program</h1>
        <p className="text-[16px] leading-[1.5] text-gray-light">Everything in your program, in one place.</p>
      </div>

      {/* Your level — roll-up of AI L&D progress */}
      <YourLevelCard
        title="Experimenting"
        description="Has the fundamentals: clear prompts, real context, safe habits. Next is Applying: has AI built into real workflows, like drafts, decks and tools."
        value={0.42}
        startLabel="Exploring"
        endLabel="Building"
        breakdown={LEVEL_DIMENSIONS}
      />

      {/* Your next build — recommended builds */}
      <RecommendedBuilds title="Your next build" cta={{ label: "See my roadmap", to: `${BASE}/roadmap` }} />

      {/* Upcoming sessions — styled to match "Jump back in" */}
      <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <p className={sectionTitle}>Upcoming sessions</p>
          <p className="text-[16px] leading-[1.5] text-gray-light">Live sessions and office hours coming up — join or register.</p>
        </div>
        <div className="flex flex-col">
          {UPCOMING_SESSIONS.map((s) => (
            <SessionCard
              key={s.title}
              title={s.title}
              dateTime={s.dateTime}
              duration={s.duration}
              day={s.day}
              status={s.status}
              type="event"
              image=""
              cta={
                s.status === "live" ? (
                  <Button size="md" variant="dark" rounded="rounded-full" className="font-semibold">Join</Button>
                ) : (
                  <Button size="md" variant="secondary" rounded="rounded-full" className="!bg-black/5 font-semibold">Register</Button>
                )
              }
            />
          ))}
        </div>
        <Button size="md" variant="secondary" className="self-start !bg-black/5 font-semibold" onClick={() => navigate(`${BASE}/live-sessions`)}>
          See all sessions
        </Button>
      </div>

      {/* Community — loud Slack banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-7 sm:p-10"
        style={{ background: "linear-gradient(100deg, #1A1420 0%, #3F0E3F 42%, #611f69 66%, #9B2FA8 100%)" }}
      >
        <div className="relative z-10 flex max-w-[460px] flex-col gap-4">
          <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-white/70">Slack community</span>
          <div className="flex flex-col gap-2">
            <p className="font-serif text-[28px] font-medium leading-[1.15] text-white sm:text-[32px]">Talk builds with the community</p>
            <p className="text-[16px] leading-[1.5] text-white/80">
              Swap wins, blockers, and builds with other people on the same journey.
            </p>
          </div>
          <div className="flex items-center gap-5 pt-1">
            <Button
              size="lg"
              variant="secondary"
              rounded="rounded-full"
              className="!bg-white !text-gray-dark font-semibold shadow-sm transition-transform hover:!bg-white hover:scale-[1.02]"
              onClick={() => navigate(`${BASE}/community`)}
            >
              Join Slack
            </Button>
            <button type="button" onClick={() => navigate(`${BASE}/community`)} className="text-[15px] font-semibold text-white/90 transition-colors hover:text-white">
              Learn more
            </button>
          </div>
        </div>

        {/* Bleeding face cluster on the right */}
        <div className="pointer-events-none absolute right-2 top-1/2 hidden h-[170px] w-[280px] -translate-y-1/2 md:block">
          {BANNER_AVATARS.map((a, i) => (
            <img
              key={i}
              src={a.src}
              alt=""
              className="absolute rounded-full object-cover ring-4 ring-white/15"
              style={{ width: a.size, height: a.size, top: a.top, right: a.right }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// The six sub-dimensions behind the "Your level" roll-up (shown in the
// accordion's breakdown). Scores are sample data.
const LEVEL_DIMENSIONS: LevelDimension[] = [
  { index: "01", title: "Opportunity awareness", description: "Whether you spot the next thing in your week that AI should take on, and stay curious.", score: 3, max: 5, levelLabel: "Analysis" },
  { index: "02", title: "Workflow integration", description: "Whether AI is doing real work in the core of your role, not just the small things around it.", score: 3, max: 5, levelLabel: "Analysis" },
  { index: "03", title: "Delegation depth", description: "How far your use goes: from one-off questions, to work it produces, to workflows it runs.", score: 3, max: 5, levelLabel: "Analysis" },
  { index: "04", title: "Output judgement", description: "Whether you own what AI gives you: telling good from slop and checking it before it goes out.", score: 3, max: 5, levelLabel: "Analysis" },
  { index: "05", title: "Compounding impact", description: "Whether AI has actually changed your work, handing off the heavy parts and freeing your time.", score: 3, max: 5, levelLabel: "Analysis" },
  { index: "06", title: "Responsible use", description: "Whether you keep sensitive data in approved tools and mind what your agents can reach.", score: 2, max: 5, levelLabel: "Analysis" },
];

// Upcoming sessions shown on Home — a live session plus office hours to join or register for.
const UPCOMING_SESSIONS: { title: string; dateTime: string; duration: string; day: string; status: "live" | "upcoming" }[] = [
  { title: "Build your Agentic Operating System", dateTime: "Today at 6:00 PM", duration: "60 min", day: "18", status: "live" },
  { title: "Office hours with the Leland team", dateTime: "Thu, May 29 at 2:00 PM", duration: "45 min", day: "29", status: "upcoming" },
  { title: "Office hours: prompting deep-dive", dateTime: "Mon, Jun 2 at 10:00 AM", duration: "45 min", day: "2", status: "upcoming" },
];

// Placeholder surface for the tabs that don't have content yet — centered
// empty state matching the hub's beige page.
function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-61px)] max-w-[980px] flex-col px-4 pb-[100px] pt-16 sm:px-6">
      <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">{title}</h1>
      {/* Empty state — borrows the "Sell on Leland" card treatment: a soft
          #222 4% fill with a 3px-dash gray-dark border drawn as an SVG. */}
      <div
        className="mt-10 flex flex-1 items-center justify-center rounded-[12px] bg-[#222222]/[0.04] p-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg%20width='100%25'%20height='100%25'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='100%25'%20height='100%25'%20fill='none'%20rx='12'%20ry='12'%20stroke='%23222222'%20stroke-opacity='0.3'%20stroke-width='2'%20stroke-dasharray='3%204'/%3e%3c/svg%3e\")",
        }}
      >
        <p className="max-w-[420px] text-center text-[15px] leading-snug text-gray-light">{description}</p>
      </div>
    </div>
  );
}

export default function ProgramHubAlt() {
  const rowClass = ({ isActive }: { isActive: boolean }) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-[10px] text-left text-[15px] transition-colors ${
      isActive ? "bg-[#222222]/5 font-semibold text-gray-dark" : "font-medium text-gray-light hover:text-gray-dark"
    }`;

  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-[#F9F8F3]">
      {/* Left sidebar — My Leland-style floating card of nav rows. */}
      <aside className="hidden w-[264px] shrink-0 md:block">
        <div className="sticky top-[61px] flex h-[calc(100vh-61px)] flex-col gap-4 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-5">
          <div className="shrink-0 rounded-[12px] border border-[#222222]/[0.12] bg-white p-2 shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.10),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => (
                <NavLink key={tab.to} to={tab.to} end={tab.end} className={rowClass}>
                  <NavIcon src={tab.icon} />
                  <span className="min-w-0 flex-1 truncate">{tab.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content — each tab is its own route. */}
      <div className="min-w-0 flex-1">
        <Routes>
          <Route index element={<Home />} />
          <Route path="roadmap" element={<ProgramAltRoadmap />} />
          <Route path="live-sessions" element={<ProgramAltLiveSessions />} />
          <Route path="resources" element={<ProgramAltResources />} />
          <Route path="community" element={<ProgramAltCommunity />} />
          <Route
            path="settings"
            element={
              <Placeholder
                title="Settings"
                description="Manage your program preferences, notifications, and account details here."
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}
