import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  X,
  Send,
  Video,
  Star,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Mail,
  ChevronDown,
  MessageCircle,
  MessageSquare,
  Repeat2,
  Heart,
  Code,
} from "lucide-react";

import { Button } from "../components/Button";
import lelandLogo from "../assets/Logo.svg";
import lelandCompass from "../assets/leland-compass.svg";

// Asset imports
import bootcamp1 from "../assets/placeholder images/bootcamp-1.webp";
import bootcamp2 from "../assets/placeholder images/bootcamp-2.webp";
import aiBuilder1 from "../assets/img/ai-builder-l1.avif";
import aiBuilder2 from "../assets/img/ai-builder-l2.avif";
import categoryConsulting from "../assets/placeholder images/category images/management-consulting.png";
import categoryPE from "../assets/placeholder images/category images/private-equity.png";
import lelandPlus1 from "../assets/placeholder images/leland-plus-images/3cf6e985-7397-4e50-8e06-ef9a8f40491c.webp";

import pic1 from "../assets/profile photos/pic-1.png";
import pic3 from "../assets/profile photos/pic-3.png";
import pic5 from "../assets/profile photos/pic-5.png";
import pic6 from "../assets/profile photos/pic-6.png";
import pic7 from "../assets/profile photos/pic-7.png";
import pic8 from "../assets/profile photos/pic-8.png";
import pic9 from "../assets/profile photos/pic-9.png";
import pic10 from "../assets/profile photos/pic-10.png";
import pic11 from "../assets/profile photos/pic-11.png";
import pic12 from "../assets/profile photos/pic-12.png";

// Typeform schema — drives the conversation
import onboardingSchema from "../assets/json/onboarding.json";

/* ─────────────── typeform schema parsing ─────────────── */

type Choice = { id: string; ref: string; label: string };
type FieldType =
  | "multiple_choice"
  | "dropdown"
  | "statement"
  | "phone_number"
  | "calendly"
  | "short_text"
  | "long_text"
  | "email";

type FormField = {
  id: string;
  ref: string;
  title: string;
  description?: string;
  type: FieldType;
  required: boolean;
  allowMultiple: boolean;
  choices: Choice[];
};

const FORM_ID = (onboardingSchema as any).id as string;

const FIELDS_BY_REF: Map<string, FormField> = new Map(
  (onboardingSchema as any).fields.map((f: any) => [
    f.ref,
    {
      id: f.id,
      ref: f.ref,
      title: (f.title || "").trim(),
      description: f.properties?.description,
      type: f.type as FieldType,
      required: f.validations?.required ?? false,
      allowMultiple: f.properties?.allow_multiple_selection ?? false,
      choices: (f.properties?.choices ?? []).map((c: any) => ({
        id: c.id,
        ref: c.ref,
        label: c.label,
      })),
    } as FormField,
  ]),
);

function field(ref: string): FormField | undefined {
  return FIELDS_BY_REF.get(ref);
}

function choiceRefByLabel(fieldRef: string, label: string): string {
  return field(fieldRef)?.choices.find((c) => c.label === label)?.ref ?? "";
}

function labelByChoiceRef(fieldRef: string, choiceRef: string): string {
  return field(fieldRef)?.choices.find((c) => c.ref === choiceRef)?.label ?? "";
}

// Cache key choice refs we branch on
const GOAL = {
  career: choiceRefByLabel("goal", "Build my career"),
  school: choiceRefByLabel("goal", "Get into school"),
  test: choiceRefByLabel("goal", "Take a test"),
};
const SCHOOLS = {
  mba: choiceRefByLabel("schools", "MBA"),
  undergrad: choiceRefByLabel("schools", "College (Undergrad)"),
  law: choiceRefByLabel("schools", "Law School"),
  med: choiceRefByLabel("schools", "Medical School"),
  masters: choiceRefByLabel("schools", "Master's Programs"),
  phd: choiceRefByLabel("schools", "PhD Programs"),
};

// Refs we'll address by-ref through the flow (these aren't human-named in the form)
const WHEN_MBA = "07045f40-3da8-452f-a9db-e2a2fe4cd76d";
const WHEN_MASTERS = "2a431ecb-c862-4522-b8f8-30d6e644dec8";
const WHEN_LAW_MED = "a3277c9b-3f57-453e-a83e-c52cfc6da7e5";
const WHEN_UNDERGRAD = "bcdff00e-c70a-417e-8bae-547ffac12616";
const WHEN_TEST = "76c5d362-fb99-46fb-8bfd-f8232cbafaac";

/* ─────────────── answers + flow ─────────────── */

type AnswerValue = string | string[]; // choice ref(s) or text
type Answers = Record<string, AnswerValue>;

/** Given the current field ref and the answers so far, return the next field
 * ref — or null when the conversation is complete. Implements a simplified
 * version of the typeform's branching logic. */
function nextRef(current: string, a: Answers): string | null {
  switch (current) {
    case "goal":
      if (a.goal === GOAL.career) return "careers";
      if (a.goal === GOAL.school) return "schools";
      if (a.goal === GOAL.test) return "tests";
      return "apply-timeline";

    case "careers":
      return "apply-timeline";

    case "schools":
      return "apply-timeline";

    case "tests":
      return "apply-timeline";

    case "apply-timeline":
      if (a.goal === GOAL.school) return "school-services";
      if (a.goal === GOAL.career) return "career-services";
      if (a.goal === GOAL.test) return "budget";
      return "budget";

    case "school-services":
    case "career-services":
      return "budget";

    case "budget": {
      if (a.goal === GOAL.test) return WHEN_TEST;
      if (a.goal === GOAL.school) {
        if (a.schools === SCHOOLS.mba) return "mba-schools";
        if (a.schools === SCHOOLS.law || a.schools === SCHOOLS.med)
          return WHEN_LAW_MED;
        if (a.schools === SCHOOLS.undergrad) return WHEN_UNDERGRAD;
        if (
          a.schools === SCHOOLS.masters ||
          a.schools === SCHOOLS.phd
        )
          return WHEN_MASTERS;
      }
      return "reach-out";
    }

    case "mba-schools":
      return "mba-programs";

    case "mba-programs":
      return WHEN_MBA;

    case WHEN_MBA:
    case WHEN_MASTERS:
    case WHEN_LAW_MED:
    case WHEN_UNDERGRAD:
    case WHEN_TEST:
      return "reach-out";

    case "reach-out":
      // Skip phone / calendly for the prototype — go straight to attribution
      return "how-hear-about-us";

    case "how-hear-about-us":
      return null;

    default:
      return null;
  }
}

