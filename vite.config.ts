import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { handleAgentChat } from "./src/lib/agentChat";
import { handleAgentEdit } from "./src/lib/agentEdit";
import { handleAgentSave } from "./src/lib/agentSave";
import { handleAgentGet } from "./src/lib/agentGet";
import { FileAgentStore } from "./src/lib/fileAgentStore.node";
import type { AgentStore } from "./src/lib/agentStore";

type RouteHandler = (req: Request, apiKey: string | undefined, store: AgentStore) => Promise<Response>;

const ROUTES: Record<string, RouteHandler> = {
  "/api/agent": (req, _apiKey, store) => handleAgentGet(req, store),
  "/api/agent-chat": handleAgentChat,
  "/api/agent-edit": handleAgentEdit,
  "/api/agent-save": (req, _apiKey, store) => handleAgentSave(req, store),
};

function agentApiDevPlugin(apiKey: string | undefined, store: AgentStore): Plugin {
  return {
    name: "agent-api-dev",
    configureServer(server) {
      const middleware: Connect.NextHandleFunction = async (req, res, next) => {
        const path = req.url ? req.url.split("?")[0] : "";
        const handler = ROUTES[path];
        if (!handler) {
          next();
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const body = Buffer.concat(chunks).toString("utf8");
          const protocol = (req.headers["x-forwarded-proto"] as string) || "http";
          const host = req.headers.host || "localhost";
          const fetchRequest = new Request(`${protocol}://${host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: body || undefined,
          });
          const response = await handler(fetchRequest, apiKey, store);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          if (response.body) {
            const reader = response.body.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(Buffer.from(value));
            }
          }
          res.end();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          res.statusCode = 500;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ error: message }));
        }
      };
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.ANTHROPIC_API_KEY;
  const store = new FileAgentStore(".agents-store.json");
  return {
    base: "/",
    plugins: [react(), tailwindcss(), agentApiDevPlugin(apiKey, store)],
    server: { port: 5174 },
  };
});
