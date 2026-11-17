// Role-specific build tutorials for Lesson 1 / build-1's role picker, adapted
// from the Leland+ library content entries (see each TUTORIAL's `source` for
// the original urn:contentEntry id) and embedded inline rather than linked
// out to, so a learner never leaves the lesson page.
import type { Block, PromptBuilderField } from "./lessonBlocks";

type TutorialStep = {
  title: string;
  body: string;
  tips: string[];
};

// A tutorial either carries a fixed prompt (most role-specific builds — the
// prompt already asks the AI tool to interview the learner) or a
// promptBuilder (the generic/"Custom" build — asked inline instead, so a
// question we can answer ourselves, like role, doesn't get asked twice).
type TutorialSource = {
  source?: string; // urn:contentEntry id this was adapted from, when there is one
  about: string[];
  setupHeaders?: string[]; // omit along with setupRows to skip the Setup table
  setupRows?: string[][];
  niceToHave?: string; // omit to skip the callout — keeps the lead-up short for the generic/custom build
  buildIntro?: string; // omit along with the heading to go straight from `about` into the prompt
  prompt?: string;
  promptBuilder?: {
    fields: PromptBuilderField[];
    buildPrompt: (answers: Record<string, string>, knownRole: string | null) => string;
  };
  steps: TutorialStep[];
};

function buildTutorial(src: TutorialSource): Block[] {
  const promptBlock: Block = src.promptBuilder
    ? { kind: "promptBuilder", filename: "Prompt", fields: src.promptBuilder.fields, buildPrompt: src.promptBuilder.buildPrompt }
    : { kind: "code", language: "prompt", filename: "Prompt", code: src.prompt ?? "" };

  const niceToHaveBlock: Block | null = src.niceToHave
    ? {
        kind: "callout",
        tone: "tan",
        title: "Nice to have",
        content: [{ kind: "markdown", body: src.niceToHave }],
      }
    : null;

  const setupBlocks: Block[] =
    src.setupHeaders && src.setupRows
      ? [
          { kind: "markdown", body: "### Setup" },
          { kind: "table", headers: src.setupHeaders, firstColumnBold: true, rows: src.setupRows },
        ]
      : [];

  const buildIntroBlock: Block | null = src.buildIntro
    ? { kind: "markdown", body: ["### Build it with this prompt", "", src.buildIntro].join("\n") }
    : null;

  return [
    { kind: "markdown", body: src.about.join("\n\n") },
    ...setupBlocks,
    ...(niceToHaveBlock ? [niceToHaveBlock] : []),
    ...(buildIntroBlock ? [buildIntroBlock] : []),
    promptBlock,
    { kind: "markdown", body: "### Steps" },
    {
      kind: "steps",
      items: src.steps.map((s) => ({
        text: `**${s.title}** — ${s.body}`,
        blocks: [{ kind: "markdown", body: s.tips.join("\n") } as Block],
      })),
    },
  ];
}

export const SALES_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf9035a622097531bc3e5",
  about: [
    "Before a first call, most reps open the prospect's website, skim a LinkedIn page, search for recent news, and keep the highlights in their head or a scattered note. This build puts that research on one page you can open in a browser and share with a teammate. You'll start with the prospect's website, a few recent news items, and your own product notes. Your AI searches and reads what it needs, then writes a brief with a company snapshot, the pains that company likely has, three talking points tied to what you sell, and the questions you still need to ask.",
    "First you'll answer a few questions so it understands what you sell and what a good brief looks like to you. Then it builds the brief page from your answers, and you run it once on a real prospect and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A real prospect you plan to talk to",
      "The brief is only useful when you can check it against what you know",
      "Pick one account with a call coming up, and have the company name and website address ready.",
    ],
    [
      "Notes on your own product",
      "The talking points tie their situation to what you sell",
      "Paste a one-pager, a pitch deck outline, or a few lines on who you sell to and what you solve.",
    ],
  ],
  niceToHave:
    "Turn on web search in your AI tool's tools or search menu so it can read the prospect's site and news. Claude, ChatGPT, and Gemini all offer it, and some tools have it on by default. Without it, paste the text of their About page and two news articles into the chat. Also paste a few lines from the prospect's LinkedIn page, such as the company description or your contact's title, since AI tools often can't read LinkedIn pages directly. If you made a design guide with your team's colors and fonts, add it so the brief matches the look of your other sales documents. Without it, the page uses a clean default look.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a one-page account brief for a prospect, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the brief include, and in what order? For example a company snapshot, likely pains, three talking points, and open questions.\n2. What will I give you for each prospect: a website address, news links, LinkedIn text, my product notes, and where do my product notes live?\n3. How should you pick the pains and the three talking points: by the prospect's industry, by their size, by recent news, or by which of my products fits best?\n4. How often will I build one, and who will see the page besides me?\n5. What should the brief never do or assume? For example, no guessing a company's revenue, headcount, or tools when the site doesn't say, and no claims about a person I haven't confirmed.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the brief page.\n- Search the web for the prospect's company site and recent news. Read what you find before you write anything.\n- Write a company snapshot using only facts you found, and put the source after each fact.\n- Write likely pains as likely, not certain, and say what in the research points to each one.\n- If a fact conflicts between sources, like two different employee counts, show both and name the sources.\n- If the prospect is a subsidiary, a very small company, or has almost no public information, say so on the page and keep the brief short instead of padding it.\n- Never copy details from my product notes into the snapshot as if they were about the prospect.\n- Write exactly three talking points that connect something in the research to something I sell. Put anything you could not find in a list of open questions for the call.\n- Tell me exactly what to paste or confirm, one thing at a time, and wait for it. Likely sources: the website address, news links, LinkedIn text, and my product notes. If web search is off, I'll paste the text.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. Sections in this order: company snapshot, likely pains, three talking points, open questions, sources. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.\n\nStage 3: Evaluate\nGrade the brief page you just made from my real prospect against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a new brief for every prospect.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what a good brief looks like to you, what you'll give it for each prospect, how it should choose pains and talking points, who else sees the page, what it should never claim, and what makes the page good. After your answers, it writes a short spec with three yes/no checks, and you confirm it before anything gets built.",
      tips: [
        "**Tip:** When it asks how to pick talking points, say what usually opens a conversation for you, like a recent funding round or a new executive. That is what tells it which research matters.",
        "**Tip:** Write one check about invented facts, such as \"every number in the snapshot has a source next to it.\" It is the mistake that costs you the most on a call.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for the prospect's website, any news links, and your product notes, one at a time. It searches, reads, and writes the brief, marking each pain as a likely one and listing what it could not find. You end up with one HTML file you can open in a browser and send to a teammate.",
      tips: [
        "**Tip:** Run it on a prospect you already know well. You'll spot a wrong fact right away, which tells you how far to trust it on a company you've never researched.",
        "**Tip:** If your AI shows the page in a preview pane, open it in a full browser tab before you share it, so you see what your teammate will see.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the brief page it just built against the three checks, quoting the line that shows each one passing or failing. If one fails, it fixes the biggest miss and rebuilds the page for the same prospect.",
      tips: [
        "**Tip:** Read the open questions first. They show where the research ran out, and they are usually the best things to ask on the call.",
        "**Tip:** Keep the instructions block it gives you. Before your next call, paste it into a new chat with the next prospect's website and get a fresh brief.",
      ],
    },
  ],
});

export const SALES_PROPOSAL_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Most proposals go out as a plain doc or a generic template — no logo, no brand colors, nothing that signals you've done this before. This build turns a rough proposal draft into a styled one-page web page: your logo, your brand colors and fonts, and a clean layout for scope, pricing, and next steps. You'll start with a messy draft of what's included, the price, and your company's basic brand details.",
    "First you'll answer a few questions about what the proposal should include and what your brand looks like. Then it builds the page from your draft, and you check it against a real proposal you're about to send. Plan on about 30 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A rough proposal draft",
      "The page only works if there's real scope and pricing to style",
      "Paste in bullet points or a messy doc: what's included, the price, and the timeline.",
    ],
    [
      "Your brand basics",
      "So the page looks like it came from your company, not a template",
      "Have your logo file or URL, your brand color, and font name ready — or describe them if you don't have a formal guide.",
    ],
  ],
  niceToHave:
    "If you have a brand guide or style guide, attach it — your AI can pull the exact colors and fonts from it instead of guessing. Without one, describe your brand in a sentence (for example, \"navy and white, clean sans-serif, modern but not flashy\") and it'll make reasonable choices.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your proposal and your brand first, then builds, then checks what it built with you.",
  prompt:
    "I want to build a one-page proposal as a single web page I can open in a browser and send, styled in my company's brand, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the proposal include, and in what order? For example scope, pricing, timeline, and next steps.\n2. What are my brand colors, fonts, and do I have a logo file or URL?\n3. What tone should it read in — formal, casual, somewhere in between?\n4. Who sees this besides the prospect — do I need to keep a copy or send it to a teammate first?\n5. What should the page never do or assume? For example, never invent a price or scope item I didn't give you.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the proposal page.\n- Ask me for my rough draft (scope, price, timeline) and my brand details, one at a time, and wait for each answer.\n- Use only the scope and pricing I gave you — never invent or round a number.\n- Apply my brand colors and fonts throughout, and place my logo at the top.\n- Keep the layout to one scrollable page: a short intro, the scope, the price, the timeline, and a clear next step.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.\n\nStage 3: Evaluate\nGrade the proposal page you just made against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat to build the next proposal.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what the proposal should include, what your brand colors and fonts are, and what tone it should read in. After your answers, it writes a short spec with three yes/no checks, and you confirm it before anything gets built.",
      tips: [
        "**Tip:** Paste your draft exactly as it is, even if it's messy bullet points — the AI will organize it, but it needs the real numbers from you.",
        "**Tip:** Write one check about invented numbers, such as \"every price and date on the page matches what I gave it.\" That's the mistake that costs you the most.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your draft and your brand details, then builds one styled HTML page with your logo, colors, and fonts applied throughout.",
      tips: [
        "**Tip:** If you don't have brand colors handy, pull them from your company website or a recent slide deck before you start.",
        "**Tip:** Open the page in a full browser tab, not just a preview pane, before you judge how it looks.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against your three checks, quoting the line that shows each one passing or failing. If one fails, it fixes the biggest miss and rebuilds the page.",
      tips: [
        "**Tip:** Send it to a teammate first and ask if it looks like it came from your company — that's a faster check than staring at it yourself.",
        "**Tip:** Keep the instructions block it gives you so your next proposal takes minutes, not thirty.",
      ],
    },
  ],
});

export const SALES_RECAP_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Right after a good call, momentum is highest — and most reps either send nothing or a plain email recap that gets buried. This build turns your raw call notes into a polished, one-page recap of what was discussed, what you agreed to, and next steps, styled with your company's colors and fonts so it reads like a real deliverable instead of another email. You'll start with your notes from one real call.",
    "First you'll answer a few questions about what a good recap includes and what your brand looks like. Then it builds the page from your notes, and you send it after your next call. Plan on about 20 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "Notes from a real call",
      "The recap is only useful when it's built from something that actually happened",
      "Jot down a few lines right after your next call: what was discussed, any numbers mentioned, and what you both agreed to next.",
    ],
    [
      "Your brand basics",
      "So the page looks like it came from your company, not a plain email",
      "Have your logo and brand colors and fonts ready, or describe them in a sentence.",
    ],
  ],
  niceToHave:
    "If you have a brand guide, attach it so your AI pulls the exact colors and fonts instead of guessing. A call recording or transcript also works in place of notes — paste in the transcript and it'll pull out the same details.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your call and your brand first, then builds, then checks what it built with you.",
  prompt:
    "I want to build a one-page call recap as a single web page I can open in a browser and send to a prospect, styled in my company's brand, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the recap include, and in what order? For example what was discussed, what we agreed to, and next steps with owners and dates.\n2. What are my brand colors, fonts, and do I have a logo file or URL?\n3. Should it name attendees from both sides, or stay general?\n4. What should the page never do or assume? For example, never invent a commitment or a date that wasn't actually discussed.\n5. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the recap page.\n- Ask me for my call notes (or a transcript) and my brand details, one at a time, and wait for each answer.\n- Pull out only what's actually in my notes — never invent a number, a commitment, or a date.\n- Apply my brand colors and fonts throughout, and place my logo at the top.\n- Keep the layout to one scrollable page: a short summary line, what was discussed, what we agreed to, and next steps with clear owners.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.\n\nStage 3: Evaluate\nGrade the recap page you just made against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat to build a recap after my next call.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what the recap should include, what your brand colors and fonts are, and whether to name attendees. After your answers, it writes a short spec with three yes/no checks, and you confirm it before anything gets built.",
      tips: [
        "**Tip:** Write one check about invented commitments, such as \"every next step on the page was actually said on the call.\" That's the mistake a prospect notices first.",
        "**Tip:** If you usually record calls, decide now whether to use the transcript or your own notes — the transcript catches more detail but takes longer to read through.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your notes and your brand details, then builds one styled HTML page with your logo, colors, and fonts applied throughout.",
      tips: [
        "**Tip:** Send your notes to it as soon after the call as you can, while you still remember the details you didn't write down.",
        "**Tip:** Open the page in a full browser tab before you judge how it looks, not just a preview pane.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against your three checks, quoting the line that shows each one passing or failing. If one fails, it fixes the biggest miss and rebuilds the page.",
      tips: [
        "**Tip:** Send it within a few hours of the call — that's most of the value of doing this at all.",
        "**Tip:** Keep the instructions block it gives you so your next recap takes minutes, not thirty.",
      ],
    },
  ],
});

export const SALES_DEMO_DECK_TUTORIAL: Block[] = buildTutorial({
  about: [
    "A generic demo deck tries to cover everything and lands nothing. This build turns your standard talking points into a short, three-to-five-slide deck scoped to one prospect — their priorities first, not your product's full feature list. You'll start with your usual demo talking points and what you know this prospect cares about.",
    "First you'll answer a few questions about what your demo usually covers and what matters to this prospect. Then it builds a short deck from your answers, and you run it before your next real demo. Plan on about 30 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "Your usual demo talking points",
      "The deck needs real content to scope, not a blank slate",
      "Paste your standard demo script, slide outline, or a bullet list of what you usually cover.",
    ],
    [
      "What this prospect cares about",
      "Scoping to their priorities is what makes it feel built for them",
      "Pull a sentence or two from your notes on their stated goals, pain points, or what came up on your last call.",
    ],
  ],
  niceToHave:
    "If you have a brand guide or an existing deck template, attach it so your AI matches the colors, fonts, and slide layout instead of guessing. Without one, describe your brand in a sentence and it'll make reasonable choices.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your usual demo and this prospect first, then builds, then checks what it built with you.",
  prompt:
    "I want to build a short demo deck scoped to one prospect, as a single web page I can open in a browser and present from, styled in my company's brand, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What does my standard demo usually cover, in order?\n2. What do I know about this specific prospect's priorities, pain points, or goals?\n3. How many slides is reasonable — three, five, more?\n4. What are my brand colors, fonts, and do I have a logo file or URL?\n5. What should the deck never do or assume? For example, never invent a feature I don't have, never claim a result I haven't gotten.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the deck.\n- Ask me for my standard talking points and what I know about this prospect, one at a time, and wait for each answer.\n- Reorder and trim my usual talking points so the ones matching this prospect's priorities come first; cut anything that doesn't serve this prospect.\n- Never invent a feature, a number, or a result I didn't give you.\n- Apply my brand colors and fonts throughout, and place my logo on the first slide.\n- Build it as a sequence of full-screen sections in one scrollable page, each one reading like a slide, with a short headline and a few lines per section.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.\n\nStage 3: Evaluate\nGrade the deck you just built against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat to build the next prospect's deck.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what your standard demo covers, what you know about this prospect, how many slides makes sense, and your brand details. After your answers, it writes a short spec with three yes/no checks, and you confirm it before anything gets built.",
      tips: [
        "**Tip:** Say which single priority matters most to this prospect — that becomes the slide order, not just a footnote.",
        "**Tip:** Write one check about invented claims, such as \"every feature and number on a slide is one I actually gave it.\"",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI reorders and trims your usual talking points around this prospect's priorities, then builds a short sequence of slide-style sections in one styled HTML page.",
      tips: [
        "**Tip:** Give it the one thing this prospect said on your last call, even a throwaway line — that's often the strongest hook for slide one.",
        "**Tip:** Open it in a full browser tab and actually scroll through it like you'd present it, not just skim the code.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the deck it just built against your three checks, quoting the line that shows each one passing or failing. If one fails, it fixes the biggest miss and rebuilds it.",
      tips: [
        "**Tip:** Present it to a colleague first and time how long it takes to get through — if it's over five minutes, cut another slide.",
        "**Tip:** Keep the instructions block so your next prospect's deck takes minutes, built from the same base talking points.",
      ],
    },
  ],
});

