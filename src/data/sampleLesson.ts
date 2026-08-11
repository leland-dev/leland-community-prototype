// Hand-authored sample content for Lesson 1, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from the
// real Session 1 guide. Lessons 2–4 still use the legacy HTML iframe manifest.
import type { Block, BlockSection } from "./lessonBlocks";

// A small self-contained HTML animation, to demo the `embed` block (the one
// iframe among native blocks). Inlined as a data URL so it needs no asset.
const ANIMATION_HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;height:100%;display:grid;place-items:center;font-family:system-ui,-apple-system,sans-serif;background:#faf9f6}
.card{padding:36px 52px;border-radius:20px;color:#222;font-weight:600;font-size:22px;text-align:center;background:linear-gradient(120deg,#FFD96F,#80ACED,#FFD96F);background-size:200% 200%;animation:g 6s ease infinite;box-shadow:0 12px 32px rgba(0,0,0,.10)}
@keyframes g{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
</style></head><body><div class="card">The AI Builder Process<br/>Plan &rarr; Build &rarr; Learn</div></body></html>`;

const ANIMATION_SRC = `data:text/html;charset=utf-8,${encodeURIComponent(ANIMATION_HTML)}`;

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
          "Vibe code a portfolio website, extract design DNA from a site you love, turn it into a reusable design skill, and publish your styled portfolio live at a shareable URL.",
          "",
          "**By the end of this session you'll have:**",
          "",
          "- A portfolio website scaffolded with your real content",
          "- Design DNA extracted from a site you love",
          "- A reusable design-system AI skill",
          "- A fully styled portfolio, published live at a shareable URL",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "gray",
        title: "Before you start",
        content: [
          {
            kind: "markdown",
            body: "You'll need access to **Claude** and about 90 minutes. No engineering background required — just bring a project idea.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "concepts",
    title: "Opening concepts",
    description: "Core frameworks and the AI ecosystem you'll work in.",
    durationMin: 10,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### Prompt framework",
          "",
          "One of the most foundational principles for working with AI is learning how to prompt well. Better prompts directly raise the quality of your AI's work. Every prompt in this program follows the same shape:",
          "",
          "- **Goal** — a clear deliverable",
          "- **Context** — the information the AI needs",
          "- **Rules** — examples, method, and don'ts",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        content: [
          {
            kind: "markdown",
            body: "New to prompting? Read [How to write better prompts](https://www.lelandcourses.com/ai-builder/docs/how-to-write-better-prompts/) before the session.",
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### The AI Builder Process",
          "",
          "The loop behind everything you build: three phases — **Plan, Build, Learn** — with eight steps nested inside. It's a loop, not a line: what you learn at the end of one build feeds the start of the next, so every cycle gets faster.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Phase", "What happens"],
        rows: [
          ["Plan", "Scope the work, then set goal, context, rules"],
          ["Build", "Create → review → feedback"],
          ["Learn", "Measure, log, skillify"],
        ],
      },
      {
        kind: "embed",
        title: "The AI Builder Process",
        height: 240,
        src: ANIMATION_SRC,
      },
      {
        kind: "markdown",
        body: [
          "### Claude Chat vs Cowork vs Code",
          "",
          "Anthropic offers three ways to work with Claude. Each is built for a different workflow.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["", "Claude Chat", "Claude Cowork", "Claude Code"],
        rows: [
          ["Interface", "Web or desktop", "Desktop app only", "Terminal, desktop, or web"],
          ["Access", "Free or paid", "Paid plan required", "Free or paid"],
          ["Best for", "Quick tasks, brainstorming", "Extended work on your files", "Building & shipping code"],
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Today we use Cowork",
        content: [
          {
            kind: "markdown",
            body: "It's built for extended work sessions — it plans the work, runs code inside an isolated VM, reads and edits files in your folders, and delivers finished outputs.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-1",
    title: "Begin vibe coding your AI portfolio",
    description: "Design a portfolio website with AI in one focused build.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
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
        tone: "warning",
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
    id: "intro",
    title: "Session intro",
    durationMin: 10,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What we're building today",
          "",
          "In this session you'll go from zero to a live, published portfolio — using AI at every step. By the end you'll have built five times: scaffolding, design DNA extraction, skill creation, styling, and publishing.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Step", "What you do", "Output"],
        columnWidths: ["56px", "1fr", "1fr"],
        firstColumnBold: false,
        rows: [
          ["1", "Scaffold your portfolio", "Working website with your real content"],
          ["2", "Extract design DNA", "A set of visual rules Claude can follow"],
          ["3", "Convert to a skill", "A reusable design-system prompt"],
          ["4", "Style your portfolio", "Fully styled site matching your inspiration"],
          ["5", "Publish live", "A shareable URL"],
        ],
      },
      {
        kind: "callout",
        tone: "gray",
        title: "How this session runs",
        content: [
          {
            kind: "markdown",
            body: "Each build is self-contained — you can pause after any step and still have something complete. If you finish early, use the extra time to iterate.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-2",
    title: "Extract design DNA from an inspiration website",
    description: "Pull the visual rules from a site you love and give them to Claude.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
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
    id: "build-3",
    title: "Convert design DNA to a skill",
    description: "Turn your extracted design rules into a reusable AI skill.",
    durationMin: 13,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
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
        tone: "gray",
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
    id: "build-4",
    title: "Design your custom portfolio",
    description: "Apply your design system skill to style the portfolio you scaffolded.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
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
        tone: "warning",
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
    id: "share",
    title: "Share what you built",
    durationMin: 3,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "Post your live portfolio URL in the cohort Slack channel. Include:",
          "",
          "- The link to your published site",
          "- The inspiration site you extracted design DNA from",
          "- One thing that surprised you about the process",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "gray",
        title: "Not quite done yet?",
        content: [
          {
            kind: "markdown",
            body: "Share a screenshot of wherever you got to. Seeing work-in-progress is just as valuable — others can see how the builds stack up.",
          },
        ],
      },
    ],
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
          "- A portfolio website scaffolded with your real content",
          "- A `design-dna.md` extracted from a site you admire",
          "- A reusable `design-system-skill.md` you can apply to any project",
          "- A fully styled portfolio, published live",
          "",
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
