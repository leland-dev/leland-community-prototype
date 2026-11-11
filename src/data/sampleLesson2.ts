// Hand-authored sample content for Lesson 2, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from
// the real Session 2 guide. Lesson 1 uses the same pattern; see sampleLesson.ts.
import type { Block, BlockSection } from "./lessonBlocks";
import {
  SALES_WORKFLOW_TUTORIAL,
  MARKETING_WORKFLOW_TUTORIAL,
  PEOPLE_WORKFLOW_TUTORIAL,
  FINANCE_WORKFLOW_TUTORIAL,
  PRODUCT_WORKFLOW_TUTORIAL,
  OPERATIONS_WORKFLOW_TUTORIAL,
  GENERIC_WORKFLOW_TUTORIAL,
} from "./roleBuildTutorials";

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
    label: { text: "Practice", color: "gray" },
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
    label: { text: "Practice", color: "gray" },
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
    label: { text: "Practice", color: "gray" },
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
    blocks: [
      {
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
        options: [
          {
            value: "sales",
            label: "Sales",
            matchesRoles: ["sales"],
            builds: [
              {
                id: "sales-workflow",
                buildTitle: "Scope a workflow for your sales follow-up",
                description: "Map the recap, CRM update, or check-in you do after almost every call.",
                tutorial: SALES_WORKFLOW_TUTORIAL,
              },
            ],
          },
          {
            value: "marketing",
            label: "Marketing",
            matchesRoles: ["marketing"],
            builds: [
              {
                id: "marketing-workflow",
                buildTitle: "Scope a workflow for your content or campaign reporting",
                description: "Map a recurring report, digest, or content-calendar update.",
                tutorial: MARKETING_WORKFLOW_TUTORIAL,
              },
            ],
          },
          {
            value: "people",
            label: "Human Resources",
            matchesRoles: ["hr"],
            builds: [
              {
                id: "people-workflow",
                buildTitle: "Scope a workflow for a recurring people-ops task",
                description: "Map an onboarding, benefits, or policy task tied to a date or event.",
                tutorial: PEOPLE_WORKFLOW_TUTORIAL,
              },
            ],
          },
          {
            value: "finance",
            label: "Finance",
            matchesRoles: ["finance"],
            builds: [
              {
                id: "finance-workflow",
                buildTitle: "Scope a workflow for a recurring report or reconciliation",
                description: "Map a monthly close, variance report, or reconciliation you run on a schedule.",
                tutorial: FINANCE_WORKFLOW_TUTORIAL,
              },
            ],
          },
          {
            value: "product",
            label: "Product",
            matchesRoles: ["pm"],
            builds: [
              {
                id: "product-workflow",
                buildTitle: "Scope a workflow for recurring product updates",
                description: "Map a changelog, status update, or triage pass you do on a schedule.",
                tutorial: PRODUCT_WORKFLOW_TUTORIAL,
              },
            ],
          },
          {
            value: "operations",
            label: "Operations",
            matchesRoles: ["ops"],
            builds: [
              {
                id: "operations-workflow",
                buildTitle: "Scope a workflow for a process you run again and again",
                description: "Map a checklist, rollup, or check you do the same way every time.",
                tutorial: OPERATIONS_WORKFLOW_TUTORIAL,
              },
            ],
          },
        ],
      },
    ],
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
