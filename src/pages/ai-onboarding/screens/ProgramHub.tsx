/* Program Hub — the drop-off at the end of onboarding, modelled on the
 * production page at joinleland.com/programs/ai-builder-program: real TopNav,
 * cream hero band with breadcrumb + quick links, Level 1 card + Live sessions
 * card, calendar nudge, full roadmap, program resources. Personalised with the
 * cohort they chose. Content is mocked. */
import { useState } from "react";
import { ChevronRight, Hash, Home, LogOut, MoreHorizontal, RefreshCw, ArrowDown, Users, Eye } from "lucide-react";
import TopNav from "../../../components/TopNav";
import { Button } from "../../../components/Button";
import { ProgressBar, ProgressBarColor } from "../../../components/leland/ProgressBar";
import { COHORTS, ORG, USER, type Answers, type Path } from "../data";
import { useScenario } from "../scenario";
import aiBuilderL1 from "../../../assets/img/ai-builder-l3.avif";
import aiBuilderL2 from "../../../assets/img/ai-builder-l1.avif";
import aiBuilderL3 from "../../../assets/img/ai-builder-l2.avif";
import res1 from "../../../assets/placeholder images/courses/HERO-10-automations-scaled.avif";
import res2 from "../../../assets/placeholder images/courses/c10-hero-1920x1280.webp";
import res3 from "../../../assets/placeholder images/courses/HERO-5-systems-that-turn-your-expertise-min.avif";
import res4 from "../../../assets/placeholder images/courses/toolkit_visa_eligibility_tool_52ed4c99da.avif";
import pic1 from "../../../assets/profile photos/pic-1.png";
import pic3 from "../../../assets/profile photos/pic-3.png";
import pic5 from "../../../assets/profile photos/pic-5.png";
import appleCal from "/apple-calendar.jpeg";
import googleCal from "/google-calendar.png";
import outlookCal from "/outlook-calendar.png";

const LEVELS = [
  { n: 1, title: "Level 1: AI Builder Program", image: aiBuilderL1, progress: 0, lesson: "Lesson 1/4: AI Foundations & Mindset Shift" },
  { n: 2, title: "Level 2: AI Builder Program", image: aiBuilderL2, progress: 0 },
  { n: 3, title: "Level 3: AI Builder Program", image: aiBuilderL3, progress: 0 },
];

const RESOURCES = [
  { title: "AI-Powered Client System That Helped Land a First…", author: "Debby C.", photo: pic1, views: 1, image: res1 },
  { title: "Morning Agent Pair That Sorts Daily Notes and…", author: "Enoch C.", photo: pic3, views: 4, image: res2 },
  { title: "Lux: A Multi-Agent Travel Planning Operating…", author: "Itzel M.", photo: pic5, views: 11, image: res3 },
  { title: "Web Design Guidelines", author: "Leland Team", photo: null, views: 7, image: res4 },
];

