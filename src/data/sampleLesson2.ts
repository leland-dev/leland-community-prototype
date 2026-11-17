// Hand-authored sample content for Lesson 2, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from
// the real Session 2 guide. Lesson 1 uses the same pattern; see sampleLesson.ts.
import type { Block, BlockSection, RoleBuildPickerBlock } from "./lessonBlocks";
import { pickRoleBuild } from "./lessonBlocks";
import {
  GENERIC_WORKFLOW_TUTORIAL,
  SALES_LEAD_GEN_BOT_TUTORIAL,
  SALES_PRICING_LAB_TUTORIAL,
  SALES_PRECALL_BRIEFING_TUTORIAL,
  SALES_COLD_OUTREACH_ENGINE_TUTORIAL,
  SALES_DEAL_FOLLOWUP_AGENT_TUTORIAL,
  MARKETING_BRAND_VOICE_GUIDE_TUTORIAL,
  MARKETING_BRAND_VOICE_CHECKER_TUTORIAL,
  PEOPLE_1ON1_PREP_TUTORIAL,
  PEOPLE_ONBOARDING_ASSISTANT_TUTORIAL,
  PEOPLE_INTERVIEW_SCHEDULING_TUTORIAL,
  PEOPLE_INTERVIEW_SCORECARDS_TUTORIAL,
  PEOPLE_JOB_DESCRIPTION_GENERATOR_TUTORIAL,
  PEOPLE_HR_BOT_TUTORIAL,
  PEOPLE_RESUME_SCREENS_TUTORIAL,
  PEOPLE_INTERVIEW_DEBRIEF_TUTORIAL,
  FINANCE_PERSONAL_BUDGET_TUTORIAL,
  FINANCE_EXPENSE_CATEGORIZATION_TUTORIAL,
  FINANCE_INVOICE_BOOKKEEPING_TUTORIAL,
  FINANCE_CASH_FLOW_FORECAST_TUTORIAL,
  FINANCE_BUDGET_VS_ACTUALS_TUTORIAL,
  FINANCE_MONTH_END_CLOSE_TUTORIAL,
  FINANCE_COLLECTIONS_EMAILS_TUTORIAL,
  FINANCE_INVOICE_PO_DATA_ENTRY_TUTORIAL,
  FINANCE_REPORTS_ACCURATE_DATA_TUTORIAL,
  PRODUCT_CUSTOMER_INTERVIEW_ANALYZER_TUTORIAL,
  PRODUCT_USER_INTERVIEW_PROCESS_TUTORIAL,
  PRODUCT_SPEC_TO_PROTOTYPE_TUTORIAL,
  PRODUCT_IDEA_TO_PRD_TUTORIAL,
  PRODUCT_FEEDBACK_THEME_TRACKER_TUTORIAL,
  PRODUCT_BACKLOG_PRIORITIZER_TUTORIAL,
  PRODUCT_COMPETITOR_RESEARCH_REPORT_TUTORIAL,
  PRODUCT_AB_TEST_READOUTS_TUTORIAL,
  OPERATIONS_RECURRING_REPORTS_TUTORIAL,
  OPERATIONS_WORK_GETS_STUCK_TUTORIAL,
  OPERATIONS_MEETING_ACTION_ITEMS_TUTORIAL,
  OPERATIONS_REPETITIVE_PROCESS_WALKTHROUGH_TUTORIAL,
} from "./roleBuildTutorials";
import imgCallCoach from "../assets/img/builds/sales-call-coach.svg";
import imgColdOutboundEmail from "../assets/img/builds/cold-outbound-email.svg";
import imgPrecallBriefing from "../assets/img/builds/precall-briefing.svg";
import imgTriage from "../assets/img/builds/triage-agent.svg";
import imgMetrics from "../assets/img/builds/metrics-digest.svg";
import imgPrompts from "../assets/img/builds/prompt-library.svg";
import imgNotes from "../assets/img/builds/meeting-notes.svg";
import imgLeadBrief from "../assets/img/builds/lead-brief.svg";
import imgCashFlowForecast from "../assets/img/builds-v2/cash-flow-forecast.svg";
import imgResumeScreening from "../assets/img/builds-v2/resume-screening.svg";
import imgAbTestReadout from "../assets/img/builds-v2/ab-test-readout.svg";
import imgOnboardingChecklist from "../assets/img/builds-v2/onboarding-checklist.svg";

