// Hand-authored sample content for Lesson 4, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from
// the real Session 4 guide ("Launch Your Custom AI System + Demo Day").
// Lessons 1–3 use the same pattern; see sampleLesson.ts / sampleLesson2.ts /
// sampleLesson3.ts.
//
// The real guide branches its instructions per AI tool (Claude / ChatGPT /
// Gemini / Copilot) behind a tool-selector. This file follows only the
// Claude track, matching how the rest of the prototype content assumes
// Claude Cowork. The real guide's "Demo Day" page and its live, in-person
// cohort logistics (survey links, a Calendly debrief, builders.leland.ai
// submission) are condensed into plain copy here rather than functional
// links, since this prototype has no backing systems for them.
import type { Block, BlockSection } from "./lessonBlocks";

// Placed above the lesson body on every section of Lesson 4.
export const LESSON_4_TOP_BLOCKS: Block[] = [
  {
    kind: "liveSessionBanner",
    month: "JUN",
    day: "2",
    time: "Jun 2, 11:00 AM PT",
    sessionTitle: "Launch your custom AI system + Demo Day",
    countdownLabel: "6 weeks",
    recordingVideoSrc:
      "https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4",
  },
];

export const LESSON_4_SECTIONS: BlockSection[] = [
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
          "Finish your AI system: a context file that carries your role and preferences into every session, a library of skills for the work you do again and again, and a clean, organized folder for all of it. Then reflect on everything you've built this level, get your certificate, and share your work.",
          "",
          "**By the end of this session you'll have:**",
          "",
          "- A persistent AI context file saved to your settings",
          "- A library of 5–6 reusable skills",
          "- A clean, organized `ai-builder` folder with an archive and a README",
          "- A finished portfolio with a written \"How I've Used AI\" evaluation",
          "- Your Level 1 certificate submitted",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Before you start",
        content: [
          {
            kind: "markdown",
            body: "You'll need the **Claude desktop app** open with your **ai-builder folder** set as your working directory. Everything today builds on what's already in that folder — your design skill, voice guide, email manager, and portfolio from the last three sessions.",
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
          "### Where you left off",
          "",
          "Last session, you turned spreadsheet data into a presentation. Before that: a portfolio site, a voice guide that makes Claude sound like you, and an email manager that drafts replies for you.",
          "",
          "### What you'll build and learn today",
          "",
          "Today you finish the system. By the end, you'll have a complete, working AI system you can take into your actual job.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Build", "Learn"],
        firstColumnBold: true,
        rows: [
          ["Reusable AI context", "Giving AI your personal context"],
          ["A library of 5–6 skills", "Defaulting to skills for repeat tasks"],
          ["A clean ai-builder folder", "Why organization matters more with AI"],
          ["Your \"How I've Used AI\" evaluation", "Using AI to reflect and summarize"],
          ["Certificate submission", "The benefit of sharing"],
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "Demo Day comes after Build 3",
        content: [
          {
            kind: "markdown",
            body: "You'll watch a handful of pre-selected demos from your cohort, then finish your portfolio and submit it.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Your certificate",
        content: [
          {
            kind: "markdown",
            body: "By the end of today you'll submit your portfolio for review. Passing means nine finished cards, two reflection sections, and a live link to your portfolio. Build 4 gets you there. Build 5 submits it. Reviewers check that:",
          },
          {
            kind: "markdown",
            body: [
              "- All nine cards are filled in — none still say \"Coming Soon\"",
              "- Every card's \"How I Built This\" and \"Documentation\" popups have real content about your build",
              "- \"What I'm Automating Next\" lists at least three automations, each tagged Scoped or Idea",
              "- \"How I've Used AI\" names at least three of your builds and one concrete outcome",
              "- Your portfolio is live and shareable",
            ].join("\n"),
          },
          {
            kind: "markdown",
            body: "*Reviewers don't grade design or extra projects — those don't affect the certificate.*",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-1",
    title: "Craft an AI context file",
    description: "Write a reusable context file so Claude starts every session already knowing you.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Apply", color: "black" },
    blocks: [
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: Giving AI your personal context",
            body: [
              "Every session with AI starts from zero. It doesn't know who you are, what you're working on, how you like to communicate, or what you've already decided. So the first few minutes of every conversation go toward re-establishing context before any real work can happen. The more you use AI, the more that setup cost compounds.",
              "",
              "A personal context file fixes this. It's a document Claude reads at the start of every session, before you type a single word. You write it once, and every session begins with Claude already knowing your role, your current priorities, and how you like to work. The skills you've built this course — your voice guide, your email manager — get sharper when Claude starts with the right framing instead of a blank slate.",
              "",
              "Six sections cover what Claude needs to know: **who you are** (name, role, what you do day to day), **your goals** (what you're working toward this quarter), **how you want AI to respond** (tone, length, format, what annoys you most when it gets it wrong), **rules** (things AI should always or never do), **tools and files** (what you use every day and where things live), and **standing instructions** (recurring behaviors you want by default).",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: "Open **Settings → Instructions for Claude** in the desktop app — that's where you'll paste your instructions once they're written. Then go back to your ai-builder session and paste this prompt:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "I want to draft reusable context for my AI work. Ask me these seven questions one at a time, then use my answers to draft the content:\n\n1. What's your name and role? What do you do day to day?\n2. What are your top one or two goals this quarter?\n3. How do you like AI to communicate? Tone, length, format, and what annoys you most when it gets it wrong?\n4. What are two or three rules you want AI to always follow?\n5. What tools do you use every day?\n6. Where do your most important files live?\n7. Anything else AI should know about how you work?\n\nKeep your draft tight: short, specific, scannable, no filler. Draft ai-context.md with clear sections: About Me, Goals, How I Like AI to Respond, Rules, Tools, Key Files. Show me the draft and save a reference copy with my ai-builder files.",
      },
      {
        kind: "markdown",
        body: "Review the draft, then paste the final version into **Instructions for Claude** from Step 1. Test it with a fresh session:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Tell me what you know about me.",
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Turn on Memory too",
        content: [
          {
            kind: "markdown",
            body: "Your context file is static — you write it once. Memory is the dynamic half: Claude synthesizes your past conversations into a running summary of your role and working style, then carries it into new chats. Turn on **Search and reference chats** and **Generate memory from chat history** in Settings → Capabilities.",
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Keep building out your context",
            body: "Useful context beats more context, but keep adding to it as you go — new projects, writing styles, tools, and goals. A 200-word context block AI actually reads beats a 2,000-word one it skips.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-2",
    title: "Build your skills library",
    description: "Turn your repeat tasks into a library of skills you can call by name.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Apply", color: "black" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### Why default to skills for repeat tasks",
          "",
          "A skill is a saved, reusable prompt — the design skill and voice guide you built earlier in this course are both skills. Instead of re-explaining a task every time, you reference the skill by name and Claude runs your preferred process automatically. The more repeat tasks you turn into skills, the less setup every session needs.",
        ].join("\n"),
      },
      {
        kind: "markdown",
        body: "Take stock of what you have, then fill the gaps. Paste this prompt:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Look through my ai-builder folder and list every skill I already have (design skill, voice guide, anything else saved as a reusable prompt). Then, based on my context file and the work I do, suggest 3-4 more skills I'd benefit from — a one-line purpose for each. Don't build anything yet, just propose the list.",
      },
      {
        kind: "markdown",
        body: "Pick two or three from the list that would save you the most time, then build them one at a time:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Create a new skill file called [skill-name].md in my ai-builder folder. It should teach you how to [describe the repeat task]. Include: when to use it, the steps to follow, and any formatting or style rules that come from my other skills or context file. Keep it under one page.",
      },
      {
        kind: "callout",
        tone: "tan",
        title: "Name it so you'll remember to use it",
        content: [
          {
            kind: "markdown",
            body: "A skill only saves time if you actually reference it. Pick a short, memorable name — `humanize-writing.md`, not `writing-style-adjustments-v2-final.md` — and keep a running list of your skill names somewhere you'll see it.",
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Build a skill that audits your other skills",
            body: "Create a `skill-doctor.md` that reviews your skills library on a schedule and flags anything vague, broken, or unused — the same way you'd review any other system that's grown over time.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-3",
    title: "Organize your AI folder",
    description: "Clean up your ai-builder folder so Claude — and you — can find things fast.",
    durationMin: 15,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    label: { text: "Practice", color: "blue" },
    blocks: [
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: Why organization matters more in the age of AI",
            body: [
              "When you work with AI on files, AI sees what you point it at. A clean folder is easy for AI to read through and gives clean context. A messy folder forces it to waste tokens navigating and gives messy context back.",
              "",
              "Three rules that change AI output the most:",
              "",
              "- **Name files like a sentence, not a code.** `client-call-prep-2026-05.md` reads better than `notes_v3_final_FINAL.md`. AI parses words. Words mean something.",
              "- **One folder per project, not per file type.** A folder with one client's brief, notes, drafts, and final deliverables together gives AI complete context. A folder of \"all my notes\" gives AI noise.",
              "- **Archive aggressively.** Old drafts and dead skills don't only take up space — they get picked up when AI scans the folder. Move stale files to an `archive/` subfolder and tell AI to leave it out of the current task unless needed.",
              "",
              "A five-minute folder cleanup before a big task pays for itself in the first prompt. AI does less guessing and more building.",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: "Have Claude audit the folder first — don't let it make changes yet:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Audit my ai-builder folder. Tell me: (1) what's in here, grouped by type — skills, drafts, finished deliverables, notes, screenshots; (2) anything duplicated, outdated, or stale; (3) file names that are vague or badly named; (4) files that probably belong in an archive folder; (5) any obvious gaps. Output as a table, then summarize the highest-value changes. Don't make any edits yet — ask me to decide what to act on.",
      },
      {
        kind: "markdown",
        body: "Read the plan, push back on anything that doesn't look right, then approve the rest:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Looks good. Execute the plan. Show me the final folder structure as a tree when you're done.",
      },
      {
        kind: "callout",
        tone: "tan",
        title: "A note on permissions",
        content: [
          {
            kind: "markdown",
            body: "Claude acts on real files here, so it asks first by default. Stay on that setting while you reorganize today — don't switch to full access just for this.",
          },
        ],
      },
      {
        kind: "markdown",
        body: "Last, add a short README so future-you (or Claude, next time it scans the folder) knows what's here:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Create a README.md in my ai-builder folder. It should explain what this folder is for, the structure (what's in each subfolder), and the files anyone — including future me — should know about. Keep it under 200 words.",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Schedule a recurring audit",
            body: "Set up a recurring task that scans your folder every Friday, writes a 3-bullet summary of what's new, stale, or worth archiving, and saves it to a dated file. Keep scheduled runs read-only — review and approve any archive plan yourself.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "demo-day",
    title: "Demo Day",
    durationMin: 10,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: "A handful of pre-selected builds from your cohort, submitted in advance and played live for the group. Watch closely — this is your chance to see the best of what your cohort built and walk out with ideas for what you could build next.",
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-4",
    title: "Write your \"How I've Used AI\" evaluation",
    description: "Finish your portfolio's last three cards, then reflect on all four sessions.",
    durationMin: 25,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "callout",
        tone: "blue",
        title: "Using AI to reflect, document, and summarize",
        content: [
          {
            kind: "markdown",
            body: "Building with AI is a rush. When you jump straight from one project to the next, you skip reflection — actively thinking about what you learned so you build better next time. AI makes this cheap: point it at a month of your own work and it surfaces what you built, what decisions you made, and what patterns show up, in about 30 seconds. This is your capstone for Level 1. Reflect, document, move on.",
          },
        ],
      },
      {
        kind: "markdown",
        body: "This is the section reviewers read most closely — it ties what changed for you across four sessions to a file in your folder. Fill in your last three portfolio cards first, then write the evaluation, run a self-check, and publish.",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Update my existing portfolio.html — don't create a new file, edit the existing one and match its existing card design exactly. Fill in the three \"Coming Soon\" cards: \"File Organization Process\" (what I did organizing my folder, the before/after structure, a copyable audit prompt), \"AI Context File\" (what my context file covers, without exposing personal content, plus a copyable starter template), and \"Skills Library\" (every skill I have with a one-line purpose each, plus a copyable prompt for suggesting new skills). Use only work I actually completed — leave anything unfinished marked \"Coming Soon\" and tell me what's missing. Show me the proposed changes before applying them.",
      },
      {
        kind: "markdown",
        body: "Once those are filled in, write the evaluation itself. It goes right after \"What I'm Automating Next\":",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Add a section titled \"How I've Used AI\" to portfolio.html, right after \"What I'm Automating Next\", written in my voice and grounded in evidence from my files. Read everything in my ai-builder folder — every skill, my voice guide, my email manager setup, my context file, my portfolio cards, and any drafts saved there. Cover four things: what I built across the four sessions as a plain list of my nine builds; three things that changed in how I work with AI since Session 1, each tied to a named file; my strongest build and why, with one concrete outcome; and what I'm building next. Cite filenames — if you can't find evidence for a claim, leave it out and tell me what's missing. Use my humanize-writing skill. 150 to 250 words, no \"I'm excited to share.\" Show me the proposed changes before applying them.",
      },
      {
        kind: "markdown",
        body: "Run the same self-check reviewers use before you publish, and fix anything that comes back as a Fix:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Audit portfolio.html against the AI Builder certificate checklist and tell me what to fix. Check each line and answer Pass or Fix with one sentence of evidence: (1) all nine cards present with real content, none still \"Coming Soon\"; (2) every card's popups have real content, not placeholder text; (3) \"What I'm Automating Next\" lists at least three items, each tagged Scoped or Idea; (4) \"How I've Used AI\" names at least three builds and one concrete outcome. Don't change anything yet.",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Write your own principles by hand",
            body: "The evaluation above was AI-written. Before you move on, open a new file and — without AI — write down 3–5 principles you now believe about working with AI, based on what you built across all four sessions. Writing it by hand is what makes it stick. Then ask Claude to pressure-test what you wrote against your actual folder: which principles your work backs up, which it contradicts, and one you lived out but didn't write down.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-5",
    title: "Get your certificate and share what you built",
    description: "Submit your portfolio for review, then tell someone what you built.",
    durationMin: 15,
    meta: { minsTotal: 90, builds: 5, model: "Sonnet" },
    blocks: [
      {
        kind: "callout",
        tone: "blue",
        title: "The benefit of sharing",
        content: [
          {
            kind: "markdown",
            body: "Sharing what you built forces you to articulate it — when it's just in your head, your understanding can stay vague. You also get feedback you can't generate on your own: someone outside your context notices things you've stopped seeing, and their reaction often becomes your next build idea. Building in private is a fast track to losing momentum. Build, share, improve — that cycle is what separates people who keep getting better from people who plateau.",
          },
        ],
      },
      {
        kind: "markdown",
        body: "### Step 1: Submit for your certificate",
      },
      {
        kind: "markdown",
        body: "Fill out the AI Builder survey — it takes about five minutes and we read every answer when we revise these sessions. Submitting takes you to the certificate page, where you paste your portfolio link. If your portfolio passes, you get your certificate right away.",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Draft your survey answers with Claude",
            body: "Ask Claude to use the files in your ai-builder folder to propose answers to the survey, emphasizing the most powerful things you built across the program. Review and edit before you submit — don't let AI invent claims your files don't back up.",
          },
        ],
      },
      {
        kind: "markdown",
        body: "### Step 2: Share your work — pick one",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Track A: Tell your manager",
            body: "Ask Claude to draft a 3–4 sentence message using your voice guide: name 2–3 things you built that are most relevant to your work, and say what this means going forward. Sound like you, not a press release. Customize it, then send it with your certificate and portfolio links.",
          },
          {
            title: "Track B: Post on LinkedIn",
            body: "Ask Claude to write a post using your voice guide: open with one specific thing you built (no \"Excited to share...\"), be honest about the learning process rather than promotional, and close with what you're building next. 150–200 words, no hashtag spam. Add your certificate link or a screenshot, then post.",
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Run a time audit",
            body: "Before your next session, ask Claude to pull from your calendar and email for the last 30 days and answer: what are you spending the most time on, what's manual that could be automated, and what's the single highest-leverage thing you could hand to AI. Bring your findings to Level 2.",
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
          "- An `ai-context.md` with persistent instructions Claude reads at the start of every session",
          "- A library of 5–6 skills — repeatable workflows you can call by name",
          "- A clean, organized `ai-builder` folder with an archive and a README",
          "- A finished portfolio: nine cards, both reflection sections, self-checked against the certificate bar",
          "- Your Level 1 certificate submitted for review",
        ].join("\n"),
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Keep sharpening your system",
            body: "Build a `skill-doctor.md` that audits your skills library monthly and flags anything vague, broken, or unused. Extend it with a running change log so you can see how your system has evolved.",
          },
          {
            title: "🔧 Go Further: Deploy your portfolio with a shareable URL",
            body: "If you haven't already, deploy your portfolio somewhere with a permanent link and add it to your email signature — it's the easiest way to keep sharing what you built.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "You finished Level 1",
        content: [
          {
            kind: "markdown",
            body: "Nine builds, four sessions, one working AI system you can take into your actual job. That's the whole point — not a certificate for its own sake, but a habit of reaching for AI on real work instead of doing it the old way.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "tan",
        title: "Keep going: Levels 2 to 4",
        content: [
          {
            kind: "markdown",
            body: "Levels 2, 3, and 4 are already part of your access. In Level 2, you turn tasks like the ones you automated here into workflows that run on their own. In Level 3, you build AI agents that work like coworkers. In Level 4, you put a team of AI employees to work. Pick your next level from your Leland dashboard whenever you're ready.",
          },
        ],
      },
    ],
  },
];
