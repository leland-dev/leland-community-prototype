/* ─────────────────────────────────────────────────────────────────────────
 * AI Builder Program — post-checkout onboarding.
 * Static content + answer types. Two entry paths share one journey:
 *   individual → checkout confirmation → welcome → questions → hub
 *   team       → invite email → branded interstitial auth → welcome → questions → hub
 * ──────────────────────────────────────────────────────────────────────── */
import type { LucideIcon } from "lucide-react";
import programCover from "../../assets/img/ai-builder-l1.avif";
import pic3 from "../../assets/profile photos/pic-3.png";
import pic5 from "../../assets/profile photos/pic-5.png";
import pic7 from "../../assets/profile photos/pic-7.png";
import build1 from "../../assets/placeholder images/courses/HERO-10-automations-scaled.avif";
import build2 from "../../assets/placeholder images/courses/HERO-5-systems-that-turn-your-expertise-min.avif";
import build3 from "../../assets/placeholder images/courses/toolkit_visa_eligibility_tool_52ed4c99da.avif";
import build4 from "../../assets/placeholder images/courses/c10-hero-1920x1280.webp";
import build5 from "../../assets/placeholder images/courses/HERO-Sam-Vander-Wielen-case-study-scaled.avif";
import {
  BarChart3, Code2, Compass, Crown, FileText, GraduationCap, Handshake, Hourglass, Landmark,
  Mail, Megaphone, MoreHorizontal, PenTool, Rocket, Scale, Search, Settings2,
  Sparkles, Telescope, Users, Workflow, CalendarDays,
} from "lucide-react";

export type Path = "individual" | "team";
export type Context = "work" | "personal";
export type ToolKey = "claude" | "chatgpt" | "copilot" | "gemini" | "unsure";
export type ExperienceKey = "new" | "casual" | "daily" | "builder";

export type Answers = {
  context?: Context;
  companyName: string;
  teamSize?: string;
  invites: string[];
  role?: string;
  experience?: ExperienceKey;
  tool?: ToolKey;
  goals: string[];
  /** Optional free text: current role + where they'd like to save time. */
  goalsNote: string;
  cohortId?: string;
  phone: string;
  reminders: boolean;
};

export const EMPTY_ANSWERS: Answers = {
  companyName: "",
  invites: [],
  goals: [],
  goalsNote: "",
  phone: "",
  reminders: true,
};

/** Mock account (individual path: self-purchased on joinleland.com). */
export const USER = {
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex.rivera@gmail.com",
  orderId: "LL-48213",
};

/** Mock organization (team path: an admin bought seats and invited the user). */
export const ORG = {
  name: "Northwind",
  domain: "northwind.com",
  inviter: { name: "John Park", title: "Head of Operations", initials: "JP" },
  seats: 25,
};

/** AI Builder gradient background video — same asset ai.joinleland.com uses. */
export const AI_GRADIENT_VIDEO =
  "https://lebrain.joinleland.com/files/ai-builder-program-gradient-background-video";

/** Program art (same asset MyCourses uses for Level 1). */
export const PROGRAM_COVER = programCover;

export const INSTRUCTORS = [
  { name: "Andrew Q.", title: "AI Builder Lead", photo: pic7 },
  { name: "Dessy K.", title: "Lead Instructor", photo: pic3 },
  { name: "Kristen H.", title: "Program TA", photo: pic5 },
];

/** Example-build thumbnails. Local placeholders until we have real build shots. */
const BUILD_IMAGES = [build1, build2, build3, build4, build5];
export const buildImage = (n: number) => BUILD_IMAGES[n % BUILD_IMAGES.length];

export type Peer = { name: string; title: string; company: string; quote: string };

/** Role-agnostic quotes for the welcome / auth brand panel (shown before we know the role). */
export const WELCOME_QUOTES: Peer[] = [
  { name: "Priya N.", title: "Senior PM", company: "Atlassian", quote: "I went from dabbling to shipping a working agent in week two. The cohort format kept me honest." },
  { name: "Chris B.", title: "Enterprise AE", company: "LinkedIn", quote: "Call prep went from 45 minutes to 5. That's two more conversations a day." },
  { name: "Rachel M.", title: "FP&A Manager", company: "EY", quote: "The commentary that used to eat my close week now takes an hour, and it's better." },
];

