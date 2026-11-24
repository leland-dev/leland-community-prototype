import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/Button";
import { RoundArrow, useCardCarousel, sectionTitle } from "./ProgramHub";
import hourglassIcon from "../assets/icons/time-clock-hourglass.svg";
import bookOpenIcon from "../assets/icons/book-open.svg";
import myCoursesIcon from "../assets/icons/my-courses.svg";
import videoIcon from "../assets/icons/video-icon.svg";
import checkmarkFilledIcon from "../assets/icons/checkmark-filled.svg";

// Guided offering creation — an alternate to CoachProductTypeSelect + CoachProductNew.
//
// Instead of asking the coach to pick a product *type* (where "Bundle" and
// "Subscription" sit awkwardly next to the things they're made of), this flow
// asks what they want to *include*, then walks through one question per screen
// for just those pieces. Bundle vs. single product and one-time vs. subscription
// fall out of the answers rather than being chosen up front.

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HOURLY_RATE = 150;
const SESSION_VALUE = 50;

const CATEGORY_NAMES: Record<string, string> = {
  "product-management": "Product Management",
  "management-consulting": "Management Consulting",
  mba: "MBA",
  college: "College",
};

type ComponentId = "coaching" | "content" | "live" | "course";
type StepId =
  | "select"
  | "coaching-format"
  | "coaching-hours"
  | "content-pick"
  | "live-format"
  | "live-sessions"
  | "course-pick"
  | "billing"
  | "price"
  | "name"
  | "review";

const COMPONENTS: { id: ComponentId; name: string; blurb: string; icon: string; ready: boolean }[] = [
  { id: "coaching", name: "1:1 coaching", blurb: "Live time with you, sold by the hour.", icon: hourglassIcon, ready: true },
  { id: "content", name: "Content", blurb: "Guides, templates, and recordings clients use on their own.", icon: bookOpenIcon, ready: true },
  { id: "live", name: "Live sessions", blurb: "A workshop, or a series of sessions you teach to a group.", icon: videoIcon, ready: true },
  { id: "course", name: "Course", blurb: "A structured, multi-lesson course.", icon: myCoursesIcon, ready: true },
];

type ContentItem = { id: number; title: string; kind: string; price: number };
const LIBRARY: ContentItem[] = [
  { id: 1, title: "Essay Brainstorming Guide", kind: "Guide", price: 49 },
  { id: 2, title: "Resume Template", kind: "Template", price: 29 },
  { id: 3, title: "Interview Question Bank", kind: "Guide", price: 39 },
  { id: 4, title: "School Selection Spreadsheet", kind: "Template", price: 19 },
  { id: 5, title: "Mock Interview Walkthrough", kind: "Video", price: 59 },
];

type Course = { id: number; title: string; lessons: number; price: number };
const COURSES: Course[] = [
  { id: 1, title: "The Complete Application Playbook", lessons: 12, price: 299 },
  { id: 2, title: "Interview Mastery", lessons: 8, price: 199 },
];
const NEW_COURSE = 0;

type Session = { id: number; title: string; date: string; time: string; duration: string };
const newSession = (id: number, title = ""): Session => ({ id, title, date: "", time: "", duration: "60" });

type Template = {
  id: string;
  name: string;
  summary: string;
  components: ComponentId[];
  coachingMode?: "set" | "range";
  hours?: number;
  contentIds?: number[];
  sessions?: string[];
  courseId?: number;
  billing: "one-time" | "recurring";
  price: string;
  headline: string;
};

