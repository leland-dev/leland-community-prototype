/* ─────────────────────────────────────────────────────────────────────────
 * flowConfig — drives the entire post-tap member flow (screens 3–8).
 *
 * Keyed by bucket (the Screen-1 choice). One entry defines: the reassurance
 * stat, the category taxonomy, the target step (schools / companies / ai-goal),
 * coach counts, and the cohort-naming function.
 * ──────────────────────────────────────────────────────────────────────── */

import type { Branch } from "./data";

export type TargetMode = "schools" | "companies" | "ai-goal";

export type FlowAnswers = {
  categories: string[]; // screen 4 (multi-select); [0] is the primary goal
  targets: string[]; // schools / companies (max 3) or a single ai-goal; [] = exploring
};

export type Reassurance = {
  text: string;
  emphasis: string; // substring rendered in the brand color w/ a scale settle
  subline?: string;
};

export type BucketConfig = {
  branch: Branch;
  reassurance: Reassurance;
  categoryQuestion: string;
  categories: string[]; // full taxonomy; first CATEGORY_PEEK shown, rest behind "More…"
  targetQuestion: string;
  targetMode: TargetMode;
  targetSearchPlaceholder: string;
  /** schools depend on category; companies / ai-goals are flat */
  targetsByCategory?: Record<string, string[]>;
  targets?: string[];
  cohortName: (a: FlowAnswers) => string;
};

export const CATEGORY_PEEK = 9;
export const MAX_TARGETS = 3;
export const EXPLORING = "__exploring__";

/* ─────────────── schools by category (top targets + fallback) ─────────────── */

const TOP_SCHOOLS_FALLBACK = [
  "Harvard",
  "Stanford",
  "MIT",
  "Yale",
  "Princeton",
  "Columbia",
  "UC Berkeley",
  "UCLA",
];

const SCHOOLS_BY_CATEGORY: Record<string, string[]> = {
  MBA: ["Harvard", "Stanford", "Wharton", "Kellogg", "Booth", "MIT Sloan", "Columbia"],
  "Law School": ["Yale", "Stanford", "Harvard", "UChicago", "NYU", "Columbia"],
  "Medical School": ["Harvard", "Johns Hopkins", "Stanford", "UCSF", "Penn", "Columbia"],
  College: ["Harvard", "Stanford", "MIT", "Yale", "Princeton", "Brown", "Duke"],
};

/* full school search list (long tail for type-ahead) */
export const ALL_SCHOOLS = [
  "Harvard", "Stanford", "MIT", "Wharton", "Kellogg", "Booth", "MIT Sloan", "Columbia",
  "Yale", "Princeton", "Brown", "Duke", "Cornell", "Dartmouth", "UPenn",
  "UChicago", "NYU", "Northwestern", "UC Berkeley", "UCLA", "USC", "Michigan",
  "Johns Hopkins", "UCSF", "Georgetown", "Vanderbilt", "Rice", "Emory",
  "Carnegie Mellon", "Caltech", "UT Austin", "UNC", "UVA", "Notre Dame",
  "BYU", "Boston University", "Georgia Tech", "Purdue", "Ohio State",
  "University of Washington", "Wisconsin", "Texas A&M", "Indiana", "Tufts",
];

/* ─────────────── companies (career) ─────────────── */

const COMPANIES = [
  "McKinsey", "Bain", "BCG", "Google", "Meta", "Goldman Sachs",
  "Coinbase", "Atlassian", "Amazon", "Stripe",
];

export const ALL_COMPANIES = [
  ...COMPANIES, "Deloitte", "Accenture", "EY", "Kearney", "L.E.K.", "Morgan Stanley",
  "JP Morgan", "KKR", "Blackstone", "Sequoia", "a16z", "Microsoft", "Apple",
  "Netflix", "Uber", "Airbnb", "Salesforce", "Nvidia", "OpenAI", "Anthropic",
];

/* ─────────────── ai goals (single-select) ─────────────── */

const AI_GOALS = [
  "Automate my work",
  "Build a product",
  "Land an AI job",
  "Level up my team",
  "Just exploring",
];

/* ─────────────── coach counts per category ─────────────── */

const COACH_COUNTS: Record<string, number> = {
  MBA: 350,
  College: 260,
  "Master's Programs": 190,
  "Medical School": 210,
  "Law School": 180,
  "PhD Programs": 90,
  "Management Consulting": 200,
  "Product Management": 240,
  "Investment Banking": 170,
  "Software Engineering": 300,
  "Private Equity": 110,
  "Venture Capital": 80,
  "Build with AI (my current role)": 120,
  "Break Into AI Careers": 140,
  "AI & ML Engineering": 95,
};

