import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import levelTwoCover from "../../assets/img/program-hub/8e6c3.png";
import imgLeadBrief from "../../assets/img/builds/lead-brief.svg";
import imgOnboarding from "../../assets/img/builds/onboarding-bot.svg";
import imgInvoice from "../../assets/img/builds/invoice-reconciliation.svg";
import imgTriage from "../../assets/img/builds/triage-agent.svg";
import imgMetrics from "../../assets/img/builds/metrics-digest.svg";
import imgCallCoach from "../../assets/img/builds/sales-call-coach.svg";
import pic5 from "../../assets/profile photos/pic-5.png";
import pic6 from "../../assets/profile photos/pic-6.png";
import pic9 from "../../assets/profile photos/pic-9.png";

// The page a learner lands on after the last lesson of a level, laid out like "Course complete" in the Figma file
// (Courses — Programs): the level's cover with a check, what they did, a certificate, what they shipped, what others
// shipped, and what to do next.

const PROGRAM_HUB = "/program/ai-builder";


// Everything the learner shipped in this level (a level has several builds), shown as a carousel they can click or swipe through.
const MY_BUILDS = [
  { title: "Lux: A Multi-Agent Travel Planning Operating System", blurb: "A multi-agent travel OS that turns preferences into a full interactive itinerary", image: imgLeadBrief },
  { title: "Onboarding checklist bot", blurb: "Walks new hires through their first-week tasks and answers questions along the way", image: imgOnboarding },
  { title: "Invoice reconciliation helper", blurb: "Matches invoices to purchase orders and flags anything that doesn't line up", image: imgInvoice },
  { title: "Weekly metrics digest", blurb: "Pulls the dashboard numbers each Monday and writes the summary for leadership", image: imgMetrics },
];

const OTHERS_SHIPPED = [
  { title: "A multi-agent support desk that triages every ticket", blurb: "Routes inbound tickets by urgency and drafts the first reply for a person to review.", author: "Ariel L.", avatar: pic5, image: imgTriage },
  { title: "Weekly metrics digest for the whole leadership team", blurb: "Pulls the dashboard numbers each Monday and writes the summary, ready to send.", author: "Noor K.", avatar: pic6, image: imgMetrics },
  { title: "A sales call coach that scores calls against your playbook", blurb: "Listens to recordings, scores them, and picks two moments to review in your next 1:1.", author: "Marcus E.", avatar: pic9, image: imgCallCoach },
];

const rule = <div className="h-px w-full bg-gray-stroke" />;

/** Set to false to hide "You shipped" and "See what others shipped". */
const SHOW_BUILDS = true;

