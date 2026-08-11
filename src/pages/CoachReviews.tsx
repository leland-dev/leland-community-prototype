import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { Button } from "../components/Button";
import { IconStar, IconDotsVertical, IconAddPlus, IconArrowUp } from "../components/leland/svg/icons";
import linkIcon from "../assets/icons/link.svg";
import settingsIcon from "../assets/icons/settings.svg";
import thumbtackIcon from "../assets/icons/thumbtack-angle.svg";
import eyeIcon from "../assets/icons/eye.svg";
import eyeClosedIcon from "../assets/icons/eye-closed.svg";
import abhiPhoto from "../assets/profile photos/pic-2.png";
import aviPhoto from "../assets/profile photos/pic-5.png";
import neilPhoto from "../assets/profile photos/pic-9.png";
import kelloggLogo from "../assets/org-logos/kellogg.png";
import columbiaLogo from "../assets/org-logos/columbia.png";
import tuckLogo from "../assets/org-logos/tuck.png";
import hbsLogo from "../assets/org-logos/hbs.png";
import whartonLogo from "../assets/org-logos/wharton.png";
import mitSloanLogo from "../assets/org-logos/mit-sloan.png";
import fuquaLogo from "../assets/org-logos/fuqua.png";
import haasLogo from "../assets/org-logos/haas.png";
import nyuSternLogo from "../assets/org-logos/nyu-stern.png";
import boothLogo from "../assets/logos/booth.png";
import mitLogo from "../assets/logos/mit.png";
import gsbLogo from "../assets/logos/gsb.png";
import yaleLogo from "../assets/logos/yale.png";
import bookBookmarkIcon from "../assets/icons/book-bookmark.svg";
import piggyBankIcon from "../assets/icons/Piggy bank, Coin.1.svg";
import stopwatchIcon from "../assets/icons/stopwatch.svg";
import supportivenessIcon from "../assets/icons/supportiveness.svg";
import clientLogo1 from "../assets/logos/Rectangle 3012.png";
import clientLogo2 from "../assets/logos/Rectangle 3013.png";
import clientLogo3 from "../assets/logos/Rectangle 3017.png";
import clientLogo4 from "../assets/logos/Rectangle 3018.png";
import facebookLogo from "../assets/logos/facebook.png";
import googleLogo from "../assets/logos/google.png";
import instagramLogo from "../assets/logos/instagram.png";
import salesforceLogo from "../assets/logos/salesforce.png";
import coinbaseLogo from "../assets/logos/coinbase.png";
import mckinseyLogo from "../assets/logos/mckinsey.png";
import bainLogo from "../assets/logos/bain.png";
import lekLogo from "../assets/logos/lek.png";
import nikeLogo from "../assets/logos/nike.png";
import goldmanSachsLogo from "../assets/logos/goldman-sachs.png";

const REVIEW_LINK =
  "https://www.joinleland.com/coach/tanner?reviewFor=urn%3Acoach%3A61c39cbd4107292dcd545857";

// Dashed placeholder box — mirrors the profile template's review placeholders.
const dashedBorderStyle = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23C5C5C5' stroke-width='2' stroke-dasharray='4%2c 4' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
};

const SCHOOL_LOGOS: Record<string, string> = {
  "Kellogg School of Management (Northwestern)": kelloggLogo,
  "Chicago Booth": boothLogo,
  "University of Chicago Booth School of Business": boothLogo,
  "Columbia Business School": columbiaLogo,
  "Tuck School of Business": tuckLogo,
  "Harvard Business School": hbsLogo,
  "The Wharton School (UPenn)": whartonLogo,
  "MIT Sloan": mitSloanLogo,
  "Massachusetts Institute of Technology": mitLogo,
  "Stanford Graduate School of Business": gsbLogo,
  "Yale School of Management": yaleLogo,
};

type Review = {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  /** Omitted for anonymous reviewers. */
  name?: string;
  avatar?: string;
  date: string;
  coachedFor: string;
  schools?: string[];
  featured?: boolean;
};