/* ── Questions ─────────────────────────────────────────────────────────── */

/** Copy lifted from Higgsfield's intake ("How do you plan to use…"). */
export const CONTEXT_OPTIONS: { value: Context; label: string; desc: string; icon: LucideIcon }[] = [
  { value: "personal", label: "For personal use", desc: "For individuals who want to build and experiment with their own projects", icon: Sparkles },
  { value: "work", label: "With my team", desc: "For organizations who want to collaborate and build at scale", icon: Users },
];

export const TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1,000", "1,000+"];

export type RoleOption = { key: string; label: string; icon: LucideIcon };
export const ROLES: RoleOption[] = [
  { key: "product", label: "Product", icon: Compass },
  { key: "engineering", label: "Engineering", icon: Code2 },
  { key: "design", label: "Design", icon: PenTool },
  { key: "data", label: "Data & analytics", icon: BarChart3 },
  { key: "marketing", label: "Marketing", icon: Megaphone },
  { key: "sales", label: "Sales", icon: Handshake },
  { key: "ops", label: "Operations", icon: Settings2 },
  { key: "finance", label: "Finance", icon: Landmark },
  { key: "people", label: "People / HR", icon: Users },
  { key: "legal", label: "Legal", icon: Scale },
  { key: "exec", label: "Executive", icon: Crown },
  { key: "founder", label: "Founder", icon: Rocket },
  { key: "other", label: "Something else", icon: MoreHorizontal },
];
/** Extra options shown only on the "for personal use" path, appended before
 *  "Something else". Same taxonomy (role is one stored property), three more values. */
export const PERSONAL_ROLES: RoleOption[] = [
  { key: "student", label: "Student", icon: GraduationCap },
  { key: "between", label: "Between roles", icon: Hourglass },
  { key: "exploring", label: "Just exploring", icon: Telescope },
];
export const NON_WORK_ROLES = new Set(PERSONAL_ROLES.map((r) => r.key));
export const isNonWorkRole = (key?: string) => !!key && NON_WORK_ROLES.has(key);
export const roleLabel = (key?: string) =>
  [...ROLES, ...PERSONAL_ROLES].find((r) => r.key === key)?.label ?? "your role";

/** Levels mirror Higgsfield's Beginner → Expert ladder; descriptions are ours. */
export const EXPERIENCE_OPTIONS: { value: ExperienceKey; label: string; desc: string; dots: 1 | 2 | 3 | 4 }[] = [
  { value: "new", label: "Beginner", desc: "New to AI tools, or only tried them once or twice", dots: 1 },
  { value: "casual", label: "Intermediate", desc: "Use AI for quick questions, drafts and summaries", dots: 2 },
  { value: "daily", label: "Advanced", desc: "AI is part of my daily workflow for real work", dots: 3 },
  { value: "builder", label: "Expert", desc: "I build automations, agents or custom workflows", dots: 4 },
];

/** The "today → after the program" arc, keyed by the experience level they
 *  picked. `noun` slots into the affirmation headline. */
export const EXPERIENCE_ARC: Record<ExperienceKey, { noun: string; today: string; after: string }> = {
  new: { noun: "beginners", today: "AI is something you've heard about", after: "AI is something you rely on" },
  casual: { noun: "everyday AI users", today: "AI helps with the small stuff", after: "AI handles the work that matters" },
  daily: { noun: "daily AI users", today: "AI saves you time", after: "AI works while you don't" },
  builder: { noun: "builders", today: "You build with AI", after: "Your team runs on what you build" },
};

export const TOOLS: { value: ToolKey; label: string; desc: string; logo?: string }[] = [
  { value: "claude", label: "Claude", desc: "Anthropic", logo: "logo-claude.webp" },
  { value: "chatgpt", label: "ChatGPT", desc: "OpenAI", logo: "logo-chatgpt.jpg" },
  { value: "copilot", label: "Copilot", desc: "Microsoft", logo: "logo-copilot.jpg" },
  { value: "gemini", label: "Gemini", desc: "Google", logo: "logo-gemini.webp" },
  { value: "unsure", label: "Not sure yet", desc: "Help me pick" },
];
export const toolLabel = (key?: ToolKey) => TOOLS.find((t) => t.value === key)?.label ?? "your AI tool";