/* ─────────────── pre-fill from initial goal text ─────────────── */

function preFill(initial: string): Answers {
  const g = initial.toLowerCase();
  const a: Answers = {};
  if (!g.trim()) return a;

  // MBA family
  if (
    /\b(mba|hbs|gsb|wharton|kellogg|booth|mit\s*sloan|columbia|tuck|haas|fuqua|stern|business\s*school)\b/.test(
      g,
    )
  ) {
    a.goal = GOAL.school;
    a.schools = SCHOOLS.mba;
    const mbaProgs: string[] = [];
    const map: Record<string, string> = {
      hbs: "Harvard",
      harvard: "Harvard",
      gsb: "Stanford",
      stanford: "Stanford",
      wharton: "Wharton (UPenn)",
      penn: "Wharton (UPenn)",
      kellogg: "Kellogg (Northwestern)",
      booth: "Booth (UChicago)",
      mit: "MIT Sloan",
      sloan: "MIT Sloan",
      columbia: "Columbia",
    };
    for (const [k, label] of Object.entries(map)) {
      if (g.includes(k)) {
        const ref = choiceRefByLabel("mba-schools", label);
        if (ref && !mbaProgs.includes(ref)) mbaProgs.push(ref);
      }
    }
    if (mbaProgs.length) a["mba-schools"] = mbaProgs;
  } else if (/\b(law\s*school|jd|llm|lsat)\b/.test(g)) {
    a.goal = GOAL.school;
    a.schools = SCHOOLS.law;
  } else if (/\b(med\s*school|mcat|medical)\b/.test(g)) {
    a.goal = GOAL.school;
    a.schools = SCHOOLS.med;
  } else if (/\b(undergrad|college|ivy)\b/.test(g)) {
    a.goal = GOAL.school;
    a.schools = SCHOOLS.undergrad;
  } else if (/\b(gmat|gre|sat|act|lsat|dat|mcat)\b/.test(g)) {
    a.goal = GOAL.test;
    const testMap: Record<string, string> = {
      gmat: "GMAT",
      gre: "GRE",
      sat: "SAT",
      act: "ACT",
      lsat: "LSAT",
      dat: "DAT",
      mcat: "MCAT",
    };
    for (const [k, label] of Object.entries(testMap)) {
      if (new RegExp(`\\b${k}\\b`).test(g)) {
        const ref = choiceRefByLabel("tests", label);
        if (ref) {
          a.tests = ref;
          break;
        }
      }
    }
  } else if (
    /\b(ai|claude|agent|llm|gpt|openai|anthropic|mckinsey|bcg|bain|mbb|consult|ib|investment\s*bank|goldman|product\s*manager|pm\b|google|meta|stripe|vc|venture|private\s*equity|engineer|software)\b/.test(
      g,
    )
  ) {
    a.goal = GOAL.career;
    const careerMap: Array<[RegExp, string]> = [
      [/\b(ai\s*lead|leader|leadership|break\s*into\s*ai)\b/, "Break Into AI Careers"],
      [/\b(ai|claude|agent|llm|gpt|openai|anthropic|automation)\b/, "AI Automation & Agents"],
      [/\b(mckinsey|bcg|bain|mbb|consult)\b/, "Management Consulting"],
      [/\b(pm\b|product\s*manager|product\s*management)\b/, "Product Management"],
      [/\b(ib|investment\s*bank|goldman)\b/, "Investment Banking"],
      [/\b(private\s*equity|\bpe\b)\b/, "Private Equity"],
      [/\b(vc|venture)\b/, "Venture Capital"],
      [/\b(engineer|software)\b/, "Software Engineering"],
    ];
    const picks: string[] = [];
    careerMap.forEach(([re, label]) => {
      if (re.test(g)) {
        const ref = choiceRefByLabel("careers", label);
        if (ref && !picks.includes(ref)) picks.push(ref);
      }
    });
    if (picks.length) a.careers = picks;
  }

  return a;
}

/** Walk the flow starting at "goal" until we hit the first field that the
 * user hasn't already pre-answered. */
function firstUnansweredRef(a: Answers): string | null {
  let cur: string | null = "goal";
  while (cur && a[cur] !== undefined) {
    cur = nextRef(cur, a);
  }
  return cur;
}

/** Walk the entire flow, return the list of refs that will be asked given
 * the current answers. Used for progress display. */
function expectedFlowLength(a: Answers): number {
  let cur: string | null = "goal";
  let count = 0;
  const seen = new Set<string>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    const f = field(cur);
    if (f && f.type !== "statement" && f.type !== "calendly" && f.type !== "phone_number") {
      count += 1;
    }
    cur = nextRef(cur, a);
  }
  return count;
}

/* ─────────────── format helpers ─────────────── */

function labelFor(fieldRef: string, value: AnswerValue): string {
  const f = field(fieldRef);
  if (!f) return Array.isArray(value) ? value.join(", ") : value;
  if (Array.isArray(value)) {
    return value
      .map((v) => f.choices.find((c) => c.ref === v)?.label ?? v)
      .join(", ");
  }
  return f.choices.find((c) => c.ref === value)?.label ?? value;
}

/** Build a typeform-shape response object that mirrors a webhook payload. */
type TypeformAnswerOut =
  | {
      field: { id: string; ref: string; type: string };
      type: "choice";
      choice: { id: string; ref: string; label: string };
    }
  | {
      field: { id: string; ref: string; type: string };
      type: "choices";
      choices: { ids: string[]; refs: string[]; labels: string[] };
    }
  | {
      field: { id: string; ref: string; type: string };
      type: "text";
      text: string;
    };