export function coachCountFor(category?: string): number {
  if (category && COACH_COUNTS[category]) return COACH_COUNTS[category];
  return 150;
}

/* ─────────────── cohort naming helpers ─────────────── */

const SCHOOL_ABBR: Record<string, string> = {
  Harvard: "HBS",
  Stanford: "GSB",
  Wharton: "Wharton",
  "MIT Sloan": "Sloan",
};

function schoolCohort(a: FlowAnswers): string {
  const cat = a.categories[0];
  const real = a.targets.filter((t) => t !== EXPLORING);
  if (real.length === 1) {
    const t = real[0];
    // MBA abbreviations read nicely as a cohort name
    const label = cat === "MBA" && SCHOOL_ABBR[t] ? SCHOOL_ABBR[t] : t;
    return `${label} Hopefuls`;
  }
  if (real.length > 1) return `${cat ?? "Future"} Hopefuls`;
  return `Future ${cat ?? "Applicants"}`;
}

function careerCohort(a: FlowAnswers): string {
  const cat = a.categories[0];
  const real = a.targets.filter((t) => t !== EXPLORING);
  if (real.length === 1) return `Break into ${real[0]}`;
  if (real.length > 1) return `${cat ?? "Career"} Recruiting`;
  return cat ?? "Career Switchers";
}

/* ─────────────── member count (deterministic pseudo) ─────────────── */

export function memberCountFor(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 120 + (h % 260); // 120–379
}

/* ─────────────── bucket configs ─────────────── */

export const BUCKETS: Record<Branch, BucketConfig> = {
  "get-into-school": {
    branch: "get-into-school",
    reassurance: {
      text: "Students who prep with a Leland coach get into top schools at 3x the rate.",
      emphasis: "3x",
      subline: "Coached by admissions insiders from HBS, Stanford GSB, Yale, and more.",
    },
    categoryQuestion: "What are you working toward?",
    categories: [
      "MBA", "College", "Master's Programs", "Medical School", "Law School",
      "PhD Programs", "Dental School", "Scholarships & Fellowships", "PA School",
      "Nursing School",
    ],
    targetQuestion: "Which school is the dream?",
    targetMode: "schools",
    targetSearchPlaceholder: "Search any school",
    targetsByCategory: SCHOOLS_BY_CATEGORY,
    cohortName: schoolCohort,
  },
  "grow-career": {
    branch: "grow-career",
    reassurance: {
      text: "When Kellogg partnered with Leland, students saw a 74% increase in job offers.",
      emphasis: "74%",
    },
    categoryQuestion: "What are you working toward?",
    categories: [
      "Management Consulting", "Product Management", "Investment Banking",
      "Software Engineering", "Private Equity", "Venture Capital",
      "Executive Coaching", "Career Coaching", "Public Speaking",
    ],
    targetQuestion: "Where do you want to land?",
    targetMode: "companies",
    targetSearchPlaceholder: "Search any company",
    targets: COMPANIES,
    cohortName: careerCohort,
  },
  "build-with-ai": {
    branch: "build-with-ai",
    reassurance: {
      text: "AI Builder grads save 10+ hours every week — by building tools that do the work for them.",
      emphasis: "10+ hours",
      subline: "500+ trained AI experts — trusted by teams at Google, JP Morgan, and Bain.",
    },
    categoryQuestion: "What are you working toward?",
    categories: [
      "Build with AI (my current role)", "Break Into AI Careers",
      "AI for Product Development", "AI & ML Engineering",
      "AI for Sales & Marketing", "AI for Finance", "AI for Data & Analytics",
    ],
    targetQuestion: "What do you want to build?",
    targetMode: "ai-goal",
    targetSearchPlaceholder: "",
    targets: AI_GOALS,
    cohortName: () => "AI Builders",
  },
};

/** Target chips for the current answers. */
export function targetsFor(cfg: BucketConfig, category?: string): string[] {
  if (cfg.targetMode === "schools") {
    return (category && cfg.targetsByCategory?.[category]) || TOP_SCHOOLS_FALLBACK;
  }
  return cfg.targets ?? [];
}

/** Full searchable list for type-ahead (schools / companies). */
export function searchListFor(cfg: BucketConfig): string[] {
  if (cfg.targetMode === "schools") return ALL_SCHOOLS;
  if (cfg.targetMode === "companies") return ALL_COMPANIES;
  return [];
}