const TEMPLATES: Template[] = [
  {
    id: "bootcamp",
    name: "Application Bootcamp",
    summary: "10 hrs coaching · 3 resources · 4 live sessions",
    components: ["coaching", "content", "live"],
    coachingMode: "set",
    hours: 10,
    contentIds: [1, 2, 3],
    sessions: ["Kickoff & strategy", "Essay workshop", "Interview prep", "Final review"],
    billing: "one-time",
    price: "1500",
    headline: "Everything you need to go from first draft to submitted.",
  },
  {
    id: "membership",
    name: "Monthly Membership",
    summary: "Group office hours · resource library · billed monthly",
    components: ["content", "live"],
    contentIds: [1, 3, 4, 5],
    sessions: ["Monthly office hours", "Monthly AMA"],
    billing: "recurring",
    price: "79",
    headline: "Ongoing access to my resources and live group sessions.",
  },
  {
    id: "review-sprint",
    name: "Essay Review Sprint",
    summary: "3 hrs coaching · essay guide",
    components: ["coaching", "content"],
    coachingMode: "set",
    hours: 3,
    contentIds: [1],
    billing: "one-time",
    price: "425",
    headline: "Fast, focused feedback on your essays.",
  },
  {
    id: "course-coaching",
    name: "Course + Coaching",
    summary: "Self-paced course · 2 hrs coaching",
    components: ["coaching", "course"],
    coachingMode: "set",
    hours: 2,
    courseId: 1,
    billing: "one-time",
    price: "549",
    headline: "Learn at your own pace, with 1:1 help when you need it.",
  },
  {
    id: "workshop",
    name: "One-off Workshop",
    summary: "A single paid live session",
    components: ["live"],
    sessions: ["Workshop"],
    billing: "one-time",
    price: "50",
    headline: "A live, interactive group workshop.",
  },
];