// Placeholder content for builds still being scoped — lorem ipsum stands in
// for real tutorial content so the picker's layout can be previewed with a
// realistic number of cards before every build is written.
// Stand-in step content for a build whose title and description are real
// (confirmed against the live tutorial library) but whose actual walkthrough
// hasn't been authored yet. Reads as an honest "not written yet" placeholder
// rather than lorem ipsum, which could be mistaken for real draft content.
export const LOREM_STUB_TUTORIAL: Block[] = buildTutorial({
  about: [
    "This build's full step-by-step tutorial hasn't been authored yet — this is placeholder content standing in for it.",
    "The title and description above are real, but the setup, prompt, and steps below are not. Check back once this tutorial has been written.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    ["Not yet written", "—", "—"],
    ["Not yet written", "—", "—"],
  ],
  niceToHave: "Not yet written.",
  buildIntro: "Not yet written.",
  prompt: "This build's prompt hasn't been written yet.",
  steps: [
    {
      title: "Scope",
      body: "Not yet written.",
      tips: ["**Tip:** This step hasn't been authored yet."],
    },
    {
      title: "Build",
      body: "Not yet written.",
      tips: ["**Tip:** This step hasn't been authored yet."],
    },
    {
      title: "Evaluate",
      body: "Not yet written.",
      tips: ["**Tip:** This step hasn't been authored yet."],
    },
  ],
});

export const MARKETING_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf926d2ed8afc502df5b2",
  about: [
    "Ask three people at a company what it does and you tend to get three answers, because the story lives in an About page, a sales deck, and a few case studies that were each written for a different reader. This build pulls those into one page you can open in a browser and share with a new hire, a partner, or a journalist. You'll start with your company website, plus a deck or a couple of case studies. Your AI reads them and writes a page that covers who you serve, the problem you solve, your products, and the proof, using real customer quotes and numbers.",
    "First you'll answer a few questions so it understands your audience and how you talk about the company. Then it builds the page from your answers, and you run it once on your real material and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "Your company website address or a saved About page",
      "The story starts from how you describe yourself publicly",
      "Have the web address ready, or save the About page as a PDF and attach it.",
    ],
    [
      "A deck or two or three case studies",
      "Proof points, quotes, and numbers come from these",
      "Attach them as PDF, Word, or PowerPoint files, or paste the text.",
    ],
  ],
  niceToHave:
    "Add your logo and the colors and fonts from your brand guidelines, so the story page looks like your website. Without them, the page uses a clean default design you can restyle later. If you aren't sure which customer quotes are approved, ask the case study owner first. Without that, tell your AI which ones to leave out. Turn on web search if you want your AI to read your site directly instead of from pasted text.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a one-page company story, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the page include and in what order? For example who we serve, the problem, our products, proof points, and a contact line.\n2. What will I give you: my website address, an About page, a deck, case studies, and where do they live?\n3. Who is this page for and what should they do after reading it: a prospective customer, a partner, a new hire, or a journalist?\n4. How often will I update it, and who sees it besides me?\n5. What should the page never do or assume? For example, no customer names, quotes, or numbers I haven't approved, and no claims like \"market leader\" without a source.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the company page.\n- Read my site and documents first and write the story in the words my own materials use.\n- Write who we serve in one or two sentences, then the problem, then each product in a line or two.\n- For proof points, use only quotes and numbers that appear in my case studies or deck, and put the source next to each one. Never round or improve a number.\n- If my materials disagree, like two different customer counts or two product names, show me both and ask which is current.\n- If a quote has no named person or company, or I haven't said it's approved, leave it out and list it as a question for me.\n- If I have no proof points yet, build the page without that section and tell me what to collect.\n- Tell me exactly what to paste or attach, one thing at a time, and wait for it. Likely sources: my website address, an About page, a deck, and case studies. If web search is off, I'll paste the text.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser. After the code, list every quote and number with where it came from.\n\nStage 3: Evaluate\nGrade the page you just made from my real materials against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can rebuild the page whenever our story changes.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what belongs on the page, what you'll give it, who the page is for, how often it changes, what it should never claim, and what makes it good. It then writes a short spec with three yes/no checks, and you confirm it before it builds anything.",
      tips: [
        "**Tip:** Name one specific reader when it asks who the page is for, such as a prospect who has never heard of you. A single reader decides what goes first.",
        "**Tip:** Write one check about proof, such as \"every number and quote traces to a case study.\" A company story with a wrong number is worse than one with none.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your site, your deck, and your case studies, one at a time, and reads them before it writes a word. It drafts the story in your own materials' language and builds a page with a source next to every quote and number. You end up with one HTML file you can open in a browser and share, plus a list of where each proof point came from.",
      tips: [
        "**Tip:** Give it the case studies with the best numbers, not all of them. Three strong ones make a tighter page than ten.",
        "**Tip:** When it asks which of two conflicting facts is current, answer from memory right away. Those conflicts are usually where your old materials have drifted apart.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page from the same materials.",
      tips: [
        "**Tip:** Read the proof section against the original case study once yourself. Checking one number takes a minute and tells you whether to trust the rest.",
        "**Tip:** Keep the instructions block it gives you. When you launch a product or land a new customer, paste it into a new chat with the new material and rebuild the page.",
      ],
    },
  ],
});

export const PEOPLE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf8ddd41d2460d0fd75b8",
  about: [
    "A new hire's first week often arrives as a PDF checklist, a few calendar invites, and a list of links scattered across several emails, so day one starts with hunting for things. This build puts everything for one person on a single page they can open in a browser. You'll start with your onboarding checklist, the hire's role and start date, and a list of the people on their team. Your AI turns them into a welcome page with a day-by-day first week, the people to meet and why, the links they need, and a short FAQ. Once you've built it, you reuse it for each new hire.",
    "First you'll answer a few questions so it understands how onboarding works at your company. Then it builds the welcome page from your answers, and you run it once on a real upcoming hire and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "Your onboarding checklist or onboarding doc",
      "The first-week schedule and the FAQ come from it",
      "Attach it as a PDF or Word file, or paste the text.",
    ],
    [
      "Details for one real or recent new hire",
      "The page is personal, so it needs a name, role, start date, and manager",
      "Use the next person starting, or someone from the last few months.",
    ],
    [
      "The team list for that hire",
      "The page tells them who to meet and why",
      "Paste names, titles, and a line on what each person helps with.",
    ],
  ],
  niceToHave:
    "Add your company logo, colors, and fonts so the welcome page looks like the rest of your onboarding material. Without them, the page uses a clean default design. If your onboarding links live in a shared doc, paste the link list so the page can point to the real tools. Without it, the page leaves those links out and your AI lists each missing one for you to fill in before you send it.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a personal welcome page for a new hire, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the welcome page include and in what order? For example a greeting, a day-by-day first week, people to meet, links, and an FAQ.\n2. What will I give you for each hire: an onboarding checklist, their role and start date, a team list, and where do those live?\n3. How should the first week differ by role, and which parts are the same for everyone: for example equipment, accounts, and the company intro?\n4. How often will I build one, and who sees the page besides the new hire?\n5. What should the page never do or assume? For example, no meetings, times, or people I haven't confirmed, and no pay, benefits, or policy details unless I paste the exact wording.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the welcome page.\n- Write it to the new hire, by first name, in a warm and plain tone.\n- Build the first week day by day from my checklist. If the checklist gives no time or room for something, write \"time to be confirmed\" instead of inventing one.\n- List people to meet with their title and one line on why, using only names from my team list.\n- If a checklist item has no owner or no link, put it in a list of items I still need to fill in, and show that list to me, not on the page.\n- If the start date falls on a weekend or a holiday, or my checklist covers more than five days, ask me how to handle it.\n- Keep anything private out of the page: no salary, no performance notes, no personal details beyond name, role, and start date.\n- Write the FAQ from questions my onboarding doc already answers. Do not invent policies.\n- Tell me exactly what to paste or attach, one thing at a time, and wait for it. Likely sources: the onboarding checklist as a PDF or Word file, the hire's details, and the team list. If nothing is connected, I'll paste it.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser. Put the list of items I still need to fill in after the code.\n\nStage 3: Evaluate\nGrade the welcome page you just made from my real hire details against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a page for every new hire.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what belongs on the page, what you'll give it for each hire, how the first week differs by role, who sees the page, what it should never make up, and what a good page looks like. Then it writes a short spec with three yes/no checks, and you confirm it before it builds anything.",
      tips: [
        "**Tip:** When it asks what differs by role, list the one or two things that always change, like the tools an engineer needs compared with a salesperson. Everything else becomes a fixed template you reuse.",
        "**Tip:** Write one check about what you haven't confirmed, such as \"no meeting appears without a time or the words time to be confirmed.\" New hires act on what the page says.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your checklist, the hire's details, and the team list, one at a time. It writes the page to the hire by name, builds the week day by day, and keeps anything missing in a separate list for you. You end up with one HTML file the new hire can open in a browser, and a short list of gaps to fill before you send it.",
      tips: [
        "**Tip:** Use a hire from a few months ago for the first run. You'll know right away whether the week and the people it lists match what actually happened.",
        "**Tip:** Check the \"still to fill in\" list before you send anything. An empty slot is much easier to fix than a wrong one.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page from the same details.",
      tips: [
        "**Tip:** Read the first-week schedule as if you were the new hire on Monday morning. If anything leaves you wondering where to be, tell it which line to fix.",
        "**Tip:** Keep the instructions block it gives you. When the next hire is confirmed, paste it into a new chat with their details and get their page back.",
      ],
    },
  ],
});

export const FINANCE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf927fb1c2834e44ec97e",
  about: [
    "A budget export is built for the person who maintains it, which is why a department head who gets the full spreadsheet usually looks at the bottom line and nothing else. This build turns one export into a page they can read in a minute. You'll start with a budget spreadsheet exported from your finance system or kept in Excel or Google Sheets. Your AI reads it and builds a page that shows plan against actual, the five biggest lines, one callout about what stands out, and what comes next.",
    "First you'll answer a few questions so it understands how your budget is laid out and who reads the summary. Then it builds the page from your answers, and you run it once on a real export and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A budget export for one team or department",
      "Every number on the page comes from this file",
      "In Excel, use File, Save As, and pick CSV or keep the .xlsx. In Google Sheets, use File, Download.",
    ],
    [
      "Both a plan column and an actual column in the file",
      "The page compares the two, so it needs both",
      "If your export only has actuals, add the budget column from your plan file before you start.",
    ],
  ],
  niceToHave:
    "Add your finance team's template colors and fonts so the summary matches your monthly reports. Without them, the page uses a clean default design. If you can't export your real budget, ask your AI for a realistic sample file with the same columns and practice on that.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a one-page budget summary, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the page include and in what order? For example plan against actual, the top five lines, one callout, and what's next.\n2. What will I give you: a budget export as CSV or a spreadsheet, which columns hold plan and actual, and which period should it cover?\n3. What counts as a notable variance for this reader: a percentage, a dollar amount, or both, and is over budget treated differently from under budget?\n4. How often will I build one, and who sees the page besides me?\n5. What should the page never do or assume? For example, no explaining why a line is off unless I told you the reason, and no forecast numbers I didn't give you.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the budget page.\n- Read the file and tell me what you found: the columns, the number of rows, and the period. Ask me to confirm before you continue.\n- Compute the variance for every line yourself from the plan and actual columns. Show variance in dollars and in percent. Never type a number that is not in the file or computed from it.\n- If a row has a blank plan or actual, or the total row does not match the sum of the lines, list the problem for me and ask how to treat it.\n- If there are duplicate lines, subtotal rows mixed in with detail rows, or negative amounts, ask me before you include them. Leave out lines with a plan and an actual of zero.\n- Pick the top five lines by actual spend unless I said otherwise.\n- Write one callout in plain words about the biggest variance. State the number and its direction. Do not guess the cause.\n- Tell me exactly what to upload or paste, one thing at a time, and wait for it. If nothing is connected, I'll upload the export or paste the rows.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file and the numbers written into the page. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser. After the code, list the calculations you made and any rows you set aside.\n\nStage 3: Evaluate\nGrade the budget page you just made from my real export against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a new summary from each month's export.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what the page should show, which file and columns to use, what counts as a notable variance, who reads it, what it should never assume, and what a good page looks like. Then it writes a short spec with three yes/no checks, and you confirm it before it reads your data.",
      tips: [
        "**Tip:** Give it the exact variance threshold you use, like \"anything over 10 percent or $5,000.\" Otherwise it picks its own, and its idea of notable won't match your reader's.",
        "**Tip:** Write one check that every number on the page matches the export, since a wrong figure in a budget summary costs you the reader's trust.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for the export, tells you what it found in the columns and rows, and waits for your confirmation. It calculates every variance itself, sets aside rows it can't use, and builds the page with the top five lines and one callout. You end up with one HTML file you can open in a browser and share, plus a list of the calculations and skipped rows.",
      tips: [
        "**Tip:** Include the total row in the export. Your AI uses it to check that the lines add up, which catches a missing row before it reaches the page.",
        "**Tip:** If it asks about a subtotal or an odd blank, answer from your own knowledge of the budget. Those questions come from the places where an export most often misleads.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page from the same export.",
      tips: [
        "**Tip:** Compare the callout and the top line against your spreadsheet yourself. Two numbers checked by hand tell you whether the rest holds up.",
        "**Tip:** Keep the instructions block it gives you. Next month, paste it into a new chat with the new export and get a fresh page.",
      ],
    },
  ],
});

export const PRODUCT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf95b729c9f8dfbc9f6c9",
  about: [
    "When a feature ships, the people who need to explain it, such as sales, support, and customers, usually get a ticket list or a long PRD written for the team that built it. This build turns your release notes into one page you can open in a browser and share with them. You'll start with release notes, a PRD, or a list of tickets for one feature. Your AI reads them and builds a launch page that covers what changed, who the feature is for, how to use it step by step, and what's coming next.",
    "First you'll answer a few questions so it understands the feature and who will read the page. Then it builds the launch page from your answers, and you run it once on a real feature and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "Release notes, a PRD, or a ticket list for one feature",
      "Everything on the page comes from this material",
      "Paste the text, or attach a PDF or Word file. For tickets, export a CSV from Jira, Linear, or your tracker.",
    ],
    [
      "The feature name and who it ships to",
      "The page names the audience and says when it is available",
      "Know the launch date or release version, and which customers or plans get it.",
    ],
  ],
  niceToHave:
    "Add your product's colors, fonts, and logo so the launch page looks like your docs and your app. Without them, the page uses a clean default design. Have screenshots of the feature ready by file name. Without them, the page keeps a labeled placeholder where each one belongs. If you have no real feature handy, ask your AI for a realistic set of release notes and practice on that.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a one-page feature launch page, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What should the page include and in what order? For example what changed, who it's for, how to use it, and what's next.\n2. What will I give you: release notes, a PRD, or a ticket export, and where does each live?\n3. Who reads this page first, and what do they need most: customers learning to use the feature, sales explaining it, or support answering questions?\n4. How often will I build one, and who sees the page besides me?\n5. What should the page never do or assume? For example, no dates, pricing, or availability that aren't in my notes, and no promises about features that are still being planned.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the launch page.\n- Write for the reader I named. Use plain words and the product's own feature names.\n- Describe what changed in a short paragraph, in terms of what the reader can now do.\n- Write how-to steps only from steps in my material. If the notes don't say how something works, put a question in a list for me.\n- If the material mixes shipped and planned work, the \"what's next\" section may include only items my notes call planned, and each must be marked as not committed.\n- If tickets are internal, like refactors or bug fixes with no user effect, leave them out and tell me which ones.\n- If the notes name several audiences or plans, show who gets what in a short list, and ask me when it is unclear.\n- Leave a clearly labeled placeholder where a screenshot belongs. Do not describe an image you haven't seen.\n- Tell me exactly what to paste or attach, one thing at a time, and wait for it. Likely sources: release notes, a PRD as a PDF or Word file, and a ticket export as CSV. If nothing is connected, I'll paste it.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser. After the code, list the tickets you left out and the questions I still need to answer.\n\nStage 3: Evaluate\nGrade the launch page you just made from my real release notes against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a page for every launch.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what the page should cover, what you'll give it, who reads it first, who else sees it, what it should never promise, and what a good page looks like. Then it writes a short spec with three yes/no checks, and you confirm it before it builds.",
      tips: [
        "**Tip:** Pick one primary reader when it asks. A page for customers and a page for support start from different questions, so write the one you need most.",
        "**Tip:** Write one check about the \"what's next\" section, such as \"nothing appears there that my notes don't call planned.\" It is where launch pages most often over-promise.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your release notes, PRD, or tickets, one at a time. It writes what changed in terms of what users can do now, builds the how-to from your own steps, and keeps a list of internal tickets it left out and questions it couldn't answer. You end up with one HTML file you can open in a browser and share.",
      tips: [
        "**Tip:** Paste the PRD along with the release notes when you have both. The notes say what shipped, and the PRD usually says who it's for and why.",
        "**Tip:** Answer its open questions before you share the page. Each one marks a place where the notes were silent and a reader would have had to guess.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page from the same notes.",
      tips: [
        "**Tip:** Walk through the how-to steps in the real product once. If a step doesn't match what you see, tell your AI which one so it fixes the page and your notes.",
        "**Tip:** Keep the instructions block it gives you. At the next launch, paste it into a new chat with the new release notes and get a page back.",
      ],
    },
  ],
});

