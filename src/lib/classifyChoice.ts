import Anthropic from "@anthropic-ai/sdk";

type ChoiceInput = { ref: string; label: string };

type Body = {
  question: string;
  userText: string;
  choices: ChoiceInput[];
  multi?: boolean;
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Map a free-text user response onto one of a fixed set of typeform-style
 *  choices. Used as a fallback when the local heuristic matcher is uncertain.
 *
 *  Request body: { question, userText, choices, multi? }
 *  Response: { refs: string[] }  (one element for single-select; zero or more
 *  for multi). Empty array means the LLM couldn't classify. */
export async function handleClassifyChoice(
  req: Request,
  apiKey: string | undefined,
): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }
  if (!apiKey) {
    return jsonResponse({ error: "anthropic_key_missing" }, 500);
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  const { question, userText, choices } = body;
  const multi = Boolean(body.multi);
  if (!question || !userText || !choices?.length) {
    return jsonResponse({ error: "missing_fields" }, 400);
  }

  const client = new Anthropic({ apiKey });
  const labels = choices.map((c) => c.label);
  const choicesText = labels.map((l, i) => `${i + 1}. ${l}`).join("\n");

  const prompt = multi
    ? `You map a user's free-text answer onto a list of multiple-choice options for an onboarding chat. The user can pick more than one.

Question: ${question}
User's answer: "${userText}"

Available options:
${choicesText}

Return ONLY a JSON array of the option labels (copied EXACTLY as written above, case-sensitive) that the user clearly means. If none fit, return [].

Examples:
- "AI and consulting" → ["AI Automation & Agents", "Management Consulting"]
- "no idea" → []

Response (JSON array only, no prose):`
    : `You map a user's free-text answer onto a list of single-choice options for an onboarding chat.

Question: ${question}
User's answer: "${userText}"

Available options:
${choicesText}

Return ONLY the single option label (copied EXACTLY as written above, case-sensitive) that best matches the user's intent. If absolutely nothing matches, return the word null.

Examples:
- "working on it right now" with timing options → As soon as possible
- "asdfg" → null

Response (just the label as plain text, or null; no quotes, no JSON):`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content[0];
    const text =
      block && block.type === "text" ? block.text.trim() : "";

    if (multi) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return jsonResponse({ refs: [], raw: text });
      }
      if (!Array.isArray(parsed)) return jsonResponse({ refs: [] });
      const refs: string[] = [];
      for (const item of parsed) {
        if (typeof item === "string") {
          const c = choices.find((x) => x.label === item);
          if (c && !refs.includes(c.ref)) refs.push(c.ref);
        }
      }
      return jsonResponse({ refs });
    }

    // single-select
    const normalized = text.replace(/^"|"$/g, "").trim();
    if (
      normalized === "" ||
      normalized.toLowerCase() === "null" ||
      normalized.toLowerCase() === "none"
    ) {
      return jsonResponse({ refs: [] });
    }
    const choice = choices.find((x) => x.label === normalized);
    if (!choice) {
      // The LLM occasionally returns a close-but-not-exact label. Try a loose
      // case-insensitive match before giving up.
      const loose = choices.find(
        (x) => x.label.toLowerCase() === normalized.toLowerCase(),
      );
      if (loose) return jsonResponse({ refs: [loose.ref] });
      return jsonResponse({ refs: [], raw: text });
    }
    return jsonResponse({ refs: [choice.ref] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "llm_error";
    return jsonResponse({ error: msg }, 500);
  }
}