const money = (n: number) => `$${n.toLocaleString()}`;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function MaskIcon({ src, className = "" }: { src: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
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

// Checkbox (multi) or radio (single) indicator for a choice card.
function Mark({ active, multi }: { active: boolean; multi: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center transition-colors ${multi ? "rounded-md" : "rounded-full"} ${active ? "border-[1.5px] border-gray-dark bg-gray-dark" : "border-[1.5px] border-gray-stroke bg-white"}`}
    >
      {active &&
        (multi ? (
          <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        ))}
    </span>
  );
}

// A selectable card — the whole card is the control, so this is a card, not a button.
function ChoiceCard({ active, multi = false, disabled = false, icon, title, desc, tag, onClick }: { active: boolean; multi?: boolean; disabled?: boolean; icon?: string; title: string; desc?: string; tag?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-2xl border-[1.5px] p-4 text-left transition-colors ${disabled ? "cursor-default border-transparent bg-gray-hover" : active ? "border-gray-dark bg-white" : "border-gray-stroke bg-white hover:border-[#c9c9c9]"}`}
    >
      {icon && (
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${disabled ? "bg-white text-gray-extra-light" : "bg-gray-hover text-gray-dark"}`}>
          <MaskIcon src={icon} className="h-[22px] w-[22px]" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block text-[16px] font-semibold ${disabled ? "text-gray-extra-light" : "text-gray-dark"}`}>{title}</span>
        {desc && <span className={`mt-0.5 block text-[14px] leading-snug ${disabled ? "text-gray-extra-light" : "text-gray-light"}`}>{desc}</span>}
      </span>
      {tag ? (
        <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-[0.05em] text-gray-light">{tag}</span>
      ) : (
        <Mark active={active} multi={multi} />
      )}
    </button>
  );
}

function Stepper({ value, onChange, min = 1, max = 100, unit }: { value: number; onChange: (n: number) => void; min?: number; max?: number; unit: string }) {
  return (
    <div className="flex items-center gap-4">
      <Button size="md" variant="secondary" iconOnly aria-label="Decrease" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
      </Button>
      <div className="min-w-[96px] text-center">
        <span className="text-[40px] font-semibold leading-none text-gray-dark tabular-nums">{value}</span>
        <span className="ml-1.5 text-[15px] text-gray-light">{unit}</span>
      </div>
      <Button size="md" variant="secondary" iconOnly aria-label="Increase" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
      </Button>
    </div>
  );
}

// Template carousel — mirrors RecommendedBuilds ("Your next build") on the
// program hub: bordered card, serif title, a paged row of thumbnail cards with
// floating arrows. Cards use the hub's gradient "skill" thumbnail, badged with
// the icon of each component the template includes.
const TEMPLATE_GRADIENTS = [
  "bg-gradient-to-tr from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-r from-leland-yellow/35 via-leland-tan-light to-leland-slate/20",
  "bg-gradient-to-tr from-leland-slate/20 via-leland-tan-light to-leland-yellow/35",
];

function TemplateCarousel({ onPick }: { onPick: (t: Template) => void }) {
  const carousel = useCardCarousel(TEMPLATES);
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-stroke bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className={sectionTitle}>Start from a template</p>
        <p className="text-[16px] leading-[1.5] text-gray-light">Pre-filled and fully editable</p>
      </div>
      <div className="relative">
        <div ref={carousel.scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className="w-[240px] shrink-0 sm:w-[calc((100%-20px)/2)]">
              <button type="button" onClick={() => onPick(t)} className="group block w-full min-w-[200px] cursor-pointer overflow-hidden text-left">
                <div className="aspect-[120/63] w-full overflow-hidden rounded-lg border border-gray-stroke bg-gray-hover">
                  <div className={`flex h-full w-full items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-[1.02] ${TEMPLATE_GRADIENTS[i % TEMPLATE_GRADIENTS.length]}`}>
                    {COMPONENTS.filter((c) => t.components.includes(c.id)).map((c) => (
                      <span key={c.id} className="flex size-8 items-center justify-center rounded-full bg-white text-gray-dark shadow-md">
                        <MaskIcon src={c.icon} className="size-[18px]" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pt-2">
                  <p className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-gray-dark">{t.name}</p>
                  <span className="truncate text-[12px] text-gray-light">{t.summary}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
        {carousel.page > 0 ? (
          <div className="absolute left-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="left" floating onClick={() => carousel.scrollByPage(-1)} />
          </div>
        ) : null}
        {carousel.page < carousel.pages - 1 ? (
          <div className="absolute right-[-22px] top-1/2 hidden -translate-y-1/2 sm:block">
            <RoundArrow dir="right" floating onClick={() => carousel.scrollByPage(1)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const INPUT = "w-full rounded-lg border border-gray-stroke bg-white px-4 py-3 text-[15px] text-gray-dark outline-none transition-colors placeholder:text-[#B1B1B1] focus:border-gray-dark";

function Question({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.06em] text-gray-extra-light">{eyebrow}</p>}
      <h1 className="text-[26px] font-semibold leading-tight text-gray-dark">{title}</h1>
      {sub && <p className="mt-2 text-[15px] leading-relaxed text-gray-light">{sub}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

export default function CoachOfferingGuided() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const categoryName = CATEGORY_NAMES[category ?? ""] ?? "your category";

  const [step, setStep] = useState<StepId>("select");
  const [dir, setDir] = useState(1);
  const [returnToReview, setReturnToReview] = useState(false);
  const [done, setDone] = useState(false);

  const [selected, setSelected] = useState<ComponentId[]>([]);
  const [coachingMode, setCoachingMode] = useState<"set" | "range">("set");
  const [hours, setHours] = useState(5);
  const [minHours, setMinHours] = useState(1);
  const [maxHours, setMaxHours] = useState(10);
  const [library, setLibrary] = useState<ContentItem[]>(LIBRARY);
  const [contentIds, setContentIds] = useState<number[]>([]);
  const [newContent, setNewContent] = useState("");
  const [liveMode, setLiveMode] = useState<"single" | "series">("single");
  const [sessions, setSessions] = useState<Session[]>([newSession(1, "Workshop")]);
  const [courseId, setCourseId] = useState<number>(COURSES[0].id);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [billingChoice, setBillingChoice] = useState<"one-time" | "recurring">("one-time");
  const [price, setPrice] = useState("");
  const [annual, setAnnual] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    document.title = "Leland Prototype | New offering (guided)";
  }, []);

  const has = (id: ComponentId) => selected.includes(id);
  const isRange = has("coaching") && coachingMode === "range";
  // Range-of-hours coaching is pay-per-hour, so it can't be a subscription.
  const billing = isRange ? "one-time" : billingChoice;
  const recurring = billing === "recurring";
  const pickedContent = library.filter((c) => contentIds.includes(c.id));
  const course = COURSES.find((c) => c.id === courseId);
  const courseTitle = course ? course.title : newCourseTitle.trim() || "New course";
  const activeSessions = liveMode === "single" ? sessions.slice(0, 1) : sessions;

  // Only the questions that apply to what was picked.
  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ["select"];
    if (selected.includes("coaching")) s.push("coaching-format", "coaching-hours");
    if (selected.includes("content")) s.push("content-pick");
    if (selected.includes("live")) s.push("live-format", "live-sessions");
    if (selected.includes("course")) s.push("course-pick");
    if (!isRange) s.push("billing");
    if (!(isRange && selected.length === 1)) s.push("price");
    s.push("name", "review");
    return s;
  }, [selected, isRange]);

  // What the answers add up to — the label the old flow made coaches choose first.
  const offeringType = recurring
    ? "Subscription"
    : selected.length > 1
      ? "Bundle"
      : has("coaching")
        ? "Hourly coaching"
        : has("content")
          ? pickedContent.length > 1 ? "Collection" : "Content"
          : has("live")
            ? liveMode === "series" ? "Program" : "Workshop"
            : has("course")
              ? "Course"
              : "Offering";

  // Value of everything with a fixed price (range coaching is billed per hour on top).
  const fixedValue =
    (has("coaching") && !isRange ? hours * HOURLY_RATE : 0) +
    (has("content") ? pickedContent.reduce((sum, c) => sum + c.price, 0) : 0) +
    (has("live") ? activeSessions.length * SESSION_VALUE : 0) +
    (has("course") ? course?.price ?? 0 : 0);
  const effectivePrice = price !== "" ? Number(price) : fixedValue;
  const savings = !recurring && fixedValue > 0 && effectivePrice < fixedValue ? Math.round((1 - effectivePrice / fixedValue) * 100) : 0;

  const suggestedName = `${categoryName} ${offeringType === "Offering" ? "Offering" : offeringType}`;

  const priceLabel = (() => {
    const hourly = `${money(HOURLY_RATE)}/hr`;
    if (isRange && selected.length === 1) return hourly;
    const base = `${money(effectivePrice)}${recurring ? "/mo" : ""}`;
    return isRange ? `${base} + ${hourly}` : base;
  })();

  const canContinue = (() => {
    switch (step) {
      case "select": return selected.length > 0;
      case "coaching-hours": return coachingMode === "set" ? hours >= 1 : minHours < maxHours;
      case "content-pick": return contentIds.length > 0;
      case "live-sessions": return activeSessions.every((s) => s.title.trim() !== "");
      case "course-pick": return courseId !== NEW_COURSE || newCourseTitle.trim() !== "";
      case "price": return effectivePrice > 0;
      case "name": return name.trim() !== "";
      default: return true;
    }
  })();

  const go = (to: StepId, direction: number) => {
    if (to === "name" && name.trim() === "") setName(suggestedName);
    setDir(direction);
    setStep(to);
  };
  const next = () => {
    if (!canContinue) return;
    if (step === "review") { setDone(true); return; }
    if (returnToReview && step !== "select") { setReturnToReview(false); go("review", 1); return; }
    setReturnToReview(false);
    const i = steps.indexOf(step);
    go(steps[Math.min(i + 1, steps.length - 1)], 1);
  };
  const back = () => {
    setReturnToReview(false);
    const i = steps.indexOf(step);
    if (i > 0) go(steps[i - 1], -1);
  };
  const edit = (to: StepId) => { setReturnToReview(to !== "select"); go(to, -1); };
  const close = () => navigate(`/my-leland/manage/${category}`);

  // Enter advances, Typeform-style (unless focus is on a control that uses Enter itself).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || done) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "BUTTON" || tag === "TEXTAREA" || tag === "SELECT" || tag === "A") return;
      e.preventDefault();
      next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toggleComponent = (id: ComponentId) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : COMPONENTS.filter((c) => c.id === id || s.includes(c.id)).map((c) => c.id)));
  const toggleContent = (id: number) => setContentIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const addContent = () => {
    const title = newContent.trim();
    if (!title) return;
    const id = Math.max(0, ...library.map((c) => c.id)) + 1;
    setLibrary((l) => [...l, { id, title, kind: "New", price: 0 }]);
    setContentIds((ids) => [...ids, id]);
    setNewContent("");
  };
  const updateSession = (id: number, patch: Partial<Session>) => setSessions((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const chooseLiveMode = (mode: "single" | "series") => {
    setLiveMode(mode);
    if (mode === "series" && sessions.length < 2) setSessions((ss) => [...ss, newSession(Math.max(...ss.map((s) => s.id)) + 1)]);
  };

  const applyTemplate = (t: Template) => {
    setSelected(t.components);
    setCoachingMode(t.coachingMode ?? "set");
    if (t.hours) setHours(t.hours);
    setContentIds(t.contentIds ?? []);
    if (t.sessions) {
      setLiveMode(t.sessions.length > 1 ? "series" : "single");
      setSessions(t.sessions.map((title, i) => newSession(i + 1, title)));
    }
    setCourseId(t.courseId ?? COURSES[0].id);
    setBillingChoice(t.billing);
    setPrice(t.price);
    setAnnual(false);
    setName(t.name);
    setHeadline(t.headline);
    setReturnToReview(false);
    setDir(1);
    setStep("review");
  };

  const reset = () => {
    setSelected([]); setCoachingMode("set"); setHours(5); setMinHours(1); setMaxHours(10);
    setContentIds([]); setLiveMode("single"); setSessions([newSession(1, "Workshop")]);
    setCourseId(COURSES[0].id); setNewCourseTitle("");
    setBillingChoice("one-time"); setPrice(""); setAnnual(false); setName(""); setHeadline("");
    setDone(false); setReturnToReview(false); setDir(1); setStep("select");
  };

  const coachingSummary = isRange ? `${minHours}–${maxHours} hrs, client chooses` : `${plural(hours, "hr")}${recurring ? " per month" : ""}`;
  const contentSummary = pickedContent.length ? pickedContent.map((c) => c.title).join(", ") : "Not chosen yet";
  const liveSummary = liveMode === "series" ? `${plural(activeSessions.length, "session")} series` : "Single session";

  const courseSummary = course ? `${course.title} · ${plural(course.lessons, "lesson")}` : `${courseTitle} · new`;
  const componentSummary = (id: ComponentId) =>
    id === "coaching" ? coachingSummary : id === "content" ? (pickedContent.length ? plural(pickedContent.length, "resource") : "Not chosen yet") : id === "live" ? liveSummary : courseSummary;

  const stepIndex = steps.indexOf(step);
  const progress = done ? 1 : stepIndex / (steps.length - 1);

  const renderStep = () => {
    switch (step) {
      case "select":
        return (
          <Question title="What do you want to include in this offering?" sub={`Select everything that applies — we'll walk you through each piece and assemble it for ${categoryName}.`}>
            <div className="grid gap-3">
              {COMPONENTS.map((c) => (
                <ChoiceCard key={c.id} multi icon={c.icon} title={c.name} desc={c.blurb} active={has(c.id)} disabled={!c.ready} tag={c.ready ? undefined : "Coming soon"} onClick={() => toggleComponent(c.id)} />
              ))}
            </div>
            <div className="mt-9">
              <TemplateCarousel onPick={applyTemplate} />
            </div>
          </Question>
        );

      case "coaching-format":
        return (
          <Question eyebrow="1:1 coaching" title="How do you want to sell your time?">
            <div className="grid gap-3" role="radiogroup">
              <ChoiceCard title="A set number of hours" desc="Everyone who buys gets the same amount of time with you." active={coachingMode === "set"} onClick={() => setCoachingMode("set")} />
              <ChoiceCard title="A range of hours" desc={`Clients choose how many hours they want and pay your ${money(HOURLY_RATE)}/hr rate.`} active={coachingMode === "range"} onClick={() => setCoachingMode("range")} />
            </div>
          </Question>
        );

      case "coaching-hours":
        return coachingMode === "set" ? (
          <Question eyebrow="1:1 coaching" title="How many hours are included?" sub={`At your ${money(HOURLY_RATE)}/hr rate, that's ${money(hours * HOURLY_RATE)} of coaching.`}>
            <Stepper value={hours} onChange={setHours} unit={hours === 1 ? "hour" : "hours"} />
          </Question>
        ) : (
          <Question eyebrow="1:1 coaching" title="What range of hours can clients choose from?" sub={`They'll pay ${money(HOURLY_RATE)}/hr — between ${money(minHours * HOURLY_RATE)} and ${money(maxHours * HOURLY_RATE)}.`}>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              <div>
                <p className="mb-3 text-[14px] font-semibold text-gray-dark">Minimum</p>
                <Stepper value={minHours} onChange={setMinHours} max={maxHours - 1} unit="hrs" />
              </div>
              <div>
                <p className="mb-3 text-[14px] font-semibold text-gray-dark">Maximum</p>
                <Stepper value={maxHours} onChange={setMaxHours} min={minHours + 1} unit="hrs" />
              </div>
            </div>
          </Question>
        );

      case "content-pick":
        return (
          <Question eyebrow="Content" title="Which content should be included?" sub="Pick from your library or add something new. More than one becomes a collection.">
            <div className="grid gap-2.5">
              {library.map((c) => (
                <ChoiceCard key={c.id} multi title={c.title} desc={c.price ? `${c.kind} · ${money(c.price)}` : "New — upload after you finish"} active={contentIds.includes(c.id)} onClick={() => toggleContent(c.id)} />
              ))}
            </div>
            <div className="mt-4 flex gap-2.5">
              <input
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); addContent(); } }}
                placeholder="Add new content by title…"
                className={INPUT}
              />
              <Button size="md" variant="secondary" className="shrink-0" disabled={!newContent.trim()} onClick={addContent}>Add</Button>
            </div>
          </Question>
        );

      case "live-format":
        return (
          <Question eyebrow="Live sessions" title="Is this one session or a series?">
            <div className="grid gap-3" role="radiogroup">
              <ChoiceCard title="A single session" desc="A one-off workshop or class." active={liveMode === "single"} onClick={() => chooseLiveMode("single")} />
              <ChoiceCard title="A series of sessions" desc="A multi-session program people go through together." active={liveMode === "series"} onClick={() => chooseLiveMode("series")} />
            </div>
          </Question>
        );

      case "live-sessions":
        return (
          <Question eyebrow="Live sessions" title={liveMode === "series" ? "What sessions are in the series?" : "Tell us about the session"} sub="Dates are optional — you can schedule later.">
            <div className="grid gap-3">
              {activeSessions.map((s, i) => (
                <div key={s.id} className="rounded-2xl border border-gray-stroke p-4">
                  <div className="flex items-center gap-2.5">
                    {liveMode === "series" && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-hover text-[13px] font-semibold text-gray-dark">{i + 1}</span>}
                    <input value={s.title} onChange={(e) => updateSession(s.id, { title: e.target.value })} placeholder="Session title" aria-label={`Session ${i + 1} title`} className={INPUT} />
                    {liveMode === "series" && activeSessions.length > 2 && (
                      <Button size="sm" variant="ghost" iconOnly aria-label={`Remove session ${i + 1}`} onClick={() => setSessions((ss) => ss.filter((x) => x.id !== s.id))}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                      </Button>
                    )}
                  </div>
                  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <input type="date" value={s.date} onChange={(e) => updateSession(s.id, { date: e.target.value })} aria-label={`Session ${i + 1} date`} className={INPUT} />
                    <input type="time" value={s.time} onChange={(e) => updateSession(s.id, { time: e.target.value })} aria-label={`Session ${i + 1} time`} className={INPUT} />
                    <select value={s.duration} onChange={(e) => updateSession(s.id, { duration: e.target.value })} aria-label={`Session ${i + 1} duration`} className={INPUT}>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            {liveMode === "series" && (
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => setSessions((ss) => [...ss, newSession(Math.max(...ss.map((x) => x.id)) + 1)])}>
                + Add session
              </Button>
            )}
          </Question>
        );

      case "course-pick":
        return (
          <Question eyebrow="Course" title="Which course should be included?" sub="Pick one you've already built, or start a new one.">
            <div className="grid gap-3" role="radiogroup">
              {COURSES.map((c) => (
                <ChoiceCard key={c.id} title={c.title} desc={`${plural(c.lessons, "lesson")} · ${money(c.price)}`} active={courseId === c.id} onClick={() => setCourseId(c.id)} />
              ))}
              <ChoiceCard title="A new course" desc="Name it now and build the lessons after you finish." active={courseId === NEW_COURSE} onClick={() => setCourseId(NEW_COURSE)} />
            </div>
            {courseId === NEW_COURSE && (
              <input autoFocus value={newCourseTitle} maxLength={80} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Course title" aria-label="Course title" className={`mt-3 ${INPUT}`} />
            )}
          </Question>
        );

      case "billing":
        return (
          <Question title="How should clients pay?">
            <div className="grid gap-3" role="radiogroup">
              <ChoiceCard title="One-time payment" desc="Clients pay once and get everything in the offering." active={billingChoice === "one-time"} onClick={() => setBillingChoice("one-time")} />
              <ChoiceCard title="Recurring subscription" desc={has("coaching") ? `Clients pay monthly — ${plural(hours, "hour")} of coaching renews each month.` : "Clients pay monthly for ongoing access."} active={billingChoice === "recurring"} onClick={() => setBillingChoice("recurring")} />
            </div>
          </Question>
        );

      case "price":
        return (
          <Question
            title={recurring ? "What's the monthly price?" : isRange ? "What's the price for everything besides coaching?" : "What's the price?"}
            sub={isRange ? `Coaching is billed on top at ${money(HOURLY_RATE)}/hr for the hours each client chooses.` : undefined}
          >
            <div className="flex items-center rounded-lg border border-gray-stroke bg-white px-4 transition-colors focus-within:border-gray-dark">
              <span className="text-[20px] text-gray-light">$</span>
              <input
                autoFocus
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder={String(fixedValue)}
                aria-label="Price"
                className="w-full bg-transparent py-3.5 pl-2 text-[20px] font-semibold text-gray-dark outline-none placeholder:font-normal placeholder:text-[#B1B1B1]"
              />
              {recurring && <span className="shrink-0 text-[15px] text-gray-light">/ month</span>}
            </div>
            <div className="mt-3 rounded-xl bg-gray-hover p-4 text-[14px] text-gray-light">
              <p>
                <span className="font-semibold text-gray-dark">{money(fixedValue)}</span> is what these would cost separately{recurring ? " each month" : ""}
                {price === "" ? " — we'll use that unless you enter your own." : savings > 0 ? ` — clients save ${savings}%.` : "."}
              </p>
              <ul className="mt-2 grid gap-1">
                {has("coaching") && !isRange && <li>{plural(hours, "hr")} of coaching × {money(HOURLY_RATE)}/hr = {money(hours * HOURLY_RATE)}</li>}
                {has("content") && <li>{plural(pickedContent.length, "resource")} = {money(pickedContent.reduce((sum, c) => sum + c.price, 0))}</li>}
                {has("live") && <li>{plural(activeSessions.length, "live session")} × {money(SESSION_VALUE)} = {money(activeSessions.length * SESSION_VALUE)}</li>}
                {has("course") && <li>{course ? `${course.title} = ${money(course.price)}` : `${courseTitle} — new, not priced yet`}</li>}
              </ul>
            </div>
            {recurring && (
              <div className="mt-3">
                <ChoiceCard multi title="Also offer annual billing" desc={`Members can pay ${money(Math.round(effectivePrice * 12 * 0.8))}/yr — 20% off.`} active={annual} onClick={() => setAnnual((a) => !a)} />
              </div>
            )}
          </Question>
        );

      case "name":
        return (
          <Question title="What should we call it?" sub="This is what clients see on your profile.">
            <label className="mb-2 block text-[14px] font-semibold text-gray-dark" htmlFor="guided-name">Name</label>
            <input id="guided-name" autoFocus value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder={suggestedName} className={INPUT} />
            <label className="mb-2 mt-5 block text-[14px] font-semibold text-gray-dark" htmlFor="guided-headline">Headline <span className="font-normal text-gray-extra-light">(optional)</span></label>
            <input id="guided-headline" value={headline} maxLength={120} onChange={(e) => setHeadline(e.target.value)} placeholder="One line on who it's for and what they get" className={INPUT} />
          </Question>
        );

      case "review":
        return (
          <Question title="Here's your offering" sub="Check it over — you can change anything before creating it.">
            <div className="rounded-2xl border border-gray-stroke">
              <ReviewRow label="Name" value={name || suggestedName} sub={headline || undefined} onEdit={() => edit("name")} />
              <ReviewRow label="Includes" value={COMPONENTS.filter((c) => has(c.id)).map((c) => c.name).join(", ")} onEdit={() => edit("select")} />
              {has("coaching") && <ReviewRow label="1:1 coaching" value={coachingSummary} onEdit={() => edit("coaching-format")} />}
              {has("content") && <ReviewRow label="Content" value={contentSummary} onEdit={() => edit("content-pick")} />}
              {has("live") && <ReviewRow label="Live sessions" value={liveSummary} sub={activeSessions.map((s) => s.title).filter(Boolean).join(", ") || undefined} onEdit={() => edit("live-sessions")} />}
              {has("course") && <ReviewRow label="Course" value={courseSummary} onEdit={() => edit("course-pick")} />}
              {!isRange && <ReviewRow label="Billing" value={recurring ? `Monthly subscription${annual ? ", with annual option" : ""}` : "One-time payment"} onEdit={() => edit("billing")} />}
              <ReviewRow label="Price" value={priceLabel} sub={savings > 0 ? `${savings}% off the ${money(fixedValue)} value` : undefined} onEdit={steps.includes("price") ? () => edit("price") : undefined} last />
            </div>
          </Question>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-20 border-b border-gray-stroke bg-white">
        <div className="flex items-center gap-4 px-4 py-3 sm:px-6">
          <Button size="sm" variant="secondary" iconOnly onClick={close} aria-label="Close">
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </Button>
          <span className="text-[15px] font-semibold text-gray-dark">New offering</span>
          {!done && <span className="ml-auto text-[13px] text-gray-extra-light tabular-nums">Step {stepIndex + 1} of {steps.length}</span>}
        </div>
        <div className="h-[3px] bg-gray-hover">
          <motion.div className="h-full bg-gray-dark" initial={false} animate={{ width: `${Math.max(progress, 0.04) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
        </div>
      </header>

      {done ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
          <img src={checkmarkFilledIcon} alt="" className="h-12 w-12" />
          <h1 className="mt-5 text-[26px] font-semibold text-gray-dark">{name || suggestedName} is saved as a draft</h1>
          <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-gray-light">
            We set it up as a {offeringType.toLowerCase()} at {priceLabel}. Publish it from your {categoryName} page when you're ready.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" variant="primary" rounded="rounded-full" onClick={close}>Go to {categoryName}</Button>
            <Button size="lg" variant="secondary" rounded="rounded-full" onClick={reset}>Create another</Button>
          </div>
        </motion.div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1040px] flex-1 items-start justify-center gap-12 px-4 py-10 sm:px-6 lg:py-16">
          <div className="w-full min-w-0 max-w-[560px]">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, y: d * 24 }),
                  center: { opacity: 1, y: 0 },
                  exit: (d: number) => ({ opacity: 0, y: d * -24 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: EASE }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="mt-9 flex items-center gap-3">
              {stepIndex > 0 && !returnToReview && (
                <Button size="lg" variant="secondary" rounded="rounded-full" onClick={back}>Back</Button>
              )}
              <Button size="lg" variant="primary" rounded="rounded-full" className="px-8" disabled={!canContinue} onClick={next}>
                {step === "review" ? "Create offering" : returnToReview ? "Save" : "Continue"}
              </Button>
              <span className="hidden text-[13px] text-gray-extra-light sm:inline">or press Enter ↵</span>
            </div>
          </div>

          {/* Running summary — the offering assembling itself as questions are answered. */}
          {step !== "review" && step !== "select" && (
            <aside className="sticky top-28 hidden w-[300px] shrink-0 rounded-2xl bg-gray-hover p-5 lg:block">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold text-gray-dark">Your offering</p>
                {selected.length > 0 && <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-gray-dark">{offeringType}</span>}
              </div>
              {selected.length === 0 ? (
                <p className="mt-3 text-[14px] leading-relaxed text-gray-light">Pick what to include and it'll come together here.</p>
              ) : (
                <>
                  <ul className="mt-4 grid gap-3.5">
                    {COMPONENTS.filter((c) => has(c.id)).map((c) => (
                      <li key={c.id} className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-dark">
                          <MaskIcon src={c.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14px] font-semibold text-gray-dark">{c.name}</span>
                          <span className="block text-[13px] leading-snug text-gray-light">
                            {componentSummary(c.id)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-gray-stroke pt-4">
                    <span className="text-[13px] text-gray-light">{recurring ? "Subscription" : "One-time"}</span>
                    <span className="text-[16px] font-semibold text-gray-dark">{priceLabel}</span>
                  </div>
                </>
              )}
            </aside>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value, sub, onEdit, last = false }: { label: string; value: string; sub?: string; onEdit?: () => void; last?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3.5 ${last ? "" : "border-b border-gray-stroke"}`}>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-gray-extra-light">{label}</p>
        <p className="mt-0.5 text-[15px] font-semibold text-gray-dark">{value}</p>
        {sub && <p className="mt-0.5 text-[14px] text-gray-light">{sub}</p>}
      </div>
      {onEdit && <Button size="sm" variant="secondary" aria-label={`Edit ${label.toLowerCase()}`} onClick={onEdit}>Edit</Button>}
    </div>
  );
}
