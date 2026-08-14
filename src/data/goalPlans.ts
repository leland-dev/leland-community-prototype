// Category taxonomy, per-type questions, and starter-plan generation for the
// new-goal flow (screen 4 in design_handoff_goal_dashboard/README.md).
//
// PLACEHOLDER TAXONOMY: the category families below are the invented set from
// the design prototype (~60 entries). Production has 19 school / 142 career /
// 29 test categories — swap FAMILIES for the real taxonomy and the counts on
// the goal-type tiles recompute from it automatically.

import type { GoalType } from "./goals";

export type Family = { name: string; items: string[] };

export const FAMILIES: Record<GoalType, Family[]> = {
  ai: [
    { name: "Foundations", items: ["AI Fundamentals", "Prompt Engineering", "How Models Work", "AI Risk and Judgment"] },
    { name: "Building", items: ["Building with Agents", "No-Code AI Tools", "AI App Development", "Working with Your Own Data", "Fine-Tuning"] },
    { name: "In your job", items: ["AI for Product Managers", "AI for Marketers", "AI for Analysts", "AI for Engineers", "AI for Recruiters", "AI for Founders"] },
    { name: "Leading it", items: ["Team AI Adoption", "AI Policy and Guardrails", "Bringing Your Team Along"] },
    { name: "Career moves", items: ["Breaking into AI Roles", "AI Portfolio", "AI Certifications"] },
  ],
  career: [
    { name: "Consulting", items: ["Management Consulting", "Strategy Consulting", "Operations Consulting", "Boutique Consulting", "Case Interview Prep"] },
    { name: "Finance", items: ["Investment Banking", "Private Equity", "Venture Capital", "Hedge Funds", "Corporate Finance", "Equity Research", "Sales and Trading", "Financial Modeling"] },
    { name: "Tech", items: ["Product Management", "Software Engineering", "Data Science", "Machine Learning", "Engineering Management", "Technical Program Management", "UX Design", "DevOps"] },
    { name: "Leadership", items: ["Leadership Development", "Executive Presence", "First-Time Manager", "Managing Managers", "Difficult Conversations", "Team Building"] },
    { name: "Marketing", items: ["Brand Marketing", "Growth Marketing", "Product Marketing", "Content Strategy", "SEO", "Marketing Analytics"] },
    { name: "Job search", items: ["Resume Review", "LinkedIn Optimization", "Interview Prep", "Salary Negotiation", "Networking", "Career Change", "Job Search Strategy"] },
    { name: "Healthcare", items: ["Healthcare Administration", "Nursing Leadership", "Biotech", "Pharma Commercial", "Medical Practice"] },
    { name: "Law", items: ["Big Law", "In-House Counsel", "Legal Recruiting", "Clerkships"] },
    { name: "Founders", items: ["Fundraising", "Startup Strategy", "Go-to-Market", "Pitch Deck Review", "Founder Advising"] },
    { name: "Public sector", items: ["Public Policy", "Nonprofit Leadership", "Federal Careers", "International Development"] },
    { name: "AI at work", items: ["AI for Product Managers", "AI for Marketers", "AI for Analysts", "Breaking into AI Roles"] },
  ],
  school: [
    { name: "Business school", items: ["MBA", "Deferred MBA", "Executive MBA", "Business Analytics", "Master's in Management"] },
    { name: "Undergrad", items: ["College", "Undergrad Transfer", "BS/MD Programs", "Ivy League Admissions"] },
    { name: "Law", items: ["Law School", "LLM Programs"] },
    { name: "Medical", items: ["Medical School", "Dental School", "Nursing School", "Physician Assistant", "Veterinary School"] },
    { name: "Graduate", items: ["Master's Programs", "PhD Programs", "Data Science Masters", "Public Policy Masters", "Engineering Masters"] },
  ],
  test: [
    { name: "Business school", items: ["GMAT", "GMAT Focus", "Executive Assessment"] },
    { name: "Graduate", items: ["GRE"] },
    { name: "Undergrad", items: ["SAT", "ACT", "PSAT", "AP Exams"] },
    { name: "Professional", items: ["LSAT", "MCAT", "DAT", "NCLEX"] },
    { name: "English", items: ["TOEFL", "IELTS", "Duolingo English Test"] },
  ],
};

export function categoryPool(type: GoalType): string[] {
  return FAMILIES[type].flatMap((f) => f.items);
}

