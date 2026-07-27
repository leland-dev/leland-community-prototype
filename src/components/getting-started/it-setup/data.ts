// Vendor + connector data for the IT setup flow, ported verbatim from the
// standalone prototype (src/data/getting-started-flows/getting-started-it-setup.html).

export type VendorKey = "claude" | "chatgpt" | "copilot" | "gemini";

export type VendorInfo = {
  name: string;
  short: string;
  appName: string;
  appLink: string;
  signIn: string;
  planName: string;
  planLink: string;
  browserExt: string;
  browserExtLink: string;
  browserExtNote: string;
  connectPath: string;
  // Present only for vendors with a native desktop app + deep-link scheme
  // (Claude, ChatGPT). Absence flips the copy from "install" to "sign in".
  desktopScheme?: string;
  testPrompt?: string;
};

export const VENDOR_INFO: Record<VendorKey, VendorInfo> = {
  claude: {
    name: "Claude (Cowork)",
    short: "Claude",
    appName: "Claude desktop app",
    appLink: "https://claude.ai/download",
    signIn: "Anthropic account",
    planName: "Claude Pro, Max, Team, or Enterprise",
    planLink: "https://claude.ai/upgrade",
    browserExt: "Claude in Chrome extension",
    browserExtLink:
      "https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn",
    browserExtNote:
      "Used in Session 1, Build 2 — optional, you can skip it and hand Claude a screenshot instead",
    connectPath: "Customize → Connectors → search for it → Connect",
    desktopScheme: "claude://claude.ai/new?q=",
    testPrompt:
      "Confirm what model you're running and that Cowork is enabled — I'm testing my Level 1 setup.",
  },
  chatgpt: {
    name: "ChatGPT (Codex)",
    short: "ChatGPT",
    appName: "Codex desktop app",
    appLink: "https://chatgpt.com/codex",
    signIn: "OpenAI account",
    planName: "ChatGPT Plus or Pro",
    planLink: "https://chatgpt.com/upgrade",
    browserExt: "Atlas browser (optional)",
    browserExtLink: "https://chatgpt.com/atlas",
    browserExtNote:
      "Codex also browses the web natively, a separate browser app is optional",
    connectPath: "its Connectors or Integrations settings",
    desktopScheme: "codex://threads/new?prompt=",
    testPrompt:
      "Confirm you're up and running and tell me what model you're on — I'm testing my Level 1 setup.",
  },
  copilot: {
    name: "Microsoft Copilot",
    short: "Copilot",
    appName: "Copilot (browser)",
    appLink: "https://copilot.microsoft.com",
    signIn: "Microsoft account",
    planName: "Copilot Pro or Microsoft 365 with Copilot",
    planLink: "https://microsoft.com/microsoft-copilot/copilot-pro",
    browserExt: "Microsoft Edge",
    browserExtLink: "https://microsoft.com/edge",
    browserExtNote:
      "No native Mac app — Edge adds Copilot in a sidebar next to any page",
    connectPath: "its connected accounts settings",
  },
  gemini: {
    name: "Google Gemini",
    short: "Gemini",
    appName: "Gemini (browser)",
    appLink: "https://gemini.google.com",
    signIn: "Google account",
    planName: "Google AI Pro",
    planLink: "https://one.google.com/about/google-ai-plans",
    browserExt: "Chrome (Gemini built in)",
    browserExtLink: "https://google.com/chrome",
    browserExtNote:
      "Chrome has Gemini integrated natively, no separate extension needed",
    connectPath: "Google Workspace extensions settings",
  },
};

export const COHORT_SLACK_INVITE =
  "https://join.slack.com/t/lelandaibuilders/shared_invite/zt-3y9fgg4a9-qQBHHWe8ZlHYmr9oQ6mp7w";

export type Persona = "personal" | "company";

export type ConnectorKey = "slack" | "email" | "calendar";

export type ConnectorDef = {
  key: ConnectorKey;
  name: string;
  desc: string;
  iconBg?: string;
};

export function connectorDefs(v: VendorInfo): ConnectorDef[] {
  return [
    {
      key: "slack",
      iconBg: "#4A154B",
      name: "Slack connector",
      desc: `Lets ${v.name.split(" ")[0]} read & summarize the AI Builder workspace.`,
    },
    {
      key: "email",
      name: "Email connector",
      desc: "Read & draft on your behalf — Gmail, Outlook, and others all work.",
    },
    {
      key: "calendar",
      name: "Calendar connector",
      desc: "Google Calendar or Microsoft 365 both work.",
    },
  ];
}
