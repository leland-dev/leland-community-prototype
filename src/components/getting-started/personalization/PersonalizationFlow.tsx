import type { FlowProps } from "../index";
import { QuizEngine, type Question } from "../quiz-engine/QuizEngine";

const ROLES = [
  "Software Engineer / Developer",
  "Product Manager",
  "Designer / UX",
  "Data Analyst / Scientist",
  "Marketing",
  "Sales",
  "Operations",
  "Finance / Accounting",
  "HR / People",
  "Legal",
  "Executive / Leadership",
  "Founder / Entrepreneur",
  "Other",
];

const INDUSTRIES = [
  "Technology",
  "Finance / Banking",
  "Healthcare",
  "Education",
  "Consulting",
  "Retail / E-commerce",
  "Media / Entertainment",
  "Manufacturing",
  "Real Estate",
  "Government / Nonprofit",
  "Legal",
  "Other",
];

const TASK_LABELS: Record<string, string> = {
  email: "Email & Slack",
  data: "Data & slides",
  admin: "Admin tasks",
  meetings: "Meetings & calls",
  writing: "Writing & editing",
  research: "Research",
};

const QUESTIONS: Question[] = [
  {
    id: "employment",
    eyebrow: "About you",
    title: "What best describes your current situation?",
    type: "single",
    columns: 1,
    options: [
      { value: "full-time", label: "Employed full-time" },
      { value: "part-time", label: "Employed part-time" },
      { value: "self-employed", label: "Self-employed / freelance" },
      { value: "between-roles", label: "Between roles" },
      { value: "student", label: "Student" },
    ],
  },
  {
    id: "role",
    eyebrow: "About you",
    title: "What's your role?",
    type: "dropdown",
    options: ROLES,
    placeholder: "Select your role",
    showIf: (a) => a.employment !== "student",
  },
  {
    id: "industry",
    eyebrow: "About you",
    title: "What industry are you in?",
    type: "dropdown",
    options: INDUSTRIES,
    placeholder: "Select your industry",
    showIf: (a) => a.employment !== "student",
  },
  {
    id: "team-size",
    eyebrow: "About you",
    title: "How big is your team?",
    type: "single",
    columns: 1,
    optional: true,
    options: [
      { value: "solo", label: "Just me" },
      { value: "2-10", label: "2–10" },
      { value: "11-50", label: "11–50" },
      { value: "51-250", label: "51–250" },
      { value: "250+", label: "250+" },
    ],
    showIf: (a) => a.employment !== "student" && a.employment !== "between-roles",
  },
  {
    id: "motivation",
    eyebrow: "Your goals",
    title: "Why are you starting Level 1 now?",
    subhead: "Select everything that applies.",
    type: "multi",
    columns: 1,
    otherValue: "other",
    options: [
      { value: "catch-up", label: "I'm behind peers and want to catch up" },
      { value: "company", label: "My manager or company asked me to" },
      { value: "career", label: "I want a promotion or new role" },
      { value: "automate", label: "I want to automate tedious work" },
      { value: "explore", label: "I'm generally exploring AI" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "goal",
    eyebrow: "Your goals",
    title: "What does success look like for you after this program?",
    type: "textarea",
    placeholder: "In a few sentences, describe what you're hoping to walk away with…",
  },
  {
    id: "daily-work",
    eyebrow: "Your work",
    title: "What do you spend time on most days?",
    subhead: "Optional — helps us tailor examples and exercises.",
    type: "textarea",
    optional: true,
    placeholder: "e.g. responding to emails, preparing decks, running analysis, attending meetings…",
  },
  {
    id: "time-split",
    eyebrow: "Your work",
    title: "Roughly how many hours a week do you spend on each?",
    subhead: "Drag to estimate — don't stress about precision.",
    type: "sliders",
    unit: "hrs/wk",
    max: 20,
    items: [
      { key: "email", label: "Email & Slack", hint: "Reading, writing, and managing messages" },
      { key: "data", label: "Data & slides", hint: "Spreadsheets, reports, presentations" },
      { key: "admin", label: "Admin tasks", hint: "Scheduling, filing, tracking" },
      { key: "meetings", label: "Meetings & calls", hint: "Prep, attendance, follow-up" },
    ],
  },
  {
    id: "off-plate",
    eyebrow: "Your work",
    title: "Which would you most want off your plate?",
    subhead: "Rank your top 3 — tap in order.",
    type: "rank",
    max: 3,
    options: [
      { value: "email", label: "Email & Slack" },
      { value: "data", label: "Data & slides" },
      { value: "admin", label: "Admin tasks" },
      { value: "meetings", label: "Meetings & calls" },
      { value: "writing", label: "Writing & editing" },
      { value: "research", label: "Research" },
    ],
  },
  {
    id: "top-task-today",
    eyebrow: "Your work",
    title: (a) => {
      const ranked = a["off-plate"] as string[] | undefined;
      const top = ranked?.[0];
      const label = top ? TASK_LABELS[top] ?? top : "your top task";
      return `How is ${label} handled today?`;
    },
    type: "single",
    columns: 1,
    showIf: (a) => {
      const ranked = a["off-plate"] as string[] | undefined;
      return Array.isArray(ranked) && ranked.length > 0;
    },
    options: [
      { value: "by-hand", label: "Entirely by hand — I do it all myself" },
      { value: "partly", label: "Partly automated — I use some tools but still do a lot manually" },
      { value: "largely", label: "Largely automated — tools handle most of it, I just review" },
    ],
  },
  {
    id: "ai-use",
    eyebrow: "Your AI experience",
    title: "Which of these do you currently use AI for?",
    subhead: "Select everything that applies.",
    type: "chips",
    otherValue: "other",
    options: [
      { value: "drafting", label: "Drafting emails or messages" },
      { value: "summarizing", label: "Summarizing documents" },
      { value: "coding", label: "Writing code" },
      { value: "researching", label: "Researching topics" },
      { value: "images", label: "Generating images" },
      { value: "notes", label: "Taking meeting notes" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "ai-sentiment",
    eyebrow: "Your AI experience",
    title: "How do you feel AI is performing for you so far?",
    type: "single",
    columns: 1,
    options: [
      { value: "great", label: "Great — it's already saving me significant time" },
      { value: "decent", label: "Decent — but I'm not getting the most out of it" },
      { value: "underwhelming", label: "Underwhelming — the outputs aren't where I need them" },
      { value: "not-yet", label: "I haven't really used AI yet" },
    ],
  },
  {
    id: "blockers",
    eyebrow: "Your AI experience",
    title: "What's held you back from using AI more?",
    subhead: "Select everything that applies.",
    type: "multi",
    columns: 1,
    otherValue: "other",
    options: [
      { value: "tools", label: "I'm not sure which tools to use" },
      { value: "quality", label: "The outputs aren't consistent or good enough" },
      { value: "time", label: "I don't have time to experiment" },
      { value: "privacy", label: "Privacy or security concerns" },
      { value: "efficient", label: "My workflow is already efficient" },
      { value: "other", label: "Other" },
    ],
  },
];

export function PersonalizationFlow({ onContinue, onComplete }: FlowProps) {
  return (
    <QuizEngine
      questions={QUESTIONS}
      progressLabel="Personalization"
      completeTitle="You're all set."
      completeSubhead="We'll use your answers to tailor exercises, examples, and recommendations throughout the program."
      onContinue={onContinue ?? onComplete}
    />
  );
}