export const GOALS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "email", label: "Email & messages", icon: Mail },
  { key: "research", label: "Research & analysis", icon: Search },
  { key: "writing", label: "Writing & documents", icon: FileText },
  { key: "data", label: "Data & reporting", icon: BarChart3 },
  { key: "meetings", label: "Meetings & notes", icon: CalendarDays },
  { key: "automation", label: "Automating repetitive work", icon: Workflow },
  { key: "building", label: "Building tools & agents", icon: Code2 },
  { key: "leading", label: "Leading my team's AI adoption", icon: Users },
];

export type CohortSession = { month: string; day: number; when: string; title: string; minutes: number };
export type Cohort = {
  id: string; label: string; short: string; dates: string; schedule: string; seatsLeft: number; soonest?: boolean;
  sessions: CohortSession[];
};
const L1_SESSIONS = ["AI Foundations & Mindset Shift", "Automate Communication in Your Voice"];
export const COHORTS: Cohort[] = [
  { id: "oct", label: "October cohort", short: "Oct 20 cohort", dates: "Oct 20 – Nov 7, 2026", schedule: "Tue & Thu · 12:00pm MT", seatsLeft: 9, soonest: true,
    sessions: [{ month: "Oct", day: 20, when: "Tuesday at 12:00 PM", title: L1_SESSIONS[0], minutes: 90 }, { month: "Oct", day: 22, when: "Thursday at 12:00 PM", title: L1_SESSIONS[1], minutes: 90 }] },
  { id: "nov", label: "November cohort", short: "Nov 10 cohort", dates: "Nov 10 – Nov 28, 2026", schedule: "Tue & Thu · 12:00pm MT", seatsLeft: 22,
    sessions: [{ month: "Nov", day: 10, when: "Tuesday at 12:00 PM", title: L1_SESSIONS[0], minutes: 90 }, { month: "Nov", day: 12, when: "Thursday at 12:00 PM", title: L1_SESSIONS[1], minutes: 90 }] },
  { id: "dec", label: "December cohort", short: "Dec 1 cohort", dates: "Dec 1 – Dec 19, 2026", schedule: "Mon & Wed · 9:00am MT", seatsLeft: 25,
    sessions: [{ month: "Dec", day: 1, when: "Monday at 9:00 AM", title: L1_SESSIONS[0], minutes: 90 }, { month: "Dec", day: 3, when: "Wednesday at 9:00 AM", title: L1_SESSIONS[1], minutes: 90 }] },
];

/* ── Role-specific affirmation + social proof ──────────────────────────── */

export type RoleProfile = {
  headline: string;        // affirmation title; "{accent}" wraps the emphasised phrase
  proofHeadline: string;   // social-proof title, shown right after the role question
  outcomes: string[];      // three things they'll walk away with
  builds: { img: number; caption: string }[];
  peers: Peer[];
  stat: { value: string; label: string };
};

const DEFAULT_PROFILE: RoleProfile = {
  headline: "Built for people who want to {get real work done with AI}",
  proofHeadline: "People in roles like yours at these companies already build with us",
  outcomes: [
    "Ten quality AI sessions in your first two weeks, on your actual work",
    "A personal workflow you run every day, not a list of prompts",
    "One portfolio build you can show your team",
  ],
  builds: [
    { img: 3, caption: "Weekly status digest from Slack + Notion" },
    { img: 7, caption: "Meeting-to-action-items agent" },
    { img: 12, caption: "Research brief generator" },
  ],
  peers: [
    { name: "Priya N.", title: "Program Manager", company: "Atlassian", quote: "I went from dabbling to shipping a working agent in week two. The cohort format kept me honest." },
    { name: "Marcus T.", title: "Senior Analyst", company: "Deloitte", quote: "The sessions are hands-on. You leave each one with something that works on Monday." },
  ],
  stat: { value: "4.9", label: "average rating from 1,200+ learners" },
};

