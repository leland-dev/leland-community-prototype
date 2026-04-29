import Anthropic from "@anthropic-ai/sdk";
import { resolveAgent, type AgentStore } from "./agentStore";
import type { AgentDef } from "./agents";

type ChatMessage = { role: "user" | "assistant"; content: string };

type RequestBody = {
  agentSlug?: string;
  messages?: ChatMessage[];
};

export type ProposedUpdate = {
  scope?: string;
  playbook?: string[];
  handoffTriggers?: string[];
  greeting?: string;
  starters?: string[];
  summary: string;
};

export type EditResponse = {
  text: string;
  proposedUpdate: ProposedUpdate | null;
};

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const msg = m as Record<string, unknown>;
  return (
    (msg.role === "user" || msg.role === "assistant") &&
    typeof msg.content === "string" &&
    msg.content.length > 0 &&
    msg.content.length < 200_000
  );
}

function buildEditorSystemPrompt(agent: AgentDef): string {
  const firstName = agent.coachName.split(" ")[0];
  return [
    `You are an editor helping ${agent.coachName} refine their AI agent: "${agent.agentName}".`,
    "",
    `${firstName} is the source of truth for this agent's behavior. Your job is to listen and translate ${firstName}'s intent into structured updates to the agent's curated context — not to invent content.`,
    "",
    "## What you can update",
    "- **scope**: a one-paragraph description of what topics the agent covers.",
    "- **playbook**: an ordered list of specific frameworks, heuristics, and opinions the agent should embody. Each item should be one or two sentences.",
    "- **handoffTriggers**: situations where the agent should recommend a 1:1 instead of trying to coach further.",
    "- **greeting**: the agent's opening message to a new user.",
    "- **starters**: 3-5 short suggested prompts shown as chips on first load.",
    "",
    "## How to work",
    `1. When ${firstName} shares context (a markdown doc, a transcript, a strong opinion), discuss what you heard and where you'd put it. Be specific — quote ${firstName}'s language back when you can.`,
    "2. Ask one focused clarifying question at a time, only when it would meaningfully change the update.",
    "3. When you have enough to make a concrete change, call the `propose_update` tool with the new field values. Include only the fields you're changing.",
    "4. For playbook/handoffTriggers/starters: if you're updating one of these arrays, send the FULL new array (not a delta). The whole list will be replaced.",
    `5. If a doc is uploaded that maps to multiple fields, propose the full set of updates in one call. Use ${firstName}'s exact phrasing where possible — better to keep a strong line verbatim than to paraphrase it into something duller.`,
    "6. Don't propose updates speculatively. Wait until you've heard a clear directive — but uploading a knowledge doc is itself a directive to ingest.",
    "",
    "## Voice",
    "- Direct and concise. You're a working partner, not a chatbot. Two short paragraphs is plenty.",
    "- When you propose, say what changed and why in one or two sentences.",
    "",
    "## Current agent context",
    "Below is the agent's current context — these are the fields you can update.",
    "",
    "```json",
    JSON.stringify(
      {
        scope: agent.scope,
        playbook: agent.playbook,
        handoffTriggers: agent.handoffTriggers,
        greeting: agent.greeting,
        starters: agent.starters,
      },
      null,
      2,
    ),
    "```",
  ].join("\n");
}

const PROPOSE_UPDATE_TOOL: Anthropic.Tool = {
  name: "propose_update",
  description:
    "Propose updates to the agent's coach-curated context. Only call when the coach has expressed a clear directive that maps to one or more of the editable fields. Send the FULL new value for any array field — the existing array will be replaced, not merged.",
  input_schema: {
    type: "object",
    properties: {
      scope: {
        type: "string",
        description: "Replacement scope paragraph. Omit if not changing.",
      },
      playbook: {
        type: "array",
        items: { type: "string" },
        description: "Full replacement playbook list. Omit if not changing.",
      },
      handoffTriggers: {
        type: "array",
        items: { type: "string" },
        description: "Full replacement handoff trigger list. Omit if not changing.",
      },
      greeting: {
        type: "string",
        description: "Replacement greeting. Omit if not changing.",
      },
      starters: {
        type: "array",
        items: { type: "string" },
        description: "Full replacement list of starter prompts (3-5). Omit if not changing.",
      },
      summary: {
        type: "string",
        description: "One or two sentences explaining what changed and why.",
      },
    },
    required: ["summary"],
  },
};

export async function handleAgentEdit(
  request: Request,
  apiKey: string | undefined,
  store: AgentStore,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }
  if (!apiKey) {
    return jsonError(500, "Server is not configured: ANTHROPIC_API_KEY missing");
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const { agentSlug, messages } = body;
  if (!agentSlug || typeof agentSlug !== "string") {
    return jsonError(400, "Missing agentSlug");
  }
  const agent = await resolveAgent(store, agentSlug);
  if (!agent) {
    return jsonError(404, `Unknown agent: ${agentSlug}`);
  }
  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isValidMessage)) {
    return jsonError(400, "messages must be a non-empty array of {role, content}");
  }
  if (messages.length > 40) {
    return jsonError(400, "Too many messages — start a new edit session");
  }
  if (messages[0].role !== "user") {
    return jsonError(400, "First message must be from the coach");
  }

  const client = new Anthropic({ apiKey });

  const result = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: buildEditorSystemPrompt(agent),
    tools: [PROPOSE_UPDATE_TOOL],
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  let text = "";
  let proposedUpdate: ProposedUpdate | null = null;
  for (const block of result.content) {
    if (block.type === "text") {
      text += block.text;
    } else if (block.type === "tool_use" && block.name === "propose_update") {
      proposedUpdate = block.input as ProposedUpdate;
    }
  }

  const response: EditResponse = { text: text.trim(), proposedUpdate };
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
