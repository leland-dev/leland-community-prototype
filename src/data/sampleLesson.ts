// Hand-authored sample content for Lesson 1, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from the
// real Session 1 guide. Lessons 2–4 still use the legacy HTML iframe manifest.
import type { Block, BlockSection } from "./lessonBlocks";
import {
  TOOL_SETUP_CLAUDE,
  TOOL_SETUP_CODEX,
  TOOL_SETUP_GEMINI,
  TOOL_SETUP_COPILOT,
} from "./toolSetupSections";
import leadGenBotImg from "../assets/community-builds/lead-gen-bot.png";
import churnedCustomerInterviewsImg from "../assets/community-builds/churned-customer-interviews.png";
import followUpEmailImg from "../assets/community-builds/follow-up-email.png";
import amazonBrandOutreachImg from "../assets/community-builds/amazon-brand-outreach.png";
import imgLeadBrief from "../assets/img/builds/lead-brief.svg";
import imgDemoDeck from "../assets/img/builds/demo-deck.svg";
import imgBrandedProposal from "../assets/img/builds/branded-proposal.svg";
import imgBrandedRecap from "../assets/img/builds/branded-recap.svg";
import imgBattlecard from "../assets/img/builds/battlecard.svg";
import imgCustomerWelcome from "../assets/img/builds/customer-welcome.svg";
import imgWinLoss from "../assets/img/builds/win-loss.svg";
import {
  SALES_TUTORIAL,
  SALES_PROPOSAL_TUTORIAL,
  SALES_RECAP_TUTORIAL,
  SALES_DEMO_DECK_TUTORIAL,
  LOREM_STUB_TUTORIAL,
  MARKETING_TUTORIAL,
  PEOPLE_TUTORIAL,
  FINANCE_TUTORIAL,
  PRODUCT_TUTORIAL,
  OPERATIONS_TUTORIAL,
  GENERIC_TUTORIAL,
} from "./roleBuildTutorials";

// Placed above the lesson body on every section of Lesson 1.
export const LESSON_1_TOP_BLOCKS: Block[] = [
  {
    kind: "liveSessionBanner",
    month: "APR",
    day: "21",
    time: "Apr 21, 11:00 AM PT",
    sessionTitle: "Build a real product with world-class design",
    countdownLabel: "2 days",
    recordingVideoSrc:
      "https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4",
  },
];