// Order matches the brand's pathway order.
export const GOAL_TYPES: { id: GoalType; label: string }[] = [
  { id: "ai", label: "Learn AI skills" },
  { id: "career", label: "Build your career" },
  { id: "school", label: "Get into school" },
  { id: "test", label: "Take a test" },
];

export const POPULAR: Record<GoalType, string[]> = {
  ai: ["Prompt Engineering", "Building with Agents", "AI for Product Managers", "AI Fundamentals", "No-Code AI Tools", "Breaking into AI Roles"],
  career: ["Product Management", "Management Consulting", "Investment Banking", "Interview Prep", "Resume Review", "Career Change", "Leadership Development", "Software Engineering"],
  school: ["MBA", "College", "Law School", "Medical School", "Master's Programs", "PhD Programs"],
  test: ["GMAT", "GRE", "SAT", "LSAT", "MCAT", "ACT"],
};

export type Question = { id: string; label: string; options: string[] };

const HOURS_QUESTION: Question = {
  id: "hours",
  label: "Time you can give this each week",
  options: ["Under 3 hours", "3–6 hours", "10 or more"],
};

// "Build your career" covers more than a job hunt — people also pick it to earn
// a promotion or to get sharper in the role they already have. Asking "where
// are you in the search?" makes no sense on those paths, so intent comes first
// and the rest of the questions follow from it.
export const CAREER_INTENT: Question = {
  id: "intent",
  label: "What are you going after?",
  options: ["A new role", "A promotion where I am", "A move into a different field", "Sharper skills, same role"],
};

const CAREER_FOLLOW_UPS: Record<string, Question[]> = {
  "A new role": [
    { id: "stage", label: "Where are you in the search?", options: ["Getting clear on the target", "Applying now", "Interviewing", "Weighing an offer"] },
    { id: "resume", label: "How's your resume?", options: ["Haven't touched it", "Rough draft", "Up to date"] },
  ],
  "A move into a different field": [
    { id: "stage", label: "How far into the switch are you?", options: ["Still deciding", "Know the target, building toward it", "Applying now", "Interviewing"] },
    { id: "resume", label: "How's your resume?", options: ["Haven't touched it", "Rough draft", "Up to date"] },
  ],
  "A promotion where I am": [
    { id: "case", label: "Where does your case stand?", options: ["Haven't raised it", "Manager knows I want it", "Formally in the process"] },
  ],
  "Sharper skills, same role": [
    { id: "level", label: "Where are you starting?", options: ["Just getting going", "Solid but uneven", "Strong, want real depth"] },
  ],
};

export const QUESTIONS: Record<GoalType, Question[]> = {
  ai: [
    { id: "start", label: "Where are you starting?", options: ["Barely used it", "In it most days", "Built a few things", "Shipping already"] },
    { id: "why", label: "What's this for?", options: ["My current job", "A career move", "Leading my team through it", "Keeping up"] },
    HOURS_QUESTION,
  ],
  career: [CAREER_INTENT, ...CAREER_FOLLOW_UPS["A new role"], HOURS_QUESTION],
  school: [
    { id: "stage", label: "How far along are you?", options: ["Just exploring", "Building my school list", "Drafting essays", "Ready to submit"] },
    { id: "schools", label: "How many schools are you applying to?", options: ["1–2", "3–5", "6 or more"] },
    { id: "score", label: "Do you still need a test score?", options: ["Haven't started", "Retaking it", "Already have one"] },
  ],
  test: [
    { id: "attempt", label: "Have you taken it before?", options: ["First attempt", "Retaking it"] },
    { id: "runway", label: "How long until test day?", options: ["Under 6 weeks", "2–3 months", "More than 3 months"] },
    HOURS_QUESTION,
  ],
};

// The question set itself branches for career, so step 2 asks what's actually
// relevant to the path the person picked. Question count varies (3 or 4) —
// better than padding every path to the same length with a dead question.
export function questionsFor(type: GoalType, answers: Answers): Question[] {
  if (type !== "career") return QUESTIONS[type];
  const intent = answers[CAREER_INTENT.id] ?? CAREER_INTENT.options[0];
  return [CAREER_INTENT, ...(CAREER_FOLLOW_UPS[intent] ?? []), HOURS_QUESTION];
}