function buildTypeformResponse(answers: Answers) {
  const answersOut: TypeformAnswerOut[] = [];
  for (const [ref, value] of Object.entries(answers)) {
    const f = field(ref);
    if (!f) continue;
    const meta = { id: f.id, ref: f.ref, type: f.type };
    if (Array.isArray(value)) {
      const choices = value
        .map((v) => f.choices.find((c) => c.ref === v))
        .filter((c): c is Choice => Boolean(c));
      answersOut.push({
        field: meta,
        type: "choices",
        choices: {
          ids: choices.map((c) => c.id),
          refs: choices.map((c) => c.ref),
          labels: choices.map((c) => c.label),
        },
      });
    } else {
      const c = f.choices.find((x) => x.ref === value);
      if (c) {
        answersOut.push({
          field: meta,
          type: "choice",
          choice: { id: c.id, ref: c.ref, label: c.label },
        });
      } else {
        answersOut.push({ field: meta, type: "text", text: value });
      }
    }
  }
  return {
    form_id: FORM_ID,
    submitted_at: new Date().toISOString(),
    answers: answersOut,
  };
}

/* ─────────────── sidebar content (category-aware) ─────────────── */

type Category = "admissions" | "ai" | "career" | "life" | "general";

type Expert = {
  name: string;
  role: string;
  sub: string;
  avatar: string;
  rating: number;
  reviews: number;
  price?: string;
};

type LiveSession = {
  title: string;
  host: string;
  avatar: string;
  cover: string;
  watching: number;
  tag: string;
};

type Cohort = {
  title: string;
  blurb: string;
  cover: string;
  startsIn: string;
  seats: string;
};

type FeedPost = {
  author: string;
  avatar: string;
  time: string;
  headline: string;
  excerpt: string;
  tag: string;
  likes: number;
  comments: number;
  reposts: number;
};

const CATEGORY_CONTENT: Record<
  Category,
  {
    live: LiveSession;
    experts: Expert[];
    cohort: Cohort;
    label: string;
    posts: FeedPost[];
  }
