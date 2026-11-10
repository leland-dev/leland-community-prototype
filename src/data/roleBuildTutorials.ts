// Role-specific build tutorials for Lesson 1 / build-1's role picker, adapted
// from the Leland+ library content entries (see each TUTORIAL's `source` for
// the original urn:contentEntry id) and embedded inline rather than linked
// out to, so a learner never leaves the lesson page.
import type { Block } from "./lessonBlocks";

type TutorialStep = {
  title: string;
  body: string;
  tips: string[];
};

type TutorialSource = {
  source?: string; // urn:contentEntry id this was adapted from, when there is one
  about: string[];
  setupHeaders: string[];
  setupRows: string[][];
  niceToHave: string;
  buildIntro: string;
  prompt: string;
  steps: TutorialStep[];
};

function buildTutorial(src: TutorialSource): Block[] {
  return [
    { kind: "markdown", body: src.about.join("\n\n") },
    { kind: "markdown", body: "### Setup" },
    { kind: "table", headers: src.setupHeaders, firstColumnBold: true, rows: src.setupRows },
    {
      kind: "callout",
      tone: "tan",
      title: "Nice to have",
      content: [{ kind: "markdown", body: src.niceToHave }],
    },
    { kind: "markdown", body: ["### Build it with this prompt", "", src.buildIntro].join("\n") },
    { kind: "code", language: "prompt", filename: "Prompt", code: src.prompt },
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
export const LOREM_STUB_TUTORIAL: Block[] = buildTutorial({
  about: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    ["Lorem ipsum", "Dolor sit amet consectetur", "Adipiscing elit sed do eiusmod tempor incididunt."],
    ["Ut labore et dolore", "Magna aliqua ut enim ad minim", "Veniam quis nostrud exercitation ullamco laboris."],
  ],
  niceToHave: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  buildIntro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  prompt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  steps: [
    {
      title: "Scope",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      tips: ["**Tip:** Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    },
    {
      title: "Build",
      body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      tips: ["**Tip:** Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."],
    },
    {
      title: "Evaluate",
      body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      tips: ["**Tip:** Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium."],
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
    "Pick one piece of real work you're doing right now — a project, a plan, an update you owe someone — and turn it into a single page you can open in a browser and share. You'll start with whatever you already have on it: notes, a doc, an email thread. Your AI reads what you give it and builds a clean page that lays out the goal, the key details, and what happens next.",
    "First you'll answer a few questions so it understands what you're building and who it's for. Then it builds the page from your answers, and you run it once on your real material and fix whatever looks off. Plan on about 45 minutes the first time.",
  ],
  setupHeaders: ["You need", "Why", "How to set it up"],
  setupRows: [
    [
      "One real piece of work",
      "The page is only useful when it's about something real",
      "Pick a project, plan, or update you're already working on.",
    ],
    [
      "Whatever notes or material you have on it",
      "The page is built from your own material, not invented",
      "Paste the text, or attach a doc, deck, or spreadsheet.",
    ],
  ],
  niceToHave:
    "Add your team's colors and fonts if you have them, so the page matches your other work. Without them, the page uses a clean default design.",
  buildIntro:
    "Paste this into a new chat in your AI tool. It asks about your role and your work first, then builds, then tests what it built with you.",
  prompt:
    "I want to build a one-page summary of a real piece of my work, as a single web page I can open in a browser and share, for my work. First, ask me what my role is and what I work on. Then walk me through it in three stages: Scope, Build, and Evaluate. Finish each stage before starting the next, and wait for my answer whenever you ask me something.\n\nStage 1: Scope\nAsk me these questions one at a time. If an answer is vague, ask a follow-up before you move on.\n1. What is this page about, and what should it include and in what order?\n2. What will I give you, and where does it live?\n3. Who is this page for, and what should they do after reading it?\n4. What should the page never do or assume?\n5. What would make the output good? Help me turn my answer into three checks I can answer yes or no.\nThen write a short spec with my answers and the three checks. Ask me to confirm it or change it.\n\nStage 2: Build\nOnce I confirm the spec, build the page using only what I give you. Tell me exactly what to paste or attach, one thing at a time, and wait for it. If you're unsure about something, ask me instead of guessing.\n- Output: one complete, self-contained HTML file in a single code block, with the styles inside the file. If my tool can show it as an artifact or canvas, show it there. Otherwise tell me to save the code as a file ending in .html and open it in my browser.\n\nStage 3: Evaluate\nGrade the page you just made against my three checks. Mark each one yes or no and quote the line that proves it. If any check fails, tell me the one change that would fix the most misses, make it, and run it again. When all three pass, give me the instructions as one block I can paste into a new chat or a project, so I can build a page for my next piece of work.",
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