export const OPERATIONS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6aecf95b77d17e22e9a3438a",
  about: [
    "Most recurring processes, like closing the month, onboarding a vendor, or running a weekly launch review, are written down once in a document that nobody has open while the work is happening. This build turns one of them into a checklist page you can open in a browser. You'll start with the process doc, your own notes, or the transcript of a recorded walkthrough. Your AI reads it and builds a page where each step has a checkbox, an owner, and a notes field, so whoever runs the process can work through it and see what's done.",
    "First you'll answer a few questions so it understands how the process runs and who does what. Then it builds the checklist from your answers, and you run it once on a real process and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "One recurring process you know well",
      "The steps have to match how the work is really done",
      "Pick something that runs weekly or monthly, with a clear start and finish.",
    ],
    [
      "A process doc, rough notes, or a walkthrough transcript",
      "The steps come from this material",
      "Paste the text or attach a PDF or Word file. For a recording, export the transcript from Zoom, Loom, or Teams and paste it.",
    ],
    [
      "The names of the people involved",
      "Each step gets an owner",
      "List the people or roles who touch the process, such as Finance lead or Store manager.",
    ],
  ],
  niceToHave:
    "Add your team's colors and fonts so the checklist matches your other process docs. Without them, the page uses a clean default design. Checkmarks and notes live in the browser tab, so they are gone when the page is closed or refreshed unless your AI adds a save button. Ask for one and it saves a file you can reopen.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build an interactive checklist page for a process I run again and again, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. Which process is this, where does it start and finish, and what should each step show: a checkbox, an owner, a notes field, or a due date?\n2. What will I give you: a process doc, my own notes, or a walkthrough transcript, and where does it live?\n3. Which steps have to happen in order, which can happen in parallel, and which only apply sometimes?\n4. How often is this process run, and who will use the page besides me?\n5. What should the checklist never do or assume? For example, no steps that aren't in my material, and no owner assigned to a step unless I said who does it.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the checklist page.\n- Break my material into numbered steps, each one an action starting with a verb. Keep my own wording for names of tools, forms, and systems.\n- If a step has no owner in my material, set the owner to \"to assign\" instead of picking one.\n- If my notes repeat a step, skip a step that someone must have done, or mix two steps into one, list those cases for me and ask how to handle them.\n- If a step depends on another, show the dependency in the step. If a step only applies sometimes, label the condition.\n- Put a checkbox, an owner field, and a notes field on every step, and show a count of steps done at the top of the page.\n- If my material has contradictions, like two different deadlines for the same step, show both and ask me which is right.\n- Tell me exactly what to paste or attach, one thing at a time, and wait for it. Likely sources: a process doc, my notes, or a transcript from Zoom, Loom, or Teams. If nothing is connected, I'll paste it.\n- If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles and the checkbox behavior inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser. After the code, list the steps you changed or split and the questions I still need to answer.\n\nStage 3: Evaluate\nGrade the checklist page you just made from my real process against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a checklist for the next process.",
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking which process this is, what each step should show, what you'll give it, which steps are ordered or conditional, who uses the page, and what it should never assume. Then it writes a short spec with three yes/no checks, and you confirm it before it builds.",
      tips: [
        "**Tip:** When it asks about order, name the one step people most often do out of sequence. The page can then call it out where it matters.",
        "**Tip:** Write one check about owners, such as \"no step has an owner I didn't name.\" A wrong name on a step causes more confusion than a blank one.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your process doc, notes, or transcript, one at a time. It breaks the material into numbered steps with a checkbox, an owner, and a notes field on each, and it lists any step it split or any place the material contradicted itself. You end up with one HTML file you can open in a browser and share.",
      tips: [
        "**Tip:** Record yourself talking through the process and give your AI the transcript along with the doc, because people mention the awkward steps out loud and leave them out of documents.",
        "**Tip:** Check the list of split or merged steps first. It shows where the old document was vague, and that is where the checklist helps most.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page from the same material.",
      tips: [
        "**Tip:** Try the page once on a real run of the process, checking boxes as you go. You'll find a missing or out-of-order step faster than you would by reading it.",
        "**Tip:** Keep the instructions block it gives you. When you want a checklist for another process, paste it into a new chat with that process's doc.",
      ],
    },
  ],
});

// Shown when the learner's role isn't on file or doesn't match a role-specific
// build above — a generic one-page build anyone can do with their own work.
export const GENERIC_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Pick one piece of real work you're doing right now — a project, a plan, an update you owe someone — and turn it into a single page you can open in a browser and share, built from whatever notes or material you already have on it.",
  ],
  promptBuilder: {
    fields: [
      {
        id: "build",
        question: "What do you want to build?",
        placeholder: "e.g. a one-page summary of a project I'm working on",
      },
      {
        id: "context",
        question: "Where can I find the context for this?",
        placeholder: "e.g. a Google Doc, email thread, or Slack channel",
        hintLabel: "Using a local file?",
        hint: "Right-click it and choose Copy as Pathname (hold Option on Mac) or Copy as path (Windows), then paste it here.",
      },
      {
        id: "designGuidelines",
        question: "Where can I find your brand colors, fonts, or design guidelines?",
        placeholder: "e.g. our brand guide in Notion",
        optional: true,
      },
    ],
    buildPrompt: (answers, knownRole) => {
      const build = answers.build?.trim() || "[what you want to build]";
      const role = knownRole || "[your role]";
      const context = answers.context?.trim() || "[where the context lives]";
      const designGuidelines = answers.designGuidelines?.trim();
      // "I work in {role}" rather than "I'm a {role}" — role is a category
      // name (Marketing, Operations, Engineering...), not a job-title noun,
      // so "I'm a Operations" (and the a/an mismatch on "Executive") reads
      // wrong where "I work in Operations" holds up for all of them.
      const designSentence = designGuidelines
        ? ` For colors and fonts, use what's in ${designGuidelines}; otherwise use a clean default design.`
        : " Use a clean default design.";
      return [
        `I want to build ${build}. Even if that's normally a different format, like a slide deck or a PDF, build it as a single, styled web page I can open in a browser and share, for my work. I work in ${role}. The context for this is in ${context}.${designSentence} Walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.`,
        "",
        "Stage 1: Scope",
        "Ask me these questions one at a time. If an answer is vague, ask a follow-up before you move on.",
        "1. What should this page include, and in what order?",
        "2. Who is this page for, and what should they do after reading it?",
        "3. What should the page never do or assume?",
        "4. What would make the output good? Help me turn my answer into three checks I can answer yes or no.",
        "Then write a short spec with my answers and the three checks. Ask me to confirm it or change it.",
        "",
        "Stage 2: Build",
        "Once I confirm the spec, build the page using only what I give you. Tell me exactly what to paste or attach, one thing at a time, and wait for it. If you're unsure about something, ask me instead of guessing.",
        "- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.",
        "",
        "Stage 3: Evaluate",
        "Grade the page you just made against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a page for my next piece of work.",
      ].join("\n");
    },
  },
  steps: [
    {
      title: "Scope",
      body: "Your AI starts by asking what the page is about, what you'll give it, who it's for, and what makes it good. Then it writes a short spec with three yes/no checks, and you confirm it before it builds anything.",
      tips: [
        "**Tip:** Pick something you can check against reality — a project you know well beats an abstract example.",
        "**Tip:** Write one check about accuracy, such as \"nothing on the page is invented.\"",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI asks for your material and builds the page from it. You end up with one HTML file you can open in a browser and share.",
      tips: [
        "**Tip:** Give it your messiest real notes — it's better at organizing than you'd expect.",
        "**Tip:** Open the page in a full browser tab before you share it.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI grades the page it just built against the three checks and quotes the line that shows each one passing or failing. It fixes the biggest miss and rebuilds the page.",
      tips: [
        "**Tip:** Read it as the person it's for would.",
        "**Tip:** Keep the instructions block it gives you for next time.",
      ],
    },
  ],
});

// ─── Lesson 2 / build-4's role picker: "Scope your first custom workflow" ───
// Unlike the Lesson 1 builds, these don't produce a working artifact today —
// they produce a written brief (a markdown document) scoping an automation
// the learner will actually build in a later session. Same three-stage
// pattern (Scope, Build, Evaluate), but "Build" means drafting the brief.

export const SALES_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Most reps have one piece of follow-up that happens the same way after almost every call: a recap email, an updated CRM note, a check-in three days later. It's repetitive and rule-based, which makes it a good first automation — but you won't build it today. You'll leave with a complete brief: a clear trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the task itself. Then your AI turns your answers into a workflow brief, and you check it against a real instance of the task before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring post-call task",
      "The brief only works if it's scoping something real",
      "Think of what you do after almost every call — a recap, a CRM update, a follow-up.",
    ],
    [
      "One real recent example of it",
      "You'll check the brief against something you actually did",
      "Have the email, note, or CRM entry from your last call on hand.",
    ],
  ],
  niceToHave:
    "If your team has a CRM field list or a recap template, paste it in — it tells your AI what a complete output already looks like. Without it, your AI will ask you to describe the fields from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring task I do after most sales calls, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I sell. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what happens right after, and what do I produce?\n2. What triggers it: right after the call, at the end of the day, or on a schedule?\n3. What information does it need, and where does that information live — my notes, the CRM, the call recording?\n4. What should the output look like: a CRM entry, a drafted email, a Slack message? What fields or sections does it need?\n5. What should it never do or assume? For example, never send anything without my review, never invent a next step I didn't actually commit to.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for one real recent example of the task — the call notes or whatever I'd normally start from. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task actually is, what triggers it, what it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Describe the task the way you'd explain it to a new hire shadowing you, not in CRM jargon — your AI will ask follow-ups until it's concrete either way.",
        "**Tip:** Write one check about review, like \"nothing sends without me looking at it first.\" It's the constraint that matters most once this becomes a real automation.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If a step reads vague to you, it'll read vague to whoever builds it later. Push for specifics now.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real example you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use your messiest recent example, not your cleanest one — it's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const MARKETING_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Marketing has no shortage of recurring reporting — weekly campaign performance, a content calendar update, a competitor-mentions roundup. These are good first automations because they're repetitive and rule-based, but you won't build one today. You'll leave with a complete brief: a trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the reporting task itself. Then your AI turns your answers into a workflow brief, and you check it against a real recent report before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring reporting or content task",
      "The brief only works if it's scoping something real",
      "Think of the report, digest, or calendar update you put together on a schedule.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something you actually sent",
      "Have your last version of it open or pasted somewhere.",
    ],
  ],
  niceToHave:
    "If you have a reporting template or a list of the metrics you always include, paste it in — it tells your AI what a complete output looks like without guessing. Without it, your AI will ask you to list the sections from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring marketing reporting or content task, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I'm responsible for. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what do I produce and who reads it?\n2. What triggers it: a day of the week, the end of a campaign, a monthly cutoff?\n3. What data or material does it need, and where does it live — a dashboard, a spreadsheet, email performance tools?\n4. What should the output look like: a doc, a Slack digest, a slide? What sections or metrics does it always include?\n5. What should it never do or assume? For example, never report a number it can't trace to a source, never draw a conclusion I haven't reviewed.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent version of this report or update. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task is, what triggers it, what data it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Name the actual reader, like \"my manager skims this in Slack,\" not a generic audience — it decides what goes first in the output.",
        "**Tip:** Write one check about sourcing, like \"every number traces back to the dashboard.\" Reporting that drifts from the real numbers loses trust fast.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If the task pulls from more than one source, call out the order it should check them in — that's usually where a vague brief falls apart later.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real report you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use the messiest recent version of the report, not the cleanest — it's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const PEOPLE_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "HR runs on recurring, rule-based tasks — a new-hire checklist, a benefits enrollment reminder, a policy question that comes up the same way every time. These are good first automations, but you won't build one today. You'll leave with a complete brief: a trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the task itself. Then your AI turns your answers into a workflow brief, and you check it against a real recent instance before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring people-ops task",
      "The brief only works if it's scoping something real",
      "Think of a task tied to a date or event — onboarding, a review cycle, a policy reminder.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something that actually happened",
      "Have the checklist, email, or note from the last time you did it.",
    ],
  ],
  niceToHave:
    "If you have a written policy or checklist this task follows, paste it in — it tells your AI the rules to work from instead of guessing. Without it, your AI will ask you to describe the rules from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring people-ops task, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I'm responsible for. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what happens and who's it for?\n2. What triggers it: a start date, a review cycle, a date on the calendar?\n3. What information does it need, and where does it live — an HRIS, a shared doc, an email thread?\n4. What should the output look like: a checklist, an email, a calendar invite? What does it always need to include?\n5. What should it never do or assume? For example, never include confidential details beyond what's needed, never send without my review.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent instance of this task. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task is, what triggers it, what information it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Name the trigger as a specific date or event, like \"start date minus five business days,\" not \"before they start\" — specifics are what make a brief buildable later.",
        "**Tip:** Write one check about privacy, like \"only includes information the recipient is cleared to see.\" HR tasks carry more sensitive information than most.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If the task differs by role, level, or location, call that out as its own step instead of folding it into a general one.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real instance you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use a real recent case, not a hypothetical one — edge cases in HR work are usually where the brief needs the most fixing.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const FINANCE_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Finance has plenty of recurring, rule-based work — a monthly close checklist, a budget-variance report, a reconciliation between two systems. These are good first automations, but you won't build one today. You'll leave with a complete brief: a trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the task itself. Then your AI turns your answers into a workflow brief, and you check it against a real recent instance before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring reporting or reconciliation task",
      "The brief only works if it's scoping something real",
      "Think of a task tied to a schedule — month-end, a weekly spend report, a reconciliation.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something you actually produced",
      "Have your last version of the report or reconciliation on hand.",
    ],
  ],
  niceToHave:
    "If you have a close checklist or a list of the accounts and categories this task touches, paste it in — it tells your AI the structure to work from instead of guessing. Without it, your AI will ask you to describe the structure from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring finance task, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I'm responsible for. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what are you checking or reporting on, and who reads the result?\n2. What triggers it: month-end, a weekly cutoff, a specific day?\n3. What numbers or documents does it need, and where do they live — which system, which spreadsheet?\n4. What should the output look like: a reconciled total, a flagged-discrepancies list, a summary doc? What does it always need to include?\n5. What should it never do or assume? For example, never flag a discrepancy as resolved without a documented reason, never round a number for presentation.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent version of this task — the numbers or report you'd normally start from. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task is, what triggers it, what numbers or systems it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Name the exact systems involved, like \"the general ledger export versus the bank statement,\" not \"our records\" — the brief needs to say exactly where each number comes from.",
        "**Tip:** Write one check about precision, like \"every flagged discrepancy includes the exact amount and both source numbers.\" Vague flags create more work than they save.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If the task involves comparing two sources, make that comparison its own numbered step, not a side note inside a bigger one.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real example you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use a period that had at least one real discrepancy in it, not a clean one — that's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const PRODUCT_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Product work has its share of recurring tasks — a weekly changelog, a roadmap status update, a feature-request triage pass. These are good first automations, but you won't build one today. You'll leave with a complete brief: a trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the task itself. Then your AI turns your answers into a workflow brief, and you check it against a real recent instance before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring product-update or triage task",
      "The brief only works if it's scoping something real",
      "Think of a status update, changelog, or triage pass you do on a schedule.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something you actually sent",
      "Have your last version of it open or pasted somewhere.",
    ],
  ],
  niceToHave:
    "If you have a changelog template or a list of the sections your updates always include, paste it in — it tells your AI the structure to work from instead of guessing. Without it, your AI will ask you to list the sections from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring product task, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I'm responsible for. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what do you produce and who reads it?\n2. What triggers it: a day of the week, a sprint boundary, a release?\n3. What does it need, and where does it live — a ticket tracker, a roadmap doc, release notes?\n4. What should the output look like: a changelog, a status doc, a triage summary? What does it always need to include?\n5. What should it never do or assume? For example, never mark a ticket resolved without a linked change, never promise a date that isn't confirmed.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent version of this update or triage pass. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task is, what triggers it, what it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Name the actual tracker and its fields, like \"the Linear ticket's status and linked PR,\" not \"our ticket system\" — the brief needs to know exactly where to look.",
        "**Tip:** Write one check about dates, like \"no date appears unless it's confirmed in the ticket.\" A wrong date in a changelog is worse than a missing one.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If tickets need grouping (by theme, by team, by severity), make the grouping rule its own step, not an afterthought.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real example you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use a week with a messy mix of tickets, not a clean sprint — it's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const OPERATIONS_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Ops runs on processes you do the same way every time — a vendor-invoice check, a weekly status rollup, an onboarding or offboarding checklist. These are good first automations, but you won't build one today. You'll leave with a complete brief: a trigger, the steps your AI would take, and what the output looks like, so your next build session takes 20 minutes instead of two hours.",
    "First you'll answer a few questions about the process itself. Then your AI turns your answers into a workflow brief, and you check it against a real recent instance before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A process you run again and again",
      "The brief only works if it's scoping something real",
      "Think of a checklist, rollup, or check you do the same way each time.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something that actually happened",
      "Have the notes, spreadsheet, or checklist from the last time you ran it.",
    ],
  ],
  niceToHave:
    "If you have a written SOP for this process, paste it in — it tells your AI the exact steps to work from instead of guessing. Without it, your AI will ask you to describe each step from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the process first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a process I run again and again, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I'm responsible for. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the process, in plain language — what are you checking or producing, step by step?\n2. What triggers it: a schedule, an event, a request coming in?\n3. What information does it need, and where does it live — a spreadsheet, an inbox, a ticketing tool?\n4. What should the output look like: a checklist marked complete, a flagged-items list, a summary? What does it always need to include?\n5. What should it never do or assume? For example, never mark a step done without evidence, never skip an exception case without flagging it to me.\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent instance of this process. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the process is, what triggers it, what information it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Walk through the process the way you'd train someone covering for you, step by step, not as a summary — that's the level of detail the brief needs.",
        "**Tip:** Write one check about exceptions, like \"anything that doesn't fit the normal pattern gets flagged to me, not skipped.\" Exceptions are where processes usually break.",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If you have an informal SOP in your head but nothing written down, this is the moment to get it onto the page — the brief forces the detail out.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real instance you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use an instance that had at least one exception in it, not a perfectly clean run — that's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