> = {
  admissions: {
    label: "Admissions",
    live: {
      title: "Inside the HBS Round 1 Read",
      host: "Priya R. · ex-HBS AdCom",
      avatar: pic7,
      cover: bootcamp2,
      watching: 296,
      tag: "Live · Admissions",
    },
    experts: [
      { name: "Priya R.", role: "Stanford GSB AdCom", sub: "MBA Admissions", avatar: pic7, rating: 4.9, reviews: 312, price: "$320/hr" },
      { name: "Samantha L.", role: "HBS '23 · Goldman → VC", sub: "MBA · Finance", avatar: pic1, rating: 4.9, reviews: 184, price: "$240/hr" },
      { name: "John K.", role: "ex-McKinsey EM · Wharton", sub: "Consulting · MBA", avatar: pic3, rating: 4.8, reviews: 240, price: "$280/hr" },
      { name: "Lena W.", role: "HBS '24 · IB → PE", sub: "Finance · MBA", avatar: pic9, rating: 4.8, reviews: 132, price: "$190/hr" },
    ],
    cohort: {
      title: "MBA Essay Bootcamp",
      blurb: "Live cohort — get drafts polished by R1 deadlines.",
      cover: bootcamp2,
      startsIn: "Starts in 4 days",
      seats: "8 seats left",
    },
    posts: [
      { author: "Maya P.", avatar: pic10, time: "2h", headline: "Got into HBS R1 — here's what actually worked", excerpt: "Two years of dreaming, six months on Leland. The single biggest thing was the third essay reframe my coach forced me into…", tag: "Admissions", likes: 412, comments: 56, reposts: 24 },
      { author: "Andre S.", avatar: pic11, time: "5h", headline: "GMAT 760 with full-time job. Sharing the plan.", excerpt: "Spent 90 min/day for 11 weeks. The Leland practice diagnostics caught two whole categories I would've missed…", tag: "GMAT", likes: 188, comments: 32, reposts: 14 },
      { author: "Karen J.", avatar: pic12, time: "yesterday", headline: "Stanford GSB interview tomorrow — wish me luck.", excerpt: "Did three mocks with my Leland expert. Already feels different from my first attempt last cycle…", tag: "Stanford GSB", likes: 246, comments: 71, reposts: 9 },
    ],
  },
  ai: {
    label: "AI Leader",
    live: { title: "AI Builder Live: Shipping with Claude", host: "Marcus R. · AI Lead, OpenAI", avatar: pic5, cover: aiBuilder2, watching: 1287, tag: "Live · AI Builders" },
    experts: [
      { name: "Marcus R.", role: "Staff Eng · OpenAI", sub: "AI · Engineering", avatar: pic5, rating: 4.9, reviews: 422, price: "$300/hr" },
      { name: "David O.", role: "ex-Anthropic eng lead", sub: "AI · Applied", avatar: pic6, rating: 4.8, reviews: 188, price: "$340/hr" },
      { name: "Aisha M.", role: "Partner at Sequoia", sub: "AI · Founders", avatar: pic8, rating: 4.9, reviews: 96, price: "$400/hr" },
      { name: "Lena W.", role: "Founder · ex-OpenAI", sub: "AI · Product", avatar: pic9, rating: 4.8, reviews: 142, price: "$280/hr" },
    ],
    cohort: { title: "AI Builder Bootcamp · 6 weeks", blurb: "Ship a real AI product, end-to-end. Live cohort.", cover: aiBuilder1, startsIn: "Next cohort starts Monday", seats: "12 seats left" },
    posts: [
      { author: "Andre S.", avatar: pic11, time: "1h", headline: "Shipped my first AI agent this week. 30 days of work.", excerpt: "Following the AI Builder Bootcamp framework cohort #4 and I'm honestly stunned at how fast it came together…", tag: "AI Builders", likes: 312, comments: 67, reposts: 41 },
      { author: "Marcus T.", avatar: pic5, time: "4h", headline: "Vibe-coding with Claude is my new normal.", excerpt: "I used to write code 50/50 with AI. Now it's 90/10 — and the work I ship is better. Here's my new prompt workflow…", tag: "AI Builders", likes: 524, comments: 88, reposts: 67 },
      { author: "Jamie L.", avatar: pic9, time: "yesterday", headline: "Got our first $5k MRR on the agent I built in cohort.", excerpt: "Six weeks ago I had an idea. Tonight, paying customers. Still feels surreal. Sharing the dirty details if anyone wants…", tag: "Founders", likes: 612, comments: 142, reposts: 88 },
    ],
  },
  career: {
    label: "Career",
    live: { title: "Cracking the MBB Case in 2026", host: "Sarah C. · ex-McKinsey EM", avatar: pic3, cover: bootcamp1, watching: 412, tag: "Live · Consulting" },
    experts: [
      { name: "John K.", role: "ex-McKinsey EM", sub: "Consulting · MBB", avatar: pic3, rating: 4.9, reviews: 312, price: "$280/hr" },
      { name: "Marcus T.", role: "Staff PM · Google", sub: "Product · Tech", avatar: pic5, rating: 4.9, reviews: 268, price: "$220/hr" },
      { name: "Lena W.", role: "Goldman → KKR", sub: "Finance · PE", avatar: pic1, rating: 4.8, reviews: 154, price: "$300/hr" },
      { name: "Aisha M.", role: "Partner at Sequoia", sub: "VC · Founders", avatar: pic8, rating: 4.9, reviews: 96, price: "$400/hr" },
    ],
    cohort: { title: "Case Interview Bootcamp", blurb: "Live cases with MBB-vetted experts. 4 weeks.", cover: categoryConsulting, startsIn: "Starts in 2 weeks", seats: "10 seats left" },
    posts: [
      { author: "Karen J.", avatar: pic12, time: "3h", headline: "McKinsey offer — happy to share my notes from prep", excerpt: "8 rounds, 4 case interviews, and one near-disaster. My ex-McKinsey coach caught patterns I was blind to…", tag: "Consulting", likes: 312, comments: 67, reposts: 28 },
      { author: "Marcus T.", avatar: pic5, time: "6h", headline: "Just made staff PM at Google. AMA.", excerpt: "From ICPM3 to staff in 22 months. Mostly through writing — sharing the three artifacts that mattered most…", tag: "Product", likes: 488, comments: 102, reposts: 56 },
      { author: "Andre S.", avatar: pic11, time: "yesterday", headline: "Broke into IB from a non-target. Year 1 wrap.", excerpt: "Networked with 60 alums, did 14 superdays, got 3 offers. Brutal but doable. Sharing my outreach scripts…", tag: "Finance", likes: 274, comments: 49, reposts: 31 },
    ],
  },
  life: {
    label: "Life",
    live: { title: "Building a Personal Brand in 2026", host: "Aisha M. · creator + investor", avatar: pic8, cover: lelandPlus1, watching: 184, tag: "Live · Life" },
    experts: [
      { name: "Aisha M.", role: "Investor · Creator", sub: "Brand · Storytelling", avatar: pic8, rating: 4.9, reviews: 142, price: "$240/hr" },
      { name: "Karen J.", role: "Coach · ex-McKinsey", sub: "Life · Career", avatar: pic7, rating: 4.9, reviews: 218, price: "$200/hr" },
      { name: "David O.", role: "Founder · Writer", sub: "Writing · Brand", avatar: pic6, rating: 4.8, reviews: 88, price: "$180/hr" },
      { name: "Lena W.", role: "Author · Operator", sub: "Life · Brand", avatar: pic9, rating: 4.9, reviews: 112, price: "$220/hr" },
    ],
    cohort: { title: "Own Your Story · Live workshop", blurb: "Two-week intensive. Find your voice. Ship publicly.", cover: lelandPlus1, startsIn: "Starts in 5 days", seats: "14 seats left" },
    posts: [
      { author: "Maya P.", avatar: pic10, time: "2h", headline: "Quit my job. Moved cities. No regrets.", excerpt: "Six months ago this would've been unthinkable. The Leland life cohort gave me a framework I didn't know I needed…", tag: "Life", likes: 522, comments: 84, reposts: 41 },
      { author: "Andre S.", avatar: pic11, time: "5h", headline: "Personal brand year-one report.", excerpt: "Started posting daily 11 months ago. 0 → 38k followers. Three product launches. The numbers that mattered most…", tag: "Brand", likes: 412, comments: 67, reposts: 92 },
      { author: "Karen J.", avatar: pic12, time: "yesterday", headline: "Found a mentor that actually changed my life.", excerpt: "Eight months of weekly 30-min calls. The shift wasn't tactical — it was psychological…", tag: "Mentorship", likes: 198, comments: 44, reposts: 18 },
    ],
  },
  general: {
    label: "Your plan",
    live: { title: "Your Ambitious Year: A Live Q&A", host: "The Leland Team", avatar: pic1, cover: bootcamp1, watching: 528, tag: "Live · Leland" },
    experts: [
      { name: "Samantha L.", role: "Goldman → HBS → VC", sub: "MBA · Finance", avatar: pic1, rating: 4.9, reviews: 184, price: "$240/hr" },
      { name: "Marcus R.", role: "Staff Eng · OpenAI", sub: "AI · Engineering", avatar: pic5, rating: 4.9, reviews: 422, price: "$300/hr" },
      { name: "Priya R.", role: "Stanford GSB AdCom", sub: "MBA Admissions", avatar: pic7, rating: 4.9, reviews: 312, price: "$320/hr" },
      { name: "John K.", role: "ex-McKinsey EM", sub: "Consulting · MBB", avatar: pic3, rating: 4.9, reviews: 312, price: "$280/hr" },
    ],
    cohort: { title: "Find your path · Leland Compass", blurb: "20-minute live session that maps your next 90 days.", cover: categoryPE, startsIn: "Starts every Tuesday", seats: "Open enrollment" },
    posts: [
      { author: "Maya P.", avatar: pic10, time: "2h", headline: "Year-one Leland: what changed for me.", excerpt: "12 months ago I felt stuck. Today I have direction, a coach, and three concrete projects shipping…", tag: "Leland", likes: 412, comments: 56, reposts: 24 },
      { author: "Marcus T.", avatar: pic5, time: "5h", headline: "The Leland Compass quiz changed my plan.", excerpt: "I came in thinking 'MBA.' I left thinking 'AI product builder.' Most useful 20 minutes I've spent this year…", tag: "Compass", likes: 224, comments: 38, reposts: 12 },
      { author: "Karen J.", avatar: pic12, time: "yesterday", headline: "How I picked my first expert here.", excerpt: "Three calls with three different experts. The one I picked wasn't the most senior — they were the most direct…", tag: "Experts", likes: 188, comments: 41, reposts: 16 },
    ],
  },
};

