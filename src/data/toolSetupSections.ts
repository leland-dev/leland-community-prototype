import type { BlockSection } from "./lessonBlocks";

const OFFICE_HOURS_BANNER = {
  kind: "banner" as const,
  text: "Having trouble with setup?",
  subtext: "Drop into office hours — we'll get you unblocked",
  href: "https://calendly.com/bootcamps-joinleland/ai-builder-program-office-hours",
  icon: "IconExperiences",
  color: "gray" as const,
};

export const TOOL_SETUP_CLAUDE: BlockSection = {
  id: "tool-setup-claude",
  kind: "blocks",
  title: "Set up Claude",
  track: "claude",
  blocks: [
    {
      kind: "callout",
      tone: "tan",
      title: "A paid plan is required",
      content: [
        {
          kind: "markdown",
          body: "You'll need **Claude Pro, Max, Team, or Enterprise** to access all features used in this program. Claude Pro starts at $20/month — check or upgrade at [claude.ai/upgrade](https://claude.ai/upgrade).",
        },
      ],
    },
    {
      kind: "toggle",
      rows: [
        {
          title: "Mac · Co-Work (Recommended)",
          body: [
            "1. **Download the Claude desktop app** — Go to [claude.ai/download](https://claude.ai/download) and click **Download for Mac**. Open the `.dmg` file, drag Claude into your Applications folder, and launch it.",
            "2. **Sign in** — Click **Sign in** and enter your Anthropic account credentials. No account? Create one at [claude.ai](https://claude.ai).",
            "3. **Verify your plan** — Co-Work requires **Claude Pro, Max, Team, or Enterprise**. Check or upgrade at [claude.ai/upgrade](https://claude.ai/upgrade).",
            "4. **Open Chat and Co-Work** — You'll see both tabs at the top of the app. Click into **Co-Work** and send a test message to confirm it's working.",
            "5. **Use a Chromium browser** — The Claude Chrome extension works in Chrome, Edge, Brave, Opera, or Vivaldi.",
            "6. **Install the Claude Chrome extension** *(optional)* — This lets Claude see and interact with what's open in your browser. Find it in the [Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn), click **Add to Chrome**, pin it, and sign in.",
          ].join("\n"),
        },
        {
          title: "Mac · Terminal",
          body: [
            "1. **Open Terminal** — Press **Cmd + Space**, type **Terminal**, and press Enter.",
            "2. **Install Claude** — Paste this command and press Enter:",
            "   `curl -fsSL https://claude.ai/install.sh | bash`",
            "   Wait until you see **'Installation complete!'** (about 30 seconds).",
            "3. **Verify your plan** — Terminal mode requires **Claude Pro, Max, Team, or Enterprise**. Check or upgrade at [claude.ai/upgrade](https://claude.ai/upgrade).",
            "4. **Sign in** — Type `claude` and press Enter. A browser window will open — sign in with your Anthropic account and return to Terminal. Once you see a `>` prompt, you're ready.",
            "5. **Confirm the install** *(optional)* — Run `claude --version` to see the version number.",
          ].join("\n"),
        },
        {
          title: "Windows · Co-Work (Recommended)",
          body: [
            "1. **Download the Claude desktop app** — Go to [claude.ai/download](https://claude.ai/download) and click **Download for Windows**. Run the installer and follow the prompts.",
            "2. **Sign in** — Click **Sign in** and enter your Anthropic account credentials.",
            "3. **Verify your plan** — Co-Work requires **Claude Pro, Max, Team, or Enterprise**. Check or upgrade at [claude.ai/upgrade](https://claude.ai/upgrade).",
            "4. **Enable Virtual Machine Platform** — Co-Work on Windows requires this. Open the **Start menu**, search **'Turn Windows features on or off'**, check **Virtual Machine Platform**, click **OK**, and restart your computer.",
            "5. **Open Chat and Co-Work** — After restarting, launch Claude. Click into **Co-Work** and send a test message.",
            "6. **Use a Chromium browser** — The extension works in Chrome, Edge, Brave, Opera, or Vivaldi.",
            "7. **Install the Claude Chrome extension** *(optional)* — Find it in the [Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn), click **Add to Chrome**, pin it, and sign in.",
          ].join("\n"),
        },
        {
          title: "Windows · Terminal",
          body: [
            "1. **Open PowerShell** — Press the **Windows key**, search for **PowerShell**, and open it.",
            "2. **Install Claude** — Right-click to paste this command and press Enter:",
            "   `irm https://claude.ai/install.ps1 | iex`",
            "   Wait for the installation to complete.",
            "3. **Add Claude to your PATH** *(if the next step says 'claude not found')* — Run this in the same PowerShell window:",
            "   `[Environment]::SetEnvironmentVariable(\"Path\", $env:Path + \";$env:USERPROFILE\\.local\\bin\", [EnvironmentVariableTarget]::User)`",
            "4. **Close and reopen PowerShell** — This ensures the updated PATH takes effect.",
            "5. **Verify your plan** — Terminal mode requires **Claude Pro, Max, Team, or Enterprise**. Check or upgrade at [claude.ai/upgrade](https://claude.ai/upgrade).",
            "6. **Sign in** — Type `claude` and press Enter. A browser window will open — sign in and return to PowerShell. Once you see a `>` prompt, you're ready.",
          ].join("\n"),
        },
      ],
    },
    {
      kind: "callout",
      tone: "blue",
      title: "Co-Work vs. Terminal — which should I use?",
      content: [
        {
          kind: "markdown",
          body: "**Co-Work** is Claude's collaborative desktop interface — you work alongside Claude in shared windows, which is great for iterating on documents, emails, and code side-by-side.\n\n**Terminal** (also called Claude Code) is Claude's agentic coding environment — you describe a task in plain language and Claude writes, runs, and tests code on your machine. It's the right tool for building and automating things.\n\nWe recommend starting with **Co-Work** — it's the most accessible interface for most program tasks. You can always add Terminal later.",
        },
      ],
    },
    OFFICE_HOURS_BANNER,
  ],
};