export const GENERIC_WORKFLOW_TUTORIAL: Block[] = buildTutorial({
  about: [
    "You've built a few things today — now scope one for your own work. You won't build it today, but you'll leave with a complete brief that makes your next build session take 20 minutes instead of two hours.",
    "First you'll answer a few questions about the task itself. Then your AI turns your answers into a workflow brief, and you check it against a real instance of the task before saving it.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "A recurring task you do that involves reading, writing, or organizing information",
      "The brief only works if it's scoping something real",
      "Good candidates: weekly status reports, meeting prep, client follow-ups, competitive research.",
    ],
    [
      "A real recent example of it",
      "You'll check the brief against something you actually did",
      "Have the notes, email, or document from the last time you did it.",
    ],
  ],
  niceToHave:
    "If there's a template or past example you always start from, paste it in — it tells your AI what a complete output already looks like. Without it, your AI will ask you to describe it from scratch.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about the task first, then drafts the brief, then tests the brief against something real.",
  prompt:
    "I have a recurring workflow, and I want to scope it as an automation brief — not build it yet, just write a clear spec I can hand to an AI builder later. First, ask me what my role is and what I work on. Then walk me through three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What's the recurring task, in plain language — what do I produce and who's it for?\n2. What triggers it, and how often does it happen?\n3. What information does it need, and where does it live?\n4. What should the output look like — a doc, an email draft, a Slack message? What does it always need to include?\n5. What should it never do or assume?\n6. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, write the workflow brief as a markdown document with these sections: Trigger, Inputs, Steps (numbered, specific enough that an AI builder could follow them without asking me anything), Output format, and Guardrails (what it should never do). Use my own words from Stage 1 wherever you can instead of generic phrasing.\n\nStage 3: Evaluate\nAsk me for a real recent example of this task. Walk through your own brief against that example, step by step, and tell me anywhere a step is too vague to follow or a case the brief doesn't cover. Fix those gaps. When the brief holds up against the real example, tell me to save it as `workflow-[name].md`.",
  steps: [
    {
      title: "Scope",
      body: "Your AI asks what the recurring task is, what triggers it, what it needs, what the output should look like, and what it should never do. Then it writes a short spec with three yes/no checks for you to confirm.",
      tips: [
        "**Tip:** Pick a task that's repetitive, rule-based, and low-stakes on a bad day — a draft you can edit beats a decision only you can make.",
        "**Tip:** Write one check about scope creep, like \"the brief covers one task, not a whole job.\"",
      ],
    },
    {
      title: "Build",
      body: "With the spec confirmed, your AI writes the brief itself — trigger, inputs, numbered steps, output format, and guardrails — as one markdown document.",
      tips: [
        "**Tip:** If a step reads vague to you, it'll read vague to whoever builds it later. Push for specifics now.",
        "**Tip:** Keep the guardrails section short and concrete — one sentence per rule beats a paragraph of caveats.",
      ],
    },
    {
      title: "Evaluate",
      body: "Last, your AI checks its own brief against a real example you give it, and fixes any step that doesn't hold up. You end with a brief that's already been tested once, not just written.",
      tips: [
        "**Tip:** Use your messiest recent example, not your cleanest one — it's the better stress test.",
        "**Tip:** Save the finished brief somewhere you'll actually find it before your next build session.",
      ],
    },
  ],
});

// ─── Real-library tutorials for Lesson 2's "Scope your first custom workflow"
// alternates — adapted from the actual Leland+ content entries (see each
// TUTORIAL's `source`), not invented for this prototype.

export const SALES_LEAD_GEN_BOT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4958f570ce61bff880",
  about: [
    "Most B2B buyers complete their own research long before they ever talk to a salesperson, so outreach that shows up before a real signal of interest mostly gets ignored. This system watches a specific niche you pick — a subreddit, a hiring page, a public complaint thread — for posts that match your buying-signal criteria, then drafts a short outreach message that references the exact signal it found. Sending is still your call.",
    "Watching for one specific, timely signal turns outreach from a numbers game into a small number of messages worth sending. Every version stays read-only until you approve outreach.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where signals for your niche live — a subreddit, LinkedIn, a job board — before you build the monitor."],
    ["How much outreach volume you can realistically personalize and follow up on per week."],
    ["Whether outreach sends after each draft is reviewed or only after a batch review at the end of the day."],
  ],
  buildIntro: "Gather access to wherever your signals live (Reddit, LinkedIn, a job board), your outreach or email tool, and your CRM to track who's been contacted. The paste-in version needs none.",
  prompt: "Goal: Scan [specific source, e.g. a subreddit, a job board, a public complaint feed] for new posts matching my buying-signal criteria, and draft a short personalized outreach for each match.\n\nContext: A real signal looks like [describe specifically, e.g. \"someone asking for a recommendation for a tool that does X\" or \"a company posting a job for a role my product replaces\"]. My typical outreach is short, references something specific about the person, and asks one direct question.\n\nRules:\n- Only flag a post as a signal if it matches the specific criteria, and state why each match qualifies.\n- Draft outreach that quotes or references the actual signal rather than a templated opener with a name swapped in.\n- Keep each draft under 100 words.\n- Flag anything ambiguous for human judgment instead of guessing whether it counts as a signal.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your signal source, what counts as a real signal, your outreach voice, and how much volume you can follow up on.",
      tips: ["**Tip:** The interview forces you to define a real signal before you build anything, so the scope document becomes the brief for every build session after."],
    },
    {
      title: "Build",
      body: "Build the system against your scope document and test it on a fresh scan of your niche. Review the output for criteria met, the actual signal referenced, under 100 words, and ambiguous posts flagged instead of guessed.",
      tips: ["**Tip:** Naming the specific signal criteria up front keeps the AI tool from treating any keyword mention as a lead."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every scan, and package what works into a reusable skill once it passes a few weeks straight.",
      tips: ["**Tip:** A keyword match on its own isn't a buying signal — give the criteria enough specificity to tell a real evaluator from a passing mention."],
    },
  ],
});

export const SALES_PRICING_LAB_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae483816d8b8bdbae81d",
  about: [
    "Pricing moves profit more than almost any lever a company has, and most founders spend far less time on it than that lever justifies. This system turns what customers have said about value and budget into three price tiers with feature lines, built from real customer language rather than competitor mimicry, so the tiers hold up when a buyer has to defend the purchase to themselves.",
    "Run it as a paste-in prompt when pricing needs a fresh look, or a saved skill you rerun as new interview evidence comes in.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether pricing gets validated through real transactions or through direct conversation with customers."],
    ["How many interviews are enough to lock a price versus still testing."],
    ["Whether this runs once at launch or gets rerun on a schedule as the customer base grows."],
  ],
  buildIntro: "Gather any access it calls for — your payments or billing platform, your CRM or interview notes home, and your landing page or checkout tool. The paste-in version needs none.",
  prompt: "Goal: Turn my customer interview notes and competitor pricing into a three-tier pricing table with a recommended launch price for each tier.\n\nContext: My product is [one-line description]. My buyer is [who pays, not just who uses it]. My interview notes are in [location]. Known competitor prices are [list or \"none found yet\"].\n\nRules: Base each tier's feature split on what customers said they valued most, not on what's easiest to build. Name the tiers in plain language a buyer would use, not \"Basic/Pro/Enterprise\" by default. For each tier, state the one sentence that justifies why a customer would upgrade past it. Flag any tier where you don't have enough interview evidence to justify the price, rather than guessing a number.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming what you're selling, who the buyer is, what customers have said about budget, and how often you expect to revisit price.",
      tips: ["**Tip:** Naming the buyer, evidence, and competitor context up front turns the scope document into the brief every pricing pass builds from."],
    },
    {
      title: "Build",
      body: "Build against real interview notes and any competitor prices you have. Review for tiers grounded in customer language, plain tier names, an upgrade sentence for each, and low-evidence tiers flagged.",
      tips: ["**Tip:** Tying every tier boundary to actual customer language keeps the price defensible."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every pricing pass, and package the prompt and your corrected rules into a skill once it holds for a full quarter.",
      tips: ["**Tip:** A price with no evidence behind it is a guess with better formatting — tie every tier boundary back to something a real customer said."],
    },
  ],
});

export const SALES_PRECALL_BRIEFING_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3cdbb6bf0b8f44fbae",
  about: [
    "Reps walk into calls running on memory, or on whatever they scrolled to find in the ten minutes before. This system pulls CRM history, past notes, and public signals (funding, leadership moves, product news) into a one-page brief before every external meeting, naming what changed since the last touch and a few real conversation openers.",
    "Run it as a paste-in prompt before a single call, a saved skill triggered by your calendar, or a scheduled agent that builds the brief automatically ahead of every external meeting. Every version stays read-only against your CRM.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where account history lives, and whether it exports cleanly."],
    ["How far ahead public information typically exists for your accounts."],
    ["Whether the brief goes to the rep alone or a manager too."],
  ],
  buildIntro: "Gather access to your CRM (Salesforce and HubSpot publish official connectors and API docs), your calendar, and enrichment data for public signals. The paste-in version needs none.",
  prompt: "Goal: Produce a one-page brief for my meeting with [account/contact] before [trigger time, e.g. two hours ahead].\n\nContext: [Paste CRM history: past notes, deal stage, last activity date. Note where account history lives. List what public information matters most for your business, e.g. funding, leadership moves, product launches.]\n\nRules:\n- Pull only from named sources. No unsourced claims.\n- Every \"what changed since we last spoke\" claim needs a dated source.\n- Flag any CRM history older than [30] days as stale rather than treating it as current.\n- Cap the brief at one page.\n- End with exactly three conversation openers tied to this specific account, not generic ones.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming which meetings get a brief, where account history lives, and what counts as a useful opener versus a generic one.",
      tips: ["**Tip:** Naming which meetings need a brief up front keeps you from building a system that fires on every calendar event, internal syncs included."],
    },
    {
      title: "Build",
      body: "Build against a real meeting on your calendar. Review for one page, three specific openers, every claim sourced, and stale history flagged.",
      tips: ["**Tip:** Forcing a source and a date on every claim keeps the brief honest about what changed versus old data restated as news."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every brief, and package the prompt and your corrected rules into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** A brief built on stale CRM data reads as current when it isn't — keep the staleness flag in every run."],
    },
  ],
});

export const SALES_COLD_OUTREACH_ENGINE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3bd8306bee4e72681e",
  about: [
    "Most cold email reads like a mail-merge with a name dropped in, and prospects treat it that way. This system takes one target account and one real signal — a funding round, a job posting, a product launch — and drafts an opening line built around it. Copy quality only matters if the email lands, so domain authentication matters as much as the words.",
    "Run it as a paste-in prompt before each send, a saved skill in your sequencing workflow, or a scheduled agent that drafts against a signal feed. Every version still leaves the send to a person.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your prospecting signals will come from."],
    ["Your current sending volume and domain authentication status."],
    ["How much personalization is worth spending per prospect."],
  ],
  buildIntro: "Gather access to enrichment data, your sequencing tool, and your CRM. The paste-in version needs none.",
  prompt: "Goal: Draft a short cold email to [contact] at [company] using [signal] as the hook.\n\nContext: My offer is [one sentence]; length is [X words]; the signal is [describe it and its source].\n\nRules:\n- No draft without a real, dated signal.\n- Never invent a company fact.\n- One clear ask.\n- Under [X] words.\n- Flag signals older than [30/60] days.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where you'll get signals, your offer and audience, and what personalized sounds like from you.",
      tips: ["**Tip:** The interview forces you to define what counts as a real signal before you draft a single email."],
    },
    {
      title: "Build",
      body: "Build and test on a real, dated signal you have in hand. Review for the real signal named, no invented facts, one ask, and under your word limit.",
      tips: ["**Tip:** Requiring a dated signal before any draft keeps the system from falling back on a generic template the moment a good signal isn't handy."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every send, and package the prompt and your corrected rules into a skill once it passes a couple weeks straight.",
      tips: ["**Tip:** Unreviewed AI outreach at scale is the most common way this backfires and can damage a domain's reputation."],
    },
  ],
});

export const SALES_DEAL_FOLLOWUP_AGENT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae39368c9c2f3c8d6b81",
  about: [
    "Deals rarely die all at once — engagement drop-off, vague next steps, and single-threaded deals are the core signals that predict a stall before it becomes a loss. This system watches for those signals and sends you a daily message naming the deals to touch, with the reason for each. Acting on it is still your call.",
    "Run it as a weekly paste-in prompt, a saved skill, or a scheduled agent that posts to Slack. Every version stays read-only against your CRM.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which CRM or spreadsheet holds your pipeline, and how to get a clean export out of it."],
    ["What \"stalled\" means for your cycle length."],
    ["Whether your activity logging is clean enough for \"days since last touch\" to mean anything."],
  ],
  buildIntro: "Gather access to your CRM and Slack or email for the message. The paste-in version needs none.",
  prompt: "Goal: Review my pipeline and tell me which deals need a follow-up today, and why.\n\nContext: [Paste your pipeline export: deal name, stage, deal amount, last activity date, expected close date, and number of distinct contacts engaged, if you have it. Also note your normal deal cycle length and the stage names your pipeline uses.]\n\nRules:\n- Flag a deal if any of these are true: no logged activity in more than 14 days, expected close date has already passed, the deal has been in its current stage more than 1.5x the normal time for that stage, or only one contact has ever been engaged.\n- For each flagged deal, state the specific reason(s), not just \"at risk.\"\n- Rank flagged deals by dollar amount, highest first.\n- Do not flag a deal I've noted as intentionally paused.\n- Output as a short daily message: deal name, amount, reason, and one suggested next step per deal.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your data source, your stall rules, the message contents, and the delivery channel.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every build session after it."],
    },
    {
      title: "Build",
      body: "Build and test on a real export, every open deal included. Review for specific reasons, ranked by amount, and paused deals skipped.",
      tips: ["**Tip:** Explicit numeric stall criteria keep the output consistent from day to day instead of a gut-check the AI is guessing at."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package the prompt and your corrected rules into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** It can't tell a deal paused on purpose from a neglected one unless you tell it — give it that context every run."],
    },
  ],
});

