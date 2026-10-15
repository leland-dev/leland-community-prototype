import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import homeIcon from "../assets/img/program-hub/hdr-e8a6d.svg";
import calendarArrowIcon from "../assets/img/program-hub/hdr-03896.svg";
import slackIcon from "../assets/icons/slack-black.svg";
import chevronOverIcon from "../assets/img/program-hub/4e81c.svg";
import chevronOverWhiteIcon from "../assets/img/program-hub/9dd7f.svg";
import playIcon from "../assets/img/program-hub/73875.svg";
import sessionThumb from "../assets/img/program-hub/39f89.png";
import levelOne from "../assets/img/program-hub/1cef3.png";
import levelTwo from "../assets/img/program-hub/8e6c3.png";
import levelThree from "../assets/img/program-hub/fa1b2.png";
import levelFour from "../assets/img/program-hub/a93d8.png";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import imgPrompts from "../assets/img/builds/prompt-library.svg";
import imgInvoice from "../assets/img/builds/invoice-reconciliation.svg";
import imgNotes from "../assets/img/builds/meeting-notes.svg";
import imgOnboarding from "../assets/img/builds/onboarding-bot.svg";
import imgCrm from "../assets/img/builds/crm-cleanup.svg";
import imgCallCoach from "../assets/img/builds/sales-call-coach.svg";
import imgLeadBrief from "../assets/img/builds/lead-brief.svg";
import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic13 from "../assets/profile photos/pic-13.png";
import heroPhoto from "../assets/placeholder images/placeholder-event-02.png";

// Program hub: the page between "My content" and a course. It shows where the learner is in the program,
// their live sessions, every level (each links to its course), and the program's resources.
// Layout follows the "Program Hub · New" design in Figma (Courses — Programs).

const COURSE_PATH = "/content-viewer"; // the Level 1 course player

type Level = {
  number: number;
  title: string;
  image: string;
  status: "complete" | "in-progress" | "not-started";
  progressPct?: number;
  to: string;
};

const LEVELS: Level[] = [
  { number: 1, title: "Level 1: Use AI to 10x your impact", image: levelOne, status: "in-progress", progressPct: 50, to: COURSE_PATH },
  { number: 2, title: "Level 2: Build Complex Agentic Workflows", image: levelTwo, status: "not-started", to: "/course/1" },
  { number: 3, title: "Level 3: Create Autonomous Agents", image: levelThree, status: "not-started", to: "/course/1" },
  { number: 4, title: "Level 4: Build Your Agent Workforce", image: levelFour, status: "not-started", to: "/course/1" },
];

type Item = {
  title: string;
  author: string;
  avatar: string;
  image: string;
  category: string;
  useCase: string;
  collection: "Community builds" | "Tutorials" | "Skills";
  tool: string;
};