export const DATE_LABEL: Record<GoalType, string> = {
  ai: "Be there by",
  career: "Target date",
  school: "Application deadline",
  test: "Test date",
};

// Auto-derived goal name from the first selected category. Career names key off
// intent too — "Land a Product Management role" is wrong for someone whose goal
// is a promotion or sharper skills in the role they already have.
export function deriveGoalName(type: GoalType, category: string, answers: Answers = {}): string {
  if (!category) return "";
  switch (type) {
    case "school":
      return `Get into ${category === "MBA" ? "a top MBA program" : category === "College" ? "my dream college" : category}`;
    case "career":
      switch (answerFor("career", answers, CAREER_INTENT.id)) {
        case "A promotion where I am":
          return `Get promoted in ${category}`;
        case "A move into a different field":
          return `Move into ${category}`;
        case "Sharper skills, same role":
          return `Get sharper at ${category}`;
        default:
          return `Land a ${category} role`;
      }
    case "test":
      return `Hit my ${category} target score`;
    case "ai":
      return category === "AI Fundamentals" ? "Get fluent with AI" : `Get good at ${category}`;
  }
}

// Content-review task names key off the specific exam — an LSAT plan should not
// say "quant fundamentals".
const SECTIONS: Record<string, string[]> = {
  GMAT: ["Quant fundamentals", "Verbal fundamentals"],
  "GMAT Focus": ["Quant fundamentals", "Verbal and data insights fundamentals"],
  GRE: ["Quant fundamentals", "Verbal fundamentals"],
  SAT: ["Math fundamentals", "Reading and writing fundamentals"],
  PSAT: ["Math fundamentals", "Reading and writing fundamentals"],
  ACT: ["Math and science fundamentals", "English and reading fundamentals"],
  LSAT: ["Logical reasoning fundamentals", "Reading comprehension fundamentals"],
  MCAT: ["Chem and physics review", "Bio and biochem review", "CARS practice"],
  DAT: ["Natural sciences review", "Perceptual ability practice"],
  TOEFL: ["Reading and listening practice", "Speaking and writing practice"],
  IELTS: ["Reading and listening practice", "Speaking and writing practice"],
  "Duolingo English Test": ["Reading and listening practice", "Speaking and writing practice"],
};

function sectionsFor(exam: string): string[] {
  return SECTIONS[exam] ?? ["First section review", "Rebuild your weakest section"];
}

// Real score ranges for the "test" goal type's target/baseline/result fields —
// validates against the actual scale instead of accepting any number. Exams
// without a single composite score (AP Exams is per-exam 1–5, NCLEX is
// pass/fail) are left out; those goals just skip score validation.
export const TEST_SCORE_RANGE: Record<string, { min: number; max: number }> = {
  GMAT: { min: 205, max: 805 },
  "GMAT Focus": { min: 205, max: 805 },
  "Executive Assessment": { min: 100, max: 200 },
  GRE: { min: 260, max: 340 },
  SAT: { min: 400, max: 1600 },
  PSAT: { min: 320, max: 1520 },
  ACT: { min: 1, max: 36 },
  LSAT: { min: 120, max: 180 },
  MCAT: { min: 472, max: 528 },
  TOEFL: { min: 0, max: 120 },
  IELTS: { min: 0, max: 9 },
  "Duolingo English Test": { min: 10, max: 160 },
};

export function scoreRangeFor(category: string): { min: number; max: number } | null {
  return TEST_SCORE_RANGE[category] ?? null;
}

// Which exam a school category implies, for the test-prep project.
const SCHOOL_EXAM: Record<string, string> = {
  MBA: "GMAT",
  "Deferred MBA": "GMAT",
  "Executive MBA": "Executive Assessment",
  "Business Analytics": "GMAT",
  "Master's in Management": "GMAT",
  College: "SAT",
  "Undergrad Transfer": "SAT",
  "Law School": "LSAT",
  "LLM Programs": "TOEFL",
  "Medical School": "MCAT",
  "Dental School": "DAT",
  "Master's Programs": "GRE",
  "PhD Programs": "GRE",
  "Data Science Masters": "GRE",
  "Public Policy Masters": "GRE",
  "Engineering Masters": "GRE",
};

export type PlanRoutine = { label: string; cadence: string };
export type PlanProject = { label: string; why?: string; tasks: string[] };
export type Plan = { routines: PlanRoutine[]; projects: PlanProject[] };