export const MARKETING_BRAND_VOICE_GUIDE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3a8bd361a4751ff11f",
  about: [
    "Voice consistency usually lives in one person's head, and it breaks the moment someone else drafts. This system reads content you've already written — blog posts, decks, email campaigns, website copy — and produces a structured guide covering tone, vocabulary to use and avoid, sentence rhythm, and annotated example passages.",
    "Run it as a paste-in prompt the first time, a saved skill you rerun each quarter, or a scheduled agent that watches your content archive for drift.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["How many samples is enough — too few overfits one piece, too many muddies the signal."],
    ["What makes your voice distinct from a generic competitor's."],
    ["Where the canonical guide will live so every other build checks one file."],
  ],
  buildIntro: "Gather your content archive and whatever tool holds the finished guide. The paste-in version needs none.",
  prompt: "Goal: Produce a brand voice guide from the writing samples I provide.\n\nContext: [Paste or link 5 to 10 pieces you consider strong examples of your voice.] We are trying to sound like [2-3 reference points, e.g., a knowledgeable colleague, not a press release].\n\nRules:\n- Base every observation on patterns actually present in the samples. Do not invent stylistic rules I haven't shown you.\n- Call out any samples that seem to contradict each other.\n- Output as a one-page guide with sections for tone, sentence length and rhythm, vocabulary to use, vocabulary to avoid, and three annotated example passages showing the pattern in action.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your source samples, your voice reference points, the words to avoid, and where the finished guide will live.",
      tips: ["**Tip:** The interview forces you to name what \"our voice\" means instead of assuming everyone already agrees."],
    },
    {
      title: "Build",
      body: "Test it on 5 to 10 pieces you'd hold up as your strongest writing. Review against your scope: every claim traceable to a sample, contradictions called out, all four sections present.",
      tips: ["**Tip:** Restricting it to patterns present in the samples keeps the guide descriptive instead of aspirational."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package the prompt and rules into a skill once the guide holds up for a full quarter without a rewrite.",
      tips: ["**Tip:** A guide built from a narrow set of samples misrepresents the brand once applied broadly — pull samples from more than one campaign or era of writing."],
    },
  ],
});

export const MARKETING_BRAND_VOICE_CHECKER_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3a0daa0c064d447280",
  about: [
    "A meaningful share of consumers say they'd think less of a brand whose advertising ran next to poor-quality, spam-like AI-generated content. This system runs before a draft goes anywhere near a reader — it scores the draft against your brand voice guide and flags the specific lines that read generic, off-tone, or unsupported.",
    "Run it as a paste-in prompt before publish, a saved AI skill your team reuses, or a gate wired into your publishing tool.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your brand voice guide lives, and whether it's current enough to check against."],
    ["What counts as a hard violation — banned words or off-brand claims — versus a softer stylistic drift worth flagging but not blocking."],
    ["Whether this runs as a manual paste-and-check step or a gate wired into your publishing tool."],
  ],
  buildIntro: "Gather the brand voice guide file, a connector to your publishing or scheduling tool if you want the check wired in as a gate, and your review channel. The paste-in version needs nothing beyond the guide and the draft.",
  prompt: "Goal: Score this draft against our brand voice guide and flag specific problems.\n\nContext: Here is our brand voice guide: [paste or link the guide]. Here is the draft to check: [paste it].\n\nRules:\n- Quote the exact phrase you're flagging, don't just describe the problem generally.\n- Distinguish between a hard violation (banned words, off-brand claims) and a softer stylistic drift.\n- Do not rewrite the draft yourself, this is a check, not an edit.\n- Output format: a pass/needs-revision verdict, then a list of flagged lines with the exact quote, the rule it breaks, and a one-line reason.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where your voice guide lives, what counts as a hard violation versus a softer drift, and who sees the results before something goes out.",
      tips: ["**Tip:** Naming the difference between a hard violation and a soft drift before you've built anything keeps the check from flagging everything or nothing."],
    },
    {
      title: "Build",
      body: "Test on a real draft, with the guide attached. Review for exact quotes, hard violations kept separate from soft drift, and no rewrite attempted.",
      tips: ["**Tip:** Requiring the exact quoted phrase for every flag keeps the check specific enough to act on instead of a vague sense that something's off."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package the prompt and rules into a skill once it passes a couple weeks straight.",
      tips: ["**Tip:** Vague rules like \"sound more human\" produce vague flags nobody can act on — keep every rule specific enough to quote an exact violation."],
    },
  ],
});

export const PEOPLE_1ON1_PREP_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae46ec5756f65592aa7e",
  about: [
    "Most 1:1 prep is just remembering what happened last time. This system does that assembly work for one recurring meeting — it pulls prior notes, stated goals, and open commitments for the person you're about to sit down with, then hands you a short brief on what changed and what to ask about.",
    "The system assembles context, it never invents it. No history about a person should appear in the brief unless it came from an actual prior note, and if there isn't enough written down, the brief says so instead of guessing.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your 1:1 notes live today — a shared doc, Notion, or your own scratch notes."],
    ["How far back the system should pull from."],
    ["Whether this tool touches anything beyond your own notes or stays scoped to 1:1 history alone."],
  ],
  buildIntro: "Gather any access it calls for. Common connectors are your notes tool and your calendar to trigger prep on schedule. The paste-in version needs none.",
  prompt: "Goal: Build a short pre-1:1 brief for [person's name] using only what's in their notes history.\n\nContext: Their notes live in [Notion / Google Docs / a spreadsheet]. Their current goals are [list, or \"pull from most recent notes\"]. Last 1:1 was [date].\n\nRules:\n- Only use information that appears in the actual notes provided.\n- Never infer or assume anything about performance, sentiment, or history that isn't written down.\n- Structure the brief as: Open commitments from last time, What's changed since, Suggested topics to raise.\n- Keep it under 150 words.\n- If there's not enough prior context, say so instead of filling gaps.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where your 1:1 notes live, what the brief should include and exclude, and how far back it should look.",
      tips: ["**Tip:** The interview forces you to name what counts as real context before you ever see a brief."],
    },
    {
      title: "Build",
      body: "Test it on the actual notes for the person you're about to meet. Review for only sourced facts, right structure, and under the word limit.",
      tips: ["**Tip:** Restricting it to only what's in the notes keeps the brief from turning into a guess dressed up as memory."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** It has to say when there isn't enough history, since a brief that fills gaps with a plausible guess is worse than no brief at all."],
    },
  ],
});

export const PEOPLE_ONBOARDING_ASSISTANT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae44453159773c5ae7dd",
  about: [
    "Only a small share of employees strongly agree their company does a great job onboarding new hires, and turnover in the first 18 months can run high. This system runs a first-week checklist itself, one day at a time, for every new hire — it sends that day's tasks only, confirms a task done when the new hire says so, and answers setup questions from your IT and HR documentation.",
    "At week's end it sends the manager or HR contact a completion summary naming anything still open. None of it replaces the person who should still be checking in.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where the first-week checklist currently lives and who last updated it."],
    ["Whether new hires get this through Slack, email, or a portal."],
    ["Whether IT and access provisioning is already automated or still a manual request."],
  ],
  buildIntro: "Gather your HRIS, your messaging platform for delivery, and your IT provisioning system if requests route through one. The paste-in version needs none.",
  prompt: "Goal: Walk [new hire name] through their day-by-day first-week checklist for the [role/department] track and report completion status to [manager/HR contact].\n\nContext: Checklist source: [doc/link]. Start date: [date]. Tools/access the new hire needs set up: [list].\n\nRules:\n- Send one day's tasks at a time, not the whole week at once.\n- Confirm each task as complete only when the new hire says so, never assume.\n- Answer setup questions using the provided IT/HR documentation only, and escalate anything outside it to [contact].\n- Send a completion summary to [manager/HR contact] at the end of week one flagging anything still open.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your checklist source, who owns each item, the delivery channel, and what should always escalate to a person.",
      tips: ["**Tip:** The interview forces you to name who owns each checklist item today, which is usually the part nobody has written down."],
    },
    {
      title: "Build",
      body: "Build and test the system on a real new hire's first week. Review for one day at a time, escalations routed correctly, and a summary sent at week's end.",
      tips: ["**Tip:** One day's tasks at a time keeps week one from landing as a wall of homework."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every new hire, and package it into a skill once it passes a few new hires straight.",
      tips: ["**Tip:** Tracking task completion isn't the same as a good onboarding experience — build in at least one moment where a real person checks in."],
    },
  ],
});

export const PEOPLE_INTERVIEW_SCHEDULING_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae44dffbbd4e8a632590",
  about: [
    "Coordinating a multi-person interview panel across calendars is one of the most time-consuming, least differentiated tasks in a recruiter's week. This system reads interviewer availability, candidate constraints, and panel requirements, then proposes and locks a set of times across everyone involved. The output is a confirmed schedule with calendar invites attached.",
    "Run it as a per-candidate paste-in prompt, a saved skill, or a scheduled agent that watches interviewer calendars and confirms rounds without a recruiter kicking each one off by hand. Every version should escalate to a person instead of guessing when no time works.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where interviewer and candidate availability lives today — a shared calendar, a scheduling tool, or manual email threads."],
    ["Whether candidates schedule themselves through a link or a recruiter proposes times."],
    ["What counts as an acceptable notice window for a reschedule."],
  ],
  buildIntro: "Gather access to your calendar, a scheduling tool if you use one, and your ATS for logging round completion. The paste-in version needs none.",
  prompt: "Goal: Find and confirm interview times for [candidate name] with [list of interviewers] for a [duration]-minute [round name] within the next [timeframe].\n\nContext: [Interviewer calendars are in: tool. Candidate availability: paste or link. Panel composition rules, e.g. must include a peer and a manager.]\n\nRules:\n- Never double-book an interviewer or schedule outside their working hours.\n- Propose no more than three time options to the candidate at once.\n- Confirm a hold as tentative until every panelist accepts.\n- Send a calendar invite with the job title, round name, and a prep note only after every panelist confirms.\n- Escalate to a human instead of guessing if no overlapping time exists within the timeframe.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where availability lives, your panel rules, and how confirmations get sent.",
      tips: ["**Tip:** It surfaces the panel and reschedule rules before you build, so the scope document becomes the brief every run follows."],
    },
    {
      title: "Build",
      body: "Build and test on the next candidate who advances to a new round. Review for no double-booking and tentative holds confirmed before the invite goes out.",
      tips: ["**Tip:** Hard rules on working hours and confirmation order keep it from locking a time that quietly falls apart later."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every round, and package it into a skill once it passes a few rounds straight.",
      tips: ["**Tip:** An agent that schedules aggressively can burn goodwill fast if it ignores a real working hour or time zone — give it hard boundaries."],
    },
  ],
});

export const PEOPLE_INTERVIEW_SCORECARDS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae44695832290068a37d",
  about: [
    "Pairing a general mental ability assessment with a structured interview is among the strongest predictors of job performance ever studied, but the moment interviewers improvise past the standard questions, they reintroduce the inconsistency a scorecard exists to remove. This system takes a finished job description and turns it into a structured set of interview questions with a scoring rubric attached, one question per competency, so a panel rates the same things the same way.",
    "Run it as a paste-in prompt once per open role, a saved skill your team reuses across every requisition, or a scheduled agent that fires when a job description gets finalized.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether an approved scorecard template or question bank already exists to build from."],
    ["How scores get recorded and compared across a panel today."],
    ["Whether legal or compliance needs to approve new interview questions before use."],
  ],
  buildIntro: "Gather your ATS or scorecard tool, your job-description source, and your interviewer calendar. The paste-in version needs none.",
  prompt: "Goal: Generate a structured interview scorecard for [role name] from the job description below, ready to hand to a panel of [number] interviewers.\n\nContext: Job description: [paste or link]. Interview format: [one round / panel / sequential]. Existing scorecard template if any: [link].\n\nRules:\n- Generate 5 to 8 questions mapped directly to specific must-have qualifications.\n- Give each question a 1-5 scoring rubric that defines what a 1, 3, and 5 answer looks like.\n- Assign each question to a single competency so scores can be compared across candidates.\n- Never generate a question that asks about protected characteristics.\n- Output one scorecard per interviewer role if the panel splits topics.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your panel size, your competencies, your question format, and where scores get recorded.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every scorecard after it."],
    },
    {
      title: "Build",
      body: "Build and test on a real job description. Review for every question tied to one competency, specific score anchors, and no protected-characteristic questions.",
      tips: ["**Tip:** Anchoring each score to a specific 1, 3, and 5 answer keeps two interviewers from reading the same response as a 2 and a 4."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every hiring cycle, and package it into a skill once it passes a few roles straight.",
      tips: ["**Tip:** A rubric only reduces bias if interviewers use it instead of scoring on gut feel afterward."],
    },
  ],
});

export const PEOPLE_JOB_DESCRIPTION_GENERATOR_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae44b898aa5eccb908c7",
  about: [
    "Writing job descriptions is one of the most common AI use cases in recruiting. This system takes a rough role brief — a few bullets, a Slack message, a past posting — and turns it into a polished, structured draft with a bias check on the wording built in.",
    "A posting with gendered or exclusionary language narrows the applicant pool before anyone even applies. Run it as a paste-in prompt every time a requisition opens, a saved skill your team reuses across roles, or a scheduled agent that drafts a description the moment a role opens in your tracker.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where the rough brief usually originates — a hiring manager's doc, a Slack thread, or last year's posting."],
    ["Whether legal or comp and benefits needs to review before anything gets published."],
    ["Whether there's an existing brand template the draft has to match."],
  ],
  buildIntro: "Gather your ATS or job board, your doc or brand-template source, and your comp and benefits data if the posting includes a range. The paste-in version needs none.",
  prompt: "Goal: Turn the rough brief below into a polished job description for [role name] ready to post.\n\nContext: Brief: [paste notes/bullets]. Company voice/template: [link or pasted example]. Level and reporting line: [detail].\n\nRules:\n- Include sections for role summary, responsibilities, must-have and nice-to-have qualifications, and what makes this role different from similar postings elsewhere.\n- Flag any word or phrase with known gendered or exclusionary connotations and suggest a neutral replacement.\n- Never invent a salary range, benefit, or requirement not present in the brief.\n- Output the final posting plus a short \"flagged language\" list.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where a rough brief usually lands on your desk, the sections your descriptions always need, your company's tone, and the language you want flagged.",
      tips: ["**Tip:** The interview surfaces the sections and tone rules you already follow out of habit."],
    },
    {
      title: "Build",
      body: "Build and test on a real, unedited brief. Review for every section present, flagged language reasonable, and nothing invented that wasn't in the brief.",
      tips: ["**Tip:** The rule against inventing details keeps the draft honest to the brief, and the flagged-language list makes the bias check visible."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every posting, and package it into a skill once it passes a few postings straight.",
      tips: ["**Tip:** A generator trained on your past postings will happily repeat whatever bias was already baked into them — review the flagged list yourself."],
    },
  ],
});

export const PEOPLE_HR_BOT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4336554a317a0287a6",
  about: [
    "Employees ask the same PTO, benefits, and policy questions on repeat, and a small HR team answering them one at a time has less room left for the judgment-heavy work only a person can do. This system answers from your actual policy documents, quotes the specific policy line where it can, and escalates anything it can't confidently answer instead of guessing.",
    "Run it as a paste-in prompt for a single question, a saved skill an HR generalist reaches for daily, or a scheduled agent connected to Slack or Teams so employees can ask it directly.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where policy documentation currently lives, and how current it is."],
    ["What channel employees already use to ask HR questions."],
    ["Who owns keeping the source documents up to date."],
  ],
  buildIntro: "Gather your HR knowledge base, your messaging platform, and your HRIS for anything needing employee-specific data. The paste-in version needs none.",
  prompt: "Goal: Answer employee questions about PTO, benefits, and company policy using only the documents provided, and escalate anything outside that scope.\n\nContext: [Paste or link your policy source documents.] Escalation contact: [name/channel]. Topics that must always escalate: [e.g. terminations, leave-of-absence disputes, harassment complaints].\n\nRules:\n- Answer only from the provided policy documents, quoting the specific policy line when possible.\n- Never answer a question about compensation, discipline, or legal matters; escalate those immediately with a note on why.\n- State clearly when a question falls outside current documentation instead of guessing.\n- Log every escalation with the question and the employee's name for HR follow-up.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your source policy documents, the topics that always escalate, and where employees will ask.",
      tips: ["**Tip:** Naming your escalation topics up front means the bot has a rule to follow before a real employee question ever tests it."],
    },
    {
      title: "Build",
      body: "Build and test on your actual policy documents. Review for answers that quote the actual policy, comp and legal questions escalating, and nothing outside the docs getting a confident guess.",
      tips: ["**Tip:** Quoting the source line forces every answer back to a real document instead of a plausible-sounding guess."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** A bot that sounds confident but answers from stale policy docs is worse than no bot at all — keep source documents current."],
    },
  ],
});