export const TOOL_SETUP_CODEX: BlockSection = {
  id: "tool-setup-codex",
  kind: "blocks",
  title: "Set up Codex",
  track: "codex",
  blocks: [
    {
      kind: "callout",
      tone: "tan",
      title: "A paid plan is required",
      content: [
        {
          kind: "markdown",
          body: "You'll need **ChatGPT Plus or Pro** to access Codex. Plus starts at $20/month — check or upgrade at [chatgpt.com](https://chatgpt.com).",
        },
      ],
    },
    {
      kind: "toggle",
      rows: [
        {
          title: "Mac",
          body: [
            "1. **Go to Codex** — Open [chatgpt.com/codex](https://chatgpt.com/codex) in your browser. No installation required.",
            "2. **Sign in** — Sign in with your OpenAI account. No account? Create one at [chatgpt.com](https://chatgpt.com).",
            "3. **Verify your plan** — Codex requires **ChatGPT Plus or Pro**. Upgrade at [chatgpt.com](https://chatgpt.com) if needed.",
            "4. **Start a task** — Describe what you want to build or automate. Codex has built-in web browsing and can read documentation on its own.",
            "5. **Try Atlas** *(optional)* — [chatgpt.com/atlas](https://chatgpt.com/atlas) is OpenAI's purpose-built browser for Codex workflows, with integrated file access.",
          ].join("\n"),
        },
        {
          title: "Windows",
          body: [
            "1. **Go to Codex** — Open [chatgpt.com/codex](https://chatgpt.com/codex) in your browser. No installation required.",
            "2. **Sign in** — Sign in with your OpenAI account. No account? Create one at [chatgpt.com](https://chatgpt.com).",
            "3. **Verify your plan** — Codex requires **ChatGPT Plus or Pro**. Upgrade at [chatgpt.com](https://chatgpt.com) if needed.",
            "4. **Start a task** — Describe what you want to build or automate. Codex has built-in web browsing and can read documentation on its own.",
            "5. **Try Atlas** *(optional)* — [chatgpt.com/atlas](https://chatgpt.com/atlas) is OpenAI's purpose-built browser for Codex workflows, with integrated file access.",
          ].join("\n"),
        },
      ],
    },
    {
      kind: "callout",
      tone: "blue",
      title: "How Codex works",
      content: [
        {
          kind: "markdown",
          body: "Codex is OpenAI's software engineering agent — you describe a task in plain language and it autonomously writes, tests, and iterates on code in a sandboxed environment. Unlike a chat interface, it can run multiple parallel tasks simultaneously and work through multi-step problems on its own.\n\nIt's particularly strong at tasks where you want to describe an outcome (\"build me a script that...\") rather than guide each step interactively.",
        },
      ],
    },
    OFFICE_HOURS_BANNER,
  ],
};

