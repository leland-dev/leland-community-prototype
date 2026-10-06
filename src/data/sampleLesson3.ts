// Hand-authored sample content for Lesson 3, rendered natively via the
// lesson-blocks renderer (demo of the block/CMS model). Text is adapted from
// the real Session 3 guide ("Design Presentations That Build Themselves").
// Lessons 1–2 use the same pattern; see sampleLesson.ts / sampleLesson2.ts.
//
// The real guide branches its instructions per AI tool (Claude / Antigravity /
// Codex) behind a tool-selector. This file follows only the Claude track,
// matching how the rest of the prototype content assumes Claude Cowork.
import type { Block, BlockSection } from "./lessonBlocks";

// Placed above the lesson body on every section of Lesson 3.
export const LESSON_3_TOP_BLOCKS: Block[] = [
  {
    kind: "liveSessionBanner",
    month: "MAY",
    day: "19",
    time: "May 19, 11:00 AM PT",
    sessionTitle: "Design presentations that build themselves",
    countdownLabel: "4 weeks",
    recordingVideoSrc:
      "https://tannerthelin.github.io/courses-prototype/assets/8814086-hd_1920_1080_25fps-Bbf7RRvH.mp4",
  },
];

export const LESSON_3_SECTIONS: BlockSection[] = [
  {
    kind: "blocks",
    id: "welcome",
    title: "Welcome",
    durationMin: 5,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "Pick a real research topic from your work, run it through AI's research modes to build a solid brief, structure that research into a slide-by-slide outline, then design and export a polished HTML slide deck.",
          "",
          "**By the end of this session you'll have:**",
          "",
          "- A research brief on a real topic from your work, saved as a markdown file",
          "- A slide-by-slide outline in your voice",
          "- A polished HTML slide deck styled with your design skill",
          "- An exported deliverable (PDF or .pptx) ready to share",
          "- A new presentation card on your portfolio, published live",
        ].join("\n"),
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Before you start",
        content: [
          {
            kind: "markdown",
            body: "You'll need your AI tool open, working from your **ai-builder folder**, plus two things from earlier sessions: your **design skill** (the `/[style]-design` file from Sprint 1) and your **humanize writing skill** (`humanize-writing.md` from Sprint 2). Come with a **research topic** from your own work — something you'd genuinely benefit from having slides for.",
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
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What we're building today",
          "",
          "Last Sprint, you connected Claude to your email and Slack, built a voice guide from your own writing samples, and created an email manager that triages your inbox and drafts replies in your style.",
          "",
          "Today we're shifting to presentations. You'll pick a real research topic from your work, run it through AI's different search modes to get a solid brief, then structure that research into a slide-by-slide outline. From there, you'll build a polished HTML slide deck using your design skill, optionally animate a couple of key slides, and export the final product in whatever format you need.",
          "",
          "By the end of the Sprint, you'll have a presentation that's ready to share and a workflow you can repeat on any topic.",
        ].join("\n"),
      },
      {
        kind: "table",
        headers: ["Build", "What you do", "Output"],
        columnWidths: ["56px", "1fr", "1fr"],
        firstColumnBold: false,
        rows: [
          ["1", "Research your topic", "A research brief saved as a markdown file"],
          ["2", "Structure your research for a presentation", "A slide-by-slide outline in your voice"],
          ["3", "Make it look good", "A polished HTML slide deck"],
          ["4", "Export and share your presentation", "An exported deliverable + a published portfolio card"],
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "How this session runs",
        content: [
          {
            kind: "markdown",
            body: "Each build stacks on the previous one — your research feeds the outline, and the outline feeds the deck. You can pause after any build and still have something usable. If you finish early, use the extra time for the Go Further animation skill at the end.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-1",
    title: "Research your topic",
    description: "Pick a real topic, research it with AI across your connected tools, and fact-check the output.",
    durationMin: 20,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### Step 1: Pick your research topic",
          "",
          "Choose something you need to research for work right now. You're going to turn this into a presentation, so pick a topic where you'd benefit from having slides you can share with a colleague, a client, or your team.",
          "",
          "**Good topics:** a market or competitive landscape, a proposal or recommendation, a project update or strategy brief, a topic you need to present at an upcoming meeting.",
          "",
          "**Not-so-good topics:** something too broad (\"AI trends\"), something you already know completely, something where visuals won't add value.",
        ].join("\n"),
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Optional: Don't Have a Topic? Let AI Help You Find One",
            body: [
              "A good prompt gives Claude just enough context to make a useful suggestion. Before you type anything, think through these four things:",
              "",
              "1. Who you are. What's your role, and what kind of work do you do day-to-day?",
              "2. What you're working on right now. Any active projects, upcoming meetings, or decisions you're working through?",
              "3. What the output needs to do. In this case, you're building a presentation, so the topic should be something worth sharing with an audience.",
              "4. What \"useful\" means to you. Do you want something you could present this week? Something you've been meaning to research but haven't had time for?",
              "",
              "Once you've thought through those, select the Sonnet model and write a message to Claude in your own words. Try writing a prompt on your own first — here's an example if you need help:",
              "",
              "```",
              "I need to pick a research topic that I'll turn into a presentation. Interview me about my role, what I'm working on right now, and any upcoming meetings or decisions. Then suggest 3 specific topics I could research and present on, ranked by how useful the presentation would be this week.",
              "```",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: How You Can Research with AI",
            body: [
              "Your research results depend on the modes you have enabled and the tools you have connected.",
              "",
              "- **Chat mode (default):** Works from training data only. No live web access. Excellent for synthesis, writing, reasoning, and working with content you paste in. Training data has a cutoff date, so anything recent may be missing or wrong.",
              "- **Web search on:** AI can look things up in real time but still synthesizes answers conversationally. Good for quick fact-checks, recent news, or questions where you need current info but not an exhaustive report. Less thorough than deep research.",
              "- **Deep research / Research mode:** AI runs multiple web searches, reads source material, and synthesizes a full report. Takes longer (1–5 minutes), but the output is significantly more thorough. Use when accuracy, recency, and completeness all matter.",
              "- **Research through connectors and local files:** When AI is connected to your tools (desktop folders, email, Slack, Notion, etc.), it can read and synthesize anything.",
              "",
              "AI will default to whatever sources it finds first. If you want high-quality research, you need to tell it where to look and what standards to apply. Be specific about source requirements in your prompt:",
              "",
              "- **Primary/official documentation:** \"Use only Apple's developer documentation for this\" or \"Pull pricing from Salesforce's published pricing page, not third-party reviews.\"",
              "- **Peer-reviewed or highly cited research:** \"Find peer-reviewed studies published in major journals\" or \"I want research with 50+ citations, not blog posts.\"",
              "- **Recency requirements:** \"Only include sources from the last 6 months\" or \"I need data from 2024 or later. Flag anything older.\"",
              "- **Industry-specific sources:** \"Use CB Insights, PitchBook, and Crunchbase for startup data\" or \"Pull from NEJM, Lancet, and JAMA for clinical evidence.\"",
              "",
              "AI research is a starting point, not a source of truth. Use one or more of these methods on every research output before you share it:",
              "",
              "1. Gut check. Do you know this domain? Does the output pass the sniff test? Are the facts consistent with what you already know?",
              "2. Ask for sources. Tell AI: \"Cite a source for each claim you made.\" Then spot-check two or three of them. If AI can't produce sources or the sources don't support the claims, treat that content as unverified.",
              "3. Ask AI to audit itself. Tell AI: \"Review this research. Flag anything you are not confident about, any claims that may be outdated, and any gaps in your coverage.\" This works surprisingly well.",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Step 2: Run your research",
          "",
          "Web search is just one source Claude can pull from — you also have an array of connectors that you can leverage to pull in relevant context and information for your research topic. You'll take a pass at writing your own prompt to run research that pulls in these different data sources. Use the Sonnet model for this prompt.",
          "",
          "**a.** Before you write your prompt, think about what context you already have sitting in your connected tools that's relevant to this topic. Ask yourself:",
          "",
          "- Is there an email or Slack message that kicked this off? A brief from a manager, a request from a client, a thread where someone outlined the problem? That's valuable context Claude can read and factor in.",
          "- Is there existing internal information that should shape the research? Past notes, a project doc, a previous conversation — anything that means the output should be tailored to your specific situation rather than generic.",
          "- What do you actually need from the web? Current data, competitive info, recent news — things you don't already have internally.",
          "",
          "**b.** Once you've thought through context to pull in, write a prompt that tells Claude four things:",
          "",
          "1. Say \"Do research\" and tell it what you want it to research",
          "2. Where you want it to look (web, your email, your Slack, a specific file)",
          "3. What you want the output to look like",
          "4. To save the research as a markdown file called `research-[topic].md` in your working directory",
          "",
          "You don't need to be precise. Just give it the sources and let it synthesize. The goal is a research brief that reflects both what's out there and what's already relevant to you specifically.",
        ].join("\n"),
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: What Is a Markdown File?",
            body: [
              "When you close a Claude session, the conversation is gone. Claude doesn't remember what you built, researched, or decided, so it starts completely fresh the next time you open it.",
              "",
              "Markdown files (.md) are how you get around that. When you save something important (your research, your voice guide, your skills) as a .md file in your working folder, Claude can read it back in any future session and pick up right where you left off. Almost everything you've built so far in the program — your design skill, your voice guide, your email manager — they're all Markdown files living in your ai-builder folder.",
              "",
              "Think of Markdowns less like a document and more like a handoff note to your future self. You don't need to know how to write or read Markdown because Claude handles the formatting. What matters is knowing when to save one: if it is information that you will need AI to reference over and over again in the future, save it as a file. If it's a quick, one-off task you won't need again, you don't have to.",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Need Help With Your Prompt?",
            body: [
              "Replace the bracketed sections with your specifics.",
              "",
              "```",
              "I'm a [your role] at [your company] and I need to research [your topic] to [specific goal or decision this supports].",
              "",
              "Before searching the web, pull in this context I already have:",
              "- [Describe the existing context - e.g., \"a Slack message from my manager in #[channel name] asking me to look into this\" / \"an email from [name or role] outlining the ask\" / \"a file called [filename] in my working directory\"]",
              "",
              "Use that context to understand what's already known and what the specific angle or need is. Then search the web for current information to fill in the gaps.",
              "",
              "Synthesize everything into a research brief that includes:",
              "1. A summary of the request or context I'm working from",
              "2. An overview of the current landscape (key players, trends, relevant data)",
              "3. The most important takeaways for someone in my role",
              "4. What's uncertain or worth digging into further",
              "5. Sources you pulled from, both internal and external",
              "",
              "Flag anything that might be outdated or that you're not confident about.",
              "```",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "**c.** Customize your source requirements. After creating the main prompt, add one or more of these lines depending on your topic:",
          "",
          "- For current data: \"Only include sources from the last 6 months. Flag anything older.\"",
          "- For academic/scientific topics: \"Prioritize peer-reviewed studies and highly cited research. No blog posts.\"",
          "- For product/tool research: \"Pull from official documentation and pricing pages, not third-party reviews.\"",
          "- For industry research: \"Use sources like [name the publications that matter in your field].\"",
          "",
          "*Don't accept the first output as final. Treat it as a first draft. The best research comes from 2–3 rounds of follow-up: \"Be more specific about X,\" \"What are you least confident about?\", \"You missed Y, add that.\"*",
        ].join("\n"),
      },
      {
        kind: "markdown",
        body: "### Step 3: Fact-check the output\n\nPaste this prompt:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: "Before I use this research: review it yourself. What claims are you least confident about? What might be outdated? What important areas did you not cover? Cite a source for each major claim.",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Audit Your Research More Rigorously",
            body: "You can get a reasonable set of critiques on your research by asking Claude to review it within the same session. However, for a more rigorous audit, try opening a separate Claude session or pasting your research into a different model like Gemini or ChatGPT, and prompt the AI to identify weak claims, outdated information, or gaps.",
          },
        ],
      },
      {
        kind: "markdown",
        body: "*If your conversation becomes too long and Claude starts to slow down, you can start a fresh Cowork chat for the next Build and reference the saved file: \"Read research-[topic].md and use it for what we're building next.\"*",
      },
      {
        kind: "callout",
        tone: "tan",
        content: [
          {
            kind: "markdown",
            body: "**Share:** Drop your most interesting research finding in your cohort's channel.",
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-2",
    title: "Structure your research for a presentation",
    description: "Outline your research into a slide-by-slide plan before you design anything.",
    durationMin: 15,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: Outline with AI Before You Design",
            body: [
              "If you ask AI to create any type of visual materials without structuring the content you want on those materials first, AI will fill the gap between your vague request and a finished product with generic content.",
              "",
              "Outline first, then build. For slide decks, write out what each slide needs to say before you ask AI to design anything. Here's why:",
              "",
              "- AI produces better visuals when it knows the point of each slide upfront. \"Build me a slide about market size\" generates a generic chart. \"Build me a slide that makes the case that the market is bigger than it looks because of X\" generates something with an argument.",
              "- Rebuilding costs far more than planning. If you generate a 12-slide deck and then restructure it, you're sending all 12 slides back through the model and often losing work you liked. A 10-minute outline pass avoids multiple full regeneration cycles.",
              "",
              "You might ask AI to structure a simple slide deck outline like this:",
              "",
              "- Context: What does the audience need to know to care? (1–2 slides)",
              "- Key findings: What did you discover, one point per slide? (3–5 slides)",
              "- So what: What does this mean for the audience? (1–2 slides)",
              "- Recommendation: What should happen now? (1 slide)",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: "Take the research you just produced and turn it into a slide-by-slide outline. This is where your humanize writing skill does the work of making your research sound like you. Go back into the same Cowork chat and paste this prompt:",
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: `Take the research we just did and structure it as a presentation outline.

Use my humanize writing skill: /humanize-writing

Audience: [who will see this - your team, a client, leadership, etc.]
Goal: [what you want them to walk away with - a decision, understanding, buy-in]

Structure it as:
- Title slide
- Context: 1-2 slides setting up why this matters
- Key findings: one insight per slide, 3-5 slides max
- So what: what this means for the audience
- Recommendation or next step
- Overall presentation length: 10 slides or less

For each slide, give me:
- Slide title (short, specific)
- 2-3 bullet points or a key statement
- Any data points or visuals that would strengthen it

Keep the language in my voice. No corporate filler. Every slide should earn its place.`,
      },
      {
        kind: "markdown",
        body: "*Review the outline before moving on. Reorder slides, cut anything that doesn't support your goal, and push back on AI if the language sounds generic: \"This doesn't sound like me. Rewrite slide 3 in a more direct tone.\" The outline is your blueprint for everything that follows — the details matter at this stage!*",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Turn Your Research Workflow Into a Reusable Skill",
            body: [
              "This prompt workflow is specific to today's topic, but the process is repeatable. If you frequently research competitive landscapes, strategy briefs, or market analyses, package it as a skill so your AI tool runs your workflow automatically next time. Paste this prompt:",
              "",
              "```",
              "Take the research prompts I used in this session and turn them into a reusable skill. Before building anything, ask me:",
              "- What types of topics do I research most often?",
              "- Are there specific source requirements I always want included?",
              "- How do I usually want the output formatted?",
              "",
              "Then build a skill called \"research-[topic-type].md\" that runs my preferred workflow: prompts, source requirements, self-audit step, and saves output as a markdown file in my working directory.",
              "```",
              "",
              "Next time you need similar research, just reference your research skill file and it runs your custom workflow from the start.",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-3",
    title: "Make it look good",
    description: "Mock up your deck in ASCII, then build a polished HTML slide deck with your design skill.",
    durationMin: 30,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: Why Vibe-Coded Presentations Look Generic",
            body: [
              "If you ask AI to \"make me a presentation,\" you'll get something that looks like every other AI-generated slide deck: safe colors, predictable layouts, stock-photo energy. That's vibe coding without a design system.",
              "",
              "The fix is the same thing you did in Sprint 1 with your portfolio: give AI a specific design skill to follow. Your design skill has your colors, typography, layout rules, and visual personality. When AI follows those rules, the output looks intentional, not generated.",
              "",
              "For presentations specifically, a few extra rules help:",
              "",
              "- One idea per slide. If a slide makes two points, split it.",
              "- Less text, more space. Slides are not documents. If you need a paragraph, it goes in speaker notes.",
              "- Consistent visual hierarchy: title size, body size, accent color usage should be the same on every slide.",
              "- Data slides need a headline that states the takeaway, not just a chart title. \"Revenue grew 40% in Q3\" not \"Q3 Revenue.\"",
              "",
              "Your design skill handles the visual consistency. Your job is the content judgment: does each slide earn its place?",
            ].join("\n"),
          },
          {
            title: "💡 Concept: Why Build Slides in Claude Instead of Gamma, Canva, or Another Tool?",
            body: [
              "Tools like Gamma and Canva can make something that looks complete fast, but you're working from their templates, their layouts, and their design decisions. The output looks like everyone else who used the same tool.",
              "",
              "When you build in Claude, a few things are different:",
              "",
              "1. Your design skill is already loaded, so the colors, typography, and layout rules are yours, not a template someone else made.",
              "2. Everything you've connected is available: your research, your humanize writing skill, your email, your Slack. Claude can pull from all of it in the same session.",
              "3. You don't have to learn a new platform. The same tool you already use handles the research, the writing, the structure, and the design.",
              "",
              "It may take more prompting than dragging and dropping, but what you get back is a presentation that's fully yours and a workflow you can repeat on any topic without starting from scratch.",
            ].join("\n"),
          },
          {
            title: "💡 Concept: Choose Your Presentation Format",
            body: [
              "Before you build, decide what format your final presentation will be in. This matters because it affects how you build it.",
              "",
              "- **HTML slides (what we'll build today):** The most flexible option. You get full control over design, animations, and interactivity. Easy to export as a PDF. Can be deployed as a live webpage. This is what we recommend for getting the most out of AI.",
              "- **PowerPoint (.pptx):** The universal format. Everyone can open it, everyone can edit it. Best when you need to hand off slides to someone else or present in an environment that requires PowerPoint. You can ask AI to generate a .pptx file directly, or convert from HTML later.",
              "- **Google Slides / Canva:** If your team lives in Google Slides or Canva, you can use AI to generate the content and structure, then build the final version in those tools. AI can also export to formats these tools can import.",
              "",
              "Today we're building HTML slides because it gives you the most design control and teaches transferable skills. At the end, we'll show you how to export to other formats.",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Part 1: Build an ASCII mock-up",
          "",
          "Test what your outline will look like as a slide deck by creating an ASCII rendering. This lets you iterate on structure before committing to a full HTML build.",
        ].join("\n"),
      },
      {
        kind: "code",
        language: "prompt",
        filename: "Prompt",
        code: `Build an ASCII rendering of a slide deck from the outline we just created.

Requirements:
- Each slide is its own clearly separated section
- One idea per slide. If a slide has too much text, split it or move the detail to speaker notes.
- Add a slide number or progress indicator

Keep it clean. White space is good. Every visual element should serve the content, not decorate it.

Save as slides-[topic]-ascii.txt in my ai-builder folder.`,
      },
      {
        kind: "markdown",
        body: [
          "Scan the ASCII mock-up for slides that feel overcrowded, ideas that could be split into two slides, or slides that are too text-heavy. Once you spot what needs fixing, tell AI directly. For example:",
          "",
          "- \"Slide 4 has too much text. Split it into two slides.\"",
          "- \"The data slide needs a chart instead of bullet points.\"",
          "- \"Make the title slide more impactful.\"",
          "- \"The color on slide 6 doesn't match my design system. Fix it.\"",
          "- \"Add more visual elements to the deck overall and de-word.\"",
          "",
          "*ASCII mock-ups are helpful because they give you a high-level view of your slide visuals and layout before building in HTML. You can iterate directly in either, but it uses more tokens. Capture as many high-level layout and design edits as you can at this stage.*",
          "",
          "### Part 2: Build the deck",
        ].join("\n"),
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Option A: Use Claude Design",
            body: [
              "**💡 Concept: Introducing Claude Design.** Claude Design is Anthropic's newest product (currently in research preview only for users with paid Claude subscriptions) for building polished visual work through conversation. It lives at claude.ai/design, separate from the Claude desktop app. What you can build: pitch decks, interactive prototypes, product wireframes, design explorations, landing pages, marketing assets, and code-powered prototypes with voice, video, 3D, and built-in AI. On usage: Claude Design has its own weekly limit, separate from your regular Claude tokens, so experimenting here won't touch your normal chat budget. That said, the limit is real — batch your edit requests and be specific to make it go further. It resets every week.",
              "",
              "**Step 1 — Open Claude Design and create a new project.** Go to claude.ai/design. You'll see four starting options on the home screen: Design a Prototype, Slide Deck, Build from a Template, and Projects. Select Slide Deck.",
              "",
              "**Step 2 — Name and configure your deck.**",
              "",
              "1. Name your deck. Since you're building a research presentation, use something like: Research Presentation: [Your Topic]",
              "2. Design system: if you're on a team plan, you may see your company's design system listed here — set this to None, you'll use your own design skill.",
              "3. Speaker notes: toggle on if your ASCII mockup includes notes and you want them visible, otherwise leave off. Worth knowing: Claude uses less text on slide bodies when speaker notes are off, so decide before you click through.",
              "",
              "When you're ready, click Create.",
              "",
              "**Step 3 — Attach your ASCII .txt file and design skill .md file.** You'll land in Claude Design's prompt workspace. Before you write anything, attach your ASCII mockup file and your design skill .md file. Heads up: skip the Import button, it doesn't work for this use case — use the paperclip (Attach) button in the prompt area instead. Click the paperclip, navigate to your AI Builder folder, and select both files (your ASCII mockup .txt and your design skill .md) before sending your prompt.",
              "",
              "**Step 4 — Prompt Claude to build your deck.** Prompt Claude to build a fully-rendered HTML slide deck, use the ASCII file as the structure for the slides, and use the design file as the visual rulebook. *Try dictating this prompt! There is an audio button near the Import button in Claude Design that will transcribe your voice.* If you get stuck, use this as a backup (fill in your actual filenames before sending):",
              "",
              "```",
              "I've uploaded two files:",
              "",
              "- [filename].txt - an ASCII mock-up of a slide deck (structure, layout, and content per slide)",
              "- [filename].md - a design system file (visual rules, typography, color, component guidelines)",
              "",
              "Build a fully rendered HTML slide deck that follows this approach:",
              "",
              "1. Use the ASCII file as the content and structural blueprint - match the slide count, hierarchy, and layout intent exactly",
              "2. Use the design file as the visual rulebook - apply its color palette, typography, spacing, and component patterns throughout",
              "3. Where the ASCII implies a layout (e.g., two columns, a list, a big stat), render it faithfully using the design system's components",
              "",
              "Output a single self-contained HTML file. No external dependencies unless they're specified in the design file.",
              "```",
              "",
              "Click Send when you're ready, and watch Claude Design build!",
              "",
              "**Step 5 — Review and iterate.** Go through your slides once generation is complete — you'll almost certainly want to make a few tweaks, that's expected. In Claude Design, iterations use tokens and there are weekly limits, so the more specific your edit request, the fewer rounds you'll need:",
              "",
              "- Good feedback: \"The text on slide 3 is wrapping across two columns and looks cramped. Fix the layout so it reads as a single column.\"",
              "- Good feedback: \"The header color on slide 5 doesn't match the primary brand color from my design file. Please update it.\"",
              "- Poor feedback: \"Make it look better\" — too vague, wastes tokens.",
              "",
              "Keep your edit requests batched when possible — one prompt covering three fixes is better than three separate prompts.",
            ].join("\n"),
          },
          {
            title: "Option B: Use Claude Cowork",
            body: [
              "Take your ASCII layout and turn it into a fully designed slide deck in HTML using your design skill. Use the Sonnet model and paste this prompt:",
              "",
              "```",
              "Build an HTML slide deck from [your-ascii-filename.txt].",
              "",
              "Use my design skill: /[your-design-skill]",
              "",
              "Requirements:",
              "- Each slide is a full-viewport section (100vh) with one idea per slide",
              "- Add a slide number or progress indicator",
              "- Use my design system colors, typography, and layout rules",
              "- If any slide has too much text, split it or move the detail to speaker notes",
              "",
              "Keep the output clean. Every visual element should serve the content, not decorate it.",
              "",
              "Save as a single self-contained HTML file in my ai-builder folder.",
              "```",
              "",
              "Cowork will save the file to your ai-builder folder — click the link it generates to preview it in your browser. If you thoroughly refined your slides in ASCII, the HTML deck should be close to done. You can still ask Claude to refine slides and make visual edits now, but make requests specific since HTML edits use more tokens.",
              "",
              "**Optional: Add keyboard navigation and speaker notes.** Once your slides look good, select the Sonnet model and paste this prompt:",
              "",
              "```",
              "Add to my slide deck:",
              "- Keyboard navigation: left/right arrow keys to move between slides",
              "- A speaker notes panel that's hidden by default but toggleable with the 'N' key",
              "```",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    kind: "blocks",
    id: "build-4",
    title: "Export and share your presentation",
    description: "Pick an export format that fits your situation, convert your deck, and optionally deploy it live.",
    durationMin: 15,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "toggle",
        rows: [
          {
            title: "💡 Concept: Presentation Formats and When to Use Each",
            body: [
              "You've built an HTML slide deck. Now you need to get it to the people who need to see it. The right export format depends on the situation:",
              "",
              "- **HTML slides exported as PDF:** Best for sending a finished product that preserves your exact design. No one can accidentally edit it. The recipient sees exactly what you see. Your animations won't carry over, but the visual design stays perfect.",
              "- **PowerPoint (.pptx):** Best when someone else needs to edit the slides, when you're presenting in a corporate environment that requires PowerPoint, or when you're collaborating with a team. AI can convert your HTML slides to a .pptx file. Some design fidelity may be lost in translation, but the content and structure will transfer.",
              "- **HTML slides deployed to a site:** Best for a live, interactive presentation you can share via link. Your animations work, it looks exactly right, and you can update it anytime. This requires deploying to a hosting service (GitHub Pages, Netlify, Vercel).",
              "- **Working with Google Slides or Canva:** You can export your HTML to PDF and import that as a starting point, use AI to generate content in a format these tools accept, or use AI to create the outline and content then build in your preferred tool. The Canva connector exists but is still limited.",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: "Pick the export format that best fits your situation.",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Option A: Use Claude Design (recommended)",
            body: [
              "Click the Share button. Choose the format that fits how you'll use your slides:",
              "",
              "- **PDF (recommended default):** Fast, lightweight, and renders exactly what you see. Best for sharing broadly, submitting a deliverable, or keeping a clean record of your work.",
              "- **PowerPoint:** Three sub-options — Universal fonts (substitutes web-safe fonts everyone has, best for sharing widely); Custom fonts/editable (keeps your brand fonts, only works if the recipient has the same fonts installed); Google Fonts (use if uploading to Google Slides); Screenshot-based (not editable, renders exactly what you see — downloading as a PDF gives you the same outcome with less friction).",
              "- **HTML:** Downloads a self-contained .html file you can open in any browser. Great if you built your deck for a web context or want to preserve any interactivity.",
              "- **Canva:** Requires an active Canva account and a moment to render. Note: this feature can be buggy — if Canva isn't critical to your workflow, use PDF or PowerPoint instead.",
            ].join("\n"),
          },
          {
            title: "Option B: Use Claude Plugins",
            body: [
              "**Export as PDF with Playwright.** There are many ways to export slides from HTML to PDF. Here's one method using a tool called Playwright that reliably preserves formatting and the static visual elements of an HTML file. Note on animations: a PDF conversion captures each slide as a still — animated slides export in their final resting state, all elements visible, no motion.",
              "",
              "In Cowork, tell Claude:",
              "",
              "```",
              "Export [filename].html to a PDF using Playwright. Run these steps in order:",
              "",
              "1. npm install playwright pdf-lib",
              "2. npx playwright install chromium",
              "3. Confirm the Chromium binary downloaded successfully before continuing",
              "4. Write a Node.js script that opens the file at 1440x810 viewport,",
              "   waits 1.5 seconds for animations to settle, captures each .slide",
              "   element as an individual JPEG screenshot, assembles them into a",
              "   multi-page PDF using pdf-lib, and saves it as [filename].pdf",
              "   in my working directory.",
              "",
              "Do not use page.pdf() - it treats the file as a document and breaks",
              "the slide layout. Capture each slide element individually.",
              "```",
              "",
              "Claude will run the Playwright install in the background and begin building your PDF in the same step, using one prompt. It will confirm when the export is complete — your PDF will appear in the same folder as your HTML file.",
              "",
              "**Convert to PowerPoint.** Use this when someone else needs to edit the slides or your environment requires .pptx. Think of it as a 70% draft that needs manual polish. Use the Sonnet model and paste this prompt:",
              "",
              "```",
              "Convert my HTML slide deck to a PowerPoint (.pptx) file. Preserve the slide structure, content, and color scheme as closely as possible. Save the .pptx to my working directory. List any design elements that couldn't transfer cleanly.",
              "```",
              "",
              "*HTML and PowerPoint handle layout very differently — expect to spend 10–15 minutes cleaning up fonts, spacing, and alignment.*",
              "",
              "You can also get **Claude in PowerPoint** via the Microsoft AppSource marketplace. This gives Claude more direct access to your PowerPoint slides, letting it create and edit slide designs within the native UI. For the most PowerPoint-native designs, give it your ASCII file and ask it to turn it into a slide show.",
            ].join("\n"),
          },
          {
            title: "Using a different tool?",
            body: "We're demoing this with HTML/PDF export because it gives the cleanest experience for this build. You can upload the PDF to Google Slides or Canva for further edits, though elements may render differently. If you want to build directly in those tools, Google Slides and Canva both have MCPs (connectors) available, but they're limited in what they can do compared to building in HTML.",
          },
        ],
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Deploy Your Presentation as a Live Site",
            body: [
              "A live URL beats sending a file: your animations work, the design is pixel-perfect, and you can update it anytime without resending.",
              "",
              "**Quickest path — Netlify Drop (no account needed):**",
              "",
              "1. Go to app.netlify.com/drop",
              "2. Drag and drop your HTML file onto the page",
              "3. Get a live URL in under a minute",
              "",
              "**For a permanent, updatable URL — GitHub Pages.** Select the Sonnet model and paste this prompt:",
              "",
              "```",
              "I want to deploy my HTML slide deck to GitHub Pages. Walk me through: creating a new repo, pushing my HTML file, and enabling Pages so I have a public URL I can share and update.",
              "```",
              "",
              "Once it's live, go back to your portfolio card for this presentation and add the URL.",
            ].join("\n"),
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
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: "Time to show off what you built. Share the PDF of your deck, or screenshots, in the cohort Slack channel!",
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "Add Today's Builds to Your Portfolio",
            body: [
              "In Claude Cowork, select the Sonnet model and paste this prompt:",
              "",
              "```",
              "Update my existing portfolio website [your-portfolio-name.html]. Do NOT create a new file - edit the existing one.",
              "",
              "Add a new AI project card to the AI Projects section for my AI-Powered Presentation.",
              "",
              "CARD: AI-Powered Research",
              "I researched [topic], structured the findings into a slide-by-slide outline using my voice guide, styled it with my design skill. [Paste a brief description of your presentation topic and what it covers].",
              "",
              "The card needs:",
              "- Title and one-line description of what it does",
              "- A slide deck thumbnail directly on the card face (like the other cards) - build it as an inline mini-preview using HTML/CSS only (no iframe), showing 2-3 slide thumbnails at roughly 16:9 ratio. Do not use an external file src.",
              "- A \"What I built\" button that opens a popup showing a visual preview of the project (build a mini HTML visualization inside the modal showing a preview of 2-3 key slides or the presentation structure)",
              "- A \"Documentation\" button that opens a popup explaining how I built it step-by-step: the research-to-presentation workflow, what tools and skills I used, and a copyable prompt so someone else could build a similar presentation",
              "",
              "Match the existing design style and structure of the other cards. Keep everything in one HTML file. Replace a placeholder card if one exists, otherwise add a new one.",
              "```",
              "",
              "Then publish:",
              "",
              "- Option 1: Edit your current HTML file using your API key at builders.leland.ai. You will upload the updated portfolio HTML file. Message a TA in Slack to ask for your API key if you didn't save it.",
              "- Option 2: If you set up the Leland connector in Cowork, say \"publish my portfolio to Leland using my custom connector\"",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "markdown",
        body: [
          "### Want to earn AI credit?",
          "",
          "- $20 to the best slide deck — judged on design and content clarity (published to your portfolio at builders.leland.ai)",
          "- $20 to the most creative use of ASCIIs to make a draft before vibe coding — share a screenshot in Slack",
        ].join("\n"),
      },
    ],
  },
  {
    kind: "blocks",
    id: "wrap",
    title: "Summary & next steps",
    durationMin: 3,
    meta: { minsTotal: 90, builds: 4, model: "Sonnet" },
    blocks: [
      {
        kind: "markdown",
        body: [
          "### What you built",
          "",
          "- A research brief on a real topic from your work, saved as a markdown file",
          "- A slide-by-slide outline in your voice",
          "- A polished HTML slide deck styled with your design skill",
          "- An exported deliverable (PDF or .pptx) ready to share",
          "- A new presentation card on your portfolio, published live",
        ].join("\n"),
      },
      {
        kind: "toggle",
        rows: [
          {
            title: "🔧 Go Further: Build a Second Presentation on a Different Topic",
            body: "Run the full workflow again: research, structure, design, animate, export. See how fast you can go the second time.",
          },
          {
            title: "🔧 Go Further: Refine Your Design Skill for Presentations",
            body: "After building two decks, you'll know what presentation-specific rules to add to your design skill. Update it with any slide-specific preferences (max text per slide, chart styles, title formatting, etc.).",
          },
          {
            title: "🔧 Go Further: Build an Animation Skill",
            body: [
              "**💡 Concept: Why Build an Animation Skill?** Same logic as your design skill. Without an animation skill, every time you ask AI to animate something, you start from scratch: \"make it subtle,\" \"not too fast,\" \"no spinning stuff.\" You repeat yourself every time. An animation skill saves your preferences once — it tells AI what animation patterns you like, how fast things should move, what to avoid, and how to use your existing design system colors in animated elements. Once you have it, you just say \"use my animation skill\" and the output is consistent every time. Your animation skill works alongside your design skill: the design skill handles colors, fonts, and layout; the animation skill handles motion.",
              "",
              "**💡 Concept: What Makes a Good Animation.** The best animations follow a few rules:",
              "",
              "- Animations guide attention, not compete for it. A well-timed fade that draws the eye to your key number is great. A spinning logo is not.",
              "- Make the abstract concrete. Every concept has a physical-world equivalent. \"Market share\" = a pie that slices itself. \"Growth over time\" = a line that draws itself.",
              "- One idea per animation. If a slide makes three points, stagger them so the audience processes one thing at a time.",
              "- Simple shapes, smart composition. Rectangles, circles, lines, and text, arranged thoughtfully, communicate more than complex illustrations.",
              "- Timing matters more than effects. A 3-second staggered reveal with good pacing looks more professional than a flashy effect with bad timing. Aim for animations that complete in 3–5 seconds total.",
              "",
              "**Step 1: Pick 1–2 slides to animate.** Look through the slide deck you just built. Good candidates: a comparison (before vs. after, option A vs. B), a process or flow, a key stat or number that deserves emphasis, a framework or structure.",
              "",
              "**Step 2: Create your animation skill.** Give Cowork a reusable set of animation rules that work with your design system. Select the Sonnet model and paste this prompt:",
              "",
              "```",
              "Create a new skill file called animation-skill.md in my working directory.",
              "",
              "This skill should teach you how to add animations to my HTML projects. Base the visual identity (colors, fonts, backgrounds) on my design skill: /[your-design-skill]",
              "",
              "Include these sections:",
              "",
              "1. \"When to use\" - apply this skill when asked to animate HTML content, build animated visuals, or add motion to slides",
              "",
              "2. \"Visual identity\" - pull all colors, fonts, and background colors from my design skill. Don't hardcode any colors in this file. Just reference the design skill.",
              "",
              "3. \"Animation preferences\" - my rules for motion:",
              "   - Animations should feel polished and intentional, not flashy",
              "   - Stagger elements so they appear one at a time (0.15-0.3s delays between items)",
              "   - Total animation sequence should complete in 3-5 seconds",
              "   - Use subtle easing (ease-out for entrances, ease-in-out for transitions)",
              "   - No spinning, bouncing, or anything gimmicky",
              "   - Looping effects (like a gentle pulse on a key element) are fine after the initial sequence",
              "",
              "4. \"Animation patterns\" - include these as my go-to toolkit:",
              "   - Staggered reveal: elements fade up one by one",
              "   - Line draw: SVG paths that draw themselves (for connections, flows, arrows)",
              "   - Progressive build: diagram assembles piece by piece",
              "   - Transformation: before/after with a morph or reveal",
              "   - Pulse/glow: subtle breathing effect on the most important element",
              "   - Count-up: numbers that animate from 0 to their final value",
              "",
              "5. \"Output format\" - self-contained HTML files, 960x540 default size (16:9), include a small replay button in the top-right corner",
              "",
              "Keep the skill concise. No more than one page.",
              "```",
              "",
              "*Review the skill file Cowork creates. Edit anything that doesn't match your taste — this is your animation personality, make it yours!*",
              "",
              "**Step 3: Animate your slides.** Now use your new animation skill to turn the slides you picked into animated visuals. Select the Sonnet model and paste this prompt:",
              "",
              "```",
              "Use my animation skill: /animation-skill.md",
              "And my design skill: /[your-design-skill]",
              "",
              "Take [describe the slide - e.g., \"my slide comparing the three market segments\" or \"the slide showing our 5-step process\"] and turn it into an animated HTML visualization.",
              "",
              "Make the concept visual and concrete. Don't just fade in the same bullet points from the slide. Reimagine it: what's the clearest way to show this concept with motion?",
              "",
              "Rules:",
              "- The output is the COMPLETE deck, not a standalone file for the animated slide only.",
              "- Locate the target slide(s) in the source file, replace the static version with",
              "  the animated version, and leave all other slides exactly as-is.",
              "- Do not overwrite the original file. Save the full updated deck as a NEW file",
              "  named [original-filename]-animated.html in my working directory.",
              "- The original static deck must remain untouched.",
              "```",
              "",
              "1. Click the file link Cowork generates to preview your animation.",
              "2. Refine it. Try: \"The timing is too fast, slow it down,\" \"I want the comparison to show side-by-side, not sequential,\" \"Make the key number bigger and add a count-up effect.\"",
              "3. Repeat for your second slide if time allows.",
              "",
              "*These animated visuals can replace static slides in your deck, or live as standalone files you embed in documents, share in Slack, or present alongside your slides.*",
            ].join("\n"),
          },
        ],
      },
      {
        kind: "callout",
        tone: "blue",
        title: "Looking ahead",
        content: [
          {
            kind: "markdown",
            body: "Next session builds on the workflows and skills you've created so far — keep your design skill, humanize writing skill, and portfolio close, you'll be reusing all of them.",
          },
        ],
      },
    ],
  },
];