export const PEOPLE_RESUME_SCREENS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4432d50d2a64f3992c",
  about: [
    "AI use in talent acquisition has grown sharply, and screening resumes is one of the most common use cases among teams that use it. This system scores every resume in a batch against your must-have and nice-to-have criteria, then runs a second pass with names, schools, and locations stripped out to check whether the scores move.",
    "The output is a ranked shortlist plus a bias delta a person has to read and explain before anyone acts on it. Run it as a paste-in prompt for each requisition, a saved skill, or a scheduled agent that watches a resume inbox. Every version stays read-only against your ATS.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where resumes land — an ATS export, a shared inbox, or a folder someone forwards you."],
    ["Whether your company already has a legal or compliance sign-off process this needs to route through."],
    ["Whether the role sits in a jurisdiction with its own audit or disclosure rule."],
  ],
  buildIntro: "Gather your ATS, your resume inbox, and your HR or legal team's review process. The paste-in version needs none.",
  prompt: "Goal: Score every resume in [folder/ATS export] against the job description for [role name], then re-run the same scoring with names, schools, and locations stripped out and flag any candidate whose rank shifts.\n\nContext: Job description is at [path/link]. Must-have criteria: [list]. Nice-to-have: [list]. Resumes are in [format: PDF/plain text].\n\nRules:\n- Score 1-5 on each must-have with one sentence of evidence per score.\n- Never infer age, gender, or ethnicity from a name or school.\n- Flag any resume you can't confidently score instead of guessing.\n- Output a ranked table plus a separate bias check table showing blinded vs unblinded rank for every candidate.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming the role you hire for most, your must-have vs nice-to-have criteria, where resumes land, and what would make you distrust a score.",
      tips: ["**Tip:** The interview forces you to write down criteria you've been applying by instinct."],
    },
    {
      title: "Build",
      body: "Build and test on the job description and a real batch of resumes. Review for evidence on every score, no inferred demographics, and blinded ranks next to unblinded ones.",
      tips: ["**Tip:** Scoring the same batch twice with identity details stripped turns bias into a number you can see, instead of a hunch."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** A screener that looks objective can still encode bias from the criteria you gave it — never let a score replace a human decision without a visible reason."],
    },
  ],
});

export const PEOPLE_INTERVIEW_DEBRIEF_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae43c5f7e67a49fb2dc8",
  about: [
    "Every interviewer takes notes differently — typed, dictated, or dropped into an ATS field — and a hiring committee still has to compare candidates across all of it. This system turns each interviewer's raw notes into a debrief mapped to the scorecard's competencies, so the committee reads one consistent format instead of five personal styles.",
    "Run it as a paste-in prompt after each interview, a saved skill, or a scheduled agent that watches your ATS and posts debriefs to the hiring committee's channel. Every version stays read-only against your ATS.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["How interviewers capture notes today — typed, dictated, or dropped into an ATS field."],
    ["Whether debriefs need to sync into an ATS field automatically or just land in a shared doc."],
    ["Whether the hiring committee reviews debriefs before or during a live discussion."],
  ],
  buildIntro: "Gather your ATS, your note source, and your hiring committee's shared space. The paste-in version needs none.",
  prompt: "Goal: Turn the raw interview notes below into a structured debrief for [candidate name], organized by the competencies on the scorecard for [role name].\n\nContext: Raw notes: [paste/attach]. Scorecard competencies: [list]. Debrief format the hiring committee expects: [describe or link example].\n\nRules:\n- Map every note to a specific competency; if a note doesn't clearly support any competency, put it in a separate \"other observations\" section instead of forcing a fit.\n- Preserve the interviewer's actual language for direct quotes and flag anything that reads as a personal impression rather than a specific example.\n- Never add a rating the interviewer didn't give.\n- Output one debrief per candidate in the agreed format.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming how interviewers take notes, what a debrief has to cover, and how debriefs reach the hiring committee.",
      tips: ["**Tip:** The interview surfaces the format gaps you didn't know you had."],
    },
    {
      title: "Build",
      body: "Build and test on a real set of interview notes. Review for every note mapped to a competency, quotes preserved, and no invented ratings.",
      tips: ["**Tip:** Mapping every note to a named competency forces the same structure onto five different note-taking styles."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every candidate, and package it into a skill once it passes a few candidates straight.",
      tips: ["**Tip:** It will smooth over vague or thin notes just as easily as strong ones, so a clean debrief isn't proof the interview itself was rigorous."],
    },
  ],
});

export const FINANCE_PERSONAL_BUDGET_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4d73126b4dad2c8293",
  about: [
    "This build sets up a Claude Project named \"Personal Budget\" with standing instructions and two reference files — financial-context.md and categories.md — so Claude reads your situation and category schema before every chat, instead of you re-explaining it each time.",
    "From there you hand Claude a 3-month transaction export, it returns a categorized CSV, and you build an Excel dashboard (Transactions, Summary, Variance, Dashboard tabs) with SUMIFS formulas and KPIs. The ongoing monthly review takes 5-8 minutes: new transactions in, categorized rows pasted into Excel, one debrief prompt.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether you're using Excel or Google Sheets for the dashboard."],
    ["Where your 3-month transaction CSV will come from (or use the provided sample data)."],
    ["What your rough monthly income, big fixed expenses, and 1-2 financial goals are, if you know them."],
  ],
  buildIntro: "Create a Claude Project named \"Personal Budget,\" then add financial-context.md and categories.md to its Knowledge panel so every chat in the Project starts from the same foundation.",
  prompt: "You are my personal finance copilot. You help me understand my spending, plan my budget, and make financial decisions grounded in my real transaction data.\n\nBehavior rules:\n- When categorizing transactions, use the categories defined in categories.md. If a transaction doesn't fit, propose a new category and ASK before creating it.\n- When I share new transactions, return them in the same structured CSV format I provided, with new \"Category\" and \"Subcategory\" columns added.\n- Always reference financial-context.md when answering questions about my situation.\n- Be direct and specific. When I ask 'how am I doing', give me numbers, not vibes.\n- Recognize stress and wins. Never moralize about my spending.\n- When generating Excel formulas, default to formulas that won't break if rows are added (SUMIFS over SUM, structured refs).\n- Round dollar amounts to whole numbers in your home currency.",
  steps: [
    {
      title: "Scope",
      body: "Set up the Project and its standing instructions, then add financial-context.md (your income, fixed expenses, debt, goals) and categories.md (your spending taxonomy) to Project Knowledge.",
      tips: ["**Tip:** financial-context.md is the source of truth the Custom Instructions tell Claude to always reference, so every chat starts already knowing your situation."],
    },
    {
      title: "Build",
      body: "Hand Claude your 3-month transaction CSV to categorize against categories.md, then paste the result into an Excel dashboard's Transactions tab and ask Claude for the SUMIFS formulas for the Summary, Variance, and Dashboard tabs.",
      tips: ["**Tip:** Specifying column names and order forces Claude's output to paste directly into Excel with no reformatting."],
    },
    {
      title: "Learn",
      body: "Add a monthly-update.md workflow file to the Project so each month's review is: export, categorize, paste into Excel, run the debrief prompt.",
      tips: ["**Tip:** A well-written prompt is a reusable analytical template — run the same prompt on each new month's data and results stay comparable over time."],
    },
  ],
});

export const FINANCE_EXPENSE_CATEGORIZATION_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae417f1c80ad957192d1",
  about: [
    "A batch of receipts or a bank export lands, and this system assigns every transaction a GL code or spend category, with the reasoning attached so a human can spot-check the uncertain ones. Categorization only holds up when the model shows its reasoning per line item, so a mistake surfaces before it hits the books.",
    "Run it as a weekly paste-in prompt against a statement export, a saved skill, or a scheduled agent that pulls each new batch through a tool connector. Every version holds its output for review before anything posts to your books.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your transaction data comes from, and whether it needs cleanup before the AI sees it."],
    ["Whether your chart of accounts already has enough example-based rules, or whether you need to write those first."],
    ["Who does the final review pass and how often."],
  ],
  buildIntro: "Gather your accounting software, your card or expense platform, and a spreadsheet for the review layer. The paste-in version needs none.",
  prompt: "Goal: Categorize this batch of transactions against my chart of accounts and flag anything you're not confident about.\n\nContext: Transaction export attached (CSV with date, vendor, amount, memo). My chart of accounts and category rules are [paste or attach: your GL code list with examples of past categorizations]. Recurring vendors that always map to one category: [list them].\n\nRules: Assign one GL code per transaction. If a transaction could reasonably fit more than one code, flag it instead of guessing and explain the ambiguity. Never invent a GL code that isn't in my chart of accounts. Flag any transaction over [$ threshold] regardless of confidence, for manual review.\n\nOutput format: A table with columns Date, Vendor, Amount, Assigned GL Code, Confidence (high/medium/low), Reasoning. A second table listing only the flagged/low-confidence rows.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where your transactions come from, your chart of accounts, which categorizations are genuinely ambiguous, and who reviews the output.",
      tips: ["**Tip:** The interview surfaces the edge cases your chart of accounts doesn't already cover."],
    },
    {
      title: "Build",
      body: "Build and test on a real batch of transactions. Review for one GL code per row, ambiguous ones flagged with reasoning, and nothing invented outside your chart of accounts.",
      tips: ["**Tip:** Naming the recurring vendors up front cuts the ambiguous pile down to the transactions that need a human look."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every batch, and package it into a skill once it passes a few batches straight.",
      tips: ["**Tip:** Never let categorized output post to the ledger without a human review step first."],
    },
  ],
});

export const FINANCE_INVOICE_BOOKKEEPING_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae41e85e62d98b89da14",
  about: [
    "A vendor invoice takes far longer to process industry-wide than it does for best-in-class accounts payable teams. Every time a vendor invoice arrives, by email or upload, this system pulls the vendor name, invoice number, dates, line items, and total, then drafts a journal entry against your chart of accounts. The entry sits in a queue labeled pending review until an accountant signs off.",
    "Anything missing, unreadable, or that looks like a duplicate gets flagged instead of guessed at. Run it as a paste-in prompt each time an invoice lands, a saved skill, or a scheduled agent watching an inbox. Every version stays read-only against your ledger.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["How invoices arrive today, and whether that needs a routing step first."],
    ["Where your chart of accounts and vendor history live."],
    ["Who has final sign-off before an entry posts, and what your hold process looks like for exceptions."],
  ],
  buildIntro: "Gather your accounting or ERP system, an OCR or document intake tool, and your approval workflow. The paste-in version needs none.",
  prompt: "Goal: Extract the key data from this invoice and draft a journal entry for review.\n\nContext: Invoice attached (PDF or image). My journal entry format uses these accounts: [paste your relevant GL accounts]. This vendor has historically been coded to [account/category], if that helps.\n\nRules: Extract vendor name, invoice number, invoice date, due date, line items, and total. Draft a journal entry using only accounts from my chart of accounts, never invent one. If any required field is missing, unreadable, or the invoice looks like a duplicate of one already processed, flag it and do not draft an entry. Every draft entry must be labeled \"pending review,\" never \"posted.\"\n\nOutput format: A structured summary of extracted fields, followed by the draft journal entry in debit/credit format, followed by a flags section noting anything uncertain or missing.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming how invoices arrive, the fields you need extracted, your journal entry format, and who approves entries before they post.",
      tips: ["**Tip:** The interview forces you to define your account structure and hold rules before any invoice touches the system."],
    },
    {
      title: "Build",
      body: "Build and test on a real invoice, PDF or image. Review for every field extracted, entries labeled pending review, and duplicates and missing data flagged.",
      tips: ["**Tip:** The \"pending review\" label and the flag-instead-of-guess rule keep a missing field or duplicate charge from turning into a silent posting error."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** Treat the held-for-review queue as the safety mechanism, and never let a draft entry post on its own."],
    },
  ],
});

export const FINANCE_CASH_FLOW_FORECAST_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae410cf214bba2c1516c",
  about: [
    "Cash forecasting is widely cited as the hardest task in treasury. This system pulls your bank balance, AR aging, and AP aging every week and turns them into a rolling 13-week forecast, flagging any week that dips below your cash minimum and naming what changed since last week's run.",
    "Run it as a weekly paste-in prompt, a saved skill, or a scheduled agent. Every version stays read-only against your bank and accounting systems.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your bank, AR, and AP data live, and how fresh they are when you pull them."],
    ["What \"shortfall\" means for your business, since minimum cash thresholds vary a lot by company stage."],
    ["Who needs this forecast weekly versus who just needs the exception flags."],
  ],
  buildIntro: "Gather your bank or banking platform export, your accounting system for AR and AP aging, and a spreadsheet for the rolling model itself. The paste-in version needs none.",
  prompt: "Goal: Update my rolling 13-week cash flow forecast with this week's data and flag anything concerning.\n\nContext: Bank balance as of [date]: [$ amount]. AR aging report attached. AP aging / upcoming payables attached. Last week's forecast attached for comparison. My minimum cash threshold is [$ amount].\n\nRules: Project cash position week by week for the next 13 weeks using expected AR collections and AP payments. Flag any week where projected cash falls below my minimum threshold. Call out what changed from last week's forecast and why. Do not assume collection timing beyond what the aging data supports; if uncertain, use the invoice due date.\n\nOutput format: A week-by-week table (Week, Beginning Cash, Inflows, Outflows, Ending Cash, Flag), followed by a short summary of what changed since last week.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your forecast horizon, your data sources, your cash minimum, and who sees the forecast each week.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every build session after."],
    },
    {
      title: "Build",
      body: "Build and test on a real week's data. Review for thirteen weeks projected, shortfalls flagged, and changes explained against last week.",
      tips: ["**Tip:** Comparing against last week's forecast turns a static snapshot into a running system that shows what moved."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every weekly run, and package it into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** Forecasts drift silently when the underlying AR/AP feed goes stale — treat any forecast built on week-old data as unreliable."],
    },
  ],
});

export const FINANCE_BUDGET_VS_ACTUALS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae40e7196c57e98f073a",
  about: [
    "Finance professionals widely expect AI to make their role more strategic, even though few feel it already has. Budget-vs-actual reporting is a template-driven part of that gap. This system reads your budget-vs-actual data at the close of each reporting period and writes the variance narrative in plain language, ready to drop into a board deck.",
    "Every number in it has to trace back to a source row in the data it was given. Run it as a paste-in prompt each period, a saved skill, or a scheduled agent pulling fresh data automatically. Every version stays read-only against your source systems.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where budget and actuals data lives today, one place or scattered across systems."],
    ["What variance threshold is meaningful to your stakeholders versus noise."],
    ["Whether the narrative needs a provenance check before it reaches a board deck."],
  ],
  buildIntro: "Gather your accounting or ERP system, an FP&A or planning tool, and a spreadsheet for review. The paste-in version needs none.",
  prompt: "Goal: Write a variance narrative explaining what moved and why, from this period's budget-vs-actual data.\n\nContext: Budget vs. actual export attached. Prior period's narrative attached for tone reference. My variance threshold for \"worth explaining\" is [e.g. more than 10% or $5,000].\n\nRules: Only write about variances above the stated threshold. Every number cited in the narrative must appear in the source data you were given; do not estimate or round in a way that changes the reported figure. State the direction (over/under), the dollar amount, and the percentage for each variance called out. If you cannot explain why a variance happened from the data alone, say so instead of guessing a cause.\n\nOutput format: A short narrative (200-400 words) organized by department or line item, followed by a table of every variance above threshold.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your data sources, your real variance threshold, and how it catches a number that doesn't trace back.",
      tips: ["**Tip:** The interview forces a stakeholder-specific threshold and a provenance check into the scope before you write a single narrative."],
    },
    {
      title: "Build",
      body: "Build on a real budget-vs-actual export. Review every cited number against the export; threshold followed, no cause invented.",
      tips: ["**Tip:** The same-data-only rule keeps the narrative from padding out an explanation it can't back up with a real source row."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every period, and package it into a skill once it passes a few periods straight.",
      tips: ["**Tip:** A hallucinated number in a board deck is a career event — nothing ships until every figure has been traced to a source row."],
    },
  ],
});

