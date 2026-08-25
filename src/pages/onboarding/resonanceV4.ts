/* ─────────────────────────────────────────────────────────────────────────
 * resonanceV4 — copy for the "experts are here for you" beat in v4.
 *
 * Keyed by the drill-down category picked right after the goal. The point of
 * the screen is to make it feel like Leland is the best place in the world to
 * learn from people who've done exactly what you're trying to do — so every
 * entry names the specific experts, the specific proof, and the specific win.
 * ──────────────────────────────────────────────────────────────────────── */

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Briefcase, GraduationCap, BookOpen, Stethoscope, Scale, FlaskConical,
  BarChart3, Boxes, Landmark, Code2, TrendingUp, Megaphone, Rocket,
  Sparkles, Cpu, Bot, LineChart, Database,
} from "lucide-react";

import type { Branch } from "./data";
import { DEFAULT_REVIEWS, type Review } from "./steps/ExpertReassurance";

import pic2 from "../../assets/profile photos/pic-2.png";
import pic10 from "../../assets/profile photos/pic-10.png";
import pic11 from "../../assets/profile photos/pic-11.png";
import pic12 from "../../assets/profile photos/pic-12.png";
import pic13 from "../../assets/profile photos/pic-13.png";
import pic14 from "../../assets/profile photos/pic-14.png";

export type Category = { label: string; Icon: ComponentType<LucideProps> };

/** Drill-down options per goal bucket (the question right after "What's your goal?"). */
export const CATEGORIES_BY_BRANCH: Record<Branch, Category[]> = {
  "get-into-school": [
    { label: "MBA & business school", Icon: Briefcase },
    { label: "College", Icon: GraduationCap },
    { label: "Master's programs", Icon: BookOpen },
    { label: "Medical school", Icon: Stethoscope },
    { label: "Law school", Icon: Scale },
    { label: "PhD programs", Icon: FlaskConical },
  ],
  "grow-career": [
    { label: "Consulting", Icon: BarChart3 },
    { label: "Product management", Icon: Boxes },
    { label: "Investment banking & finance", Icon: Landmark },
    { label: "Software engineering", Icon: Code2 },
    { label: "Venture capital & PE", Icon: TrendingUp },
    { label: "Marketing & growth", Icon: Megaphone },
    { label: "Data & analytics", Icon: LineChart },
    { label: "Entrepreneurship", Icon: Rocket },
  ],
  "build-with-ai": [
    { label: "Build with AI in my current role", Icon: Sparkles },
    { label: "Break into an AI career", Icon: Bot },
    { label: "AI & machine learning engineering", Icon: Cpu },
    { label: "AI for product", Icon: Boxes },
    { label: "AI for sales & marketing", Icon: Megaphone },
    { label: "AI for data & analytics", Icon: Database },
  ],
};

export const CATEGORY_QUESTION: Record<Branch, string> = {
  "get-into-school": "What are you applying to?",
  "grow-career": "Where are you headed?",
  "build-with-ai": "What do you want to do with AI?",
};

export type Resonance = {
  title: string;
  /** substring of `title` rendered with emphasis — the category words ("consulting", "MBA admissions") */
  emphasis?: string;
  subline: string;
  orgs: string[];
  reviews: Review[];
};

const R = (quote: string, name: string, role: string, avatar: string): Review => ({
  quote, name, role, avatar,
});

