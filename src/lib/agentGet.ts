import { resolveAgent, type AgentStore } from "./agentStore";

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleAgentGet(request: Request, store: AgentStore): Promise<Response> {
  if (request.method !== "GET") {
    return jsonError(405, "Method not allowed");
  }
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return jsonError(400, "Missing slug query param");
  }
  const agent = await resolveAgent(store, slug);
  if (!agent) {
    return jsonError(404, `Unknown agent: ${slug}`);
  }
  return new Response(JSON.stringify({ agent }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