function ArrowButton({ dir, disabled, onClick, small }: { dir: "left" | "right"; disabled?: boolean; onClick?: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={`flex items-center justify-center rounded-full border border-gray-stroke bg-white text-gray-dark transition-colors hover:bg-gray-hover disabled:opacity-30 disabled:hover:bg-white ${small ? "p-2" : "p-3"}`}
    >
      <svg width={small ? 16 : 20} height={small ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === "left" ? <path d="M19 12H5M12 19l-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
      </svg>
    </button>
  );
}

function MyBuildsCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = MY_BUILDS.length;

  // Keep the position in step with swiping and scrolling.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / (el.clientWidth || 1)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => track.current?.scrollTo({ left: Math.max(0, Math.min(count - 1, i)) * (track.current?.clientWidth ?? 0), behavior: "smooth" });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white">
      <div className="flex items-center justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <p className="text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.2px] text-gray-light">You shipped</p>
        {count > 1 && (
          <div className="flex items-center gap-2">
            <ArrowButton small dir="left" disabled={index <= 0} onClick={() => go(index - 1)} />
            <ArrowButton small dir="right" disabled={index >= count - 1} onClick={() => go(index + 1)} />
          </div>
        )}
      </div>
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-roledescription="carousel" aria-label="Your builds">
        {MY_BUILDS.map((b, i) => (
          <div key={b.title} className="flex w-full shrink-0 snap-center flex-col items-stretch gap-6 px-6 pb-6 pt-4 md:flex-row md:items-center md:gap-8 md:px-8 md:pb-8 md:pt-5" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`}>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
              <div className="flex flex-col gap-4">
                <h2 className="font-season text-[28px] font-medium leading-[1.2] text-black">{b.title}</h2>
                <p className="line-clamp-2 text-[16px] leading-[1.5] text-black">{b.blurb}</p>
              </div>
              <Button size="md" variant="dark">Share your build</Button>
            </div>
            <div className="order-first min-w-0 max-w-[300px] flex-1 md:order-none">
              <img src={b.image} alt="" className="aspect-[1200/630] w-full rounded-lg object-cover shadow-[0_4px_4px_rgba(16,24,40,0.1),0_2px_2px_rgba(16,24,40,0.06)]" />
            </div>
          </div>
        ))}
      </div>
      {/* Progress: which build you're on */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-5 md:pb-6" role="tablist" aria-label="Choose a build">
          {MY_BUILDS.map((b, i) => (
            <button
              key={b.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Build ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-gray-dark" : "w-2 bg-gray-dark/25 hover:bg-gray-dark/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseComplete({ levelTitle, children }: { levelTitle: string; children?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-4 pb-16 pt-8 md:px-8 md:pt-4">
      {/* Completion header: styled like a lesson's H1 + paragraph (same type styles, 16px between) */}
      <div className="flex flex-col gap-4">
        <h1 className="font-season text-heading-4xl font-normal text-leland-gray-dark md:text-heading-5xl">Course complete</h1>
        <p className="leland-paragraph-lg text-leland-gray-dark">{levelTitle}</p>
      </div>

      {rule}

      {/* Builds sections are hidden for now; flip SHOW_BUILDS to bring them back */}
      {SHOW_BUILDS && (
        <>
        {/* What they shipped */}
        <MyBuildsCarousel />

        {/* What others shipped */}
        <div className="flex flex-col gap-4 pb-4 pt-4">
          <div className="flex items-center gap-4">
            <h2 className="min-w-0 flex-1 py-2 text-[22px] font-semibold leading-[1.2] text-black">See what others shipped</h2>
            <div className="hidden items-center gap-2 sm:flex">
              <ArrowButton dir="left" disabled />
              <ArrowButton dir="right" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Medium content cards, same as "My content" on My Leland */}
            {OTHERS_SHIPPED.map((c) => (
              <div key={c.title} onClick={() => navigate(PROGRAM_HUB)} className="group relative min-w-0 cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img src={c.image} alt="" className="aspect-[1.91/1] w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="translate-y-2 opacity-0 transition-[transform,opacity] duration-200 ease-out will-change-transform group-hover:translate-y-0 group-hover:opacity-100">
                        <Button size="md" variant="glass" rounded="rounded-full" className="transform-gpu [will-change:backdrop-filter]">
                          View
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 truncate text-[16px] font-semibold leading-snug text-gray-dark">{c.title}</h3>
                <p className="mt-1 truncate text-[14px] leading-tight text-gray-light">{c.author}</p>
              </div>
            ))}
          </div>
          <div>
            <Button size="md" variant="secondary" onClick={() => navigate(PROGRAM_HUB)}>View all builds</Button>
          </div>
        </div>
        </>
      )}

      {/* What's next */}
      <div className="flex flex-col items-stretch gap-6 rounded-2xl border border-gray-stroke bg-white p-6 md:flex-row md:items-center md:gap-8 md:p-8">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-[12px] font-semibold uppercase leading-[1.2] tracking-[1.2px] text-gray-light">Keep going</p>
            <h2 className="font-season text-[28px] font-medium leading-[1.1] text-black">Level 2: Build Autonomous AI Agents</h2>
            <p className="line-clamp-2 text-[16px] leading-[1.5] text-black">Build your automation roadmap · Create cloud-based agentic workflows · Build your second brain · Ship custom automations</p>
          </div>
          <Button size="lg" variant="dark" onClick={() => navigate(PROGRAM_HUB)}>Start course</Button>
        </div>
        <div className="order-first min-w-0 max-w-[300px] flex-1 md:order-none">
          <img src={levelTwoCover} alt="" className="aspect-[120/63] w-full rounded-lg object-cover shadow-[0_4px_4px_rgba(16,24,40,0.1),0_2px_2px_rgba(16,24,40,0.06)]" />
        </div>
      </div>

      {rule}

      {/* Extra blocks (e.g. the "Invite your team" call to action) */}
      {children}
    </div>
  );
}