export const FINANCE_MONTH_END_CLOSE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae410824301c8ae79dd5",
  about: [
    "Close speed splits on process discipline, and the gap between top-quartile and bottom-quartile close times is wide. This system tracks your close checklist against target dates and task order, flags anything overdue or blocked, and groups the picture by owner so nothing surfaces for the first time on the last day of close.",
    "It doesn't do the accounting judgment — it matches reported status against the checklist and nags on it before it becomes the reason close slips another day.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your close checklist lives today, before you can automate tracking it."],
    ["How task status updates reach the agent, since someone still has to report done."],
    ["Who gets the overdue nag and how often, so it helps instead of becoming noise."],
  ],
  buildIntro: "Gather a task or project tool for the checklist itself, your accounting system, and a channel for reminders and status updates. The paste-in version needs none.",
  prompt: "Goal: Track our month-end close checklist and tell me what's overdue or blocked right now.\n\nContext: Our close checklist: [paste the full list of tasks, owners, and target dates]. Today's date and where we are in the close cycle: [day X of close]. Status update from the team: [paste any updates on what's done].\n\nRules: Match reported status against the checklist and target dates. Flag anything past its target date as overdue, and anything whose prerequisite task isn't done yet as blocked. Never mark a task complete unless someone explicitly reported it done. Group output by owner so each person sees only their items first, then show the full picture.\n\nOutput format: A status table (Task, Owner, Target Date, Status), followed by a short list of what needs attention today.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your checklist tasks and owners, what counts as overdue or blocked, and how status updates reach the agent.",
      tips: ["**Tip:** The interview forces you to define \"done\" and \"overdue\" before you build, so the first cycle doesn't start with a false alarm."],
    },
    {
      title: "Build",
      body: "Build and test on the current close cycle, with the latest status attached. Review for accurate owner groupings, blocked tasks tied to a real prerequisite, and nothing marked done without a report.",
      tips: ["**Tip:** Explicit rules for overdue and blocked keep the output consistent from day to day."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every cycle, and package it into a skill once it passes a few cycles straight.",
      tips: ["**Tip:** A checklist agent that lets a task get marked done without real confirmation just hides the risk of a missed step later."],
    },
  ],
});

export const FINANCE_COLLECTIONS_EMAILS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae40c4325d194ee62b3b",
  about: [
    "Slow collections cost real cash — companies using AI in accounts receivable widely report a lower average days sales outstanding. This system reads your AR aging report and drafts a follow-up email for every overdue invoice, personalized to that customer's history and tone, escalating as days overdue grows.",
    "Nothing goes out until you review it. Run it as a paste-in prompt against a fresh export, a saved skill, or a scheduled agent that runs weekly.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your AR aging data lives and how current it is when you pull it."],
    ["Which customer relationships need a human touch versus a standard template."],
    ["Whether emails send automatically after a review window or always wait for an explicit send."],
  ],
  buildIntro: "Gather your accounting or invoicing system, your email tool, and your CRM if relationship notes live there. The paste-in version needs none.",
  prompt: "Goal: Draft a follow-up email for each overdue invoice on this AR aging report.\n\nContext: AR aging report attached, showing customer, invoice number, amount, and days overdue. Customer notes: [any relationship context]. My company's tone is [e.g. friendly but direct, never apologetic].\n\nRules:\n- Draft one email per overdue invoice.\n- Match tone to the customer notes provided. Do not invent history you weren't given.\n- Include the invoice number, amount, and due date in every email.\n- Escalate tone gradually based on days overdue: gentle reminder under 30 days, firmer language 30-60 days, final notice language over 60 days.\n- Never threaten legal action or make claims about consequences unless I explicitly authorize that language for a specific account.\n\nOutput as one draft email per invoice, held in a list for my review before sending.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your AR data source, tone rules by customer, escalation thresholds, and your review process.",
      tips: ["**Tip:** The interview surfaces tone and escalation decisions up front, and the result becomes the brief for every build after it."],
    },
    {
      title: "Build",
      body: "Build and test on a real export, every overdue invoice included. Review each draft for the right tone, correct invoice details, and nothing that reads as a legal threat.",
      tips: ["**Tip:** Explicit escalation tiers keep tone consistent across dozens of invoices instead of the AI judging firmness case by case."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes several runs straight.",
      tips: ["**Tip:** A collections email that gets tone or amount wrong damages a customer relationship worse than a spreadsheet error — route early drafts through human review."],
    },
  ],
});

export const FINANCE_INVOICE_PO_DATA_ENTRY_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3f9d989c5117dc791d",
  about: [
    "Keying in invoices by hand is expensive work, and the cost gap between manual and best-in-class AP teams tracks with how much of the process still runs by hand. This system reads a batch of invoices or POs, whatever format they arrive in, and pulls vendor, amount, line items, and dates into rows that match your tracker's exact columns.",
    "It cross-checks the invoice total against the line items and flags anything it can't read clearly. It never marks anything approved or paid — extraction only, approval stays with a person.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where invoices land today, before deciding how to feed them in."],
    ["Your tracker's exact required fields and column order."],
    ["Who reviews flagged extractions, and how fast."],
  ],
  buildIntro: "Gather your document source, your tracker or accounting system, and your approval workflow. The paste-in version needs none.",
  prompt: "Goal: Extract structured data from my invoices or POs and enter it into my tracker without manual re-typing.\n\nContext: [Documents arrive via a shared inbox, vendor portal, or scanned folder. Note the exact format. Required fields: vendor name, invoice number, date, line items, amount, PO number. Paste your tracker's columns in exact order.]\n\nRules:\n- Flag any document where a required field can't be read clearly. Don't guess.\n- Cross-check the invoice total against the sum of line items and flag any mismatch.\n- Never mark anything approved or paid. Extraction only.\n- Output one row per invoice matching the tracker's exact columns, plus a separate list of flagged items.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where invoices come from, what format they arrive in, what fields you need extracted, where the data ends up, and what happens when something looks off.",
      tips: ["**Tip:** The interview surfaces the exact fields and edge cases you'd otherwise discover mid-build."],
    },
    {
      title: "Build",
      body: "Build and test on a real batch of invoices or POs. Review for every field traceable to the source, mismatches caught, and nothing marked paid.",
      tips: ["**Tip:** Cross-checking the total against the line items catches an OCR error math would otherwise hide."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every batch, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** A missing PO number or mismatched vendor name has to get flagged loudly, never filled in silently."],
    },
  ],
});

export const FINANCE_REPORTS_ACCURATE_DATA_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae39145f62682627ec04",
  about: [
    "Every rebuild of a recurring report is a fresh chance for a number to arrive without a source — a well-documented case of fabricated citations reaching a published finance report shows the real cost of getting this wrong. This system hands your AI tool the source of truth and it assembles the report with every figure cited back to it, flagging what it can't trace.",
    "Run it as a paste-in habit before each close, a saved skill, or a triggered agent.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where your numbers actually live, and what you can hand over as one clean source file."],
    ["Whether a derived number must show its math to count as traced."],
    ["How much gets automated — a paste-in habit before each close is a complete version."],
  ],
  buildIntro: "Gather your spreadsheet tool, your accounting system's export or reporting API, and a warehouse connector if that's where numbers live. The paste-in version needs only the source file.",
  prompt: "Goal: Create this period's [report name] from my source data, with every number cited to its source.\n\nContext:\n- Report template or last period's version: [paste or attach]\n- Source of truth: [the source spreadsheet, GL export, or system report every number should come from]\n\nRules:\n- Every number in the output must state which row, cell, or line in the source it came from.\n- If a number the template needs has no traceable match in the source, flag it explicitly. Do not guess or carry forward last period's value.\n- Treat derived numbers as sourced only if you show the underlying figures and the math.\n- Never adjust a source number silently. Flag discrepancies and stop. A human decides the fix.\n- End with a provenance table: Number | Source location | Status: traced / flagged.",
  steps: [
    {
      title: "Scope",
      body: "Pick one recurring report you own, then have your AI tool interview you into a scope document naming the report, its source files, the output format, and the rule for untraceable numbers.",
      tips: ["**Tip:** The interview forces the two make-or-break decisions — which report to start with and what counts as a traceable source — before any drafting happens."],
    },
    {
      title: "Build",
      body: "Test on a period you've already closed and checked by hand. Review whether every figure traces, and whether it flagged the number with no clean source.",
      tips: ["**Tip:** Building the report and the provenance table in one pass means sourcing is never a cleanup step someone skips under deadline pressure."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every cycle, and package it into a skill once it passes a few cycles straight.",
      tips: ["**Tip:** A number can be sourced and still stale, so keep the source export current before every run."],
    },
  ],
});

export const PRODUCT_CUSTOMER_INTERVIEW_ANALYZER_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae47c28a183e845f72d5",
  about: [
    "Product-market fit problems are the single most common cause named in startup post-mortems. This system reads your customer interview transcripts and notes and adds each new interview to a running document of validated pain points, objections, and direct quotes, grouped by theme, so a pattern across ten interviews shows up instead of getting buried in ten note files.",
    "Run it as a paste-in prompt after each call, a saved skill, or a scheduled agent that watches your notes folder or meeting tool for a new transcript.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where interview recordings or notes land today — a call tool, a shared drive, or a notebook app."],
    ["Whether the tracker lives as a standing document the AI tool updates or a fresh output generated each time."],
    ["Who besides you needs to see a flagged contradiction between two interviews."],
  ],
  buildIntro: "Gather your meeting notes tool, your call recording or video tool, and your notes and docs home. The paste-in version needs none.",
  prompt: "Goal: Read the newest customer interview transcript or notes file and add its findings to my running pain-point tracker without duplicating what's already there.\n\nContext: Interviews live in [folder or tool]. My tracker is a single document organized by theme, not by interview date. Each entry needs the pain point, the customer's own words, which interview it came from, and how many separate interviews have now raised it.\n\nRules:\n- Never merge two different pains into one because they sound similar; flag them side by side instead and let me decide.\n- Quote the customer directly rather than paraphrasing.\n- If a pain point contradicts something an earlier interview said, flag the contradiction instead of picking a side.\n- Output as a markdown table grouped by theme, sorted by how many interviews raised each one.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where your interviews live, how many you run each month, and what you do with insights today.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every build session after it."],
    },
    {
      title: "Build",
      body: "Build and test on your newest interview file. Review for direct quotes, correct groupings, and contradictions flagged instead of resolved.",
      tips: ["**Tip:** Sorting by theme instead of interview date is what makes a repeated pain visible, and flagging contradictions instead of resolving them keeps the call on you."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every interview update, and package it into a skill once it passes a few interviews straight.",
      tips: ["**Tip:** Require a minimum count before it calls a pain point validated — the person who talks most in an interview isn't always the one who represents the market."],
    },
  ],
});

export const PRODUCT_USER_INTERVIEW_PROCESS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae43fc5f0dd7ad56634f",
  about: [
    "Interview synthesis used to eat hours it didn't need to — AI synthesis has cut that time dramatically. This system reads a batch of transcripts from one round and returns the behaviors, pains, and contradictions that show up across the set, each tied to a quote and a participant, instead of one person rereading every call.",
    "Run it as a paste-in prompt after each round, a saved skill, or a scheduled agent that pulls fresh transcripts from your meeting notes tool. Every version stays read-only against your transcripts and research repository.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether transcripts arrive from a notetaker or need manual upload each round."],
    ["Whether output updates a living persona doc or stays a one-off summary."],
    ["How many participants need to raise a pain before it counts as a finding."],
  ],
  buildIntro: "Gather a meeting notes tool for the transcripts, a research repository for the running history, and a living persona doc if the scope calls for one. The paste-in version needs none.",
  prompt: "Goal: Synthesize a batch of interview transcripts into a structured findings summary.\n\nContext: [Paste transcripts or notes for this round], [the research question this round is meant to answer], [target customer segment]\n\nRules:\n- Report a pain only when at least 2 participants raise it, unless a single report is safety- or churn-relevant.\n- Attach a quote and participant ID to every claim.\n- Call out contradictions between participants rather than smoothing them over.\n- End with 3 open questions the round left unanswered.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming how many interviews you run per round, your transcript format, what you want to see at the end, and how much it should flag versus decide on its own.",
      tips: ["**Tip:** The interview surfaces the judgment calls a synthesis system has to make before you're staring at a stack of transcripts."],
    },
    {
      title: "Build",
      body: "Build and test on a real batch of transcripts. Review for quotes and IDs attached, contradictions kept in, and the threshold respected.",
      tips: ["**Tip:** The two-participant threshold keeps one offhand comment from reading as a trend, and the quote-plus-ID rule keeps every finding traceable."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every round, and package it into a skill once it passes a few rounds straight.",
      tips: ["**Tip:** Synthesis can flatten real disagreement into a false consensus, so contradictions have to survive in the output."],
    },
  ],
});

export const PRODUCT_SPEC_TO_PROTOTYPE_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae430627ffe1b1012dc3",
  about: [
    "A spec sitting in a doc waits for an engineering cycle that might be weeks out. This system skips the wait — once a spec clears review, a coding agent reads it and builds a working prototype the team can react to before that meeting ends.",
    "This works as a one-time paste-in prompt each time a spec clears review, a saved skill your whole team reuses, or an agent triggered automatically whenever a spec is marked approved. Every version builds in a sandbox, isolated from production.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether this builds inside an existing codebase or starts from scratch."],
    ["What counts as done — a throwaway demo or something engineering can build on later."],
    ["Which design system the prototype needs to match, if any."],
  ],
  buildIntro: "Gather code hosting for the branch itself, a design tool for visual fidelity, and a deployment sandbox for review. The paste-in version needs none.",
  prompt: "Goal: Turn an approved spec into a working prototype for review.\n\nContext: [Paste your approved spec or PRD. Note your target platform or stack, and any existing design system it needs to match.]\n\nRules:\n- Build only what the spec explicitly describes.\n- Flag anything ambiguous instead of guessing at it.\n- Keep the prototype in a separate branch or sandbox. Never touch production.\n- Note what was built, what was skipped, and what still needs an engineer's judgment.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming how detailed your specs are, what kind of prototype you need, the stack it's built in, and how you plan to review it.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every prototype after it."],
    },
    {
      title: "Build",
      body: "Build and test on the approved spec. Review whether it built only what the spec described, flagged ambiguity instead of guessing, and left production untouched.",
      tips: ["**Tip:** Naming the branch and sandbox constraint up front keeps the agent from wandering into production."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** A coding agent will build past the spec's scope if left unchecked, so the run needs a stop-and-ask rule for ambiguity."],
    },
  ],
});

export const PRODUCT_IDEA_TO_PRD_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae43fd30fff006b1a5c7",
  about: [
    "A rough feature idea usually turns into a PRD from a blank page. This system does the job standalone — hand it a sketch or a meeting note and it returns a first-draft PRD ready for a human editor.",
    "Only a small share of product teams consistently use a formal scoring or prioritization framework, and fewer still use any AI-assisted scoring at all. A structured PRD brings more rigor to a feature's reasoning than most teams apply before it reaches engineering.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where feature ideas typically start — a meeting note, a Slack thread, a one-liner."],
    ["Which sections every PRD needs, and whether past PRDs feed in as style examples."],
    ["Whether the draft stays a standalone doc or syncs into a ticketing system for handoff."],
  ],
  buildIntro: "Gather a docs tool, a ticketing system, and a meeting notes tool. The paste-in version needs none.",
  prompt: "Goal: Turn a rough feature idea into a first-draft PRD.\n\nContext: [the idea or meeting notes], [primary user segment], [known technical constraints]\n\nRules:\n- Include a problem statement, goals, non-goals, 3 to 5 user stories, acceptance criteria, edge cases, and open questions.\n- Mark any unsupported assumption as [ASSUMPTION].\n- Keep the draft to one page.\n- Never invent a launch date or headcount.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming what sections every PRD should include, where your ideas usually start, how much of your own past PRDs to feed in as examples, and where the draft should land.",
      tips: ["**Tip:** The interview surfaces decisions you haven't made yet, and the scope document becomes the brief for every draft after it."],
    },
    {
      title: "Build",
      body: "Build and test on a real idea. Review for every section present, assumptions flagged, and no invented dates.",
      tips: ["**Tip:** Marking assumptions keeps you from mistaking a guess for a requirement, and the one-page limit forces the draft to prioritize instead of padding."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** A PRD generator will confidently fill gaps you never asked it to fill — flag every unverified claim and treat the output as an early draft."],
    },
  ],
});

