import { useState } from "react";
import PageShell from "../components/PageShell";
import { Button, LinkButton } from "../components/Button";
import slackIcon from "../assets/icons/slack-black.svg";
import orderHistoryIcon from "../assets/icons/order-history.svg";
import calendarUpcomingIcon from "../assets/icons/calendar-upcoming.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import videoFilledIcon from "../assets/icons/video-filled.svg";
import linkExternalIcon from "../assets/icons/link-external.svg";

// ─── Types ─────────────────────────────────────────────────────────────────

type BuildSection = {
  id: number;
  title: string;
  duration: string;
  model?: string;
  steps: string[];
  prompts?: string[];
};

type SessionData = {
  programTitle: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  time: string;
  duration: string;
  timeSlots: string[];
  status: "live" | "upcoming" | "ended";
  overview: string;
  whatYoullBuild: string[];
  buildSections: BuildSection[];
  wrapUp: { heading: string; items: string[] };
};

// ─── Mock data ──────────────────────────────────────────────────────────────

const sessionData: SessionData = {
  programTitle: "AI Builder Program Level 1",
  sessionNumber: 1,
  sessionTitle: "Build a Real Product with World-Class Design",
  date: "Mon, May 12",
  time: "11:00 AM ET",
  duration: "90 min",
  timeSlots: ["11:00 AM ET", "4:00 PM ET"],
  status: "live",
  overview:
    "Today you're going from zero to a deployed product — a complete, working prototype built entirely with AI. No prior design or engineering experience required. You'll use AI tools to generate a UI, customize it, and ship a live link that you can actually share.",
  whatYoullBuild: [
    "A product prototype with a polished, responsive design",
    "At least one interactive element or user flow",
    "A live, shareable link deployed to the web",
  ],
  buildSections: [
    {
      id: 1,
      title: "Set up your AI design workspace",
      duration: "15 min",
      model: "Claude or ChatGPT",
      steps: [
        "Create a free account on Lovable, v0, or Bolt — pick whichever you haven't tried before.",
        "Optionally connect a GitHub repo so your project is version-controlled from the start.",
        "Open a fresh project and spend 2 minutes writing your product brief: who it's for, what it does, and what it looks like.",
      ],
      prompts: [
        "Build a [your product] for [your audience]. It should have a clean, modern design using Tailwind CSS. Include a landing page, a main feature screen, and a simple onboarding flow.",
      ],
    },
    {
      id: 2,
      title: "Generate your first UI",
      duration: "25 min",
      model: "Claude Sonnet 4",
      steps: [
        "Paste your product brief into your AI tool and run your first generation. Don't overthink the prompt — just go.",
        "Review the output. Take 60 seconds to note three things you like and three things you'd change.",
        "Use follow-up prompts to iterate toward your vision. Focus on one change at a time.",
        "Share a screenshot in Slack as you go — react to others' progress.",
      ],
      prompts: [
        "Make the hero section more compelling. Keep the layout but rewrite the headline and subtext to feel more direct and benefit-focused.",
        "Add a dark mode toggle to the top nav.",
        "Replace the placeholder pricing section with a simple two-tier plan: free and pro at $12/month.",
      ],
    },
    {
      id: 3,
      title: "Add real content and interactions",
      duration: "25 min",
      model: "Claude Opus 4",
      steps: [
        "Replace all placeholder text with real copy — your actual product name, real feature descriptions, and a genuine call to action.",
        "Add at least one interactive element: a working form, a modal, a tab switcher, or a dropdown.",
        "If time allows, wire up a simple API call or connect to a public dataset to make the data feel real.",
      ],
      prompts: [
        "The contact form should show a success message after submission. No backend needed — just simulate it on the frontend.",
        "Add a testimonials section with 3 made-up but realistic quotes from users in [your target industry].",
      ],
    },
    {
      id: 4,
      title: "Deploy and share your product",
      duration: "15 min",
      steps: [
        "Deploy to Vercel, Netlify, or use your AI tool's built-in publish feature. Most tools do this in one click.",
        "Paste your live link into the Slack channel #session-1-builds.",
        "Leave a short comment on two other people's products — what you liked, what you'd build next.",
      ],
    },
  ],
  wrapUp: {
    heading: "You shipped something today",
    items: [
      "Share your project link in Slack (#session-1-builds) if you haven't already.",
      "Before Session 2, write down one thing you'd improve and one thing that surprised you.",
      "Session 2 is Friday, Apr 24 — we'll automate your communication in your own voice.",
    ],
  },
};