const ITEMS: Item[] = [
  { title: "Soulbox: Voice-to-Memory Capture and Auto-Built Memory Books", author: "Matthew Watkins", avatar: pic9, image: imgNotes, category: "Marketing", useCase: "Content Creation", collection: "Community builds", tool: "Notion" },
  { title: "A resident portal replacing HOA Group Texts", author: "Matthew Watkins", avatar: pic9, image: imgOnboarding, category: "Human Resources", useCase: "App development", collection: "Community builds", tool: "Slack" },
  { title: "Lux: A Multi-Agent Travel Planning Operating System", author: "Matthew Watkins", avatar: pic9, image: imgLeadBrief, category: "Sales", useCase: "Research & Intelligence", collection: "Community builds", tool: "Google Drive" },
  { title: "SIFT: A Celiac App", author: "Matthew Watkins", avatar: pic9, image: imgMetrics, category: "Design", useCase: "App development", collection: "Community builds", tool: "Wordpress" },
  { title: "A Living Competitive Intelligence Wiki for Healthcare", author: "Isabella Martinez", avatar: pic1, image: imgCrm, category: "Business Analytics & Intelligence", useCase: "Research & Intelligence", collection: "Community builds", tool: "Notion" },
  { title: "Winning copy analysis", author: "Leland", avatar: pic11, image: imgPrompts, category: "Marketing", useCase: "Content Creation", collection: "Skills", tool: "Notion" },
  { title: "Trigger recap", author: "Leland", avatar: pic11, image: imgInvoice, category: "Sales", useCase: "Automation & Ops", collection: "Skills", tool: "Hubspot" },
  { title: "Automated Weekly Meme Monday content for LinkedIn", author: "Lucas Gonzalez", avatar: pic5, image: imgTriage, category: "Marketing", useCase: "Content Creation", collection: "Community builds", tool: "Slack" },
  { title: "Turning Every Customer Call Into a Ready-to-Send Follow-Up Email", author: "Ethan Carter", avatar: pic13, image: imgCallCoach, category: "Sales", useCase: "Productivity & Planning", collection: "Tutorials", tool: "Hubspot" },
  { title: "Create an agent that helps you think through decisions", author: "Maya Thompson", avatar: pic6, image: imgNotes, category: "Business Analytics & Intelligence", useCase: "Productivity & Planning", collection: "Tutorials", tool: "Notion" },
  { title: "Weekly recap", author: "Leland", avatar: pic11, image: imgMetrics, category: "Marketing", useCase: "Reporting & Analytics", collection: "Skills", tool: "Asana" },
  { title: "Customer feedback workflow", author: "Ava Johnson", avatar: pic3, image: imgCrm, category: "Marketing", useCase: "Reporting & Analytics", collection: "Community builds", tool: "Slack" },
  { title: "Build your job search OS with Claude", author: "Maya Thompson", avatar: pic6, image: imgLeadBrief, category: "Human Resources", useCase: "Personal website", collection: "Tutorials", tool: "Notion" },
  { title: "Build a 1:1 prep assistant", author: "Maya Thompson", avatar: pic6, image: imgCallCoach, category: "Human Resources", useCase: "Productivity & Planning", collection: "Tutorials", tool: "Google Drive" },
  { title: "An interactive book club site with live voting", author: "Sophia Lee", avatar: pic8, image: imgOnboarding, category: "Design", useCase: "App development", collection: "Community builds", tool: "Wordpress" },
  { title: "18-week marathon plan built from your own Garmin and coaching data", author: "Noah Wilson", avatar: pic13, image: imgPrompts, category: "Finance & Accounting", useCase: "Reporting & Analytics", collection: "Community builds", tool: "Google Drive" },
];

const CATEGORIES = ["Sales", "Marketing", "Human Resources", "Business Analytics & Intelligence", "Design", "Finance & Accounting"];
const USE_CASES = ["Productivity & Planning", "Content Creation", "Personal website", "Reporting & Analytics", "Automation & Ops", "App development"];
const COLLECTIONS = ["Community builds", "Tutorials", "Skills"];
const TOOLS = ["Notion", "Hubspot", "Google Drive", "Asana", "Slack", "Wordpress"];
const USE_CASE_TILES = ["Productivity & Planning", "Content Creation", "Personal website", "Reporting & Analytics", "App development", "Outreach", "Automation & Ops", "Research & Intelligence"];

// ─── Small pieces ─────────────────────────────────────────────────────────────

function IconImg({ src, size = 20 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} className="shrink-0" style={{ width: size, height: size }} />;
}

function ProgressBar({ pct, label, className = "" }: { pct: number; label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="whitespace-nowrap text-[12px] text-gray-extra-light">{label}</span>}
      <div className="flex h-1 min-w-px flex-1 rounded bg-gray-stroke">
        <div className="h-full rounded bg-gray-dark" style={{ width: `${Math.max(pct, 1)}%` }} />
      </div>
    </div>
  );
}