export function ProgramHub({ answers, path }: { answers: Answers; path: Path }) {
  const scenario = useScenario();
  const [showData, setShowData] = useState(false);
  const [calDismissed, setCalDismissed] = useState(false);
  const cohort = COHORTS.find((c) => c.id === answers.cohortId);

  return (
    <div className="min-h-screen bg-white text-gray-dark">
      <TopNav />

      {/* Hero band */}
      <div className="bg-cream">
        <div className="mx-auto w-full max-w-[1096px] px-6 pb-[92px] pt-8">
          <nav className="flex items-center gap-2 text-[14px] text-gray-light" aria-label="Breadcrumb">
            <Home size={14} />
            <span>/</span>
            <span>Build with AI</span>
            <span>/</span>
            <span>Leland+</span>
          </nav>
          <h1 className="mt-2 font-serif text-[40px] font-medium leading-[1.1] text-gray-dark">AI Builder Program</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="md" variant="white" rounded="rounded-full" className="bg-[#222222]/5! hover:bg-[#222222]/10!"><LogOut size={15} /> Office hours</Button>
            <Button size="md" variant="white" rounded="rounded-full" className="bg-[#222222]/5! hover:bg-[#222222]/10!"><Hash size={15} /> Community</Button>
            <Button size="md" variant="white" rounded="rounded-full" className="bg-[#222222]/5! hover:bg-[#222222]/10!">Resource library <ArrowDown size={15} /></Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1096px] px-6 pb-20">
        {/* Level 1 + Live sessions, overlapping the band */}
        <div className="-mt-[72px] grid gap-4 lg:grid-cols-[356px_1fr]">
          <div className="rounded-2xl border border-gray-stroke bg-white p-5 shadow-card">
            <img src={aiBuilderL1} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />
            <div className="mt-5 text-[16px] font-medium">Level 1: AI Builder Program</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1"><ProgressBar value={0} color={ProgressBarColor.Dark} label="Level 1 progress" /></div>
              <span className="text-[12px] text-gray-light">0% complete</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Button size="md" variant="dark" rounded="rounded-lg">Start <ChevronRight size={14} /></Button>
              <span className="truncate text-[12px] text-gray-light">{LEVELS[0].lesson}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-stroke bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-[22px] font-medium leading-tight">Live sessions</h2>
                <div className="mt-1 text-[13px] text-gray-light">Level 1: AI Builder Program</div>
              </div>
              {cohort ? (
                <Button size="sm" variant="white" rounded="rounded-full" className="bg-[#222222]/5! hover:bg-[#222222]/10!">{cohort.short} <RefreshCw size={12} /></Button>
              ) : (
                <Button size="sm" variant="primary" rounded="rounded-full">Choose a cohort</Button>
              )}
            </div>
            {cohort ? (
              <ul className="mt-5 space-y-4">
                {cohort.sessions.map((s) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <div className="w-8 shrink-0 overflow-hidden rounded-md border border-gray-stroke text-center">
                      <div className="bg-blue/30 text-[9px] font-medium uppercase leading-[14px] text-gray-dark">{s.month}</div>
                      <div className="text-[15px] font-medium leading-[22px]">{s.day}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-medium">{s.when} <span className="font-normal text-gray-light">· {s.minutes} min</span></div>
                      <div className="text-[14px] text-gray-light">{s.title}</div>
                    </div>
                    <button type="button" aria-label="More" className="rounded-md p-1 text-gray-xlight hover:bg-[#222222]/5"><MoreHorizontal size={16} /></button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[14px] text-gray-light">Pick a Level 1 cohort to see your live session schedule here. Level 0 is ready to start now.</p>
            )}
            <Button size="md" variant="white" rounded="rounded-lg" className="mt-5 bg-[#222222]/5! hover:bg-[#222222]/10!">See all sessions</Button>
          </div>
        </div>

        {/* Calendar nudge */}
        {cohort && !calDismissed ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-stroke bg-white px-5 py-3.5 shadow-card">
            <div className="flex -space-x-1">
              <img src={appleCal} alt="" className="size-6 rounded-md border border-white object-cover" />
              <img src={googleCal} alt="" className="size-6 rounded-md border border-white object-cover" />
              <img src={outlookCal} alt="" className="size-6 rounded-md border border-white object-cover" />
            </div>
            <div className="text-[14px]"><span className="font-medium">Don't miss your sessions</span> <span className="text-gray-light">Add your live sessions to your calendar</span></div>
            <div className="ml-auto flex items-center gap-4 text-[13px] font-medium">
              <button type="button" onClick={() => setCalDismissed(true)} className="text-gray-light hover:text-gray-dark">Dismiss</button>
              <button type="button" className="hover:underline">Add to calendar</button>
            </div>
          </div>
        ) : null}

        {/* Roadmap */}
        <div className="mt-8 flex items-center gap-4">
          <h2 className="text-[16px] font-medium">Full roadmap</h2>
          <div className="h-px flex-1 bg-gray-stroke" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((l) => (
            <div key={l.n} className="rounded-2xl border border-gray-stroke bg-white p-3">
              <img src={l.image} alt="" className="aspect-[16/9] w-full rounded-lg object-cover" />
              <div className="mt-3 text-[14px] font-medium">{l.title}</div>
              {l.n === 1 ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-16"><ProgressBar value={0} color={ProgressBarColor.Dark} label="Progress" /></div>
                  <span className="text-[12px] text-gray-light">0% complete</span>
                </div>
              ) : (
                <div className="mt-2 text-[12px] text-gray-light">Not started</div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant={l.n === 1 ? "dark" : "white"} rounded="rounded-lg" className={l.n === 1 ? "" : "border border-gray-stroke"}>
                  Start <ChevronRight size={12} />
                </Button>
                {l.n === 1 ? <Button size="sm" variant="white" rounded="rounded-lg">Sessions <ChevronRight size={12} /></Button> : null}
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <h2 className="mt-12 font-serif text-[32px] font-medium leading-tight">Program resources</h2>
        <div className="mt-4 text-[12px] font-medium uppercase tracking-[0.12em] text-gray-light">Recently viewed</div>
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RESOURCES.map((r) => (
            <div key={r.title} className="flex gap-3">
              <img src={r.image} alt="" className="h-[52px] w-[92px] shrink-0 rounded-md object-cover" />
              <div className="min-w-0">
                <div className="line-clamp-2 text-[13px] font-medium leading-[1.3]">{r.title}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-light">
                  {r.photo ? <img src={r.photo} alt="" className="size-4 rounded-full object-cover" /> : <span className="flex size-4 items-center justify-center rounded-full bg-yellow text-[8px] font-bold">L</span>}
                  {r.author}
                  <Eye size={11} className="ml-1" /> {r.views} view{r.views === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {path === "team" ? (
          <div className="mt-10 flex items-center gap-3 rounded-2xl bg-cream px-5 py-4 text-[14px]">
            <Users size={18} />
            <span><span className="font-medium">{ORG.seats} teammates from {ORG.name}</span> are in this program. {ORG.inviter.name.split(" ")[0]} is your admin.</span>
          </div>
        ) : null}

        {/* prototype only */}
        <div className="mt-12 border-t border-gray-stroke pt-4 text-[12px] text-gray-extra-light">
          <button type="button" onClick={() => setShowData((v) => !v)} className="underline-offset-4 hover:underline">
            {showData ? "Hide" : "Show"} data captured in onboarding for {USER.firstName}
          </button>
          {showData ? (
            <pre className="mt-3 overflow-x-auto rounded-xl bg-[#111] p-4 font-mono text-[12px] leading-relaxed text-yellow">
              {JSON.stringify({ scenario, answers }, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}
