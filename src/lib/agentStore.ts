import { AGENTS, type AgentDef } from "./agents";

export interface AgentStore {
  getAgent(slug: string): Promise<AgentDef | null>;
  putAgent(slug: string, def: AgentDef): Promise<void>;
}

/**
 * Resolve an agent: stored override first, otherwise the bundled default.
 * Returns null only if neither exists (i.e. unknown slug).
 */
export async function resolveAgent(store: AgentStore, slug: string): Promise<AgentDef | null> {
  const stored = await store.getAgent(slug);
  if (stored) return stored;
  return AGENTS[slug] ?? null;
}

/**
 * Cloudflare KV implementation. Stores each agent as JSON under key `agent:<slug>`.
 */
export class KVAgentStore implements AgentStore {
  constructor(private kv: KVNamespace | undefined) {}

  async getAgent(slug: string): Promise<AgentDef | null> {
    if (!this.kv) return null;
    const raw = await this.kv.get(`agent:${slug}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AgentDef;
    } catch {
      return null;
    }
  }

  async putAgent(slug: string, def: AgentDef): Promise<void> {
    if (!this.kv) {
      throw new Error("KV binding not configured");
    }
    await this.kv.put(`agent:${slug}`, JSON.stringify(def));
  }
}

/**
 * In-memory fallback for environments with no persistent backend.
 * Useful for tests or as a no-op default.
 */
export class MemoryAgentStore implements AgentStore {
  private map = new Map<string, AgentDef>();

  async getAgent(slug: string): Promise<AgentDef | null> {
    return this.map.get(slug) ?? null;
  }

  async putAgent(slug: string, def: AgentDef): Promise<void> {
    this.map.set(slug, def);
  }
}

// Minimal KV interface so this file doesn't need @cloudflare/workers-types
// (the worker bundle gets the real type via globals at build time).
export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}
