import { handleAgentChat } from "../src/lib/agentChat";
import { handleAgentEdit } from "../src/lib/agentEdit";
import { handleAgentSave } from "../src/lib/agentSave";
import { handleAgentGet } from "../src/lib/agentGet";
import { handleClassifyChoice } from "../src/lib/classifyChoice";
import { KVAgentStore, type KVNamespace } from "../src/lib/agentStore";

interface Env {
  ASSETS: Fetcher;
  ANTHROPIC_API_KEY?: string;
  AGENTS_KV?: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const store = new KVAgentStore(env.AGENTS_KV);

    if (url.pathname === "/api/agent") {
      return handleAgentGet(request, store);
    }
    if (url.pathname === "/api/agent-chat") {
      return handleAgentChat(request, env.ANTHROPIC_API_KEY, store);
    }
    if (url.pathname === "/api/agent-edit") {
      return handleAgentEdit(request, env.ANTHROPIC_API_KEY, store);
    }
    if (url.pathname === "/api/agent-save") {
      return handleAgentSave(request, store);
    }
    if (url.pathname === "/api/classify-choice") {
      return handleClassifyChoice(request, env.ANTHROPIC_API_KEY);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