export const TOOL_SETUP_GEMINI: BlockSection = {
  id: "tool-setup-gemini",
  kind: "blocks",
  title: "Set up Gemini",
  track: "gemini",
  blocks: [
    {
      kind: "callout",
      tone: "tan",
      title: "A paid subscription is required",
      content: [
        {
          kind: "markdown",
          body: "You'll need **Google AI Pro** ($19.99/month) to access the advanced Gemini models used in this program. Subscribe at [one.google.com/about/google-ai-plans](https://one.google.com/about/google-ai-plans).",
        },
      ],
    },
    {
      kind: "toggle",
      rows: [
        {
          title: "Mac",
          body: [
            "1. **Go to Gemini** — Open [gemini.google.com](https://gemini.google.com) in your browser.",
            "2. **Sign in** — Sign in with your Google account.",
            "3. **Subscribe to Google AI Pro** — Go to [one.google.com/about/google-ai-plans](https://one.google.com/about/google-ai-plans) and subscribe to **Google AI Pro** ($19.99/month). This unlocks Gemini 2.5 Pro and other advanced models.",
            "4. **Use Chrome** — Download [Chrome](https://www.google.com/chrome) if you haven't already. Google has built native Gemini integrations into Chrome, including a side panel for quick access.",
            "5. **Test your setup** — In Gemini, type: **\"What Gemini model are you currently running on?\"** If you see Gemini 2.5 Pro or similar, you're good to go.",
          ].join("\n"),
        },
        {
          title: "Windows",
          body: [
            "1. **Go to Gemini** — Open [gemini.google.com](https://gemini.google.com) in your browser.",
            "2. **Sign in** — Sign in with your Google account.",
            "3. **Subscribe to Google AI Pro** — Go to [one.google.com/about/google-ai-plans](https://one.google.com/about/google-ai-plans) and subscribe to **Google AI Pro** ($19.99/month). This unlocks Gemini 2.5 Pro and other advanced models.",
            "4. **Use Chrome** — Download [Chrome](https://www.google.com/chrome) if you haven't already. Google has built native Gemini integrations into Chrome, including a side panel for quick access.",
            "5. **Test your setup** — In Gemini, type: **\"What Gemini model are you currently running on?\"** If you see Gemini 2.5 Pro or similar, you're good to go.",
          ].join("\n"),
        },
      ],
    },
    {
      kind: "callout",
      tone: "blue",
      title: "Gemini's strengths for this program",
      content: [
        {
          kind: "markdown",
          body: "Gemini 2.5 Pro has one of the largest context windows of any model — it can read and reason over entire codebases, long documents, and complex data sets in a single pass. It's also tightly integrated with Google Workspace (Docs, Sheets, Drive), which makes it especially useful if your workflow lives in Google's ecosystem.",
        },
      ],
    },
    OFFICE_HOURS_BANNER,
  ],
};

export const TOOL_SETUP_COPILOT: BlockSection = {
  id: "tool-setup-copilot",
  kind: "blocks",
  title: "Set up Copilot",
  track: "copilot",
  blocks: [
    {
      kind: "callout",
      tone: "tan",
      title: "A paid subscription is required",
      content: [
        {
          kind: "markdown",
          body: "You'll need **Copilot Pro** ($20/month) or a **Microsoft 365** plan that includes Copilot. Check your access at [copilot.microsoft.com](https://copilot.microsoft.com).",
        },
      ],
    },
    {
      kind: "toggle",
      rows: [
        {
          title: "Mac",
          body: [
            "1. **Go to Copilot** — Open [copilot.microsoft.com](https://copilot.microsoft.com) in your browser. Copilot is browser-based on Mac — there's no standalone desktop app.",
            "2. **Sign in** — Sign in with your Microsoft account.",
            "3. **Verify your access** — You'll need **Copilot Pro** ($20/month) or **Microsoft 365** with Copilot included. Upgrade at [microsoft.com/copilot](https://www.microsoft.com/en-us/microsoft-copilot) if needed.",
            "4. **Get Edge for sidebar access** — Download [Microsoft Edge](https://www.microsoft.com/en-us/edge) for the best Copilot experience on Mac. Edge has a built-in Copilot sidebar you can open on any webpage without switching apps.",
          ].join("\n"),
        },
        {
          title: "Windows",
          body: [
            "1. **Open Copilot** — Copilot comes pre-installed on Windows 11. Press the **Windows key**, search **Copilot**, and open it. On Windows 10, go to [copilot.microsoft.com](https://copilot.microsoft.com).",
            "2. **Sign in** — Sign in with your Microsoft account.",
            "3. **Verify your access** — You'll need **Copilot Pro** ($20/month) or a **Microsoft 365** subscription that includes Copilot.",
            "4. **Use the Edge sidebar** — Edge is pre-installed on Windows and has a built-in Copilot sidebar. Open any page in Edge and click the Copilot icon in the top-right corner to access it without leaving what you're doing.",
          ].join("\n"),
        },
      ],
    },
    {
      kind: "callout",
      tone: "blue",
      title: "Copilot's strengths for this program",
      content: [
        {
          kind: "markdown",
          body: "Copilot is deeply integrated into the Microsoft ecosystem — Word, Excel, Outlook, Teams, and Edge all have Copilot built in. If your work already runs in Microsoft 365, Copilot can act on your real documents and email without copying anything into a chat window.\n\nThe Edge sidebar integration is particularly useful: you can have Copilot assist you on any webpage or document without switching apps.",
        },
      ],
    },
    OFFICE_HOURS_BANNER,
  ],
};