const reviews: Review[] = [
  {
    id: "zack",
    rating: 5,
    title: "Stop searching. Ben is the real deal and will get you admitted.",
    body: "I tried a few different coaches before finding Ben. Save your time, start with Ben. Do not choose Ben if you want a “yes, man” or an easy process. Choose Ben if you want to get admitted. Ben is extremely efficient with your time, gives specific and tactical feedback, and is not shy if a part of your application does not meet the bar. He is no bullshit. He’s also very kind, cool, and an enjoyable person to work with. His superpower is essay writing, though not to discount his intuition around overall application strategy and tying an entire story together into one cohesive view.",
    name: "Zack G.",
    date: "April 2025",
    coachedFor: "MBA",
    schools: ["Stanford Graduate School of Business", "Harvard Business School"],
    featured: true,
  },
  {
    id: "best-coach",
    rating: 5,
    title: "The best MBA coach!!",
    body: "The best decision I made in the MBA process was choosing to work with Ben — he’s the best coach out there! From the start, I was impressed by Ben’s ability to provide quick and actionable feedback, often turning around drafts in a day. As a coach, Ben is a constant source of support who genuinely cares about your success.\n\nHe pushed me to dig deeper on my stories and never let me settle for a draft that was merely “good enough.” I cannot recommend him highly enough.",
    date: "December 2024",
    coachedFor: "MBA",
    schools: [
      "Harvard Business School",
      "The Wharton School (UPenn)",
      "Kellogg School of Management (Northwestern)",
      "Chicago Booth",
      "MIT Sloan",
      "Columbia Business School",
    ],
    featured: true,
  },
  {
    id: "ben-gets-it",
    rating: 5,
    title: "Ben gets it! Highly recommend.",
    body: "Working with Ben was one of the best decisions I made ahead of my deferred MBA application process. I initially wasn't sure if I wanted to work with an admissions consultant, and after meeting several, it seemed to reaffirm my choice to go through the process alone... until I met Ben! He's incredibly personable, and helped me take my story and relay it in the best possible way. Ben is young enough and close enough to his own MBA experience to understand what applicants are going through, and what admissions is really looking for. I primarily worked with Ben on polishing my essays, and the results speak for themselves.",
    date: "May 2022",
    coachedFor: "MBA (Deferred MBA)",
    schools: [
      "Stanford Graduate School of Business",
      "The Wharton School (UPenn)",
      "Kellogg School of Management (Northwestern)",
      "MIT Sloan",
    ],
    featured: true,
  },
  {
    id: "abhi",
    rating: 5,
    title: "Life-Changing MBA Coach",
    body: "Doing an MBA was a dream of mine since I was a young kid. Growing up in the 2000/2010s I idolized Silicon Valley founders like Larry Page and Sergey Brin. With Ben’s incredible mentorship, I was able to land Kellogg’s deferred MBA, one of my dream programs!\n\nFor anyone looking to find their story and figure out how to put their best foot forward, I can’t recommend Ben enough. Ben was able to help me articulate my experiences in a way that felt authentic and compelling.",
    name: "Abhi V.",
    avatar: abhiPhoto,
    date: "December 2025",
    coachedFor: "MBA",
    schools: ["Kellogg School of Management (Northwestern)"],
  },
  {
    id: "ten-ten",
    rating: 5,
    title: "10/10 experience",
    body: "Overall, working with Ben was a great experience - I would absolutely recommend him to someone else applying to MBA programs who wants assistance with essay writing. I applied to 6 programs, and he provided detailed feedback and commentary. Given Ben's significant experience working with many clients, he understands what each school is looking for and how to help tailor your essays accordingly. He'll provide straightforward guidance and candid opinions, but it is equally important that the client provides clear communication with Ben so everyone is on the same page. Would recommend using him as a coach as he is a great partner throughout the process.",
    date: "November 2025",
    coachedFor: "MBA",
    schools: [
      "Kellogg School of Management (Northwestern)",
      "Chicago Booth",
      "Columbia Business School",
      "Tuck School of Business",
    ],
  },
  {
    id: "interview-prep",
    rating: 5,
    title: "Fantastic MBA interview prep!",
    body: "Ben helped me with my HBS interview, and he was incredibly knowledgeable! He helped me by sharing an interview questions doc and gave specific feedback on how I could sharpen my answers during our mock together. I cannot recommend Ben enough!",
    date: "October 2025",
    coachedFor: "MBA",
    schools: ["Harvard Business School", "The Wharton School (UPenn)"],
  },
  {
    id: "avi",
    rating: 5,
    title: "Ben helped me understand my own story",
    body: "Ben is the key reason why I got into CBS and Booth.\n\n1. His engaging, prying conversations with me led me to figure out my core essay theme and made writing way easier than it ever had been. I wrote about a topic that I never would’ve thought I could write about.\n\n2. His feedback was always fast, direct, and made my essays measurably stronger with each round.",
    name: "Avi M.",
    avatar: aviPhoto,
    date: "January 2026",
    coachedFor: "MBA",
    schools: ["Chicago Booth", "Columbia Business School"],
  },
  {
    id: "neil",
    rating: 2,
    title: "High-Quality Essay Feedback, Less Value in Holistic Admissions Coaching",
    body: "Context: worked with Ben on 2 M7 (Kellogg and HBS didn’t get admitted) but got admitted to another M7 (MIT) on my own. I’ve also used Leland with different coaches which helped me get more perspective.\n\nStrengths: Ben is genuinely excellent at line-by-line essay editing and made my writing tighter. Where I felt less supported was on the broader, holistic strategy — school selection, positioning, and interview prep felt lighter than I hoped.",
    name: "Neil T.",
    avatar: neilPhoto,
    date: "May 2026",
    coachedFor: "MBA",
    schools: [
      "Kellogg School of Management (Northwestern)",
      "MIT Sloan",
    ],
  },
  {
    id: "faiza",
    rating: 5,
    name: "Faiza T.",
    date: "May 2026",
    coachedFor: "MBA",
  },
  {
    id: "pointed",
    rating: 5,
    title: "Pointed and personalised advice!",
    body: "I reached out to Ben 2 days before my application submissions with an extremely subpar resume. It needed a complete rework, understanding my background, what makes me stand out and rethinking. Ben managed my expectations of what was possible from his end given that he was supporting his full time clients too. Doing that not only helped ease my stress but also gave me confidence in the output. Needless to say, his rework of my resume was spectacular and ensured to include every relevant point from my experience to showcase a holistic picture.",
    date: "April 2026",
    coachedFor: "MBA",
    schools: ["MIT Sloan", "Columbia Business School"],
  },
  {
    id: "best-experience",
    rating: 5,
    title: "The Best Experience!",
    body: "Working with Ben was the best decision I made during my MBA application process! He was supportive in every aspect, down to the small, seemingly insignificant questions. He is an expert writer and was quick in his turnarounds, allowing me to go through several iterations on my essays until I felt they were perfect.",
    date: "July 2026",
    coachedFor: "MBA",
    schools: [
      "The Wharton School (UPenn)",
      "Chicago Booth",
      "Columbia Business School",
      "Yale School of Management",
      "Darden School of Business (UVA)",
      "Johnson Graduate School of Management (Cornell)",
      "McDonough School of Business (Georgetown)",
    ],
  },
  {
    id: "only-reason",
    rating: 5,
    title: "Probably the Only Reason I got Offers",
    body: "Ben was amazing! I got started pretty late and had about 5 weeks to work with Ben and submit essays for 7 different schools. Over those 5 weeks, Ben helped me churn through over 70 versions of essays. He really helped turn my writing from mediocre to excellent. Without his guidance and expertise, I seriously doubt I would have gotten any interviews let alone 2 offers.",
    date: "June 2026",
    coachedFor: "MBA",
    schools: ["Chicago Booth", "Columbia Business School"],
  },
];