export const LESSON_1_SECTIONS: BlockSection[] = [
  TOOL_SETUP_CLAUDE,
  TOOL_SETUP_CODEX,
  TOOL_SETUP_GEMINI,
  TOOL_SETUP_COPILOT,
  {
    kind: "blocks",
    id: "how-program-works",
    title: "How this program works",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What this program is for",
          "",
          "This program changes how you work. Instead of making every email, slide, and spreadsheet by hand, you'll direct AI to make them, then judge what comes back. That takes new skills, and you'll practice them in every build.",
          "",
          "**AI-fluent professionals:**",
          "",
          "- Spot problems in their role that AI can solve, and start right away",
          "- Give AI the context it needs to do good work",
          "- Hold AI's output to a high bar for quality and integrity",
          "- Share what they learn with their team and this community",
        ].join("\n"),
      },
      {
        kind: "markdown",
        body: "### Program overview",
      },
      {
        kind: "table",
        headers: ["Level", "Theme"],
        firstColumnBold: false,
        rows: [
          ["Level 1 — you are here", "AI as a Tool"],
          ["Level 2", "AI as an Intern"],
          ["Level 3", "AI as a Coworker"],
          ["Level 4", "AI as a Whole Team"],
        ],
      },
      {
        kind: "banner",
        text: "Feeling behind? Start with AI Builder Foundations",
        subtext: "It covers the basics we build on in Level 1.",
        icon: "IconScreenShare",
      },
      {
        kind: "banner",
        text: "Get help from Leland AI Experts",
        icon: "IconUser",
      },
      {
        kind: "banner",
        text: "Find Builder blueprints for your function",
        subtext: "Ready-made starting points for your role, in the program hub.",
        icon: "IconBriefcase",
      },
      {
        kind: "markdown",
        body: [
          "### How each build page works",
          "",
          "Work through the numbered steps in order. You'll see these blocks along the way.",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Concept",
        content: [
          {
            kind: "markdown",
            body: "Blue boxes hold dropdowns that explain the idea behind a build. Open them before you start, or when a term is new to you.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "For your role",
        content: [
          {
            kind: "markdown",
            body: "Dropdowns under the \"For your role\" header show how people in marketing, finance, operations, and other jobs use each build.",
          },
        ],
      },
      {
        kind: "banner",
        text: "Go further",
        subtext: "Optional extras under the \"Go further\" header, for when you finish early or between sessions.",
        icon: "IconLightning",
      },
      {
        kind: "markdown",
        body: "### Where to find things",
      },
      {
        kind: "banner",
        text: "Syllabus",
        subtext: "Every session guide, setup step, and recording link as it goes live. Find it on your Leland dashboard.",
        icon: "IconCalendar",
      },
      {
        kind: "banner",
        text: "Email",
        subtext: "Recordings and key resources land in your inbox after each session.",
        icon: "IconBell",
      },
      {
        kind: "banner",
        text: "Slack",
        subtext: "Your cohort channel is for intros, build links, screenshots, and questions. Share AI news in #ai-news.",
        icon: "IconChatBubbles",
      },
      {
        kind: "banner",
        text: "Office hours",
        subtext: "Stay on after each session. TAs troubleshoot your AI, answer questions, and help you keep building.",
        href: "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours",
        icon: "IconHeadset",
      },
    ],
  },
  {
    kind: "blocks",
    id: "intro",
    title: "Session intro",
    description: "The principle behind today's build.",
    durationMin: 10,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "callout",
        tone: "blue",
        title: "Today's principle: English to software",
        content: [
          {
            kind: "markdown",
            body: "If you can describe what you want in plain English, AI can build it. Today you'll turn English into a working page.",
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Where you're headed",
          "",
          "Today you'll turn English into one real HTML page — not a generic portfolio. You'll pick from a few role-specific builds, so you walk away with something built for your own job.",
        ].join("\n"),
      },
      {
        kind: "markdown",
        body: [
          "### What is vibe coding?",
          "",
          "Vibe coding is building real software by describing what you want in plain language, without writing a single line of code yourself. If you can describe what you want clearly, you can build it.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Vibe coding works best when you..."],
        firstColumnBold: false,
        rows: [
          ["Start with a clear description of what you want and why"],
          ["Iterate in plain language (\"make the header bigger\", \"add a contact section\")"],
          ["Think in outcomes, not instructions"],
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "The limitation",
        content: [
          {
            kind: "markdown",
            body: "AI output is only as good as the context you give it. Generic prompt → generic output. Today's page will be hosted locally on your machine, so it only works when opened on your computer — in a later session you'll learn to deploy it so anyone can see it.",
          },
        ],
      },
      {
        kind: "buildsCarousel",
        title: "See what others built",
        items: [
          {
            title: "Build a signal-based lead gen bot",
            description: "A system that watches a specific niche for buying signals and drafts a short personalized outreach the moment one appears.",
            image: leadGenBotImg,
            author: "Leland Team",
            avatarInitials: "L",
            avatarColor: "bg-[#F2B705]",
            kind: "resource",
          },
          {
            title: "AI-Powered Churned Customer Interviews at Scale",
            description: "An AI workflow that sorts churned customers and drafts personalized outreach for review.",
            image: churnedCustomerInterviewsImg,
            author: "Travis B.",
            avatarInitials: "TB",
            avatarColor: "bg-[#2F8F5B]",
            kind: "community",
          },
          {
            title: "Turning Every Customer Call Into a Ready-to-Send Follow-Up Email",
            description: "An hourly automation that drafts follow-up emails from customer-call transcripts.",
            image: followUpEmailImg,
            author: "Brian W.",
            avatarInitials: "BW",
            avatarColor: "bg-[#B0405A]",
            kind: "community",
          },
          {
            title: "A Sales Intelligence Tool for Amazon Brand Outreach",
            description: "Built Target, a tool that turns brand research into a ready sales deck in seconds.",
            image: amazonBrandOutreachImg,
            author: "Mike P.",
            avatarInitials: "MP",
            avatarColor: "bg-[#3A5FCD]",
            kind: "community",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "concepts",
    title: "Prompt framework",
    description: "The Goal/Context/Rules framework behind every prompt in this program.",
    durationMin: 10,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### Prompt framework",
          "",
          "One of the most foundational principles for working with AI is learning how to prompt well. In the AI Builder program we use a Goal/Context/Rules prompt framework. Pay attention to how all the prompts we give you are structured. By session 3, you will be writing your own.",
        ].join("\n"),
      },
      {
        kind: "steps",
        items: [
          {
            text: "**Goal** — The assignment. What should the finished thing be? Name the output, not just the topic.",
          },
          {
            text: "**Context** — The background they need. Who it's for, what's going on, and what good looks like. The stuff a new hire wouldn't know on day one.",
          },
          {
            text: "**Rules** — The dos and don'ts. Length, tone, format, and anything that's off-limits.",
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Brief AI the way you'd brief a new hire",
          "",
          "Great results come from a great brief. Every strong prompt answers the same three questions you'd answer for someone on their first day.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["", "Your brief — same for a new hire or for AI"],
        firstColumnBold: true,
        rows: [
          ["Goal", "Write a welcome email for customers who just booked their first session."],
          [
            "Context",
            "Most are career switchers and a little nervous. This is their first message from us, and our tone is warm and direct, never salesy.",
          ],
          ["Rules", "Keep it under 150 words. Don't promise outcomes. End with one clear next step."],
        ],
      },
      {
        kind: "promptQuiz",
        title: "Quick check: Goal, Context, or Rules?",
        questions: [
          {
            prompt: "\"Draft a one-page summary of last quarter's sales results.\" Which part of the prompt is this?",
            options: [
              { label: "Goal", correct: true },
              { label: "Context" },
              { label: "Rules" },
            ],
          },
          {
            prompt: "\"Keep it under 200 words and end with a single call to action.\" Which part of the prompt is this?",
            options: [
              { label: "Goal" },
              { label: "Context" },
              { label: "Rules", correct: true },
            ],
          },
          {
            prompt:
              "\"Most of our customers are small business owners who are new to budgeting software.\" Which part of the prompt is this?",
            options: [
              { label: "Goal" },
              { label: "Context", correct: true },
              { label: "Rules" },
            ],
          },
          {
            prompt: "\"Write a LinkedIn post announcing our new product launch.\" Which part of the prompt is this?",
            options: [
              { label: "Goal", correct: true },
              { label: "Context" },
              { label: "Rules" },
            ],
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Talk to AI like a person, not software",
          "",
          "Think about the last time you asked someone to get something done for you. You probably didn't send them a vague one-liner and walk away. You told them exactly what needed to get done. You gave them the information they'd need to do it well. And you told them how you wanted it done: an example to follow, a deadline, maybe a few things to avoid.",
          "",
          "That's the whole framework. The **goal** is what needs to get done. The **context** is the information they need. The **rules** are the way you want it done.",
          "",
          "AI works the same way. Brief it like a capable new teammate instead of typing into a search bar, and you'll get much better work back.",
        ].join("\n"),
      },
    ],
  },
  {
    kind: "blocks",
    id: "practice-1",
    title: "Vibe code an AI portfolio",
    description: "Design a portfolio website with AI in one focused build.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "gray" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "Design a portfolio website with AI in one focused build. You'll hand Claude your real content and let it scaffold a working site you can iterate on.",
          "",
          "1. Open **Claude Cowork** and start a new project folder.",
          "2. Paste the starter prompt with your **goal, context, and rules**.",
          "3. Let Claude scaffold the site, then review what it built.",
          "4. Give feedback and iterate until the structure feels right.",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "tan",
        title: "If Claude stalls",
        content: [
          {
            kind: "markdown",
            body: "If the build stops partway, re-share the goal and ask it to continue from the last completed step — don't restart from scratch.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "practice-2",
    title: "Extract design DNA from an inspiration website",
    description: "Pull the visual rules from a site you love and give them to Claude.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "gray" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "Find a website whose visual style you admire. You'll feed it to Claude and ask it to reverse-engineer the design decisions — colors, typography, spacing, component patterns — into a structured document.",
          "",
          "1. Open your inspiration site and take a screenshot.",
          "2. In Claude Cowork, start a new conversation and paste the screenshot.",
          "3. Prompt Claude to extract the **color palette**, **type scale**, **spacing rules**, and **component patterns**.",
          "4. Ask Claude to write the extracted rules as a structured Markdown document called `design-dna.md`.",
          "5. Save the file to your project folder.",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Good sources of design inspiration",
        content: [
          {
            kind: "markdown",
            body: "Try **Linear**, **Stripe**, **Vercel**, or **Loom** — they have strong, consistent visual systems that Claude extracts cleanly. Avoid sites with heavy brand illustration; simpler = better output.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "practice-3",
    title: "Convert design DNA to a skill",
    description: "Turn your extracted design rules into a reusable AI skill.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "gray" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "A **skill** is a structured prompt that encodes a reusable capability. You're going to wrap your `design-dna.md` into a skill so Claude can apply that visual style to any project — not just this portfolio.",
          "",
          "1. Open a new Claude Cowork conversation.",
          "2. Paste your `design-dna.md` contents.",
          "3. Prompt Claude to rewrite it as a **skill document** — goal, rules, examples format.",
          "4. Save the output as `design-system-skill.md` in your project.",
          "5. Test it: start a fresh conversation, paste the skill, and ask Claude to style a basic button.",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Skill format",
        content: [
          {
            kind: "markdown",
            body: [
              "A well-formed skill has three parts:",
              "",
              "- **Goal** — what the skill makes Claude able to do",
              "- **Rules** — the specific constraints and patterns to follow",
              "- **Example** — a short input/output pair that shows it working",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "practice-4",
    title: "Design your custom portfolio",
    description: "Apply your design system skill to style the portfolio you scaffolded.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "gray" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "You now have two things: a scaffolded portfolio and a design-system skill. This build puts them together.",
          "",
          "1. Open the Claude Cowork project where your portfolio lives.",
          "2. Paste your `design-system-skill.md` at the top of a new message.",
          "3. Prompt Claude to apply the design system to your existing portfolio files — one component at a time.",
          "4. Review each change in the browser preview and give feedback.",
          "5. Iterate until the portfolio looks like the inspiration site.",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Component-by-component beats all-at-once",
        content: [
          {
            kind: "markdown",
            body: "Ask Claude to style one section at a time (hero, nav, project cards). Applying the skill to the whole site at once produces less precise output and is harder to review.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "If the output drifts from your inspiration",
        content: [
          {
            kind: "markdown",
            body: "Re-paste the skill and show Claude a screenshot of what's wrong. Describe the specific difference: *\"the heading font is too heavy — the inspiration uses a lighter weight.\"*",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "featured-build",
    title: "Vibe code something you'll actually use in your work",
    durationMin: 13,
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
              id: "generic",
              buildTitle: "Build a one-page summary of a real piece of your work",
              tutorial: GENERIC_TUTORIAL,
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
                id: "sales-account-brief",
                buildTitle: "Build a one-page account brief for any prospect",
                description: "A company snapshot, likely pains, and talking points for your next call.",
                tutorial: SALES_TUTORIAL,
                image: imgLeadBrief,
              },
              {
                id: "sales-demo-deck",
                buildTitle: "Build a demo deck for a prospect",
                description: "Turn your talking points into a short, on-brand deck scoped to one prospect.",
                tutorial: SALES_DEMO_DECK_TUTORIAL,
                image: imgDemoDeck,
              },
              {
                id: "sales-branded-proposal",
                buildTitle: "Build a branded one-page proposal",
                description: "Turn a rough draft into a polished proposal in your company's colors and fonts.",
                tutorial: SALES_PROPOSAL_TUTORIAL,
                image: imgBrandedProposal,
              },
              {
                id: "sales-branded-recap",
                buildTitle: "Build a branded deal recap page",
                description: "Turn your call notes into a client-ready recap, styled with your brand.",
                tutorial: SALES_RECAP_TUTORIAL,
                image: imgBrandedRecap,
              },
              {
                id: "sales-battlecard",
                buildTitle: "Build a branded objection-handling page",
                description: "Turn scattered objection answers into a page you can reference live on calls.",
                tutorial: LOREM_STUB_TUTORIAL,
                image: imgBattlecard,
              },
              {
                id: "sales-customer-welcome",
                buildTitle: "Build a branded welcome page for a new customer",
                description: "Turn a signed deal's details into a kickoff page for their first week.",
                tutorial: LOREM_STUB_TUTORIAL,
                image: imgCustomerWelcome,
              },
              {
                id: "sales-win-loss",
                buildTitle: "Build a win/loss summary page",
                description: "Turn notes from a closed deal into a page the team can learn from.",
                tutorial: LOREM_STUB_TUTORIAL,
                image: imgWinLoss,
              },
            ],
          },
          {
            value: "marketing",
            label: "Marketing",
            matchesRoles: ["marketing"],
            builds: [
              {
                id: "marketing-company-story",
                buildTitle: "Build a one-page story of your company",
                tutorial: MARKETING_TUTORIAL,
              },
            ],
          },
          {
            value: "people",
            label: "Human Resources",
            matchesRoles: ["hr"],
            builds: [
              {
                id: "people-welcome-page",
                buildTitle: "Build a personal welcome page for each new hire",
                tutorial: PEOPLE_TUTORIAL,
              },
            ],
          },
          {
            value: "finance",
            label: "Finance",
            matchesRoles: ["finance"],
            builds: [
              {
                id: "finance-budget-summary",
                buildTitle: "Build a one-page budget summary for your team",
                tutorial: FINANCE_TUTORIAL,
              },
            ],
          },
          {
            value: "product",
            label: "Product",
            matchesRoles: ["pm"],
            builds: [
              {
                id: "product-launch-page",
                buildTitle: "Build a one-page launch page for a new feature",
                tutorial: PRODUCT_TUTORIAL,
              },
            ],
          },
          {
            value: "operations",
            label: "Operations",
            matchesRoles: ["ops"],
            builds: [
              {
                id: "operations-checklist",
                buildTitle: "Build an interactive checklist for a process you run again and again",
                tutorial: OPERATIONS_TUTORIAL,
              },
            ],
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "If Claude stalls",
        content: [
          {
            kind: "markdown",
            body: "If the build stops partway, re-share the goal and ask it to continue from the last completed step — don't restart from scratch.",
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
    durationMin: 3,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What you built",
          "",
          "- A website scaffolded with your real content",
          "- A `design-dna.md` extracted from a site you admire",
          "- A reusable `design-system-skill.md` you can apply to any project",
          "- A fully styled site, published live",
        ].join("\n"),
      },
      {
        kind: "selectedBuildSummary",
        fallbackText: "A build scoped to your role, from the Vibe code section",
      },
      {
        kind: "markdown",
        body: [
          "### Before Lesson 2",
          "",
          "- Add your portfolio URL to your cohort profile",
          "- Browse your cohort's builds in the Cohort showcase",
          "- Review the Lesson 2 pre-read: *Automate Communication in Your Voice*",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Lesson 2 preview",
        content: [
          {
            kind: "markdown",
            body: "Next session: you'll build email and workflow automations that sound exactly like you — connecting your tools, creating a voice guide, and setting up a scheduled email manager.",
          },
        ],
      },
    ],
  },
];