// Placed above the lesson body on every section of Lesson 2.
export const LESSON_2_TOP_BLOCKS: Block[] = [
  {
    kind: "liveSessionBanner",
    month: "MAY",
    day: "5",
    time: "May 5, 11:00 AM PT",
    sessionTitle: "Automate communication in your voice",
    countdownLabel: "2 weeks",
    recordingVideoSrc:
      "https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4",
  },
];

// Pulled out (rather than inlined in the build-4 section below) so Program
// Hub's "Up Next" card can derive the same role-scoped default build without
// duplicating this data — see pickLesson2Build.
export const LESSON_2_ROLE_BUILD_PICKER: RoleBuildPickerBlock = {
  kind: "roleBuildPicker",
  fallback: {
    value: "generic",
    label: "Generic",
    builds: [
      {
        id: "generic-workflow",
        buildTitle: "Scope your first custom workflow",
        tutorial: GENERIC_WORKFLOW_TUTORIAL,
      },
    ],
  },
  // Every build below is a real tutorial from the actual Leland library,
  // confirmed via leland-ops search_resources against the "sales",
  // "marketing", "human-resources", "ai-for-finance", "ai-product-management"
  // and "business-strategy-and-operations" categories — no prototype-original
  // placeholders. Builds with no local image asset fall back to the generic
  // AI Builder tile rather than reusing a mismatched one; step content is a
  // lorem ipsum stub until these get their own authored tutorial, same as
  // other not-yet-authored builds elsewhere in this prototype.
  options: [
    {
      value: "sales",
      label: "Sales",
      matchesRoles: ["sales"],
      builds: [
        {
          id: "sales-lead-gen-bot",
          buildTitle: "Build a signal-based lead gen bot",
          description: "A system that watches a specific niche for buying signals and drafts a short personalized outreach the moment one appears.",
          tutorial: SALES_LEAD_GEN_BOT_TUTORIAL,
        },
        {
          id: "sales-pricing-lab",
          buildTitle: "Design a pricing and packaging lab",
          description: "A system that turns customer interview notes into a three-tier pricing table with a defensible launch price for each tier.",
          tutorial: SALES_PRICING_LAB_TUTORIAL,
        },
        {
          id: "sales-precall-briefing",
          buildTitle: "Build a pre-call research briefing agent",
          description: "A system that checks your calendar before each sales call and hands you a one-page brief on what changed and what to say.",
          tutorial: SALES_PRECALL_BRIEFING_TUTORIAL,
          image: imgPrecallBriefing,
        },
        {
          id: "sales-cold-outreach-engine",
          buildTitle: "Build a cold outreach personalization engine",
          description: "A system that drafts a personalized cold email for one prospect using a real signal about them, and refuses to draft without one.",
          tutorial: SALES_COLD_OUTREACH_ENGINE_TUTORIAL,
          image: imgColdOutboundEmail,
        },
        {
          id: "sales-deal-followup-agent",
          buildTitle: "Build a deal follow-up reminder agent",
          description: "A system that checks your pipeline every day and sends you a short message naming the deals that need a follow-up, and why.",
          tutorial: SALES_DEAL_FOLLOWUP_AGENT_TUTORIAL,
        },
      ],
    },
    {
      value: "marketing",
      label: "Marketing",
      matchesRoles: ["marketing"],
      builds: [
        {
          id: "marketing-brand-voice-guide",
          buildTitle: "Create a brand voice guide from content you've already written",
          description: "A system that reads content you've already written and turns it into a written brand voice guide.",
          tutorial: MARKETING_BRAND_VOICE_GUIDE_TUTORIAL,
        },
        {
          id: "marketing-brand-voice-checker",
          buildTitle: "Build a brand voice checker for everything you ship",
          description: "A system that scores any draft against your brand voice guide and flags the exact lines that read generic or off-tone before it ships.",
          tutorial: MARKETING_BRAND_VOICE_CHECKER_TUTORIAL,
        },
      ],
    },
    {
      value: "people",
      label: "Human Resources",
      matchesRoles: ["hr"],
      builds: [
        {
          id: "people-1on1-prep",
          buildTitle: "Build a 1:1 prep assistant",
          description: "A system that pulls prior notes, goals, and open commitments for one person before your 1:1 and hands you a short brief.",
          tutorial: PEOPLE_1ON1_PREP_TUTORIAL,
          image: imgCallCoach,
        },
        {
          id: "people-onboarding-assistant",
          buildTitle: "Build a new hire onboarding assistant",
          description: "A system that walks new hires through their first-week checklist day by day and tracks what's done.",
          tutorial: PEOPLE_ONBOARDING_ASSISTANT_TUTORIAL,
          image: imgOnboardingChecklist,
        },
        {
          id: "people-interview-scheduling",
          buildTitle: "Automate interview scheduling",
          description: "A system that checks interviewer and candidate availability, proposes times across a full panel, and locks a confirmed schedule.",
          tutorial: PEOPLE_INTERVIEW_SCHEDULING_TUTORIAL,
          image: imgColdOutboundEmail,
        },
        {
          id: "people-interview-scorecards",
          buildTitle: "Create interview scorecards for every role",
          description: "A system that turns a job description into a structured scorecard so every interviewer rates the same things the same way.",
          tutorial: PEOPLE_INTERVIEW_SCORECARDS_TUTORIAL,
          image: imgMetrics,
        },
        {
          id: "people-job-description-generator",
          buildTitle: "Build a job description generator",
          description: "A system that turns a rough role brief into a polished, bias-checked job description ready to post.",
          tutorial: PEOPLE_JOB_DESCRIPTION_GENERATOR_TUTORIAL,
        },
        {
          id: "people-hr-bot",
          buildTitle: "Build a bot to answer common HR questions",
          description: "A system that answers employee HR questions from your own policy documents and escalates whatever it shouldn't guess at.",
          tutorial: PEOPLE_HR_BOT_TUTORIAL,
          image: imgColdOutboundEmail,
        },
        {
          id: "people-resume-screens",
          buildTitle: "Automate resume screens",
          description: "A system that scores resumes against your criteria, then reruns blinded to catch bias before anyone acts on the ranking.",
          tutorial: PEOPLE_RESUME_SCREENS_TUTORIAL,
          image: imgResumeScreening,
        },
        {
          id: "people-interview-debrief-summaries",
          buildTitle: "Automate interview debrief summaries",
          description: "A system that turns raw interviewer notes into a structured debrief keyed to your scorecard so every candidate gets compared the same way.",
          tutorial: PEOPLE_INTERVIEW_DEBRIEF_TUTORIAL,
          image: imgPrecallBriefing,
        },
      ],
    },
    {
      value: "finance",
      label: "Finance",
      matchesRoles: ["finance"],
      builds: [
        {
          id: "finance-personal-budget",
          buildTitle: "Build your personal budget with Claude",
          description: "Ship a working Excel budget dashboard and a Claude Project that runs your monthly review in 5-8 minutes.",
          tutorial: FINANCE_PERSONAL_BUDGET_TUTORIAL,
        },
        {
          id: "finance-expense-categorization",
          buildTitle: "Automate expense categorization",
          description: "A system that checks every transaction against your chart of accounts and flags anything it isn't confident about.",
          tutorial: FINANCE_EXPENSE_CATEGORIZATION_TUTORIAL,
        },
        {
          id: "finance-invoice-bookkeeping",
          buildTitle: "Automate your invoice bookkeeping",
          description: "A system that reads each vendor invoice as it arrives and drafts a journal entry for you to approve before it posts.",
          tutorial: FINANCE_INVOICE_BOOKKEEPING_TUTORIAL,
          image: imgMetrics,
        },
        {
          id: "finance-cash-flow-forecast",
          buildTitle: "Build a rolling cash flow forecast",
          description: "A system that turns your bank, AR, and AP data into a rolling cash forecast every week and flags any shortfall ahead of time.",
          tutorial: FINANCE_CASH_FLOW_FORECAST_TUTORIAL,
          image: imgCashFlowForecast,
        },
        {
          id: "finance-budget-vs-actuals",
          buildTitle: "Automate your budget vs. actuals reporting",
          description: "A system that reads your budget-vs-actual data at the end of each reporting period and writes a variance narrative you can drop into a board deck, with every number sourced.",
          tutorial: FINANCE_BUDGET_VS_ACTUALS_TUTORIAL,
        },
        {
          id: "finance-month-end-close",
          buildTitle: "Build a month-end close checklist agent",
          description: "A system that tracks your month-end close checklist against target dates and flags what's overdue or blocked, grouped by owner.",
          tutorial: FINANCE_MONTH_END_CLOSE_TUTORIAL,
        },
        {
          id: "finance-collections-emails",
          buildTitle: "Automate your collections emails",
          description: "A system that drafts a follow-up email for every overdue invoice on your AR aging report and holds it for your review before it sends.",
          tutorial: FINANCE_COLLECTIONS_EMAILS_TUTORIAL,
        },
        {
          id: "finance-invoice-po-data-entry",
          buildTitle: "Automate invoice and PO data entry",
          description: "A system that pulls vendor, amount, line items, and dates off invoices or POs and gets them into your tracker without manual entry.",
          tutorial: FINANCE_INVOICE_PO_DATA_ENTRY_TUTORIAL,
          image: imgPrompts,
        },
        {
          id: "finance-reports-accurate-data",
          buildTitle: "Create financial reports with accurate data and formatting",
          description: "A report system that pulls every figure from your source of truth, formats it your way, and flags anything it can't trace before the report ships.",
          tutorial: FINANCE_REPORTS_ACCURATE_DATA_TUTORIAL,
        },
      ],
    },
    {
      value: "product",
      label: "Product",
      matchesRoles: ["pm"],
      builds: [
        {
          id: "product-customer-interview-analyzer",
          buildTitle: "Build a customer interview analyzer",
          description: "A system that reads your customer interview notes and keeps a running document of validated pain points, objections, and quotes.",
          tutorial: PRODUCT_CUSTOMER_INTERVIEW_ANALYZER_TUTORIAL,
          image: imgNotes,
        },
        {
          id: "product-user-interview-process",
          buildTitle: "Automate the user interview process",
          description: "A system that reads a batch of interview transcripts and returns recurring pains and contradictions, each tied to a quote.",
          tutorial: PRODUCT_USER_INTERVIEW_PROCESS_TUTORIAL,
          image: imgTriage,
        },
        {
          id: "product-spec-to-prototype",
          buildTitle: "Design an agent system that turns specs into prototypes",
          description: "A system that turns an approved spec into a working prototype your team can react to right away.",
          tutorial: PRODUCT_SPEC_TO_PROTOTYPE_TUTORIAL,
        },
        {
          id: "product-idea-to-prd",
          buildTitle: "Build an idea-to-PRD generator",
          description: "A system that turns a rough feature idea into a first-draft PRD ready for a human editor.",
          tutorial: PRODUCT_IDEA_TO_PRD_TUTORIAL,
        },
        {
          id: "product-feedback-theme-tracker",
          buildTitle: "Build a feedback theme tracker",
          description: "A system that pulls in tickets, reviews, and surveys, and returns them clustered into ranked themes backed by quotes.",
          tutorial: PRODUCT_FEEDBACK_THEME_TRACKER_TUTORIAL,
          image: imgPrompts,
        },
        {
          id: "product-backlog-prioritizer",
          buildTitle: "Build a backlog prioritizer",
          description: "A system that scores your backlog on impact, effort, confidence, and strategic alignment, and returns a ranked list with the reasoning attached.",
          tutorial: PRODUCT_BACKLOG_PRIORITIZER_TUTORIAL,
        },
        {
          id: "product-competitor-research-report",
          buildTitle: "Create a weekly competitor research report",
          description: "A system that checks your competitors' public pages every week and sends you a cited digest of what changed.",
          tutorial: PRODUCT_COMPETITOR_RESEARCH_REPORT_TUTORIAL,
        },
        {
          id: "product-ab-test-readouts",
          buildTitle: "Automate your A/B test readouts",
          description: "A system that turns your A/B test results into a plain-language readout naming the outcome, the uncertainty behind it, and one recommended next step.",
          tutorial: PRODUCT_AB_TEST_READOUTS_TUTORIAL,
          image: imgAbTestReadout,
        },
      ],
    },
    {
      value: "operations",
      label: "Operations",
      matchesRoles: ["ops"],
      builds: [
        {
          id: "operations-recurring-reports",
          buildTitle: "Automate your recurring reports",
          description: "A system that pulls your recurring report's numbers, compares them to last period, and drafts the write-up for you to review and send.",
          tutorial: OPERATIONS_RECURRING_REPORTS_TUTORIAL,
          image: imgCallCoach,
        },
        {
          id: "operations-work-gets-stuck",
          buildTitle: "Build an agent that finds where work gets stuck",
          description: "A system that reads your tracker's timestamp data and ranks the process stages costing you the most time.",
          tutorial: OPERATIONS_WORK_GETS_STUCK_TUTORIAL,
          image: imgLeadBrief,
        },
        {
          id: "operations-meeting-action-items",
          buildTitle: "Automate action items from your meeting notes",
          description: "A system that turns a meeting transcript into owned action items and posts them where your team tracks work.",
          tutorial: OPERATIONS_MEETING_ACTION_ITEMS_TUTORIAL,
        },
        {
          id: "operations-invoice-po-data-entry",
          buildTitle: "Automate invoice and PO data entry",
          description: "A system that pulls vendor, amount, line items, and dates off invoices or POs and gets them into your tracker without manual entry.",
          tutorial: FINANCE_INVOICE_PO_DATA_ENTRY_TUTORIAL,
          image: imgPrompts,
        },
        {
          id: "operations-repetitive-process-walkthrough",
          buildTitle: "Automate a repetitive process from a recorded walkthrough",
          description: "A system that turns one recorded walkthrough into a numbered SOP someone else could follow.",
          tutorial: OPERATIONS_REPETITIVE_PROCESS_WALKTHROUGH_TUTORIAL,
        },
      ],
    },
  ],
};