function RoundArrow({ dir, disabled, onClick, floating }: { dir: "left" | "right"; disabled?: boolean; onClick?: () => void; floating?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={`flex items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-30 disabled:hover:bg-white ${
        floating ? "p-3 shadow-[0_4px_4px_rgba(16,24,40,0.1)]" : "p-2"
      }`}
    >
      <svg width={floating ? 20 : 18} height={floating ? 20 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

function ContentCard({ item }: { item: Item }) {
  return (
    <div className="group min-w-[200px] cursor-pointer overflow-hidden">
      <div className="aspect-[120/63] w-full overflow-hidden rounded-lg border border-gray-stroke bg-gray-hover">
        <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
      </div>
      <div className="flex flex-col gap-1.5 pt-2">
        <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{item.title}</p>
        <div className="flex items-center gap-1.5">
          <img src={item.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
          <span className="truncate text-[12px] text-gray-light">{item.author}</span>
        </div>
      </div>
    </div>
  );
}

const sectionTitle = "font-serif text-[28px] font-medium leading-[1.2] text-gray-dark";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramHub() {
  const navigate = useNavigate();
  const shippedRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<{ category: string[]; useCase: string[]; collection: string[]; tool: string[] }>({ category: ["Marketing"], useCase: [], collection: [], tool: [] });
  const [open, setOpen] = useState<Record<string, boolean>>({ category: true, useCase: false, collection: false, tool: false });
  const [query, setQuery] = useState("");

  const toggleChip = (group: keyof typeof filters, value: string) =>
    setFilters((f) => ({ ...f, [group]: f[group].includes(value) ? f[group].filter((v) => v !== value) : [...f[group], value] }));
  const activeCount = (g: keyof typeof filters) => filters[g].length;
  const anyFilter = Object.values(filters).some((v) => v.length > 0) || query !== "";

  const results = useMemo(
    () =>
      ITEMS.filter((it) => {
        if (filters.category.length && !filters.category.includes(it.category)) return false;
        if (filters.useCase.length && !filters.useCase.includes(it.useCase)) return false;
        if (filters.collection.length && !filters.collection.includes(it.collection)) return false;
        if (filters.tool.length && !filters.tool.includes(it.tool)) return false;
        if (query && !`${it.title} ${it.author}`.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [filters, query],
  );

  const scrollShipped = () => shippedRef.current?.scrollBy({ left: shippedRef.current.clientWidth * 0.75, behavior: "smooth" });

  const FilterGroup = ({ id, title, options, search }: { id: keyof typeof filters; title: string; options: string[]; search?: boolean }) => (
    <div className="border-t border-gray-stroke">
      <button type="button" onClick={() => setOpen((o) => ({ ...o, [id]: !o[id] }))} className="flex w-full items-center gap-2.5 px-4 py-5 text-left">
        <span className="flex-1 text-[14px] font-semibold text-black">{title}</span>
        {activeCount(id) > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-black pb-0.5 text-[13px] font-semibold leading-none text-white">{activeCount(id)}</span>
        )}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-dark">
          {open[id] ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
        </svg>
      </button>
      {open[id] && (
        <div className="flex flex-col gap-5 px-4 pb-5">
          {search && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-stroke bg-white px-4 py-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <span className="text-[14px] text-gray-extra-light">Search</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggleChip(id, o)}
                className={`rounded-lg bg-white px-3 py-2 text-[12px] font-semibold leading-[1.5] text-gray-dark ${filters[id].includes(o) ? "border-[1.5px] border-gray-dark" : "border border-gray-stroke"}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#F9F8F3] pb-24">
      {/* Tan band behind the header */}
      <div className="absolute inset-x-0 top-0 h-[320px] bg-[#F3F1E6]" aria-hidden />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 pt-8">
          <div className="flex flex-col gap-3">
            <nav className="flex items-center gap-2 text-[14px] leading-[1.35]" aria-label="Breadcrumb">
              <Link to="/my-leland" aria-label="Home"><IconImg src={homeIcon} size={16} /></Link>
              <span className="text-gray-extra-light">/</span>
              <span className="text-gray-light">Build with AI</span>
              <span className="text-gray-extra-light">/</span>
              <span className="text-gray-light">Leland+</span>
            </nav>
            <h1 className="font-serif text-[36px] font-medium leading-[1.1] text-gray-dark sm:text-[46px]">AI Builder Program</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="md" variant="secondary" rounded="rounded-full" className="!gap-2 !bg-black/5 font-semibold">
              <IconImg src={calendarArrowIcon} />Office hours
            </Button>
            <Button size="md" variant="secondary" rounded="rounded-full" className="!gap-2 !bg-black/5 font-semibold">
              <IconImg src={slackIcon} />Community
            </Button>
            <Button size="md" variant="secondary" rounded="rounded-full" className="!gap-2 !bg-black/5 font-semibold">
              Resource library
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
            </Button>
          </div>
        </div>

        {/* Current course + live sessions */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-stroke bg-white p-6 shadow-[0_1px_1px_rgba(16,24,40,0.05)] lg:max-w-[400px] lg:flex-1">
            <img src={levelOne} alt="AI Builder Program Level 1" className="max-h-[120px] w-auto max-w-full self-start rounded-lg border border-black/5 object-cover" />
            <div className="flex flex-col gap-2.5 py-2.5">
              <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">Level 1: Use AI to 10x your impact</p>
              <ProgressBar pct={50} label="50% complete" className="max-w-[300px]" />
            </div>
            <div className="flex items-center gap-4">
              <Button size="md" variant="dark" onClick={() => navigate(COURSE_PATH)} className="!gap-2 font-semibold">
                Resume<IconImg src={chevronOverWhiteIcon} />
              </Button>
              <p className="min-w-px flex-1 truncate text-[14px] leading-[1.35] text-gray-light">Automate communication in your voice</p>
            </div>
          </div>

          <div className="flex min-w-[280px] flex-1 flex-col gap-4 rounded-2xl border border-gray-stroke bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex min-w-px flex-1 flex-col gap-1.5">
                <p className="text-[22px] font-semibold leading-[1.2] text-gray-dark">Live sessions</p>
                <p className="text-[14px] font-medium leading-[1.35] text-gray-light">Level 1: Use AI to 10x your impact</p>
              </div>
              <Button size="sm" variant="secondary" rounded="rounded-full" className="!gap-1.5 !bg-black/5 font-semibold">
                May 24 cohort
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 013-3h15" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 01-3 3H3" /></svg>
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex h-16 items-center gap-3 py-2.5">
                <div className="flex size-11 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-stroke bg-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]">
                  <div className="h-3 w-full bg-[#80aced]" />
                  <div className="flex flex-1 items-center justify-center pb-1 pt-0.5 text-[16px] font-semibold leading-[1.3] text-gray-dark">18</div>
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-0.5">
                  <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">
                    Today at 6:00 PM <span className="text-[14px] font-normal text-gray-extra-light">· 60 min</span>
                  </p>
                  <p className="truncate text-[14px] text-gray-light">Build your Agentic Operating System</p>
                </div>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className="shrink-0 text-gray-dark" aria-hidden><circle cx="8" cy="3.5" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="8" cy="12.5" r="1" /></svg>
              </div>
              <div className="flex h-16 items-center gap-3 py-2.5">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-light">
                  <img src={sessionThumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <img src={playIcon} alt="" className="relative h-3 w-[11px]" />
                </div>
                <div className="flex min-w-px flex-1 flex-col gap-0.5">
                  <p className="truncate text-[16px] font-semibold leading-[1.3] text-gray-dark">Analyze data and design presentations</p>
                  <p className="truncate text-[14px] text-gray-light">Sept 31, 8am · Session Title Goes Here</p>
                </div>
              </div>
            </div>
            <Button size="md" variant="secondary" className="self-start !bg-black/5 font-semibold">See all sessions</Button>
          </div>
        </div>

        {/* Roadmap */}
        <section className="mt-5 flex flex-col gap-4 pb-4">
          <div className="flex items-center gap-5">
            <h2 className="text-[18px] font-semibold leading-[1.3] text-gray-light">Roadmap</h2>
            <div className="h-px flex-1 bg-gray-stroke" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LEVELS.map((lvl) => {
              const notStarted = lvl.status === "not-started";
              return (
                <div key={lvl.number} className="flex min-w-[216px] max-w-[250px] flex-1 flex-col gap-2.5 rounded-xl border border-gray-stroke bg-white p-4">
                  <img src={lvl.image} alt="" className="aspect-[115.25/60.5] w-full rounded-lg border border-black/5 object-cover" />
                  <div className="flex flex-col gap-1.5">
                    <p className="flex h-[38px] items-center overflow-hidden text-[14px] font-semibold leading-[1.35] text-gray-dark">{lvl.title}</p>
                    {notStarted ? (
                      <span className="text-[12px] leading-[1.5] text-gray-extra-light">Not started</span>
                    ) : (
                      <ProgressBar pct={lvl.progressPct ?? 0} label={`${lvl.progressPct}% complete`} className="max-w-[180px]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {notStarted ? (
                      <Button size="sm" variant="secondary" onClick={() => navigate(lvl.to)} className="!gap-1.5 !bg-black/5 font-semibold">
                        Start<IconImg src={chevronOverIcon} size={18} />
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="dark" onClick={() => navigate(lvl.to)} className="font-semibold">Resume</Button>
                        <Button size="sm" variant="outline" className="font-semibold">Select cohort</Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Program resources */}
        <section className="mt-10 flex flex-col gap-8">
          <h2 className={sectionTitle + " !text-[28px]"}>Program resources</h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="flex-1 text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.2px] text-gray-light">Recently viewed</p>
              <div className="flex items-center gap-2">
                <RoundArrow dir="left" disabled />
                <RoundArrow dir="right" disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { img: imgPrompts, title: "Prompt library for the ops team: tested prompts to reuse", meta: "32 assets", stack: true },
                { img: imgTriage, title: "Build a support ticket triage agent, start to finish", meta: "21 views", author: "Jonas C.", avatar: pic5 },
                { img: imgMetrics, title: "Weekly metrics digest: automate your Monday summary", meta: "55 views", author: "Jonas C.", avatar: pic5 },
                { img: "", title: "Prompting patterns that hold up in production", meta: "55 views", author: "Jonas C.", avatar: pic5 },
              ].map((r) => (
                <div key={r.title} className="flex min-w-0 cursor-pointer items-center gap-3">
                  <div className="relative h-14 w-[107px] shrink-0 overflow-hidden rounded-md border border-gray-stroke bg-gray-hover">
                    {r.img && <img src={r.img} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex min-w-px flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{r.title}</p>
                    <div className="flex items-center gap-2 text-[12px] leading-[1.35]">
                      {r.author && (
                        <span className="flex items-center gap-1 text-gray-light">
                          <img src={r.avatar} alt="" className="h-[14px] w-[14px] rounded-full object-cover" />
                          {r.author}
                        </span>
                      )}
                      <span className="truncate text-gray-extra-light">{r.meta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* See what others shipped */}
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className={sectionTitle}>See what others shipped</p>
                <p className="text-[16px] leading-[1.5] text-gray-light">Real builds filterable by role, use case and tool</p>
              </div>
              <Button size="md" variant="dark" className="self-start font-semibold">Get inspiration</Button>
            </div>
            <div className="relative">
              <div ref={shippedRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ITEMS.filter((i) => i.collection === "Community builds").slice(0, 8).map((it) => (
                  <div key={it.title} className="w-[240px] shrink-0 sm:w-[calc((100%-60px)/4)]">
                    <ContentCard item={it} />
                  </div>
                ))}
              </div>
              <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
                <RoundArrow dir="right" floating onClick={scrollShipped} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[pic9, pic1, pic6].map((p, i) => (
                  <img key={i} src={p} alt="" className={`h-5 w-5 rounded-full object-cover ring-2 ring-white ${i > 0 ? "-ml-1.5" : ""}`} />
                ))}
              </div>
              <span className="text-[14px] text-gray-light">331 submissions</span>
            </div>
          </div>

          {/* Browse by use case */}
          <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <p className={sectionTitle}>Browse by use case</p>
                <p className="text-[16px] leading-[1.5] text-gray-light">Tutorials, inspo and downloadable skills</p>
              </div>
              <Button size="md" variant="dark" className="self-start font-semibold">See all 137 resources</Button>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="flex min-w-px flex-1 flex-wrap content-start gap-3">
                {USE_CASE_TILES.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, useCase: [u] }))}
                    className="rounded-lg bg-black/5 px-6 py-4 text-[14px] font-semibold leading-[1.5] text-gray-dark transition-colors hover:bg-black/[0.08]"
                  >
                    {u}
                  </button>
                ))}
              </div>
              <div className="relative hidden h-[118px] w-[287px] shrink-0 lg:block" aria-hidden>
                <div className="absolute left-[-10px] top-[28px] h-[80px] w-[151px] -rotate-3 overflow-hidden rounded border border-gray-stroke bg-[#F5C84A] shadow-sm">
                  <img src={levelOne} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute left-[80px] top-0 h-[108px] w-[205px] rotate-3 overflow-hidden rounded border border-gray-stroke shadow-sm">
                  <img src={heroPhoto} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Browse all */}
        <section className="mt-16">
          <div className="flex flex-col gap-4 px-0 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div className="flex flex-col gap-2">
              <h2 className={sectionTitle}>Browse all</h2>
              <p className="text-[16px] leading-[1.3] text-gray-extra-light">412 tutorials, demos and downloadable skills</p>
            </div>
            <div className="flex w-full items-center gap-2 rounded-full border border-gray-stroke bg-white px-4 py-3 sm:w-[397px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent text-[14px] text-gray-dark outline-none placeholder:text-gray-extra-light" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row sm:px-6">
            <aside className="h-fit w-full shrink-0 overflow-hidden rounded-2xl border border-gray-stroke bg-white py-4 lg:w-[300px]">
              <div className="flex items-center gap-2.5 px-4 pb-5">
                <p className="flex-1 text-[18px] font-semibold leading-[1.3] text-black">Filter by</p>
                <Button
                  size="sm"
                  variant="outline"
                  rounded="rounded-full"
                  className="font-semibold"
                  disabled={!anyFilter}
                  onClick={() => { setFilters({ category: [], useCase: [], collection: [], tool: [] }); setQuery(""); }}
                >
                  Clear filters
                </Button>
              </div>
              <FilterGroup id="category" title="Category" options={CATEGORIES} search />
              <FilterGroup id="useCase" title="Use Case" options={USE_CASES} search />
              <FilterGroup id="collection" title="Collection" options={COLLECTIONS} />
              <FilterGroup id="tool" title="Tool" options={TOOLS} search />
            </aside>

            <div className="min-w-0 flex-1">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-gray-stroke bg-white px-6 py-16 text-center text-[14px] text-gray-light">No resources match these filters.</div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((it) => <ContentCard key={it.title} item={it} />)}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

