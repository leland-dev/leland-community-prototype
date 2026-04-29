import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./agents";
import { resolveAgent, type AgentStore } from "./agentStore";

type ChatMessage = { role: "user" | "assistant"; content: string };

type RequestBody = {
  agentSlug?: string;
  messages?: ChatMessage[];
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
    msg.content.length < 8000
  );
}

export async function handleAgentChat(
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
    return jsonError(400, "Too many messages — start a new conversation");
  }
  if (messages[0].role !== "user") {
    return jsonError(400, "First message must be from the user");
  }

  const client = new Anthropic({ apiKey });

  const systemPrompt = buildSystemPrompt(agent);

  const stream = client.messages.stream({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta" &&
            event.delta.text
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream failed";
        controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
        controller.close();
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(readable, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