const INITIALS_COLORS = ["#B85A2B", "#869AA6", "#1F5340", "#9685A8", "#80ACED"];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function colorFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return INITIALS_COLORS[h % INITIALS_COLORS.length];
}

function ReviewAvatar({ review }: { review: Review }) {
  if (review.avatar) {
    return <img src={review.avatar} alt={review.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />;
  }
  if (review.name) {
    return (
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold text-white"
        style={{ backgroundColor: colorFor(review.name) }}
      >
        {initialsFor(review.name)}
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-hover text-gray-xlight">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
      </svg>
    </div>
  );
}

function SchoolPill({ name }: { name: string }) {
  const logo = SCHOOL_LOGOS[name];
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#222222]/5 py-1.5 pl-1.5 pr-3.5 text-[14px] font-medium text-gray-dark">
      {logo ? (
        <img src={logo} alt="" className="h-6 w-6 rounded-full object-cover" />
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-stroke text-[11px] font-semibold text-gray-light">
          {name[0]}
        </span>
      )}
      {name}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#222222]/5 px-2.5 py-1.5 text-[13px] font-medium text-gray-dark">
      <IconStar className="h-3.5 w-3.5 text-[#FDB022]" />
      Featured
    </span>
  );
}

function ReviewBody({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > 260;
  return (
    <div className="mt-3">
      <p
        className={`whitespace-pre-line text-[16px] leading-relaxed text-gray-dark ${
          !expanded && long ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-0.5 text-[15px] text-gray-dark underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

type Outcome = {
  id: string;
  name: string;
  logo: string;
  clients: number;
  hidden: boolean;
};

const initialOutcomes: Outcome[] = [
  { id: "stripe", name: "Stripe", logo: clientLogo1, clients: 12, hidden: false },
  { id: "airbnb", name: "Airbnb", logo: clientLogo2, clients: 9, hidden: false },
  { id: "apple", name: "Apple", logo: clientLogo3, clients: 8, hidden: false },
  { id: "bcg", name: "BCG", logo: clientLogo4, clients: 7, hidden: false },
  { id: "meta", name: "Meta", logo: facebookLogo, clients: 6, hidden: false },
  { id: "google", name: "Google", logo: googleLogo, clients: 6, hidden: false },
  { id: "instagram", name: "Instagram", logo: instagramLogo, clients: 5, hidden: false },
  { id: "salesforce", name: "Salesforce", logo: salesforceLogo, clients: 4, hidden: false },
  { id: "coinbase", name: "Coinbase", logo: coinbaseLogo, clients: 4, hidden: false },
  { id: "mckinsey", name: "McKinsey & Company", logo: mckinseyLogo, clients: 3, hidden: false },
  { id: "bain", name: "Bain & Company", logo: bainLogo, clients: 3, hidden: false },
  { id: "lek", name: "L.E.K. Consulting", logo: lekLogo, clients: 2, hidden: false },
  { id: "nike", name: "Nike", logo: nikeLogo, clients: 2, hidden: false },
  { id: "goldman", name: "Goldman Sachs", logo: goldmanSachsLogo, clients: 1, hidden: false },
];

const initialSchools: Outcome[] = [
  { id: "hbs", name: "Harvard Business School", logo: hbsLogo, clients: 11, hidden: false },
  { id: "wharton", name: "The Wharton School (UPenn)", logo: whartonLogo, clients: 9, hidden: false },
  { id: "kellogg", name: "Kellogg School of Management", logo: kelloggLogo, clients: 8, hidden: false },
  { id: "mit-sloan", name: "MIT Sloan", logo: mitSloanLogo, clients: 6, hidden: false },
  { id: "columbia", name: "Columbia Business School", logo: columbiaLogo, clients: 5, hidden: false },
  { id: "tuck", name: "Tuck School of Business", logo: tuckLogo, clients: 4, hidden: false },
  { id: "stern", name: "NYU Stern", logo: nyuSternLogo, clients: 3, hidden: false },
  { id: "haas", name: "Haas School of Business", logo: haasLogo, clients: 2, hidden: false },
  { id: "fuqua", name: "Fuqua School of Business", logo: fuquaLogo, clients: 2, hidden: false },
];

function OutcomeRow({
  outcome,
  onToggleHidden,
  borderless,
  featured,
  onRowDragStart,
  onRowDragEnd,
}: {
  outcome: Outcome;
  onToggleHidden: (id: string) => void;
  borderless?: boolean;
  featured?: boolean;
  onRowDragStart?: (outcome: Outcome) => void;
  onRowDragEnd?: (outcome: Outcome) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      as="div"
      value={outcome}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => onRowDragStart?.(outcome)}
      onDragEnd={() => onRowDragEnd?.(outcome)}
      className={`group flex select-none items-center gap-3 bg-white py-3 ${
        borderless ? "" : "border-b border-gray-stroke"
      }`}
    >
      {/* Drag handle */}
      <button
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-gray-xlight active:cursor-grabbing"
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden>
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <circle key={`${row}-${col}`} cx={1.5 + col * 7} cy={2 + row * 6} r="1.5" />
            ))
          )}
        </svg>
      </button>

      {/* Logo */}
      <div
        className={`h-9 w-9 shrink-0 overflow-hidden rounded-[4px] transition ${
          outcome.hidden ? "opacity-30 grayscale" : ""
        }`}
      >
        <img src={outcome.logo} alt="" className="h-full w-full object-cover" />
      </div>

      {/* Name + client count */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] font-medium ${
            outcome.hidden ? "text-gray-extra-light" : "text-gray-dark"
          }`}
        >
          {outcome.name}
        </p>
        <p
          className={`flex items-center text-[13px] ${outcome.hidden ? "text-gray-extra-light" : "text-gray-light"}`}
        >
          {featured && (
            <span className="mr-1 flex items-center">
              <img src={thumbtackIcon} alt="" className="mr-1 h-3.5 w-3.5" />Featured ·
            </span>
          )}
          {outcome.clients} {outcome.clients === 1 ? "client" : "clients"}
          {outcome.hidden && <span className="ml-1">· Hidden</span>}
        </p>
      </div>

      {/* Hide toggle — revealed on row hover */}
      <button
        onClick={() => onToggleHidden(outcome.id)}
        aria-label={outcome.hidden ? "Show outcome" : "Hide outcome"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-light transition-opacity hover:bg-gray-hover focus-visible:opacity-100 group-hover:opacity-100 ${
          outcome.hidden ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={outcome.hidden ? eyeClosedIcon : eyeIcon}
          alt=""
          className="h-[20px] w-[20px]"
        />
      </button>
    </Reorder.Item>
  );
}

function OutcomesModal({
  open,
  onClose,
  schools,
  setSchools,
  companies,
  setCompanies,
}: {
  open: boolean;
  onClose: () => void;
  schools: Outcome[];
  setSchools: (o: Outcome[]) => void;
  companies: Outcome[];
  setCompanies: (o: Outcome[]) => void;
}) {
  const [tab, setTab] = useState<"schools" | "companies">("companies");
  const [scrolled, setScrolled] = useState(false);
  const outcomes = tab === "schools" ? schools : companies;
  const setOutcomes = tab === "schools" ? setSchools : setCompanies;

  const toggleHidden = (id: string) => {
    const idx = outcomes.findIndex((o) => o.id === id);
    if (idx === -1) return;
    const updated = { ...outcomes[idx], hidden: !outcomes[idx].hidden };
    const rest = outcomes.filter((o) => o.id !== id);
    // Hiding one of the featured (top 4) outcomes bumps it just past the
    // featured cutoff to place #5; otherwise it keeps its position.
    rest.splice(updated.hidden && idx < 4 ? 4 : idx, 0, updated);
    setOutcomes(rest);
  };

  // Snapshot the order when a drag begins so we can revert a hidden outcome
  // that gets dropped inside the featured top 4 (it isn't allowed there).
  const preDragOrder = useRef<Outcome[] | null>(null);
  const handleDragStart = () => {
    preDragOrder.current = outcomes;
  };
  const handleDragEnd = (outcome: Outcome) => {
    const snapshot = preDragOrder.current;
    preDragOrder.current = null;
    if (!outcome.hidden || !snapshot) return;
    const idx = outcomes.findIndex((o) => o.id === outcome.id);
    if (idx > -1 && idx < 4) setOutcomes(snapshot);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="relative flex max-h-[min(825px,85vh)] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl bg-white shadow-card-large"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-stroke px-5 pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-[24px] font-medium text-gray-dark">Manage outcomes</h2>
                  <AnimatePresence initial={false}>
                    {!scrolled && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden pt-0.5 text-[16px] text-gray-light"
                      >
                        Drag to reorder. Your top 4 outcomes are featured at the top of your profile.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-light transition-colors hover:bg-gray-hover"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex gap-6">
                {[
                  { key: "companies" as const, label: "Companies", count: companies.length },
                  { key: "schools" as const, label: "Schools", count: schools.length },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-[15px] transition-colors ${
                      tab === key
                        ? "border-gray-dark font-medium text-gray-dark"
                        : "border-transparent font-medium text-gray-light hover:text-gray-dark"
                    }`}
                  >
                    {label}
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-hover px-1.5 text-[12px] font-medium text-gray-extra-light">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div
              className="overflow-y-auto px-5 pb-24"
              onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
            >
              <Reorder.Group as="div" axis="y" values={outcomes} onReorder={setOutcomes} className="flex flex-col">
                {outcomes.map((outcome, i) => (
                  <Fragment key={outcome.id}>
                    <OutcomeRow
                      outcome={outcome}
                      onToggleHidden={toggleHidden}
                      borderless={i === 3}
                      featured={i < 4}
                      onRowDragStart={handleDragStart}
                      onRowDragEnd={handleDragEnd}
                    />
                    {i === 3 && (
                      <div className="-mx-5 flex items-center gap-2 border-y border-gray-stroke bg-gray-hover px-5 py-2.5">
                        <IconArrowUp className="h-4 w-4 shrink-0 text-gray-light" />
                        <span className="text-[13px] font-medium text-gray-light">
                          Featured at the top of your profile
                        </span>
                      </div>
                    )}
                  </Fragment>
                ))}
              </Reorder.Group>
            </div>

            {/* Footer — floats over the bottom of the list */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent px-5 pb-4 pt-10">
              <Button
                size="lg"
                variant="primary"
                rounded="rounded-full"
                onClick={onClose}
                className="pointer-events-auto w-full"
              >
                Save changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Static display stars, gold fill for the rating, gray-stroke for the remainder.
function Stars({ rating, className = "h-[18px] w-[18px]" }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-px" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar
          key={i}
          className={`${className} ${i < rating ? "text-[#FDB022]" : "text-gray-stroke"}`}
        />
      ))}
    </div>
  );
}

function KebabButton() {
  return (
    <button
      aria-label="Review options"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-stroke text-gray-light transition-colors hover:bg-gray-hover"
    >
      <IconDotsVertical className="h-[18px] w-[18px]" />
    </button>
  );
}

function AddOutcomeButton() {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-gray-stroke px-4 py-2 text-[14px] font-medium text-gray-dark transition-colors hover:bg-gray-hover">
      <IconAddPlus className="h-4 w-4" />
      Add outcome
    </button>
  );
}

// Single-line logo strip: fits as many 36px logos as the container allows,
// then caps with a "+X" chip for the remainder (mirrors the profile template).
function LogoStrip({ outcomes }: { outcomes: Outcome[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState(outcomes.length);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ITEM = 36;
    const GAP = 6;
    const measure = () => {
      const w = el.clientWidth;
      setSlots(Math.max(1, Math.floor((w + GAP) / (ITEM + GAP))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const total = outcomes.length;
  const truncated = total > slots;
  const shown = truncated ? outcomes.slice(0, Math.max(0, slots - 1)) : outcomes;
  const remaining = total - shown.length;

  return (
    <div ref={ref} className="flex items-center gap-1.5 overflow-hidden">
      {shown.map((outcome) => (
        <div key={outcome.id} className="h-9 w-9 shrink-0 overflow-hidden rounded-none">
          <img src={outcome.logo} alt={outcome.name} className="h-full w-full object-cover" />
        </div>
      ))}
      {truncated && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-[#f5f5f5] text-[12px] font-medium text-[#707070]">
          +{remaining}
        </span>
      )}
    </div>
  );
}

export default function CoachReviews() {
  const [tab, setTab] = useState<"reviews" | "pending">("reviews");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outcomesOpen, setOutcomesOpen] = useState(false);
  const [outcomes, setOutcomes] = useState<Outcome[]>(initialOutcomes);
  const [schoolOutcomes, setSchoolOutcomes] = useState<Outcome[]>(initialSchools);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Leland Prototype | Reviews";
  }, []);

  // Close the share popover on outside click or Escape.
  useEffect(() => {
    if (!shareOpen) return;
    const onDown = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  const copyLink = () => {
    navigator.clipboard?.writeText(REVIEW_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const visibleOutcomes = [...outcomes, ...schoolOutcomes].filter((o) => !o.hidden);

  return (
    <div className="mx-auto max-w-[880px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[30px] font-medium text-gray-dark md:text-[38px]">37 reviews</h1>

          {/* Stars + average */}
          <div className="mt-2 flex items-center gap-2.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#222222">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[18px] font-normal text-gray-light">4.9 avg</span>
          </div>
        </div>

        <div ref={shareRef} className="relative shrink-0">
          <Button size="md" variant="white" onClick={() => setShareOpen((o) => !o)} className="border border-gray-stroke !font-semibold shadow-[0_1px_1px_rgba(0,0,0,0.02)]">
            <img src={linkIcon} alt="" className="h-[18px] w-[18px]" />
            Share link
          </Button>

          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute right-0 top-full z-50 mt-2 w-[420px] max-w-[calc(100vw-32px)] rounded-2xl border border-gray-stroke bg-white p-5 shadow-card-large"
              >
                <p className="text-[16px] font-semibold text-gray-dark">Share your review link</p>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-gray-stroke py-1.5 pl-4 pr-1.5">
                  <span className="min-w-0 flex-1 truncate text-[15px] text-gray-light">{REVIEW_LINK}</span>
                  <Button size="sm" variant="dark" rounded="rounded-full" onClick={copyLink} className="shrink-0">
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                </div>
                <p className="mt-3 text-[13px] leading-snug text-gray-light">
                  Only clients you have coached in the past can open this link.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Review hero — mirrors the profile template's review summary */}
      <div className="mt-1">
        {/* Rating breakdown — always expanded */}
        <div>
              <div className="my-5 border-t border-gray-200" />

              {/* Airbnb-style columns */}
              <div className="flex flex-col gap-4 md:grid md:grid-cols-5">
                {/* Overall rating distribution */}
                <div className="md:col-span-1">
                  <p className="mb-1 text-[14px] font-medium text-gray-light">Overall rating</p>
                  <div className="flex flex-col gap-1">
                    {[
                      { star: 5, count: 3 },
                      { star: 4, count: 0 },
                      { star: 3, count: 0 },
                      { star: 2, count: 0 },
                      { star: 1, count: 0 },
                    ].map((row) => (
                      <div key={row.star} className="flex items-center gap-1.5">
                        <span className="w-[10px] shrink-0 text-[10px] text-[#707070]">{row.star}</span>
                        <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
                          <div
                            className="h-full rounded-full bg-gray-dark"
                            style={{ width: `${(row.count / 3) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category scores — horizontal scroll on mobile, grid columns on desktop */}
                <div className="-mx-4 scrollbar-hide col-span-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:contents md:px-0">
                  {[
                    { label: "Knowledge", score: 5.0, icon: <img src={bookBookmarkIcon} alt="" className="h-[32px] w-[32px]" /> },
                    { label: "Value", score: 5.0, icon: <img src={piggyBankIcon} alt="" className="h-[32px] w-[32px]" /> },
                    { label: "Responsiveness", score: 5.0, icon: <img src={stopwatchIcon} alt="" className="h-[32px] w-[32px]" /> },
                    { label: "Supportiveness", score: 5.0, icon: <img src={supportivenessIcon} alt="" className="h-[32px] w-[32px]" /> },
                  ].map((item) => (
                    <div key={item.label} className="flex w-[60vw] shrink-0 flex-col justify-between rounded-lg border border-gray-200 p-4 md:w-auto md:shrink md:rounded-none md:border-0 md:border-l md:p-0 md:pl-4">
                      <div>
                        <p className="text-[14px] font-medium text-gray-light">{item.label}</p>
                        <p className="text-[22px] font-semibold text-gray-dark">{item.score.toFixed(1)}</p>
                      </div>
                      <div className="mt-3 text-gray-dark">{item.icon}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider below the breakdown */}
              <div className="mt-6 border-t border-gray-200" />
        </div>

        {/* Outcomes from your reviews */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-[14px] font-medium text-gray-light">Outcomes from your reviews</p>
            <button
              onClick={() => setOutcomesOpen(true)}
              className="flex shrink-0 items-center gap-1.5 text-[14px] font-medium text-gray-extra-light transition-colors hover:text-gray-light"
            >
              <img src={settingsIcon} alt="" className="h-4 w-4" />
              Manage
            </button>
          </div>
          <LogoStrip outcomes={visibleOutcomes} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-gray-stroke">
        <div className="flex gap-8">
          {[
            { key: "reviews" as const, label: "My reviews" },
            { key: "pending" as const, label: "Haven’t reviewed yet" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`-mb-px border-b-2 pb-3 text-[16px] transition-colors ${
                tab === key
                  ? "border-gray-dark font-medium text-gray-dark"
                  : "border-transparent font-medium text-gray-light hover:text-gray-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Review list — dashed placeholders (mirrors the profile template) */}
      {tab === "reviews" ? (
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[180px] rounded-xl bg-[#f5f5f5]" style={dashedBorderStyle} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[16px] text-gray-light">
          Everyone you’ve coached has left a review. 🎉
        </div>
      )}

      <OutcomesModal
        open={outcomesOpen}
        onClose={() => setOutcomesOpen(false)}
        schools={schoolOutcomes}
        setSchools={setSchoolOutcomes}
        companies={outcomes}
        setCompanies={setOutcomes}
      />
    </div>
  );
}