export const PRODUCT_FEEDBACK_THEME_TRACKER_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae42324ca1079e90c3a6",
  about: [
    "Synthesizing customer signals has become a top time drain for product leaders, with most teams watching feedback scattered across 7 to 9 separate channels at once. This system reads tickets, reviews, and survey responses, clusters them into themes ranked by frequency and severity, and returns each theme with the quotes that back it up, linked to source.",
    "Run it as a weekly paste-in prompt, a saved skill, or a scheduled agent that pulls from your support tool and survey exports. Every version stays read-only against your feedback sources.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which support tool, survey tool, and review source feed the clustering, and how to export each cleanly."],
    ["Whether frequency or severity drives the ranking when the two disagree."],
    ["What a representative quote needs to include so it stays traceable back to source."],
  ],
  buildIntro: "Gather your support tool, a survey tool for intake, and a sheet or doc for the running history. The paste-in version needs none.",
  prompt: "Goal: Cluster my raw customer feedback into ranked, evidence-backed themes.\n\nContext: [Paste your export of tickets, reviews, and survey responses for the period. Note the product areas you want it to watch.]\n\nRules:\n- Return no more than 8 themes.\n- Rank by frequency and severity, stated separately.\n- Attach 2-3 representative quotes per theme, each with a source link.\n- Never merge two distinct complaints into one theme because the wording overlaps.\n- Flag any single high-severity report on its own, even if it only appears once.\n- Output as a ranked list: theme name, frequency, severity, quotes with source.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming which feedback sources to pull in, how often to run it, whether frequency or severity matters more for ranking, and what a representative quote needs to include.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every build session after it."],
    },
    {
      title: "Build",
      body: "Build and test on a real export, every source included for the period. Review for distinct themes, traceable quotes, and the lone high-severity report still surfaced.",
      tips: ["**Tip:** Separating frequency from severity and forcing a source link on every quote keeps a loud minority complaint from reading as consensus."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** Clustering can quietly merge two different complaints that share vocabulary into one theme — check that quotes still trace back to source."],
    },
  ],
});

export const PRODUCT_BACKLOG_PRIORITIZER_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae42e4af7bd005835afc",
  about: [
    "Most backlogs get ranked by gut feel and whoever argued loudest in the meeting. Only a small share of product teams consistently use a formal scoring framework. This system scores your backlog on impact, effort, confidence, and strategic alignment, and returns a ranked list with the reasoning behind each score visible.",
    "A visible, evidence-backed score is easier to defend when priorities get challenged mid-cycle. Run it before each planning cycle as a paste-in prompt, a saved skill, or a scheduled agent that pulls straight from your backlog tool. Every version stays read-only against your ticketing system.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which factors matter most, and how each one is weighted."],
    ["Where the backlog lives, and whether effort estimates already exist or need pulling from engineering."],
    ["How ties get broken, and whether scoring runs automatically or only when you trigger it."],
  ],
  buildIntro: "Gather your ticketing system and a sheet for the rubric. The paste-in version needs none.",
  prompt: "Goal: Score and rank a backlog so the team can defend what's next.\n\nContext: [Paste your backlog export, one row per item. Include this quarter's strategic priorities, and any effort estimates already on file.]\n\nRules:\n- Score each item 1-5 on impact, effort, confidence, and strategic alignment.\n- Show the reasoning behind each score.\n- Flag high-impact items with no supporting evidence as needing validation.\n- Never drop an item. If it scores low, rank it low and say why.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming which factors matter most, how ties get broken, where your backlog lives, and whether scoring runs automatically or only when you trigger it.",
      tips: ["**Tip:** The interview forces you to define scoring factors and tie-breaks before a single ticket gets ranked."],
    },
    {
      title: "Build",
      body: "Build and test on a real backlog export, every open item included. Review for every item scored on all four factors, reasoning visible, and nothing dropped.",
      tips: ["**Tip:** Scoring every item on the same four factors keeps the ranking consistent from cycle to cycle, and visible reasoning gives you something to defend."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every cycle, and package it into a skill once it passes a few cycles straight.",
      tips: ["**Tip:** A scoring system produces a confident-looking number even when the inputs are guesses — the final call on what ships stays a human decision."],
    },
  ],
});

export const PRODUCT_COMPETITOR_RESEARCH_REPORT_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4225cab744782f9dbf",
  about: [
    "Competitive analysis that once took a PM's week can now run in minutes once an agent handles the synthesis. This system reads your competitors' blogs, changelogs, and pricing pages, filters for what changed since the last run, and sends you a digest with a source link on every item. You still decide what a move means.",
    "Run it as a weekly paste-in prompt, a saved skill, or a scheduled agent that posts to Slack. Every version only reads public pages.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which competitors and sources earn a weekly check."],
    ["Whether pricing pages need a scraper or a direct fetch works."],
    ["What counts as a meaningful change versus noise, per competitor."],
  ],
  buildIntro: "Gather a scheduler, team chat to deliver the digest, and a docs tool to hold the running history. The paste-in version needs none.",
  prompt: "Goal: Produce a weekly cited digest of meaningful competitor changes.\n\nContext: [3-5 competitors with blog/changelog/pricing URLs], [your core value props to compare against]\n\nRules:\n- Only include changes from the last 7 days.\n- Cite the source URL for every item.\n- Group findings by competitor.\n- Skip cosmetic edits (typo fixes, rewording, date stamps).\n- Flag any pricing or packaging change as high priority.\nOutput as a short weekly digest: competitor name, what changed, why it matters, and the source link.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming which competitors matter most, which sources to check for each, how far back to look, and what counts as a meaningful change versus noise.",
      tips: ["**Tip:** Naming the noise threshold up front stops the first digest from arriving full of cosmetic edits nobody asked for."],
    },
    {
      title: "Build",
      body: "Build and test on your competitor list and their URLs. Review for findings grouped by competitor, every item linked, pricing changes flagged, and cosmetic edits gone.",
      tips: ["**Tip:** A required source link on every line keeps a vague blog post from turning into a confident claim about a shipped feature."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every weekly run, and package it into a skill once it passes a few weeks straight.",
      tips: ["**Tip:** This stays a monitoring tool — every claim needs a clickable source, and the call on what to do about a competitor's move stays yours."],
    },
  ],
});

export const PRODUCT_AB_TEST_READOUTS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae414c606334ed556eef",
  about: [
    "Checking a test's results before it reaches its planned sample size — \"peeking\" — can inflate a nominal 5% significance threshold far higher, and a lot of declared wins never get checked against that math. This system reads your test-versus-control data and returns a readout of the outcome, its uncertainty, and one recommended next step instead of a single \"we won\" headline.",
    "Run it as a paste-in prompt each time a test hits its stopping point, a saved skill, or a scheduled agent pulling straight from your experimentation tool. Every version stays read-only against your test data.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which platform your results come from, and whether that needs a connector or a manual export."],
    ["Whether your team already pre-registers a stopping rule, or needs one built before this runs."],
    ["What the readout must always include — confidence interval and segment differences — versus what's optional."],
  ],
  buildIntro: "Gather an experimentation tool, a sheet if results are pulled manually, and a docs tool to deliver the readout. The paste-in version needs none.",
  prompt: "Goal: Turn raw test results into a plain-language readout with a clear recommendation.\n\nContext: [Paste your results export: treatment vs. control, sample sizes, and the metrics tracked.] [Your pre-registered primary metric and any guardrail metrics.] [Your planned sample size or stopping date.]\n\nRules:\n- State whether the pre-set sample size was reached before this readout was run.\n- Report the primary metric's result with its confidence interval, not a single point estimate.\n- Note any segment differences worth flagging, and label them as a hypothesis, not a conclusion.\n- Never call a result a \"winner\" if the test was stopped early.\n- End with one clear recommendation: ship, hold, or extend the test.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming your results source, what the readout always covers, how to handle a test that isn't yet significant, and who reads it.",
      tips: ["**Tip:** The interview forces the stopping rule and the required fields into writing before a single result gets read."],
    },
    {
      title: "Build",
      body: "Build and test on a real results export. Review for the sample size confirmed, the interval stated, segments labeled as hypotheses, and one recommendation given.",
      tips: ["**Tip:** Requiring the confidence interval and the stopping-rule check up front blocks the shortcut straight to a headline."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every test, and package it into a skill once it passes a few tests straight.",
      tips: ["**Tip:** It can't know if a test was peeked at early, so that discipline has to be enforced upstream."],
    },
  ],
});

export const OPERATIONS_RECURRING_REPORTS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4079403e9797fd44fa",
  about: [
    "The typical FP&A team loses real hours a week per staffer to manual reporting, with most of that time going to gathering and managing data rather than analyzing it. This system points an agent at the same sources you'd check by hand, pulls the current numbers, and drafts the written summary in the format your report has always used.",
    "Run it as a paste-in prompt the day before the report is due, a saved skill, or a scheduled agent dropping a draft into your reporting home. A person reviews and sends it.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether your data sources are cleanly exportable or need a manual pull first."],
    ["The significance threshold for what's worth flagging as a change."],
    ["Who reviews the draft, and how much time they need before it's due."],
  ],
  buildIntro: "Gather your data source, your reporting home, and a scheduling layer if this runs on a timer. The paste-in version needs none.",
  prompt: "Goal: Draft [report name], a [frequency] report covering [what it covers], in the same format it's always used.\n\nContext: Data sources are [list actual sources]. Past reports for reference at [location]. Audience is [who reads it] and cares most about [what matters to them].\n\nRules:\n- Compare every number to the prior period and call out the direction and size of the change.\n- Only flag a change as significant if it crosses [a defined threshold, e.g. 10%].\n- Never state a number not traceable to a listed source.\n- Match the tone and structure of the last three reports.\n- Output: exact section order of the template, plus a one-line \"what changed\" summary at the top.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming where the data comes from, what the report has always looked like, what counts as a meaningful change versus noise, and who reviews it before it goes out.",
      tips: ["**Tip:** The interview forces you to name the format and threshold decisions you've been making by feel."],
    },
    {
      title: "Build",
      body: "Build and test on a real pull of current data. Review for every number traced to a source, threshold applied consistently, and format matching the last three reports.",
      tips: ["**Tip:** Naming a numeric threshold up front keeps the draft from flagging every small wiggle as news."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every cycle, and package it into a skill once it passes a few cycles straight.",
      tips: ["**Tip:** A dashboard pull error looks exactly like a real number until someone checks it — build a sanity check into the pull itself."],
    },
  ],
});

export const OPERATIONS_WORK_GETS_STUCK_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae40662f2c57cbffcf43",
  about: [
    "Most teams already have the data that would show them where work stalls — it just sits in a tracker instead of getting analyzed. This system reads an export of that data, calculates time-in-stage for every item, and ranks the stages costing you the most time, with the numbers behind each one.",
    "Run it as a paste-in prompt whenever throughput feels off, a saved skill for a recurring check, or a scheduled agent that reruns monthly and diffs against the last pass.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Where timestamp data lives and whether it exports cleanly."],
    ["What counts as a \"stage\" in your tools."],
    ["How far back to look — long enough to be representative, not so long it spans a process that's since changed."],
  ],
  buildIntro: "Gather your ticket or task tracker, a shared spreadsheet if there's no formal tracker, and your communication tool if bottlenecks show up in thread delays. The paste-in version needs none.",
  prompt: "Goal: Analyze [X weeks/months] of ticket data from [Jira/Asana/Linear] to find where work stalls in our [process name] process and rank the worst offenders.\n\nContext: [Paste your ticket export: created date, stage, assignee, closed date, for every item.] Process stages in order: [list them]. Normal cycle time is roughly [X days].\n\nRules:\n- Calculate time-in-stage for every item, not just total cycle time.\n- Flag any stage where median hold time exceeds [X days].\n- Separate rework loops (items that bounced backward) from items that just sat.\n- Don't recommend headcount changes, only process fixes.\n- Output: a ranked table of stages by hold time, a one-paragraph diagnosis of the worst stage, and 3 next steps.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming the process itself, what data you can export, how far back to look, and what you want to do with the answer.",
      tips: ["**Tip:** The interview forces you to define a normal cycle time before you see any data, so flagged stages are outliers against your own baseline."],
    },
    {
      title: "Build",
      body: "Build and test on a real export, every stage included. Review for every stage measured, rework separated from hold time, and no headcount recommendations.",
      tips: ["**Tip:** Separating rework loops from items that just sat keeps a slow-but-correct approval stage from getting flagged the same way as a genuine stall."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every run, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** Timestamps lie when people batch-update status at day's end — treat any finding as a hypothesis to check against real examples."],
    },
  ],
});

export const OPERATIONS_MEETING_ACTION_ITEMS_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae3f6e098a0cda79a8fd",
  about: [
    "US knowledge workers spend a significant share of their year in meetings they consider unnecessary, and many see a direct link between missed deadlines and meeting overload. This system takes the transcript or rough notes from a meeting, pulls out who owns what and by when, separates decisions from open questions, and posts the result to wherever your team tracks work.",
    "Run it as a paste-in prompt right after a meeting ends, a saved skill, or a scheduled agent that reads a recurring meeting's transcript and posts on its own. Keep a human glance before it posts, at least until you trust the owner calls it's making.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Whether your input is a clean transcript or your own rough notes, and how consistent it stays meeting to meeting."],
    ["Which tracker is the real source of truth for your team."],
    ["How to handle meetings where nobody assigns a clear owner out loud."],
  ],
  buildIntro: "Gather your meeting or recording tool, your task tracker, and your team chat tool for posting a summary alongside tracked items. The paste-in version needs none.",
  prompt: "Goal: Turn the transcript or notes from [meeting name] into action items with owners and due dates, posted to [tracker].\n\nContext: Meeting recurs [frequency] with [attendees]. Notes come from [tool]. Tracker is [Notion/Asana/Linear] with fields [owner, due date, status, project].\n\nRules:\n- Separate action items from decisions from open questions.\n- Only assign an owner if named explicitly, flag anything ambiguous.\n- Never invent a due date that wasn't discussed.\n- Output as three lists: action items, decisions, and open questions, one line each, owner and date where known.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming which meetings to start with, how notes get in, where action items land, and how owners get assigned when ambiguous.",
      tips: ["**Tip:** The interview surfaces decisions you didn't know you needed to make, and the scope document becomes the brief for every build session after it."],
    },
    {
      title: "Build",
      body: "Build and test on the transcript or notes from one real meeting. Review for the three lists kept separate, with no invented owners or dates.",
      tips: ["**Tip:** Explicit rules for what counts as an action item versus a decision keep it from guessing at ownership when a meeting never assigned one out loud."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every meeting, and package it into a skill once it passes meetings straight.",
      tips: ["**Tip:** It can only work from what was said out loud, so posting without a human glance first trains people to ignore it the moment it gets an owner wrong in public."],
    },
  ],
});

export const OPERATIONS_REPETITIVE_PROCESS_WALKTHROUGH_TUTORIAL: Block[] = buildTutorial({
  source: "urn:contentEntry:6ab9ae4037b8bb0628150b48",
  about: [
    "A majority of knowledge workers say it's hard to track down information at work despite knowing plenty of people who could help — a clear sign of a process still living in one person's head instead of a doc. This system takes a recorded walkthrough, a screen share with narration, or someone just talking through the steps, and turns the transcript into a numbered SOP with verification steps and a troubleshooting section.",
    "Steps land in the order performed rather than a cleaned-up ideal, workarounds get called out separately from the standard path, and any step the person skipped without explaining gets flagged. Whoever recorded the walkthrough reviews the draft before it counts as the process.",
  ],
  setupHeaders: ["Before you build, decide"],
  setupRows: [
    ["Which tool captures the walkthrough, and whether it auto-generates a transcript."],
    ["Where the finished SOP lives so people find it."],
    ["Who reviews and approves it before it's treated as the real process."],
  ],
  buildIntro: "Gather your recording or transcription tool, your documentation home, and your team chat tool to announce the new SOP. The paste-in version needs none.",
  prompt: "Goal: Turn a transcript of me walking through [process name] into a numbered SOP that [new hire/teammate] could follow without asking me anything.\n\nContext: Transcript at [file location]. This process uses [tool names from the walkthrough]. The person following it will have [access level, prior knowledge].\n\nRules:\n- Number steps in the order actually performed, not a cleaned-up ideal order.\n- Call out workarounds or exceptions separately from the standard path.\n- Flag any step where I skipped an explanation.\n- Output: numbered steps, a \"before you start\" checklist, and a troubleshooting table.",
  steps: [
    {
      title: "Scope",
      body: "Have your AI tool interview you into a scope document naming the process, how you'll capture it, who the SOP is for, and where the finished doc lives.",
      tips: ["**Tip:** The interview forces decisions about capture method and audience up front, before you're staring at a raw transcript guessing what the SOP is for."],
    },
    {
      title: "Build",
      body: "Build and test on a real walkthrough transcript. Review the draft for real order, workarounds separated out, and troubleshooting covering the likely failures.",
      tips: ["**Tip:** Ordering steps by what happened keeps the SOP matching reality instead of turning into an idealized description no one follows exactly."],
    },
    {
      title: "Learn",
      body: "Measure against a rubric, log every SOP you generate, and package it into a skill once it passes a few runs straight.",
      tips: ["**Tip:** A transcript captures what someone did, so a bad habit narrated clearly still turns into a clean, wrong SOP — check the draft against what the process should be."],
    },
  ],
});