// ─── Icons ──────────────────────────────────────────────────────────────────

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9V5H15" />
      <path d="M13 11L19 5" />
      <path d="M20 13V15C20 16.3 19.5 17.6 18.5 18.5C17.6 19.5 16.3 20 15 20H9C7.7 20 6.4 19.5 5.5 18.5C4.5 17.6 4 16.3 4 15V9C4 7.7 4.5 6.4 5.5 5.5C6.4 4.5 7.7 4 9 4H11" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 20 20" fill="none"
      className={`shrink-0 text-gray-light transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

// ─── Video placeholder ───────────────────────────────────────────────────────

type SessionStatus = SessionData["status"];

function VideoEmbed({ status }: { status: SessionStatus }) {
  return (
    <div className={`relative flex h-[620px] w-full items-center justify-center ${status === "live" ? "bg-[#111111]" : "bg-gray-dark"}`}>
      {/* Simulated meeting room */}
      <div className="flex flex-col items-center gap-4 text-white/60">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <img src={videoFilledIcon} alt="" className="h-8 w-8 brightness-0 invert" />
        </div>
        <p className="text-[16px]">
          {status === "live" ? "Session is live — click Join to enter" : status === "upcoming" ? "Session hasn't started yet" : "Session has ended"}
        </p>
        {status === "ended" && (
          <Button size="lg" variant="primary" rounded="rounded-full">Primary post-session CTA</Button>
        )}
      </div>

      {/* Live badge */}
      {status === "live" && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#D92D20] px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <span className="text-[13px] font-medium text-white">Live</span>
        </div>
      )}

      {/* Upcoming badge */}
      {status === "upcoming" && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
          <span className="text-[13px] font-medium text-white/80">Starts at 11:00 AM ET</span>
        </div>
      )}
    </div>
  );
}

// ─── Session guide section ────────────────────────────────────────────────────

function PromptBlock({ prompts }: { prompts: string[] }) {
  return (
    <div className="mt-3 rounded-[8px] border border-gray-stroke bg-[#F8F8F8] p-4">
      <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.5px] text-gray-xlight">Example prompts</p>
      <div className="flex flex-col gap-3">
        {prompts.map((p, i) => (
          <p key={i} className="font-mono text-[14px] leading-[1.5] text-gray-dark">
            "{p}"
          </p>
        ))}
      </div>
    </div>
  );
}

function BuildSectionBlock({ section, defaultOpen }: { section: BuildSection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-stroke">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-4 py-4 text-left"
      >
        {/* Number circle */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#038561]/10 text-[14px] font-medium text-[#038561]">
          {section.id}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-medium leading-[1.2] text-gray-dark">{section.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[14px] text-gray-xlight sm:block">{section.duration}</span>
          <ChevronDown open={open} />
        </div>
      </button>

      {open && (
        <div className="pb-6 pl-11">
          {/* Duration + model on mobile */}
          <div className="mb-4 flex flex-wrap items-center gap-3 sm:hidden">
            <span className="flex items-center gap-1.5 text-[14px] text-gray-xlight">
              <img src={stopwatchIcon} alt="" className="h-4 w-4 opacity-50" />
              {section.duration}
            </span>
            {section.model && (
              <span className="text-[14px] text-gray-xlight">Recommended: {section.model}</span>
            )}
          </div>
          {/* Model recommendation (desktop only) */}
          {section.model && (
            <p className="mb-4 hidden text-[15px] text-gray-xlight sm:block">
              Recommended model: <span className="font-medium text-gray-dark">{section.model}</span>
            </p>
          )}

          <ol className="flex flex-col gap-3">
            {section.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[12px] font-medium text-gray-light">
                  {i + 1}
                </span>
                <p className="flex-1 leading-[1.5] text-gray-dark">{step}</p>
              </li>
            ))}
          </ol>

          {section.prompts && <PromptBlock prompts={section.prompts} />}
        </div>
      )}
    </div>
  );
}

// ─── Rate session card ───────────────────────────────────────────────────────

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3.1 1.1-6.5L2.5 9l6.6-.9L12 2z"
        fill={filled ? "#F4A400" : "#E0E0E0"}
        stroke={filled ? "#F4A400" : "#E0E0E0"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RateSessionCard() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const displayRating = hovered || rating;

  if (submitted) {
    return (
      <div className="rounded-[12px] border border-gray-stroke bg-white p-4">
        <p className="mb-1 text-[15px] font-medium text-gray-dark">Thanks for your feedback!</p>
        <p className="text-[14px] leading-[1.5] text-gray-light">Your review helps us improve future sessions.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[12px] border border-gray-stroke bg-white p-4">
      <p className="mb-3 text-[16px] font-medium text-gray-dark">Rate this session</p>

      {/* Stars */}
      <div
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <StarIcon filled={n <= displayRating} />
          </button>
        ))}
      </div>

      {/* Comment box — appears after rating is set */}
      {rating > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share what you thought of the session (optional)"
            rows={3}
            className="w-full resize-none rounded-[8px] border border-gray-stroke bg-white px-3 py-2.5 text-[15px] leading-[1.5] text-gray-dark placeholder:text-gray-xlight focus:border-gray-400 focus:outline-none"
          />
          <Button size="md" variant="primary" className="w-full" onClick={() => setSubmitted(true)}>
            Submit review
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

function SessionSidebar({ session, status: _status }: { session: SessionData; status: SessionStatus }) {
  return (
    <div className="flex flex-col gap-5">
      <RateSessionCard />

      {/* Resources */}
      <div>
        <p className="mb-1 text-[13px] font-medium uppercase tracking-[0.5px] text-gray-xlight">Resources</p>
        <div className="flex flex-col">
          {[
            { icon: orderHistoryIcon, label: "Office hours", href: "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours" },
            { icon: slackIcon, label: "Slack community", href: "#" },
            { icon: calendarUpcomingIcon, label: "Join a build session", href: "#" },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-[10px] text-[16px] font-medium leading-[1.2] text-gray-dark no-underline transition-[padding] duration-300 ease-out hover:pl-[4px]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-gray-hover">
                <img src={icon} alt="" className="h-4 w-4" />
              </span>
              <span className="flex-1">{label}</span>
              <ExternalIcon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveSession() {
  const [activeTab, setActiveTab] = useState<"guide" | "details">("guide");
  const [status, setStatus] = useState<SessionStatus>("live");
  const [fullWidth, setFullWidth] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [hideGuide, setHideGuide] = useState(false);
  const session = sessionData;

  const sidebar = <SessionSidebar session={session} status={status} />;

  const statusOptions: { value: SessionStatus; label: string }[] = [
    { value: "live", label: "Live" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ended", label: "Ended" },
  ];

  return (
    <>
      {/* Video section */}
      {fullWidth ? (
        <div className="w-full bg-[#111111]">
          <VideoEmbed status={status} />
        </div>
      ) : (
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="overflow-hidden rounded-[12px]">
            <VideoEmbed status={status} />
          </div>
        </div>
      )}

      <PageShell rightSidebar={sidebar} rightSidebarWidth={280}>
        <div className="pb-20">

          {/* Session header */}
          <div className="pb-5 sm:pb-6">
            <p className="mb-1 text-[14px] font-medium text-gray-xlight">
              {session.programTitle} · Session {session.sessionNumber}
            </p>
            <h1 className="text-[24px] font-medium leading-[1.15] text-gray-dark sm:text-[28px]">
              {session.sessionTitle}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-[15px] text-gray-light">
              <span>{session.date} · {session.time}</span>
              <span>·</span>
              <span>{session.duration}</span>
            </div>
          </div>

          {/* Mobile pivot */}
          <div className="sticky top-0 z-10 -mx-4 flex gap-5 border-b border-gray-stroke bg-white px-4 min-[960px]:hidden">
            {([{ value: "guide", label: "Overview" }, { value: "details", label: "Resources" }] as const).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`relative shrink-0 cursor-pointer whitespace-nowrap py-3 transition-colors ${
                  activeTab === value ? "text-gray-dark" : "text-gray-light hover:text-gray-dark"
                }`}
              >
                <span className="text-[18px] font-medium">{label}</span>
                {activeTab === value && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#038561]" />
                )}
              </button>
            ))}
          </div>

          {/* Guide content — desktop always, mobile only on guide tab */}
          <div className={activeTab !== "guide" ? "hidden min-[960px]:block" : ""}>

            {/* Overview */}
            <div className="border-t border-gray-stroke pt-5">
              <p className="leading-[1.6] text-gray-dark">{session.overview}</p>
            </div>

            {!hideGuide && (
              <>
                {/* Build sections */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-[18px] font-medium text-gray-dark">Session guide</p>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[14px] text-gray-light no-underline hover:text-gray-dark">
                      <span>Open in new tab</span>
                      <img src={linkExternalIcon} alt="" className="h-3.5 w-3.5 opacity-50" />
                    </a>
                  </div>
                  {session.buildSections.map((section, i) => (
                    <BuildSectionBlock
                      key={section.id}
                      section={section}
                      defaultOpen={i === 0}
                    />
                  ))}
                </div>

                {/* Wrap-up */}
                <div className="mt-6 rounded-[12px] border border-gray-stroke bg-[#F8F8F8] p-5">
                  <p className="mb-3 text-[17px] font-medium text-gray-dark">{session.wrapUp.heading}</p>
                  <ul className="flex flex-col gap-2.5">
                    {session.wrapUp.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-light" />
                        <span className="leading-[1.5] text-gray-dark">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Details (sidebar) — mobile only on details tab */}
          <div className={`pt-5 min-[960px]:hidden ${activeTab !== "details" ? "hidden" : ""}`}>
            <SessionSidebar session={session} status={status} />
          </div>

        </div>
      </PageShell>

      {/* Floating options menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {optionsOpen && (
          <div className="mb-2 w-[220px] rounded-xl border border-gray-stroke bg-white px-4 py-3 shadow-lg">
            {/* Full width toggle */}
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">Full width embed</p>
              <button
                onClick={() => setFullWidth(!fullWidth)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${fullWidth ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${fullWidth ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* No session guide toggle */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[16px] font-medium leading-[1.2] text-gray-dark">No session guide</p>
              <button
                onClick={() => setHideGuide(!hideGuide)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${hideGuide ? "bg-[#038561]" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${hideGuide ? "translate-x-[18px]" : "translate-x-0.5"}`} />
              </button>
            </div>

            <p className="mb-2.5 mt-4 text-[14px] font-medium uppercase tracking-[0.5px] text-gray-light">Session status</p>
            <div className="flex flex-col gap-2">
              {statusOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatus(value)}
                  className="flex cursor-pointer items-center gap-2.5 text-[16px] leading-[1.2]"
                >
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${status === value ? "border-[#038561] bg-[#038561]" : "border-gray-300"}`}>
                    {status === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={status === value ? "font-medium text-gray-dark" : "text-gray-light"}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setOptionsOpen(!optionsOpen)}
          className={`ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-gray-stroke bg-white shadow-lg transition-colors hover:bg-gray-hover ${optionsOpen ? "bg-gray-hover" : ""}`}
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="8" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
            <circle cx="14" cy="2" r="1.5" fill="currentColor" className="text-gray-dark" />
          </svg>
        </button>
      </div>
    </>
  );
}