function categoryFromAnswers(a: Answers): Category {
  if (a.goal === GOAL.school) return "admissions";
  if (a.goal === GOAL.test) return "admissions";
  if (a.goal === GOAL.career) {
    if (Array.isArray(a.careers)) {
      const labels = a.careers.map((r) => labelByChoiceRef("careers", r));
      if (labels.some((l) => l.toLowerCase().includes("ai"))) return "ai";
    }
    return "career";
  }
  return "general";
}

/* ─────────────── chat types ─────────────── */

type Msg = { role: "ai" | "user"; text: string };

/* ─────────────── main page ─────────────── */

export default function IncredibleOnboarding() {
  const [searchParams] = useSearchParams();
  const initialGoal = (searchParams.get("q") || "").trim();

  useEffect(() => {
    document.title = "Leland — Plan your path";
  }, []);

  const prefilled = useMemo(() => preFill(initialGoal), [initialGoal]);

  const [answers, setAnswers] = useState<Answers>(prefilled);
  const [currentRef, setCurrentRef] = useState<string | null>(() =>
    firstUnansweredRef(prefilled),
  );
  const [pending, setPending] = useState<string[]>([]); // multi-select staging
  const [input, setInput] = useState("");
  const [floatingMinimized, setFloatingMinimized] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  // Build initial chat
  const [messages, setMessages] = useState<Msg[]>(() => {
    const msgs: Msg[] = [];
    if (initialGoal) msgs.push({ role: "user", text: initialGoal });

    // Greeting based on what we pre-filled
    if (prefilled.goal === GOAL.school && prefilled.schools === SCHOOLS.mba) {
      msgs.push({
        role: "ai",
        text: "Awesome — aiming for a top MBA. I've already noted that. A few quick questions to map the plan.",
      });
    } else if (prefilled.goal === GOAL.school) {
      msgs.push({
        role: "ai",
        text: "Great — getting into school is huge. Let me lock in a few specifics.",
      });
    } else if (prefilled.goal === GOAL.test) {
      msgs.push({
        role: "ai",
        text: "Got it — let's get you crushing that test.",
      });
    } else if (prefilled.goal === GOAL.career) {
      msgs.push({
        role: "ai",
        text: "Got it — let's get you the role you actually want.",
      });
    } else {
      msgs.push({
        role: "ai",
        text: "Hey — I'm Leland AI. I'll map a plan with you in 6-8 quick questions.",
      });
    }

    // Show first question
    const firstRef = firstUnansweredRef(prefilled);
    const firstField = firstRef ? field(firstRef) : null;
    if (firstField) {
      msgs.push({ role: "ai", text: firstField.title });
      if (firstField.description)
        msgs.push({ role: "ai", text: firstField.description });
    }
    return msgs;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const floatingScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [scrollRef, floatingScrollRef].forEach((r) => {
      if (!r.current) return;
      r.current.scrollTo({
        top: r.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages]);

  const currentField = currentRef ? field(currentRef) : null;
  const isDone = currentRef === null;

  const totalQs = useMemo(() => expectedFlowLength(answers), [answers]);
  const answeredCount = useMemo(
    () => Object.keys(answers).filter((k) => field(k)).length,
    [answers],
  );

  /** Commit an answer (choice ref(s) or text) and walk the flow until we hit
   *  the next interactive question. */
  const submitAnswer = (raw: AnswerValue) => {
    if (!currentRef || !currentField) return;

    // Multi-select with no picks: ignore
    if (Array.isArray(raw) && raw.length === 0) return;

    // For single-select fields, store as scalar
    const value: AnswerValue =
      Array.isArray(raw) && !currentField.allowMultiple ? raw[0] : raw;

    const newAnswers = { ...answers, [currentRef]: value };

    const userLabel = labelFor(currentRef, value);
    const newMsgs: Msg[] = [...messages, { role: "user", text: userLabel }];

    // Advance through statement / phone / calendly fields
    let next: string | null = nextRef(currentRef, newAnswers);
    while (next) {
      const f = field(next);
      if (!f) {
        next = null;
        break;
      }
      if (f.type === "statement") {
        newMsgs.push({ role: "ai", text: f.title });
        next = nextRef(next, newAnswers);
        continue;
      }
      if (f.type === "calendly" || f.type === "phone_number") {
        // Skip for prototype — just note it
        next = nextRef(next, newAnswers);
        continue;
      }
      // Interactive — show the question and stop
      newMsgs.push({ role: "ai", text: f.title });
      if (f.description) newMsgs.push({ role: "ai", text: f.description });
      break;
    }

    if (next === null) {
      newMsgs.push({
        role: "ai",
        text: "Perfect — I've matched experts that fit your plan. Take a look on the right.",
      });
      newMsgs.push({
        role: "ai",
        text: "I'll be in the corner if you need me.",
      });
      setFloatingMinimized(false);
    }

    setAnswers(newAnswers);
    setMessages(newMsgs);
    setCurrentRef(next);
    setPending([]);
    setInput("");
  };

  const onTextSubmit = (text: string) => {
    if (!text.trim()) return;
    if (!currentField) {
      // Done — just acknowledge follow-ups
      setMessages((prev) => [
        ...prev,
        { role: "user", text },
        {
          role: "ai",
          text: "Got it — I'll bring that up when you start with your expert.",
        },
      ]);
      setInput("");
      return;
    }
    if (
      currentField.type === "short_text" ||
      currentField.type === "long_text" ||
      currentField.type === "email" ||
      currentField.type === "phone_number"
    ) {
      submitAnswer(text);
      return;
    }
    // For choice questions, free-text isn't a real answer; just push a clarifying note
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "ai",
        text: "Got it — picking one of the options below will lock that in for your plan.",
      },
    ]);
    setInput("");
  };

  const category = useMemo(() => categoryFromAnswers(answers), [answers]);
  const content = CATEGORY_CONTENT[category];

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-gray-dark">
      <TopNav
        category={content.label}
        progress={
          totalQs > 0
            ? Math.min(answeredCount, totalQs) + "/" + totalQs
            : ""
        }
        done={isDone}
      />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-6 md:px-8 md:py-8">
        {/* Header row: goal pill + helper tip */}
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          {initialGoal && (
            <GoalPill category={content.label} goal={initialGoal} />
          )}
          <HelperTip />
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
          <section className="flex min-w-0 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              {!isDone ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatCard
                    messages={messages}
                    currentField={currentField ?? null}
                    pending={pending}
                    setPending={setPending}
                    onSubmit={submitAnswer}
                    input={input}
                    setInput={setInput}
                    onTextSubmit={onTextSubmit}
                    scrollRef={scrollRef}
                    progressLabel={`Question ${Math.min(answeredCount + 1, totalQs)} of ${totalQs}`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  <MatchedPlanPanel
                    category={content.label}
                    answers={answers}
                    experts={content.experts}
                    showRawJson={showRawJson}
                    setShowRawJson={setShowRawJson}
                    onMessage={() => setFloatingMinimized(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="flex flex-col gap-4">
            <RightNowCard live={content.live} />
            <ExpertsCard
              experts={content.experts.slice(0, 3)}
              category={content.label}
            />
            <CohortCard cohort={content.cohort} />
          </aside>
        </div>

        <SignUpBanner />
        <FeedPreview posts={content.posts} category={content.label} />
      </main>

      <AnimatePresence>
        {isDone && (
          <FloatingChat
            messages={messages}
            input={input}
            setInput={setInput}
            onTextSubmit={onTextSubmit}
            minimized={floatingMinimized}
            onToggle={() => setFloatingMinimized((m) => !m)}
            scrollRef={floatingScrollRef}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ─────────────── header pieces ─────────────── */

function TopNav({
  category,
  progress,
  done,
}: {
  category: string;
  progress: string;
  done: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-stroke bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={lelandCompass} alt="" className="h-6 w-6" />
          <img src={lelandLogo} alt="Leland" className="h-[18px]" />
        </Link>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-light">
            {category}
          </span>
          {!done && progress && (
            <>
              <span className="text-gray-xlight">·</span>
              <span className="text-[12px] text-gray-light">{progress}</span>
            </>
          )}
        </div>
        <Link
          to="/incredible-home-page-bu"
          className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-light hover:text-gray-dark"
        >
          <X size={14} />
          Exit
        </Link>
      </div>
    </header>
  );
}

function GoalPill({ category, goal }: { category: string; goal: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/25 bg-primary-xlight px-3 py-1.5 text-[12px] font-semibold text-dark-green">
      <Sparkles size={13} className="shrink-0 text-primary" />
      <span className="shrink-0">{category}</span>
      <span className="text-primary/50">·</span>
      <span className="truncate font-medium text-dark-green/85">
        &ldquo;{goal}&rdquo;
      </span>
    </div>
  );
}

function HelperTip() {
  return (
    <div className="inline-flex items-center gap-1.5 text-[12.5px] text-gray-light">
      <Lightbulb size={14} className="text-yellow" />
      <span>
        The more specifics you share, the sharper Leland gets at matching you.
      </span>
    </div>
  );
}

/* ─────────────── chat card (inline) ─────────────── */

function ChatCard({
  messages,
  currentField,
  pending,
  setPending,
  onSubmit,
  input,
  setInput,
  onTextSubmit,
  scrollRef,
  progressLabel,
}: {
  messages: Msg[];
  currentField: FormField | null;
  pending: string[];
  setPending: (s: string[]) => void;
  onSubmit: (v: AnswerValue) => void;
  input: string;
  setInput: (s: string) => void;
  onTextSubmit: (text: string) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  progressLabel: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-stroke px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-dark-green to-primary">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-tight text-gray-dark">
              Leland AI
            </p>
            <p className="text-[11px] text-gray-light">Mapping your plan</p>
          </div>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-light">
          {progressLabel}
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-6"
        style={{ height: 340 }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}
        </AnimatePresence>
      </div>

      {/* Quick replies */}
      {currentField && currentField.choices.length > 0 && (
        <div className="border-t border-gray-stroke/70 px-4 py-3 md:px-6">
          <QuickReplies
            field={currentField}
            pending={pending}
            setPending={setPending}
            onSubmit={onSubmit}
          />
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onTextSubmit(input);
        }}
        className="flex items-center gap-2 border-t border-gray-stroke bg-white px-4 py-3 md:px-6"
      >
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-stroke bg-gray-hover px-3 py-2 transition-colors focus-within:border-primary/50 focus-within:bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentField
                ? "Or type a reply…"
                : "Anything else I should know?"
            }
            className="flex-1 bg-transparent text-[14px] text-gray-dark placeholder:text-gray-xlight focus:outline-none"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            rounded="rounded-lg"
            className="!p-2"
            disabled={!input.trim()}
            aria-label="Send"
          >
            <Send size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}

function QuickReplies({
  field: f,
  pending,
  setPending,
  onSubmit,
}: {
  field: FormField;
  pending: string[];
  setPending: (s: string[]) => void;
  onSubmit: (v: AnswerValue) => void;
}) {
  const isMulti = f.allowMultiple;

  const toggle = (ref: string) => {
    if (isMulti) {
      setPending(
        pending.includes(ref)
          ? pending.filter((r) => r !== ref)
          : [...pending, ref],
      );
    } else {
      onSubmit([ref]);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="space-y-3"
    >
      <div className="flex flex-wrap gap-2">
        {f.choices.map((c) => {
          const sel = pending.includes(c.ref);
          return (
            <button
              key={c.ref}
              onClick={() => toggle(c.ref)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                isMulti && sel
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-primary/30 bg-primary-xlight text-dark-green hover:border-primary/55 hover:bg-primary/15"
              }`}
            >
              {isMulti && sel && <CheckCircle2 size={12} />}
              {c.label}
            </button>
          );
        })}
      </div>
      {isMulti && (
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-gray-light">
            {pending.length} selected{f.required && pending.length === 0 ? " · required" : ""}
          </span>
          <Button
            size="sm"
            variant="primary"
            rounded="rounded-lg"
            disabled={pending.length === 0}
            onClick={() => onSubmit(pending)}
          >
            Done
            <ArrowRight size={12} />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "ai") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex items-start gap-2.5"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-dark-green to-primary">
          <Sparkles size={13} className="text-white" />
        </div>
        <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-gray-hover px-4 py-2.5 text-[14.5px] leading-snug text-gray-dark">
          {msg.text}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex justify-end"
    >
      <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-[14.5px] leading-snug text-white">
        {msg.text}
      </div>
    </motion.div>
  );
}

/* ─────────────── matched plan panel ─────────────── */

function MatchedPlanPanel({
  category,
  answers,
  experts,
  showRawJson,
  setShowRawJson,
  onMessage,
}: {
  category: string;
  answers: Answers;
  experts: Expert[];
  showRawJson: boolean;
  setShowRawJson: (v: boolean) => void;
  onMessage: () => void;
}) {
  const response = useMemo(() => buildTypeformResponse(answers), [answers]);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-card">
      <div className="border-b border-gray-stroke bg-gradient-to-r from-primary-xlight to-white px-5 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dark-green">
              Your plan · {category}
            </p>
            <h2 className="mt-1 text-[20px] font-semibold leading-tight text-gray-dark md:text-[22px]">
              Matched experts for your goal
            </h2>
          </div>
          <button
            onClick={onMessage}
            className="hidden items-center gap-1.5 rounded-full border border-gray-stroke bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-dark transition-colors hover:border-primary/40 hover:text-dark-green sm:inline-flex"
          >
            <MessageCircle size={13} />
            Message Leland AI
          </button>
        </div>
        <AnswerSummary answers={answers} />
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 md:gap-4 md:p-5">
        {experts.slice(0, 4).map((e) => (
          <MatchedExpertCard key={e.name} expert={e} />
        ))}
      </div>

      <div className="border-t border-gray-stroke px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-dark-green"
          >
            See all 1,800+ experts in {category}
            <ArrowRight size={13} />
          </Link>
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-light hover:text-gray-dark"
          >
            <Code size={12} />
            {showRawJson ? "Hide" : "View"} typeform response
          </button>
        </div>

        <AnimatePresence>
          {showRawJson && (
            <motion.pre
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-x-auto rounded-xl border border-gray-stroke bg-[#0c1f17] p-3 text-[11px] leading-snug text-[#9ff2c8]"
            >
              {JSON.stringify(response, null, 2)}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AnswerSummary({ answers }: { answers: Answers }) {
  const rows: Array<{ key: string; label: string; value: string }> = [];
  for (const [ref, value] of Object.entries(answers)) {
    const f = field(ref);
    if (!f) continue;
    rows.push({
      key: ref,
      label: shortTitle(f.title),
      value: labelFor(ref, value),
    });
  }
  if (rows.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {rows.map((r) => (
        <span
          key={r.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-dark-green"
        >
          <CheckCircle2 size={11} className="text-primary" />
          <span className="text-gray-light">{r.label}:</span>
          <span className="max-w-[180px] truncate">{r.value}</span>
        </span>
      ))}
    </div>
  );
}

function shortTitle(t: string): string {
  // Typeform titles can be long sentences — trim to a topic label
  const trimmed = t
    .replace(/\?$/, "")
    .replace(/^Which |^What |^Where |^When |^How /, "")
    .replace(/\s+\(.+\)\s*/g, " ");
  const short = trimmed.split(/[—,!.]/)[0].trim();
  return short.charAt(0).toUpperCase() + short.slice(1);
}

function MatchedExpertCard({ expert }: { expert: Expert }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-stroke bg-white p-3 transition-shadow hover:shadow-card">
      <img
        src={expert.avatar}
        alt=""
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-gray-dark">
              {expert.name}
            </p>
            <p className="truncate text-[12px] text-gray-light">{expert.role}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-hover px-1.5 py-1 text-[11px] font-semibold text-gray-dark">
            <Star size={11} className="fill-yellow text-yellow" />
            {expert.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-gray-light">
          {expert.sub}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            rounded="rounded-lg"
            className="!py-1.5 !text-[12px]"
          >
            Book a call
          </Button>
          <span className="text-[12px] font-semibold text-gray-dark">
            {expert.price}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── right sidebar cards ─────────────── */

function RightNowCard({ live }: { live: LiveSession }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-card">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-light">
            Right now on Leland
          </span>
        </div>
        <Video size={13} className="text-gray-light" />
      </div>
      <div className="relative aspect-[16/10]">
        <img src={live.cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {live.watching.toLocaleString()} watching
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-[10.5px] uppercase tracking-wider text-white/80">
            {live.tag}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[14px] font-semibold leading-tight text-white">
            {live.title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={live.avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
          <p className="text-[12px] text-gray-light">{live.host}</p>
        </div>
        <Button size="sm" variant="primary" rounded="rounded-lg">
          Join
        </Button>
      </div>
    </div>
  );
}

function ExpertsCard({
  experts,
  category,
}: {
  experts: Expert[];
  category: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-stroke bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-light">
          Top experts · {category}
        </p>
        <Link
          to="/browse"
          className="text-[11.5px] font-semibold text-primary hover:text-dark-green"
        >
          See all
        </Link>
      </div>
      <ul className="space-y-2.5">
        {experts.map((e) => (
          <li key={e.name} className="flex items-center gap-3">
            <img
              src={e.avatar}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-gray-dark">
                {e.name}
              </p>
              <p className="truncate text-[12px] text-gray-light">{e.role}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-hover px-1.5 py-1 text-[11px] font-semibold text-gray-dark">
              <Star size={11} className="fill-yellow text-yellow" />
              {e.rating.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CohortCard({ cohort }: { cohort: Cohort }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-card">
      <div className="relative aspect-[16/9]">
        <img
          src={cohort.cover}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-dark">
          <Calendar size={11} />
          Cohort
        </span>
      </div>
      <div className="p-4">
        <p className="text-[14px] font-semibold leading-tight text-gray-dark">
          {cohort.title}
        </p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-gray-light">
          {cohort.blurb}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11.5px] text-gray-light">
          <span>{cohort.startsIn}</span>
          <span className="font-semibold text-dark-green">{cohort.seats}</span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="mt-3 w-full"
          rounded="rounded-lg"
        >
          Save my seat
          <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────── sign-up banner ─────────────── */

function SignUpBanner() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section
      className="mt-8 flex flex-col gap-4 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-r from-primary-xlight via-white to-primary-xlight/60 p-5 shadow-card md:flex-row md:items-center md:gap-6 md:p-6"
      aria-label="Save your plan"
    >
      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dark-green to-primary text-white md:flex">
        <Mail size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15.5px] font-semibold text-gray-dark md:text-[16px]">
          Save your plan and matched experts.
        </p>
        <p className="mt-0.5 text-[13px] text-gray-light">
          Sign up — we&rsquo;ll sync your plan, expert intros, and live sessions
          to your inbox.
        </p>
      </div>
      {sent ? (
        <div className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-dark-green">
          <CheckCircle2 size={15} className="text-primary" />
          Saved — check your inbox.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setSent(true);
          }}
          className="flex w-full items-center gap-2 md:w-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="min-w-0 flex-1 rounded-xl border border-gray-stroke bg-white px-3 py-2.5 text-[14px] text-gray-dark placeholder:text-gray-xlight focus:border-primary/55 focus:outline-none md:w-[260px]"
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
            rounded="rounded-xl"
            disabled={!email.trim()}
          >
            Create account
            <ArrowRight size={14} />
          </Button>
        </form>
      )}
    </section>
  );
}

/* ─────────────── feed preview ─────────────── */

function FeedPreview({
  posts,
  category,
}: {
  posts: FeedPost[];
  category: string;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[18px] font-semibold text-gray-dark md:text-[20px]">
          What people in {category} are talking about
        </h2>
        <Link
          to="/"
          className="text-[12.5px] font-semibold text-gray-light hover:text-gray-dark"
        >
          See full feed →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {posts.map((p) => (
          <FeedPostCard key={p.headline} post={p} />
        ))}
      </div>
    </section>
  );
}

function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-stroke bg-white p-4 shadow-card transition-shadow hover:shadow-md md:p-5">
      <div className="flex items-center gap-2.5">
        <img
          src={post.avatar}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-gray-dark">
            {post.author}
          </p>
          <p className="text-[11.5px] text-gray-light">
            {post.tag} · {post.time}
          </p>
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-dark">
        {post.headline}
      </h3>
      <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-snug text-gray-light">
        {post.excerpt}
      </p>
      <div className="mt-3 flex items-center gap-4 text-[12px] text-gray-light">
        <span className="inline-flex items-center gap-1">
          <Heart size={12} />
          {post.likes}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare size={12} />
          {post.comments}
        </span>
        <span className="inline-flex items-center gap-1">
          <Repeat2 size={12} />
          {post.reposts}
        </span>
      </div>
    </article>
  );
}

/* ─────────────── floating chat (post-done) ─────────────── */

function FloatingChat({
  messages,
  input,
  setInput,
  onTextSubmit,
  minimized,
  onToggle,
  scrollRef,
}: {
  messages: Msg[];
  input: string;
  setInput: (s: string) => void;
  onTextSubmit: (text: string) => void;
  minimized: boolean;
  onToggle: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="fixed bottom-5 right-5 z-50 w-[min(94vw,360px)] overflow-hidden rounded-2xl border border-gray-stroke bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] md:bottom-6 md:right-6"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 border-b border-gray-stroke bg-gradient-to-r from-dark-green to-primary px-4 py-3 text-white"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles size={13} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[13.5px] font-semibold leading-tight">
              Leland AI
            </p>
            <p className="text-[11px] text-white/75">
              {minimized ? "Click to continue" : "Here when you need me"}
            </p>
          </div>
        </div>
        <motion.span
          animate={{ rotate: minimized ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex items-center"
        >
          <ChevronDown size={16} className="text-white" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              ref={scrollRef}
              className="space-y-3 overflow-y-auto bg-white px-4 py-4"
              style={{ height: 260 }}
            >
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <MessageBubble key={i} msg={m} />
                ))}
              </AnimatePresence>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onTextSubmit(input);
              }}
              className="flex items-center gap-2 border-t border-gray-stroke bg-white px-3 py-2.5"
            >
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-gray-stroke bg-gray-hover px-2.5 py-1.5 transition-colors focus-within:border-primary/55 focus-within:bg-white">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="min-w-0 flex-1 bg-transparent text-[13.5px] text-gray-dark placeholder:text-gray-xlight focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  rounded="rounded-md"
                  className="!p-1.5"
                  disabled={!input.trim()}
                  aria-label="Send"
                >
                  <Send size={12} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────── footer ─────────────── */

function Footer() {
  return (
    <footer className="border-t border-gray-stroke bg-white">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center justify-between px-5 text-[11.5px] text-gray-light md:px-8">
        <span>© 2026 Leland</span>
        <span>Need help? Message a human.</span>
      </div>
    </footer>
  );
}