export type Answers = Record<string, string>;

// Each question defaults to its first option so step 2 can be skipped.
export function answerFor(type: GoalType, answers: Answers, questionId: string): string {
  const q = questionsFor(type, answers).find((x) => x.id === questionId);
  return answers[questionId] ?? q?.options[0] ?? "";
}

// Starter plan for a new goal. Branches on the step-2 answers — the branching
// is the substance of the feature, so it lives here as data + predicates
// rather than as conditionals inside the step-3 JSX.
export function buildPlan(type: GoalType, categories: string[], answers: Answers): Plan {
  const category = categories[0] ?? "your goal";
  const a = (id: string) => answerFor(type, answers, id);
  const routines: PlanRoutine[] = [];
  const projects: PlanProject[] = [];

  if (type === "school") {
    const stage = a("stage");
    const schools = a("schools");
    const score = a("score");
    const needsTest = score !== "Already have one";

    if (needsTest) routines.push({ label: "Practice set", cadence: "Every weekday" });
    routines.push({ label: "Research one program", cadence: "Sundays" });

    if (stage === "Just exploring" || stage === "Building my school list") {
      projects.push({
        label: "School list",
        why: "You're still shaping the list",
        tasks: ["Draft a list of 8 programs", "Compare them on fit and cost", "Sit in on one info session", "Cut it to your real shortlist"],
      });
    }

    projects.push({
      label: "Application essays",
      why: schools === "6 or more" ? "Six-plus apps — build a reusable core essay" : undefined,
      tasks:
        schools === "1–2"
          ? ["Outline your core story", "Draft essay 1", "Draft essay 2", "Get essay 1 reviewed by your expert"]
          : schools === "3–5"
            ? ["Outline your core story", "Draft the core essay", "Adapt it for schools 2 and 3", "Write the school-specific “why us” paragraphs", "Get the core essay reviewed by your expert"]
            : ["Outline your core story", "Draft the core essay", "Build a reuse map across all schools", "Write each “why us” paragraph", "Two rounds of expert review", "Final proofread pass"],
    });

    if (needsTest) {
      const exam = SCHOOL_EXAM[category] ?? "Test";
      projects.push({
        label: `${exam} prep`,
        why: score === "Retaking it" ? "Retake — start from the last score report" : "No score yet",
        tasks:
          score === "Retaking it"
            ? ["Break down your last score report", "Fix your two weakest sections", "Full-length mock under timing", "Book the retake"]
            : ["Take a diagnostic test", ...sectionsFor(exam), "Full-length mock under timing", "Book your test date"],
      });
    }

    projects.push({ label: "Recommenders", tasks: ["Shortlist two recommenders", "Send them your brag sheet", "Confirm both submitted"] });

    if (stage !== "Just exploring") {
      projects.push({ label: "Interview prep", tasks: ["Write your two-minute story", "Two mock interviews with your expert"] });
    }
    if (stage === "Ready to submit") {
      projects.push({
        label: "Submission check",
        why: "You said you're close",
        tasks: ["Proof every form field", "Confirm transcripts and scores sent", "Submit and save confirmations"],
      });
    }
  }

  if (type === "career") {
    const intent = a("intent");
    const light = a("hours") === "Under 3 hours";
    const jobSearch = intent === "A new role" || intent === "A move into a different field";

    if (jobSearch) {
      const stage = a("stage");
      const resume = a("resume");
      const applying = stage === "Applying now" || stage === "Interviewing";

      if (applying) routines.push({ label: light ? "Apply to one role" : "Apply to two roles", cadence: "Every weekday" });
      routines.push({ label: "Send one networking message", cadence: light ? "Mondays" : "Mon, Wed, Fri" });

      if (stage === "Getting clear on the target" || stage === "Still deciding") {
        projects.push({
          label: "Get clear on the target",
          why: "Before you apply anywhere",
          tasks: ["Write what you want the next role to give you", "Talk to three people doing it now", "Name your two non-negotiables"],
        });
      }

      if (intent === "A move into a different field") {
        projects.push({
          label: "Bridge the gap",
          why: "You're switching fields, not just employers",
          tasks: [
            `Map your experience onto ${category} language`,
            "Name the two skills you're missing and close one",
            "Find three people who made the same switch",
            "Build one piece of proof you can point to",
          ],
        });
      }

      projects.push({
        label: "Resume and story",
        why: resume === "Haven't touched it" ? "Starting from scratch" : undefined,
        tasks:
          resume === "Up to date"
            ? [`Tailor it for ${category}`, "Get it reviewed by your expert", "Tighten your LinkedIn headline"]
            : [`Rewrite your bullets for ${category} scope`, "Quantify your top three wins", "Get it reviewed by your expert", "Update LinkedIn to match"],
      });

      if (stage !== "Weighing an offer") {
        projects.push({ label: "Target list", tasks: ["Pick 15 target companies", "Find a warm intro at five of them", "Track every application in one place"] });
      }

      projects.push({ label: "Interview loop", tasks: [`Build your ${category} story bank`, "Two mock interviews with your expert", "Practice a live case or take-home"] });

      if (stage === "Weighing an offer") {
        projects.push({
          label: "Offer and negotiation",
          why: "You have something on the table",
          tasks: ["Benchmark the comp range", "Script your ask", "Run the negotiation call"],
        });
      }
    }

    if (intent === "A promotion where I am") {
      const caseStage = a("case");
      routines.push({ label: "Log one win", cadence: light ? "Fridays" : "Every weekday" });
      routines.push({ label: "Check in on a stakeholder", cadence: "Mondays" });

      projects.push({
        label: "Build the case",
        why: caseStage === "Haven't raised it" ? "Nobody can advocate for a case they haven't seen" : undefined,
        tasks: [
          "Write out what the next level actually requires",
          "Mark honestly where you already clear it",
          "Collect evidence for each gap you've closed",
          `Draft the one-page case for ${category}`,
        ],
      });

      projects.push({
        label: "Visible scope",
        tasks: ["Take on one project above your level", "Present work to your manager's peers", "Get a second person to vouch for the work"],
      });

      projects.push(
        caseStage === "Haven't raised it"
          ? { label: "Open the conversation", why: "It hasn't been said out loud yet", tasks: ["Book the conversation with your manager", "Script the ask", "Agree on what the bar looks like"] }
          : { label: "Run the process", why: "It's already in motion", tasks: ["Confirm the timeline and decision-makers", "Send your case ahead of the review", "Line up your sponsors", "Ask for the gap list in writing"] },
      );
    }

    if (intent === "Sharper skills, same role") {
      const level = a("level");
      routines.push({ label: light ? "Twenty minutes of deliberate practice" : "Forty minutes of deliberate practice", cadence: light ? "Mon, Wed, Fri" : "Every weekday" });
      routines.push({ label: "Write down what you learned", cadence: "Fridays" });

      projects.push(
        level === "Just getting going"
          ? { label: "Foundations", why: "Starting near the beginning", tasks: [`Learn the core of ${category}`, "Do one small thing with it this week", "Find the reference you'll keep going back to"] }
          : level === "Solid but uneven"
            ? { label: "Close the uneven parts", why: "Your base is fine; the gaps aren't", tasks: ["Name your two weakest areas honestly", "Fix the first one properly", "Get someone good to check your work"] }
            : { label: "Go deep", why: "You're past the basics", tasks: [`Pick the hardest problem in ${category} you can reach`, "Work it end to end", "Get a specialist to critique it"] },
      );

      projects.push({
        label: "Use it on real work",
        tasks: ["Pick a live project to apply it to", "Ship one visible improvement", "Ask your manager what changed"],
      });

      projects.push({
        label: "Make it stick",
        tasks: ["Teach it to one person on your team", "Write the short version down where others can find it"],
      });
    }
  }

  if (type === "test") {
    const attempt = a("attempt");
    const runway = a("runway");
    const light = a("hours") === "Under 3 hours";

    routines.push({ label: light ? "Twenty timed questions" : "Timed practice set", cadence: light ? "Mon, Wed, Fri" : "Every weekday" });
    routines.push({ label: "Review your error log", cadence: "Sundays" });

    projects.push(
      attempt === "Retaking it"
        ? {
            label: "Score review",
            why: "Retake — start from what went wrong",
            tasks: ["Break down your last score report", "Name the two sections costing you most", "Set a realistic target score"],
          }
        : { label: "Baseline", why: "First attempt", tasks: ["Take a full diagnostic", "Set a target score", "Pick your test date"] },
    );

    projects.push({
      label: `${category} content review`,
      tasks:
        runway === "Under 6 weeks"
          ? ["Drill your two weakest topics", "One targeted section review"]
          : [...sectionsFor(category), "Section strategy pass", "Rebuild your weakest topic from scratch"],
    });

    projects.push({
      label: "Mocks",
      tasks:
        runway === "Under 6 weeks"
          ? ["Two full-length mocks under timing", "Review every miss"]
          : ["Three full-length mocks under timing", "Review every miss", "Final mock the week before"],
    });
  }

  if (type === "ai") {
    const start = a("start");
    const why = a("why");
    const light = a("hours") === "Under 3 hours";
    const early = start === "Barely used it" || start === "In it most days";

    routines.push({ label: light ? "Twenty minutes of building" : "Thirty minutes of building", cadence: light ? "Mon, Wed, Fri" : "Daily" });
    routines.push({ label: "Ship one small thing", cadence: "Fridays" });

    projects.push(
      early
        ? {
            label: "Foundations",
            why: "Starting close to zero",
            tasks: ["Pick one tool and use it daily for a week", "Learn the prompt patterns that actually matter", "Redo one real work task with it", "Write down where it failed you"],
          }
        : {
            label: "Go deeper",
            why: "You're past the basics",
            tasks: ["Name your weakest area and fix it", "Rebuild your best project properly", "Read two things that change how you build"],
          },
    );

    projects.push({
      label: "Build something real",
      tasks: ["Pick the most annoying task in your week", "Build a first version", "Put it in front of one other person", "Rebuild it around what broke"],
    });

    if (why === "My current job") {
      projects.push({
        label: "Put it to work",
        why: "This is for your current job",
        tasks: ["Automate one recurring report", "Save your best prompts where your team can find them", "Show the result to your manager"],
      });
    }
    if (why === "A career move") {
      projects.push({
        label: "Show the work",
        why: "You're aiming at a move",
        tasks: ["Ship one public project", "Write up what you learned", "Put the AI work on your resume and LinkedIn", "Talk to two people already in those roles"],
      });
    }
    if (why === "Leading my team through it") {
      projects.push({
        label: "Bring your team along",
        why: "You're leading others through this",
        tasks: ["Run one working session with real tasks", "Pick two workflows worth changing", "Write your team's ground rules", "Check what actually stuck a month later"],
      });
    }
    if (why === "Keeping up") {
      projects.push({
        label: "Stay current without drowning",
        why: "You want signal, not noise",
        tasks: ["Pick three sources and drop the rest", "Try one new tool a month", "Keep a list of what you'd use again"],
      });
    }
  }

  return { routines, projects };
}

