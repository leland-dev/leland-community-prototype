import { DurableObject } from "cloudflare:workers";

export interface IdeaJarEnv {
  ADMIN_KEY?: string;
}

const SOURCES = ["Customer feedback", "Metric hypothesis", "Team pain point", "Gut instinct"];
const PODS = ["Community / Mobile", "Marketplace", "Solutions", "Growth", "Other"];
const MAX_VOTES = 3;
const MAX_IDEAS_PER_DEVICE = 10;
const RATE_MS = 10_000;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
const err = (msg: string, status: number) => json({ error: msg }, status);

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Single-instance Durable Object holding all ideas + votes in SQLite.
export class IdeaJar extends DurableObject<IdeaJarEnv> {
  sql: any;

  constructor(ctx: any, env: IdeaJarEnv) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY, idea TEXT NOT NULL, why TEXT, source TEXT NOT NULL, pod TEXT,
      author_name TEXT, device_id TEXT NOT NULL, created_at INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS votes (
      key TEXT PRIMARY KEY, idea_id TEXT NOT NULL, device_id TEXT NOT NULL)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)`);
  }

  isLocked(): boolean {
    const rows = this.sql.exec(`SELECT v FROM meta WHERE k='locked'`).toArray();
    return rows.length > 0 && rows[0].v === "1";
  }

  isAdmin(url: URL, body: any): boolean {
    const key = url.searchParams.get("key") || (body && body.key);
    return !!this.env.ADMIN_KEY && key === this.env.ADMIN_KEY;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    let body: any = {};
    if (method === "POST") {
      try {
        body = await request.json();
      } catch {
        body = {};
      }
    }

    try {
      if (path === "/api/ideas" && method === "GET") return this.list(url.searchParams.get("deviceId") || "");
      if (path === "/api/ideas" && method === "POST") return this.create(body);
      if (path === "/api/votes" && method === "POST") return this.vote(body);
      if (path === "/api/unvote" && method === "POST") return this.unvote(body);

      if (path === "/api/ideas/hide" && method === "POST") {
        if (!this.isAdmin(url, body)) return err("Unauthorized", 401);
        if (!body.id) return err("id required", 400);
        this.sql.exec(`UPDATE ideas SET hidden=1 WHERE id=?`, String(body.id));
        return json({ ok: true });
      }
      if (path === "/api/jar/lock" && method === "POST") {
        if (!this.isAdmin(url, body)) return err("Unauthorized", 401);
        const locked = body.locked !== false;
        this.sql.exec(`INSERT OR REPLACE INTO meta (k, v) VALUES ('locked', ?)`, locked ? "1" : "0");
        return json({ ok: true, locked });
      }
      if (path === "/api/jar/reset" && method === "POST") {
        if (!this.isAdmin(url, body)) return err("Unauthorized", 401);
        this.sql.exec(`DELETE FROM ideas`);
        this.sql.exec(`DELETE FROM votes`);
        this.sql.exec(`DELETE FROM meta`);
        return json({ ok: true });
      }
      if (path === "/api/ideas.csv" && method === "GET") {
        if (!this.isAdmin(url, body)) return err("Unauthorized", 401);
        return this.csv();
      }
      return err("Not found", 404);
    } catch (e: any) {
      return err(e?.message || "Server error", 500);
    }
  }

  list(deviceId: string): Response {
    const ideas = this.sql
      .exec(
        `SELECT i.id, i.idea, i.why, i.source, i.pod, i.author_name AS authorName, i.created_at AS createdAt,
           (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) AS votes
         FROM ideas i WHERE i.hidden = 0 ORDER BY votes DESC, i.created_at ASC`,
      )
      .toArray();
    const myVotes = deviceId
      ? this.sql
          .exec(
            `SELECT v.idea_id AS id FROM votes v JOIN ideas i ON i.id = v.idea_id WHERE v.device_id = ? AND i.hidden = 0`,
            deviceId,
          )
          .toArray()
          .map((r: any) => r.id)
      : [];
    return json({ ideas, myVotes, count: ideas.length, locked: this.isLocked() });
  }

  create(b: any): Response {
    if (this.isLocked()) return err("The jar is locked. Submissions are closed.", 423);
    const deviceId = typeof b.deviceId === "string" ? b.deviceId.trim() : "";
    if (!deviceId) return err("deviceId required", 400);
    const idea = typeof b.idea === "string" ? b.idea.trim() : "";
    const why = typeof b.why === "string" ? b.why.trim() : "";
    if (!idea) return err("Idea is required", 400);
    if (idea.length > 140) return err("Idea must be 140 characters or fewer", 400);
    if (why.length > 200) return err("Why must be 200 characters or fewer", 400);
    if (!SOURCES.includes(b.source)) return err("Pick where this came from", 400);
    const pod = b.pod == null || b.pod === "" ? null : b.pod;
    if (pod !== null && !PODS.includes(pod)) return err("Invalid pod", 400);
    const showName = b.showName !== false;
    const rawName = typeof b.authorName === "string" ? b.authorName.trim().slice(0, 60) : "";
    const authorName = showName && rawName ? rawName : null;

    const stats = this.sql
      .exec(`SELECT COUNT(*) AS n, MAX(created_at) AS last FROM ideas WHERE device_id = ?`, deviceId)
      .toArray()[0];
    const now = Date.now();
    if (stats.n >= MAX_IDEAS_PER_DEVICE) return err("You've hit the 10-idea limit. Thanks for all the ideas!", 429);
    if (stats.last && now - stats.last < RATE_MS) {
      const wait = Math.ceil((RATE_MS - (now - stats.last)) / 1000);
      return err(`Slow down! Try again in ${wait}s.`, 429);
    }

    const id = crypto.randomUUID();
    this.sql.exec(
      `INSERT INTO ideas (id, idea, why, source, pod, author_name, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id, idea, why, b.source, pod, authorName, deviceId, now,
    );
    return json({ ok: true, idea: { id, idea, why, source: b.source, pod, authorName, createdAt: now, votes: 0 } }, 201);
  }

  vote(b: any): Response {
    if (this.isLocked()) return err("The jar is locked. Voting is closed.", 423);
    const deviceId = String(b.deviceId || "");
    const ideaId = String(b.ideaId || "");
    if (!deviceId || !ideaId) return err("deviceId and ideaId required", 400);
    const exists = this.sql.exec(`SELECT id FROM ideas WHERE id = ? AND hidden = 0`, ideaId).toArray();
    if (!exists.length) return err("Idea not found", 404);
    const key = `${ideaId}_${deviceId}`;
    if (this.sql.exec(`SELECT key FROM votes WHERE key = ?`, key).toArray().length) return json({ ok: true, already: true });
    // Votes on hidden ideas don't count against the device's 3 (matches myVotes shown to the client).
    const used = this.sql
      .exec(`SELECT COUNT(*) AS n FROM votes v JOIN ideas i ON i.id = v.idea_id WHERE v.device_id = ? AND i.hidden = 0`, deviceId)
      .toArray()[0].n;
    if (used >= MAX_VOTES) return err("You've used all 3 votes. Tap a voted idea to take one back.", 429);
    this.sql.exec(`INSERT INTO votes (key, idea_id, device_id) VALUES (?, ?, ?)`, key, ideaId, deviceId);
    return json({ ok: true });
  }

  unvote(b: any): Response {
    if (this.isLocked()) return err("The jar is locked. Voting is closed.", 423);
    const deviceId = String(b.deviceId || "");
    const ideaId = String(b.ideaId || "");
    if (!deviceId || !ideaId) return err("deviceId and ideaId required", 400);
    this.sql.exec(`DELETE FROM votes WHERE key = ?`, `${ideaId}_${deviceId}`);
    return json({ ok: true });
  }

  csv(): Response {
    const rows = this.sql
      .exec(
        `SELECT i.id, i.idea, i.why, i.source, i.pod, i.author_name, i.created_at, i.hidden,
           (SELECT COUNT(*) FROM votes v WHERE v.idea_id = i.id) AS votes
         FROM ideas i ORDER BY votes DESC, i.created_at ASC`,
      )
      .toArray();
    const header = ["id", "idea", "why", "source", "pod", "author", "created_at", "hidden", "votes"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        [r.id, r.idea, r.why, r.source, r.pod, r.author_name, new Date(r.created_at).toISOString(), r.hidden ? "yes" : "no", r.votes]
          .map(csvCell)
          .join(","),
      );
    }
    return new Response(lines.join("\n") + "\n", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="idea-jar.csv"',
        "Cache-Control": "no-store",
      },
    });
  }
}