const RESONANCE: Record<string, Resonance> = {
  /* ── school ── */
  "MBA & business school": {
    title: "350+ MBA admissions experts are here to get you in",
    subline:
      "Former HBS, GSB, and Wharton admissions readers and recent admits — nowhere else can you learn directly from the people who've read the files and written the winning essays.",
    orgs: ["HBS", "Stanford GSB", "Wharton", "Kellogg", "Booth", "MIT Sloan", "Columbia"],
    reviews: [
      R("I got into HBS, Stanford, AND Wharton. Six months on Leland.", "Maya P.", "HBS '27", pic10),
      R("My essays finally sounded like me. Booth said yes.", "Deepa R.", "Booth '26", pic2),
      R("My coach was a former GSB reader. She knew exactly what they wanted.", "Jordan K.", "GSB '27", pic13),
    ],
  },
  College: {
    title: "260+ college admissions experts are here to get you in",
    subline:
      "Former Ivy admissions officers and current students who just got in — the best place in the world to learn what actually moves a college application.",
    orgs: ["Harvard", "Stanford", "MIT", "Yale", "Princeton", "Brown", "Duke"],
    reviews: [
      R("Rejected everywhere junior year. Coached senior year — Yale, Brown, and Duke.", "Ana C.", "Yale '29", pic10),
      R("My coach read for Princeton. Every draft got sharper.", "Eli M.", "Princeton '29", pic11),
      R("I finally understood what 'authentic voice' meant. Stanford said yes.", "Priya S.", "Stanford '29", pic2),
    ],
  },
  "Master's programs": {
    title: "190+ grad admissions experts are here to get you in",
    subline:
      "Recent admits and former readers from the top master's programs — learn from people who've navigated your exact program, not a generic guide.",
    orgs: ["Stanford", "MIT", "Columbia", "Harvard", "Berkeley", "Georgia Tech", "CMU"],
    reviews: [
      R("Three schools, three offers, one funded. Couldn't have done it alone.", "Sam T.", "MIT MEng '27", pic13),
      R("My SOP went from fine to the thing the committee mentioned in my acceptance.", "Lena F.", "Columbia MS '26", pic14),
      R("My coach had been on the admissions committee. Unfair advantage.", "Marco R.", "CMU MS '27", pic11),
    ],
  },
  "Medical school": {
    title: "210+ med school admissions experts are here to get you in",
    subline:
      "Current MDs, residents, and former AdCom members — the people who sat on the other side of your interview are here to coach you through it.",
    orgs: ["Harvard", "Johns Hopkins", "Stanford", "UCSF", "Penn", "Columbia", "Mayo"],
    reviews: [
      R("Reapplicant with a 3.4. Coached, retold my story — five interviews, three acceptances.", "Nate O.", "Hopkins MD '30", pic13),
      R("My coach is a resident who did AdCom. Mock interviews were harder than the real ones.", "Jess L.", "UCSF MD '30", pic10),
      R("Secondaries done in half the time, and they were actually good.", "Ravi P.", "Penn MD '30", pic11),
    ],
  },
  "Law school": {
    title: "180+ law school admissions experts are here to get you in",
    subline:
      "T14 admits and former admissions readers — learn exactly how personal statements, LSAT strategy, and school selection play out from people who've lived it.",
    orgs: ["Yale", "Stanford", "Harvard", "UChicago", "NYU", "Columbia", "Penn"],
    reviews: [
      R("Yale, Stanford, Harvard — full scholarship at two. My coach mapped every move.", "Chloe B.", "YLS '28", pic2),
      R("Went from 162 to 174 with a coach who taught LSAT for a living.", "Devin H.", "Columbia Law '28", pic13),
      R("My statement went through six drafts with a former NYU reader. Worth every one.", "Aisha N.", "NYU Law '28", pic10),
    ],
  },
  "PhD programs": {
    title: "90+ PhD admissions experts are here to get you in",
    subline:
      "Current doctoral students and faculty who've served on admissions committees — the rare people who can tell you what 'research fit' really means at your target labs.",
    orgs: ["MIT", "Stanford", "Berkeley", "Harvard", "Caltech", "CMU", "Princeton"],
    reviews: [
      R("My coach helped me find the right advisor before I even applied. Funded offer from MIT.", "Wei Z.", "MIT PhD '31", pic11),
      R("Statement of purpose rewritten with a Stanford postdoc. Two top-5 offers.", "Hannah G.", "Stanford PhD '31", pic14),
      R("I didn't know how to cold-email faculty. Now I had three replies before decisions.", "Tomás L.", "Berkeley PhD '31", pic13),
    ],
  },

  /* ── career ── */
  Consulting: {
    title: "200+ consulting experts are here to get you the offer",
    subline:
      "Current and former McKinsey, Bain, and BCG consultants who've run real interviews — the best place in the world to learn casing from the people who give the cases.",
    orgs: ["McKinsey", "Bain", "BCG", "Kearney", "L.E.K.", "Deloitte", "Accenture"],
    reviews: [
      R("Went from rejected to a McKinsey offer. My coach saw everything.", "Karen J.", "Associate, McKinsey", pic12),
      R("Ten mock cases with a former Bain interviewer. Walked into the real one calm.", "Owen D.", "Consultant, Bain", pic13),
      R("BCG offer from a non-target school. Coaching was the whole difference.", "Yara K.", "Associate, BCG", pic10),
    ],
  },
  "Product management": {
    title: "240+ product experts are here to get you the offer",
    subline:
      "PMs and hiring managers from Google, Meta, and Stripe who've run hundreds of PM loops — learn the product sense and execution rounds from people who decide who gets hired.",
    orgs: ["Google", "Meta", "Stripe", "Airbnb", "Uber", "Atlassian", "Salesforce"],
    reviews: [
      R("Landed the PM role I'd been chasing for two years.", "Tomás L.", "PM, Stripe", pic13),
      R("My coach was a Google PM hiring manager. Every answer got tighter.", "Nadia R.", "PM, Google", pic10),
      R("Engineer to PM in four months. Didn't think it was possible.", "Chris W.", "APM, Meta", pic11),
    ],
  },
  "Investment banking & finance": {
    title: "170+ banking & finance experts are here to get you the offer",
    subline:
      "Analysts, associates, and VPs from Goldman, Morgan Stanley, and JPMorgan — the only place to learn technicals and superday prep from people who've sat on the other side of the table.",
    orgs: ["Goldman Sachs", "Morgan Stanley", "JP Morgan", "Evercore", "Lazard", "Blackstone", "KKR"],
    reviews: [
      R("Three mock interviews and I walked in unshakeable.", "Grace W.", "IB Analyst, GS", pic14),
      R("Non-target, no connections. Coached for two months — two superdays, one offer.", "Luis M.", "Analyst, Morgan Stanley", pic13),
      R("My coach drilled technicals until they were reflex. Evercore offer.", "Ben S.", "Analyst, Evercore", pic11),
    ],
  },
  "Software engineering": {
    title: "300+ engineering experts are here to get you the offer",
    subline:
      "Senior and staff engineers from Google, Meta, and OpenAI who interview for a living — learn systems design and coding rounds from people who've made the hire/no-hire call.",
    orgs: ["Google", "Meta", "OpenAI", "Stripe", "Nvidia", "Amazon", "Apple"],
    reviews: [
      R("Failed four onsites. Coached for six weeks — offers from Google and Stripe.", "Ari P.", "SWE, Google", pic11),
      R("My coach was a staff eng at Meta. Systems design finally clicked.", "Mei L.", "SWE, Meta", pic10),
      R("Bootcamp grad to OpenAI. My coach believed it before I did.", "Jordan T.", "SWE, OpenAI", pic13),
    ],
  },
  "Venture capital & PE": {
    title: "190+ VC & PE experts are here to get you the offer",
    subline:
      "Investors from Sequoia, a16z, KKR, and Blackstone — learn deal walkthroughs, modeling tests, and how to actually get in the room from people who've done it.",
    orgs: ["Sequoia", "a16z", "KKR", "Blackstone", "Bain Capital", "General Catalyst", "Insight"],
    reviews: [
      R("LBO modeling test with a KKR associate. Passed the real one easily.", "Sofia A.", "Associate, KKR", pic10),
      R("Banking to VC in five months. My coach opened doors I didn't know existed.", "Nikhil V.", "Associate, a16z", pic13),
      R("My coach taught me to think like an investor, not an analyst.", "Emma H.", "Analyst, Sequoia", pic14),
    ],
  },
  "Marketing & growth": {
    title: "140+ marketing & growth experts are here to help you level up",
    subline:
      "Growth leads and CMOs from Airbnb, Uber, and Netflix — learn what actually drives growth from the people who've grown the companies you admire.",
    orgs: ["Airbnb", "Uber", "Netflix", "Meta", "Salesforce", "HubSpot", "Google"],
    reviews: [
      R("Got the Head of Growth role after three sessions on how to tell my story.", "Dana M.", "Head of Growth, Series B", pic10),
      R("My coach ran growth at Uber. I stopped guessing and started shipping.", "Kai R.", "Growth PM, Airbnb", pic11),
      R("Landed a marketing lead role at a company I'd only dreamed of.", "Renee F.", "Marketing Lead, Netflix", pic14),
    ],
  },
  "Data & analytics": {
    title: "160+ data experts are here to get you the offer",
    subline:
      "Data scientists and analytics leads from Meta, Netflix, and Stripe — learn SQL, stats, and case rounds from people who run those interviews every week.",
    orgs: ["Meta", "Netflix", "Stripe", "Google", "Airbnb", "Uber", "Amazon"],
    reviews: [
      R("SQL and product-sense rounds with a Meta DS. Two offers in three weeks.", "Ivy C.", "Data Scientist, Meta", pic10),
      R("My coach reframed my experience and I stopped getting screened out.", "Marcus B.", "Analyst, Netflix", pic13),
      R("A/B testing questions finally made sense. Stripe offer.", "Lila N.", "Data Scientist, Stripe", pic2),
    ],
  },
  Entrepreneurship: {
    title: "120+ founders & operators are here to help you build it",
    subline:
      "YC alumni, funded founders, and operators who've scaled to exits — the best place in the world to learn from people who've actually built what you're building.",
    orgs: ["Y Combinator", "a16z", "Sequoia", "Stripe", "Airbnb", "Shopify", "OpenAI"],
    reviews: [
      R("Shipped a real AI product in 8 weeks and quit my job a month later.", "Andre S.", "Founder, Loomly AI", pic11),
      R("My coach had raised twice. We rebuilt my deck — and closed a pre-seed.", "Tara V.", "Founder, seed stage", pic10),
      R("Went from idea to first paying customers with weekly sessions.", "Jonah L.", "Founder", pic13),
    ],
  },

  /* ── AI ── */
  "Build with AI in my current role": {
    title: "500+ AI experts are here to help you build it",
    subline:
      "Practitioners from Google, OpenAI, and Bain who use AI every day in real jobs — learn the workflows that save 10+ hours a week from people who actually run them.",
    orgs: ["OpenAI", "Google", "Anthropic", "Bain", "JP Morgan", "Microsoft", "Meta"],
    reviews: [
      R("Automated my whole reporting week. My manager thinks I'm a wizard.", "Priya D.", "Ops Manager, JP Morgan", pic10),
      R("Built three internal tools in a month. Zero coding background.", "Ben K.", "Analyst, Bain", pic13),
      R("Shipped a real AI product in 8 weeks and quit my job a month later.", "Andre S.", "Founder, Loomly AI", pic11),
    ],
  },
  "Break into an AI career": {
    title: "140+ AI career experts are here to get you the offer",
    subline:
      "People who made the switch into AI roles at OpenAI, Anthropic, and Google — the only place to learn the path from people who walked it recently.",
    orgs: ["OpenAI", "Anthropic", "Google DeepMind", "Meta", "Nvidia", "Scale", "Cohere"],
    reviews: [
      R("Marketing to AI PM in six months. My coach mapped every step.", "Lena T.", "AI PM, Anthropic", pic14),
      R("Bootcamp grad to OpenAI. My coach believed it before I did.", "Jordan T.", "SWE, OpenAI", pic13),
      R("Got my first AI role after a portfolio my coach helped me design.", "Sam H.", "Applied AI, Scale", pic11),
    ],
  },
  "AI & machine learning engineering": {
    title: "95+ ML engineering experts are here to get you the offer",
    subline:
      "ML engineers and researchers from DeepMind, OpenAI, and Nvidia — learn ML systems design and the research-to-production gap from people who've shipped models at scale.",
    orgs: ["Google DeepMind", "OpenAI", "Nvidia", "Meta AI", "Anthropic", "Tesla", "Apple"],
    reviews: [
      R("ML systems design rounds with a DeepMind engineer. Offer in a month.", "Wei Z.", "MLE, Google", pic11),
      R("My coach reviewed my projects like a hiring manager would. Everything changed.", "Aditi R.", "MLE, Nvidia", pic10),
      R("Research to production — my coach had done exactly that. Meta offer.", "Tom F.", "MLE, Meta AI", pic13),
    ],
  },
  "AI for product": {
    title: "180+ AI product experts are here to help you build it",
    subline:
      "PMs shipping AI features at Google, Notion, and OpenAI — learn how to scope, evaluate, and launch AI products from people doing it right now.",
    orgs: ["OpenAI", "Google", "Notion", "Anthropic", "Figma", "Stripe", "Meta"],
    reviews: [
      R("Shipped our first AI feature in a quarter. My coach had done it at Notion.", "Claire O.", "PM, Series C", pic10),
      R("Learned evals from someone at OpenAI. Our launch actually worked.", "Dev P.", "AI PM, Figma", pic13),
      R("Went from 'we should add AI' to a roadmap the exec team loved.", "Rosa M.", "Product Lead", pic14),
    ],
  },
  "AI for sales & marketing": {
    title: "130+ AI go-to-market experts are here to help you build it",
    subline:
      "Sales and marketing leaders from Salesforce, HubSpot, and Gong who've rebuilt their funnels with AI — learn the playbooks that work from the people who wrote them.",
    orgs: ["Salesforce", "HubSpot", "Gong", "Google", "Meta", "Stripe", "Shopify"],
    reviews: [
      R("Cut outbound prep from hours to minutes. Pipeline doubled.", "Miles J.", "AE, Salesforce", pic13),
      R("My coach showed me how to run AI content ops. Team of one, output of five.", "Nora K.", "Marketing Lead", pic10),
      R("Built a lead-scoring system with no engineering help.", "Zach R.", "RevOps, HubSpot", pic11),
    ],
  },
  "AI for data & analytics": {
    title: "110+ AI data experts are here to help you build it",
    subline:
      "Data leads from Netflix, Stripe, and Airbnb who've put LLMs to work on real analytics — learn from people who've actually done it, not just talked about it.",
    orgs: ["Netflix", "Stripe", "Airbnb", "Google", "Snowflake", "Databricks", "Meta"],
    reviews: [
      R("Built an AI analyst that answers exec questions in seconds. Promoted.", "Ivy C.", "Data Lead, Netflix", pic10),
      R("My coach helped me set up LLM pipelines on our warehouse in two weeks.", "Marcus B.", "Analytics Eng, Stripe", pic13),
      R("Went from dashboards to AI-driven insights. Whole team uses it now.", "Lila N.", "Data Scientist, Airbnb", pic2),
    ],
  },
};

const FALLBACK: Resonance = {
  title: "Thousands of experts are here to help with that",
  subline:
    "Leland is the best place in the world to learn directly from people who've done exactly what you're trying to do.",
  orgs: ["McKinsey", "Google", "Harvard", "Stanford", "Goldman Sachs", "Meta", "OpenAI"],
  reviews: DEFAULT_REVIEWS,
};

/** Copy for the reassurance screen. Uses the primary (first-picked) category. */
export function resonanceFor(categories: string[]): Resonance {
  const primary = categories[0];
  const r = (primary && RESONANCE[primary]) || FALLBACK;
  // "200+ consulting experts are here…" → "consulting"; "120+ founders & operators…" → "founders & operators"
  const emphasis = r.title.match(/^\S+ (.+?) (?:experts|are here)/)?.[1];
  return { ...r, emphasis };
}