export const ROLE_PROFILES: Record<string, Partial<RoleProfile>> = {
  product: {
    proofHeadline: "Product managers at these companies already build with us",
    headline: "Built for product people who want to {ship faster with AI}",
    outcomes: [
      "Turn customer interviews and tickets into a prioritized insight brief in minutes",
      "Draft PRDs, specs and release notes with a workflow you actually trust",
      "Prototype a working feature idea without waiting on engineering",
    ],
    builds: [
      { img: 4, caption: "Customer feedback → themes + PRD draft" },
      { img: 9, caption: "Competitive teardown agent" },
      { img: 15, caption: "Clickable prototype from a spec" },
    ],
    peers: [
      { name: "Priya N.", title: "Senior PM", company: "Atlassian", quote: "I now synthesize a week of user interviews before standup. My team thinks I hired a researcher." },
      { name: "Daniel O.", title: "Group PM", company: "Capital One", quote: "The portfolio build was a real internal tool. It's still in use." },
    ],
  },
  marketing: {
    proofHeadline: "Marketers at these companies already build with us",
    headline: "Built for marketers who want to {do the work of a full team}",
    outcomes: [
      "A campaign engine: brief → messaging → variants → landing copy, in your voice",
      "Research and competitive analysis that used to take a week, done in an afternoon",
      "An automation that keeps your content calendar and reporting current",
    ],
    builds: [
      { img: 5, caption: "Campaign brief → multi-channel copy" },
      { img: 11, caption: "Weekly performance report agent" },
      { img: 18, caption: "SEO content pipeline" },
    ],
    peers: [
      { name: "Sofia L.", title: "Head of Growth", company: "Coinbase", quote: "We cut our campaign turnaround in half. I built the system in the program." },
      { name: "Jordan K.", title: "Content Lead", company: "Salesforce", quote: "I was skeptical about AI writing. Now I use it for the first 70% and spend my time on the part that matters." },
    ],
  },
  sales: {
    proofHeadline: "Sellers at these companies already build with us",
    headline: "Built for sellers who want to {spend more time selling}",
    outcomes: [
      "Account research and call prep that takes minutes, not an evening",
      "Follow-ups, proposals and CRM notes written for you, from your call transcripts",
      "A pipeline hygiene agent that flags what needs attention each morning",
    ],
    builds: [
      { img: 6, caption: "Pre-call account brief generator" },
      { img: 13, caption: "Call transcript → follow-up + CRM update" },
      { img: 20, caption: "Proposal draft from discovery notes" },
    ],
    peers: [
      { name: "Chris B.", title: "Enterprise AE", company: "LinkedIn", quote: "Call prep went from 45 minutes to 5. That's two more conversations a day." },
      { name: "Amara D.", title: "SDR Manager", company: "Uber", quote: "My whole team runs the outreach workflow I built in Level 1." },
    ],
  },
  ops: {
    proofHeadline: "Operators at these companies already build with us",
    headline: "Built for operators who want to {automate the busywork}",
    outcomes: [
      "Standard operating procedures, playbooks and docs drafted from how you already work",
      "Reports and dashboards updated automatically from the tools you use",
      "An agent that handles the repetitive requests that fill your inbox",
    ],
    builds: [
      { img: 8, caption: "Inbox triage + request router" },
      { img: 14, caption: "Vendor comparison agent" },
      { img: 21, caption: "SOP generator from recorded walkthroughs" },
    ],
    peers: [
      { name: "Marcus T.", title: "Ops Manager", company: "Deloitte", quote: "Hands-on from the first session. I left each one with something that worked on Monday." },
      { name: "Lena S.", title: "Ops Lead", company: "Bain", quote: "I built an agent that does our Monday reporting. It's the first thing I show new hires." },
    ],
  },
  finance: {
    proofHeadline: "Finance teams at these companies already build with us",
    headline: "Built for finance teams who want to {close faster and see further}",
    outcomes: [
      "Variance analysis and board narrative drafted from your actuals",
      "Model documentation and scenario summaries written while you work",
      "A reconciliation helper that catches what you'd otherwise miss",
    ],
    builds: [
      { img: 10, caption: "Monthly variance commentary agent" },
      { img: 16, caption: "Board deck narrative from the model" },
      { img: 22, caption: "Invoice anomaly checker" },
    ],
    peers: [
      { name: "Rachel M.", title: "FP&A Manager", company: "EY", quote: "The commentary that used to eat my close week now takes an hour, and it's better." },
      { name: "Tom H.", title: "Controller", company: "Accenture", quote: "Hands-on, practical, no hype. Exactly what a finance person needs." },
    ],
  },
  people: {
    proofHeadline: "People leaders at these companies already build with us",
    headline: "Built for people leaders who want to {scale themselves}",
    outcomes: [
      "Job descriptions, interview guides and feedback summaries in your company's voice",
      "Onboarding and enablement content generated from what already exists",
      "An assistant for the policy questions that land in your inbox every day",
    ],
    builds: [
      { img: 17, caption: "Interview feedback synthesizer" },
      { img: 19, caption: "Policy Q&A assistant" },
      { img: 23, caption: "New-hire onboarding plan generator" },
    ],
    peers: [
      { name: "Maya R.", title: "VP People", company: "Meta", quote: "I finally understand what my team can and can't do with AI, because I built something myself." },
      { name: "Evan C.", title: "HRBP", company: "Google", quote: "The cohort was full of people in roles like mine. That made all the difference." },
    ],
  },
  engineering: {
    proofHeadline: "Engineers at these companies already build with us",
    headline: "Built for engineers who want to {go beyond autocomplete}",
    outcomes: [
      "Agentic workflows that plan, execute and verify real tasks in your codebase",
      "Internal tools your non-technical teammates can actually use",
      "A clear mental model of where agents help and where they don't",
    ],
    builds: [
      { img: 1, caption: "Codebase Q&A + PR summarizer" },
      { img: 2, caption: "On-call runbook agent" },
      { img: 24, caption: "Internal admin tool, built in a weekend" },
    ],
    peers: [
      { name: "Wei Z.", title: "Staff Engineer", company: "Atlassian", quote: "I expected prompt tips. I got a real framework for building agents that hold up." },
      { name: "Nina F.", title: "Engineering Manager", company: "Yahoo", quote: "Sent my whole team through Level 1. Our tooling backlog shrank noticeably." },
    ],
  },
  exec: {
    proofHeadline: "Leaders at these companies already build with us",
    headline: "Built for leaders who want to {lead the AI shift, not watch it}",
    outcomes: [
      "First-hand fluency: you'll build something real, so you can judge what your teams build",
      "A practical AI strategy for your org, grounded in what you've done yourself",
      "The vocabulary and judgment to make good calls on tools, vendors and risk",
    ],
    builds: [
      { img: 25, caption: "Weekly exec brief from team updates" },
      { img: 26, caption: "Board prep research agent" },
      { img: 27, caption: "Org-wide AI policy draft + rollout plan" },
    ],
    peers: [
      { name: "Steve A.", title: "General Manager", company: "Kearney", quote: "The program gave me credibility with my teams. I'm not delegating AI anymore." },
      { name: "Grace W.", title: "COO", company: "McKinsey", quote: "We used it as the foundation for our company-wide rollout." },
    ],
  },
  design: {
    proofHeadline: "Designers at these companies already build with us",
    headline: "Built for designers who want to {prototype at the speed of thought}",
    outcomes: [
      "Working prototypes from a sketch or a sentence, ready for user testing the same day",
      "Research synthesis: interviews and usability sessions turned into themes and insights",
      "Design-system docs, specs and handoff notes drafted while you work",
    ],
    builds: [
      { img: 4, caption: "Interview transcripts → insight board" },
      { img: 9, caption: "Clickable prototype from a wireframe" },
      { img: 15, caption: "Component docs generator" },
    ],
    peers: [
      { name: "Noor H.", title: "Product Designer", company: "Meta", quote: "I prototype in an afternoon what used to take a sprint. PMs stopped asking for mocks and started asking for the link." },
      { name: "Leo P.", title: "Design Lead", company: "Uber", quote: "The research synthesis workflow alone paid for the program." },
    ],
  },
  data: {
    proofHeadline: "Data teams at these companies already build with us",
    headline: "Built for data people who want to {spend less time on the plumbing}",
    outcomes: [
      "Queries, transformations and QA checks written and explained by an agent you supervise",
      "Analysis write-ups and stakeholder summaries drafted from your notebooks",
      "A self-serve assistant that answers the questions that interrupt your day",
    ],
    builds: [
      { img: 10, caption: "Natural-language SQL assistant" },
      { img: 16, caption: "Weekly metrics narrative generator" },
      { img: 22, caption: "Data-quality monitor with alerts" },
    ],
    peers: [
      { name: "Ana C.", title: "Senior Data Analyst", company: "Capital One", quote: "The ad-hoc request queue is half what it was. The assistant handles the easy ones." },
      { name: "Raj M.", title: "Analytics Manager", company: "Salesforce", quote: "Hands-on and honest about where agents fall down. My whole team went through it." },
    ],
  },
  legal: {
    proofHeadline: "Legal teams at these companies already build with us",
    headline: "Built for legal teams who want to {move faster without more risk}",
    outcomes: [
      "First-pass contract review and redlines against your playbook, for you to approve",
      "Research memos and summaries drafted from the documents you already have",
      "An intake assistant that triages the questions the business sends you",
    ],
    builds: [
      { img: 8, caption: "Contract review against a playbook" },
      { img: 14, caption: "Legal intake triage assistant" },
      { img: 21, caption: "Policy summary generator" },
    ],
    peers: [
      { name: "Dana R.", title: "Associate General Counsel", company: "Coinbase", quote: "I was the skeptic. Now first-pass NDA review takes minutes and I spend my time on the hard clauses." },
      { name: "Sam O.", title: "Legal Ops Lead", company: "Deloitte", quote: "The intake assistant cut our response time in half without adding headcount." },
    ],
  },
  student: {
    proofHeadline: "Students and recent grads already build with us",
    headline: "Built for students who want to {graduate already fluent in AI}",
    outcomes: [
      "Research, writing and study workflows that give you hours back every week",
      "A portfolio build you can show in interviews, not just a certificate",
      "The judgment to know what AI is good for, and what it isn't",
    ],
    peers: [
      { name: "Maya K.", title: "MBA candidate", company: "Kellogg", quote: "I walked into recruiting with a working agent in my portfolio. Nobody else in my cohort had that." },
      { name: "Theo R.", title: "CS senior", company: "UT Austin", quote: "Less about prompts, more about building things that hold up. Exactly what classes skip." },
    ],
  },
  between: {
    proofHeadline: "People between roles already build with us",
    headline: "Built for people who want to {land the next role as an AI-native hire}",
    outcomes: [
      "A job search that runs itself: research, tailored applications, follow-ups",
      "A real build to talk about in interviews, in the function you're targeting",
      "Fluency that shows up on day one of the next job",
    ],
    peers: [
      { name: "Jordan L.", title: "Marketing lead, now at", company: "Atlassian", quote: "I did the program during my search. The build I made became the story I told in every interview." },
      { name: "Sam P.", title: "Ops manager, now at", company: "Coinbase", quote: "It gave my search structure, and it gave me something concrete to show." },
    ],
  },
  exploring: {
    proofHeadline: "People learning for themselves already build with us",
    headline: "Built for curious people who want to {actually build something with AI}",
    outcomes: [
      "Ten quality AI sessions on things you care about, not toy examples",
      "A personal workflow you run every day by the end of Level 0",
      "One build you're proud to show someone",
    ],
    peers: [
      { name: "Priya N.", title: "Program Manager", company: "Atlassian", quote: "I went from dabbling to shipping a working agent in week two. The cohort format kept me honest." },
      { name: "Omar H.", title: "Founder", company: "Seed-stage SaaS", quote: "I shipped two features and automated support in the three weeks of the cohort." },
    ],
  },
  founder: {
    proofHeadline: "Founders are already building their companies with us",
    headline: "Built for founders who want to {move like a team of ten}",
    outcomes: [
      "Customer research, positioning and sales collateral in a day instead of a month",
      "An operations layer that runs without you: support, reporting, follow-ups",
      "A working prototype of your next feature, built by you",
    ],
    builds: [
      { img: 3, caption: "Investor update generator" },
      { img: 12, caption: "Support inbox agent" },
      { img: 15, caption: "MVP built from a one-page spec" },
    ],
    peers: [
      { name: "Omar H.", title: "Founder", company: "Seed-stage SaaS", quote: "I shipped two features and automated support in the three weeks of the cohort." },
      { name: "Jess T.", title: "Co-founder", company: "Consumer app", quote: "Best money I spent this year. The TAs are the real deal." },
    ],
  },
};

export function profileFor(role?: string): RoleProfile {
  return { ...DEFAULT_PROFILE, ...(role ? ROLE_PROFILES[role] ?? {} : {}) };
}

/** Splits "before {accent} after" into parts for rendering the lime phrase. */
export function splitAccent(s: string): { before: string; accent: string; after: string } {
  const m = s.match(/^(.*?)\{(.*?)\}(.*)$/);
  return m ? { before: m[1], accent: m[2], after: m[3] } : { before: s, accent: "", after: "" };
}
