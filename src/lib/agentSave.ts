import { resolveAgent, type AgentStore } from "./agentStore";
import type { AgentDef } from "./agents";

type SaveBody = {
  agentSlug?: string;
  updates?: {
    scope?: string;
    playbook?: string[];
    handoffTriggers?: string[];
    greeting?: string;
    starters?: string[];
  };
};

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isStringArray(v: unknown, max: number, perItemMax = 2000): v is string[] {
  return (
    Array.isArray(v) &&
    v.length <= max &&
    v.every((x) => typeof x === "string" && x.length > 0 && x.length <= perItemMax)
  );
}

export async function handleAgentSave(request: Request, store: AgentStore): Promise<Response> {
  if (request.method !== "POST") {
    return jsonError(405, "Method not allowed");
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const { agentSlug, updates } = body;
  if (!agentSlug || typeof agentSlug !== "string") {
    return jsonError(400, "Missing agentSlug");
  }
  if (!updates || typeof updates !== "object") {
    return jsonError(400, "Missing updates");
  }

  const current = await resolveAgent(store, agentSlug);
  if (!current) {
    return jsonError(404, `Unknown agent: ${agentSlug}`);
  }

  const next: AgentDef = { ...current };

  if (updates.scope !== undefined) {
    if (typeof updates.scope !== "string" || updates.scope.length === 0 || updates.scope.length > 4000) {
      return jsonError(400, "scope must be a non-empty string under 4000 chars");
    }
    next.scope = updates.scope;
  }
  if (updates.greeting !== undefined) {
    if (typeof updates.greeting !== "string" || updates.greeting.length === 0 || updates.greeting.length > 2000) {
      return jsonError(400, "greeting must be a non-empty string under 2000 chars");
    }
    next.greeting = updates.greeting;
  }
  if (updates.playbook !== undefined) {
    if (!isStringArray(updates.playbook, 30)) {
      return jsonError(400, "playbook must be an array of up to 30 short strings");
    }
    next.playbook = updates.playbook;
  }
  if (updates.handoffTriggers !== undefined) {
    if (!isStringArray(updates.handoffTriggers, 20)) {
      return jsonError(400, "handoffTriggers must be an array of up to 20 short strings");
    }
    next.handoffTriggers = updates.handoffTriggers;
  }
  if (updates.starters !== undefined) {
    if (!isStringArray(updates.starters, 8, 200)) {
      return jsonError(400, "starters must be an array of up to 8 strings under 200 chars each");
    }
    next.starters = updates.starters;
  }

  await store.putAgent(agentSlug, next);

  return new Response(JSON.stringify({ ok: true, agent: next }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