// Same role → default-build logic as ContentBlocks' RoleBuildPicker — kept in
// sync so Program Hub's "Up Next" card always shows the build the learner
// would actually land on in the course viewer.
export function pickLesson2Build(knownRole: string | null): {
  buildTitle: string;
  image?: string;
  otherOptionsCount: number;
} {
  return pickRoleBuild(LESSON_2_ROLE_BUILD_PICKER, knownRole);
}

export const LESSON_2_SECTIONS: BlockSection[] = [
  {
    kind: "blocks",
    id: "welcome",
    title: "Welcome",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "Connect your real tools, teach Claude how you write, and set up your first automation that runs on its own.",
          "",
          "**By the end of this session you'll have:**",
          "",
          "- Your Google Workspace tools connected to Claude Cowork",
          "- A voice guide that makes Claude write like you",
          "- A scheduled email manager that drafts on autopilot",
          "- A scoped custom workflow ready to build next",
          "- All four builds documented in your portfolio",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Before you start",
        content: [
          {
            kind: "markdown",
            body: "You'll need a **Google Workspace or Gmail account** and access to **Claude Cowork**. Have 5–10 recent emails you've written on hand — you'll use them to train your voice guide.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "intro",
    title: "Session intro",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What we're building today",
          "",
          "In this session you'll go from manually drafting every email to having an AI system that writes in your voice — and eventually runs on its own schedule.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Build", "What you do", "Output"],
        columnWidths: ["56px", "1fr", "1fr"],
        firstColumnBold: false,
        rows: [
          ["1", "Connect your tools", "Google Workspace linked to Claude Cowork"],
          ["2", "Create your email voice guide", "A reusable voice-guide prompt"],
          ["3", "Set up a scheduled email manager", "An automation that drafts on a timer"],
          ["4", "Scope your first custom workflow", "A workflow brief ready to build"],
          ["5", "Add your builds to your portfolio", "A shareable portfolio update"],
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "How this session runs",
        content: [
          {
            kind: "markdown",
            body: "Each build stacks on the previous one. You can pause after any step and still have something complete and useful. If you finish early, use the time to refine your voice guide — it pays dividends across all future builds.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "concepts",
    title: "Core frameworks",
    durationMin: 2,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### The voice guide",
          "",
          "A voice guide is a structured prompt that encodes how you write — your tone, sentence length, phrases you use, and things you avoid. Once built, you paste it before any writing task and Claude produces output that sounds like you, not like a generic AI.",
          "",
          "A strong voice guide has three parts: **tone** (how formal, warm, direct), **patterns** (sentence structure, opener style, sign-off), and **anti-patterns** (things you never say).",
        ].join("\n"),
      },
      {
        kind: "markdown",
        body: [
          "### The automation loop",
          "",
          "Every automation has the same three parts. Getting these clear before you build produces tighter prompts and fewer iterations.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Part", "Question it answers", "Example"],
        columnWidths: ["96px", "1fr", "1fr"],
        rows: [
          ["Trigger", "What starts the automation?", "Every Monday at 8 AM"],
          ["Action", "What does Claude do?", "Draft replies to unread emails over 48h old"],
          ["Output", "What gets produced?", "Draft saved in Gmail, ready to review and send"],
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Automation ≠ autopilot (yet)",
        content: [
          {
            kind: "markdown",
            body: "For this session, Claude drafts and you review before sending. True send-on-its-own automation comes after you've tuned the voice guide and trust the output — usually after 2–3 weeks of reviewing drafts.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-1",
    title: "Connect your tools",
    description: "Link Google Workspace to Claude Cowork so it can read and draft emails.",
    durationMin: 15,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: "Give Claude Cowork access to your Google Workspace so it can read threads, draft replies, and check your calendar — without you copy-pasting.",
      },
      {
        kind: "steps",
        items: [
          { text: "Open **Claude Cowork** and go to **Settings → Integrations**." },
          { text: "Select **Google Workspace** and click **Connect**." },
          { text: "Sign in with your Google account and grant the requested permissions (Gmail read/write, Calendar read)." },
          { text: "Return to Cowork and open a new conversation." },
          {
            text: "Type this command — if it returns results, the connection is live:",
            blocks: [{ kind: "code", language: "prompt", filename: "Prompt", code: "List the last 5 emails I haven't replied to" }],
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "Permission scope matters",
        content: [
          {
            kind: "markdown",
            body: "Grant **Gmail read and write**, not read-only. Drafting requires write access. If you only granted read, disconnect and reconnect with the full scope — the integration won't surface an error, it will just silently fail to create drafts.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Using a personal account?",
        content: [
          {
            kind: "markdown",
            body: "Gmail personal works the same as Workspace — the integration screen looks identical. If you use Outlook, skip the Google steps and connect **Microsoft 365** instead; the workflow in builds 2–4 is the same.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-2",
    title: "Create your email voice guide",
    description: "Teach Claude how you write so every draft sounds like you.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: "You'll feed Claude 5–10 emails you've written and ask it to reverse-engineer your writing style into a structured voice guide — a reusable prompt you paste before any writing task.",
      },
      {
        kind: "steps",
        items: [
          { text: "Find **5–10 emails** you've sent that you're happy with — mix of lengths and recipients." },
          { text: "In Claude Cowork, start a new conversation and paste all the emails." },
          {
            text: "Send Claude this prompt:",
            blocks: [{
              kind: "code",
              language: "prompt",
              filename: "Prompt",
              code: "Analyze these emails and extract my writing style as a voice guide. Include: tone, sentence length, opener patterns, sign-off style, and 5 phrases I use often. Also list 3 things I never write.",
            }],
          },
          { text: "Review Claude's output — add anything it missed, remove anything that doesn't feel right." },
          { text: "Save the final version as `voice-guide.md` in your Cowork project folder." },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Test it immediately",
        content: [
          {
            kind: "markdown",
            body: "Once your voice guide is saved, open a fresh conversation, paste the guide at the top, then ask Claude to draft a reply to a real email in your inbox. If it sounds off, go back and add more specific examples to the anti-patterns section.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Voice guides get better over time",
        content: [
          {
            kind: "markdown",
            body: [
              "Every time you edit a Claude draft before sending, note what you changed. After a week, update your voice guide with those corrections. Three common things to add:",
              "",
              "- Phrases Claude keeps using that you'd never write",
              "- Your preferred way to handle specific situations (following up, declining, asking for info)",
              "- Context about your role that changes how you write to different people",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-3",
    title: "Set up a scheduled email manager",
    description: "Create an automation that drafts email replies on a timer.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "blue" },
    blocks: [
      {
        kind: "markdown",
        body: "You'll build an automation that runs on a schedule, scans your inbox for emails that need replies, and drafts responses in your voice — ready for you to review and send.",
      },
      {
        kind: "steps",
        items: [
          { text: "In Claude Cowork, open **Automations → New automation**." },
          { text: "Set the **trigger**: Scheduled — every weekday at 8 AM." },
          {
            text: "Set the **action prompt** — paste your `voice-guide.md` at the top, then add this:",
            blocks: [{
              kind: "code",
              language: "prompt",
              filename: "Prompt",
              code: "Scan my Gmail inbox. Find emails older than 24 hours that I haven't replied to and that need a response. For each one, draft a reply in my voice. Save each draft in Gmail — do not send.",
            }],
          },
          { text: "Run it manually once to test: click **Run now** and check Gmail Drafts." },
          { text: "If the drafts look right, activate the schedule." },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Always paste your voice guide into automations",
        content: [
          {
            kind: "markdown",
            body: "Automations don't inherit context from past conversations. Paste your full `voice-guide.md` at the top of every automation prompt — it's the difference between drafts that sound like you and drafts that sound like a template.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "Review every draft before the first 2 weeks",
        content: [
          {
            kind: "markdown",
            body: "The automation will occasionally draft a reply to a newsletter, a receipt, or something you intentionally didn't respond to. Add this filter to your automation prompt:",
          },
          {
            kind: "code",
            language: "prompt",
            filename: "Prompt",
            code: "Skip emails from no-reply addresses and emails already labeled 'Newsletters'.",
          },
          {
            kind: "markdown",
            body: "Tune this over the first week based on what slips through.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-4",
    title: "Scope your first custom workflow",
    description: "Map out a workflow from your own work and write its brief.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Apply", color: "black" },
    blocks: [LESSON_2_ROLE_BUILD_PICKER],
  },
  {
    kind: "blocks",
    id: "build-5",
    title: "Add your builds to your portfolio",
    description: "Document today's builds in your portfolio site.",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: "Add today's builds to the portfolio you created in Lesson 1. A brief description of what each automation does — and a screenshot of it working — is enough.",
      },
      {
        kind: "steps",
        items: [
          { text: "Open the Claude Cowork project where your portfolio lives." },
          { text: "Screenshot your Gmail Drafts with a draft generated by the automation." },
          {
            text: "Prompt Claude:",
            blocks: [{
              kind: "code",
              language: "prompt",
              filename: "Prompt",
              code: "Add a new section to my portfolio called 'AI Communication System'. List these four builds with a 1-sentence description of each: (1) connected Google Workspace, (2) voice guide, (3) scheduled email manager, (4) [your custom workflow name].",
            }],
          },
          { text: "Paste in the screenshot and ask Claude to include it." },
          { text: "Publish the updated portfolio." },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "One screenshot is worth a paragraph",
        content: [
          {
            kind: "markdown",
            body: "A screenshot of a Gmail draft labeled *\"Written by Claude — reviewed by [your name]\"* shows the automation working end-to-end. Interviewers and collaborators understand it faster than any explanation.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "share",
    title: "Share what you built",
    durationMin: 3,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [{ kind: "shareBuildForm" }],
  },
  {
    kind: "blocks",
    id: "wrap",
    title: "Summary & next steps",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What you built",
          "",
          "- Google Workspace connected to Claude Cowork",
          "- A `voice-guide.md` that makes Claude write like you",
          "- A scheduled email manager that drafts replies automatically",
          "- A `workflow-[name].md` brief for your first custom automation",
          "- An updated portfolio with all four builds documented",
          "",
          "### Before Lesson 3",
          "",
          "- Let the email manager run for at least 3 days and review the drafts — note what it gets wrong",
          "- Update your voice guide with any corrections you made",
          "- Review the Lesson 3 pre-read: *Analyze Data and Design Presentations*",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Lesson 3 preview",
        content: [
          {
            kind: "markdown",
            body: "Next session: you'll go from raw spreadsheet to polished presentation — analyzing your data, finding the story in it, structuring a slide deck, and exporting it ready to share.",
          },
        ],
      },
    ],
  },
];