// Offline category matching from a free-text description. The design's AI paths
// (D/E/F) call a model for this; a model call needs a server endpoint, so the
// prototype ships the documented keyword fallback and says so in the UI.
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "into", "want", "would", "like", "get", "role", "next", "year",
  "make", "move", "job", "school", "test", "goal", "about", "more", "that", "this", "from",
  "have", "need", "help", "myself",
]);

export function matchCategories(type: GoalType, description: string): string[] {
  const pool = categoryPool(type);
  const words = description
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const haystack = description.toLowerCase();

  const scored = pool
    .map((c) => {
      const label = c.toLowerCase();
      const labelWords = new Set(label.split(/[^a-z]+/).filter(Boolean));
      // Naming the category outright ("MBA programs") is the strongest signal
      // there is, and has to outrank generic words like "programs" that are
      // whole-word hits across a dozen unrelated labels.
      const exactLabel = new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(haystack);
      const wordScore = words.reduce((sum, w) => {
        if (labelWords.has(w)) return sum + w.length * 4;
        if (label.includes(w)) return sum + w.length;
        return sum;
      }, 0);
      return { c, score: wordScore + (exactLabel ? 1000 : 0) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const hits = scored.slice(0, 3).map((x) => x.c);
  return hits.length ? hits : POPULAR[type].slice(0, 2);
}

export const DESCRIPTION_PLACEHOLDER: Record<GoalType, string> = {
  ai: "I run a marketing team and I want us actually using AI by Q1 — I've barely touched it myself.",
  career: "I'm a senior engineer who wants to move into product management at a bigger company by next spring.",
  school: "I want to apply to a few MBA programs in round 1 and I haven't started essays.",
  test: "I need a GMAT score good enough for a top-10 MBA, and I'm starting from scratch.",
};
