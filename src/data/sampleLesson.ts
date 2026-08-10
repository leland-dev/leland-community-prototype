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
          "",
          "| Phase | What happens |",
          "| --- | --- |",
          "| Plan | Scope the work, then set goal, context, rules |",
          "| Build | Create → review → feedback |",
          "| Learn | Measure, log, skillify |",
        ].join("\n"),
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
          "",
          "| | Claude Chat | Claude Cowork | Claude Code |",
          "| --- | --- | --- | --- |",
          "| Interface | Web or desktop | Desktop app only | Terminal, desktop, or web |",
          "| Access | Free or paid | Paid plan required | Free or paid |",
          "| Best for | Quick tasks, brainstorming | Extended work on your files | Building & shipping code |",
        ].join("\n"),
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
      {
        kind: "divider",
      },
      {
        kind: "cta",
        tone: "neutral",
        icon: "book",
        label: "Go further",
        sublabel: "Advanced: add a custom domain and analytics to your published site.",
      },
    ],
  },
];
