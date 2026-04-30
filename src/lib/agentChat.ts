import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./agents";
import { resolveAgent, type AgentStore } from "./agentStore";

type Attachment = {
  name: string;
  /** "application/pdf" is the only binary type currently supported. */
  mediaType: string;
  /** Base64-encoded contents (no data: prefix). */
  data: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
};

type RequestBody = {
  agentSlug?: string;
  messages?: ChatMessage[];
};

const ALLOWED_ATTACHMENT_TYPES = new Set(["application/pdf"]);
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10MB raw → ~13.4MB base64
const MAX_ATTACHMENTS_PER_REQUEST = 5;

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isValidAttachment(a: unknown): a is Attachment {
  if (!a || typeof a !== "object") return false;
  const att = a as Record<string, unknown>;
  if (typeof att.name !== "string" || att.name.length === 0 || att.name.length > 200) return false;
  if (typeof att.mediaType !== "string" || !ALLOWED_ATTACHMENT_TYPES.has(att.mediaType)) return false;
  if (typeof att.data !== "string" || att.data.length === 0) return false;
  // Rough byte estimate from base64 length: bytes ≈ chars * 3/4
  const approxBytes = Math.floor((att.data.length * 3) / 4);
  if (approxBytes > MAX_ATTACHMENT_BYTES) return false;
  return true;
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const msg = m as Record<string, unknown>;
  if (msg.role !== "user" && msg.role !== "assistant") return false;
  if (typeof msg.content !== "string" || msg.content.length === 0 || msg.content.length > 200_000) return false;
  if (msg.attachments !== undefined) {
    if (!Array.isArray(msg.attachments)) return false;
    if (msg.attachments.length > MAX_ATTACHMENTS_PER_REQUEST) return false;
    if (!msg.attachments.every(isValidAttachment)) return false;
    if (msg.role !== "user") return false; // attachments are user-only
  }
  return true;
}

function toAnthropicMessage(msg: ChatMessage): Anthropic.MessageParam {
  if (!msg.attachments || msg.attachments.length === 0) {
    return { role: msg.role, content: msg.content };
  }
  const blocks: Anthropic.ContentBlockParam[] = msg.attachments.map((a) => ({
    type: "document" as const,
    source: {
      type: "base64" as const,
      media_type: "application/pdf",
      data: a.data,
    },
    title: a.name,
  }));
  blocks.push({ type: "text" as const, text: msg.content });
  return { role: msg.role, content: blocks };
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
    messages: messages.map(toAnthropicMessage),
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
