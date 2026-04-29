import { promises as fs } from "node:fs";
import path from "node:path";
import type { AgentStore } from "./agentStore";
import type { AgentDef } from "./agents";

type StoreFile = { agents: Record<string, AgentDef> };

/**
 * File-backed agent store for local Vite dev. Reads/writes a single JSON file
 * (default: <repo>/.agents-store.json). Not safe for concurrent writes — fine
 * for a single-user dev box.
 */
export class FileAgentStore implements AgentStore {
  private filePath: string;
  private writeQueue: Promise<unknown> = Promise.resolve();

  constructor(filePath: string) {
    this.filePath = path.resolve(filePath);
  }

  private async readFile(): Promise<StoreFile> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<StoreFile>;
      return { agents: parsed.agents ?? {} };
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return { agents: {} };
      throw err;
    }
  }

  async getAgent(slug: string): Promise<AgentDef | null> {
    const data = await this.readFile();
    return data.agents[slug] ?? null;
  }

  async putAgent(slug: string, def: AgentDef): Promise<void> {
    // Serialize writes to avoid clobbering — chain off the previous write.
    this.writeQueue = this.writeQueue.then(async () => {
      const data = await this.readFile();
      data.agents[slug] = def;
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf8");
    });
    await this.writeQueue;
  }
}
